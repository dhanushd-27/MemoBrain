"use client"

import { ExternalLink } from 'lucide-react';
import { MdDelete } from "react-icons/md";
import twitterbg from "@/assets/x-bg.jpg"
import React from 'react'
import { Card, CardContent, CardTitle } from './ui/card'
import Link from 'next/link'
import Image from 'next/image';
import { createBrainSchema } from '@/types/brainType/brain';
import Tag from './Tag';
import { tagColorPalette } from '@/utils/other/colorStore';

export default function BrainCard({
  title,
  type,
  tags,
  url
}: createBrainSchema) {
  return (
     <Card className='w-2xs p-0 pb-4'>
      <Image src={ twitterbg } alt='twitterbg' className='rounded-t-xl'/>
      <div className='flex flex-col gap-2 px-4'>
        <CardTitle>{ title }</CardTitle>
        <CardContent className='px-0 flex flex-col gap-2'>
          <div className='flex justify-between'>
            <h5>{ type }</h5>
            <div className='flex gap-2'>
              <Link href={ url } target='_blank'><ExternalLink className='w-4'></ExternalLink></Link>
              <button><MdDelete className='w-4' /></button>
            </div>
          </div>
          <hr/>
          <div className="flex gap-2 flex-wrap">
            { tags.map((tag, index) => (
              <Tag key={ index } tagTitle={ tag } color={ tagColorPalette[index%4] } />
            )) }
          </div>
          </CardContent>
      </div>
     </Card>
  ) 
}
