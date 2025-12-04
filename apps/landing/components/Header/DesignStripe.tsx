import React from 'react'

export default function DesignStripe({ className }: { className: string }) {
  return (
    <div className={`absolute bg-gradient-to-b from-secondary from-10% via-secondary/50 via-50% to-transparent to-90% z-10 blur-sm opacity-90 ${className}`}></div>
  )
}
