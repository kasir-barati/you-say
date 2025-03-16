import { Error } from '@fusionauth/typescript-client';
import { fusionAuthErrorDeserializer } from './fusionauth-error-deserializer.helper';

describe('fusionAuthErrorDeserializer', () => {
  const code = '';

  it('should return an array of error messages without duplicates', () => {
    const errors: Record<string, Error[]> = {
      'some.error': [{ message: 'Some error', code }],
      'user.email': [
        {
          code: '[blank]user.email',
          message:
            'You must specify either the [user.email] or [user.username] property. If you are emailing the user you must specify the [user.email].',
        },
      ],
    };

    const result = fusionAuthErrorDeserializer(errors);

    expect(result).toEqual([
      'Some error',
      'You must specify either the [user.email] or [user.username] property. If you are emailing the user you must specify the [user.email].',
    ]);
  });

  it('should handle multiple errors and remove duplicates', () => {
    const errors: Record<string, Error[]> = {
      error1: [
        { message: 'Error 1', code },
        { message: 'Error 3', code },
      ],
      error2: [{ message: 'Error 2', code }],
      error3: [{ message: 'Error 3', code }],
    };

    const result = fusionAuthErrorDeserializer(errors);

    expect(result).toEqual(['Error 1', 'Error 3', 'Error 2']);
  });

  it('should return an empty array if no errors are present', () => {
    const result = fusionAuthErrorDeserializer({});

    expect(result).toEqual([]);
  });

  it('should return an array with unique error messages even with duplicates in input', () => {
    const errors: Record<string, Error[]> = {
      error1: [
        { message: 'Error 1', code },
        { message: 'Error 1', code },
      ],
      error2: [
        { message: 'Error 2', code },
        { message: 'Error 2', code },
      ],
    };

    const result = fusionAuthErrorDeserializer(errors);

    expect(result).toEqual(['Error 1', 'Error 2']);
  });

  it('should handle errors with empty error objects', () => {
    const mockErrorsWithEmpty: Record<string, Error[]> = {
      error1: [{ message: 'Error 1', code }],
      error2: [],
    };

    const result = fusionAuthErrorDeserializer(mockErrorsWithEmpty);

    expect(result).toEqual(['Error 1']);
  });
});
