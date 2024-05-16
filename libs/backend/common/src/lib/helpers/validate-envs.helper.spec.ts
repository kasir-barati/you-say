import { IsNumber, IsString } from 'class-validator';
import { validateEnvs } from './validate-envs.helper';

class EnvironmentVariables1 {
  @IsString()
  env1: string;

  @IsNumber()
  env2: number;
}

describe('validateEnvs', () => {
  it.each<
    [
      Parameters<typeof validateEnvs>['0'],
      Parameters<typeof validateEnvs>['1'],
    ]
  >([[{ env1: '', env2: 2 }, EnvironmentVariables1]])(
    'should validate the object based on the class',
    (rawEnvs, EnvironmentVariables) => {
      const validatedEnvs = validateEnvs(
        rawEnvs,
        EnvironmentVariables,
      );

      expect(rawEnvs).toStrictEqual({ ...validatedEnvs });
    },
  );

  it('should throw an error if there were any validation errors', () => {
    const rawEnvs = { something: 'else' };

    expect(() =>
      validateEnvs(rawEnvs, EnvironmentVariables1),
    ).toThrow();
  });
});
