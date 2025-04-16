'use client'

import { useTokenStore } from '@/lib/store/tokenStore'
import ProtectedRouteProvider from '@/utils/provider/ProtectedRouteProvider'
import React from 'react'

export default function Dashboard() {
  const { accessToken } = useTokenStore()
  return (
    <ProtectedRouteProvider>
       <div>
        Dashboard
        { accessToken }
      </div>
    </ProtectedRouteProvider>
  )
}
