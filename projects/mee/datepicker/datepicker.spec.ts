import { Component, TemplateRef, viewChild } from '@angular/core';
import { DialogRef } from '@meeui/ui/portal';
import { render, RenderResult } from '@meeui/ui/test';
import { DatePicker } from './datepicker';
import { DatepickerTrigger } from './datepicker-trigger';

@Component({
  template: `<ng-template #templateRef>
    <div id="templateDiv">Test</div>
  </ng-template>`,
})
class TestDatePicker {
  templateRef = viewChild.required('templateRef', { read: TemplateRef });
}

const mockDialogRef = { data: { value: [] as any[] } };

describe('DatePicker', () => {
  let component: DatePicker<Date>;
  let view: RenderResult<DatePicker<Date>>;
  let templateRef: TemplateRef<any>;

  beforeEach(async () => {
    view = await render(DatePicker<Date>, [
      { provide: DialogRef, useValue: mockDialogRef },
      { provide: DatepickerTrigger, useValue: { updateInput: jest.fn() } },
    ]);
    component = view.host;
    view.detectChanges();

    const compFixture = await render(TestDatePicker);
    templateRef = compFixture.host.templateRef();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.noOfCalendar()).toBe(1);
    expect(component.range()).toBe(false);
    expect(component.time()).toBe(false);
    expect(component.format()).toBe('MM-dd-yyyy');
    expect(component.template()).toBeNull();
    expect(component.dateFilter()(new Date())).toBe(true);
    expect(component.pickerType()).toBe('date');
    expect(component.showType()).toBe('date');
    expect(component.selectedDates()).toEqual([null, null]);
    expect(component.times()).toEqual([null, null]);
  });

  it('should handle the values parsed properly', () => {
    mockDialogRef.data.value = [new Date(2024, 6, 5)];
    component['init']();
    expect(component.selectedDates()).toEqual([new Date(2024, 6, 5), null]);

    mockDialogRef.data.value = [new Date(2024, 6, 5), new Date(2024, 6, 6)];
    component['init']();
    expect(component.selectedDates()).toEqual([new Date(2024, 6, 5), new Date(2024, 6, 6)]);

    mockDialogRef.data.value = ['2024-07-05', '2024-07-06'];
    component['init']();
    expect(component.selectedDates()).toEqual([new Date(2024, 6, 5), new Date(2024, 6, 6)]);
  });

  it('should return the hoveredCount value based on hoverDate', () => {
    component.hoveredDate.set(null);
    expect(component.hoveredCount()).toBe(0);

    let date = new Date();
    component.hoveredDate.set(date);
    expect(component.hoveredCount()).toBe(date.getTime());
  });

  it('should set the hovered date for range mode when second date is selected', () => {
    component.range.set(true);
    component.selectedDates.set([null, null]);

    let date = new Date(2024, 6, 5);
    component.selectDate(date);

    date = new Date(2024, 6, 16);
    component.selectDate(date);
    expect(component.hoveredDate()).toBe(date);
  });

  it('should return the startDateCount value based on startDate', () => {
    component.selectedDates.set([null, null]);
    expect(component.startDateCount()).toBe(0);

    const date = new Date();
    component.selectedDates.set([date, null]);
    expect(component.startDateCount()).toBe(date.getTime());
  });

  it('should select a date', () => {
    const date = new Date(2024, 6, 5);
    component.selectDate(date);
    expect(component.selectedDates()).toEqual([date, null]);

    component.range.set(true);
    component.selectedDates.set([null, null]);
    component.selectDate(date);
    expect(component.selectedDates()).toEqual([date, null]);
    const date1 = new Date(2024, 6, 4);
    component.selectDate(date1);
    expect(component.selectedDates()).toEqual([date1, null]);
    component.selectDate(date);
    expect(component.selectedDates()).toEqual([date1, date]);

    component.range.set(false);
    component.selectDate(date);
    expect(component.selectedDates()).toEqual([date, null]);

    component.range.set(true);
    component.selectDate(date, 0);
    expect(component.selectedDates()).toEqual([date, null]);

    jest.spyOn(component['datepickerTrigger']!, 'updateInput');
    component.selectDate(date, 1);
    expect(component.selectedDates()).toEqual([date, date]);
    expect(component['datepickerTrigger']!.updateInput).toHaveBeenCalledWith([date, date]);
  });

  it('should select a year', () => {
    let year = 2023;
    component.selectYear(year);
    expect(component.startYear()).toBe(year);
    expect(component.showType()).toBe('month');

    view.setInput('pickerType', 'year');
    view.detectChanges();
    jest.spyOn(component, 'selectDate');
    year = 2022;
    let month = component.startMonth();
    component.selectYear(year);
    expect(component.startYear()).toBe(year);
    expect(component.selectDate).toHaveBeenCalledWith(new Date(year, month));
  });

  it('should select a month and year', () => {
    let month = 5;
    let year = 2023;
    component.selectMonth(month, year);
    component.showType.set('year');
    view.setInput('pickerType', 'month');
    expect(component.startMonth()).toBe(month);
    expect(component.startYear()).toBe(year);
    expect(component.showType()).toBe('year');

    jest.spyOn(component, 'selectDate');
    month = 6;
    year = 2022;
    component.selectMonth(month, year);
    expect(component.startMonth()).toBe(month);
    expect(component.startYear()).toBe(year);
    expect(component.selectDate).toHaveBeenCalledWith(new Date(year, month));
    expect(component.showType()).toBe('year');

    view.setInput('pickerType', 'date');
    view.detectChanges();
    component.selectMonth(month, year);
    expect(component.showType()).toBe('date');
  });

  it('should update hovered date', () => {
    component.range.set(true);
    const date = new Date();
    component.updateHoveredDate(date);
    expect(component.hoveredDate()).toBe(null);

    // set start date for selectedDates
    component.selectDate(date);
    component.updateHoveredDate(date);
    expect(component.hoveredDate()).toBe(date);
  });

  it('should toggle view', () => {
    const toggleExpectations = [
      { pickerType: 'date', expected: ['month', 'year', 'date', 'month'] },
      { pickerType: 'month', expected: ['year', 'month', 'year'] },
      { pickerType: 'year', expected: ['year', 'year'] },
    ];

    toggleExpectations.forEach(({ pickerType, expected }) => {
      view.setInput('pickerType', pickerType);
      expected.forEach(exp => {
        component.toggleView();
        expect(component.showType()).toBe(exp);
      });
    });
  });

  it('should render the correct number of calendars', () => {
    component.noOfCalendar.set(3);
    view.detectChanges();
    const calendars = view.$All('mee-calendar');
    expect(calendars.length).toBe(3);
  });

  it('should render the template if provided', () => {
    component.template.set(templateRef);
    view.detectChanges();
    const templateContainer = view.$('#templateDiv');
    expect(templateContainer).toBeTruthy();
  });

  it('should not render the template if not provided', () => {
    component.template.set(null);
    view.detectChanges();
    const templateContainer = view.$('#templateDiv');
    expect(templateContainer).toBeFalsy();
  });
});
