import { range } from './range.util';

describe('range', () => {
  it('should generate an array with numbers from start to end with the default step', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('should generate an array with the specified step', () => {
    expect(range(1, 10, 2)).toEqual([1, 3, 5, 7, 9]);
  });

  it.each<number[]>([
    [1, 10],
    [4, 1],
  ])('should generate an empty array with 0 as step', (from, to) => {
    expect(range(from, to, 0)).toEqual([]);
  });

  it('should generate a reverse range when step is negative', () => {
    expect(range(10, 1, -2)).toEqual([10, 8, 6, 4, 2]);
  });

  it('should generate an empty array when start is greater than end', () => {
    expect(range(10, 5)).toEqual([]);
  });

  it('should generate an array with the start when start equals end and step is default', () => {
    expect(range(5, 5)).toEqual([5]);
  });

  it('should generate an empty array with a single element when start equals end and step is specified', () => {
    expect(range(5, 5, 2)).toEqual([]);
  });
});
