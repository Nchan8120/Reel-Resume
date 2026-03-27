# Reel Resume

A personal film stats dashboard built on top of your Letterboxd export data.
Upload your Letterboxd data export and get a visual breakdown of your watch
history, taste profile, and how your ratings compare to global consensus.

## Features

- **Watcher Archetype** — get assigned a profile based on your watch habits
- **Summary Stats** — total films, hours watched, average rating, and more
- **Favorite Films** — your 4 Letterboxd favorites displayed with posters
- **Top Directors** — most watched directors with profile photos and avg ratings
- **Genre Breakdown** — what you watch most vs what you actually rate highest
- **Rating Distribution** — visualize your rating habits across all films
- **You vs. The Crowd** — where your taste diverges most from TMDB consensus
- **Contrarian Profile** — are you a generous rater, harsh critic, or well-calibrated?

<img width="2544" height="1265" alt="image" src="https://github.com/user-attachments/assets/53a31927-d178-4c3b-a1fe-6802a3571399" />


## How It Works

Letterboxd doesn't grant API access for data visualization projects, so Reel
Resume works entirely from your personal data export. All TMDB enrichment
(genres, runtime, directors, cast, posters) is fetched via the TMDB API and
cached locally in SQLite.

## Tech Stack

**Backend** — Python, FastAPI, pandas, SQLite  
**Frontend** — React, Vite, Tailwind CSS, Recharts  
**Data** — Letterboxd CSV export, TMDB API

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- TMDB API key (free at [themoviedb.org](https://www.themoviedb.org/settings/api))

### Backend
```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:
```
TMDB_API_KEY=your_key_here
```

Start the server:
```bash
python -m uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Exporting Your Letterboxd Data

1. Log in to Letterboxd on desktop
2. Hover over your profile and select **Settings**
3. Click **Data** in the top navigation
4. Click **Export your data** and download the zip file
5. Upload the zip file to Reel Resume

### Known Limitations
- TV shows and anime may have incorrect TMDB matches
- Diary data only goes back to when you started using the diary feature
- Ratings vs TMDB comparisons exclude films with ambiguous matches

### Roadmap
- Country/language breakdown map
- Watch activity over time chart
- Decade breakdown
- Improved TMDB matching

## Attribution

This project uses TMDB and the TMDB APIs but is not endorsed, certified, or
otherwise approved by TMDB.

## License

MIT
