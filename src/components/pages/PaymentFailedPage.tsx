'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { XCircle, RefreshCw, Home, HelpCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import Link from 'next/link'

export function PaymentFailedPage() {
  const [errorReason, setErrorReason] = useState<string>('')

  useEffect(() => {
    // Get error reason from URL params (will be passed by the payment gateway)
    const urlParams = new URLSearchParams(window.location.search)
    const reason = urlParams.get('reason')
    if (reason) {
      setErrorReason(decodeURIComponent(reason))
    }
  }, [])

  const getErrorMessage = (reason: string) => {
    switch (reason.toLowerCase()) {
      case 'declined':
        return 'Tu tarjeta fue rechazada. Verifica los datos o intenta con otra tarjeta.'
      case 'insufficient_funds':
        return 'Fondos insuficientes en tu cuenta. Verifica tu saldo o usa otro método de pago.'
      case 'expired_card':
        return 'Tu tarjeta ha expirado. Usa una tarjeta válida.'
      case 'timeout':
        return 'La transacción tardó demasiado tiempo. Intenta nuevamente.'
      case 'cancelled':
        return 'El pago fue cancelado.'
      default:
        return 'Ocurrió un error durante el procesamiento del pago.'
    }
  }

  const commonSolutions = [
    'Verificar que los datos de la tarjeta sean correctos',
    'Asegurarse de tener fondos suficientes',
    'Intentar con una tarjeta diferente',
    'Verificar que tu banco no haya bloqueado la transacción',
    'Contactar a tu banco si el problema persiste'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="text-center shadow-2xl border-0 bg-white">
            <CardContent className="p-12">
              {/* Error Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', duration: 0.8 }}
                className="mb-8"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-4">
                  <XCircle className="h-12 w-12 text-red-500" />
                </div>
              </motion.div>

              {/* Error Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-8"
              >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Pago No Procesado
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  No se pudo completar tu transacción
                </p>
                
                {errorReason && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">
                          Motivo del Error
                        </h3>
                        <p className="text-red-700">
                          {getErrorMessage(errorReason)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Solutions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mb-8"
              >
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    ¿Qué puedes hacer?
                  </h3>
                  <ul className="text-blue-700 text-sm space-y-2 text-left">
                    {commonSolutions.map((solution, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Important Note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="mb-8"
              >
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    ¡No te preocupes!
                  </h3>
                  <p className="text-yellow-700 text-sm">
                    No se realizó ningún cargo a tu cuenta. Puedes intentar nuevamente 
                    sin riesgo. Las boletas siguen disponibles para compra.
                  </p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/" className="flex-1">
                    <Button size="lg" className="w-full">
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Intentar Nuevamente
                    </Button>
                  </Link>
                  <Link href="/" className="flex-1">
                    <Button variant="secondary" size="lg" className="w-full">
                      <Home className="h-5 w-5 mr-2" />
                      Volver al Inicio
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Support Contact */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-8 pt-6 border-t border-gray-200"
              >
                <p className="text-gray-500 text-sm mb-3">
                  ¿Sigues teniendo problemas?
                </p>
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm">
                    📧 Email:{' '}
                    <a
                      href="mailto:soporte@webmusic.com"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      soporte@webmusic.com
                    </a>
                  </p>
                  <p className="text-gray-600 text-sm">
                    📱 WhatsApp:{' '}
                    <a
                      href="https://wa.me/573001234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      +57 300 123 4567
                    </a>
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    Nuestro equipo de soporte está disponible 24/7 para ayudarte
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}