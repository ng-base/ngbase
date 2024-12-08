import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ElementHelper, firstOutputFrom, render, RenderResult } from '@meeui/adk/test';
import { MeeOption } from './option';
import { MeeSelect } from './select';

// Test host component
@Component({
  imports: [MeeSelect, MeeOption, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <div
        meeSelect
        id="select1"
        formControlName="selectedValue"
        [multiple]="multiple()"
        [placeholder]="placeholder()"
      >
        @for (option of options; track option.value) {
          <div class="option" meeOption [value]="option.value">
            {{ option.label }}
          </div>
        }
      </div>
    </form>
  `,
})
class TestHostComponent {
  form = new FormGroup({
    selectedValue: new FormControl<string | string[]>('1'),
  });
  multiple = signal(false);
  placeholder = signal('');
  options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  setSelectedValue(value: string | string[]) {
    this.form.get('selectedValue')?.setValue(value);
  }
}

describe('Select', () => {
  let component: TestHostComponent;
  let view: RenderResult<TestHostComponent>;
  let selectComponent: MeeSelect<string>;
  let input: ElementHelper<HTMLButtonElement>;

  beforeEach(async () => {
    view = await render(TestHostComponent, [provideNoopAnimations()]);
    component = view.host;
    selectComponent = view.viewChild(MeeSelect<string>, '#select1');
    input = view.$0('#select1 button');
    view.detectChanges();
  });

  function clickAndSelectOptions() {
    input.click();
    view.detectChanges();
    return document.querySelectorAll('.option') as NodeListOf<HTMLElement>;
  }

  it('should create', () => {
    expect(selectComponent).toBeTruthy();
  });

  it('should render options', () => {
    expect(selectComponent.options().length).toBe(3);
  });

  it('should render the current value', async () => {
    await view.formStable();
    expect(input.textContent?.trim()).toBe('Option 1');
  });

  it('should render placeholder when no value is selected', async () => {
    component.placeholder.set('Select an option');
    component.setSelectedValue('');
    await view.formStable();
    expect(input.textContent?.trim()).toBe('Select an option');
  });

  it('should render selected value', async () => {
    component.setSelectedValue('1');
    await view.formStable();
    expect(input.textContent?.trim()).toBe('Option 1');
  });

  it('should disable select when disabled is set', () => {
    selectComponent.disabled.set(true);
    view.detectChanges();
    expect(input.el.disabled).toBe(true);
  });

  it('should open options when clicked', () => {
    jest.spyOn(selectComponent, 'open');
    input.click();
    expect(selectComponent.open).toHaveBeenCalled();
  });

  it('should handle single selection', () => {
    input.click();
    view.detectChanges();

    // Simulate option selection
    const options = clickAndSelectOptions();
    options[0].click();
    view.detectChanges();

    expect(component.form.value.selectedValue).toBe('1');
    expect(input.textContent?.trim()).toBe('Option 1');
  });

  it('should handle multiple selection', async () => {
    component.multiple.set(true);
    component.setSelectedValue(['1', '2']);
    await view.formStable();

    const options = clickAndSelectOptions();
    view.detectChanges();

    // Simulate multiple option selection
    options[2].click();
    view.detectChanges();

    expect(component.form.value.selectedValue).toEqual(['1', '2', '3']);
    expect(input.textContent?.trim()).toBe('Option 1  (+2)');

    // Simulate multiple option deselection
    options[2].click();
    view.detectChanges();

    expect(component.form.value.selectedValue).toEqual(['1', '2']);
  });

  it('should emit opened event when options are opened', async () => {
    const openedPromise = firstOutputFrom(selectComponent.opened);
    selectComponent.open();
    expect(await openedPromise).toBe(true);
  });

  it('should emit closed event when options are closed', async () => {
    const closedPromise = firstOutputFrom(selectComponent.closed);
    selectComponent.open();
    selectComponent['close']();
    expect(await closedPromise).toBe(true);
  });

  it('should update panelOpen signal when options are opened/closed', () => {
    selectComponent.open();
    expect(selectComponent.panelOpen()).toBe(true);
    selectComponent['close']();
    expect(selectComponent.panelOpen()).toBe(false);
  });
});
