declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_SESSION_SECRET: string;
      AUTH_USERNAME_LENGTH_MIN: string; // number
      AUTH_USERNAME_LENGTH_MAX: string; // number
      AUTH_PASSWORD_LENGTH_MIN: string; // number
      AUTH_PASSWORD_LENGTH_MAX: string; // number
    }
  }
}

export {};
