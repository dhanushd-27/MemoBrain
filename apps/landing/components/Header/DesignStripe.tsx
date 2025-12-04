'use client'
import React from 'react'
import { motion } from 'motion/react'

export default function DesignStripe({ className }: { className: string }) {
  return (
    <motion.div className={`absolute bg-gradient-to-b from-secondary from-10% via-secondary/50 via-50% to-transparent to-90% z-10 blur-sm opacity-90 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    ></motion.div>
  )
}
