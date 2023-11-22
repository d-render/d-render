import { DRender } from '@d-render/shared'

const dRender = new DRender()
// input
export const getInputComponent = (type: string = 'default') => {
  return dRender.getComponent(type)
}

export const getViewComponent = (type: string = 'default') => {
  return dRender.getComponent(type, 'view')
}

export const getH5InputComponent = (type: string = 'default') => {
  return dRender.getComponent(type, 'mobile')
}

export const isLayoutType = (type: string = 'default') => dRender.isLayoutType(type)

// layout
// REFACTOR: 与input的逻辑合并
// export const getLayoutComponent = (component: string) => {
//   return dRender.getComponent(component)
// }
// export const getH5LayoutComponent = (component: string) => {
//   return dRender.getComponent(component, 'mobile')
// }
// export const getLayoutViewComponent = (component: string) => {
//   const Component = dRender.getComponent(component, 'view')
//   if (Component) {
//     return Component
//   } else {
//     return getLayoutComponent(component)
//   }
// }
