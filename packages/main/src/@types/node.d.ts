declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_HTTP_PORT: string; // contains number
      SERVER_ALLOWED_ORIGINS: string; // contains comma separated array
    }
  }
}

export {};
