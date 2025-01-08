import {StrengthPipe} from "./strength.pipe";

describe('StrengthPipe', () => {
  it('should display weak if strength is 5', () => {
    let pipe = new StrengthPipe();

    //simple test we don't need to split it
    // let val = pipe.transform(5);

    expect(pipe.transform(5)).toEqual('5 (weak)')
  });

  it('should display strong if strength is 10', () => {
    let pipe = new StrengthPipe();

    expect(pipe.transform(10)).toEqual('10 (strong)');
  })
})
