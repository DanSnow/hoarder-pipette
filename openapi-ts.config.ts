import { defaultPlugins, defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input:
    'https://raw.githubusercontent.com/karakeep-app/karakeep/refs/heads/main/packages/open-api/karakeep-openapi-spec.json',
  output: 'shared/client',
  plugins: [...defaultPlugins, 'zod'],
})
