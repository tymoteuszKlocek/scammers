import { supabaseAdmin } from "@/lib/supabase/admin"

export default async function Dashboard() {
  const supabase = supabaseAdmin()
  const { data: people } = await supabase
    .from('people')
    .select('*')
    .order('birth_year', { ascending: true })

  return (
    <main className="min-h-screen p-8 bg-white">
      <header className="max-w-4xl mx-auto mb-12 flex justify-between items-end border-b pb-4">
        <h1 className="text-3xl font-bold italic">The Bobrów Lineage</h1>
        <span className="text-sm text-gray-400 uppercase tracking-widest">Confidential</span>
      </header>

      <div className="max-w-4xl mx-auto grid gap-8">
        {people?.map((person) => (
          <div key={person.id} className="border-l-4 border-black pl-6 py-2">
            <div className="flex justify-between items-baseline">
              <h3 className="text-xl font-bold">{person.full_name}</h3>
              <span className="text-gray-500 tabular-nums">{person.birth_year} — {person.death_year}</span>
            </div>
            <p className="text-sm text-gray-400 italic mb-2">{person.title}</p>
            <p className="text-gray-700">{person.blurb}</p>
          </div>
        ))}
      </div>
      
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-gray-50 border border-dashed border-gray-300 text-center">
        <p className="mb-4 font-medium">To access full interactive tree and verify your identity:</p>
        <a href="/app/verify" className="inline-block bg-black text-white px-6 py-3 font-bold">
          VERIFY DESCENDANT STATUS
        </a>
      </div>
    </main>
  )
}