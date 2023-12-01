import { OpenAI } from 'openai';
import { Env } from './env';

export const openai = new OpenAI(Env.variables);
