import { InjectionToken } from '@angular/core';

export const NgbDateAdapter = new InjectionToken<DateAdapter>('ngp-date-formats');

export interface DateAdapter<D = Date> {
  // Core conversion methods
  toDate(value: any): D | null;
  fromDate(date: D): Date;

  // Basic getters
  getYear(date: D): number;
  getMonth(date: D): number;
  getDate(date: D): number;
  getDayOfWeek(date: D): number;

  // Formatting and parsing
  format(date: D, displayFormat: any): string;
  parse(value: any, parseFormat?: any): D;

  // Basic manipulation
  addCalendarYears(date: D, years: number): D;
  addCalendarMonths(date: D, months: number): D;
  addCalendarDays(date: D, days: number): D;

  // Comparison
  isSameDay(date1: D, date2: D): boolean;
  isValid(date: D): boolean;

  // Localization
  getLocale(): string;
  setLocale(locale: string): void;

  // Optional: Date creation (if the date type D is not directly instantiable)
  createDate(year: number, month: number, date: number): D;
}
