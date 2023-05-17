import { Component } from 'vue'
export * from './hooks'
export * from './utils'
export * from './helper'

type On<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: T[K]
}
type Slots<T> = {
  "v-slots"?: {
    [K in keyof T]?: (arg0: T[K]) => any
  }
  children?: {
    [K in keyof T]?: (arg0: T[K]) => any
  }
}

// vue3 component jsx的辅助类型
export declare type CustomComponent<T=any,M=any, S=any> = new (Props: {[K in keyof T]: T[K]} & On<M> & Slots<S>) => Component<{[K in keyof T]: T[K]} & On<M> & Slots<S>>
