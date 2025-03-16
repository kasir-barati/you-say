import { Error } from '@fusionauth/typescript-client';

export function fusionAuthErrorDeserializer(
  errors: Error,
): Array<string> {
  const arrayOfErrors = Object.values(errors);

  if (arrayOfErrors.length === 0) {
    return [];
  }

  const extractedErrors = arrayOfErrors
    .flat()
    .map((error) => error.message);
  const shavedErrors = [...new Set(extractedErrors)];

  return shavedErrors;
}
