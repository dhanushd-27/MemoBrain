"use client"

import { ExternalLink } from 'lucide-react';
import { MdDelete } from "react-icons/md";
import twitterbg from "@/assets/x-bg.jpg"
import React from 'react'
import { Card, CardContent, CardTitle } from './ui/card'
import Link from 'next/link'
import Image from 'next/image';
import { BrainCardType } from '@/types/brainType/brain';
import Tag from './Tag';
import { tagColorPalette } from '@/utils/other/colorStore';
import { deleteBrain } from '@/actions/delete/delete-brain';
import { isErrorResponse } from '@/utils/api/api-response-handler';
import { toast } from 'sonner';

export default function BrainCard({
  id,
  title,
  type,
  tags,
  url
}: BrainCardType) {
  async function handleDelete() {
    const response = await deleteBrain(id);

    if(isErrorResponse(response)){
      toast.error("Invalid Delete Request");
      return;
    }

    toast.success(response.message);
  }

  return (
     <Card className='w-2xs p-0 pb-4'>
      <Image src={ twitterbg } alt='twitterbg' className='rounded-t-xl'/>
      <div className='flex flex-col gap-2 px-4'>
        <CardTitle>{ title }</CardTitle>
        <CardContent className='px-0 flex flex-col gap-2'>
          <div className='flex justify-between'>
            <h5>{ type }</h5>
            <div className='flex gap-2'>
              <Link href={url} target="_blank">
                <ExternalLink className="w-4 text-gray-500 hover:text-gray-300" />
              </Link>

              <button onClick={handleDelete} className="hover:cursor-pointer">
                <MdDelete className="w-6 text-gray-500 hover:text-gray-300" />
              </button>
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
