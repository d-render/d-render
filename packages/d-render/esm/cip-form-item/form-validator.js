import { isInputEmpty } from '@d-render/shared';

const emailValidator = (rule, value, callback) => {
  const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
  if (isInputEmpty(value) || reg.test(value)) {
    callback();
  } else {
    callback(new Error(rule.message || "\u8BF7\u586B\u5199\u6B63\u786E\u7684\u90AE\u7BB1\u5730\u5740"));
  }
};
const identityCardValidator = (rule, value, callback) => {
  const reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
  if (isInputEmpty(value) || reg.test(value)) {
    callback();
  } else {
    callback(new Error(rule.message || "\u8BF7\u586B\u5199\u6B63\u786E\u7684\u8EAB\u4EFD\u8BC1\u53F7"));
  }
};
const mobilePhoneValidator = (rule, value, callback) => {
  const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57]|19[13589])[0-9]{8}$/;
  if (isInputEmpty(value) || reg.test(value)) {
    callback();
  } else {
    callback(new Error(rule.message || "\u8BF7\u586B\u5199\u6B63\u786E\u7684\u624B\u673A\u53F7"));
  }
};
const sqlSimpleValidator = (rule, value, callback) => {
  const reg = /^select/i;
  if (isInputEmpty(value) || reg.test(value)) {
    callback();
  } else {
    callback(new Error(rule.message || "sql\u8BED\u53E5\u4EE5select\u5F00\u5934"));
  }
};

export { emailValidator, identityCardValidator, mobilePhoneValidator, sqlSimpleValidator };
