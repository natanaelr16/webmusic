'use client'

import { useState } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatDate } from '@/lib/utils'
import { 
  QrCode, 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Camera,
  User,
  Calendar,
  MapPin,
  Ticket
} from 'lucide-react'

// Mock data para validación
const MOCK_TICKETS_DATABASE = {
  'BOL-001-2025': {
    id: 'BOL-001-2025',
    evento: 'Festival WebMusic 2025',
    fecha: '2025-12-15T20:00:00-05:00',
    lugar: 'Coliseo El Campín, Bogotá',
    propietario: 'Juan Pérez',
    email: 'juan@example.com',
    estado: 'vendida' as const,
    cantidad: 2,
    fecha_compra: '2025-01-15T10:30:00-05:00',
    validated_at: null
  },
  'BOL-002-2025': {
    id: 'BOL-002-2025',
    evento: 'Concierto Rock Latino',
    fecha: '2025-11-20T19:30:00-05:00',
    lugar: 'Teatro Mayor, Bogotá',
    propietario: 'María García',
    email: 'maria@example.com',
    estado: 'usada' as const,
    cantidad: 1,
    fecha_compra: '2025-01-10T15:45:00-05:00',
    validated_at: '2025-11-20T19:15:00-05:00'
  }
}

type ValidationResult = {
  status: 'valid' | 'used' | 'invalid' | 'not_found'
  ticket?: any
  message: string
}

