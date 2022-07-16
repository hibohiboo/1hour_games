if (import.meta.env.DEV) {
  ;(async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { worker } = await import('./mocks/browser')
    worker.start()
  })()
}

export const myFetch = async (input: RequestInfo, init: RequestInit) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, 10000)
  try {
    const res = await fetch(input, { signal: controller.signal, ...init })
    if (!res.ok) throw new Error(`${res.status}:${res.statusText}`)
    return res
  } catch (e) {
    console.warn(e)
    throw e
  } finally {
    clearTimeout(timeout)
  }
}
