import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export function IsValidString(options?: {
  minLength?: number;
  maxLength?: number;
}) {
  const minLength = options?.minLength ?? 2;
  const maxLength = options?.maxLength ?? 128;

  return applyDecorators(
    IsString(),
    Transform(({ value }) => value?.trim?.() ?? value),
    IsNotEmpty(),
    MinLength(minLength),
    MaxLength(maxLength),
  );
}
