import { computed } from 'vue';
import { getNextItem, isEmptyObject } from '../utils';
import { getCopyItem } from '../helper';

const useFormLayoutOptions = ({ props, emit }) => {
  const options = computed(() => {
    return props.config.options || [];
  });
  const updateConfig = (config) => {
    emit("update:config", config);
  };
  const updateOptionChildren = (optionIndex, children) => {
    const config = props.config;
    config.options[optionIndex].children = children;
    updateConfig(config);
  };
  const updateOptionChild = (optionIndex, childIndex, childConfig) => {
    const config = props.config;
    config.options[optionIndex].children[childIndex].config = childConfig;
    updateConfig(config);
  };
  const deleteOptionChild = (optionIndex, childIndex) => {
    const config = props.config;
    const nextItem = getNextItem(config.options[optionIndex].children, childIndex);
    if (!isEmptyObject(nextItem)) {
      emitSelectItem(nextItem);
    } else {
      emitSelectItem(props.config);
    }
    config.options[optionIndex].children.splice(childIndex, 1);
    updateConfig(config);
  };
  const copyOptionChild = (optionIndex, childIndex) => {
    const config = props.config;
    const newItem = getCopyItem(config.options[optionIndex].children[childIndex]);
    config.options[optionIndex].children.splice(childIndex + 1, 0, newItem);
    updateConfig(config);
    emitSelectItem(newItem);
  };
  const addOptionChild = (optionIndex, { newIndex: childIndex }) => {
    const config = props.config;
    const newItem = config.options[optionIndex].children[childIndex];
    updateConfig(config);
    emitSelectItem(newItem);
  };
  const emitSelectItem = (item) => {
    emit("selectItem", item);
  };
  return {
    updateOptionChildren,
    updateOptionChild,
    deleteOptionChild,
    copyOptionChild,
    addOptionChild,
    emitSelectItem,
    options
  };
};

export { useFormLayoutOptions };
