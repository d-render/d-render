import { isEmpty } from '../utils'
export const emptySign = Symbol('empty')
export class UpdateFormStream {
  values = []
  constructor (props, update) {
    this.update = update
    this.props = props
    this.init()
  }

  init () {
    this.values = []
  }

  appendValue (value) {
    this.values[0] = isEmpty(value) ? emptySign : value
  }

  appendOtherValue (value, i = 1) {
    this.values[i] = isEmpty(value) ? emptySign : value
  }

  end () {
    this.update(this.values)
    this.init()
  }
}
