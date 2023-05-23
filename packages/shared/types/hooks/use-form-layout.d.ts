import {IAnyObject} from '../utils'
import { ComputedRef } from "vue";

type TEmit = (type: string, ...args: any[])=> void

export function useFormLayoutOptions({props, emit}: {props: IAnyObject, emit: TEmit }): {
  updateOptionChildren: (optionIndex: number, children: Array<IAnyObject>) => void
  updateOptionChild: (optionIndex: number, childIndex: number, childConfig:IAnyObject)=> void
  deleteOptionChild: (optionIndex: number, childIndex: number) => void
  copyOptionChild: (optionIndex: number, childIndex: number) =>void
  addOptionChild: (optionIndex: number, { newIndex: childIndex }: {childIndex: number})=> void
  emitSelectItem: (item: IAnyObject)=> void
  options: ComputedRef<IAnyObject>
}
