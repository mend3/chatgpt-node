import { Configuration } from 'openai';

const { OPENAI_API_ORGANIZATION, OPENAI_API_KEY } = process.env;

export const configuration = new Configuration({
  organization: OPENAI_API_ORGANIZATION,
  apiKey: OPENAI_API_KEY,
});

export interface IEngine {
  endpoint: string;
  props: unknown;
}

export abstract class Engine<T extends IEngine = IEngine, I = string> implements IEngine {
  abstract endpoint: string;
  abstract props: T['props'];
  constructor(protected _input: I, protected options?: T['props']) {}

  withInput(input: typeof this._input) {
    this._input = input;
    return this;
  }

  protected get input() {
    if (!this._input) throw new Error('No input provided');
    return this._input;
  }
}
