import React from 'react'
import Link from 'next/link'

export default function Option({ href, name }: { href: string, name: string }) {
  return (
    <div>
      <Link href={href}>
        { name }
      </Link>
    </div>
  )
}
