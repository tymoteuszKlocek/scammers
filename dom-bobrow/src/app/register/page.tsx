'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/browser'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = supabaseBrowser()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    })
    if (error) alert(error.message)
    else alert('Check your email for the confirmation link!')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <form onSubmit={handleRegister} className="max-w-md w-full bg-white p-8 border border-gray-200 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold italic">Join the Lineage</h2>
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
        <button 
          disabled={loading}
          className="w-full bg-black text-white p-4 font-bold hover:opacity-90 disabled:bg-gray-400"
        >
          {loading ? 'PROCESSING...' : 'REGISTER'}
        </button>
      </form>
    </div>
  )
}