---
layout: home

hero:
  name: d-render
  text: 数据驱动渲染组件库
  tagline: 基于 Element Plus 二次封装，通过配置驱动表单、搜索表单、表格渲染
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: GitHub
      link: https://github.com/d-render/d-render

features:
  - icon: 🚀
    title: 配置驱动
    details: 通过 JSON 配置即可渲染复杂表单，无需手写大量模板代码
  - icon: 🔗
    title: 数据联动
    details: 强大的 dependOn 机制，轻松实现字段间的联动、级联、派生
  - icon: 📦
    title: 开箱即用
    details: 基于 Element Plus 二次封装，提供丰富的表单、表格、搜索组件
  - icon: 🎨
    title: 自定义类型
    details: 轻松扩展自定义输入组件，满足各种业务场景
  - icon: 📱
    title: 多端适配
    details: 支持 PC 和移动端，一套配置多端运行
  - icon: 🔧
    title: TypeScript
    details: 完整的 TypeScript 支持，提供良好的类型提示
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>
