import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { render, RenderResult } from '@meeui/adk/test';
import { Switch } from './switch';
import { MeeSwitch, MeeSwitchThumb } from '@meeui/adk/switch';

describe('SwitchComponent', () => {
  let component: MeeSwitch;
  let view: RenderResult<TestComponent>;

  @Component({
    imports: [Switch, FormsModule],
    template: `<mee-switch [(ngModel)]="value" />`,
  })
  class TestComponent {
    value = signal(false);
  }

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.viewChild(MeeSwitch);
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a unique id', () => {
    expect(component.id).toBeTruthy();
  });

  it('should toggle checked state', () => {
    expect(component.checked()).toBeFalsy();
    component.updateValue();
    expect(component.checked()).toBeTruthy();
    component.updateValue();
    expect(component.checked()).toBeFalsy();
  });

  it('should render content when checked', () => {
    component.checked.set(true);
    view.detectChanges();
    const span = view.$(MeeSwitchThumb);
    expect(span.attr('aria-checked')).toBe('true');

    component.checked.set(false);
    view.detectChanges();
    expect(span.attr('aria-checked')).toBe('false');
  });

  it('should call updateValue when clicked', () => {
    const spy = jest.spyOn(component, 'updateValue');
    const changeSpy = jest.spyOn(component.change, 'emit');
    view.$('button').click();
    expect(spy).toHaveBeenCalled();
    expect(changeSpy).toHaveBeenCalledWith(true);
  });

  it('should not call updateValue when writeValue is called', async () => {
    const spy = jest.spyOn(component, 'updateValue');
    const changeSpy = jest.spyOn(component.change, 'emit');
    view.host.value.set(true);
    await view.whenStable();
    expect(spy).not.toHaveBeenCalled();
    expect(component.checked()).toBeTruthy();
    expect(changeSpy).not.toHaveBeenCalled();
  });
});
