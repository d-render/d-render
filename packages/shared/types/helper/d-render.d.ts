
import { ComponentPublicInstance} from "vue";

type TFetchAsyncComponent = (mode?: '/index'| '/mobile' | '/view') => () => Promise<any>

interface ISampleRenderComponent {
  component: TFetchAsyncComponent
  isLayout?: boolean
}
type TDRenderComponentConfig = TFetchAsyncComponent | ISampleRenderComponent

type TDRenderComponentsConfig = Record<string, TDRenderComponentConfig>

type IDRenderConfig = {
  components?: TDRenderComponentsConfig
  plugins?: Array<TDRenderComponentsConfig>
}



export function defineDRenderConfig (renderConfig: IDRenderConfig | {}): IDRenderConfig





export class DRender{
  static instance: DRender
  defaultComponentConfig: TDRenderComponentsConfig
  componentDictionary: Record<string, TFetchAsyncComponent>
  layoutTypeList: Array<string>
  constructor()
  init(): void
  setConfig(renderConfig: IDRenderConfig): void
  setCustomComponents(customComponentsConfig: TDRenderComponentsConfig): void
  getComponent(type: string, append?: string): new () => ComponentPublicInstance
  isLayoutType(type: string): boolean
  isPageType(type: string): boolean
}
