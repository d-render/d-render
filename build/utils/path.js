import { resolve } from 'node:path';
export const buildDirResolve = (p) => {
  return resolve(__dirname, '..', p);
};
