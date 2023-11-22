import { menu } from './virtual-data/menu'
class MenuService {
  tree (searchFilter) {
    let data = menu
    if (searchFilter) data = data.filter(v => v.name.indexOf(searchFilter.name) > -1)
    return Promise.resolve({ data })
  }
}

export const menuService = new MenuService()
