export default async () => ({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  ENABLE_DOCUMENTATION: process.env.ENABLE_DOCUMENTATION,
  APP_URL: process.env.APP_URL,

  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  DB_SCHEMA: process.env.DB_SCHEMA,
  ENTITIES: ['dist/**/*.entity.js'],
  MIGRATIONS: ['dist/migration/*.js'],

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY,
  ENGINE: process.env.AUTH_ENGINE || 'JWT',
});
