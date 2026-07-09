import { computed, inject, isRef, ref, unref } from 'vue'
import type { InjectionKey, MaybeRef, Ref } from 'vue'
import {
  buildTranslator,
  defaultLocale,
  type Language,
  type Translator
} from '../locale'

export type { Language, Translator }

export type LocaleContext = {
  locale: Ref<Language>
  lang: Ref<string>
  t: Translator
}

export const localeContextKey: InjectionKey<Ref<Language | undefined>> = Symbol('drLocaleContextKey')

export const buildLocaleContext = (locale: MaybeRef<Language>): LocaleContext => {
  const lang = computed(() => unref(locale).name)
  const localeRef = isRef(locale) ? locale : ref(locale)
  return {
    lang,
    locale: localeRef as Ref<Language>,
    t: buildTranslator(() => unref(locale))
  }
}

export const useLocale = (localeOverrides?: Ref<Language | undefined>) => {
  const locale = localeOverrides || inject(localeContextKey, ref())!
  return buildLocaleContext(computed(() => locale.value || defaultLocale))
}
