import { useState, useEffect  } from "react"
import axios from "axios"
import SummaryBar from "./components/SummaryBar"
import WatcherProfile from "./components/WatcherProfile"
import TopDirectors from "./components/TopDirectors"
import GenreBreakdown from "./components/GenreBreakdown"
import RatingDistribution from "./components/RatingDistribution"
import RatingsVsTMDB from "./components/RatingsVsTMDB"
import ContrarianSummary from "./components/ContrarianSummary"
import TopDirectorsCard from "./components/TopDirectorsCard"
import TopGenresCard from "./components/TopGenresCard"
import FavoriteFilms from "./components/FavoriteFilms"

const TABS = ["Overview", "Directors & Genres", "Ratings"]

export default function App() {
  const [file, setFile] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [username, setUsername] = useState(null)
  const [activeTab, setActiveTab] = useState("Overview")
  const [directorImages, setDirectorImages] = useState({})
  const [cachedProfiles, setCachedProfiles] = useState([])

  useEffect(() => {
    if (!data) return
    data.directors.slice(0, 3).forEach(async (d) => {
      const res = await axios.get(`https://reel-resume.onrender.com/director-image?name=${encodeURIComponent(d.director)}`)
      if (res.data.image_url) {
        setDirectorImages(prev => ({ ...prev, [d.director]: res.data.image_url }))
      }
    })
  }, [data])


  useEffect(() => {
  axios.get("https://reel-resume.onrender.com/profiles")
    .then(res => setCachedProfiles(res.data.profiles))
    .catch(() => {})
  }, [])

const loadCachedProfile = async (username) => {
  const res = await axios.get(`https://reel-resume.onrender.com/profiles/${username}`)
  setData(res.data)
  setUsername(res.data.user?.username || username)
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await axios.post("https://reel-resume.onrender.com/analyze", formData)
      setData(res.data)
      setUsername(res.data.user?.username || null)
    } catch (err) {
      setError("Something went wrong. Make sure you uploaded a Letterboxd export zip.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {!data ? (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 max-w-md mx-auto p-8">
          <h1 className="text-4xl font-bold tracking-tight">Reel Resume</h1>
          <p className="text-gray-400 text-center">
            Upload your Letterboxd export zip to generate your personal film stats dashboard.
          </p>
          <div className="w-full bg-gray-900 rounded-xl p-5 flex flex-col gap-3 text-sm">
            <p className="text-white font-medium">How to export your Letterboxd data:</p>
            <ol className="flex flex-col gap-2 text-gray-400">
              <li className="flex gap-2"><span className="text-green-400 font-bold">1.</span> Log in to Letterboxd on the desktop website</li>
              <li className="flex gap-2"><span className="text-green-400 font-bold">2.</span> Hover over your proflie in the top middle menu</li>
              <li className="flex gap-2"><span className="text-green-400 font-bold">3.</span> Select <span className="text-white">Settings</span> from the dropdown menu</li>
              <li className="flex gap-2"><span className="text-green-400 font-bold">4.</span> Click <span className="text-white">Data</span> on the top right</li>
              <li className="flex gap-2"><span className="text-green-400 font-bold">5.</span> Click <span className="text-white">Export your data</span> and download the zip file</li>
              <li className="flex gap-2"><span className="text-green-400 font-bold">6.</span> Upload that zip file below</li>
            </ol>
          </div>
          <div className="w-full border-2 border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center gap-4">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-sm text-gray-400"
            />
            {file && <p className="text-sm text-green-400">{file.name}</p>}
          </div>

          {cachedProfiles.length > 0 && (
            <div className="w-full bg-gray-900 rounded-xl p-5 flex flex-col gap-3">
              <p className="text-white font-medium text-sm">Previously analyzed</p>
              <div className="flex flex-col gap-2">
                {cachedProfiles.map((profile) => (
                  <button
                    key={profile}
                    onClick={() => loadCachedProfile(profile)}
                    className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg px-4 py-3 text-sm"
                  >
                    <span className="text-white">@{profile}</span>
                    <span className="text-gray-400">View dashboard →</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? "Analyzing..." : "Generate My Resume"}
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          {/* Top bar */}
          <div className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">Reel Resume</h1>
              {username && (
                <span className="text-gray-400 text-sm">@{username}</span>
              )}
            </div>
            <button
              onClick={() => { setData(null); setFile(null); setUsername(null) }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Upload another
            </button>
          </div>

          {/* Tab navigation */}
          <div className="bg-gray-900 border-b border-gray-800 px-8">
            <div className="flex gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab
                      ? "border-green-400 text-white"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 p-4 max-w-7xl mx-auto w-full">

            {activeTab === "Overview" && (
              <div className="flex flex-col gap-4">
                <SummaryBar summary={data.summary} runtime={data.runtime} username={username} />  
                <FavoriteFilms films={data.user?.favorite_films} />
                <WatcherProfile profile={data.profile} />   
                <div className="grid grid-cols-3 gap-2">    
                  {/* Rating Distribution */}
                  <RatingDistribution distribution={data.rating_distribution} />
                  <TopDirectorsCard directors={data.directors} directorImages={directorImages} />
                  <TopGenresCard genres={data.top_genres} />
                </div>
              </div>
            )}

            {activeTab === "Directors & Genres" && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <TopDirectors directors={data.directors} />
                <GenreBreakdown genres={data.genres} />
              </div>
            )}

            {activeTab === "Ratings" && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <RatingDistribution distribution={data.rating_distribution} />
                  <ContrarianSummary contrarian={data.contrarian} />
                </div>
                <RatingsVsTMDB higher={data.top_contrarian_higher} lower={data.top_contrarian_lower} />
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}