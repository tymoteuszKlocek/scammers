'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/browser'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = supabaseBrowser()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else router.push('/app')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <form onSubmit={handleLogin} className="max-w-md w-full bg-white p-8 border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold italic">Access Archives</h2>
        <input 
          type="email" placeholder="Email" required
          className="w-full p-3 border border-gray-300 focus:border-black outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Password" required
          className="w-full p-3 border border-gray-300 focus:border-black outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-black text-white p-4 font-bold hover:opacity-90">
          LOGIN
        </button>
      </form>
    </div>
  )
}