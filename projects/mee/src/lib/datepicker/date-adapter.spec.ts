import { DefaultDateAdapter } from './date-adapter';

describe('DefaultDateAdapter', () => {
  let adapter: DefaultDateAdapter;

  beforeEach(() => {
    adapter = new DefaultDateAdapter();
  });

  test('setLocale', () => {
    adapter.setLocale('fr');
    expect(adapter.locale).toBe('fr');
  });

  describe('format', () => {
    const testDate = new Date(2023, 5, 15, 14, 30, 45, 500); // June 15, 2023, 14:30:45.500

    test.each([
      ['yyyy-MM-dd HH:mm:ss.SSS', '2023-06-15 14:30:45.500'],
      ['yy-M-d h:mm a', '23-6-15 2:30 PM'],
      ['YYYY-MM-DD', '2023-06-15'],
      ['d MMM yyyy', '15 Jun 2023'],
      ['hh:mm:ss', '02:30:45'],
    ])('formats "%s" correctly', (format, expected) => {
      expect(adapter.format(testDate, format)).toBe(expected);
    });

    test('handles string input', () => {
      expect(adapter.format('2023-06-15', 'yyyy-MM-dd')).toBe('2023-06-15');
    });

    test('returns empty string for falsy input', () => {
      expect(adapter.format(null, 'yyyy-MM-dd')).toBe('');
      expect(adapter.format(undefined, 'yyyy-MM-dd')).toBe('');
    });

    test('handles invalid date', () => {
      expect(adapter.format(new Date('invalid'), 'yyyy-MM-dd')).toBe('');
    });
  });

  describe('parse', () => {
    test('parses valid date string', () => {
      expect(adapter.parse('2023-06-15')).toEqual(new Date(2023, 5, 15));
    });

    test('parses Date object', () => {
      const date = new Date(2023, 5, 15, 14, 30);
      expect(adapter.parse(date)).toEqual(new Date(2023, 5, 15));
    });

    test('handles invalid string', () => {
      expect(adapter.parse('invalid')).toBeInstanceOf(Date);
      expect(adapter.parse('invalid').getTime()).toBeNaN();
    });

    test('handles different date formats', () => {
      expect(adapter.parse('2023/06/15')).toEqual(new Date(2023, 5, 15));
      expect(adapter.parse('15-06-2023')).toEqual(new Date(2023, 5, 15));
    });
  });

  test('add', () => {
    const date = new Date(2023, 0, 15);
    expect(adapter.add(date, 5)).toEqual(new Date(2023, 0, 20));
  });

  describe('set', () => {
    test('sets year', () => {
      const date = new Date(2023, 0, 15);
      expect(adapter.set(date, 2024, 'year')).toEqual(new Date(2024, 0, 15));
    });

    test('sets month', () => {
      const date = new Date(2023, 0, 15);
      expect(adapter.set(date, 5, 'month')).toEqual(new Date(2023, 5, 15));
    });

    test('sets date', () => {
      const date = new Date(2023, 0, 15);
      expect(adapter.set(date, 20, 'date')).toEqual(new Date(2023, 0, 20));
    });
  });

  describe('get', () => {
    const testDate = new Date(2023, 5, 15);

    test.each([
      ['year', 2023],
      ['month', 5],
      ['date', 15],
    ])('gets %s correctly', (unit, expected) => {
      expect(adapter.get(testDate, unit)).toBe(expected);
    });

    test('returns 0 for invalid unit', () => {
      expect(adapter.get(testDate, 'invalid')).toBe(0);
    });
  });

  describe('diff', () => {
    test.each([
      ['year', new Date(2025, 5, 15), new Date(2023, 5, 15), 2],
      ['month', new Date(2023, 11, 15), new Date(2023, 5, 15), 6],
      ['days', new Date(2023, 5, 20), new Date(2023, 5, 15), 5],
    ])('calculates %s difference correctly', (unit, dateA, dateB, expected) => {
      expect(adapter.diff(dateA, dateB, unit)).toBe(expected);
    });

    test('handles negative differences', () => {
      expect(adapter.diff(new Date(2023, 5, 15), new Date(2025, 5, 15), 'year')).toBe(-2);
    });

    test('returns 0 for invalid unit', () => {
      expect(adapter.diff(new Date(2023, 5, 15), new Date(2023, 5, 10), 'invalid')).toBe(0);
    });
  });
});
