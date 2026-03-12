from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import zipfile
import io
import pandas as pd
import math
from reelresume.ingest.letterboxd import load_export_from_bytes, parse_ratings, parse_diary, build_film_table, parse_profile
from reelresume.ingest.enrich import enrich_films
from reelresume.analysis.stats import (
    rating_distribution,
    rating_summary,
    director_stats,
    runtime_stats,
    genre_stats,
    contrarian_summary,
    watcher_profile,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    contents = await file.read()

    csvs = load_export_from_bytes(contents)
    ratings = parse_ratings(csvs["ratings"])
    diary = parse_diary(csvs["diary"])
    films = build_film_table(ratings, diary)
    enriched = enrich_films(films)
    profile_data = parse_profile(csvs["profile"]) if "profile" in csvs else {}

    # resolve favorite slugs to film details
    favorite_films = []
    if profile_data.get("favorite_slugs"):
        for slug in profile_data["favorite_slugs"]:
            match = enriched[enriched["slug"] == slug]
            if not match.empty:
                film = match.iloc[0]
                favorite_films.append({
                    "title": film["title"],
                    "year": int(film["year"]),
                    "rating": film["rating"],
                    "poster_path": film.get("poster_path"),
                })

    profile_data["favorite_films"] = favorite_films

    return {
        "summary": rating_summary(enriched),
        "rating_distribution": rating_distribution(enriched).to_dict(),
        "genres": genre_stats(enriched).to_dict(orient="records"),
        "directors": director_stats(enriched).head(20).to_dict(orient="records"),
        "runtime": runtime_stats(enriched),
        "contrarian": contrarian_summary(enriched),
        "top_contrarian_higher": ratings_vs_tmdb_records(enriched, top=10, highest=True),
        "top_contrarian_lower": ratings_vs_tmdb_records(enriched, top=10, highest=False),
        "profile": watcher_profile(enriched),
        "top_genres": genre_stats(enriched).head(3).to_dict(orient="records"),
        "user": clean_dict({k: v for k, v in profile_data.items() if k != "favorite_slugs"}),
    }

@app.get("/director-image")
async def director_image(name: str):
    from reelresume.client.tmdb import TMDBClient
    client = TMDBClient()
    url = client.get_person_image(name)
    return {"image_url": url}


def ratings_vs_tmdb_records(enriched, top=10, highest=True):
    from reelresume.analysis.stats import ratings_vs_tmdb
    df = ratings_vs_tmdb(enriched)
    if highest:
        return df.head(top).to_dict(orient="records")
    else:
        return df.tail(top).to_dict(orient="records")
    
def clean_dict(d: dict) -> dict:
    """Replace NaN/inf values with None for JSON serialization."""
    return {
        k: (None if isinstance(v, float) and (math.isnan(v) or math.isinf(v)) else v)
        for k, v in d.items()
    }