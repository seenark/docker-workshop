interface Env {}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

export {};
export type IEnv = Env;
