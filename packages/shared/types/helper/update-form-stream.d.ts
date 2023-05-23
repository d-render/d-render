import {IAnyObject} from "../utils";

export const emptySign: Symbol
export class UpdateFormStream{
  value: Array<any>
  constructor(props: IAnyObject, update: (val: any)=>void)
  init(): void
  appendValue(value: any): void
  appendOtherValue(value: any, i?: number): void
  end(): void
}
