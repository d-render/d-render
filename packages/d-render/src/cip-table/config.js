// large 与 default 的 文字大小相同，为 14px
// small 文字大小为 12px

// 此部分可忽略
// large 的  padding 为 12px 0
// default 的  padding 为 8px 0
// small 的  padding 为 4px 0

// [注]原来的padding 固定为10px
// large cell 的padding 为 0 16px
// default cell 的padding 为 0 12px
// small cell 的padding 为 0 8px

export const dateColumnWidthMap = {
  large: 168,
  default: 168,
  small: 144
}

export const handleColumnWidthMap = {
  large: 140,
  default: 140,
  small: 124
}

// 因历史问题，所以padding修改为10
export const sizeCellConfig = {
  large: { fontSize: 14, padding: 10 },
  default: { fontSize: 14, padding: 10 },
  small: { fontSize: 12, padding: 10 }
}
