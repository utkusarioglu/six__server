export type ErrorsOut<Out extends Record<keyof any, any>> = {
  general?: string;
} & Partial<Record<keyof Out, string>>;
