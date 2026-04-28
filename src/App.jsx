import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import InputPanel from './components/InputPanel'
import ResultTable from './components/ResultTable'
import IdeaDetailModal from './components/IdeaDetailModal'
import ApiKeyModal from './components/ApiKeyModal'
import { getSessions, getCurrentSession, setCurrentSession, createNewSession, deleteSession, addMessage } from './utils/sessionManager'
import { loadApiKey } from './utils/storage'
import { callGLM } from './services/glmApi'

function App() {
  const [sessions, setSessions] = useState([])
  const [currentSession, setCurrentSessionState] = useState(null)
  const [ideas, setIdeas] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedIdea, setSelectedIdea] = useState(null)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(true)

  useEffect(() => {
    const sessionsList = getSessions()
    const current = getCurrentSession()
    setSessions(sessionsList)
    setCurrentSessionState(current)
    setHasApiKey(true)

    if (current.messages.length > 0) {
      const lastMessage = current.messages[current.messages.length - 1]
      if (lastMessage.type === 'result' && lastMessage.content) {
        try {
          setIdeas(JSON.parse(lastMessage.content))
        } catch {
          setIdeas([])
        }
      }
    }
  }, [])

  const handleSelectSession = (sessionId) => {
    setCurrentSession(sessionId)
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSessionState(session)
      const lastMessage = session.messages[session.messages.length - 1]
      if (lastMessage?.type === 'result' && lastMessage.content) {
        try {
          setIdeas(JSON.parse(lastMessage.content))
        } catch {
          setIdeas([])
        }
      } else {
        setIdeas([])
      }
    }
    setError(null)
  }

  const handleCreateSession = () => {
    const newSession = createNewSession()
    setSessions([newSession, ...sessions])
    setCurrentSessionState(newSession)
    setIdeas([])
    setError(null)
  }

  const handleDeleteSession = (sessionId) => {
    const remainingSession = deleteSession(sessionId)
    setSessions(getSessions())
    setCurrentSessionState(remainingSession)
    
    const lastMessage = remainingSession.messages[remainingSession.messages.length - 1]
    if (lastMessage?.type === 'result' && lastMessage.content) {
      try {
        setIdeas(JSON.parse(lastMessage.content))
      } catch {
        setIdeas([])
      }
    } else {
      setIdeas([])
    }
  }

  const handleGenerate = async (prompt) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await callGLM(prompt)
      
      if (Array.isArray(result)) {
        setIdeas(result)
        addMessage(currentSession.id, {
          type: 'user',
          content: prompt,
          timestamp: Date.now()
        })
        addMessage(currentSession.id, {
          type: 'result',
          content: JSON.stringify(result),
          timestamp: Date.now()
        })
        setSessions(getSessions())
      } else {
        setError('API返回数据格式错误')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApiKeyValidated = () => {
    setHasApiKey(true)
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSession?.id}
        onSelectSession={handleSelectSession}
        onCreateSession={handleCreateSession}
        onDeleteSession={handleDeleteSession}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <div>
            <h2 className="text-lg font-semibold text-white">{currentSession?.title || '新会话'}</h2>
            <p className="text-xs text-slate-500">
              {currentSession?.messages.length || 0} 条消息
            </p>
          </div>
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors bg-slate-700 text-slate-400 hover:bg-slate-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {loadApiKey() ? '自定义密钥' : '使用默认密钥'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <InputPanel onGenerate={handleGenerate} isLoading={isLoading} />

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-400">
              {error}
            </div>
          )}

          {ideas.length > 0 && (
            <ResultTable ideas={ideas} onSelectIdea={setSelectedIdea} />
          )}

          {!isLoading && !error && ideas.length === 0 && currentSession?.messages.length > 0 && (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-400">当前会话暂无项目方案</p>
              <p className="text-sm text-slate-500 mt-1">输入一个想法开始生成</p>
            </div>
          )}
        </div>
      </div>

      {selectedIdea && (
        <IdeaDetailModal idea={selectedIdea} onClose={() => setSelectedIdea(null)} />
      )}

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onValidated={handleApiKeyValidated}
      />
    </div>
  )
}

export default App
