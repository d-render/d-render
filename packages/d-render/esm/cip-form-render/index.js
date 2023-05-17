import { ref, getCurrentInstance, computed, createVNode } from 'vue';
import CipForm from '../cip-form';

var index = {
  name: "CipFormRender",
  props: {
    scheme: Object,
    model: Object,
    equipment: {
      type: String,
      default: "pc"
    }
  },
  emits: ["update:model"],
  setup(props, {
    emit,
    expose
  }) {
    const cipFormRef = ref(null);
    const instance = getCurrentInstance();
    const fieldList = computed(() => props.scheme.list || []);
    const labelPosition = computed(() => props.scheme.labelPosition || "right");
    const labelWidth = computed(() => props.scheme.labelWidth || 100);
    const labelSuffix = computed(() => props.scheme.labelSuffix || " ");
    const grid = computed(() => props.scheme.grid || 1);
    instance.ctx.cipFormRef = cipFormRef;
    expose({
      cipFormRef
    });
    return () => createVNode(CipForm, {
      "ref": cipFormRef,
      "model": props.model,
      "onUpdate:model": (val) => emit("update:model", val),
      "fieldList": fieldList.value,
      "labelPosition": labelPosition.value,
      "equipment": props.equipment,
      "labelWidth": labelWidth.value,
      "labelSuffix": labelSuffix.value,
      "grid": grid.value
    }, null);
  }
};

export { index as default };
