import { AddNotification } from './notification.slice';
import { useNotification } from './use-notification.hook';

describe('useNotification', () => {
  let dispatch: jest.Mock;

  beforeEach(async () => {
    dispatch = jest.fn();
    jest
      .spyOn(await import('../../store'), 'useAppDispatch')
      .mockReturnValue(dispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should dispatch with addNotification action when displayNotification is called', () => {
    const { displayNotification } = useNotification();

    const notification: AddNotification = {
      type: 'success',
      message: 'Test notification',
    };

    displayNotification(notification);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'notification/addNotification',
        payload: notification,
      }),
    );
  });

  it('should dispatch with removeNotification action when clearNotification is called', () => {
    const { clearNotification } = useNotification();

    const id = '123';

    clearNotification(id);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'notification/removeNotification',
        payload: id,
      }),
    );
  });

  it('should return displayNotification and clearNotification functions', () => {
    const { displayNotification, clearNotification } =
      useNotification();

    expect(displayNotification).toBeDefined();
    expect(clearNotification).toBeDefined();
  });
});
