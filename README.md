# d-render for vue3.x

## 文档

[http://docs.x-develop.cn](http://docs.x-develop.cn)

## 特性

### 完整的数据渲染方案

- `CipForm`针对数据 ***新增/编辑/展示*** 功能内置联动逻辑支持所有插件输入型/展示型/布局型类型的表单渲染组件
- `CipSearchForm`相对与CipForm缺少了布局插件的加载，但是对搜索数据有特殊的处理的表单处理组件
- `CipTable`支持树表格编辑内置联动逻辑的表格渲染组件
- `CipFormRender`支持将可选组件`@d-render/design`包内的`CipFormDesign`组件设计生成的JSON渲染为Form
- `CipFormInputTransform`将自定义组件转换为CipForm支持的输入型组件
- `CipFormLayout`内置的布局型组件

### 采用数组配置的方案实现数据渲染
### 设计了合理的数据联动方案，免去组件内部导出使用平凡使用watch和配置的烦恼
### 内含types文件
### 插件化渲染方案

- 基于`element-plus@~2.2.0`实现的`@d-render/plugin-standard`
- 基于`ant-design-vue@~3.0.0`实现的`@d-redner/plugin-antdv`

## 安装

### npm

```bash
npm i -D d-render
```
## 许可

d-render 使用 [MIT license](https://opensource.org/licenses/MIT) 许可证书。
