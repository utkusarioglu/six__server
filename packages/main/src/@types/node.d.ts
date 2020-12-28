declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_HTTP_PORT: string; // contains number
      NODE_ALLOWED_ORIGINS: string; // contains comma separated array
    }
  }
}

export {};
