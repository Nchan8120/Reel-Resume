import sqlite3
import json
from pathlib import Path

DB_PATH = Path("data/cache/tmdb_cache.db")


def get_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    return sqlite3.connect(DB_PATH)


def init_db():
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS films (
                title TEXT,
                year INTEGER,
                tmdb_id INTEGER,
                data JSON,
                fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (title, year)
            )
        """)


def get_cached(title: str, year: int) -> dict | None:
    with get_connection() as conn:
        row = conn.execute(
            "SELECT data FROM films WHERE title = ? AND year = ?",
            (title, year)
        ).fetchone()
    return json.loads(row[0]) if row else None


def set_cached(title: str, year: int, tmdb_id: int, data: dict):
    with get_connection() as conn:
        conn.execute(
            "INSERT OR REPLACE INTO films (title, year, tmdb_id, data) VALUES (?, ?, ?, ?)",
            (title, year, tmdb_id, json.dumps(data))
        )