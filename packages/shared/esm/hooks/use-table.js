import { inject } from 'vue';

const cipTableKey = Symbol("cip-table");
const useTable = () => {
  return inject(cipTableKey, {});
};

export { cipTableKey, useTable };
