import { openai } from '../chatgpt';
import { IAppCompletion, IEngine } from '../types';

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
