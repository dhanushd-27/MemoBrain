import React from 'react'
import GetStarted from './GetStarted'
import Logo from './Logo'
import Option from './Option'

const options = [
  { href: "/", name: "Home" },
  { href: "/about", name: "About" },
  { href: "/contact", name: "Contact" },
]

export default function Nav() {
  return (
    <div className='fixed top-4 left-1/2 z-30 flex w-[60%] -translate-x-1/2 items-center justify-between rounded-full border border-black/10 px-6 py-4 backdrop-blur-md'>
      <Logo />
      <div className='flex items-center gap-4'>
        {options.map((option) => (
          <Option key={option.href} href={option.href} name={option.name} />
        ))}
      </div>
      <GetStarted />
    </div>
  )
}
