import { useState } from 'react'
import Header from './components/Header'
import UploadZone from './components/UploadZone'
import ToolCard from './components/ToolCard'

const backendBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const callMerge = async (files) => {
    if (!files || files.length < 2) { alert('Please select at least two PDFs'); return }
    setBusy(true); setStatus('Merging...')
    const form = new FormData()
    files.forEach(f=> form.append('files', f))
    const res = await fetch(`${backendBase}/api/pdf/merge`, { method: 'POST', body: form })
    if (!res.ok) { alert('Merge failed'); setBusy(false); return }
    const blob = await res.blob()
    downloadBlob(blob, 'merged.pdf')
    setBusy(false); setStatus('')
  }

  const callCompress = async (files) => {
    if (!files || files.length !== 1) { alert('Please select one PDF'); return }
    setBusy(true); setStatus('Compressing...')
    const form = new FormData()
    form.append('file', files[0])
    const res = await fetch(`${backendBase}/api/pdf/compress`, { method: 'POST', body: form })
    if (!res.ok) { alert('Compression failed'); setBusy(false); return }
    const blob = await res.blob()
    downloadBlob(blob, `compressed_${files[0].name}`)
    setBusy(false); setStatus('')
  }

  const callNumber = async (files, position, startAt, fontSize) => {
    if (!files || files.length !== 1) { alert('Please select one PDF'); return }
    setBusy(true); setStatus('Adding numbers...')
    const form = new FormData()
    form.append('file', files[0])
    form.append('position', position)
    form.append('start_at', startAt)
    form.append('font_size', fontSize)
    const res = await fetch(`${backendBase}/api/pdf/number`, { method: 'POST', body: form })
    if (!res.ok) { alert('Numbering failed'); setBusy(false); return }
    const blob = await res.blob()
    downloadBlob(blob, `numbered_${files[0].name}`)
    setBusy(false); setStatus('')
  }

  const callSplit = async (files, ranges) => {
    if (!files || files.length !== 1) { alert('Please select one PDF'); return }
    setBusy(true); setStatus('Splitting...')
    const form = new FormData()
    form.append('file', files[0])
    if (ranges) form.append('ranges', ranges)
    const res = await fetch(`${backendBase}/api/pdf/split`, { method: 'POST', body: form })
    if (!res.ok) { alert('Split failed'); setBusy(false); return }
    const blob = await res.blob()
    downloadBlob(blob, `split_${files[0].name}.zip`)
    setBusy(false); setStatus('')
  }

  // Local UI states for controls
  const [numberPos, setNumberPos] = useState('bottom-right')
  const [startAt, setStartAt] = useState(1)
  const [fontSize, setFontSize] = useState(10)
  const [splitRanges, setSplitRanges] = useState('')

  return (
    <div id="top" className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900">All-in-one PDF Toolkit</h1>
          <p className="text-slate-600 mt-2">Merge, compress, add page numbers, and split PDFs in your browser.</p>
        </div>

        {status && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 text-blue-800 px-4 py-3 text-sm">{busy ? '⏳ ' : ''}{status}</div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <ToolCard id="merge" title="Merge PDFs" description="Combine multiple PDFs into a single file in the order you select.">
            <UploadZone multiple onFiles={callMerge} />
          </ToolCard>

          <ToolCard id="compress" title="Compress PDF" description="Reduce file size while keeping readable quality.">
            <div className="space-y-4">
              <UploadZone onFiles={callCompress} />
            </div>
          </ToolCard>

          <ToolCard id="number" title="Number Pages" description="Add page numbers to your PDF at your preferred position.">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm text-slate-600">Position
                  <select value={numberPos} onChange={(e)=>setNumberPos(e.target.value)} className="mt-1 w-full border rounded px-2 py-1">
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-center">Bottom Center</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-center">Top Center</option>
                    <option value="top-right">Top Right</option>
                  </select>
                </label>
                <label className="text-sm text-slate-600">Start at
                  <input type="number" value={startAt} min={0} onChange={(e)=>setStartAt(e.target.value)} className="mt-1 w-full border rounded px-2 py-1" />
                </label>
              </div>
              <label className="text-sm text-slate-600">Font size
                <input type="number" value={fontSize} min={6} max={48} onChange={(e)=>setFontSize(e.target.value)} className="mt-1 w-full border rounded px-2 py-1" />
              </label>
              <UploadZone onFiles={(files)=>callNumber(files, numberPos, startAt, fontSize)} />
            </div>
          </ToolCard>

          <ToolCard id="split" title="Split PDF" description="Extract pages or ranges. Example: 1-3,5,7-9. Leave empty to split every page.">
            <div className="space-y-4">
              <label className="text-sm text-slate-600">Ranges (optional)
                <input type="text" value={splitRanges} onChange={(e)=>setSplitRanges(e.target.value)} placeholder="e.g. 1-3,5,7-9" className="mt-1 w-full border rounded px-2 py-1" />
              </label>
              <UploadZone onFiles={(files)=>callSplit(files, splitRanges)} />
            </div>
          </ToolCard>
        </div>

        <div className="text-center text-xs text-slate-500">Files are processed server-side and never stored.</div>
      </main>
    </div>
  )
}

export default App
