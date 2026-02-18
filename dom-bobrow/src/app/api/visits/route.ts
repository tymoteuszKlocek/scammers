import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

function firstIp(xff: string | null) {
  if (!xff) return null
  return xff.split(',')[0]?.trim() || null
}

function sha256(value: string) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

export async function POST(req: Request) {
  const h = new Headers(req.headers)

  const body = await req.json().catch(() => ({} as any))
  const path = typeof body.path === 'string' ? body.path : null
  const referrer = typeof body.referrer === 'string' ? body.referrer : null

  const ip =
    firstIp(h.get('x-forwarded-for')) ??
    h.get('x-real-ip') ??
    null

  const pepper = process.env.IP_HASH_PEPPER ?? ''
  const ip_hash = ip ? sha256(`${ip}:${pepper}`) : null

  const user_agent = h.get('user-agent')

  // Vercel często dodaje geo nagłówki (coarse, bez GPS promptu)
  const country = h.get('x-vercel-ip-country')
  const region = h.get('x-vercel-ip-country-region')
  const city = h.get('x-vercel-ip-city')

  const supabase = supabaseAdmin()
  await supabase.from('visits').insert({
    ip_hash,
    user_agent,
    path,
    referrer,
    country,
    region,
    city,
  })

  return new NextResponse(null, { status: 204 })
}