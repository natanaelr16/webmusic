'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface FadeInProps {
    children: ReactNode
    delay?: number
    duration?: number
    direction?: 'up' | 'down' | 'left' | 'right' | 'none'
    className?: string
}

const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 0.8, 
  direction = 'up',
  className = ''
}: FadeInProps) => {
    const directionOffset = {
        up: { y: 30, x: 0 },
        down: { y: -30, x: 0 },
        left: { y: 0, x: 30 },
        right: { y: 0, x: -30 },
        none: { y: 0, x: 0 }
    }

    return (
        <motion.div
            initial={{
                opacity: 0,
                ...directionOffset[direction]
            }}
            animate={{
                opacity: 1,
                y: 0,
                x: 0
            }}
            transition={{
                duration,
                delay,
                ease: 'easeOut'
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export { FadeIn }