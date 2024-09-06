import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RadioGroup } from './radio-group.component';
import { Radio } from './radio.component';
import { By } from '@angular/platform-browser';

describe('RadioGroup and Radio', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let radioGroupElement: DebugElement[];
  let radioElements: DebugElement[];

  @Component({
    template: `
      <form [formGroup]="form">
        <mee-radio-group formControlName="option">
          <mee-radio [value]="'option1'">Option 1</mee-radio>
          <mee-radio [value]="'option2'">Option 2</mee-radio>
          <mee-radio [value]="'option3'" [disabled]="isDisabled">Option 3</mee-radio>
        </mee-radio-group>
      </form>
      <mee-radio-group [(ngModel)]="selectedValue">
        <mee-radio [value]="'option1'">Option 1</mee-radio>
        <mee-radio [value]="'option2'">Option 2</mee-radio>
        <mee-radio [value]="'option3'" [disabled]="true">Option 3</mee-radio>
      </mee-radio-group>

      <mee-radio-group [(value)]="value">
        <mee-radio [value]="'option1'">Option 1</mee-radio>
        <mee-radio [value]="'option2'">Option 2</mee-radio>
        <mee-radio [value]="'option3'">Option 3</mee-radio>
      </mee-radio-group>
    `,
  })
  class TestComponent {
    form = this.fb.group({
      option: ['', Validators.required],
    });
    isDisabled = true;
    selectedValue: string = '';
    value = 'option1';

    constructor(private fb: FormBuilder) {}
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [FormsModule, ReactiveFormsModule, RadioGroup, Radio],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    radioGroupElement = fixture.debugElement.queryAll(By.directive(RadioGroup));
    radioElements = fixture.debugElement.queryAll(By.directive(Radio));
  });

  it('should create the radio group', () => {
    expect(component).toBeTruthy();
    expect(radioGroupElement.length).toBe(3);
  });

  it('should have six radio buttons in total', () => {
    const allRadioButtons = fixture.nativeElement.querySelectorAll('mee-radio');
    expect(allRadioButtons.length).toBe(9);
  });

  it('should update the form control when a radio button is clicked', fakeAsync(() => {
    radioElements[1].nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(component.form.get('option')?.value).toBe('option2');
  }));

  it('should update the ngModel when a radio button is clicked', () => {
    const ngModelRadios = fixture.nativeElement
      .querySelectorAll('mee-radio-group')[1]
      .querySelectorAll('mee-radio');
    ngModelRadios[1].click();
    fixture.detectChanges();
    expect(component.selectedValue).toBe('option2');
  });

  it('should update the UI when the form control changes', fakeAsync(() => {
    component.form.patchValue({ option: 'option1' });
    fixture.detectChanges();
    tick();
    expect(radioElements[0].nativeElement.querySelector('button > div')).toBeTruthy();
    expect(radioElements[1].nativeElement.querySelector('button > div')).toBeFalsy();
  }));

  it('should update the UI when the ngModel changes', async () => {
    component.selectedValue = 'option1';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const ngModelRadios = fixture.nativeElement
      .querySelectorAll('mee-radio-group')[1]
      .querySelectorAll('mee-radio');
    expect(ngModelRadios[0].querySelector('button > div')).toBeTruthy();
    expect(ngModelRadios[1].querySelector('button > div')).toBeFalsy();
  });

  it('should not allow clicking a disabled radio button', fakeAsync(() => {
    radioElements[2].nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(component.form.get('option')?.value).not.toBe('option3');

    const ngModelRadios = fixture.nativeElement
      .querySelectorAll('mee-radio-group')[1]
      .querySelectorAll('mee-radio');
    ngModelRadios[2].click();
    fixture.detectChanges();
    expect(component.selectedValue).not.toBe('option3');
  }));

  it('should apply correct classes for disabled state', () => {
    expect(radioElements[2].nativeElement.classList.contains('opacity-60')).toBeTruthy();
    expect(radioElements[2].nativeElement.classList.contains('cursor-not-allowed')).toBeTruthy();
  });

  it('should mark the form control as touched when a radio is clicked', fakeAsync(() => {
    expect(component.form.get('option')?.touched).toBeFalsy();
    radioElements[0].nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(component.form.get('option')?.touched).toBeTruthy();
  }));

  it('should respect the required validator', fakeAsync(() => {
    expect(component.form.get('option')?.valid).toBeFalsy();
    radioElements[0].nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(component.form.get('option')?.valid).toBeTruthy();
  }));

  it('should handle dynamic enabling/disabling of radio buttons', fakeAsync(() => {
    component.isDisabled = false;
    fixture.detectChanges();
    tick();
    radioElements[2].nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(component.form.get('option')?.value).toBe('option3');
  }));

  it('should handle programmatic value changes', fakeAsync(() => {
    component.form.patchValue({ option: 'option2' });
    fixture.detectChanges();
    tick();
    expect(radioElements[1].nativeElement.querySelector('button > div')).toBeTruthy();
  }));

  it('should not change value when clicking an already selected radio', fakeAsync(() => {
    radioElements[0].nativeElement.click();
    fixture.detectChanges();
    tick();
    const initialValue = component.form.get('option')?.value;
    radioElements[0].nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(component.form.get('option')?.value).toBe(initialValue);
  }));

  it('should handle rapid clicking between options', fakeAsync(() => {
    radioElements[0].nativeElement.click();
    radioElements[1].nativeElement.click();
    radioElements[2].nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(component.form.get('option')?.value).toBe('option2'); // The last enabled option
  }));

  it('should emit value change on clicking', fakeAsync(() => {
    const radioGroup = radioGroupElement[1].componentInstance as RadioGroup;
    jest.spyOn(radioGroup, 'onChange');
    radioElements[4].nativeElement.click();
    fixture.detectChanges();
    tick();
    expect(radioGroup.onChange).toHaveBeenCalledWith('option2');
  }));

  describe('with value binding', () => {
    it('should update the value binding when a radio button is clicked', fakeAsync(() => {
      radioElements[7].nativeElement.click();
      fixture.detectChanges();
      tick();
      expect(component.value).toBe('option2');
    }));

    it('should update the UI when the value binding changes', fakeAsync(() => {
      component.value = 'option1';
      fixture.detectChanges();
      tick();
      expect(radioElements[6].nativeElement.querySelector('button > div')).toBeTruthy();
      expect(radioElements[7].nativeElement.querySelector('button > div')).toBeFalsy();
    }));

    it('should handle programmatic value changes', fakeAsync(() => {
      component.value = 'option2';
      fixture.detectChanges();
      tick();
      expect(radioElements[7].nativeElement.querySelector('button > div')).toBeTruthy();
    }));

    it('should handle rapid clicking between options', fakeAsync(() => {
      radioElements[6].nativeElement.click();
      radioElements[7].nativeElement.click();
      radioElements[8].nativeElement.click();
      fixture.detectChanges();
      tick();
      expect(component.value).toBe('option3'); // The last enabled option
    }));
  });
});
