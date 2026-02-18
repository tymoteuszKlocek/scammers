'use client'
import { useState, useEffect } from 'react'
import { supabaseBrowser } from '@/lib/supabase/browser'

export default function AdminPanel() {
    const [password, setPassword] = useState('')
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [visits, setVisits] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [photos, setPhotos] = useState<any[]>([])
    const checkPassword = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === 'tymekDymek') {
            setIsAuthorized(true)
        } else {
            alert('Wrong password.')
        }
    }


    useEffect(() => {
        async function fetchPhotos() {
            const { data } = await supabaseBrowser()
                .from('photos')
                .select('*, profiles:user_id(email)') // Zakładając że masz profil, lub po prostu user_id
                .order('created_at', { ascending: false })
            setPhotos(data || [])
        }


        async function fetchVisits() {
            setLoading(true)
            const supabase = supabaseBrowser()
            // Pobieramy dane z widoku publicznego (pamiętaj o RLS w Supabase!)
            // Jeśli RLS blokuje, musisz tymczasowo wyłączyć RLS dla 'visits' 
            // lub stworzyć API route z admin key.
            const { data, error } = await supabase
                .from('visits')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) console.error(error)
            else setVisits(data || [])
            setLoading(false)
        }
        
        if (isAuthorized) {
            fetchVisits();
            fetchPhotos();
        }
    }, [isAuthorized])



    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
                <form onSubmit={checkPassword} className="space-y-4 text-center">
                    <h1 className="text-xl font-bold tracking-widest uppercase">Terminal Access</h1>
                    <input
                        type="password"
                        placeholder="ENTER PASS"
                        className="bg-transparent border-b border-white p-2 outline-none text-center"
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" className="block w-full text-xs opacity-50 hover:opacity-100 transition-all">
                        [ EXECUTE ]
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white p-8 font-mono text-xs">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-black pb-4">
                    <h1 className="text-2xl font-bold uppercase">Surveillance Logs</h1>
                    <button onClick={() => window.location.reload()} className="hover:underline">REFRESH</button>
                </div>

                {loading ? <p>Loading logs...</p> : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black text-white">
                                    <th className="p-2">DATE</th>
                                    <th className="p-2">IP (HASH)</th>
                                    <th className="p-2">LOCATION</th>
                                    <th className="p-2">OS / BROWSER</th>
                                    <th className="p-2">PATH</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visits.map((v) => (
                                    <tr key={v.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-2 whitespace-nowrap">{new Date(v.created_at).toLocaleString()}</td>
                                        <td className="p-2 font-bold">{v.ip_hash?.substring(0, 8)}...</td>
                                        <td className="p-2">{v.city}, {v.country}</td>
                                        <td className="p-2 truncate max-w-xs" title={v.user_agent}>{v.user_agent}</td>
                                        <td className="p-2">{v.path}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}