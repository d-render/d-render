import { ElScrollbar } from 'element-plus'
import { useNamespace } from '@d-render/shared'
export default {
  props: {
    navTitle: String,
    preview: { type: Boolean, default: undefined }
  },
  setup (props, { slots }) {
    const ns = useNamespace('design-layout')
    return () => <div class={ns.b()}>
      <div class={ns.e('header')}>
        <div class={ns.e('title')}>{slots.title?.()}</div>
        <div class={ns.e('equipment')}>{slots.equipment?.()}</div>
        <div class={ns.e('handle')}>{slots.handle?.()}</div>
      </div>
      {!props.preview && <div class={ns.e('main')}>
        <div class={ns.e('modules')}>
          {slots.modules?.()}
        </div>
        <div class={ns.e('nav')}>
          {props.navTitle && <div class={ns.e('nav__title')}>
            {props.navTitle}
          </div>}
          <div class={ns.e('nav__content')}>
            <ElScrollbar>
              {slots.nav?.()}
            </ElScrollbar>
          </div>
        </div>
        <div class={ns.e('content')}>
          {slots.content?.()}
        </div>
        <div class={ns.e('configure')}>
          {slots.configure?.()}
        </div>
      </div>}
      {props.preview && <div class={ns.e('preview')}>
        {slots.preview?.()}
      </div>}

    </div>
  }
}
