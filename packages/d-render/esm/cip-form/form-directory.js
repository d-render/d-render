import { ref, computed, createVNode, Fragment, h } from 'vue';
import { ElDrawer } from 'element-plus';

var formDirectory = {
  props: {
    directory: Object
  },
  setup(props) {
    const drawerSwitch = ref(false);
    const openDrawer = () => {
      drawerSwitch.value = true;
    };
    const list = computed(() => {
      const result = [];
      Object.keys(props.directory).forEach((key) => {
        result.push({
          key,
          config: props.directory[key]
        });
      });
      return result;
    });
    const DynamicHead = ({
      config
    }) => {
      return h("a", {
        href: `#${config.key}`,
        class: "form-directory-item"
      }, [h("h" + config.config.level, {}, [config.config.label])]);
    };
    return () => createVNode(Fragment, null, [createVNode("div", {
      "class": "form-directory__switch",
      "onClick": () => openDrawer()
    }, [createVNode("i", {
      "class": "el-icon-s-order",
      "style": "font-size: 24px"
    }, null)]), createVNode(ElDrawer, {
      "custom-class": "form-directory__drawer",
      "modelValue": drawerSwitch.value,
      "onUpdate:modelValue": ($event) => drawerSwitch.value = $event,
      "title": "\u8868\u5355\u76EE\u5F55"
    }, {
      default: () => [createVNode("div", {
        "class": "form-directory"
      }, [list.value.map((v) => {
        return createVNode(DynamicHead, {
          "config": v
        }, null);
      })])]
    })]);
  }
};

export { formDirectory as default };
