import { inject, InjectionToken } from '@angular/core';

export type MeeDateUnits = 'year' | 'month' | 'date' | 'hour' | 'minute' | 'second' | 'millisecond';

export interface MeeAdpterInterface<D> {
  now(): D;
  compare(first: D, second: D): number;
  getTime(date: D): number;
  getYear(date: D): number;
  getMonth(date: D): number;
  getDate(date: D): number;
  getDay(date: D): number;
  create(year: number, month?: number, date?: number): D;
  format(date: D, displayFormat: any): string;
  parse(value: D | string, parseFormat?: string): D;
  set(date: D, value: number, unit: MeeDateUnits): D;
  longMonthNames(date: D): string;
}

export const MeeDateAdapter = new InjectionToken<MeeAdpterInterface<unknown>>('mat-date-formats');

export function injectMeeDateAdapter<D>() {
  const adapter = inject(MeeDateAdapter, { optional: true }) as MeeAdpterInterface<D>;
  return adapter || (new MeeNativeDateAdapter() as unknown as MeeAdpterInterface<D>);
}

export class MeeNativeDateAdapter implements MeeAdpterInterface<Date> {
  now(): Date {
    return new Date();
  }

  create(year: number, month = 0, date = 1): Date {
    return new Date(year, month, date);
  }

  compare(first: Date, second: Date): number {
    return first.getTime() - second.getTime();
  }

  getTime(date: Date): number {
    return date.getTime();
  }

  getYear(date: Date): number {
    return date.getFullYear();
  }

  getMonth(date: Date): number {
    return date.getMonth();
  }

  getDate(date: Date): number {
    return date.getDate();
  }

  getDay(date: Date): number {
    return date.getDay();
  }

  format(date: Date, format: string): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const formatters: { [key: string]: () => string } = {
      YYYY: () => d.getFullYear().toString(),
      yyyy: () => d.getFullYear().toString(),
      yy: () => d.getFullYear().toString().slice(-2),
      MMM: () => d.toLocaleString('default', { month: 'short' }),
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
      ISO: () => d.toISOString(),
      a: () => (d.getHours() < 12 ? 'AM' : 'PM'),
    };

    const regex = /\b(?:yyyy|YYYY|yy|MMM|MM|M|DD|dd|d|HH|H|hh|h|mm|ss|SSS|a|ISO)\b/g;
    return format.replace(regex, match => formatters[match]?.() ?? match);
  }

  private pad(value: number, length = 2): string {
    return value.toString().padStart(length, '0');
  }

  // We have to parse the date string like '2024-10-01T00:00:00.000Z'

  parse(value: Date | string, parseFormat?: string): Date {
    if (value instanceof Date) return new Date(value.setHours(0, 0, 0, 0));
    if (typeof value !== 'string') return new Date(NaN);
    if (value.includes('T')) {
      return new Date(value);
    }

    const parts = value.split(/\D+/).map(Number);
    if (parts.length !== 3) return new Date(NaN);

    const [a, b, c] = parts;
    return a > 31 ? new Date(a, b - 1, c) : new Date(c, b - 1, a);
  }

  set(date: Date, value: number, unit: MeeDateUnits): Date {
    const newDate = new Date(date);
    if (unit === 'year') newDate.setFullYear(value);
    else if (unit === 'month') newDate.setMonth(value);
    else if (unit === 'date') newDate.setDate(value);
    else if (unit === 'hour') newDate.setHours(value);
    else if (unit === 'minute') newDate.setMinutes(value);
    else if (unit === 'second') newDate.setSeconds(value);
    else if (unit === 'millisecond') newDate.setMilliseconds(value);
    return newDate;
  }

  longMonthNames(date: Date): string {
    return date.toLocaleString('default', { month: 'long' });
  }
}
