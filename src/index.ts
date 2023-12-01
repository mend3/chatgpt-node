import { DummyCompletion } from './completions/dummy';
import { HTTPCompletion } from './completions/http';
import { NativeCompletion } from './completions/native';
import { Davinci003, DavinciCodex } from './engines/davinci';
import { Env } from './env';
import { logger } from './logger';
import { Queue } from './queue';

Env.load();

(async () => {
  const query = 'how to build a docker image using terraform?';

  const davinci = new DavinciCodex(query);
  const davinci003 = new Davinci003(query);

  const enginesFirts = [davinci, davinci003]
    .map(engine =>
      [HTTPCompletion, NativeCompletion, DummyCompletion] //
        .map(completion => new completion(engine)),
    )
    .flat();

  const queue = new Queue(...enginesFirts).run();

  let done = false;
  do {
    const { value, done: isDone } = await queue.next();
    if (!(value instanceof Error)) {
      done = isDone || ((value as { status: number })?.status === 200 && !(value instanceof Error));
      return value;
    }
  } while (!done);
})()
  .catch(err => logger.error(err))
  .then(response => logger.info(response));
