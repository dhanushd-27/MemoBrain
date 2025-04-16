"use client"

import { useTokenStore } from '@/lib/store/tokenStore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { isErrorResponse } from '../api-response-handler';
import { handleSession } from '@/actions/handleSession';

type ReactNodeType = {
  children: React.ReactNode
}

export default function ProtectedRouteProvider({ children }: ReactNodeType) {
  const router = useRouter();
  const { setAccessToken } = useTokenStore();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const response = await handleSession();
      
      if (!isErrorResponse(response)) {
        const { sessionToken } = response.data as { sessionToken: string};
        setAccessToken(sessionToken);
      } else {
        router.push('/');
      }

      setTimeout(() => {
        setLoading(false);
      }, 500)
    };

    init();
  }, []);

  if(isLoading) {
    return (
      <div>Loading</div>
    )
  }

  return (
    <div>
      { children }
    </div>
  )
}

// // So get to understand what are session tokens and what are refresh token,
// // Add protected routes - choose something that is better
// // redirect people to dashboard on successive login/ signup
// // during signup - go through a doc where find the best practice on where to redirect user on successfully signup
// // what is useSession hook

// import { NextRequest } from "next/server";

// // use protected routes to set a session in nextjs
// export default function middleware(req: NextRequest) {
  
// }