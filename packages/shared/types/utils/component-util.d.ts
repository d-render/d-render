import { IAnyObject } from './util'
type TComponentScheme = {
  propsScheme: Record<string, IAnyObject>
  eventScheme: Record<string, IAnyObject>
  slotsScheme: Record<string, IAnyObject>
} & IAnyObject

export function generateProps (componentScheme: TComponentScheme): Record<string, IAnyObject>

export function generateEmits (componentScheme: TComponentScheme): Array<string>

