import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { render, RenderResult } from '@meeui/adk/test';
import { MeeSwitch, MeeSwitchLabel, MeeSwitchThumb, MeeSwitchTrack } from './switch';

@Component({
  imports: [MeeSwitch, MeeSwitchTrack, MeeSwitchThumb, MeeSwitchLabel, FormsModule],
  template: `<div meeSwitch [(ngModel)]="value">
    <button meeSwitchTrack>
      <span meeSwitchThumb></span>
    </button>
    <label meeSwitchLabel><ng-content /></label>
  </div>`,
})
class TestComponent {
  value = signal(false);
}

describe('SwitchComponent', () => {
  let component: MeeSwitch;
  let view: RenderResult<TestComponent>;

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
    const span = view.$0(MeeSwitchThumb);
    expect(span.attr('aria-checked')).toBe('true');

    component.checked.set(false);
    view.detectChanges();
    expect(span.attr('aria-checked')).toBe('false');
  });

  it('should call updateValue when clicked', () => {
    const spy = jest.spyOn(component, 'updateValue');
    const changeSpy = jest.spyOn(component.change, 'emit');
    view.$0(MeeSwitchTrack).click();
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
