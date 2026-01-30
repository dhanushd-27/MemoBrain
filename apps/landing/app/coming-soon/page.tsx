import React from 'react'
import Link from 'next/link'

export default function ComingSoon() {
  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <h1 className="text-4xl font-bold font-serif">Coming Soon!</h1>
      <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:underline transition-all duration-300">Back to Home</Link>
    </div>
  )
}
