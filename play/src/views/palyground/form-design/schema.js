export default {
  list: [
    {
      config: {
        type: 'searchForm',
        class: 'disabled-table',
        icon: 'el-icon-menu',
        label: '搜索表单',
        hideLabel: true,
        options: [
          {
            key: 'default',
            children: [
              {
                config: {
                  type: 'input',
                  icon: 'el-icon-edit',
                  label: '单行文本'
                },
                id: 'input_7565b143',
                key: 'input_7565b143'
              },
              {
                config: {
                  type: 'input',
                  icon: 'el-icon-edit',
                  label: '单行文本'
                },
                id: 'input_6f257eb4',
                key: 'input_6f257eb4'
              },
              {
                config: {
                  type: 'input',
                  icon: 'el-icon-edit',
                  label: '单行文本'
                },
                id: 'input_665885bb',
                key: 'input_665885bb'
              },
              {
                config: {
                  type: 'input',
                  icon: 'el-icon-edit',
                  label: '单行文本'
                },
                id: 'input_ef07aa7e',
                key: 'input_ef07aa7e'
              },
              {
                config: {
                  type: 'input',
                  icon: 'el-icon-edit',
                  label: '单行文本'
                },
                id: 'input_94c57e78',
                key: 'input_94c57e78'
              },
              {
                config: {
                  type: 'input',
                  icon: 'el-icon-edit',
                  label: '单行文本'
                },
                id: 'input_a02f2035',
                key: 'input_a02f2035'
              },
              {
                config: {
                  type: 'input',
                  icon: 'el-icon-edit',
                  label: '单行文本'
                },
                id: 'input_f5823eff',
                key: 'input_f5823eff'
              }
            ]
          }
        ],
        key: 'searchForm_d1a403c7',
        id: 'searchForm_d1a403c7',
        hideItem: false,
        searchButtonText: '查询',
        labelPosition: 'top'
      },
      id: 'searchForm_d1a403c7',
      key: 'searchForm_d1a403c7'
    },
    {
      config: {
        type: 'form',
        class: 'disabled-table',
        label: '表单',
        hideLabel: true,
        usingSlots: [
          'default'
        ],
        options: [
          {
            key: 'default',
            children: [
              {
                config: {
                  type: 'input',
                  label: '单行文本'
                },
                id: 'input_9b214392',
                key: 'input_9b214392'
              },
              {
                config: {
                  type: 'textarea',
                  label: '多行文本'
                },
                id: 'textarea_0ae1a848',
                key: 'textarea_0ae1a848'
              },
              {
                config: {
                  type: 'input',
                  label: '单行文本'
                },
                id: 'input_8d6308e7',
                key: 'input_8d6308e7'
              }
            ]
          }
        ],
        labelPosition: 'right',
        hideItem: false
      },
      id: 'form_833213db',
      key: ''
    },
    {
      config: {
        type: 'pageTable',
        class: 'disabled-table',
        label: '表格',
        hideLabel: true,
        options: [
          {
            key: 'default',
            children: [
              {
                config: {
                  type: 'input',
                  label: '单行文本'
                },
                id: 'input_1a8f7b4e',
                key: 'input_1a8f7b4e'
              },
              {
                config: {
                  type: 'input',
                  label: '单行文本'
                },
                id: 'input_052cf8d5',
                key: 'input_052cf8d5'
              },
              {
                config: {
                  type: 'input',
                  label: '单行文本'
                },
                id: 'input_ff9eb76b',
                key: 'input_ff9eb76b'
              }
            ]
          }
        ],
        hideItem: false
      },
      id: 'pageTable_ba114b7c',
      key: 'pageTable_ba114b7c'
    },
    {
      config: {
        type: 'grid',
        label: '栅格布局',
        gutter: 0,
        options: [
          {
            span: 12,
            children: [
              {
                config: {
                  type: 'rate',
                  label: '评分',
                  max: 5
                },
                id: 'rate_46afa9dc',
                key: 'rate_46afa9dc'
              }
            ]
          },
          {
            span: 12,
            children: [
              {
                config: {
                  type: 'select',
                  label: '下拉选择框',
                  options: [
                    '选项一',
                    '选项二',
                    '选项三'
                  ]
                },
                id: 'select_4723042d',
                key: 'select_4723042d'
              }
            ]
          }
        ],
        hideItem: false
      },
      id: 'grid_6215e746',
      key: 'grid_6215e746'
    }
  ],
  init: [],
  methods: [],
  grid: 1,
  labelPosition: 'right',
  tableSize: 'default',
  labelSuffix: ' '
}
