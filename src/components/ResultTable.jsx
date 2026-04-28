function ResultTable({ ideas, onSelectIdea }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20'
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/20'
    return 'text-red-400 bg-red-500/20'
  }

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-slate-700/50">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          项目方案 ({ideas.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">方案名称</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">核心价值</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">创新性</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">可行性</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {ideas.map((idea, index) => (
              <tr
                key={index}
                className="hover:bg-slate-700/30 transition-colors cursor-pointer"
                onClick={() => onSelectIdea(idea)}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center text-cyan-400 font-medium text-sm">
                      {index + 1}
                    </div>
                    <span className="text-white font-medium">{idea.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-slate-400 text-sm line-clamp-2 max-w-xs">{idea.description}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(idea.innovation)}`}>
                      {idea.innovation}分
                    </span>
                    <div className="w-16 h-1.5 bg-slate-700 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${getScoreBg(idea.innovation)}`}
                        style={{ width: `${idea.innovation}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(idea.feasibility)}`}>
                      {idea.feasibility}分
                    </span>
                    <div className="w-16 h-1.5 bg-slate-700 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${getScoreBg(idea.feasibility)}`}
                        style={{ width: `${idea.feasibility}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <button
                    className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-medium hover:bg-cyan-500/30 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectIdea(idea)
                    }}
                  >
                    查看详情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResultTable
