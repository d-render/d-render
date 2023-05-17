import { emailValidator, identityCardValidator, mobilePhoneValidator, sqlSimpleValidator } from './form-validator';

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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
const validatorMap = {
  email: emailValidator,
  identityCard: identityCardValidator,
  mobilePhone: mobilePhoneValidator,
  sql: sqlSimpleValidator
};
const isInputType = (config) => {
  if (config.triggerType === "input") {
    return true;
  }
  if (config.triggerType === "select") {
    return false;
  }
  return ["input", "textarea", "number", "numberRange", "table", "password", void 0].includes(config.type);
};
const getRulesByFieldConfig = (config, otherValue, dependOnValues, outDependOnValues) => {
  const rules = [];
  if (config.required) {
    const defaultPreText = isInputType(config) ? "\u8BF7\u8F93\u5165" : "\u8BF7\u9009\u62E9";
    const requiredMessage = config.requiredErrorMessage || `${defaultPreText}${config.label}`;
    const requiredRule = __spreadValues({ required: true, message: requiredMessage }, config.requiredRuleConfig);
    if (config.requiredType) {
      requiredRule.type = config.requiredType;
    }
    rules.push(requiredRule);
    if (config.type === "dateRange" && config.otherKey) {
      const validator = (rule, value, cb) => {
        if (value) {
          if (otherValue) {
            cb();
          } else {
            cb(new Error(requiredMessage + "-\u7ED3\u675F\u65F6\u95F4"));
          }
        } else {
          cb();
        }
      };
      const otherRules = { validator };
      rules.push(otherRules);
    }
  }
  const pushValidatorFunction = (validator, type) => {
    const message = config.validateValueErrorMessage;
    const rule = {
      validator,
      trigger: type || "blur"
    };
    if (message) {
      rule.message = message;
    }
    return rule;
  };
  if (config.validateValue && validatorMap[config.validateValue]) {
    const validator = validatorMap[config.validateValue];
    if (validator) {
      rules.push(pushValidatorFunction(validator));
    }
  }
  if (config.regexpValidate) {
    try {
      const reg = new RegExp(config.regexpValidate);
      const rule = {
        pattern: reg,
        message: config.regexpValidateErrorMessage || `\u672A\u80FD\u901A\u8FC7${reg.toString()}\u6821\u9A8C`,
        trigger: "blur"
      };
      rules.push(rule);
    } catch (e) {
      console.log(e.message);
    }
  }
  if (config.validateExistRemote) {
    const validator = (rule, value, callback) => __async(void 0, null, function* () {
      const { data } = yield config.validateExistRemote(value, dependOnValues, outDependOnValues);
      if (data) {
        callback(new Error(config.validateExistRemoteErrorMessage || rule.message || "\u5DF2\u5B58\u5728"));
      } else {
        callback();
      }
    });
    rules.push(pushValidatorFunction(validator));
  }
  if (config.customValidators) {
    const customRules = config.customValidators.map((customValidator) => {
      const validator = (rule, value, callback) => __async(void 0, null, function* () {
        const { data, message } = yield customValidator(value, dependOnValues, outDependOnValues);
        if (!data) {
          const errorMessage = customValidator.message || message || rule.message;
          callback(new Error(errorMessage));
        } else {
          callback();
        }
      });
      return pushValidatorFunction(validator, customValidator.type);
    });
    rules.push(...customRules);
  }
  return rules;
};

export { getRulesByFieldConfig };
