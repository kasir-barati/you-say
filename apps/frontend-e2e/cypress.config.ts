import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

const url = 'http://localhost:3000';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: { default: 'nx run frontend:start' },
      ciWebServerCommand: 'nx run frontend:serve-static',
    }),
    baseUrl: url,
    env: { FRONTEND_URL: url },
  },
});
