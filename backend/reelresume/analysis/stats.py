import pandas as pd


def rating_distribution(films: pd.DataFrame) -> pd.Series:
    """Count of films per rating value (0.5 to 5.0)"""
    all_ratings = pd.Series(
        [x / 2 for x in range(1, 11)],  # 0.5, 1.0, 1.5, ... 5.0
        name="rating"
    )
    counts = films["rating"].value_counts().reindex(all_ratings, fill_value=0)
    counts.index.name = "rating"
    counts.name = "count"
    return counts.sort_index()


def rating_summary(films: pd.DataFrame) -> dict:
    """High level summary stats about your ratings"""
    rated = films.dropna(subset=["rating"])
    return {
        "total_films": len(films),
        "total_rated": len(rated),
        "mean_rating": round(rated["rating"].mean(), 2),
        "median_rating": rated["rating"].median(),
        "most_common_rating": rated["rating"].mode()[0],
    }

def director_stats(films: pd.DataFrame, min_films: int = 2) -> pd.DataFrame:
    """
    Per-director stats. Only includes directors with at least min_films watched.
    Explodes the directors list so multi-director films count for each director.
    """
    # drop films with no director data
    df = films.dropna(subset=["directors"])
    df = df[df["directors"].apply(lambda x: isinstance(x, list) and len(x) > 0)]

    # explode so each director gets their own row
    df = df.explode("directors").rename(columns={"directors": "director"})

    stats = (
        df.groupby("director")
        .agg(
            films_watched=("title", "count"),
            avg_rating=("rating", "mean"),
            ratings=("rating", list),
        )
        .reset_index()
    )

    stats["avg_rating"] = stats["avg_rating"].round(2)
    stats = stats[stats["films_watched"] >= min_films]
    stats = stats.sort_values("films_watched", ascending=False)

    return stats.reset_index(drop=True)

def runtime_stats(films: pd.DataFrame) -> dict:
    """Total and average runtime stats across all watched films."""
    df = films.dropna(subset=["runtime"])
    df = df[df["runtime"] > 0]

    total_minutes = df["runtime"].sum()
    total_hours = total_minutes / 60
    total_days = total_hours / 24

    return {
        "films_with_runtime": len(df),
        "total_minutes": int(total_minutes),
        "total_hours": round(total_hours, 1),
        "total_days": round(total_days, 1),
        "avg_runtime_minutes": round(df["runtime"].mean(), 1),
        "longest_film": df.loc[df["runtime"].idxmax(), "title"],
        "longest_film_runtime": int(df["runtime"].max()),
        "shortest_film": df.loc[df["runtime"].idxmin(), "title"],
        "shortest_film_runtime": int(df["runtime"].min()),
    }

def genre_stats(films: pd.DataFrame, min_films: int = 3) -> pd.DataFrame:
    """
    Per-genre stats. Explodes the genres list so multi-genre films count for each genre.
    """
    df = films.dropna(subset=["genres"])
    df = df[df["genres"].apply(lambda x: isinstance(x, list) and len(x) > 0)]

    df = df.explode("genres").rename(columns={"genres": "genre"})

    stats = (
        df.groupby("genre")
        .agg(
            films_watched=("title", "count"),
            avg_rating=("rating", "mean"),
        )
        .reset_index()
    )

    stats["avg_rating"] = stats["avg_rating"].round(2)
    stats = stats[stats["films_watched"] >= min_films]
    stats = stats.sort_values("films_watched", ascending=False)

    return stats.reset_index(drop=True)

def ratings_vs_tmdb(films: pd.DataFrame) -> pd.DataFrame:
    """Compare your ratings against TMDB average ratings."""
    df = films.dropna(subset=["rating", "tmdb_rating"])
    df = df[df["tmdb_rating"] > 1.0]  # filter out bad matches
    df = df.copy()

    # TMDB ratings are out of 10, normalize to 5
    df["tmdb_rating_normalized"] = (df["tmdb_rating"] / 10 * 5).round(2)
    df["difference"] = (df["rating"] - df["tmdb_rating_normalized"]).round(2)

    return df[["title", "year", "rating", "tmdb_rating_normalized", "difference"]].sort_values(
        "difference", ascending=False
    ).reset_index(drop=True)


