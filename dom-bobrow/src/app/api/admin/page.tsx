'use client'
import { useEffect, useState } from 'react'

type AdminData = { visits: any[]; photos: any[] }

export default function AdminPanel() {
    const [password, setPassword] = useState('')
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [data, setData] = useState<AdminData>({ visits: [], photos: [] })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const checkPassword = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === 'tymekDymek') setIsAuthorized(true)
        else alert('Wrong password.')
    }

    useEffect(() => {
        if (!isAuthorized) return
            ; (async () => {
                setLoading(true)
                setError(null)
                const res = await fetch('/api/admin/overview', {
                    headers: { 'x-admin-pass': password },
                })
                const json = await res.json()
                if (!res.ok) {
                    setError(json?.error ?? 'Failed to load')
                } else {
                    setData(json)
                }
                setLoading(false)
            })()
    }, [isAuthorized, password])

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
                <form onSubmit={checkPassword} className="space-y-4 text-center">
                    <h1 className="text-xl font-bold tracking-widest uppercase">Admin Access</h1>
                    <input
                        type="password"
                        placeholder="ENTER PASS"
                        className="bg-transparent border-b border-white p-2 outline-none text-center"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" className="block w-full text-xs opacity-50 hover:opacity-100 transition-all">
                        [ ENTER ]
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white p-8 font-mono text-xs">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8 border-b border-black pb-4">
                    <h1 className="text-2xl font-bold uppercase">Admin Overview</h1>
                    <button onClick={() => location.reload()} className="hover:underline">REFRESH</button>
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-600">Error: {error}</p>}

                <h2 className="text-lg font-bold uppercase mb-2">Visits</h2>
                <div className="overflow-x-auto border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black text-white">
                                <th className="p-2">DATE</th>
                                <th className="p-2">IP_HASH</th>
                                <th className="p-2">CITY</th>
                                <th className="p-2">COUNTRY</th>
                                <th className="p-2">PATH</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.visits.map((v) => (
                                <tr key={v.id} className="border-b border-gray-200">
                                    <td className="p-2 whitespace-nowrap">{new Date(v.created_at).toLocaleString()}</td>
                                    <td className="p-2">{v.ip_hash?.slice(0, 10)}…</td>
                                    <td className="p-2">{v.city ?? '-'}</td>
                                    <td className="p-2">{v.country ?? '-'}</td>
                                    <td className="p-2">{v.path ?? '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h2 className="text-lg font-bold uppercase mt-10 mb-2">Photos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.photos.map((p) => (
                        <div key={p.id} className="border border-gray-200 p-3">
                            <div className="text-[10px] text-gray-500 break-all mb-2">{p.user_id}</div>
                            <div className="text-[10px] text-gray-500 mb-2">
                                {new Date(p.created_at).toLocaleString()}
                            </div>
                            <div className="text-[10px] mb-2">
                                {p.lat && p.lng ? `GPS: ${p.lat}, ${p.lng} (±${p.accuracy_m}m)` : 'GPS: -'}
                            </div>
                            {p.signed_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={p.signed_url} alt="photo" className="w-full aspect-square object-cover border" />
                            ) : (
                                <div className="w-full aspect-square bg-gray-100 grid place-items-center text-gray-400">
                                    No URL
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}