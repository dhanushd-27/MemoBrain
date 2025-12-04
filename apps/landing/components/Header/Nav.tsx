import React from 'react'
import HeaderDesign from './HeaderDesign'

export default function Nav() {
  return (
    <section className="relative flex w-full items-center justify-between z-10">
      <HeaderDesign side="left" className="absolute inset-y-0 left-0" />

      {/* Place your actual nav content here (logo, links, etc.) */}
      <div className="mx-auto flex items-center justify-center">
        {/* Nav content */}
      </div>

      <HeaderDesign side="right" className="absolute inset-y-0 right-0" />
    </section>
  )
}
