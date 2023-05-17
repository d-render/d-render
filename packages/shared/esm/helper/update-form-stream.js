import { isEmpty } from '../utils';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const emptySign = Symbol("empty");
class UpdateFormStream {
  constructor(props, update) {
    __publicField(this, "values", []);
    this.update = update;
    this.props = props;
    this.init();
  }
  init() {
    this.values = [];
  }
  appendValue(value) {
    this.values[0] = isEmpty(value) ? emptySign : value;
  }
  appendOtherValue(value, i = 1) {
    this.values[i] = isEmpty(value) ? emptySign : value;
  }
  end() {
    this.update(this.values);
    this.init();
  }
}

export { UpdateFormStream, emptySign };
