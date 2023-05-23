import { IAnyObject } from '../utils'
interface ICipConfig  {
  searchReset: boolean
  searchGrid: boolean
  limit: {
    input: number
    textarea: number
  } & IAnyObject
  buttonConfigMap: IAnyObject
  layout: {
    pageTheme?: 'dg' | 'standard' | 'supergravity'
  } & IAnyObject
  number?: {
    precision: number
    thousandSeparator: boolean
  } & IAnyObject
  paginationCompact?: boolean
  table?: {
    defaultViewValue?: string
  } & IAnyObject
  form?: {
    labelPosition?: 'top'|'left'| 'right'
    border: boolean
  } & IAnyObject
  main?: {
    dropdownLogout?: boolean
  } & IAnyObject
  withQuery?: boolean
  fileUpload?: any
  logout?: any
  defaultViewValue?: string | number
  namespace?: 'el' | ({} & string)
  range: {
    separate?: boolean
  } & IAnyObject
  message?: any
  [propname: string]: any
}

interface ICipPageConfig  {
  table?: {
    border?: boolean
  } & IAnyObject
  searchForm?: {
    labelPosition?: 'top'|'left'| 'right'
  } & IAnyObject
  form?: {
    labelPosition?: 'top'|'left'| 'right'
  } & IAnyObject
  dialogType?: 'dialog' | 'drawer'
  [propname: string]: any
}

export function useCipConfig (): ICipConfig
export function useCipPageConfig (): ICipPageConfig