def contrarian_summary(films: pd.DataFrame) -> dict:
    """High level summary of how your ratings differ from TMDB average."""
    df = ratings_vs_tmdb(films)

    overrated = df[df["difference"] < -0.5]  # you rate lower than TMDB
    underrated = df[df["difference"] > 0.5]  # you rate higher than TMDB

    return {
        "avg_difference": round(df["difference"].mean(), 3),
        "films_you_rate_higher": len(underrated),
        "films_you_rate_lower": len(overrated),
        "most_overrated_by_you": df.iloc[-1][["title", "rating", "tmdb_rating_normalized", "difference"]].to_dict(),
        "most_underrated_by_you": df.iloc[0][["title", "rating", "tmdb_rating_normalized", "difference"]].to_dict(),
    }

def watcher_profile(films: pd.DataFrame) -> dict:
    """Assign the user to a watcher archetype based on their stats."""
    rated = films.dropna(subset=["rating"])
    avg = rated["rating"].mean()

    # genre affinity
    genre_df = films.dropna(subset=["genres"])
    genre_df = genre_df[genre_df["genres"].apply(lambda x: isinstance(x, list) and len(x) > 0)]
    genre_counts = genre_df.explode("genres").groupby("genres")["genres"].count()
    top_genre = genre_counts.idxmax() if not genre_counts.empty else "Action"

    # volume
    total = len(films)

    # rewatch rate
    rewatch_rate = films["rewatch"].sum() / total if total > 0 else 0

    # contrarian score
    df = films.dropna(subset=["rating", "tmdb_rating"])
    df = df[df["tmdb_rating"] > 1.0].copy()
    df["tmdb_normalized"] = df["tmdb_rating"] / 10 * 5
    df["diff"] = df["rating"] - df["tmdb_normalized"]
    avg_diff = df["diff"].mean() if not df.empty else 0

    # determine archetype
    if avg_diff > 0.3 and avg > 3.8:
        archetype = "The Enthusiast"
        description = "You love film and it shows. You rate generously, diverge from the crowd on the high side, and clearly watch with passion rather than cynicism."
        emoji = "🎬"
    elif avg_diff < -0.3 and avg < 3.5:
        archetype = "The Critic"
        description = "You hold film to a high standard. You're consistently harsher than consensus and don't hand out stars easily — every rating means something."
        emoji = "🧐"
    elif rewatch_rate > 0.15:
        archetype = "The Loyalist"
        description = "You rewatch more than most. When you find something you love, you return to it — film isn't just entertainment, it's comfort."
        emoji = "🔁"
    elif total > 300 and top_genre in ["Action", "Adventure", "Science Fiction"]:
        archetype = "The Blockbuster Devotee"
        description = "You've seen a lot of films and lean toward big, kinetic cinema. You know what you like and you watch a lot of it."
        emoji = "💥"
    elif top_genre in ["Drama", "Crime", "Thriller"] and avg > 3.7:
        archetype = "The Prestige Watcher"
        description = "You gravitate toward serious, well-crafted cinema. Your highest rated films tend to be the ones critics love too — thoughtful, weighty, and memorable."
        emoji = "🏆"
    elif top_genre in ["Animation"] and avg > 3.5:
        archetype = "The Animation Aficionado"
        description = "You take animation seriously as an art form, not just a genre for kids. Your taste runs deep and you rate it just as critically as live action."
        emoji = "✏️"
    elif abs(avg_diff) < 0.1:
        archetype = "The Consensus Builder"
        description = "Your ratings align remarkably well with global consensus. You're a reliable barometer of quality — if you liked it, most people probably did too."
        emoji = "⚖️"
    else:
        archetype = "The Eclectic"
        description = "Your watch history defies easy categorization. You roam freely across genres, eras, and styles — driven by curiosity more than habit."
        emoji = "🌍"

    return {
        "archetype": archetype,
        "description": description,
        "emoji": emoji,
        "top_genre": top_genre,
        "avg_rating": round(avg, 2),
        "rewatch_rate": round(rewatch_rate * 100, 1),
        "avg_diff": round(avg_diff, 3),
    }