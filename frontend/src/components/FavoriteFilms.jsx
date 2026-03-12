export default function FavoriteFilms({ films }) {
  if (!films || films.length === 0) return null

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Favorite Films</p>
      <div className="grid grid-cols-4 gap-4">
        {films.map((film) => (
          <div key={film.title} className="flex flex-col items-center gap-2">
            {film.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w185${film.poster_path}`}
                alt={film.title}
                className="w-full rounded-lg object-cover shadow-lg"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg flex items-center justify-center text-gray-600 text-3xl">
                🎬
              </div>
            )}
            <div className="text-center">
              <p className="text-sm font-medium text-white leading-tight">{film.title}</p>
              <p className="text-xs text-gray-500">{film.year}</p>
              <p className="text-xs text-green-400">{film.rating}★</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}