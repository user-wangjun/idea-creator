
import { callGLM } from './src/services/glmApi.js'

async function testAPI() {
  console.log('开始测试API...')
  
  try {
    console.log('发送测试请求...')
    const result = await callGLM('测试')
    console.log('✅ API调用成功!')
    console.log('结果:', result)
  } catch (error) {
    console.error('❌ API调用失败:', error)
  }
}

testAPI()
