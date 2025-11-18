import { useState } from 'react'

function ToolCard({ id, title, description, children }) {
  return (
    <section id={id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <a href="#top" className="text-xs text-slate-400 hover:text-slate-600">Back to top</a>
      </div>
      {children}
    </section>
  )
}

export default ToolCard
