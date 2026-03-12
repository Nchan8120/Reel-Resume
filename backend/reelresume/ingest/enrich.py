import pandas as pd
from tqdm import tqdm
from reelresume.client.tmdb import TMDBClient
from reelresume.db.cache import init_db, get_cached, set_cached


def enrich_films(films: pd.DataFrame) -> pd.DataFrame:
    init_db()
    client = TMDBClient()
    enriched_rows = []

    for _, row in tqdm(films.iterrows(), total=len(films), desc="Enriching films"):
        title, year = row["title"], row["year"]

        cached = get_cached(title, year)
        if cached:
            enriched_rows.append({**row.to_dict(), **cached})
            continue

        result = client.search_movie(title, year)
        if not result:
            # try without year in case of mismatch
            result = client.search_movie(title)

        if result:
            tmdb_id = result["id"]
            data = client.get_enriched(tmdb_id)
            set_cached(title, year, tmdb_id, data)
            enriched_rows.append({**row.to_dict(), **data})
        else:
            enriched_rows.append(row.to_dict())

    return pd.DataFrame(enriched_rows)