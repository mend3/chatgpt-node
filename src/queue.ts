import { logger } from './logger';
import { IAppCompletion } from './types';

export class Queue {
  #completions: IAppCompletion[] = [];
  #maxRetries = 3;

  #cache = new Map<string, IAppCompletion>();

  constructor(...completions: IAppCompletion[]) {
    this.#completions = completions;
  }

  enqueue(completion: IAppCompletion) {
    this.#completions.push(completion);
    return this;
  }

  getCompletion(key: string, completion: IAppCompletion) {
    const cached = this.#cache.get(key);

    if (!cached) this.#cache.set(key, completion);

    return cached as IAppCompletion;
  }

  async runWithRetryAndThrottle(props: {
    completion: IAppCompletion;
    retryCount: number;
    key: string;
  }): Promise<unknown | Error> {
    const { completion, retryCount, key } = props;

    try {
      const result = await this.getCompletion(key, completion).ask();

      logger.log(`${key} succeeded!`);
      return result;
    } catch (error) {
      if (retryCount < this.#maxRetries) {
        return this.runWithRetryAndThrottle({ ...props, retryCount: props.retryCount + 1 });
      } else {
        return error;
      }
    }
  }

  async *run() {
    let retryCount = 0;

    for (const completion of this.#completions) {
      const labels = { engine: completion.engine.constructor.name, ai: completion.constructor.name };
      const key = Object.values(labels).join('-');

      logger.log(`Running ${key}...`);
      let result = await this.runWithRetryAndThrottle({ key, completion, retryCount });

      while (result instanceof Error && retryCount < this.#maxRetries) {
        retryCount++;

        logger.log(`(${retryCount}/${this.#maxRetries}): ${(result as Error).message}`);
        result = await this.runWithRetryAndThrottle({ key, completion, retryCount });
      }

      retryCount = 0;

      yield result;
    }
  }
}
