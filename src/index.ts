import { Completion, HTTPCompletion } from './completion';
import { Engine } from './engine';
import engines from './engines/index';

const davinci = new engines.Davinci('how to build a docker image using terraform?');

const davinci003 = new engines.Davinci003(
  'A table summarizing the fruits from Goocrux:\n\nThere are many fruits that were found on the recently discovered planet Goocrux. There are neoskizzles that grow there, which are purple and taste like candy. There are also loheckles, which are a grayish blue fruit and are very tart, a little bit like a lemon. Pounits are a bright green color and are more savory than sweet. There are also plenty of loopnovas which are a neon pink flavor and taste like cotton candy. Finally, there are fruits called glowls, which have a very sour and bitter taste which is acidic and caustic, and a pale orange tinge to them.\n\n| Fruit | Color | Flavor |',
);

class Queue {
  #completions: typeof Completion[] = [];
  constructor(public readonly engine: Engine, ...completions: typeof Completion[]) {
    this.#completions = completions;
  }

  enqueue(completion: typeof Completion) {
    this.#completions.push(completion);
    return this;
  }

  async start() {
    let completion: typeof Completion | undefined;
    while ((completion = this.#completions.shift())) {
      const ai = new completion(this.engine);
      const key = ai.constructor.name.concat(` - ${this.engine.constructor.name}`);
      console.time(key);
      await ai.ask().then(({ data, status, statusText }) => ({ status, statusText, data }));
      console.timeEnd(key);
    }
  }
}

[davinci, davinci003].forEach(async engine => {
  const queue = new Queue(engine, Completion, HTTPCompletion);
  await queue.start().catch(() => {
    //
  });
});
