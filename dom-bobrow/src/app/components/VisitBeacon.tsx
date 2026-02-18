'use client'

import { useEffect } from 'react'

export function VisitBeacon() {
  useEffect(() => {
    const payload = {
      path: window.location.pathname,
      referrer: document.referrer || null,
    }

    fetch('/api/visit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {})
  }, [])

  return null
}