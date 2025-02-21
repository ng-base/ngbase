import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { render, RenderResult } from '@ngbase/adk/test';
import { Checkbox } from './checkbox';
import { NgbCheckbox } from '@ngbase/adk/checkbox';

describe('CheckboxComponent', () => {
  let component: NgbCheckbox;
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
    component = view.viewChild(NgbCheckbox);
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disbale the checkbox', () => {
    view.host.disabled.set(true);
    view.detectChanges();
    expect(view.$('button[disabled]')).toBeTruthy();
  });

  it('should add svg when checkbox is checked', async () => {
    expect(view.$('svg')).toBeFalsy();
    view.host.checked.set(true);
    await view.formStable();
    expect(view.$('svg')).toBeTruthy();
  });

  it('should handle svg path when checkbox is indeterminate or checked', async () => {
    async function getD() {
      await view.formStable();
      return view.$('svg path')?.attr('d');
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
