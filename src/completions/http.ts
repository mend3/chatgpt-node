import axios, { AxiosRequestConfig } from 'axios';
import { Env } from '../env';
import { IAppCompletion, IEngine } from '../types';

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

    return axios.post(model, props, config).then(({ data }) => data);
  }
}
