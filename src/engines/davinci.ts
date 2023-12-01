import { Engine } from '../engine';
import { IEngine } from '../queue';

interface DavinciEngine extends IEngine {
  props: {
    model: string;
    prompt: `Q: ${string}\nA:`;
    max_tokens: number;
    n: number;
    stop: string;
  };
}
export class OpenDavinci extends Engine<DavinciEngine> {
  model = 'https://api.openai.com/v1/engines/davinci-codex/completions';

  public get props() {
    return {
      ...this.options,
      model: this.model,
      prompt: `Q: ${this.input}\nA:` satisfies `Q: ${string}\nA:`,
      max_tokens: 150,
      n: 1,
      stop: '\n',
    };
  }
}

export class Davinci003 extends Engine {
  model = 'text-davinci-003';

  public get props() {
    return {
      model: this.model,
      prompt: this.input,
      temperature: 0,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };
  }
}
