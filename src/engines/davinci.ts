import { Engine, IEngine } from '../engine';

interface DavinciEngine extends IEngine {
  endpoint: string;
  props: {
    prompt: `Q: ${string}\nA:`;
    max_tokens: number;
    n: number;
    stop: string;
  };
}
export class Davinci extends Engine<DavinciEngine> {
  endpoint = 'https://api.openai.com/v1/engines/davinci-codex/completions';

  public get props() {
    return {
      prompt: `Q: ${this.input}\nA:` satisfies `Q: ${string}\nA:`,
      max_tokens: 150,
      n: 1,
      stop: '\n',
      ...this.options,
    };
  }
}
