// import { menuService } from './menu'
class PageSchemeService {
  info ({ id }) {
    return Promise.resolve(JSON.parse(JSON.stringify({
      data: {
        id: 'xx',
        scheme: {
          list: [
            {
              id: 'pageLayout-1',
              key: 'pageLayout-1',
              config: {
                type: 'pageLayoutList',
                compact: true,
                slotsConfig: {
                  filter: [
                    {
                      key: 'searchFilter',
                      config: {
                        type: 'searchForm',
                        dependOn: ['searchFilter'],
                        fieldList: [
                          { key: 'name', config: { label: 'Name' } },
                          { key: 'title', config: { label: 'Title' } }
                        ],
                        search: 'page'
                      }
                    }
                  ],
                  default: [
                    {
                      key: 'data',
                      config: {
                        type: 'table',
                        rowKey: 'name',
                        hideIndex: true,
                        options: [
                          { key: 'name', config: { label: 'Name' } },
                          { key: 'title', config: { label: 'Title' } }
                        ]
                      }
                    }
                  ]
                }
              }
            }
          ],
          methods: { // inject model, service
            page: `service.menuService.tree(model.searchFilter).then( res=> {
model.data = res.data
})
`
          },
          init: ['page']
        }
      }
    })))
  }
}

export const pageSchemeService = new PageSchemeService()
