import type { CompanyData } from '../types'

interface Props {
  data: CompanyData
}

const LABEL_STYLE = 'text-xs text-slate-400 font-medium uppercase tracking-wider mb-1'
const VALUE_STYLE = 'text-sm text-slate-700'
const CARD_STYLE = 'bg-white rounded-2xl border border-slate-100 shadow-sm p-5'

export default function CompanyCard({ data }: Props) {
  const fieldRows = [
    { label: '法定代表人', value: data.legal_person, icon: '👤' },
    { label: '注册资本', value: data.registered_capital, icon: '💰' },
    { label: '成立日期', value: data.founded_date, icon: '📅' },
    { label: '经营状态', value: data.status, icon: '📊' },
    { label: '行业', value: data.industry || '-', icon: '🏭' },
    { label: '登记机关', value: data.reg_auth || '-', icon: '🏛️' },
    { label: '参保人数', value: data.employees || '-', icon: '👥' },
  ]

  const codeRows = [
    { label: '统一社会信用代码', value: data.unified_code },
    { label: '注册号', value: data.reg_number || '-' },
    { label: '组织机构代码', value: data.org_code || '-' },
    { label: '纳税人识别号', value: data.tax_id || '-' },
  ]

  return (
    <div className="mt-6 space-y-4 animate-fadeIn">
      {/* 企业名称头 */}
      <div className={`${CARD_STYLE} text-center`}>
        <div className="text-3xl mb-2">🏢</div>
        <h2 className="text-xl font-bold text-slate-800">{data.name}</h2>
        {data.source && (
          <p className="text-xs text-slate-400 mt-1">数据来源：{data.source}</p>
        )}
      </div>

      {/* 关键信息网格 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {fieldRows.map((row, i) => (
          row.value && row.value !== '-' ? (
            <div key={i} className={`${CARD_STYLE} text-center`}>
              <span className="text-lg">{row.icon}</span>
              <p className={LABEL_STYLE}>{row.label}</p>
              <p className={`${VALUE_STYLE} font-medium`}>{row.value}</p>
            </div>
          ) : null
        ))}
      </div>

      {/* 代码信息 */}
      <div className={CARD_STYLE}>
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <span>🔑</span> 注册代码
        </h3>
        <div className="space-y-2">
          {codeRows.map((row, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
              <span className="text-xs text-slate-400">{row.label}</span>
              <span className="text-sm text-slate-700 font-mono bg-slate-50 px-2 py-0.5 rounded">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 注册地址 */}
      {data.address && (
        <div className={CARD_STYLE}>
          <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <span>📍</span> 注册地址
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">{data.address}</p>
        </div>
      )}

      {/* 经营范围 */}
      {data.scope && (
        <div className={CARD_STYLE}>
          <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <span>📋</span> 经营范围
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">{data.scope}</p>
        </div>
      )}

      {/* 主要人员 */}
      {data.contacts && data.contacts.length > 0 && (
        <div className={CARD_STYLE}>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <span>👥</span> 主要人员
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.contacts.map((c, i) => (
              <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 股东信息 */}
      {data.investors && data.investors.length > 0 && (
        <div className={CARD_STYLE}>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <span>🏦</span> 股东信息
          </h3>
          <div className="space-y-1">
            {data.investors.map((inv, i) => (
              <div key={i} className="text-sm text-slate-600 py-1 border-b border-slate-50 last:border-0">
                {inv}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 免责声明 */}
      <div className="text-center text-xs text-slate-300 py-4">
        数据仅供参考，以国家企业信用信息公示系统为准
      </div>
    </div>
  )
}
