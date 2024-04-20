import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { IsValidString } from './is-valid-string.decorator';

class TestClass {
  @IsValidString({ maxLength: 200 })
  test: string;
}

class OtherTestClass {
  @IsValidString()
  test: string;
}

describe('IsValidString', () => {
  it('should validate a valid string', async () => {
    const testClass = plainToInstance(TestClass, {
      test: 'valid string',
    });

    const errors = await validate(testClass);

    expect(errors.length).toBe(0);
  });

  it('should not validate an empty string', async () => {
    const testClass = plainToInstance(TestClass, { test: '' });

    const errors = await validate(testClass, {
      stopAtFirstError: true,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toStrictEqual({
      isNotEmpty: 'test should not be empty',
    });
  });

  it('should not validate a non-string value', async () => {
    const testClass = plainToInstance(TestClass, { test: 123 });

    const errors = await validate(testClass, {
      stopAtFirstError: true,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toStrictEqual({
      isString: 'test must be a string',
    });
  });

  it('should not validate a string shorter than the minimum length', async () => {
    const testClass = plainToInstance(TestClass, { test: 'a' });

    const errors = await validate(testClass, {
      stopAtFirstError: true,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toStrictEqual({
      minLength: 'test must be longer than or equal to 2 characters',
    });
  });

  it('should not validate a string longer than the maximum length', async () => {
    const testClass = plainToInstance(TestClass, {
      test: 'a'.repeat(256),
    });

    const errors = await validate(testClass, {
      stopAtFirstError: true,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toStrictEqual({
      maxLength:
        'test must be shorter than or equal to 200 characters',
    });
  });

  it('should not validate a string with only spaces', async () => {
    const testClass = plainToInstance(TestClass, { test: '   ' });

    const errors = await validate(testClass, {
      stopAtFirstError: true,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toStrictEqual({
      isNotEmpty: 'test should not be empty',
    });
  });

  it('should not validate a string shorter than the default minimum length', async () => {
    const testClass = plainToInstance(OtherTestClass, { test: 'a' });

    const errors = await validate(testClass, {
      stopAtFirstError: true,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toStrictEqual({
      minLength: 'test must be longer than or equal to 2 characters',
    });
  });

  it('should not validate a string longer than the default maximum length', async () => {
    const testClass = plainToInstance(OtherTestClass, {
      test: 'a'.repeat(129),
    });

    const errors = await validate(testClass, {
      stopAtFirstError: true,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toStrictEqual({
      maxLength:
        'test must be shorter than or equal to 128 characters',
    });
  });
});
