import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const maximumInt32 = 2_147_483_647;
const maximumUnSignedInt32 = 4_294_967_295;
const minimumInt32 = -2_147_483_648;
const decoratorName = 'IsInt32';

export function IsInt32(
  unSinged?: boolean,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: decoratorName,
      async: false,
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [unSinged],
      validator: IsInt32Constraint,
    });
  };
}

@ValidatorConstraint({ name: decoratorName, async: false })
export class IsInt32Constraint
  implements ValidatorConstraintInterface
{
  validate(
    value: number,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    if (typeof value !== 'number') {
      return false;
    }

    if (Number.isInteger(value) === false) {
      return false;
    }

    const [unSinged] = validationArguments.constraints;

    if (unSinged) {
      return value <= maximumUnSignedInt32 && value >= 0;
    }

    return value <= maximumInt32 && value >= minimumInt32;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} is not in int32 range!`;
  }
}
