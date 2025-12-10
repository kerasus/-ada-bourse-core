export function executeLuaScriptInWorker (luaCode: string, params: Record<string, any> = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./luaWorker.ts', import.meta.url), {
      type: 'module'
    })

    worker.onmessage = (event) => {
      const { success, result, error } = event.data
      if (success) {
        resolve(result)
      } else {
        reject(new Error(error))
      }
      worker.terminate()
    }

    worker.onerror = (err) => {
      reject(err)
      worker.terminate()
    }

    worker.postMessage({ script: luaCode, params })
  })
}
