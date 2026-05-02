import { loadApiKey } from '../utils/storage'

const DEFAULT_API_KEY = '33901d235d1341bc85f4d8c3ea338848.EpUZsbPOj48ZQRv2'
const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
const MODEL_NAME = 'glm-4-flash'

const generatePrompt = (userInput) => `
你是一个专业的项目创意顾问和技术架构师。请根据用户的提示词，从多个角度发散思维，生成5个可落地的项目方案。

用户提示词：${userInput}

要求：
1. 每个方案必须真实可落地，具有创新性
2. 包含可行性评估（0-100分）和创新评分（0-100分）
3. 输出格式为JSON数组，包含以下字段：
   - name: 方案名称
   - description: 核心价值描述
   - dimensions: 发散维度说明
   - features: 核心功能列表（3-5项）
   - techStack: 技术栈建议
   - feasibility: 可行性评分（0-100）
   - feasibilityReasons: 可行性评估理由
   - innovation: 创新性评分（0-100）
   - innovationReasons: 创新性评估理由
   - implementation: 实现路径建议

请严格按照JSON格式输出，不要添加任何额外文字。
`

export const callGLM = async (prompt) => {
  const apiKey = loadApiKey() || DEFAULT_API_KEY
  console.log('使用API Key:', apiKey ? '已配置' : '使用默认')

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  }

  const body = JSON.stringify({
    model: MODEL_NAME,
    messages: [
      {
        role: 'system',
        content: '你是一个专业的项目创意顾问和技术架构师，擅长将模糊的想法转化为具体、可落地的项目方案。'
      },
      {
        role: 'user',
        content: generatePrompt(prompt)
      }
    ],
    temperature: 0.7,
    max_tokens: 4000
  })

  console.log('正在调用GLM API...', MODEL_NAME)

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60秒超时

    const response = await fetch(GLM_API_URL, {
      method: 'POST',
      headers: headers,
      body: body,
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    console.log('API响应状态:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API错误响应:', errorText)
      let errorMessage
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData?.error?.message || `HTTP error! status: ${response.status}`
      } catch {
        errorMessage = `HTTP error! status: ${response.status} - ${errorText}`
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log('API返回数据:', data)

    const content = data.choices?.[0]?.message?.content
    
    if (!content) {
      throw new Error('API返回数据格式错误')
    }

    try {
      return JSON.parse(content)
    } catch (parseError) {
      console.error('JSON解析失败，原始内容:', content)
      throw new Error('返回数据格式解析失败')
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('请求超时，请重试')
    }
    console.error('GLM API调用失败:', error)
    throw error
  }
}

export const validateApiKey = async (apiKey) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  }

  const body = JSON.stringify({
    model: MODEL_NAME,
    messages: [
      {
        role: 'user',
        content: 'hi'
      }
    ],
    max_tokens: 10
  })

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时

    const response = await fetch(GLM_API_URL, {
      method: 'POST',
      headers: headers,
      body: body,
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    console.error('API Key验证失败:', error)
    return false
  }
}
