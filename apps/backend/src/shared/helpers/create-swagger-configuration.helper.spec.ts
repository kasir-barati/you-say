import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  CreateSwaggerConfiguration,
  createSwaggerConfiguration,
} from './create-swagger-configuration.helper';

describe('createSwaggerConfiguration', () => {
  it.each<Omit<CreateSwaggerConfiguration, 'app'>>([
    {
      title: 'test-title1',
      description: 'test-description1',
      url: 'http://localhost:3000',
    },
    {
      title: 'test-title3',
      description: 'test-description3',
      url: 'https://you-say.com',
    },
  ])(
    'should return the created swagger configuration',
    async ({ title, description, url }) => {
      const app = await NestFactory.create(SomeModule);

      const result = createSwaggerConfiguration({
        app,
        description,
        title,
        url,
      });

      expect(result.info).toStrictEqual(
        expect.objectContaining({
          title,
          description,
        }),
      );
      expect(result.servers).toStrictEqual([
        {
          url,
          description: undefined,
          variables: undefined,
        },
      ]);
    },
  );

  it.each<{ url: string; expectedUrl: string }>([
    {
      url: 'localhost:3000',
      expectedUrl: 'http://localhost:3000',
    },
    {
      url: 'you-say.com',
      expectedUrl: 'https://you-say.com',
    },
  ])(
    'should add http/https at the beginning of the url',
    async ({ url, expectedUrl }) => {
      const app = await NestFactory.create(SomeModule);

      const result = createSwaggerConfiguration({
        app,
        description: '',
        title: '',
        url,
      });

      expect(result.servers).toStrictEqual([
        {
          url: expectedUrl,
          description: undefined,
          variables: undefined,
        },
      ]);
    },
  );

  it('should remove trailing / from the url', async () => {
    const app = await NestFactory.create(SomeModule);

    const result = createSwaggerConfiguration({
      app,
      description: '',
      title: '',
      url: 'http://localhost:3000/',
    });

    expect(result.servers).toStrictEqual([
      {
        url: 'http://localhost:3000',
        description: undefined,
        variables: undefined,
      },
    ]);
  });
});

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
class SomeModule {}
