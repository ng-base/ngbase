import { interpolate } from './config';

describe('interpolate', () => {
  it('should interpolate the key with the params', () => {
    expect(interpolate('Hello {{ name }}', { name: 'John' })).toBe('Hello John');
    expect(interpolate('Hello {{name}}', { name: 'John' })).toBe('Hello John');
    expect(interpolate('Hello {{ name }}', {})).toBe('Hello {{ name }}');
    expect(interpolate(undefined as any, { name: 'John' })).toBe(undefined);
  });
});
