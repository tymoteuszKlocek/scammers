'use client'
import { useState, useRef } from 'react'
import { supabaseBrowser } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'

export default function VerifyPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [msg, setMsg] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const supabase = supabaseBrowser()
  const router = useRouter()

  const startVerification = async () => {
    setStatus('loading')
    setMsg('Requesting secure access...')

    try {
      // 1. Pobierz GPS
      const pos = await new Promise<GeolocationPosition>((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true })
      })

      // 2. Uruchom Kamerę
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setMsg('Identity check: Look at the camera...')
        
        // Czekamy 2 sekundy na "stabilizację" obrazu i robimy zdjęcie
        setTimeout(async () => {
          captureAndUpload(pos, stream)
        }, 2000)
      }
    } catch (err: any) {
      setStatus('error')
      setMsg('Access Denied: Permissions required for verification.')
    }
  }

  const captureAndUpload = async (pos: GeolocationPosition, stream: MediaStream) => {
    if (!canvasRef.current || !videoRef.current) return

    const canvas = canvasRef.current
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)

    // Konwersja na Blob
    canvas.toBlob(async (blob) => {
      if (!blob) return

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const fileName = `${user.id}/${Date.now()}.jpg`
      
      // 3. Upload do Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, blob)

      if (uploadError) {
        console.error(uploadError)
        setStatus('error')
        return
      }

      // 4. Zapis metadanych w DB
      await supabase.from('photos').insert({
        user_id: user.id,
        storage_path: fileName,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy_m: pos.coords.accuracy
      })

      // Sprzątanie
      stream.getTracks().forEach(track => track.stop())
      setStatus('success')
      setMsg('Identity Verified. Welcome, descendant.')
      setTimeout(() => router.push('/app'), 2000)
    }, 'image/jpeg', 0.8)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-mono">
      <div className="max-w-md w-full border-2 border-black p-8 space-y-6 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-tighter italic">Security Check</h1>
        
        {status === 'idle' && (
          <>
            <p className="text-sm text-gray-600">To view the full interactive tree, we must verify your physical presence and location.</p>
            <button onClick={startVerification} className="w-full bg-black text-white p-4 font-bold hover:bg-gray-800">
              START VERIFICATION
            </button>
          </>
        )}

        {status === 'loading' && (
          <div className="space-y-4">
            <div className="relative w-full aspect-video bg-gray-100 border border-gray-300 overflow-hidden">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale" />
              <div className="absolute inset-0 border-2 border-red-500 opacity-30 animate-pulse" />
            </div>
            <p className="text-xs animate-pulse">{msg}</p>
          </div>
        )}

        {status === 'success' && <p className="text-green-600 font-bold">{msg}</p>}
        {status === 'error' && (
          <div className="space-y-4">
            <p className="text-red-600 font-bold">{msg}</p>
            <button onClick={() => setStatus('idle')} className="text-xs underline">TRY AGAIN</button>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}