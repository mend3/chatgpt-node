import axios from 'axios';
import { openai } from './chatgpt';
import { DummyCompletion, HTTPCompletion, NativeCompletion } from './completion';
import engines from './engines/index';

describe('Integration Tests for Completions', () => {
  const query = 'how to build a docker image using terraform?';
  describe('davinci', () => {
    const davinci = new engines.OpenDavinci(query);

    test('HTTPCompletion should handle errors', async () => {
      axios.prototype.post = vi.fn().mockRejectedValueOnce(new Error('Request failed with status code 401'));
      const httpCompletion = new HTTPCompletion(davinci);

      await expect(httpCompletion.ask()).rejects.toThrowErrorMatchingSnapshot();
    });

    test('NativeCompletion should handle errors', async () => {
      openai.chat.completions.create.prototype = vi
        .fn()
        .mockRejectedValueOnce(
          new Error(
            '401 Incorrect API key provided: my-key. You can find your API key at https://platform.openai.com/account/api-keys.',
          ),
        );

      const nativeCompletion = new NativeCompletion(davinci);

      await expect(nativeCompletion.ask()).rejects.toThrowErrorMatchingSnapshot();
    });

    test('DummyCompletion should succeed', async () => {
      const dummyCompletion = new DummyCompletion(davinci);

      await expect(dummyCompletion.ask()).resolves.toMatchSnapshot();
    });
  });
  describe('davinci003', () => {
    const davinci003 = new engines.Davinci003(query);

    test('HTTPCompletion should handle errors', async () => {
      axios.prototype.post = vi.fn().mockRejectedValueOnce(new Error('Request failed with status code 401'));
      const httpCompletion = new HTTPCompletion(davinci003);

      await expect(httpCompletion.ask()).rejects.toThrowErrorMatchingSnapshot();
    });

    test('NativeCompletion should handle errors', async () => {
      openai.chat.completions.create.prototype = vi
        .fn()
        .mockRejectedValueOnce(
          new Error(
            '401 Incorrect API key provided: my-key. You can find your API key at https://platform.openai.com/account/api-keys.',
          ),
        );

      const nativeCompletion = new NativeCompletion(davinci003);
      const nativeStube = vi.spyOn(nativeCompletion, 'ask');

      await expect(nativeCompletion.ask()).rejects.toThrowErrorMatchingSnapshot();
      expect(nativeStube).toBeCalledTimes(1)
    });

    test('DummyCompletion should succeed', async () => {
      const dummyCompletion = new DummyCompletion(davinci003);
      const dummyStub = vi.spyOn(dummyCompletion, 'ask');

      await expect(dummyCompletion.ask()).resolves.toMatchSnapshot();
      expect(dummyStub).toBeCalledTimes(1)
    });
  });
});
