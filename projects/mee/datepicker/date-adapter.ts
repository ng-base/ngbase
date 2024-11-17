export class NativeDateAdapter {
  locale = 'en';

  setLocale(locale: string) {
    this.locale = locale;
  }

  format(date: Date | string | null | undefined, format: string) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const formatters: { [key: string]: () => string } = {
      YYYY: () => d.getFullYear().toString(),
      yyyy: () => d.getFullYear().toString(),
      yy: () => d.getFullYear().toString().slice(-2),
      MMM: () => d.toLocaleString(this.locale, { month: 'short' }),
      MM: () => this.pad(d.getMonth() + 1),
      M: () => (d.getMonth() + 1).toString(),
      DD: () => this.pad(d.getDate()),
      dd: () => this.pad(d.getDate()),
      d: () => d.getDate().toString(),
      HH: () => this.pad(d.getHours()),
      H: () => d.getHours().toString(),
      hh: () => this.pad(d.getHours() % 12 || 12),
      h: () => (d.getHours() % 12 || 12).toString(),
      mm: () => this.pad(d.getMinutes()),
      ss: () => this.pad(d.getSeconds()),
      SSS: () => this.pad(d.getMilliseconds(), 3),
      a: () => (d.getHours() < 12 ? 'AM' : 'PM'),
    };

    const regex = /\b(?:yyyy|YYYY|yy|MMM|MM|M|DD|dd|d|HH|H|hh|h|mm|ss|SSS|a)\b/g;
    return format.replace(regex, match => formatters[match]?.() ?? match);
  }

  private pad(value: number, length = 2) {
    return value.toString().padStart(length, '0');
  }

  parse(value: Date | string) {
    if (value instanceof Date) return new Date(value.setHours(0, 0, 0, 0));
    if (typeof value !== 'string') return new Date(NaN);

    const parts = value.split(/\D+/).map(Number);
    if (parts.length !== 3) return new Date(NaN);

    const [a, b, c] = parts;
    return a > 31 ? new Date(a, b - 1, c) : new Date(c, b - 1, a);
  }

  add(date: Date, days: number) {
    return new Date(date.getTime() + days * 86400000);
  }

  set(date: Date, value: number, unit: string) {
    const newDate = new Date(date);
    if (unit === 'year') newDate.setFullYear(value);
    else if (unit === 'month') newDate.setMonth(value);
    else if (unit === 'date') newDate.setDate(value);
    return newDate;
  }

  get(date: Date, unit: string) {
    if (unit === 'year') return date.getFullYear();
    if (unit === 'month') return date.getMonth();
    if (unit === 'date') return date.getDate();
    return 0;
  }

  diff(dateA: Date, dateB: Date, unit: string) {
    const diffTime = dateA.getTime() - dateB.getTime();
    if (unit === 'year') return dateA.getFullYear() - dateB.getFullYear();
    if (unit === 'month')
      return (dateA.getFullYear() - dateB.getFullYear()) * 12 + dateA.getMonth() - dateB.getMonth();
    if (unit === 'days') return Math.floor(diffTime / 86400000);
    return 0;
  }
}
