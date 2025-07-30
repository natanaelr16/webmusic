'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { PurchaseForm } from '@/components/forms/PurchaseForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { FadeIn } from '@/components/layout/FadeIn'
import { SlideIn } from '@/components/layout/SlideIn'
import { StaggerContainer, StaggerItem } from '@/components/layout/StaggerContainer'
import { formatPrice, formatDate } from '@/lib/utils'
import { Calendar, MapPin, Clock, Users, Star, Music2, Ticket } from 'lucide-react'

// Datos del concierto - Pendiente de definir por el cliente
const MOCK_CONCERT = {
  id: '1',
  nombre: 'WebMusic Concert 2025',
  artista: 'Por definir',
  fecha: '2025-12-31T20:00:00-05:00', // Fecha temporal
  lugar: 'Por definir',
  descripcion: 'Los detalles del evento serán anunciados próximamente. Mantente atento a nuestras redes sociales para conocer toda la información sobre este increíble evento musical.',
  precio_preventa: 45000,
  precio_general: 65000,
  fecha_fin_preventa: '2025-11-30T23:59:59-05:00',
  capacidad: 0, // Por definir
  boletas_vendidas: 0,
  imagen: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&q=80', // Imagen más genérica de concierto
  generos: ['Por definir'],
  duracion: 'Por definir',
  edades: 'Por definir'
}

