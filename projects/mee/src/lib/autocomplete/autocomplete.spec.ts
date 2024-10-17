import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Autocomplete } from './autocomplete';
import { AutocompleteInput } from './autocomplete-input';
import { Option } from '../select';
import { render, RenderResult } from '../test';

// Test host component
@Component({
  standalone: true,
  imports: [Autocomplete, AutocompleteInput, Option, FormsModule],
  template: `
    <mee-autocomplete
      [(ngModel)]="selectedValue"
      [multiple]="multiple"
      [placeholder]="placeholder()"
    >
      <input meeAutocompleteInput />
      @for (option of options; track option.value) {
        <mee-option [value]="option.value">
          {{ option.label }}
        </mee-option>
      }
    </mee-autocomplete>
  `,
})
class TestAutocompleteComponent {
  selectedValue = signal<string | string[]>('');
  multiple = false;
  placeholder = signal('');
  options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];
}

describe('Autocomplete', () => {
  let component: TestAutocompleteComponent;
  let view: RenderResult<TestAutocompleteComponent>;
  let selectComponent: Autocomplete<string>;

  function selectInput() {
    return view.$<HTMLInputElement>('input');
  }

  function selectOptions() {
    selectInput().click();
    return document.querySelectorAll('mee-option') as NodeListOf<HTMLElement>;
  }

  beforeEach(async () => {
    view = await render(TestAutocompleteComponent, [provideNoopAnimations()]);
    component = view.host;
    selectComponent = view.viewChild(Autocomplete<string>);
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
    await view.whenStable();
    // view.detectChanges();
    const buttonElement = selectInput();
    expect(buttonElement.value?.trim()).toBe('Option 1');
  });

  // it('should disable select when disabled is set', () => {
  //   selectComponent.disabled.set(true);
  //   fixture.detectChanges();
  //   const buttonElement = selectInput();
  //   expect(buttonElement.disabled).toBe(true);
  // });

  it('should open options when clicked', () => {
    jest.spyOn(selectComponent, 'open');
    const buttonElement = selectInput();
    buttonElement.click();
    expect(selectComponent.open).toHaveBeenCalled();
  });

  it('should handle single selection', () => {
    const buttonElement = selectInput();
    buttonElement.click();
    view.detectChanges();

    // Simulate option selection
    const options = selectOptions();
    options[0].click();
    view.detectChanges();

    expect(component.selectedValue()).toBe('1');
    expect(buttonElement.value?.trim()).toBe('Option 1');
  });

  it('should handle multiple selection', async () => {
    component.multiple = true;
    component.selectedValue.set(['1', '2']);
    view.detectChanges();

    const options = selectOptions();
    view.detectChanges();

    // Simulate multiple option selection
    const buttonElement = selectInput();
    options[2].click();
    view.detectChanges();
    // we have to close the panel, so that the value is updated
    selectComponent['close']();
    await view.whenStable();

    expect(component.selectedValue()).toEqual(['1', '2', '3']);
    expect(buttonElement.value?.trim()).toBe('Option 1  (+2)');

    // Simulate multiple option deselection
    options[2].click();
    view.detectChanges();

    expect(component.selectedValue()).toEqual(['1', '2']);
  });

  it('should emit opened event when options are opened', done => {
    selectComponent.opened.subscribe(isOpened => {
      expect(isOpened).toBe(true);
      done();
    });
    selectComponent.open();
  });

  it('should emit closed event when options are closed', done => {
    selectComponent.closed.subscribe(isClosed => {
      expect(isClosed).toBe(true);
      done();
    });
    selectComponent.open();
    selectComponent['close']();
  });

  it('should update panelOpen signal when options are opened/closed', () => {
    selectComponent.open();
    expect(selectComponent.panelOpen()).toBe(true);
    selectComponent['close']();
    expect(selectComponent.panelOpen()).toBe(false);
  });

  // Add more tests as needed
});
