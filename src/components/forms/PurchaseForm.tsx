'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { FadeIn } from '@/components/layout/FadeIn'
import { formatPrice } from '@/lib/utils'
import { Mail, Ticket, ShoppingCart, ArrowLeft, CreditCard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PurchaseFormData {
    email: string
    quantity: number
}

interface PurchaseFormProps {
    concertPrice: number
    concertName: string
    concertDate: string
}

const PurchaseForm = ({ concertPrice, concertName, concertDate }: PurchaseFormProps) => {
    const [step, setStep] = useState<'form' | 'confirmation' | 'processing'>('form')
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid }
    } = useForm<PurchaseFormData>({
        mode: 'onChange',
        defaultValues: {
            email: '',
            quantity: 1
        }
    })

    const watchedData = watch()
    const totalPrice = watchedData.quantity * concertPrice

    const onSubmit = (data: PurchaseFormData) => {
        console.log('📧 Datos del formulario:', data)
        console.log('💰 Total a pagar:', formatPrice(totalPrice))
        setStep('confirmation')
    }

    const handleConfirmPurchase = async () => {
        setIsLoading(true)
        setStep('processing')

        // Simulamos el proceso de pago
        // TODO: Aquí se conectará con la Edge Function 'iniciar-compra' de Supabase
        try {
            console.log('🚀 Iniciando proceso de pago...')
            console.log('📋 Datos finales:', {
                email: watchedData.email,
                quantity: watchedData.quantity,
                total: totalPrice,
                concert: concertName
            })

            // Simular delay de procesamiento
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Simular redirección a pasarela de pagos
            console.log('🔗 Redirigiendo a pasarela de pagos...')
            alert('¡Redirigiendo a la pasarela de pagos!\n\nEn producción, aquí se conectará con el backend para generar el link de pago.')

            // Reset form
            setStep('form')
        } catch (error) {
            console.error('❌ Error en el proceso:', error)
            alert('Error al procesar la compra. Intenta nuevamente.')
            setStep('form')
        } finally {
            setIsLoading(false)
        }
    }

    const handleBack = () => {
        setStep('form')
    }

    if (step === 'processing') {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card variant="glass" className="max-w-md mx-auto text-white">
                        <CardContent className="text-center py-8">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="mx-auto mb-4 h-12 w-12 border-4 border-blue-400 border-t-transparent rounded-full"
                            />
                            <FadeIn delay={0.2}>
                                <h3 className="text-xl font-semibold mb-2">Procesando tu compra...</h3>
                                <p className="text-white/80">Te redirigiremos a la pasarela de pagos en un momento.</p>
                            </FadeIn>
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>
        )
    }

    if (step === 'confirmation') {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                >
                    <Card variant="glass" className="max-w-md mx-auto text-white">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <ShoppingCart className="h-6 w-6 text-blue-400" />
                                <span>Confirmar Compra</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Resumen de la compra */}
                            <div className="bg-white/10 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-white/80">Evento:</span>
                                    <span className="font-medium">{concertName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/80">Fecha:</span>
                                    <span className="font-medium">{concertDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/80">Email:</span>
                                    <span className="font-medium">{watchedData.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/80">Cantidad:</span>
                                    <span className="font-medium">{watchedData.quantity} boleta(s)</span>
                                </div>
                                <div className="border-t border-white/20 pt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total:</span>
                                        <span className="text-blue-400">{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={handleBack}
                                    disabled={isLoading}
                                    className="flex-1"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Volver
                                </Button>
                                <Button
                                    onClick={handleConfirmPurchase}
                                    isLoading={isLoading}
                                    className="flex-1"
                                >
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Pagar Ahora
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>
        )
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card variant="glass" className="max-w-md mx-auto text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Ticket className="h-6 w-6 text-blue-400" />
                            <span>Comprar Boletas</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Email */}
                            <Input
                                label="Correo electrónico"
                                type="email"
                                placeholder="tu@email.com"
                                icon={<Mail className="h-5 w-5 text-gray-400" />}
                                error={errors.email?.message}
                                {...register('email', {
                                    required: 'El email es requerido',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Email inválido'
                                    }
                                })}
                            />

                            {/* Cantidad */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Cantidad de boletas
                                </label>
                                <select
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                                    {...register('quantity', {
                                        required: 'Selecciona la cantidad',
                                        min: { value: 1, message: 'Mínimo 1 boleta' },
                                        max: { value: 3, message: 'Máximo 3 boletas por compra' }
                                    })}
                                >
                                    <option value={1}>1 boleta</option>
                                    <option value={2}>2 boletas</option>
                                    <option value={3}>3 boletas</option>
                                </select>
                                {errors.quantity && (
                                    <p className="mt-2 text-sm text-red-400">{errors.quantity.message}</p>
                                )}
                            </div>

                            {/* Resumen de precio */}
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/80">Precio por boleta:</span>
                                    <span className="font-medium">{formatPrice(concertPrice)}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/20">
                                    <span className="text-lg font-bold">Total:</span>
                                    <span className="text-lg font-bold text-blue-400">
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>
                            </div>

                            {/* Botón de envío */}
                            <Button
                                type="submit"
                                disabled={!isValid}
                                className="w-full"
                                size="lg"
                            >
                                <ShoppingCart className="h-5 w-5 mr-2" />
                                Continuar con la compra
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </AnimatePresence>
    )
}

export { PurchaseForm }