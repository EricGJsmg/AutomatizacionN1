import cypress from 'cypress';
import fs from 'fs';
import cypressFailFast from 'cypress-fail-fast/plugin';
import { DBService } from './cypress/support/services/db/db-service';
import { environment } from './cypress/environments';

export default cypress.defineConfig({
  e2e: {
    baseUrl: environment.baseUrl,
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,ts}',
    defaultCommandTimeout: 20000, // global timeout 20s
    testIsolation: true, // isolated its
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 1, // needed to read last logs
    viewportWidth: 1440,
    viewportHeight: 900,
    video: false,
    redirectionLimit: 50, // redirects are cumulative and RF queries many times
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      cypressFailFast(on, config);
      const dbService = new DBService();
      on('task', {
        exists(filePath) {
          return fs.existsSync(filePath);
        },
        select({ query, params }: { query: string; params?: any[] }) {
          return dbService.select(query, params);
        },
        mutate({ query, params }: { query: string; params?: any[] }) {
          try {
            const result = dbService.mutate(query, params);
            return result ?? null;
          } catch (err) {
            return null;
          }
        },
        log({ msg, saveToFile = false }) {
          console.log(msg);
          if (saveToFile) {
            const logFileName = `logs/cypress-${new Date().toISOString().split('T')[0]}.log`;
            fs.appendFileSync(logFileName, msg + '\n', { encoding: 'utf8' });
          }
          return null;
        },
      });
      on('after:run', () => {
        dbService.close();
      });

      return config;
    },
    env: environment,
  },
});
