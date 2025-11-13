
import { useState, useEffect } from 'react'
import { convertSheetsToTimelineFormat } from '../lib/convertSheetsToTimelineFormat'

export function useTimelineData() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/timeline-data')
        const json = await res.json()
        const timelineData = convertSheetsToTimelineFormat(json)
        setData(timelineData)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch timeline data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { data, loading, error }
}