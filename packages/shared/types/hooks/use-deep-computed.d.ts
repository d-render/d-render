import { ComputedRef } from 'vue'
export function useDeepComputed<T=any>(option: { get():T, set(val:T):void }): ComputedRef<T>
