import {
  configListToMap,
  configMapToList,
  defineFormFieldConfig,
  defineSearchFieldConfig,
  defineTableFieldConfig,
  generateFieldList,
  insertFieldConfigToList,
  mergeFieldConfig,
  type IFieldItem,
  type TFormConfig,
  type TSearchFormConfig,
  type TTableColumns
} from '../packages/shared/src/utils/config-util.js'



type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2)
    ? true
    : false

type Expect<T extends true> = T

type FormModel = {
  name: string
  age: number
}

type SearchModel = {
  keyword: string
}

type TableModel = {
  name: string
  age: number
}

const formConfig = defineFormFieldConfig<FormModel>({
  name: {
    type: 'default',
    label: '姓名',
    required: true,
    span: 12
  },
  age: {
    type: 'number',
    label: '年龄',
    span: 12
  }
})

const searchConfig = defineSearchFieldConfig<SearchModel>({
  keyword: {
    type: 'default',
    label: '关键字',
    span: 24,
    immediateSearch: true,
    autoSelect: true
  }
})

const tableConfig = defineTableFieldConfig<TableModel>({
  name: {
    type: 'default',
    label: '姓名',
    width: 160,
    align: 'center'
  },
  age: {
    type: 'number',
    label: '年龄',
    minWidth: '120',
    showOverflowTooltip: true
  }
})

const formFieldList = generateFieldList(formConfig)
const searchFieldList = generateFieldList(searchConfig)
const tableFieldList = generateFieldList(tableConfig)

// generateFieldList 推导结果
const formRequired: boolean | undefined = formFieldList[0].config.required
const formSpan: number | undefined = formFieldList[0].config.span
// @ts-expect-error form 配置不应出现 table 专属字段
formFieldList[0].config.align

const searchImmediate: boolean | undefined = searchFieldList[0].config.immediateSearch
const searchAutoSelect: boolean | undefined = searchFieldList[0].config.autoSelect
// @ts-expect-error search 配置不应出现 form 专属 required
searchFieldList[0].config.required

const tableAlign: 'left' | 'center' | 'right' | undefined = tableFieldList[0].config.align
const tableTooltip: boolean | undefined = tableFieldList[1].config.showOverflowTooltip
// @ts-expect-error table 配置不应出现 form/search 专属 span
tableFieldList[0].config.span

type _GenerateFormConfig = Expect<Equal<typeof formFieldList[number]['config'], TFormConfig>>
type _GenerateSearchConfig = Expect<Equal<typeof searchFieldList[number]['config'], TSearchFormConfig>>
type _GenerateTableConfig = Expect<Equal<typeof tableFieldList[number]['config'], TTableColumns>>

// mergeFieldConfig 推导结果
const mergedFormConfig = mergeFieldConfig(formConfig)
const mergedSearchConfig = mergeFieldConfig(searchConfig)
const mergedTableConfig = mergeFieldConfig(tableConfig)

const mergedFormSpan: number | undefined = mergedFormConfig.name?.span
// @ts-expect-error form map 不应出现 table 专属 align
mergedFormConfig.name?.align

const mergedSearchImmediate: boolean | undefined = mergedSearchConfig.keyword?.immediateSearch
// @ts-expect-error search map 不应出现 form 专属 required
mergedSearchConfig.keyword?.required

const mergedTableAlign: 'left' | 'center' | 'right' | undefined = mergedTableConfig.name?.align
// @ts-expect-error table map 不应出现 form/search 专属 span
mergedTableConfig.name?.span

type _MergeFormMap = Expect<Equal<typeof mergedFormConfig, typeof formConfig>>
type _MergeSearchMap = Expect<Equal<typeof mergedSearchConfig, typeof searchConfig>>
type _MergeTableMap = Expect<Equal<typeof mergedTableConfig, typeof tableConfig>>

// configMapToList 推导结果
const formListByMap = configMapToList(formConfig)
const tableListByMap = configMapToList(tableConfig)

const formListByMapSpan: number | undefined = formListByMap[0].config.span
// @ts-expect-error form list item 不应出现 table 专属 align
formListByMap[0].config.align

const tableListByMapAlign: 'left' | 'center' | 'right' | undefined = tableListByMap[0].config.align
// @ts-expect-error table list item 不应出现 form/search 专属 span
tableListByMap[0].config.span

type _ConfigMapToListForm = Expect<Equal<typeof formListByMap[number]['config'], TFormConfig>>
type _ConfigMapToListTable = Expect<Equal<typeof tableListByMap[number]['config'], TTableColumns>>

// configListToMap 推导结果
const formMapFromList = configListToMap<FormModel, TFormConfig>(formFieldList)
const searchMapFromList = configListToMap<SearchModel, TSearchFormConfig>(searchFieldList)
const tableMapFromList = configListToMap<TableModel, TTableColumns>(tableFieldList)

const formMapFromListSpan: number | undefined = formMapFromList.name?.span
const searchMapFromListImmediate: boolean | undefined = searchMapFromList.keyword?.immediateSearch
const tableMapFromListAlign: 'left' | 'center' | 'right' | undefined = tableMapFromList.name?.align

// @ts-expect-error form map 不应出现 table 专属 align
formMapFromList.name?.align
// @ts-expect-error search map 不应出现 form 专属 required
searchMapFromList.keyword?.required
// @ts-expect-error table map 不应出现 form/search 专属 span
tableMapFromList.name?.span

type _ConfigListToMapForm = Expect<Equal<typeof formMapFromList, Partial<Record<keyof FormModel | (string & {}), TFormConfig>>>>
type _ConfigListToMapSearch = Expect<Equal<typeof searchMapFromList, Partial<Record<keyof SearchModel | (string & {}), TSearchFormConfig>>>>
type _ConfigListToMapTable = Expect<Equal<typeof tableMapFromList, Partial<Record<keyof TableModel | (string & {}), TTableColumns>>>>

// insertFieldConfigToList 推导结果
const formTarget: Array<IFieldItem<TFormConfig>> = [
  { key: 'name', config: formConfig.name! }
]
const formSource: Array<IFieldItem<TFormConfig>> = [
  {
    key: 'age',
    config: {
      ...formConfig.age!,
      insert: { after: 'name' }
    }
  }
]

const insertedFormList = insertFieldConfigToList(formTarget, formSource)
const insertedFormSpan: number | undefined = insertedFormList[0].config.span
// @ts-expect-error insert 后仍应保持 form item 的 config 类型
insertedFormList[0].config.align

type _InsertFieldConfigToList = Expect<Equal<typeof insertedFormList, Array<IFieldItem<TFormConfig>>>>

// 这些变量仅用于帮助 IDE 展示推导结果，无运行时用途
void formRequired
void formSpan
void searchImmediate
void searchAutoSelect
void tableAlign
void tableTooltip
void mergedFormSpan
void mergedSearchImmediate
void mergedTableAlign
void formListByMapSpan
void tableListByMapAlign
void formMapFromListSpan
void searchMapFromListImmediate
void tableMapFromListAlign
void insertedFormSpan
