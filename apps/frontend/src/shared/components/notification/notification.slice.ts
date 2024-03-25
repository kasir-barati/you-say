import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: NotificationState = {
  notifications: [],
};
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(
      state,
      {
        payload: notification,
      }: PayloadAction<Pick<Alert, 'message' | 'type'>>,
    ) {
      state.notifications.push({
        id: `${notification.type}-${(Math.random() * 1e10).toFixed(0)}`,
        createdAtTimestamp: Date.now(),
        ...notification,
      });
    },
    removeNotification(
      state,
      { payload: notificationId }: PayloadAction<string>,
    ) {
      state.notifications = state.notifications.filter(
        ({ id }) => id !== notificationId,
      );
    },
  },
});

export interface Alert {
  id: string;
  message: string;
  createdAtTimestamp: number;
  type: 'error' | 'success' | 'warning' | 'info';
}
export interface NotificationState {
  notifications: Alert[];
}
export const { addNotification, removeNotification } =
  notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
