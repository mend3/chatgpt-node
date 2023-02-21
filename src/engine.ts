export interface IEngine<P = unknown> {
  model: string;
  props: P;
}

export abstract class Engine<T extends IEngine = IEngine, I = string> implements IEngine {
  abstract model: string;
  abstract props: T['props'];
  constructor(protected _input: I, protected options?: T['props']) {}

  withInput(input: typeof this._input) {
    this._input = input;
    return this;
  }

  public get input() {
    if (!this._input) throw new Error('No input provided');
    return this._input;
  }
}
