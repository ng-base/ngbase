// we should support utc, parse, format, add, set, get, diff
export class DefaultDateAdapter {
  locale = 'en';
  constructor() {}

  setLocale(locale: string) {
    this.locale = locale;
  }

  format(date: Date, format: string) {
    // we should support format like yyyy, MM, dd, hh, mm, ss, SSS,
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return format
      .replace(/yyyy/, year.toString())
      .replace(/MM/, month.toString().padStart(2, '0'))
      .replace(/dd/, day.toString().padStart(2, '0'))
      .replace(/hh/, date.getHours().toString().padStart(2, '0'))
      .replace(/mm/, date.getMinutes().toString().padStart(2, '0'))
      .replace(/ss/, date.getSeconds().toString().padStart(2, '0'))
      .replace(/SSS/, date.getMilliseconds().toString().padStart(3, '0'));
  }
  parse(value: string, format: string) {
    const year = parseInt(value.slice(0, 4), 10);
    const month = parseInt(value.slice(5, 7), 10) - 1;
    const day = parseInt(value.slice(8, 10), 10);
    return new Date(year, month, day);
  }
  add(date: Date, amount: number, unit: number) {
    return new Date(date.getTime() + amount * 24 * 60 * 60 * 1000);
  }
  set(date: Date, value: number, unit: string) {
    if (unit === 'year') {
      date.setFullYear(value);
    } else if (unit === 'month') {
      date.setMonth(value);
    } else if (unit === 'date') {
      date.setDate(value);
    }
    return date;
  }
  get(date: Date, unit: string) {
    if (unit === 'year') {
      return date.getFullYear();
    } else if (unit === 'month') {
      return date.getMonth();
    } else if (unit === 'date') {
      return date.getDate();
    }
    return 0;
  }
  diff(dateA: Date, dateB: Date, unit: string) {
    const diff = dateA.getTime() - dateB.getTime();
    if (unit === 'year') {
      return dateA.getFullYear() - dateB.getFullYear();
    } else if (unit === 'month') {
      return (
        (dateA.getFullYear() - dateB.getFullYear()) * 12 +
        dateA.getMonth() -
        dateB.getMonth()
      );
    } else if (unit === 'date') {
      return Math.floor(diff / (24 * 60 * 60 * 1000));
    }
    return 0;
  }
}
