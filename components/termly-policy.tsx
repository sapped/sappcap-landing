'use client'

import { useEffect } from 'react'

export default function TermlyPolicy() {
  useEffect(() => {
    console.log('Adding Termly script...')
    const script = document.createElement('script')
    script.src = 'https://app.termly.io/embed-policy.min.js'
    script.id = 'termly-jssdk'
    script.async = true
    
    // Add dark mode override styles
    const style = document.createElement('style')
    style.textContent = `
      .dark [name="termly-embed"] {
        color-scheme: dark;
        --termly-bg-color: rgb(31, 41, 55) !important;
        --termly-text-color: rgb(229, 231, 235) !important;
        --termly-link-color: rgb(96, 165, 250) !important;
      }
    `
    document.head.appendChild(style)
    
    document.body.appendChild(script)

    return () => {
      const existingScript = document.getElementById('termly-jssdk')
      if (existingScript) {
        existingScript.remove()
        console.log('Termly script removed.')
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style)
      }
    }
  }, [])

  return (
    <div 
      name="termly-embed" 
      data-id="cbb1cde9-bf6b-487d-8be7-7d78577272b2"
      className="p-6 text-gray-900 dark:text-gray-100"
    />
  )
}