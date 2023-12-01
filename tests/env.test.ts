import { Env } from '../src/env';

describe('Unit Tests for Env Namespace', () => {
  beforeEach(() => {
    delete process.env.OPENAI_API_ORG;
    delete process.env.OPENAI_API_KEY;
  });

  test('load should throw an error if OPENAI_API_ORG is missing', () => {
    delete process.env.OPENAI_API_ORG;

    expect(() => Env.load()).toThrowErrorMatchingSnapshot();
  });

  test('load should throw an error if OPENAI_API_KEY is missing', () => {
    delete process.env.OPENAI_API_KEY;

    expect(() => Env.load()).toThrowErrorMatchingSnapshot();
  });

  test('load should not throw an error if both environment variables are present', () => {
    process.env.OPENAI_API_ORG = 'org';
    process.env.OPENAI_API_KEY = 'key';

    expect(() => Env.load()).not.toThrow();
  });
});
