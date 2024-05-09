import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { NodeEnv } from '@shared';
import { authApi } from '../api/auth.api';
import { newsletterSubscription } from '../api/newsletter-subscription.api';
import { postApi } from '../api/post.api';
import {
  NotificationState,
  notificationReducer,
} from '../components/notification/notification.slice';
import { AuthState, authReducer } from './auth.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationReducer,
  [authApi.reducerPath]: authApi.reducer,
  [postApi.reducerPath]: postApi.reducer,
  [newsletterSubscription.reducerPath]:
    newsletterSubscription.reducer,
});

export interface PreloadedState {
  auth?: AuthState;
  notifications?: NotificationState[];
}
export function createStore(preloadedState?: PreloadedState) {
  return configureStore({
    reducer: rootReducer,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware()
        .concat(authApi.middleware)
        .concat(postApi.middleware)
        .concat(newsletterSubscription.middleware);
    },
    preloadedState,
    devTools: process.env.NEXT_PUBLIC_NODE_ENV !== NodeEnv.production,
  });
}
