import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePicker } from './datepicker.component';
import { Component, TemplateRef, viewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DatepickerTrigger } from './datepicker-trigger.directive';
import { DialogRef } from '@meeui/portal';

@Component({
  standalone: true,
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
  let fixture: ComponentFixture<DatePicker<Date>>;
  let templateRef: TemplateRef<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePicker, TestDatePicker],
      providers: [
        { provide: DialogRef, useValue: mockDialogRef },
        { provide: DatepickerTrigger, useValue: { updateInput: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatePicker<Date>);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const compFixture = TestBed.createComponent(TestDatePicker);
    fixture.detectChanges();
    templateRef = compFixture.componentInstance.templateRef();
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

    jest.spyOn(component.datepickerTrigger!, 'updateInput');
    component.selectDate(date, 1);
    expect(component.selectedDates()).toEqual([date, date]);
    expect(component.datepickerTrigger!.updateInput).toHaveBeenCalledWith([date, date]);
  });

  it('should select a year', () => {
    let year = 2023;
    component.selectYear(year);
    expect(component.startYear()).toBe(year);
    expect(component.showType()).toBe('month');

    fixture.componentRef.setInput('pickerType', 'year');
    fixture.detectChanges();
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
    fixture.componentRef.setInput('pickerType', 'month');
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

    fixture.componentRef.setInput('pickerType', 'date');
    fixture.detectChanges();
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
      fixture.componentRef.setInput('pickerType', pickerType);
      expected.forEach(exp => {
        component.toggleView();
        expect(component.showType()).toBe(exp);
      });
    });
  });

  it('should render the correct number of calendars', () => {
    component.noOfCalendar.set(3);
    fixture.detectChanges();
    const calendars = fixture.debugElement.queryAll(By.css('mee-calendar'));
    expect(calendars.length).toBe(3);
  });

  it('should render the template if provided', () => {
    component.template.set(templateRef);
    fixture.detectChanges();
    const templateContainer = fixture.nativeElement.querySelector('#templateDiv');
    expect(templateContainer).toBeTruthy();
  });

  it('should not render the template if not provided', () => {
    component.template.set(null);
    fixture.detectChanges();
    const templateContainer = fixture.nativeElement.querySelector('#templateDiv');
    expect(templateContainer).toBeFalsy();
  });
});
