# d-render

## 1.1.12 (2023-05-22)

- fix(packages): 修复升级11版本后无法通过 `import 'd-redner/style'`的方式引入d-render的样式
    - 此为兼容性修复，11版本可以通过 `import 'd-render/dist/index.css'`的方式i引入

## 1.1.11 (2023-05-19)

- fix(components): [cip-form-item]修复了changeValue在特殊情况下不能如设计的运行方式运行
    - 此bug出现在CipForm渲染后第一次修改model对象后changeValue不能如设计的不执行
    - 此bug修复后主要影响独立的修改页中需要立即执行的changeValue的属性,此中情况应明确添加属性`immediateChangeValue`

## 1.1.10 (2023-05-07)

- update(components) [cip-form-item]内部写入值时使用的setFieldValue方法的行为变更
    - 如在遇到key中带数字如dept.0.name时如dept不存在时
      - 修改前 `{dept: { 0: { name: 'value' } } }`
      - 修改后 `{dept: [ { name: 'value' } ] }`
