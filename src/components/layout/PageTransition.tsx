'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PageTransitionProps {
    children: React.ReactNode
}

const PageTransition = ({ children }: PageTransitionProps) => {
    const [isFirstLoad, setIsFirstLoad] = useState(true)

    useEffect(() => {
        // Marcar que ya no es la primera carga después de la animación inicial
        const timer = setTimeout(() => {
            setIsFirstLoad(false)
        }, 1200)

        return () => clearTimeout(timer)
    }, [])

    // Solo animar en la primera carga
    if (isFirstLoad) {
        return (
            <motion.div
                initial={{ 
                    opacity: 0, 
                    y: 20,
                    scale: 0.98
                }}
                animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: 1
                }}
                transition={{
                    type: 'tween',
                    ease: 'easeOut',
                    duration: 1.0,
                    delay: 0.2
                }}
                className="min-h-screen pt-16"
            >
                {children}
            </motion.div>
        )
    }

    // Sin animaciones después de la primera carga - navegación instantánea
    return (
        <div className="min-h-screen pt-16">
            {children}
        </div>
    )
}

export { PageTransition }