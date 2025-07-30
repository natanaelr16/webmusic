'use client'

import { useState } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular autenticación
    console.log(isSignUp ? '📝 Registrando usuario:' : '🔐 Iniciando sesión:', formData)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert(`${isSignUp ? 'Registro exitoso' : 'Inicio de sesión exitoso'}\n\nEn producción, aquí se conectará con Supabase Auth.`)
    
    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
          </h1>
          <p className="text-white/80">
            {isSignUp 
              ? 'Regístrate para gestionar tus boletas' 
              : 'Accede a tu cuenta para ver tus boletas'
            }
          </p>
        </div>

        <Card variant="glass" className="text-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-center justify-center">
              <User className="h-6 w-6 text-blue-400" />
              <span>{isSignUp ? 'Registro' : 'Acceso'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre (solo en registro) */}
              {isSignUp && (
                <Input
                  label="Nombre completo"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  icon={<User className="h-5 w-5 text-gray-400" />}
                  required
                />
              )}

              {/* Email */}
              <Input
                label="Correo electrónico"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                icon={<Mail className="h-5 w-5 text-gray-400" />}
                required
              />

              {/* Password */}
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                required
              />

              {/* Botón de envío */}
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
                size="lg"
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
              </Button>
            </form>

            {/* Toggle entre login/signup */}
            <div className="mt-6 text-center">
              <p className="text-white/70">
                {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
              </p>
              <Button
                variant="ghost"
                onClick={() => setIsSignUp(!isSignUp)}
                className="mt-2"
              >
                {isSignUp ? 'Iniciar sesión' : 'Crear cuenta'}
              </Button>
            </div>

            {/* Información adicional */}
            <div className="mt-6 bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">💡 Información</h3>
              <div className="space-y-1 text-sm text-white/70">
                <p>• Accede a tus boletas compradas</p>
                <p>• Descarga PDFs con códigos QR</p>
                <p>• Historial de compras</p>
                <p>• Notificaciones de eventos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enlace para volver */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/'}
            className="text-white/70 hover:text-white"
          >
            ← Volver al inicio
          </Button>
        </div>
      </main>
    </div>
  )
}

export { LoginPage }