import { Component, Slot } from 'vue'
export * from './helper/index'
export * from './hooks/index'
export * from './utils/index'
type On<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: T[K]
}
type Slots<T> = {
  'v-slots'?: {
    [K in keyof T]?: (arg0: T[K]) => Slot
  }
  children?: {
    [K in keyof T]?: (arg0: T[K]) => Slot
  }
}

// vue3 component jsx的辅助类型
export declare type CustomComponent<T=any,M=any, S=any> = new (Props: {[K in keyof T]: T[K]} & On<M> & Slots<S>) => Component<{[K in keyof T]: T[K]} & On<M> & Slots<S>>
