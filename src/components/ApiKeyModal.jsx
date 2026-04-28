import { useState } from 'react'
import { saveApiKey, loadApiKey, clearApiKey } from '../utils/storage'
import { validateApiKey } from '../services/glmApi'

function ApiKeyModal({ isOpen, onClose, onValidated }) {
  const [apiKey, setApiKey] = useState(loadApiKey() || '')
  const [isValidating, setIsValidating] = useState(false)
  const [validationStatus, setValidationStatus] = useState(null)

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setValidationStatus({ success: false, message: '请输入API Key' })
      return
    }

    setIsValidating(true)
    setValidationStatus(null)

    const isValid = await validateApiKey(apiKey)

    if (isValid) {
      saveApiKey(apiKey)
      setValidationStatus({ success: true, message: 'API Key验证成功' })
      setTimeout(() => {
        onValidated()
        onClose()
      }, 1000)
    } else {
      setValidationStatus({ success: false, message: 'API Key验证失败，请检查密钥是否正确' })
    }

    setIsValidating(false)
  }

  const handleClear = () => {
    clearApiKey()
    setApiKey('')
    setValidationStatus({ success: true, message: '已清除API Key' })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">API Key 配置</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-400 mb-2">GLM API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm"
            />
          </div>

          {validationStatus && (
            <div className={`mb-4 p-3 rounded-xl text-sm ${
              validationStatus.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {validationStatus.message}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleSave}
              disabled={isValidating}
              className={`w-full py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                isValidating
                  ? 'bg-slate-700 text-slate-400'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700'
              }`}
            >
              {isValidating ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  验证中...
                </>
              ) : (
                '保存并验证'
              )}
            </button>

            {loadApiKey() && (
              <button
                onClick={handleClear}
                className="w-full py-3 px-6 rounded-xl font-medium bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
              >
                清除API Key
              </button>
            )}
          </div>

          <p className="mt-4 text-xs text-slate-500 text-center">
            API Key将加密保存在浏览器本地存储中
          </p>
        </div>
      </div>
    </div>
  )
}

export default ApiKeyModal
