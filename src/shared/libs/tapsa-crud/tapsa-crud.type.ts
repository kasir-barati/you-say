type ErrorMessageType = 'NOT_FOUND' | 'DUPLICATE';

export type ServiceErrorMessage = { [key in ErrorMessageType]: string };
