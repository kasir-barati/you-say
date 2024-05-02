/* eslint "@typescript-eslint/no-restricted-imports": "off" */

import { useDispatch, useSelector } from 'react-redux';
import { createStore } from './create.store';

let store: ReturnType<typeof createStore>;
type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export function getStore() {
  if (store) {
    return store;
  }

  store = createStore();

  return store;
}
