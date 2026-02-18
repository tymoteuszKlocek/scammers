import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const adminPass = req.headers.get('x-admin-pass')
  if (adminPass !== 'tymekDymek') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = supabaseAdmin()

  // Pobierz wizyty
  const { data: visits, error: vErr } = await supabase
    .from('visits')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  // Pobierz zdjęcia
  const { data: photos, error: pErr } = await supabase
    .from('photos')
    .select('*')
    .order('created_at', { ascending: false })

  if (vErr || pErr) {
    return NextResponse.json({ error: vErr?.message || pErr?.message }, { status: 500 })
  }

  // Generuj bezpieczne linki do zdjęć (Signed URLs)
  const photosWithUrls = await Promise.all(
    (photos || []).map(async (p) => {
      const { data } = await supabase.storage
        .from('photos')
        .createSignedUrl(p.storage_path, 3600) // link ważny 1h
      return { ...p, signed_url: data?.signedUrl }
    })
  )

  return NextResponse.json({ visits: visits || [], photos: photosWithUrls })
}