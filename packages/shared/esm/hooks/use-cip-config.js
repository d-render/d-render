import { inject } from 'vue';

const useCipConfig = () => {
  const cipConfig = inject("cip-config", {
    limit: {},
    buttonConfigMap: {},
    layout: {},
    number: {},
    table: {},
    main: {}
  });
  return cipConfig;
};
const useCipPageConfig = () => {
  const cipPageConfig = inject("cip-page-config", {
    table: {},
    searchForm: {}
  });
  return cipPageConfig;
};

export { useCipConfig, useCipPageConfig };
