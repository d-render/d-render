import { isEmpty, IAnyObject } from '../utils'
export const emptySign = Symbol('empty')
export class UpdateFormStream {
  values: unknown[] = []
  update: (values: unknown[]) => void
  props: IAnyObject
  constructor (props: IAnyObject, update: (values: unknown[])=> void) {
    this.update = update
    this.props = props
    this.init()
  }

  init () {
    this.values = []
  }

  appendValue (value: unknown) {
    this.values[0] = isEmpty(value) ? emptySign : value
  }

  appendOtherValue (value: unknown, i = 1) {
    this.values[i] = isEmpty(value) ? emptySign : value
  }

  end () {
    this.update(this.values)
    this.init()
  }
}
