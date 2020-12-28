declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_HTTP_PORT: string; // this is actually a number
    }
  }
}

export {};
