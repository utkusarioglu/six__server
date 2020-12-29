declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_SESSION_SECRET: string;
    }
  }
}

export {};
