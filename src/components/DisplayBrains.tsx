"use client"

import { getBrainWithUrl } from '@/actions/get/get-brain-with-url';
import { responseBrainType } from '@/types/brainType/brain';
import { isErrorResponse } from '@/utils/api/api-response-handler';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import ShareBrainCard from './ShareBrainCard';

export default function DisplayBrains({ shareUrl }: { shareUrl: string }) {
  const [brains, setBrains] = useState<responseBrainType[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function handleFetchingBrains(shareUrl: string) {
      const response = await getBrainWithUrl(shareUrl);

      if(isErrorResponse(response)) {
        toast.error("Invalid Url");
        redirect("/dashboard");
      }

      const { brains } = response.data as {
        brains: responseBrainType[]
      };

      setBrains(brains);
      setIsLoading(false);
    }

    handleFetchingBrains(shareUrl);
  }, [])

  if(isLoading || !brains) return (
    <div>
      Loading...
    </div>
  )
  
  return (
    <div className='flex flex-wrap w-full gap-7 items-start justify-start px-14 py-4'>
      {
        brains.map(tag => (
          <ShareBrainCard key={ tag.id } type={ tag.type } url={ tag.url } title={ tag.title } tags={ tag.tags }/>
        ))
      }
    </div>
  )
}
