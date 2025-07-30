'use client'

import { useState } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatPrice, formatDate } from '@/lib/utils'
import { Ticket, Calendar, MapPin, Download, Search, QrCode, CheckCircle } from 'lucide-react'

// Mock data de boletas del usuario
const MOCK_TICKETS = [
  {
    id: 'BOL-001-2025',
    evento: 'Festival WebMusic 2025',
    fecha: '2025-12-15T20:00:00-05:00',
    lugar: 'Coliseo El Campín, Bogotá',
    cantidad: 2,
    precio_total: 90000,
    estado: 'vendida' as const,
    qr_code: 'QR_CODE_DATA_MOCK_001',
    fecha_compra: '2025-01-15T10:30:00-05:00',
    email: 'usuario@example.com'
  },
  {
    id: 'BOL-002-2025',
    evento: 'Concierto Rock Latino',
    fecha: '2025-11-20T19:30:00-05:00',
    lugar: 'Teatro Mayor, Bogotá',
    cantidad: 1,
    precio_total: 75000,
    estado: 'usada' as const,
    qr_code: 'QR_CODE_DATA_MOCK_002',
    fecha_compra: '2025-01-10T15:45:00-05:00',
    email: 'usuario@example.com'
  }
]

const MyTicketsPage = () => {
  const [searchEmail, setSearchEmail] = useState('')
  const [tickets, setTickets] = useState(MOCK_TICKETS)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchEmail.trim()) return
    
    setIsLoading(true)
    // Simular búsqueda
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // En producción, aquí se haría la consulta a Supabase
    console.log('🔍 Buscando boletas para:', searchEmail)
    setIsLoading(false)
  }

  const generateQRCode = (ticketId: string) => {
    // En producción, esto sería un QR real con datos encriptados
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticketId)}`
  }

  const downloadTicket = (ticket: any) => {
    // Simular descarga de PDF
    console.log('📥 Descargando boleta:', ticket.id)
    alert(`Descargando boleta ${ticket.id}\n\nEn producción, aquí se generaría y descargaría el PDF con el QR code.`)
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'vendida':
        return 'text-green-400 bg-green-500/20'
      case 'usada':
        return 'text-gray-400 bg-gray-500/20'
      case 'anulada':
        return 'text-red-400 bg-red-500/20'
      default:
        return 'text-blue-400 bg-blue-500/20'
    }
  }

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'vendida':
        return <Ticket className="h-4 w-4" />
      case 'usada':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Ticket className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Mis Boletas
          </h1>
          <p className="text-xl text-white/80">
            Consulta y descarga tus boletas compradas
          </p>
        </div>

        {/* Buscador de boletas */}
        <Card variant="glass" className="text-white mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-6 w-6 text-blue-400" />
              <span>Buscar mis boletas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Input
                placeholder="Ingresa tu email para buscar boletas"
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="flex-1"
                icon={<Search className="h-5 w-5 text-gray-400" />}
              />
              <Button
                onClick={handleSearch}
                isLoading={isLoading}
                disabled={!searchEmail.trim()}
              >
                Buscar
              </Button>
            </div>
            <p className="text-white/60 text-sm mt-3">
              💡 Ingresa el email con el que compraste las boletas
            </p>
          </CardContent>
        </Card>

        {/* Lista de boletas */}
        {tickets.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Boletas encontradas ({tickets.length})
            </h2>
            
            {tickets.map((ticket) => (
              <Card key={ticket.id} variant="glass" className="text-white">
                <CardContent className="p-6">
                  <div className="grid lg:grid-cols-4 gap-6">
                    {/* Información del evento */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-blue-400 mb-2">
                            {ticket.evento}
                          </h3>
                          <div className="space-y-2 text-white/80">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-blue-400" />
                              <span>{formatDate(ticket.fecha)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-blue-400" />
                              <span>{ticket.lugar}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${getStatusColor(ticket.estado)}`}>
                          {getStatusIcon(ticket.estado)}
                          <span className="capitalize">{ticket.estado}</span>
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white/70">ID de Boleta:</span>
                          <span className="font-mono text-blue-400">{ticket.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Cantidad:</span>
                          <span>{ticket.cantidad} boleta(s)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Total pagado:</span>
                          <span className="font-bold text-green-400">{formatPrice(ticket.precio_total)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Fecha de compra:</span>
                          <span>{formatDate(ticket.fecha_compra)}</span>
                        </div>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="text-center">
                      <div className="bg-white p-4 rounded-lg inline-block mb-4">
                        <img
                          src={generateQRCode(ticket.id)}
                          alt={`QR Code para ${ticket.id}`}
                          className="w-32 h-32"
                        />
                      </div>
                      <p className="text-white/70 text-sm">
                        Código QR de verificación
                      </p>
                    </div>

                    {/* Acciones */}
                    <div className="space-y-3">
                      <Button
                        onClick={() => downloadTicket(ticket)}
                        variant="primary"
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar PDF
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          navigator.clipboard.writeText(ticket.id)
                          alert('ID de boleta copiado al portapapeles')
                        }}
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        Copiar ID
                      </Button>

                      {ticket.estado === 'vendida' && (
                        <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3 text-center">
                          <p className="text-green-300 text-sm font-medium">
                            ✅ Lista para usar
                          </p>
                        </div>
                      )}

                      {ticket.estado === 'usada' && (
                        <div className="bg-gray-500/20 border border-gray-400/30 rounded-lg p-3 text-center">
                          <p className="text-gray-300 text-sm">
                            ✓ Ya utilizada
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card variant="glass" className="text-white text-center py-12">
            <CardContent>
              <Ticket className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay boletas</h3>
              <p className="text-white/70 mb-6">
                No se encontraron boletas para este email.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Comprar boletas
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Información adicional */}
        <Card variant="glass" className="text-white mt-8">
          <CardContent className="text-center space-y-4">
            <h3 className="text-lg font-semibold">ℹ️ Información importante</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-white/70">
              <div>
                <p className="font-medium text-white mb-1">📱 Código QR</p>
                <p>Presenta el QR en el evento para ingresar</p>
              </div>
              <div>
                <p className="font-medium text-white mb-1">📧 Email</p>
                <p>Las boletas se envían al email de compra</p>
              </div>
              <div>
                <p className="font-medium text-white mb-1">🆔 ID único</p>
                <p>Cada boleta tiene un ID único de verificación</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export { MyTicketsPage }