import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { firstOutputFrom, render, RenderResult } from '@meeui/adk/test';
import { MeeOption } from '@meeui/adk/select';
import { MeeAutocomplete } from './autocomplete';
import { MeeAutocompleteInput } from './autocomplete-input';

// Test host component
@Component({
  imports: [MeeAutocomplete, MeeAutocompleteInput, MeeOption, FormsModule],
  template: `
    <div
      meeAutocomplete
      [(ngModel)]="selectedValue"
      [multiple]="multiple()"
      [placeholder]="placeholder()"
    >
      <input meeAutocompleteInput />
      @for (option of options; track option.value) {
        <div meeOption class="option" [value]="option.value">
          {{ option.label }}
        </div>
      }
    </div>
  `,
})
class TestAutocompleteComponent {
  readonly selectedValue = signal<string | string[]>('');
  readonly multiple = signal(false);
  readonly placeholder = signal('');
  options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];
}

describe('Autocomplete', () => {
  let component: TestAutocompleteComponent;
  let view: RenderResult<TestAutocompleteComponent>;
  let selectComponent: MeeAutocomplete<string>;
  let input: HTMLInputElement;

  // function selectInput() {
  //   return view.$<HTMLInputElement>('input');
  // }

  function clickAndSelectOptions() {
    input.click();
    view.detectChanges();
    return document.querySelectorAll('.option') as NodeListOf<HTMLElement>;
  }

  beforeEach(async () => {
    view = await render(TestAutocompleteComponent, [provideNoopAnimations()]);
    component = view.host;
    selectComponent = view.viewChild(MeeAutocomplete<string>);
    input = view.$<HTMLInputElement>('input');
    view.detectChanges();
  });

  it('should create', () => {
    expect(selectComponent).toBeTruthy();
  });

  it('should render options', () => {
    expect(selectComponent.options().length).toBe(3);
  });

  // it('should render placeholder when no value is selected', async () => {
  //   component.placeholder.set('Select an option');
  //   fixture.detectChanges();
  //   await fixture.whenStable();
  //   fixture.detectChanges();
  //   const buttonElement = selectInput();
  //   expect(buttonElement.textContent?.trim()).toBe('Select an option');
  // });

  it('should render selected value', async () => {
    component.selectedValue.set('1');
    await view.formStable();
    expect(input.value?.trim()).toBe('Option 1');
  });

  // it('should disable select when disabled is set', () => {
  //   selectComponent.disabled.set(true);
  //   fixture.detectChanges();
  //   const buttonElement = selectInput();
  //   expect(buttonElement.disabled).toBe(true);
  // });

  it('should open options when clicked', () => {
    jest.spyOn(selectComponent, 'open');
    input.click();
    expect(selectComponent.open).toHaveBeenCalled();
  });

  it('should handle single selection', () => {
    // Simulate option selection
    const options = clickAndSelectOptions();
    options[0].click();
    view.detectChanges();

    expect(component.selectedValue()).toBe('1');
    expect(input.value?.trim()).toBe('Option 1');
  });

  it('should handle multiple selection', async () => {
    component.multiple.set(true);
    component.selectedValue.set(['1', '2']);
    await view.formStable();

    const options = clickAndSelectOptions();

    // Simulate multiple option selection
    options[2].click();
    view.detectChanges();
    // we have to close the panel, so that the value is updated
    selectComponent['close']();
    await view.whenStable();

    expect(component.selectedValue()).toEqual(['1', '2', '3']);
    expect(input.value?.trim()).toBe('Option 1  (+2)');

    // Simulate multiple option deselection
    options[2].click();
    view.detectChanges();

    expect(component.selectedValue()).toEqual(['1', '2']);
  });

  it('should emit opened event when options are opened', async () => {
    const output = firstOutputFrom(selectComponent.opened);
    selectComponent.open();
    expect(await output).toBe(true);
  });

  it('should emit closed event when options are closed', async () => {
    const output = firstOutputFrom(selectComponent.closed);
    selectComponent.open();
    selectComponent['close']();
    expect(await output).toBe(true);
  });

  it('should update panelOpen signal when options are opened/closed', () => {
    selectComponent.open();
    expect(selectComponent.panelOpen()).toBe(true);
    selectComponent['close']();
    expect(selectComponent.panelOpen()).toBe(false);
  });

  // Add more tests as needed
});
