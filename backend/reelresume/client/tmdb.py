import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "https://api.themoviedb.org/3"
API_KEY = os.getenv("TMDB_API_KEY")


class TMDBClient:
    def __init__(self):
        if not API_KEY:
            raise ValueError("TMDB_API_KEY not found in environment")
        self.session = requests.Session()
        self.session.params = {"api_key": API_KEY}

    def _get(self, endpoint: str, params: dict = None) -> dict:
        url = f"{BASE_URL}/{endpoint}"
        response = self.session.get(url, params=params)
        response.raise_for_status()
        time.sleep(0.1)  # stay well within rate limits
        return response.json()

    def search_movie(self, title: str, year: int = None) -> dict | None:
        params = {"query": title, "language": "en-US"}
        if year:
            params["year"] = year
        data = self._get("search/movie", params=params)
        results = data.get("results", [])
        return results[0] if results else None

    def get_movie_details(self, tmdb_id: int) -> dict:
        return self._get(
            f"movie/{tmdb_id}",
            params={"append_to_response": "credits"}
        )
    
    def get_person_image(self, name: str) -> str | None:
        """Search for a person and return their profile image path."""
        data = self._get("search/person", params={"query": name})
        results = data.get("results", [])
        if not results:
            return None
        
        # try to find exact name match first
        name_lower = name.lower()
        for result in results:
            if result.get("name", "").lower() == name_lower and result.get("profile_path"):
                return f"https://image.tmdb.org/t/p/w185{result['profile_path']}"
        
        # fall back to first result with an image
        for result in results:
            if result.get("profile_path"):
                return f"https://image.tmdb.org/t/p/w185{result['profile_path']}"
        
        return None
    
    def get_enriched(self, tmdb_id: int) -> dict:
        details = self.get_movie_details(tmdb_id)
        
        # extract director(s)
        crew = details.get("credits", {}).get("crew", [])
        directors = [p["name"] for p in crew if p["job"] == "Director"]
        
        # extract top 5 cast
        cast = details.get("credits", {}).get("cast", [])
        top_cast = [p["name"] for p in cast[:5]]

        return {
            "tmdb_id": details.get("id"),
            "genres": [g["name"] for g in details.get("genres", [])],
            "runtime": details.get("runtime"),
            "origin_country": details.get("origin_country", []),
            "original_language": details.get("original_language"),
            "directors": directors,
            "cast": top_cast,
            "tmdb_rating": details.get("vote_average"),
            "overview": details.get("overview"),
            "poster_path": details.get("poster_path"),
        }
    
