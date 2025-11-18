import { useState } from 'react'

function UploadZone({ multiple=false, onFiles }) {
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = (files) => {
    if (!files) return
    const arr = Array.from(files)
    onFiles(arr)
  }

  return (
    <div
      onDragOver={(e)=>{e.preventDefault(); setDragOver(true)}}
      onDragLeave={()=>setDragOver(false)}
      onDrop={(e)=>{e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files)}}
      className={`border-2 border-dashed rounded-xl p-6 text-center transition ${dragOver? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white'}`}
    >
      <input type="file" accept="application/pdf" multiple={multiple} onChange={(e)=>handleFiles(e.target.files)} className="hidden" id="fileInput" />
      <label htmlFor="fileInput" className="cursor-pointer block">
        <div className="text-slate-700 mb-2">Drag & drop your PDF{multiple? 's' : ''} here</div>
        <div className="text-slate-500 text-sm">or click to browse</div>
      </label>
    </div>
  )
}

export default UploadZone
