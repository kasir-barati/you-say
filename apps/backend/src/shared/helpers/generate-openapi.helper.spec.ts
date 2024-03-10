import { OpenAPIObject } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { writeOpenApi } from './generate-openapi.helper';
import { SinonMock } from './sinon-mock.helper';

describe('writeOpenApi', () => {
  it('should write openApi.json', async () => {
    const openApi = SinonMock.with<OpenAPIObject>({
      info: { title: 'test' },
    });
    const outputPath = writeOpenApi(openApi, '/tmp');
    const openApiJson = JSON.parse(
      await readFile(outputPath, {
        encoding: 'utf-8',
      }),
    );

    expect(openApiJson).toStrictEqual(openApi);
  });
});
