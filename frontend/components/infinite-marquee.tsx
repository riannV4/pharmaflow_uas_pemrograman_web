'use client'

import { motion } from 'framer-motion'
import React from 'react'

interface InfiniteMarqueeProps {
  items: React.ReactNode[]
  speed?: number
  pauseOnHover?: boolean
  direction?: 'left' | 'right'
}

export function InfiniteMarquee({
  items,
  speed = 80,
  pauseOnHover = true,
  direction = 'left',
}: InfiniteMarqueeProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  // Duplicate items multiple times untuk seamless infinite loop
  const duplicatedItems = Array(4).fill(items).flat()

  // Calculate total distance (one full cycle of original items)
  const totalItems = items.length
  const scrollDistance = direction === 'left' ? -100 : 100

  return (
    <div 
      className="overflow-hidden bg-white border-y border-slate-200 py-4"
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
    >
      <motion.div
        className="flex gap-8 w-fit"
        initial={{ x: 0 }}
        animate={{ x: scrollDistance * totalItems }}
        transition={{
          duration: speed,
          ease: 'linear' as const,
          repeat: Infinity,
          repeatType: 'loop',
          repeatDelay: 0,
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div 
            key={`${index}-${Math.random()}`}
            className="flex-shrink-0"
          >
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
