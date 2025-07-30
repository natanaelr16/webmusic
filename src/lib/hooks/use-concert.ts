'use client'

import { useState, useEffect } from 'react'
import { concertAPI, Concert } from '@/lib/supabase'
import toast from 'react-hot-toast'

export function useConcert(concertId?: string) {
  const [concert, setConcert] = useState<Concert | null>(null)
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConcert = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await concertAPI.getConcert(id)
      setConcert(data)
      return data
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar el concierto'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const fetchConcerts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await concertAPI.getConcerts()
      setConcerts(data)
      return data
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar los conciertos'
      setError(errorMessage)
      toast.error(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }

  const fetchCurrentPrice = async (id: string) => {
    try {
      const price = await concertAPI.getCurrentPrice(id)
      setCurrentPrice(price)
      return price
    } catch (err: any) {
      const errorMessage = err.message || 'Error al obtener el precio actual'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    }
  }

  useEffect(() => {
    if (concertId) {
      fetchConcert(concertId)
      fetchCurrentPrice(concertId)
    }
  }, [concertId])

  return {
    concert,
    concerts,
    currentPrice,
    loading,
    error,
    fetchConcert,
    fetchConcerts,
    fetchCurrentPrice,
    refetch: () => {
      if (concertId) {
        fetchConcert(concertId)
        fetchCurrentPrice(concertId)
      }
    }
  }
}