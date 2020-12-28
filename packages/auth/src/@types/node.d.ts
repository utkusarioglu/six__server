declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_SESSION_SECRET: string;
    }
  }
}
