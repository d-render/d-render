import type { Language, Translator, TranslatorOption, TranslatePair } from './types'
import zhCn from './lang/zh-cn'

export type { Language, Translator, TranslatorOption, TranslatePair }
export { default as zhCn } from './lang/zh-cn'
export { default as en } from './lang/en'

export const defaultLocale: Language = zhCn as Language

const getByPath = (obj: unknown, path: string): unknown => {
  if (!obj || !path) return undefined
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[key]
  }
  return current
}

export const translate = (
  path: string,
  option: TranslatorOption | undefined,
  locale: Language
): string => {
  const value = getByPath(locale, path)
  const text = typeof value === 'string' ? value : path
  return text.replace(/\{(\w+)\}/g, (_, key: string) => `${option?.[key] ?? `{${key}}`}`)
}

export const buildTranslator = (locale: Language | (() => Language)): Translator => {
  return (path, option) => {
    const current = typeof locale === 'function' ? locale() : locale
    return translate(path, option, current)
  }
}
