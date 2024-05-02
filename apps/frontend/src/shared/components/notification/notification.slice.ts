import { AlertColor } from '@mui/material';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { generateRandomString } from '@shared';

/**
 * `immer` can only observe modifications to the object that was initially passed into your function through the `state` argument. It is not possible to observe from outside the function if that variable was reassigned, as it only exists in the scope within the function.
 */

const initialState: NotificationState[] = [];
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification(
      state: NotificationState[],
      action: PayloadAction<AddNotification>,
    ) {
      const { type, message, timeout = 5000 } = action.payload;

      return [
        ...state,
        {
          type,
          message,
          timeout,
          open: true,
          id: generateRandomString(),
        },
      ];
    },
    removeNotification(
      state: NotificationState[],
      action: PayloadAction<string>,
    ) {
      const newState = state.filter(
        (notification) => notification.id !== action.payload,
      );

      return [...newState];
    },
    clearNotifications() {
      return [];
    },
  },
});

export type AddNotification = Pick<
  NotificationState,
  'type' | 'message' | 'timeout'
>;
export interface NotificationState {
  id: string;
  open?: boolean;
  type: AlertColor;
  message: string;
  timeout?: number;
}
export const {
  addNotification,
  removeNotification,
  clearNotifications,
} = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
