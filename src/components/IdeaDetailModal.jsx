import { useState } from 'react'

function IdeaDetailModal({ idea, onClose }) {
  const [copied, setCopied] = useState(false)

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20'
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/20'
    return 'text-red-400 bg-red-500/20'
  }

  const handleCopy = async () => {
    const content = `## ${idea.name}

### 核心价值
${idea.description}

### 发散维度
${idea.dimensions}

### 核心功能
${idea.features?.map((f, i) => `${i + 1}. ${f}`).join('\n')}

### 技术栈建议
${idea.techStack}

### 可行性评估：${idea.feasibility}分
${idea.feasibilityReasons}

### 创新性评估：${idea.innovation}分
${idea.innovationReasons}

### 实现路径
${idea.implementation}`

    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-3xl w-full max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white">{idea.name}</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                copied
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  已复制
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">核心价值</h4>
            <p className="text-white text-lg">{idea.description}</p>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">发散维度</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                {idea.dimensions}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">核心功能</h4>
            <ul className="space-y-2">
              {idea.features?.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">技术栈建议</h4>
            <p className="text-slate-300 bg-slate-900/50 rounded-xl p-4">
              {idea.techStack}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-900/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">可行性评分</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(idea.feasibility)}`}>
                  {idea.feasibility}分
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${idea.feasibility >= 80 ? 'bg-green-500' : idea.feasibility >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${idea.feasibility}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">{idea.feasibilityReasons}</p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">创新性评分</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(idea.innovation)}`}>
                  {idea.innovation}分
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${idea.innovation >= 80 ? 'bg-green-500' : idea.innovation >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${idea.innovation}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">{idea.innovationReasons}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">实现路径</h4>
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4">
              <p className="text-slate-300 leading-relaxed">{idea.implementation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IdeaDetailModal
