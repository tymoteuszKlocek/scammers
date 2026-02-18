import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  const h = new Headers(req.headers)
  const body = await req.json().catch(() => ({} as any))

  const ua = h.get('user-agent') || ''
  
  // Prosty parser User-Agent dla człowieka
  let device = "Unknown Device"
  if (ua.includes("Windows")) device = "Windows PC"
  else if (ua.includes("iPhone")) device = "iPhone"
  else if (ua.includes("Android")) device = "Android Phone"
  else if (ua.includes("Macintosh")) device = "MacBook/iMac"

  let browser = "Unknown Browser"
  if (ua.includes("Chrome")) browser = "Chrome"
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari"
  else if (ua.includes("Firefox")) browser = "Firefox"
  else if (ua.includes("Edg")) browser = "Edge"

  const supabase = supabaseAdmin()
  
  // Zapisujemy czytelne dane zamiast tylko hasha
  await supabase.from('visits').insert({
    user_agent: `${device} (${browser})`, // Przykład: "Windows PC (Chrome)"
    path: body.path || '/',
    country: h.get('x-vercel-ip-country') || 'Local',
    city: h.get('x-vercel-ip-city') || 'Localhost',
    region: h.get('x-vercel-ip-country-region') || 'N/A',
    referrer: h.get('referer') || 'Direct'
  })

  return new NextResponse(null, { status: 204 })
}