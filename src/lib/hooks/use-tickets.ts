'use client'

import { useState, useEffect } from 'react'
import { ticketAPI, Ticket } from '@/lib/supabase'
import { useAuth } from '@/lib/providers/auth-provider'
import toast from 'react-hot-toast'

export function useTickets() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTickets = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      const data = await ticketAPI.getUserTickets()
      setTickets(data || [])
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar las boletas'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const validateTicket = async (qrContent: string) => {
    try {
      const result = await ticketAPI.validateTicket(qrContent)
      return result
    } catch (err: any) {
      const errorMessage = err.message || 'Error al validar la boleta'
      throw new Error(errorMessage)
    }
  }

  useEffect(() => {
    if (user) {
      fetchTickets()
    }
  }, [user])

  return {
    tickets,
    loading,
    error,
    fetchTickets,
    validateTicket,
    refetch: fetchTickets
  }
}