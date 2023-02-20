import axios, { AxiosRequestConfig } from 'axios';
import { configuration, Engine } from './engine';
import engines from './engines';

async function getChatResponse(engine: Engine) {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${configuration.apiKey}`,
    },
  };

  const response = await axios.post(engine.endpoint, engine.props, config);
  const chatResponse = response.data.choices[0].text.trim();
  return chatResponse;
}

const davinci = new engines.Davinci('how to implement chatgpt apu with nodejs and typescript?');
await getChatResponse(davinci);