const LandingPage = () => {
  const [currentPrice, setCurrentPrice] = useState(MOCK_CONCERT.precio_general)
  const [isPresale, setIsPresale] = useState(false)
  const [timeLeft, setTimeLeft] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Calcular si estamos en preventa
    const now = new Date()
    const presaleEnd = new Date(MOCK_CONCERT.fecha_fin_preventa)
    const isCurrentlyPresale = now < presaleEnd

    setIsPresale(isCurrentlyPresale)
    setCurrentPrice(isCurrentlyPresale ? MOCK_CONCERT.precio_preventa : MOCK_CONCERT.precio_general)

    // Calcular tiempo restante para la preventa
    if (isCurrentlyPresale) {
      const updateTimer = () => {
        const now = new Date()
        const timeUntilEnd = presaleEnd.getTime() - now.getTime()

        if (timeUntilEnd > 0) {
          const days = Math.floor(timeUntilEnd / (1000 * 60 * 60 * 24))
          const hours = Math.floor((timeUntilEnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((timeUntilEnd % (1000 * 60 * 60)) / (1000 * 60))

          setTimeLeft(`${days}d ${hours}h ${minutes}m`)
        } else {
          setTimeLeft('')
          setIsPresale(false)
          setCurrentPrice(MOCK_CONCERT.precio_general)
        }
      }

      // Ejecutar inmediatamente y luego cada minuto
      updateTimer()
      const interval = setInterval(updateTimer, 60000)

      return () => clearInterval(interval)
    }
  }, [])

  const soldPercentage = (MOCK_CONCERT.boletas_vendidas / MOCK_CONCERT.capacidad) * 100

  // Evitar problemas de hidratación
  if (!mounted) {
    return (
      <Layout className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-20 bg-white/10 rounded-lg mb-8"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-white/10 rounded-lg"></div>
              <div className="h-64 bg-white/10 rounded-lg"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-white/10 rounded-lg"></div>
              <div className="h-96 bg-white/10 rounded-lg"></div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
        <div className="text-center text-white mb-12">
          <FadeIn delay={0.4} duration={1.2}>
            <div className="flex items-center justify-center mb-6">
              <Music2 className="h-16 w-16 text-blue-400 mr-4" />
              <div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {MOCK_CONCERT.nombre}
                </h1>
                <p className="text-2xl md:text-3xl font-semibold text-white/70 mt-2 italic">
                  {MOCK_CONCERT.artista}
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Banner de información pendiente */}
          <FadeIn delay={0.8} duration={1.0}>
            <div className="inline-flex items-center space-x-4 mb-6">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 rounded-full text-white font-semibold">
                ⏳ INFORMACIÓN PRÓXIMAMENTE
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white border border-white/20">
                📋 Detalles por confirmar
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Información del concierto */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagen principal */}
            <SlideIn direction="left" delay={0.6} duration={1.0}>
              <div className="relative rounded-2xl overflow-hidden h-64 md:h-96">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${MOCK_CONCERT.imagen})` }}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      📸 Imagen referencial - Evento por definir
                    </div>
                  </div>
                </div>
              </div>
            </SlideIn>

            {/* Detalles del evento */}
            <SlideIn direction="left" delay={0.9} duration={1.0}>
              <Card variant="glass" className="text-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-2xl">
                    <Calendar className="h-6 w-6 text-blue-400" />
                    <span>Detalles del Evento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <StaggerContainer className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <StaggerItem>
                        <div className="flex items-start space-x-3">
                          <Calendar className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Fecha y Hora</p>
                            <p className="text-white/80 italic">Por definir</p>
                          </div>
                        </div>
                      </StaggerItem>

                      <StaggerItem>
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Lugar</p>
                            <p className="text-white/80 italic">Por definir</p>
                          </div>
                        </div>
                      </StaggerItem>

                      <StaggerItem>
                        <div className="flex items-start space-x-3">
                          <Clock className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Duración</p>
                            <p className="text-white/80 italic">Por definir</p>
                          </div>
                        </div>
                      </StaggerItem>
                    </div>

                    <div className="space-y-4">
                      <StaggerItem>
                        <div className="flex items-start space-x-3">
                          <Users className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Edades</p>
                            <p className="text-white/80 italic">Por definir</p>
                          </div>
                        </div>
                      </StaggerItem>

                      <StaggerItem>
                        <div className="flex items-start space-x-3">
                          <Star className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Géneros</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="bg-gray-500/20 text-gray-300 px-2 py-1 rounded-full text-xs italic">
                                Por definir
                              </span>
                            </div>
                          </div>
                        </div>
                      </StaggerItem>

                      <StaggerItem>
                        <div className="flex items-start space-x-3">
                          <Ticket className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Disponibilidad</p>
                            <div className="space-y-2">
                              <p className="text-white/80 italic text-sm">
                                Capacidad por definir
                              </p>
                              <div className="w-full bg-white/20 rounded-full h-2">
                                <div className="bg-gray-400/50 h-2 rounded-full w-0 transition-all duration-500" />
                              </div>
                              <p className="text-white/60 text-sm">
                                Preventa próximamente
                              </p>
                            </div>
                          </div>
                        </div>
                      </StaggerItem>
                    </div>
                  </StaggerContainer>

                                  {/* Descripción */}
                <FadeIn delay={1.2} duration={1.0}>
                    <div className="border-t border-white/20 pt-6">
                      <h3 className="font-semibold mb-3">Sobre el Evento</h3>
                      <p className="text-white/80 leading-relaxed">
                        {MOCK_CONCERT.descripcion}
                      </p>
                    </div>
                  </FadeIn>
                </CardContent>
              </Card>
            </SlideIn>
          </div>

          {/* Formulario de compra */}
          <div className="space-y-6">
            {/* Precios */}
            <SlideIn direction="right" delay={0.7} duration={1.0}>
              <Card variant="glass" className="text-white">
                <CardHeader>
                  <CardTitle className="text-center">Precios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`p-4 rounded-lg border-2 transition-all ${isPresale
                    ? 'border-green-400 bg-green-500/20'
                    : 'border-white/20 bg-white/10'
                    }`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {isPresale ? '🎟️ Preventa' : '🎫 Precio General'}
                      </span>
                      <span className="text-2xl font-bold text-blue-400">
                        {formatPrice(currentPrice)}
                      </span>
                    </div>
                    {isPresale && (
                      <p className="text-green-300 text-sm mt-1">
                        ¡Ahorra {formatPrice(MOCK_CONCERT.precio_general - MOCK_CONCERT.precio_preventa)}!
                      </p>
                    )}
                  </div>

                  {isPresale && (
                    <div className="p-3 rounded-lg bg-white/5 border border-white/20">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/70">Precio general:</span>
                        <span className="line-through text-white/50">
                          {formatPrice(MOCK_CONCERT.precio_general)}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </SlideIn>

            {/* Formulario de compra */}
            <SlideIn direction="right" delay={1.0} duration={1.0}>
              <PurchaseForm
                concertPrice={currentPrice}
                concertName={MOCK_CONCERT.nombre}
                concertDate="Fecha por definir"
              />
            </SlideIn>

            {/* Información adicional */}
            <SlideIn direction="right" delay={1.3} duration={1.0}>
              <Card variant="glass" className="text-white">
                <CardContent className="text-center text-sm text-white/70 space-y-2">
                  <p>🔒 Pago 100% seguro</p>
                  <p>📧 Boletas enviadas por email</p>
                  <p>📱 QR de verificación incluido</p>
                  <p>🎫 Máximo 3 boletas por compra</p>
                </CardContent>
              </Card>
            </SlideIn>
          </div>
        </div>
    </Layout>
  )
}

export { LandingPage }