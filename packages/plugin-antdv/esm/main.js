var main = {
  input: (mode) => () => import(`./input${mode}`),
  rate: (mode) => () => import(`./rate${mode}`)
};

export { main as default };
