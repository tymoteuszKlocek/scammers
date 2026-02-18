import './globals.css'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter italic">
          DOM BOBRÓW
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
          A legacy carved in history. Explore the lineage of the Bobrów family, 
          dating back to the 17th century. Private archives for descendants only.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link 
            href="/login" 
            className="px-8 py-4 bg-black text-white font-bold hover:bg-gray-800 transition-all"
          >
            ENTER ARCHIVES
          </Link>
          <Link 
            href="/register" 
            className="px-8 py-4 border-2 border-black font-bold hover:bg-gray-100 transition-all"
          >
            BECOME A MEMBER
          </Link>
        </div>
      </div>
      
      <footer className="absolute bottom-8 w-full px-8 flex justify-between items-center text-xs text-gray-400 uppercase tracking-widest">
        <span>Est. 1620 • Poland</span>
        <Link href="/admin" className="hover:text-black transition-colors">
          Admin
        </Link>
      </footer>
    </main>
  )
}