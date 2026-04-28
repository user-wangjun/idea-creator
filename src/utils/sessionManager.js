import { saveData, loadData, generateId } from './storage'

const createEmptySession = () => ({
  id: generateId(),
  title: '新会话',
  createdAt: Date.now(),
  messages: []
})

const getDefaultData = () => ({
  sessions: [createEmptySession()],
  currentSessionId: null
})

export const getSessions = () => {
  const data = loadData() || getDefaultData()
  return data.sessions
}

export const getCurrentSession = () => {
  const data = loadData() || getDefaultData()
  const sessions = data.sessions
  const currentId = data.currentSessionId || sessions[0]?.id
  
  return sessions.find(s => s.id === currentId) || sessions[0] || createEmptySession()
}

export const setCurrentSession = (sessionId) => {
  const data = loadData() || getDefaultData()
  data.currentSessionId = sessionId
  saveData(data)
}

export const addMessage = (sessionId, message) => {
  const data = loadData() || getDefaultData()
  const session = data.sessions.find(s => s.id === sessionId)
  
  if (session) {
    session.messages.push(message)
    
    if (!session.title || session.title === '新会话') {
      session.title = message.content.slice(0, 20) + (message.content.length > 20 ? '...' : '')
    }
  }
  
  saveData(data)
  return session
}

export const createNewSession = () => {
  const data = loadData() || getDefaultData()
  const newSession = createEmptySession()
  data.sessions.unshift(newSession)
  data.currentSessionId = newSession.id
  saveData(data)
  return newSession
}

export const deleteSession = (sessionId) => {
  const data = loadData() || getDefaultData()
  const index = data.sessions.findIndex(s => s.id === sessionId)
  
  if (index !== -1) {
    data.sessions.splice(index, 1)
    
    if (data.currentSessionId === sessionId) {
      data.currentSessionId = data.sessions[0]?.id || null
    }
  }
  
  saveData(data)
  return data.sessions[0] || createEmptySession()
}

export const updateSessionTitle = (sessionId, title) => {
  const data = loadData() || getDefaultData()
  const session = data.sessions.find(s => s.id === sessionId)
  
  if (session) {
    session.title = title
    saveData(data)
  }
  
  return session
}
