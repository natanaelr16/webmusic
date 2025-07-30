'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SlideInProps {
    children: ReactNode
    delay?: number
    duration?: number
    direction?: 'left' | 'right' | 'up' | 'down'
    className?: string
    distance?: number
}

const SlideIn = ({ 
  children, 
  delay = 0, 
  duration = 0.9, 
  direction = 'left',
  className = '',
  distance = 50
}: SlideInProps) => {
    const directionConfig = {
        left: { x: -distance, y: 0 },
        right: { x: distance, y: 0 },
        up: { x: 0, y: -distance },
        down: { x: 0, y: distance }
    }

    return (
        <motion.div
            initial={{
                opacity: 0,
                ...directionConfig[direction]
            }}
            animate={{
                opacity: 1,
                x: 0,
                y: 0
            }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.25, 0.25, 0.75] // easeOutQuart
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export { SlideIn }