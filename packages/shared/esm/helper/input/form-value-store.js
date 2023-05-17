import dayjs from 'dayjs';
import { getFieldValue, isNotEmpty } from '../../utils';

const state = {};
const settingValueTransformState = (key, value) => {
  state[key] = value;
};
const valueOptions = [
  /* eslint-disable no-template-curly-in-string */
  "${user.displayName}",
  "${user.email}",
  "${user.group.name}",
  "${new Date()}"
  /* eslint-enable */
];
const getFormValueByTemplate = (template, config) => {
  if (typeof template !== "string") {
    return template;
  }
  return template == null ? void 0 : template.replace(/\${([^}]+)}/g, (_, key) => {
    if (key === "new Date()") {
      return dayjs(Date.now()).format((config == null ? void 0 : config.formatter) || "YYYY-MM-DD HH:mm:ss");
    } else {
      const val = getFieldValue(state, key);
      return isNotEmpty(val) ? val : `\${${key}}`;
    }
  });
};

export { getFormValueByTemplate, settingValueTransformState, valueOptions };
