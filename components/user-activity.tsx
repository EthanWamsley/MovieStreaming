"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, History } from "lucide-react"

interface UserActivityProps {
  movieId: string
}

interface SearchHistoryItem {
  query: string
  timestamp: string
}

export function UserActivity({ movieId }: UserActivityProps) {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [lastVisited, setLastVisited] = useState<string | null>(null)

  useEffect(() => {
    // Load search history from localStorage
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]")
    setSearchHistory(history)

    // Load last visited from localStorage
    const visited = JSON.parse(localStorage.getItem("visitedMovies") || "{}")
    setLastVisited(visited[movieId] || null)

    // Update last visited time
    const now = new Date().toISOString()
    const updatedVisited = { ...visited, [movieId]: now }
    localStorage.setItem("visitedMovies", JSON.stringify(updatedVisited))
  }, [movieId])

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Your Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lastVisited ? (
            <div className="text-sm text-gray-300">
              <p>Last visited: {formatTimeAgo(lastVisited)}</p>
            </div>
          ) : (
            <div className="text-sm text-gray-300">
              <p>First time viewing this movie</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Searches
          </CardTitle>
        </CardHeader>
        <CardContent>
          {searchHistory.length > 0 ? (
            <ul className="space-y-2">
              {searchHistory.slice(0, 5).map((item, index) => (
                <li key={index} className="text-sm text-gray-300">
                  <span className="font-medium">{item.query}</span>
                  <span className="text-gray-500 text-xs ml-2">{formatTimeAgo(item.timestamp)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No recent searches</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const date = new Date(timestamp)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return `${seconds} seconds ago`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`

  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`

  const years = Math.floor(months / 12)
  return `${years} year${years !== 1 ? "s" : ""} ago`
}

