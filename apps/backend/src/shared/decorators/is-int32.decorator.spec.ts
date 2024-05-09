import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { IsInt32 } from './is-int32.decorator';

class TestSignedInt32 {
  @IsInt32()
  test: number;
}

class TestUnsignedInt {
  @IsInt32(true)
  test: number;
}

describe('IsInt32', () => {
  it.each<number>([
    0, 100, 2_000_000_000, 12_000, 130_000, 1_400_000, 15_000_000,
    1_000_000_000, -100, -100_000, -111_111_000, -2_000_000_000,
  ])('should pass when it is a signed int32: %i', async (number) => {
    const plain = { test: number };
    const testClass = plainToInstance(TestSignedInt32, plain);

    const errors = await validate(testClass);

    expect(errors.length).toEqual(0);
  });

  it.each<number>([
    -2_147_483_649, 2_147_483_648, 2_447_483_647, -2_400_000_000, 1.1,
    2.0001, -123.123, 1.00000001,
  ])(
    'should not pass when it is not a signed int32: %i',
    async (number) => {
      const plain = { test: number };
      const testClass = plainToInstance(TestSignedInt32, plain);

      const errors = await validate(testClass);

      expect(errors.length).toEqual(1);
    },
  );

  it.each<number>([
    0, 100, 2_000_000_000, 12_000, 130_000, 1_400_000, 15_000_000,
    1_000_000_000, 3_000_000_000, 4_000_000_000, 4_200_000_000,
  ])('should pass when it is unsigned int32: %i', async (number) => {
    const plain = { test: number };
    const testClass = plainToInstance(TestUnsignedInt, plain);

    const errors = await validate(testClass);

    expect(errors.length).toEqual(0);
  });

  it.each<number>([-1, 4_294_967_296, 5_294_967_290])(
    'should not pass when it is not a valid unsigned int32: %i',
    async (number) => {
      const plain = { test: number };
      const testClass = plainToInstance(TestUnsignedInt, plain);

      const errors = await validate(testClass);

      expect(errors.length).toEqual(1);
    },
  );
});
