"use client"

import { getUserBrains } from '@/actions/get/get-user-brains'
import { responseBrainType } from '@/types/brainType/brain';
import { isErrorResponse } from '@/utils/api/api-response-handler';
import React, { useState } from 'react'
import { toast } from 'sonner';
import BrainCard from '../BrainCard';
import { useTagStore } from '@/hooks/useTagState';
import { useQuery } from '@tanstack/react-query';

export default function UserBrains() {
  const [isLoading, setLoading] = useState(true);
  const { tagState } = useTagStore();

  const handleFetchingBrain = async () => {
    const response = await getUserBrains({ type: tagState });

    if(isErrorResponse(response)){
      toast.error(response.errorInformation.message);
      return;
    }
    
    setLoading(false);
    return response.data as responseBrainType[]
  }

  const brainsQuery = useQuery({
    queryKey: ["brains"],
    queryFn: handleFetchingBrain
  })


  if(isLoading || !brainsQuery.data) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div className='flex flex-wrap w-full gap-7 items-start justify-start px-14 py-4'>
      {
        brainsQuery.data && brainsQuery.data.map(brain => (
          <BrainCard key={ brain.id } type={ brain.type } url={ brain.url } title={ brain.title } tags={ brain.tags } id={ brain.id }/>
        ))
      }
    </div>
  )
}
