import { useState } from 'react'
import SearchForm from './components/SearchForm'
import CompanyCard from './components/CompanyCard'
import type { CompanyData } from './types'

// 检测环境: GitHub Pages 用公网IP, 本地用相对路径
const isGitHubPages = window.location.hostname.includes('github.io')
const API_BASE = isGitHubPages ? 'http://159.75.99.16:8765' : '/api'

function App() {
  const [result, setResult] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = async (name: string) => {
    setLoading(true)
    setError('')
    setResult(null)
    setSearched(true)

    try {
      const res = await fetch(`${API_BASE}/api/search?name=${encodeURIComponent(name)}`, {
        signal: AbortSignal.timeout(15000)
      })
      const data = await res.json()

      if (data.code === 200 && data.data) {
        setResult(data.data)
      } else {
        setError(data.msg || '未查到该企业信息')
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'TimeoutError') {
        setError('查询超时，请稍后重试')
      } else {
        setError(err instanceof Error ? err.message : '查询失败')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* 头部 */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-2xl">🏢</span>
          <div>
            <h1 className="text-lg font-bold text-slate-800">企查查Lite</h1>
            <p className="text-xs text-slate-400">免费企业信息速查</p>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <SearchForm onSearch={handleSearch} loading={loading} />

        {/* 加载中 */}
        {loading && (
          <div className="mt-8 text-center animate-fadeIn">
            <div className="flex justify-center gap-1.5 mb-3">
              <span className="loading-dot" />
              <span className="loading-dot" />
              <span className="loading-dot" />
            </div>
            <p className="text-sm text-slate-400">正在查询企业信息...</p>
          </div>
        )}

        {/* 错误 */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm animate-slideDown">
            <span className="font-medium">😅 {error}</span>
          </div>
        )}

        {/* 结果 */}
        {result && <CompanyCard data={result} />}

        {/* 无结果提示 */}
        {searched && !loading && !error && !result && (
          <div className="mt-8 text-center animate-fadeIn">
            <p className="text-slate-400 text-sm">换个企业名称试试？</p>
          </div>
        )}

        {/* 页尾 */}
        {!searched && (
          <div className="mt-8 text-center text-xs text-slate-300 space-y-1">
            <p>数据来源：爱企查 / 公开渠道</p>
            <p>仅供个人参考，请以官方公示信息为准</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
