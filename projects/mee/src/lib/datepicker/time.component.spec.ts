import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimePicker } from './time.component';

describe('TimeComponent', () => {
  let component: TimePicker;
  let fixture: ComponentFixture<TimePicker>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TimePicker],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update time', () => {
    component.updateValue('12', '30', true);
    expect(component.time).toBe('12:30 AM');

    jest.spyOn(component, 'notify');
    component.updateValue('12', '30', false, false);
    expect(component.time).toBe('12:30 PM');
    expect(component.notify).not.toHaveBeenCalled();
  });

  it('should change AM', () => {
    component.changeAm(false);
    expect(component.am()).toBe(false);
  });

  it('should write value', () => {
    jest.spyOn(component, 'notify');
    component.writeValue('12:30 AM');
    expect(component.hours()).toBe('12');
    expect(component.minutes()).toBe('30');
    expect(component.am()).toBe(true);
    expect(component.notify).not.toHaveBeenCalled();
  });

  it('should notify', () => {
    jest.spyOn(component.valueChange, 'emit');
    component.notify('12:30 AM');
    expect(component.valueChange.emit).toHaveBeenCalledWith('12:30 AM');

    component.time = '12:30 AM';
    component.notify('12:30 AM');
    expect(component.valueChange.emit).toHaveBeenCalledTimes(1);
  });

  it('should register on change', () => {
    const fn = () => jest.fn();
    component.registerOnChange(fn);
    expect(component['onChange']).toBe(fn);
  });

  it('should register on touched', () => {
    const fn = () => jest.fn();
    component.registerOnTouched(fn);
    expect(component['onTouched']).toBe(fn);
  });
});
