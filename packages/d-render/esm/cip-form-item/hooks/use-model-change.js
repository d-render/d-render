import { computed, readonly } from 'vue';
import { isArray, getFieldValue, setFieldValue, isNotEmpty, emptySign, isEmpty } from '@d-render/shared';
import { getValuesByKeys } from '../util';

var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const useFieldValue = (key, model, updateModelQueue, changeEffect) => {
  const isArrayKey = computed(() => {
    return isArray(key.value);
  });
  const value = computed(() => {
    if (!key.value || key.value.length === 0)
      return void 0;
    if (isArrayKey.value) {
      return getValuesByKeys(model.value, key.value);
    } else {
      return getFieldValue(model.value, key.value);
    }
  });
  const updateValue = (val) => __async(void 0, null, function* () {
    if (!key.value)
      return;
    if (changeEffect == null ? void 0 : changeEffect.value) {
      try {
        const result = yield changeEffect.value(val, key.value, model.value);
        if (result === false)
          throw new Error("changeEffect false interrupted data update");
      } catch (e) {
        throw new Error("changeEffect reject interrupted data update");
      }
    }
    if (isArrayKey.value) {
      key.value.forEach((k) => {
        updateModelQueue.append(k, getFieldValue(val || {}, k));
      });
    } else {
      updateModelQueue.append(key.value, val);
    }
  });
  return [value, updateValue];
};
const useSteamUpdateValues = (fieldKey, otherKey, model, updateModel, changeEffect) => {
  const keys = computed(() => {
    return [].concat(fieldKey.value).concat(otherKey.value);
  });
  const values = computed(() => {
    return keys.value.map((key) => getFieldValue(model.value, key));
  });
  const streamUpdateModel = (values2) => __async(void 0, null, function* () {
    console.log("streamUpdateModel", values2);
    if ((changeEffect == null ? void 0 : changeEffect.value) && isNotEmpty(values2[0])) {
      let value = values2[0];
      if (values2[0] === emptySign)
        value = void 0;
      try {
        const result = yield changeEffect.value(value, keys.value[0], readonly(model.value));
        if (result === false)
          throw new Error("changeEffect false interrupted data update");
      } catch (e) {
        throw new Error("changeEffect reject interrupted data update");
      }
    }
    const innerModel = model.value;
    keys.value.forEach((key, index) => {
      const value = values2[index];
      if (value === emptySign) {
        setFieldValue(innerModel, key, void 0);
      } else if (!isEmpty(value)) {
        setFieldValue(innerModel, key, values2[index]);
      }
    });
    updateModel(innerModel);
  });
  const clearValues = () => {
    const innerModel = model.value;
    keys.value.forEach((key) => {
      setFieldValue(innerModel, key, void 0);
    });
  };
  return {
    values,
    streamUpdateModel,
    clearValues
  };
};

export { useFieldValue, useSteamUpdateValues };
