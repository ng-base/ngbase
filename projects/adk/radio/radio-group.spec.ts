import { Component, DebugElement, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { render, RenderResult } from '@meeui/adk/test';
import { MeeRadio, MeeRadioIndicator } from './radio';
import { MeeRadioGroup } from './radio-group';

@Component({
  imports: [MeeRadioGroup, MeeRadio, MeeRadioIndicator, FormsModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <div meeRadioGroup formControlName="option" id="first">
        <div meeRadio [value]="'option1'">
          <button meeRadioIndicator><div></div></button>
          Option 1
        </div>
        <div meeRadio [value]="'option2'">
          <button meeRadioIndicator><div></div></button>
          Option 2
        </div>
        <div meeRadio [value]="'option3'" [disabled]="isDisabled">
          <button meeRadioIndicator><div></div></button>
          Option 3
        </div>
      </div>
    </form>
    <div meeRadioGroup [(ngModel)]="selectedValue" id="second">
      <div meeRadio [value]="'option1'">
        <button meeRadioIndicator><div></div></button>
        Option 1
      </div>
      <div meeRadio [value]="'option2'">
        <button meeRadioIndicator><div></div></button>
        Option 2
      </div>
      <div meeRadio [value]="'option3'" [disabled]="true">
        <button meeRadioIndicator><div></div></button>
        Option 3
      </div>
    </div>

    <div meeRadioGroup [(value)]="value" id="third">
      <div meeRadio [value]="'option1'">
        <button meeRadioIndicator><div></div></button>
        Option 1
      </div>
      <div meeRadio [value]="'option2'">
        <button meeRadioIndicator><div></div></button>
        Option 2
      </div>
      <div meeRadio [value]="'option3'">
        <button meeRadioIndicator><div></div></button>
        Option 3
      </div>
    </div>
  `,
})
class TestComponent {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    option: ['', Validators.required],
  });
  isDisabled = true;
  selectedValue: string = '';
  value = 'option1';
}

describe('RadioGroup and Radio', () => {
  let component: TestComponent;
  let view: RenderResult<TestComponent>;
  let radioGroupElement: DebugElement[];
  let radioElements: DebugElement[];

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.host;
    view.detectChanges();

    radioGroupElement = view.viewChildrenDebug(MeeRadioGroup);
    radioElements = view.viewChildrenDebug(MeeRadio);
  });

  it('should create the radio group', () => {
    expect(component).toBeTruthy();
    expect(radioGroupElement.length).toBe(3);
  });

  it('should have six radio buttons in total', () => {
    const allRadioButtons = view.$All('.mee-radio');
    expect(allRadioButtons.length).toBe(9);
  });

  it('should update the form control when a radio button is clicked', () => {
    radioElements[1].nativeElement.click();
    view.detectChanges();
    expect(component.form.get('option')?.value).toBe('option2');
  });

  it('should update the ngModel when a radio button is clicked', () => {
    const ngModelRadios = view.$All('.mee-radio-group:nth-child(2) .mee-radio');
    ngModelRadios[1].click();
    view.detectChanges();
    expect(component.selectedValue).toBe('option2');
  });

  it('should update the UI when the form control changes', () => {
    component.form.patchValue({ option: 'option1' });
    view.detectChanges();
    expect(radioElements[0].nativeElement.querySelector('button > div')).toBeTruthy();
    expect(radioElements[1].nativeElement.querySelector('button > div')).toBeFalsy();
  });

  it('should update the UI when the ngModel changes', async () => {
    component.selectedValue = 'option1';
    await view.formStable();
    const ngModelRadios = view.$All('.mee-radio-group:nth-child(2) .mee-radio');
    expect(ngModelRadios[0].querySelector('button > div')).toBeTruthy();
    expect(ngModelRadios[1].querySelector('button > div')).toBeFalsy();
  });

  it('should not allow clicking a disabled radio button', () => {
    radioElements[2].nativeElement.click();
    view.detectChanges();
    expect(component.form.get('option')?.value).not.toBe('option3');

    const ngModelRadios = view.$All('.mee-radio-group:nth-child(2) .mee-radio');
    ngModelRadios[2].click();
    view.detectChanges();
    expect(component.selectedValue).not.toBe('option3');
  });

  // it('should apply correct classes for disabled state', () => {
  //   expect(radioElements[2].nativeElement.classList.contains('opacity-60')).toBeTruthy();
  //   expect(radioElements[2].nativeElement.classList.contains('cursor-not-allowed')).toBeTruthy();
  // });

  it('should mark the form control as touched when a radio is clicked', () => {
    expect(component.form.get('option')?.touched).toBeFalsy();
    radioElements[0].nativeElement.click();
    view.detectChanges();
    expect(component.form.get('option')?.touched).toBeTruthy();
  });

  it('should respect the required validator', () => {
    expect(component.form.get('option')?.valid).toBeFalsy();
    radioElements[0].nativeElement.click();
    view.detectChanges();
    expect(component.form.get('option')?.valid).toBeTruthy();
  });

  it('should handle dynamic enabling/disabling of radio buttons', () => {
    component.isDisabled = false;
    view.detectChanges();

    radioElements[2].nativeElement.click();
    view.detectChanges();
    expect(component.form.get('option')?.value).toBe('option3');
  });

  it('should handle programmatic value changes', () => {
    component.form.patchValue({ option: 'option2' });
    view.detectChanges();
    expect(radioElements[1].nativeElement.querySelector('button > div')).toBeTruthy();
  });

  it('should not change value when clicking an already selected radio', () => {
    radioElements[0].nativeElement.click();
    view.detectChanges();

    const initialValue = component.form.get('option')?.value;
    radioElements[0].nativeElement.click();
    view.detectChanges();

    expect(component.form.get('option')?.value).toBe(initialValue);
  });

  it('should handle rapid clicking between options', () => {
    radioElements[0].nativeElement.click();
    radioElements[1].nativeElement.click();
    radioElements[2].nativeElement.click();
    view.detectChanges();

    expect(component.form.get('option')?.value).toBe('option2'); // The last enabled option
  });

  it('should emit value change on clicking', () => {
    // const radioGroup = radioGroupElement[1].componentInstance as MeeRadioGroup;
    const radioGroup = view.viewChild(MeeRadioGroup, '#second');
    jest.spyOn(radioGroup, 'onChange');
    radioElements[4].nativeElement.click();
    view.detectChanges();
    expect(radioGroup.onChange).toHaveBeenCalledWith('option2');
  });

  describe('with value binding', () => {
    it('should update the value binding when a radio button is clicked', () => {
      radioElements[7].nativeElement.click();
      view.detectChanges();

      expect(component.value).toBe('option2');
    });

    it('should update the UI when the value binding changes', () => {
      component.value = 'option1';
      view.detectChanges();

      expect(radioElements[6].nativeElement.querySelector('button > div')).toBeTruthy();
      expect(radioElements[7].nativeElement.querySelector('button > div')).toBeFalsy();
    });

    it('should handle programmatic value changes', () => {
      component.value = 'option2';
      view.detectChanges();
      expect(radioElements[7].nativeElement.querySelector('button > div')).toBeTruthy();
    });

    it('should handle rapid clicking between options', () => {
      radioElements[6].nativeElement.click();
      radioElements[7].nativeElement.click();
      radioElements[8].nativeElement.click();
      view.detectChanges();
      expect(component.value).toBe('option3'); // The last enabled option
    });
  });
});
