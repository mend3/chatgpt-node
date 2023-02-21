import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CreateCompletionRequest, CreateCompletionResponse } from 'openai';
import { Engine } from './engine';
import { openai, configuration } from './chatgpt';

interface ICompletion {
  readonly engine: Engine;
  ask(): Promise<unknown>;
}

export class Completion implements ICompletion {
  constructor(public readonly engine: Engine) {}

  async ask() {
    const { model, input, props } = this.engine;
    return openai.createCompletion({
      ...(props as CreateCompletionRequest),
      model,
      prompt: input,
    }) as Promise<AxiosResponse<CreateCompletionResponse>>;
  }
}

export class HTTPCompletion implements ICompletion {
  constructor(public readonly engine: Engine) {}

  async ask() {
    const { model, props } = this.engine;
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${configuration.apiKey}`,
      },
    };

    return axios.post<CreateCompletionResponse>(model, props, config);
  }
}
