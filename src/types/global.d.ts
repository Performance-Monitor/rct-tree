/// <reference path="apis.d.ts" />

interface Window {
  apis: IAPIs
  router: any
  sensors: any

  author: string
  CI_APP_NAME: string
  ENV_DOMAIN_RAW: string
  ENV_DOMAIN: string
  REDIS_HOST: string
  CACHE_REDIS_HOST: string
  CI_DEV_BRANCH: string
  CI_PROJECT_NAMESPACE: string
  ENV: 'DEV' | 'TEST' | 'STAGE' | 'PROD'
  INTERNAL_PORT: number
}
