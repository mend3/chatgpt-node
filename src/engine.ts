import { IEngine } from './queue';

export abstract class Engine<T extends IEngine = IEngine, I = string> implements IEngine<I> {
  abstract model: string;
  abstract props: T['props'];
  constructor(readonly input: I, protected options?: T['props']) {}
}
