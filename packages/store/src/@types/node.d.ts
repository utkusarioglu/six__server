declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_PASSWORD: string;
      POSTGRES_USER: string;
      POSTGRES_DB: string;
    }
  }
}
