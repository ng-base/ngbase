import { Component, computed, Directive, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { render, RenderResult } from '@ngbase/adk/test';
import { aliasCheckbox, CheckboxButton, NgbCheckbox } from './checkbox';

@Directive({
  selector: '[testCheckbox]',
  providers: [aliasCheckbox(TestCheckbox)],
})
class TestCheckbox extends NgbCheckbox {}

@Component({
  imports: [TestCheckbox, CheckboxButton, FormsModule],
  template: `<div
    testCheckbox
    [(ngModel)]="checked"
    [disabled]="disabled()"
    [indeterminate]="indeterminate()"
  >
    <button ngbCheckboxButton>
      @if (path(); as d) {
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path [attr.d]="d" stroke="currentColor" stroke-width="2" fill="none" />
        </svg>
      }
    </button>
    <ng-content />
  </div> `,
})
class TestComponent {
  checked = signal(false);
  disabled = signal(false);
  indeterminate = signal(false);

  readonly path = computed(() =>
    this.indeterminate() ? 'M6 12L18 12' : this.checked() ? 'M20 6L9 17L4 12' : '',
  );
}

describe('CheckboxComponent', () => {
  let component: NgbCheckbox;
  let view: RenderResult<TestComponent>;

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.viewChild(NgbCheckbox);
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disabled checkbox should not be clickable', () => {
    view.host.disabled.set(true);
    view.detectChanges();
    expect(component.checked()).toBeFalsy();
    view.$('button').click();
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
    view.$('button').click();
    expect(component.checked()).toBeTruthy();
    expect(component.updateValue).toHaveBeenCalled();
    expect(component.change.emit).toHaveBeenCalledWith(true);
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