const TicketValidationPage = () => {
  const [scanMode, setScanMode] = useState<'qr' | 'manual'>('manual')
  const [ticketId, setTicketId] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)

  const validateTicket = async (id: string): Promise<ValidationResult> => {
    // Simular validación con la base de datos
    await new Promise(resolve => setTimeout(resolve, 1500))

    const ticket = MOCK_TICKETS_DATABASE[id as keyof typeof MOCK_TICKETS_DATABASE]
    
    if (!ticket) {
      return {
        status: 'not_found',
        message: 'Boleta no encontrada en el sistema'
      }
    }

    if (ticket.estado === 'usada') {
      return {
        status: 'used',
        ticket,
        message: `Boleta ya utilizada el ${formatDate(ticket.validated_at!)}`
      }
    }

    if (ticket.estado === 'anulada') {
      return {
        status: 'invalid',
        ticket,
        message: 'Boleta anulada o cancelada'
      }
    }

    // Simular marcar como usada
    ticket.estado = 'usada'
    ticket.validated_at = new Date().toISOString()

    return {
      status: 'valid',
      ticket,
      message: 'Boleta válida - Acceso autorizado'
    }
  }

  const handleManualValidation = async () => {
    if (!ticketId.trim()) return

    setIsValidating(true)
    console.log('🔍 Validando boleta:', ticketId)
    
    try {
      const result = await validateTicket(ticketId.trim())
      setValidationResult(result)
    } catch (error) {
      console.error('Error validando boleta:', error)
      setValidationResult({
        status: 'invalid',
        message: 'Error de conexión. Intenta nuevamente.'
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleQRScan = () => {
    // Simular escaneo de QR
    alert('📱 Función de escaneo QR\n\nEn producción, aquí se abriría la cámara para escanear códigos QR.\n\nPor ahora, puedes probar con:\n- BOL-001-2025 (válida)\n- BOL-002-2025 (ya usada)')
  }

  const resetValidation = () => {
    setValidationResult(null)
    setTicketId('')
  }

  const getResultColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'text-green-400 bg-green-500/20 border-green-400/30'
      case 'used':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30'
      case 'invalid':
      case 'not_found':
        return 'text-red-400 bg-red-500/20 border-red-400/30'
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-400/30'
    }
  }

  const getResultIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-8 w-8" />
      case 'used':
        return <AlertTriangle className="h-8 w-8" />
      case 'invalid':
      case 'not_found':
        return <XCircle className="h-8 w-8" />
      default:
        return <Ticket className="h-8 w-8" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Validar Boletas
          </h1>
          <p className="text-xl text-white/80">
            Sistema de verificación de boletas para control de acceso
          </p>
        </div>

        {!validationResult ? (
          <>
            {/* Selector de modo */}
            <Card variant="glass" className="text-white mb-6">
              <CardContent className="text-center py-6">
                <div className="flex justify-center space-x-4">
                  <Button
                    variant={scanMode === 'qr' ? 'primary' : 'outline'}
                    onClick={() => setScanMode('qr')}
                    className="flex-1 max-w-xs"
                  >
                    <QrCode className="h-5 w-5 mr-2" />
                    Escanear QR
                  </Button>
                  <Button
                    variant={scanMode === 'manual' ? 'primary' : 'outline'}
                    onClick={() => setScanMode('manual')}
                    className="flex-1 max-w-xs"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Buscar por ID
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Validación por QR */}
            {scanMode === 'qr' && (
              <Card variant="glass" className="text-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="h-6 w-6 text-blue-400" />
                    <span>Escanear código QR</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="bg-white/10 border-2 border-dashed border-white/30 rounded-lg p-12">
                    <QrCode className="h-24 w-24 text-white/50 mx-auto mb-4" />
                    <p className="text-white/70 mb-6">
                      Posiciona el código QR frente a la cámara
                    </p>
                    <Button onClick={handleQRScan} size="lg">
                      <Camera className="h-5 w-5 mr-2" />
                      Activar cámara
                    </Button>
                  </div>
                  <p className="text-white/60 text-sm">
                    📱 Asegúrate de que el QR esté bien iluminado y centrado
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Validación manual */}
            {scanMode === 'manual' && (
              <Card variant="glass" className="text-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-6 w-6 text-blue-400" />
                    <span>Buscar por ID de boleta</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Input
                      label="ID de la boleta"
                      placeholder="Ej: BOL-001-2025"
                      value={ticketId}
                      onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                      icon={<Ticket className="h-5 w-5 text-gray-400" />}
                    />
                    
                    <Button
                      onClick={handleManualValidation}
                      isLoading={isValidating}
                      disabled={!ticketId.trim()}
                      className="w-full"
                      size="lg"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Validar boleta
                    </Button>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">💡 IDs de prueba:</h3>
                    <div className="space-y-1 text-sm text-white/70">
                      <p>• <code className="bg-white/20 px-2 py-1 rounded">BOL-001-2025</code> - Boleta válida</p>
                      <p>• <code className="bg-white/20 px-2 py-1 rounded">BOL-002-2025</code> - Ya utilizada</p>
                      <p>• <code className="bg-white/20 px-2 py-1 rounded">BOL-999-2025</code> - No existe</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          /* Resultado de validación */
          <Card variant="glass" className={`text-white border-2 ${getResultColor(validationResult.status)}`}>
            <CardContent className="text-center py-8">
              <div className="space-y-6">
                {/* Icono y estado */}
                <div className="flex flex-col items-center space-y-4">
                  {getResultIcon(validationResult.status)}
                  <h2 className="text-2xl font-bold">
                    {validationResult.status === 'valid' && '✅ ACCESO AUTORIZADO'}
                    {validationResult.status === 'used' && '⚠️ BOLETA YA UTILIZADA'}
                    {validationResult.status === 'invalid' && '❌ BOLETA INVÁLIDA'}
                    {validationResult.status === 'not_found' && '❌ BOLETA NO ENCONTRADA'}
                  </h2>
                  <p className="text-lg">{validationResult.message}</p>
                </div>

                {/* Detalles de la boleta */}
                {validationResult.ticket && (
                  <div className="bg-white/10 rounded-lg p-6 text-left max-w-md mx-auto">
                    <h3 className="font-semibold text-lg mb-4 text-center">Información de la boleta</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Ticket className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <div>
                          <p className="text-white/70 text-sm">ID</p>
                          <p className="font-mono">{validationResult.ticket.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <div>
                          <p className="text-white/70 text-sm">Propietario</p>
                          <p>{validationResult.ticket.propietario}</p>
                          <p className="text-white/60 text-sm">{validationResult.ticket.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <div>
                          <p className="text-white/70 text-sm">Evento</p>
                          <p>{validationResult.ticket.evento}</p>
                          <p className="text-white/60 text-sm">{formatDate(validationResult.ticket.fecha)}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <div>
                          <p className="text-white/70 text-sm">Lugar</p>
                          <p>{validationResult.ticket.lugar}</p>
                        </div>
                      </div>

                      {validationResult.ticket.validated_at && (
                        <div className="border-t border-white/20 pt-3">
                          <p className="text-white/70 text-sm">Utilizada el:</p>
                          <p className="text-yellow-400">{formatDate(validationResult.ticket.validated_at)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Botón para nueva validación */}
                <Button
                  onClick={resetValidation}
                  variant="outline"
                  size="lg"
                >
                  Validar otra boleta
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información para operadores */}
        <Card variant="glass" className="text-white mt-8">
          <CardContent className="text-center space-y-4">
            <h3 className="text-lg font-semibold">📋 Instrucciones para operadores</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-white/70">
              <div>
                <p className="font-medium text-green-400 mb-1">✅ Acceso autorizado</p>
                <p>Permitir el ingreso al evento</p>
              </div>
              <div>
                <p className="font-medium text-yellow-400 mb-1">⚠️ Ya utilizada</p>
                <p>Verificar identidad del portador</p>
              </div>
              <div>
                <p className="font-medium text-red-400 mb-1">❌ Inválida</p>
                <p>No permitir el acceso</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export { TicketValidationPage }