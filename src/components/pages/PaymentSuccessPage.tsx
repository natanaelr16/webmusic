'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Mail, Ticket, Home, LogIn, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import Link from 'next/link'
import { useAuth } from '@/lib/providers/auth-provider'

export function PaymentSuccessPage() {
  const { user } = useAuth()
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    // Get email from URL params (will be passed by the payment gateway)
    const urlParams = new URLSearchParams(window.location.search)
    const emailParam = urlParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="text-center shadow-2xl border-0 bg-white">
            <CardContent className="p-12">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', duration: 0.8 }}
                className="mb-8"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-8"
              >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  ¡Pago Exitoso!
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  Tu compra se ha procesado correctamente
                </p>
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                  <h2 className="text-lg font-semibold text-green-800 mb-2">
                    ¿Qué sigue ahora?
                  </h2>
                  <div className="text-green-700 space-y-3 text-left">
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Revisa tu email</p>
                        <p className="text-sm">
                          Recibirás tus boletas digitales en tu correo electrónico en los próximos minutos.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Ticket className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Accede a tu cuenta</p>
                        <p className="text-sm">
                          También puedes ver tus boletas en línea iniciando sesión en tu cuenta.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Important Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mb-8"
              >
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">
                    Información Importante
                  </h3>
                  <div className="text-blue-700 text-sm space-y-2 text-left">
                    <p>• Tus boletas incluyen un código QR único para verificación en el evento</p>
                    <p>• Guarda el email con tus boletas o descárgalas desde tu cuenta</p>
                    <p>• Presenta tu boleta digital o impresa el día del evento</p>
                    <p>• Si tienes problemas, contacta a nuestro soporte</p>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="space-y-4"
              >
                {user ? (
                  <div className="space-y-3">
                    <Link href="/mis-boletas" className="block">
                      <Button size="lg" className="w-full">
                        <Ticket className="h-5 w-5 mr-2" />
                        Ver Mis Boletas
                      </Button>
                    </Link>
                    <Link href="/" className="block">
                      <Button variant="secondary" size="lg" className="w-full">
                        <Home className="h-5 w-5 mr-2" />
                        Volver al Inicio
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link href="/login" className="block">
                      <Button size="lg" className="w-full">
                        <LogIn className="h-5 w-5 mr-2" />
                        Iniciar Sesión para Ver Boletas
                      </Button>
                    </Link>
                    <Link href="/" className="block">
                      <Button variant="secondary" size="lg" className="w-full">
                        <Home className="h-5 w-5 mr-2" />
                        Volver al Inicio
                      </Button>
                    </Link>
                  </div>
                )}
              </motion.div>

              {/* Support Contact */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-8 pt-6 border-t border-gray-200"
              >
                <p className="text-gray-500 text-sm">
                  ¿Necesitas ayuda?{' '}
                  <a
                    href="mailto:soporte@webmusic.com"
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Contacta nuestro soporte
                  </a>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}