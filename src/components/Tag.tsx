import React from 'react'

export default function Tag({ tagTitle, color }: { tagTitle: string, color: string }) {

  return (
    <p className={`rounded-full ${color}  w-fit h-fit px-2 pb-0.5 text-center text-xs`}>{ tagTitle }</p>
  )
}
