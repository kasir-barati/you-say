import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { NodeEnv } from '@shared';
import { authApi } from '../api/auth.api';
import {
  NotificationState,
  notificationReducer,
} from '../components/notification/notification.slice';
import { AuthState, authReducer } from './auth.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationReducer,
  [authApi.reducerPath]: authApi.reducer,
});

export interface PreloadedState {
  auth?: AuthState;
  notifications?: NotificationState[];
}
export function createStore(preloadedState?: PreloadedState) {
  return configureStore({
    reducer: rootReducer,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware().concat(authApi.middleware);
    },
    preloadedState,
    devTools: process.env.NEXT_PUBLIC_NODE_ENV !== NodeEnv.production,
  });
}
