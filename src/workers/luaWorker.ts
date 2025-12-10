import { runSafeLuaScript } from '../services/lua-runner'

self.onmessage = (e: MessageEvent) => {
  const { script, params } = e.data

  try {
    const result = runSafeLuaScript(script, params)
    self.postMessage({ success: true, result })
  } catch (error: any) {
    self.postMessage({
      success: false,
      error: error.message || 'Unknown error'
    })
  }
}
