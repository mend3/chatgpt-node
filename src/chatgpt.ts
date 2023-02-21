import { Configuration, OpenAIApi } from 'openai';

const { OPENAI_API_ORG, OPENAI_API_KEY } = process.env;

export const configuration = new Configuration({
  organization: OPENAI_API_ORG,
  apiKey: OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);
