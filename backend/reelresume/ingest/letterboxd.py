# reelresume/ingest/letterboxd.py

import zipfile
import io
import pandas as pd
from pathlib import Path
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)


def load_export(path: str) -> dict[str, pd.DataFrame]:
    """
    Accept either a zip file or a folder path.
    Returns a dict of DataFrames keyed by CSV name.
    """
    path = Path(path)
    csvs = {}

    if path.is_dir():
        for csv_file in path.glob("*.csv"):
            csvs[csv_file.stem] = pd.read_csv(csv_file)
    elif path.suffix == ".zip":
        with zipfile.ZipFile(path) as z:
            for name in z.namelist():
                if name.endswith(".csv"):
                    stem = Path(name).stem
                    csvs[stem] = pd.read_csv(z.open(name))
    else:
        raise ValueError("Path must be a folder or .zip file")

    return csvs


def parse_ratings(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = df.columns.str.lower().str.replace(" ", "_")
    df = df.rename(columns={"letterboxd_uri": "uri", "name": "title"})
    df["rating_date"] = pd.to_datetime(df["date"])
    df = df.drop(columns=["date"])
    df["rating"] = pd.to_numeric(df["rating"], errors="coerce")
    df["slug"] = df["uri"].str.extract(r"boxd\.it/(.+)$")
    return df


def parse_diary(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = df.columns.str.lower().str.replace(" ", "_")
    df = df.rename(columns={"letterboxd_uri": "uri", "name": "title"})
    df["watched_date"] = pd.to_datetime(df["watched_date"])
    df["rating"] = pd.to_numeric(df["rating"], errors="coerce")
    df["rewatch"] = df["rewatch"].fillna("").str.strip().str.lower() == "yes"
    df["slug"] = df["uri"].str.extract(r"boxd\.it/(.+)$")
    return df


def build_film_table(ratings: pd.DataFrame, diary: pd.DataFrame) -> pd.DataFrame:
    """
    Merge ratings and diary into a single deduplicated film table.
    For films in both, prefer diary's watched_date and rewatch flag.
    """
    # get the most recent diary entry per film (in case of rewatches)
    diary_deduped = (
        diary.sort_values("watched_date")
        .groupby(["title", "year"])
        .last()
        .reset_index()[["title", "year", "watched_date", "rewatch", "tags"]]
    )

    merged = ratings.merge(diary_deduped, on=["title", "year"], how="left")

    # use watched_date if available, otherwise fall back to rating_date
    merged["watch_date"] = merged["watched_date"].fillna(merged["rating_date"])
    merged = merged.drop(columns=["watched_date", "rating_date"])
    merged = merged.drop(columns=["uri", "tags"], errors="ignore")
    merged["rewatch"] = merged["rewatch"].fillna(False).infer_objects(copy=False).astype(bool)

    return merged

def load_export_from_bytes(data: bytes) -> dict[str, pd.DataFrame]:
    """Load CSVs from a zip file uploaded as bytes."""
    csvs = {}
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        for name in z.namelist():
            if name.endswith(".csv"):
                stem = Path(name).stem
                csvs[stem] = pd.read_csv(z.open(name))
    return csvs

def parse_profile(df: pd.DataFrame) -> dict:
    """Extract basic profile info from profile.csv"""
    row = df.iloc[0]
    # parse favorite films from URIs
    fav_raw = row.get("Favorite Films", "")
    fav_slugs = []
    if isinstance(fav_raw, str):
        fav_slugs = [url.strip().split("boxd.it/")[-1] for url in fav_raw.split(",") if "boxd.it" in url]

    return {
        "username": row.get("Username", None),
        "member_since": row.get("Member Since", None),
        "location": row.get("Location", None),
        "website": row.get("Website", None),
        "favorite_slugs": fav_slugs,
    }