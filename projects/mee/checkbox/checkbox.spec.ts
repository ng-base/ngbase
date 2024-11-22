import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { render, RenderResult } from '@meeui/ui/test';
import { Checkbox } from './checkbox';

describe('CheckboxComponent', () => {
  let component: Checkbox;
  let view: RenderResult<TestComponent>;

  @Component({
    imports: [Checkbox, FormsModule],
    template: `<mee-checkbox
      [(ngModel)]="checked"
      [disabled]="disabled()"
      [indeterminate]="indeterminate()"
    />`,
  })
  class TestComponent {
    checked = signal(false);
    disabled = signal(false);
    indeterminate = signal(false);
  }

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.viewChild(Checkbox);
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disbale the checkbox', () => {
    const el = view.$0('mee-checkbox');
    expect(el.hasClass('cursor-pointer')).toBeTruthy();
    view.host.disabled.set(true);
    view.detectChanges();
    expect(['opacity-60', 'cursor-not-allowed'].every(x => el.hasClass(x))).toBeTruthy();
  });

  it('should disabled checkbox should not be clickable', () => {
    view.host.disabled.set(true);
    view.detectChanges();
    expect(component.checked()).toBeFalsy();
    view.$0('button').click();
    expect(component.checked()).toBeFalsy();
  });

  it('should update the checked when writeValue is called', async () => {
    jest.spyOn(component.change, 'emit');
    expect(component.checked()).toBeFalsy();
    view.host.checked.set(true);
    await view.formStable();
    expect(component.checked()).toBeTruthy();
    expect(component.change.emit).not.toHaveBeenCalled();
  });

  it('should emit change event when checkbox is clicked', () => {
    jest.spyOn(component.change, 'emit');
    jest.spyOn(component, 'updateValue');
    expect(component.checked()).toBeFalsy();
    view.$0('button').click();
    expect(component.checked()).toBeTruthy();
    expect(component.updateValue).toHaveBeenCalled();
    expect(component.change.emit).toHaveBeenCalledWith(true);
  });

  it('should add svg when checkbox is checked', async () => {
    expect(view.$0('svg')).toBeFalsy();
    view.host.checked.set(true);
    await view.formStable();
    expect(view.$0('svg')).toBeTruthy();
  });

  it('should handle svg path when checkbox is indeterminate or checked', async () => {
    async function getD() {
      await view.formStable();
      return view.$0('svg path')?.attr('d');
    }
    expect(await getD()).toBeFalsy();

    view.host.checked.set(true);
    expect(await getD()).toBe('M20 6L9 17L4 12');

    view.host.indeterminate.set(true);
    expect(await getD()).toBe('M6 12L18 12');

    view.host.checked.set(false);
    expect(await getD()).toBe('M6 12L18 12');
  });
});
