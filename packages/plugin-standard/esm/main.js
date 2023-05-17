var main = {
  input: (mode) => () => import(`./input${mode}`),
  default: () => () => import('./input/index')
};

export { main as default };
