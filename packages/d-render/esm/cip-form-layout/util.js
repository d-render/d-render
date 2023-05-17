import { DRender } from '@d-render/shared';

const dRender = new DRender();
const getLayoutComponent = (component) => {
  return dRender.getComponent(component);
};
const getH5LayoutComponent = (component) => {
  return dRender.getComponent(component, "mobile");
};
const getLayoutViewComponent = (component) => {
  const Component = dRender.getComponent(component, "view");
  if (Component) {
    return Component;
  } else {
    return getLayoutComponent(component);
  }
};
const isLayoutType = (type) => dRender.isLayoutType(type);

export { getH5LayoutComponent, getLayoutComponent, getLayoutViewComponent, isLayoutType };
