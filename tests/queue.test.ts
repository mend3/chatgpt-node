import { DummyCompletion } from '../src/completions/dummy';
import { HTTPCompletion } from '../src/completions/http';
import { NativeCompletion } from '../src/completions/native';
import { Davinci003, DavinciCodex } from '../src/engines/davinci';
import { Queue } from '../src/queue';

describe('Unit Tests for the Queue System', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  const query = 'how to build a docker image using terraform?';
  const error401 = new Error('Request failed with status code 401');
  const apiKeyError = new Error(
    '401 Incorrect API key provided: my-key. You can find your API key at https://platform.openai.com/account/api-keys.',
  );

  test('Queue should handle completions and retries', async () => {
    const davinci = new DavinciCodex(query);

    // Mock HTTPCompletion to fail on the first two attempts
    HTTPCompletion.prototype.ask = vi
      .fn()
      .mockRejectedValueOnce(error401)
      .mockRejectedValueOnce(error401)
      .mockResolvedValueOnce({ status: 200, data: 'HTTPCompletion succeeded!' });

    const httpCompletion = new HTTPCompletion(davinci);
    const httpStub = vi.spyOn(httpCompletion, 'ask');

    // Mock NativeCompletion to fail on the first attempt
    NativeCompletion.prototype.ask = vi
      .fn()
      .mockRejectedValueOnce(apiKeyError)
      .mockResolvedValueOnce({ status: 200, data: 'NativeCompletion succeeded!' });
    const nativeCompletion = new NativeCompletion(davinci);
    const nativeStub = vi.spyOn(nativeCompletion, 'ask');

    // Mock DummyCompletion to always succeed
    DummyCompletion.prototype.ask = vi.fn().mockResolvedValue({ status: 200, data: 'DummyCompletion succeeded!' });

    const dummyCompletion = new DummyCompletion(davinci);
    const dummyStub = vi.spyOn(dummyCompletion, 'ask');

    const queue = new Queue();

    queue.enqueue(httpCompletion).enqueue(nativeCompletion).enqueue(dummyCompletion);

    const iterator = queue.run();

    // First iteration - HTTPCompletion fails twice, then succeeds
    let result = await iterator.next();
    expect(result.value).toMatchSnapshot();
    expect(result.done).toBe(false);
    expect(httpStub).toHaveBeenCalledTimes(3); // 2 failures + 1 success

    // Second iteration - NativeCompletion fails once, then succeeds
    result = await iterator.next();
    expect(result.value).toMatchSnapshot();
    expect(result.done).toBe(false);
    expect(nativeStub).toHaveBeenCalledTimes(2); // 1 failure + 1 success

    // Third iteration - DummyCompletion always succeeds
    result = await iterator.next();
    expect(result.value).toMatchSnapshot();
    expect(result.done).toBe(false);
    expect(dummyStub).toHaveBeenCalledTimes(1); // 1 success
  });

  test('Queue should run all max retries', async () => {
    const davinci = new Davinci003(query);

    // Mock HTTPCompletion to fail on the first two attempts
    HTTPCompletion.prototype.ask = vi
      .fn()
      .mockRejectedValueOnce(error401)
      .mockRejectedValueOnce(error401)
      .mockRejectedValueOnce(error401);

    const httpCompletion = new HTTPCompletion(davinci);
    const httpStub = vi.spyOn(httpCompletion, 'ask');

    // Mock NativeCompletion to fail on the first attempt
    NativeCompletion.prototype.ask = vi
      .fn()
      .mockRejectedValueOnce(apiKeyError)
      .mockRejectedValueOnce(apiKeyError)
      .mockRejectedValueOnce(apiKeyError);
    const nativeCompletion = new NativeCompletion(davinci);
    const nativeStub = vi.spyOn(nativeCompletion, 'ask');

    // Mock DummyCompletion to always succeed
    DummyCompletion.prototype.ask = vi
      .fn()
      .mockRejectedValueOnce(error401)
      .mockRejectedValueOnce(error401)
      .mockRejectedValueOnce(error401);

    const dummyCompletion = new DummyCompletion(davinci);
    const dummyStub = vi.spyOn(dummyCompletion, 'ask');

    const queue = new Queue();

    queue.enqueue(httpCompletion).enqueue(nativeCompletion).enqueue(dummyCompletion);

    const iterator = queue.run();

    // First iteration - HTTPCompletion fails twice, then succeeds
    let result = await iterator.next();
    expect(result.value).toMatchSnapshot();
    expect(result.done).toBe(false);
    expect(httpStub).toHaveBeenCalledTimes(4);

    // Second iteration - NativeCompletion fails once, then succeeds
    result = await iterator.next();
    expect(result.value).toMatchSnapshot();
    expect(result.done).toBe(false);
    expect(nativeStub).toHaveBeenCalledTimes(4);

    // Third iteration - DummyCompletion always succeeds
    result = await iterator.next();
    expect(result.value).toMatchSnapshot();
    expect(result.done).toBe(false);
    expect(dummyStub).toHaveBeenCalledTimes(4);

    // Last iteration - should be done
    result = await iterator.next();
    expect(result.value).toMatchSnapshot();
    expect(result.done).toBe(true);
  });
});
