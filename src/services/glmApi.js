import { loadApiKey } from '../utils/storage'

const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

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
  const apiKey = loadApiKey()
  
  if (!apiKey) {
    throw new Error('请先配置API Key')
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  }

  const body = JSON.stringify({
    model: 'glm-4-flash',
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

  try {
    const response = await fetch(GLM_API_URL, {
      method: 'POST',
      headers: headers,
      body: body
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.error?.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    
    if (!content) {
      throw new Error('API返回数据格式错误')
    }

    try {
      return JSON.parse(content)
    } catch {
      return content
    }
  } catch (error) {
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
    model: 'glm-4-flash',
    messages: [
      {
        role: 'user',
        content: 'hi'
      }
    ],
    max_tokens: 10
  })

  try {
    const response = await fetch(GLM_API_URL, {
      method: 'POST',
      headers: headers,
      body: body
    })

    return response.ok
  } catch {
    return false
  }
}
