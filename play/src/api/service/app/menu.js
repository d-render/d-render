import { menu } from './virtual-data/menu'
class MenuService {
  tree () {
    return Promise.resolve({ data: menu })
  }
}

export const menuService = new MenuService()
