"use client"

import { getUserBrains } from '@/actions/get/get-user-brains'
import { responseBrainType } from '@/types/brainType/brain';
import { isErrorResponse } from '@/utils/api/api-response-handler';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import BrainCard from '../BrainCard';
import { useTagStore } from '@/hooks/useTagState';

export default function UserBrains() {
  const [brains, setBrains] = useState<responseBrainType[]>();
  const [isLoading, setLoading] = useState(true);
  const { tagState } = useTagStore();

  useEffect(() => {
    const handleFetchingBrain = async () => {
      const response = await getUserBrains({ type: tagState });

      if(isErrorResponse(response)){
        toast.error(response.errorInformation.message);
        return;
      }
      
      const brains  = response.data as responseBrainType[]

      setBrains(brains);
      setLoading(false);
    }

    handleFetchingBrain();
  }, [tagState])

  if(isLoading || !brains) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div className='flex flex-wrap w-full gap-7 items-start justify-start px-14 py-4'>
      {
        brains.map(tag => (
          <BrainCard key={ tag.id } type={ tag.type } url={ tag.url } title={ tag.title } tags={ tag.tags } id={ tag.id }/>
        ))
      }
    </div>
  )
}
