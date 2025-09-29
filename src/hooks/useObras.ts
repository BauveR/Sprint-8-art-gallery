import { useState, useEffect } from 'react'
import type { ObraArte } from '../types/ObraArte'
import { obrasAPI } from '../services/api'

/**
 * Lista básica de obras (GET /obras) con refetch
 */
export const useObras = () => {
  const [obras, setObras] = useState<ObraArte[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await obrasAPI.getAll()
      setObras(Array.isArray(res.data) ? res.data : [])
    } catch (e) {
      console.error(e)
      setError('Error cargando obras')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  return { obras, loading, error, refetch, setObras }
}

/**
 * Lista de obras con ubicación actual (GET /obras/ubicacion) con refetch
 */
export const useObrasConUbicacion = () => {
  const [obras, setObras] = useState<ObraArte[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await obrasAPI.getWithLocation()
      setObras(Array.isArray(res.data) ? res.data : [])
    } catch (e) {
      console.error(e)
      setError('Error cargando obras')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  return { obras, loading, error, refetch, setObras }
}
