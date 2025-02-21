import { render, RenderResult } from '@ngbase/adk/test';
import { NgbTimePicker } from './time';

describe('TimeComponent', () => {
  let component: NgbTimePicker;
  let view: RenderResult<NgbTimePicker>;

  beforeEach(async () => {
    view = await render(NgbTimePicker);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update time', () => {
    component['parseValue']('12:30:00 AM');
    expect(component['time']()).toBe('12:30:00 AM');

    jest.spyOn(component.valueChange, 'emit');
    component['parseValue']('12:30:00 AM');
    expect(component['time']()).toBe('12:30:00 AM');
    expect(component.valueChange.emit).not.toHaveBeenCalled();
  });

  it('should change AM', () => {
    component['parseValue']('12:30:00 AM');
    component.changeAm(false);
    expect(component.am()).toBe(false);
    expect(component['time']()).toBe('12:30:00 PM');
  });

  it('should write value', () => {
    jest.spyOn(component.valueChange, 'emit');
    component.writeValue('12:30:00 AM');
    expect(component.hours()).toBe('12');
    expect(component.minutes()).toBe('30');
    expect(component.am()).toBe(true);
    expect(component.valueChange.emit).not.toHaveBeenCalled();
  });

  it('should notify', () => {
    jest.spyOn(component.valueChange, 'emit');
    component['writeValue']('12:30:00 AM');
    component.updateValue();
    expect(component.valueChange.emit).toHaveBeenCalledWith('12:30:00 AM');

    view.setInput('value', '12:30:00 AM');
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

  it('should update time based on the value input', async () => {
    view.setInput('value', '12:30:00 AM');
    await view.whenStable();
    expect(component.hours()).toBe('12');
    expect(component.minutes()).toBe('30');
    expect(component.am()).toBe(true);
  });
});
