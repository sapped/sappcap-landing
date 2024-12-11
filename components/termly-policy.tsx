'use client'

import { useEffect } from 'react'

interface TermlyPolicyProps {
  policyId: string;
}

export default function TermlyPolicy({ policyId }: TermlyPolicyProps) {
  const directUrl = `https://app.termly.io/policy-viewer/policy.html?policyUUID=${policyId}`

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
    <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <a 
          href={directUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
        >
          View Direct Policy Link
        </a>
      </div>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <div 
        name="termly-embed"
        data-id={policyId}
        className="p-6 text-gray-900 dark:text-gray-100"
      />
    </>
  )
}