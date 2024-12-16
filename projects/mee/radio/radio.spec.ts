import { signal } from '@angular/core';
import { MeeRadio, MeeRadioGroup } from '@meeui/adk/radio';
import { render, RenderResult } from '@meeui/adk/test';
import { Radio } from './radio';

describe('RadioComponent', () => {
  let component: MeeRadio;
  let view: RenderResult<Radio>;

  beforeEach(async () => {
    view = await render(Radio, [
      { provide: MeeRadioGroup, useValue: { value: signal('1'), updateValue: () => {} } },
    ]);
    component = view.injectHost(MeeRadio);
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if value is equal to radio value', () => {
    expect(component.checked()).toBeFalsy();
    view.setInput('value', '1');
    view.detectChanges();
    expect(component.checked()).toBeTruthy();
  });

  it('should call updateValue when clicked', () => {
    view.setInput('value', '1');
    const spy = jest.spyOn(component, 'updateValue');
    view.$0('button').click();
    view.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should not call updateValue when disabled', () => {
    view.setInput('disabled', true);
    const spy = jest.spyOn(component, 'updateValue');
    view.$0('button').click();
    view.detectChanges();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should avoid the curosor pointer when disabled', () => {
    view.setInput('disabled', true);
    view.detectChanges();
    const button = view.$0Native<HTMLButtonElement>();
    expect(button.attr('aria-disabled')).toBe('true');
  });
});
