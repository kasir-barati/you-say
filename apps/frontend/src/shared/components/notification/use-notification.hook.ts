import { useAppDispatch } from '../../store';
import {
  AddNotification,
  addNotification,
  removeNotification,
} from './notification.slice';

export const useNotification = () => {
  const dispatch = useAppDispatch();
  const displayNotification = (notification: AddNotification) => {
    dispatch(addNotification(notification));
  };
  const clearNotification = (id: string) => {
    dispatch(removeNotification(id));
  };

  return {
    displayNotification,
    clearNotification,
  } as const;
};
