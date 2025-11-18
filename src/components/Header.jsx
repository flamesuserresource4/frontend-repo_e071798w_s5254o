import { useState } from 'react'

function Header() {
  const [active, setActive] = useState('')
  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
          <span className="font-bold text-slate-800 text-lg">PDF Toolkit</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-600">
          {['Merge','Compress','Number','Split'].map((item)=> (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={()=>setActive(item)}
               className={`hover:text-slate-900 transition-colors ${active===item ? 'text-slate-900 font-semibold' : ''}`}>
              {item}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
