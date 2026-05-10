/** 静态注册各分包 loader，避免 `import(\`./x${mode}\`)` 在 Vite 下无法静态分析 */
const modules = {
  './autocomplete/index': () => import('./autocomplete/index'),
  './autocomplete/view': () => import('./autocomplete/view'),
  './cascader/index': () => import('./cascader/index'),
  './cascader/view': () => import('./cascader/view'),
  './checkbox/index': () => import('./checkbox/index'),
  './checkbox/view': () => import('./checkbox/view'),
  './color/index': () => import('./color/index'),
  './color/view': () => import('./color/view'),
  './date/index': () => import('./date/index'),
  './date/view': () => import('./date/view'),
  './input/index': () => import('./input/index'),
  './input/view': () => import('./input/view'),
  './number/index': () => import('./number/index'),
  './number/view': () => import('./number/view'),
  // './radio/index': () => import('./radio/index'),
  // './radio/view': () => import('./radio/view'),
  './rate/index': () => import('./rate/index'),
  './rate/view': () => import('./rate/view'),
  './select/index': () => import('./select/index'),
  './select/view': () => import('./select/view'),
  './slider/index': () => import('./slider/index'),
  './slider/view': () => import('./slider/view'),
  // './static-info/index': () => import('./static-info/index'),
  // './static-info/view': () => import('./static-info/view'),
  './switch/index': () => import('./switch/index'),
  './switch/view': () => import('./switch/view'),
  './time/index': () => import('./time/index'),
  './time/view': () => import('./time/view'),
  './time-select/index': () => import('./time-select/index'),
  './time-select/view': () => import('./time-select/view'),
  './transfer/index': () => import('./transfer/index'),
  './transfer/view': () => import('./transfer/view'),
  './tree/index': () => import('./tree/index'),
  './tree/view': () => import('./tree/view'),
  './tree-select/index': () => import('./tree-select/index'),
  './tree-select/view': () => import('./tree-select/view')
}

function pick(folder, mode) {
  if (mode === '/view') {
    return modules[`./${folder}/view`]
  }
  return modules[`./${folder}/index`]
}

export default {
  autocomplete: (mode) => {
    if (mode === '/view') {
      return modules['./autocomplete/view']
    } else {
      return modules['./autocomplete/index']
    }
  },
  cascader: (mode) => {
    if (mode === '/view') {
      return modules['./cascader/view']
    } else {
      return modules['./cascader/index']
    }
  },
  checkbox: (mode) => {
    if (mode === '/view') {
      return modules['./checkbox/view']
    } else {
      return modules['./checkbox/index']
    }
  },
  checkboxSingle: (mode) => {
    if (mode === '/view') {
      return modules['./checkbox-single/view']
    } else {
      return modules['./checkbox-single/index']
    }
  },
  date: (mode) => {
    if (mode === '/view') {
      return modules['./date/view']
    } else {
      return modules['./date/index']
    }
  },
  color: (mode) => {
    if (mode === '/view') {
      return modules['./color/view']
    } else {
      return modules['./color/index']
    }
  },
  input: (mode) => {
    if (mode === '/view') {
      return modules['./input/view']
    } else {
      return modules['./input/index']
    }
  },
  number: (mode) => {
    if (mode === '/view') {
      return modules['./number/view']
    } else {
      return modules['./number/index']
    }
  },
  // radio: (mode) => {
  //   if (mode === '/view') {
  //     return modules['./radio/view']
  //   } else {
  //     return modules['./radio/index']
  //   }
  // },
  rate: (mode) => {
    if (mode === '/view') {
      return modules['./rate/view']
    } else {
      return modules['./rate/index']
    }
  },
  select: (mode) => {
    if (mode === '/view') {
      return modules['./select/view']
    } else {
      return modules['./select/index']
    }
  },
  slider: (mode) => {
    if (mode === '/view') {
      return modules['./slider/view']
    } else {
      return modules['./slider/index']
    }
  },
  // staticInfo: (mode) => {
  //   if (mode === '/view') {
  //     return modules['./static-info/view']
  //   } else {
  //     return modules['./static-info/index']
  //   }
  // },
  switch: (mode) => {
    if (mode === '/view') {
      return modules['./switch/view']
    } else {
      return modules['./switch/index']
    }
  },
  time: (mode) => {
    if (mode === '/view') {
      return modules['./time/view']
    } else {
      return modules['./time/index']
    }
  },
  timeSelect: (mode) => {
    if (mode === '/view') {
      return modules['./time-select/view']
    } else {
      return modules['./time-select/index']
    }
  },
  transfer: (mode) => {
    if (mode === '/view') {
      return modules['./transfer/view']
    } else {
      return modules['./transfer/index']
    }
  },
  tree: (mode) => {
    if (mode === '/view') {
      return modules['./tree/view']
    } else {
      return modules['./tree/index']
    }
  },
  treeSelect: (mode) => {
    if (mode === '/view') {
      return modules['./tree-select/view']
    } else {
      return modules['./tree-select/index']
    }
  },
  default: () => () => import('./input/index')
}
