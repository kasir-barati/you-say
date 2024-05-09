import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

const decoratorName = 'IsUrl';

export function IsUrl(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: decoratorName,
      async: false,
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUrlConstraint,
    });
  };
}

@ValidatorConstraint({ async: false, name: decoratorName })
export class IsUrlConstraint implements ValidatorConstraintInterface {
  validate(
    value: string,
    _validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    if (value.length > 2048) {
      return false;
    }

    return URL.canParse(value);
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} should be a valid URL!`;
  }
}
