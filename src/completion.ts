import axios, { AxiosRequestConfig } from 'axios';
import { Completion } from 'openai/resources';
import { IAppCompletion, IEngine } from './queue';
import { openai } from './chatgpt';
import { Env } from './env';

export class DummyCompletion implements IAppCompletion {
  constructor(public readonly engine: IEngine) {}

  async ask() {
    return `I'm dummy but I work!`;
  }
}
export class NativeCompletion implements IAppCompletion {
  constructor(public readonly engine: IEngine) {}

  async ask() {
    const { model, input, props } = this.engine;
    return openai.chat.completions.create({
      ...props,
      model,
      messages: [{ role: 'user', content: input }],
    });
  }
}

export class HTTPCompletion implements IAppCompletion {
  constructor(public readonly engine: IEngine) {}

  async ask() {
    const { model, props } = this.engine;
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Env.variables.apiKey}`,
      },
    };

    return axios.post<Completion>(model, props, config).then(({ data }) => data);
  }
}
