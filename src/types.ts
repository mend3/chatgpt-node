import type { CompletionCreateParamsBase } from 'openai/resources/completions';

export interface IEngine<I = string> {
  model: string;
  props: CompletionCreateParamsBase;
  input: I;
}

export interface IAppCompletion {
  readonly engine: IEngine;
  ask(): Promise<any>;
}
export interface DavinciEngine extends IEngine {
  props: {
    model: string;
    prompt: `Q: ${string}\nA:`;
    max_tokens: number;
    n: number;
    stop: string;
  };
}
