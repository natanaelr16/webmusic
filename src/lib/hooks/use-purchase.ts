'use client'

import { useState } from 'react'
import { purchaseAPI } from '@/lib/supabase'
import toast from 'react-hot-toast'

// ===================================================================
// HOOK DE COMPRA - MANEJO DE EDGE FUNCTION 'iniciar-compra'
// ===================================================================
// Este hook maneja todo el flujo de compra y redirección a la pasarela de pagos

export function usePurchase() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    /**
     * Función principal que inicia el proceso de compra
     * 
     * FLUJO COMPLETO:
     * 1. Validación frontend
     * 2. Llamada a Edge Function 'iniciar-compra'
     * 3. Recepción del payment_link
     * 4. Redirección automática a la pasarela de pagos
     * 
     * @param email - Email del usuario
     * @param quantity - Cantidad de boletas (1-3)
     * @param concertId - UUID del concierto
     * @returns Promise con la respuesta del backend
     */
    const initiatePurchase = async (email: string, quantity: number, concertId: string) => {
        try {
            setLoading(true)
            setError(null)

            console.log('🔄 Iniciando proceso de compra...')

            // Validación frontend (doble verificación)
            if (!email || !email.includes('@')) {
                throw new Error('Por favor ingresa un email válido')
            }

            if (quantity < 1 || quantity > 3) {
                throw new Error('La cantidad debe ser entre 1 y 3 boletas')
            }

            console.log('✅ Validaciones frontend pasadas')

            // LLAMADA CRÍTICA: Edge Function 'iniciar-compra'
            // Esta función YA ESTÁ IMPLEMENTADA según la documentación
            console.log('📡 Llamando a Edge Function iniciar-compra...')

            const response = await purchaseAPI.initiatePurchase(email, quantity, concertId)

            console.log('📥 Respuesta recibida del backend:', response)

            // Verificar que recibimos el payment_link
            if (response && response.payment_link) {
                console.log('🎯 Payment link recibido:', response.payment_link)

                // Mostrar mensaje de éxito antes de la redirección
                toast.success('Redirigiendo al pago...', { duration: 2000 })

                // REDIRECCIÓN AUTOMÁTICA a la pasarela de pagos
                // Por ahora será un link simulado hasta que lleguen las claves de producción
                console.log('🚀 Redirigiendo a la pasarela de pagos...')

                // Pequeña pausa para que el usuario vea el mensaje de éxito
                setTimeout(() => {
                    window.location.href = response.payment_link
                }, 1500)

            } else {
                console.error('❌ Backend no devolvió payment_link:', response)
                throw new Error('Error al generar el link de pago')
            }

            return response

        } catch (err: any) {
            console.error('❌ Error en initiatePurchase:', err)

            const errorMessage = err.message || 'Error al procesar la compra'
            setError(errorMessage)

            // Mostrar error al usuario
            toast.error(errorMessage)

            // Re-lanzar el error para que el componente pueda manejarlo
            throw err

        } finally {
            setLoading(false)
            console.log('🔄 Proceso de compra finalizado')
        }
    }

    return {
        initiatePurchase,
        loading,
        error,
    }
}