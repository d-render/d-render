
import { ComponentPublicInstance} from "vue";
type TFetchAsyncComponent = () => Promise<any>
type TFetchAsyncComponents = (mode?: '/index'| '/mobile' | '/view' | '/configure') => () => Promise<any>

interface ISampleRenderComponent {
  component: TFetchAsyncComponents
  isLayout?: boolean
}
type TDRenderComponentConfig = TFetchAsyncComponents | ISampleRenderComponent

type TDRenderComponentsConfig = Record<string, TDRenderComponentConfig>

type IDRenderConfig = {
  components?: TDRenderComponentsConfig
  plugins?: Array<TDRenderComponentsConfig>
}



export function defineDRenderConfig (renderConfig: IDRenderConfig | {}): IDRenderConfig

export function insertConfig (plugin: TDRenderComponentsConfig, componentPlugin: Record<string,TFetchAsyncComponent>, mode: 'index' | 'view' | 'configure' | 'mobile' )


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
