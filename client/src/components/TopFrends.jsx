import React, { useEffect, useState, useRef } from 'react'
import { Cloud, MapPin, Search, Navigation, AlertCircle, PinOff, MapPinOff } from 'lucide-react'

const API_KEY = "dcf9c6fc82f5256224f4579ce6839cbc"

const TopFrends = () => {
  const [weather, setWeather] = useState(null)
  const [coords, setCoords] = useState(null)
  const [searchCity, setSearchCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [locationEnabled, setLocationEnabled] = useState(true)

  // Fetch coordinates on mount
  useEffect(() => {
    getUserLocation()
  }, [])

  // Fetch weather data whenever coordinates change
  useEffect(() => {
    if (coords) {
      fetchWeatherByCoords(coords.lat, coords.lon)
    }
  }, [coords])

  const getUserLocation = () => {
    setLoading(true)
    setErrorMsg('')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationEnabled(true)
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          })
        },
        (error) => {
          console.error(error)
          setLocationEnabled(false)
          setLoading(false)
          // Fallback to a default location (e.g., Kochi/Kasaragod area) or let user search
          setErrorMsg('Location access denied. Please enable location or search for a city.')
        }
      )
    } else {
      setLocationEnabled(false)
      setLoading(false)
      setErrorMsg('Geolocation is not supported by your browser.')
    }
  }

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true)
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      )
      const data = await res.json()
      if (res.ok) {
        setWeather(data)
      } else {
        setErrorMsg(data.message || 'Failed to fetch weather.')
      }
    } catch (err) {
      setErrorMsg('Network error fetching weather data.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = async (e) => {
    e.preventDefault()
    if (!searchCity.trim()) return
    setLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchCity)}&appid=${API_KEY}&units=metric`
      )
      const data = await res.json()
      if (res.ok) {
        setWeather(data)
        setCoords({
          lat: data.coord.lat,
          lon: data.coord.lon
        })
        setSearchCity('')
      } else {
        setErrorMsg(data.message || 'City not found.')
      }
    } catch (err) {
      setErrorMsg('Error searching for city.')
    } finally {
      setLoading(false)
    }
  }

  
  const getMapEmbedUrl = () => {
    if (!coords) return ''
    const delta = 0.01 
    const left = coords.lon - delta
    const bottom = coords.lat - delta
    const right = coords.lon + delta
    const top = coords.lat + delta
    return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${coords.lat}%2C${coords.lon}`
  }

  return (

    <div className="flex w-full min-h-[420px] mt-3 rounded-2xl bg-white shadow-sm border border-slate-200/80 flex-col p-4 gap-3.5">
      
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h1 className="font-semibold flex gap-2 items-center text-sm text-slate-700 py-1 px-3 rounded-full bg-slate-50 border border-slate-200">
          <Cloud className="fill-blue-200 text-blue-400 w-4 h-4" />
          Live Weather
        </h1>
        {weather && (
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-500 fill-emerald-100" />
            {weather.name}, {weather.sys?.country}
          </span>
        )}
      </div>


      <form onSubmit={handleSearchSubmit} className="relative w-full flex gap-1.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Search alternative city..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:bg-white transition-all text-slate-700"
          />
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
        </div>
        <button
          type="submit"
          className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition-all"
        >
          Search
        </button>
      </form>

      <div className="flex-1 flex flex-col justify-between gap-3 min-h-0">
        

        {loading && (
          <div className="flex flex-col items-center justify-center flex-1 py-10 gap-2">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400">Updating metrics...</p>
          </div>
        )}

        {!loading && !locationEnabled && !coords && (
          <div className="flex flex-col items-center justify-center flex-1 p-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <MapPinOff className="w-8 h-8 text-amber-500 mb-2" />
            <h3 className="text-xs font-semibold text-slate-700 mb-1">Location Access Disabled</h3>
            <p className="text-[11px] text-slate-400 max-w-[220px] mb-3">
              We cannot detect your current neighborhood weather automatically. Please authorize device GPS coordinates.
            </p>
            <button
              onClick={getUserLocation}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all"
            >
              <Navigation className="w-3 h-3 fill-indigo-100" />
              Enable Location
            </button>
          </div>
        )}


        {!loading && errorMsg && (
          <div className="p-2 text-center text-[11px] text-rose-500 bg-rose-50 border border-rose-100 rounded-lg">
            {errorMsg}
          </div>
        )}


        {!loading && weather && (
          <div className="grid grid-cols-2 gap-2 bg-gradient-to-br from-slate-50 to-slate-100/50 p-3 rounded-xl border border-slate-200/60 shadow-xs">
            <div className="flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Current Temp</span>
              <div className="text-2xl font-black text-slate-800 tracking-tight">
                {Math.round(weather.main?.temp)}°C
              </div>
              <span className="text-[11px] text-slate-500 capitalize font-medium">
                {weather.weather?.[0]?.description}
              </span>
            </div>

            <div className="flex flex-col justify-center border-l border-slate-200/80 pl-3 gap-1 text-[11px] text-slate-600">
              <div>💧 Humidity: <span className="font-semibold text-slate-800">{weather.main?.humidity}%</span></div>
              <div>💨 Wind: <span className="font-semibold text-slate-800">{weather.wind?.speed} m/s</span></div>
              <div>🌡️ Feels Like: <span className="font-semibold text-slate-800">{Math.round(weather.main?.feels_like)}°C</span></div>
            </div>
          </div>
        )}


        {!loading && coords && (
          <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 shadow-xs group">
            <iframe
              title="Mini Location Map"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src={getMapEmbedUrl()}
              className="grayscale-[20%] opacity-90 group-hover:grayscale-0 transition-all duration-300 pointer-events-none"
            ></iframe>
          </div>
        )}

      </div>
    </div>
  )
}

export default TopFrends