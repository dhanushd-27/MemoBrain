"use client"

import React from 'react'
import DesignStripe from './DesignStripe'
import { motion } from 'motion/react'

type HeaderDesignProps = {
  side: 'left' | 'right'
  className?: string
}

type StripeConfig = {
  position: string
  size: string
  rotate?: string
}

// Configuration for each individual stripe on each side.
// You can tweak these class strings to fine‑tune position, size, and rotation.
const LEFT_STRIPES: StripeConfig[] = [
  { position: '-top-6 -left-8', size: 'w-4 h-[120%]', rotate: 'rotate-18' },
  { position: '-top-6 -left-4', size: 'w-4 h-[120%]', rotate: 'rotate-18' },
  { position: '-top-6 left-4', size: 'w-6 h-[110%]', rotate: 'rotate-18' },
  { position: '-top-6 left-10', size: 'w-6 h-[100%]', rotate: 'rotate-16' },
  { position: '-top-6 left-19', size: 'w-4 h-[85%]', rotate: 'rotate-18' },
  { position: '-top-6 left-22', size: 'w-5 h-[110%]', rotate: 'rotate-18' },
  { position: '-top-6 left-33', size: 'w-6 h-[100%]', rotate: 'rotate-18' },
  { position: '-top-6 left-38', size: 'w-6 h-[120%]', rotate: 'rotate-14' },
  { position: '-top-6 left-60', size: 'w-1 h-[100%]', rotate: 'rotate-24' },
  { position: '-top-6 left-68', size: 'w-1 h-[120%]', rotate: 'rotate-14' },
  { position: '-top-6 left-72', size: 'w-1 h-[100%]', rotate: 'rotate-16' },
]

const RIGHT_STRIPES: StripeConfig[] = [
  { position: '-top-6 -right-8', size: 'w-4 h-[120%]', rotate: '-rotate-18' },
  { position: '-top-6 -right-4', size: 'w-4 h-[120%]', rotate: '-rotate-18' },
  { position: '-top-6 right-4', size: 'w-6 h-[110%]', rotate: '-rotate-18' },
  { position: '-top-6 right-10', size: 'w-6 h-[100%]', rotate: '-rotate-16' },
  { position: '-top-6 right-19', size: 'w-4 h-[85%]', rotate: '-rotate-18' },
  { position: '-top-6 right-22', size: 'w-5 h-[110%]', rotate: '-rotate-18' },
  { position: '-top-6 right-33', size: 'w-6 h-[100%]', rotate: '-rotate-18' },
  { position: '-top-6 right-38', size: 'w-6 h-[120%]', rotate: '-rotate-14' },
  { position: '-top-6 right-60', size: 'w-1 h-[100%]', rotate: '-rotate-24' },
  { position: '-top-6 right-68', size: 'w-1 h-[120%]', rotate: '-rotate-14' },
  { position: '-top-6 right-72', size: 'w-1 h-[100%]', rotate: '-rotate-16' },
]

export default function HeaderDesign({ side, className = '' }: HeaderDesignProps) {
  const isLeft = side === 'left'

  const stripes = isLeft ? LEFT_STRIPES : RIGHT_STRIPES

  return (
    <section className={`relative flex h-52 w-72 ${className}`}>
      <motion.div className="bg-secondary absolute inset-0 -z-10 opacity-30 -top-10 blur-2xl h-36"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
      </motion.div>

      {stripes.map((stripe, index) => (
        <DesignStripe
          key={index}
          className={`${stripe.position} ${stripe.size} ${stripe.rotate ?? ''}`}
        />
      ))}
    </section>
  )
}
