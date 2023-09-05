import { DRender } from 'd-render'

const dRender = new DRender()
export const getComponentConfigure = async (type) => {
  const { default: configure } = await dRender.componentDictionary[type]('/configure')()
  return configure
}
