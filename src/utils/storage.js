const STORAGE_KEY = 'idea_amplifier_data'
const API_KEY_KEY = 'idea_amplifier_api_key'

export const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('保存数据失败:', error)
    return false
  }
}

export const loadData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('加载数据失败:', error)
    return null
  }
}

export const saveApiKey = (apiKey) => {
  try {
    localStorage.setItem(API_KEY_KEY, btoa(apiKey))
    return true
  } catch (error) {
    console.error('保存API Key失败:', error)
    return false
  }
}

export const loadApiKey = () => {
  try {
    const encodedKey = localStorage.getItem(API_KEY_KEY)
    return encodedKey ? atob(encodedKey) : null
  } catch (error) {
    console.error('加载API Key失败:', error)
    return null
  }
}

export const clearApiKey = () => {
  try {
    localStorage.removeItem(API_KEY_KEY)
    return true
  } catch (error) {
    console.error('清除API Key失败:', error)
    return false
  }
}

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
