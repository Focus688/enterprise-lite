import { useState, useRef, useEffect } from 'react'

interface Props {
  onSearch: (name: string) => void
  loading: boolean
}

export default function SearchForm({ onSearch, loading }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const name = query.trim()
    if (name.length >= 2 && !loading) {
      onSearch(name)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="animate-slideDown">
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="输入企业全称或关键词..."
          className="w-full pl-12 pr-32 py-3.5 rounded-2xl bg-white border-2 border-slate-200
            text-slate-800 text-base placeholder-slate-400
            focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100
            transition-all duration-200 shadow-sm"
        />
        <button
          type="submit"
          disabled={query.trim().length < 2 || loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl
            bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium
            hover:from-blue-600 hover:to-blue-700
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200 shadow-lg shadow-blue-200 cursor-pointer"
        >
          {loading ? '查询中...' : '查询'}
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400 text-center">
        输入企业全称，查询工商注册信息
      </p>
    </form>
  )
}
