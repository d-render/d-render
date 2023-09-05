export const PLUGIN_ENUM = {
  MODULE: 1,
  DRAW: 2,
  CONFIGURE: 3,
  PREVIEW: 4
}
class Plugin {
  constructor (options) {
    this.options = options
  }
}
export class ModulePlugin extends Plugin {
  constructor (options) {
    super(options)
    this.type = PLUGIN_ENUM.MODULE
  }
}
export class DrawPlugin extends Plugin {
  constructor (options) {
    super(options)
    this.type = PLUGIN_ENUM.DRAW
  }
}
export class ConfigurePlugin extends Plugin {
  constructor (options) {
    super(options)
    this.type = PLUGIN_ENUM.CONFIGURE
  }
}

export class PreviewPlugin extends Plugin {
  constructor (options) {
    super(options)
    this.type = PLUGIN_ENUM.PREVIEW
  }
}
