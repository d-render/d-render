import { DRender } from '@d-render/shared'
const dRender = new DRender()
export const getLayoutComponent = (component) => {
  return dRender.getComponent(component)
}
export const getH5LayoutComponent = (component) => {
  return dRender.getComponent(component, 'mobile') // getAsyncComponents(dRender.componentDictionary, 'mobile')[`${component}-mobile`] // dRender.h5InputComponents[`${component}-mobile`]
}
export const getLayoutViewComponent = (component) => {
  const Component = dRender.getComponent(component, 'view') // [`${component}-view`]
  if (Component) {
    return Component
  } else {
    return getLayoutComponent(component)
  }
}
export const isLayoutType = (type) => dRender.isLayoutType(type)
