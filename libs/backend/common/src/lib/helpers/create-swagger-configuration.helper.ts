import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export interface CreateSwaggerConfiguration {
  app: INestApplication;
  title: string;
  description: string;
  url: string;
}

export function createSwaggerConfiguration({
  app,
  title,
  description,
  url,
}: CreateSwaggerConfiguration) {
  const normalizedUrl = normalizeUrl(url);
  const documentBuilder = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .addServer(normalizedUrl);
  const document = SwaggerModule.createDocument(
    app,
    documentBuilder.build(),
  );

  SwaggerModule.setup('docs', app, document);
  return document;
}

function normalizeUrl(url: string) {
  const httpRegex = /^(http|https):\/\//;

  if (!httpRegex.test(url)) {
    const protocol = url.includes('localhost')
      ? 'http://'
      : 'https://';
    url = protocol + url;
  }
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }

  return url;
}
