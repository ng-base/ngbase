import { Component, DebugElement, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Autocomplete } from './autocomplete.component';
import { AutocompleteInput } from './autocomplete.directive';
import { Option } from '../select';

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
  let fixture: ComponentFixture<TestAutocompleteComponent>;
  let selectElement: DebugElement;
  let selectComponent: Autocomplete<string>;

  function selectInput() {
    return fixture.nativeElement.querySelector('input') as HTMLInputElement;
  }

  function selectOptions() {
    selectInput().click();
    return document.querySelectorAll('mee-option') as NodeListOf<HTMLElement>;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAutocompleteComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestAutocompleteComponent);
    component = fixture.componentInstance;
    selectElement = fixture.debugElement.query(By.directive(Autocomplete));
    selectComponent = selectElement.componentInstance;
    fixture.detectChanges();
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
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
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
    fixture.detectChanges();

    // Simulate option selection
    const options = selectOptions();
    options[0].click();
    fixture.detectChanges();

    expect(component.selectedValue()).toBe('1');
    expect(buttonElement.value?.trim()).toBe('Option 1');
  });

  it('should handle multiple selection', async () => {
    component.multiple = true;
    component.selectedValue.set(['1', '2']);
    fixture.detectChanges();

    const options = selectOptions();
    fixture.detectChanges();

    // Simulate multiple option selection
    const buttonElement = selectInput();
    options[2].click();
    fixture.detectChanges();

    expect(component.selectedValue()).toEqual(['1', '2', '3']);
    expect(buttonElement.value?.trim()).toBe('Option 1  (+2)');

    // Simulate multiple option deselection
    options[2].click();
    fixture.detectChanges();

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
    selectComponent['popClose']();
  });

  it('should update panelOpen signal when options are opened/closed', () => {
    selectComponent.open();
    expect(selectComponent.panelOpen()).toBe(true);
    selectComponent['popClose']();
    expect(selectComponent.panelOpen()).toBe(false);
  });

  // Add more tests as needed
});
