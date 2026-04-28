import { useState } from 'react'
import { formatDate } from '../utils/storage'
import { updateSessionTitle } from '../utils/sessionManager'

function Sidebar({ sessions, currentSessionId, onSelectSession, onCreateSession, onDeleteSession }) {
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  const handleStartEdit = (session) => {
    setEditingId(session.id)
    setEditTitle(session.title)
  }

  const handleSaveEdit = (sessionId) => {
    if (editTitle.trim()) {
      updateSessionTitle(sessionId, editTitle.trim())
    }
    setEditingId(null)
    setEditTitle('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
  }

  return (
    <div className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">灵感放大器</h1>
            <p className="text-xs text-slate-400">发散思维 · 创造无限</p>
          </div>
        </div>
      </div>

      <button
        onClick={onCreateSession}
        className="mx-4 mt-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        新会话
      </button>

      <div className="flex-1 overflow-y-auto py-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`group relative mx-3 my-1.5 rounded-xl transition-all cursor-pointer ${
              currentSessionId === session.id
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30'
                : 'hover:bg-slate-800/50 border border-transparent'
            }`}
          >
            {editingId === session.id ? (
              <div className="p-3">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(session.id)
                    if (e.key === 'Escape') handleCancelEdit()
                  }}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSaveEdit(session.id)}
                    className="flex-1 py-1.5 px-3 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs hover:bg-cyan-500/30 transition-colors"
                  >
                    保存
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 py-1.5 px-3 bg-slate-700/50 text-slate-400 rounded-lg text-xs hover:bg-slate-700 transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => onSelectSession(session.id)}
                className="p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-medium truncate flex-1 ${
                    currentSessionId === session.id ? 'text-white' : 'text-slate-300'
                  }`}>
                    {session.title}
                  </p>
                  <span className="text-xs text-slate-500 flex-shrink-0">
                    {formatDate(session.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {session.messages.length} 条消息
                </p>
              </div>
            )}

            {!editingId && sessions.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteSession(session.id)
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}

            {!editingId && currentSessionId !== session.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleStartEdit(session)
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-700/50">
        <div className="text-xs text-slate-500 text-center">
          数据保存在本地浏览器
        </div>
      </div>
    </div>
  )
}

export default Sidebar
