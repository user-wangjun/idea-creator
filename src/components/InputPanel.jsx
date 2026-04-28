import { useState } from 'react'
import { examples } from '../data/examples'

function InputPanel({ onGenerate, isLoading }) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt.trim())
      setPrompt('')
    }
  }

  const handleExampleClick = (examplePrompt) => {
    setPrompt(examplePrompt)
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        输入你的想法
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="输入一个词或一句话描述你的想法，如：一个帮助人们学习英语的APP..."
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 resize-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            rows={3}
          />
          <div className="absolute bottom-3 right-3">
            <span className="text-xs text-slate-500">{prompt.length} 字</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!prompt.trim() || isLoading}
          className={`w-full mt-4 py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
            !prompt.trim() || isLoading
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transform hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              放大中...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              放大灵感
            </>
          )}
        </button>
      </form>

      <div className="mt-6">
        <p className="text-xs text-slate-500 mb-3">试试这些示例：</p>
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => handleExampleClick(example.prompt)}
              className="px-3 py-1.5 bg-slate-700/50 border border-slate-600 rounded-full text-sm text-slate-300 hover:bg-slate-700 hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
            >
              {example.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InputPanel
