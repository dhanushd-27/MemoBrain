import React from 'react'
import HeaderDesign from './HeaderDesign'
import Nav from './Nav/Nav'

export default function Header() {
  return (
    <section className="relative flex w-full items-center justify-between z-10">
      <HeaderDesign side="left" className="absolute inset-y-0 left-0" />
      <div className="mx-auto flex items-center justify-center">
        <Nav />
      </div>
      <HeaderDesign side="right" className="absolute inset-y-0 right-0" />
    </section>
  )
}
