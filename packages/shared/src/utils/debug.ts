class DRenderError extends Error {
  constructor (m: string) {
    super(m)
    this.name = 'DRenderError'
  }
}
export function debugWarn (scope: string | Error, message?: string): void {
  if (process.env.NODE_ENV !== 'production') {
    const error: Error = typeof scope === 'string'
      ? new DRenderError(`[${scope}] ${message}`)
      : scope
    // eslint-disable-next-line no-console
    console.warn(error)
  }
}
