import { Engine, IEngine } from '../engine';

interface DavinciEngine extends IEngine {
  model: string;
  props: {
    prompt: `Q: ${string}\nA:`;
    max_tokens: number;
    n: number;
    stop: string;
  };
}
export class Davinci extends Engine<DavinciEngine> {
  model = 'https://api.openai.com/v1/engines/davinci-codex/completions';

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

export class Davinci003 extends Engine {
  model = 'text-davinci-003';

  public get props() {
    return {
      prompt: this.input,
      temperature: 0,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };
  }
}
