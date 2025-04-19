import React from 'react'
import { tagColorPalette } from '@/utils/other/colorStore';

export default function Tag({ tagTitle }: { tagTitle: string }) {
  const randomVal = Math.floor(Math.random() * tagColorPalette.length);

  return (
    <p className={`rounded-full ${tagColorPalette[randomVal]} w-fit h-fit px-2 pb-0.5 text-center text-xs`}>{ tagTitle }</p>
  )
}
