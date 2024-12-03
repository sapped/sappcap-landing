'use client'

import { useEffect } from 'react'
import { initGA, logPageView } from '@/lib/analytics'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initGA()
    logPageView()
  }, [])

  return <>{children}</>
}