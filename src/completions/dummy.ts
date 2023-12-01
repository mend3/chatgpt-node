import { IAppCompletion, IEngine } from '../types';

export class DummyCompletion implements IAppCompletion {
  constructor(public readonly engine: IEngine) {}

  async ask() {
    return `I'm dummy but I work!`;
  }
}
