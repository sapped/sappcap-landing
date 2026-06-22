"use client"

import { useEffect } from "react"

type ThemeProviderProps = {
  children: React.ReactNode
}

// Dark mode only. The theme switcher was removed, so this provider just
// guarantees the `dark` class is present on <html> (it's also hardcoded
// in app/layout.tsx) and never adds `light`.
export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light")
    root.classList.add("dark")
  }, [])

  return <>{children}</>
}
