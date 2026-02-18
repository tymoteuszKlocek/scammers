import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SKIP_PREFIXES = ['/api', '/_next', '/favicon.ico', '/robots.txt', '/sitemap.xml']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Fire-and-forget log (don’t block response)
  const url = req.nextUrl.clone()
  url.pathname = '/api/visits'

  fetch(url, {
    method: 'POST',
    headers: {
      // forward relevant headers for geo + ip
      'x-forwarded-for': req.headers.get('x-forwarded-for') ?? '',
      'x-real-ip': req.headers.get('x-real-ip') ?? '',
      'user-agent': req.headers.get('user-agent') ?? '',
      'referer': req.headers.get('referer') ?? '',
      'x-vercel-ip-country': req.headers.get('x-vercel-ip-country') ?? '',
      'x-vercel-ip-country-region': req.headers.get('x-vercel-ip-country-region') ?? '',
      'x-vercel-ip-city': req.headers.get('x-vercel-ip-city') ?? '',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ path: pathname }),
  }).catch(() => {})

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}