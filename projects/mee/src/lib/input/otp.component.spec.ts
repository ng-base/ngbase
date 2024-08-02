import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InputOtp } from './otp.component';
import { DebugElement } from '@angular/core';

describe('InputOtp', () => {
  let component: InputOtp;
  let fixture: ComponentFixture<InputOtp>;
  let inputs: DebugElement[];

  function triggerKeyEvent(name: string, key: string, index: number) {
    const event = new KeyboardEvent(name, { key, cancelable: true });
    const inputElement = inputs[index].nativeElement;
    inputElement.dispatchEvent(event);
    if (event.defaultPrevented) {
      return event;
    } else if (key !== 'Tab') {
      const v = key !== 'Backspace' ? key : '';
      inputElement.value = v;
      inputElement.dispatchEvent(new Event('input'));
    }
    return event;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputOtp],
    }).compileComponents();

    fixture = TestBed.createComponent(InputOtp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct number of input fields', () => {
    fixture.componentRef.setInput('size', [3, 3]);
    fixture.detectChanges();
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    expect(inputs.length).toBe(6);
  });

  // it('should focus on the first empty input field', fakeAsync(() => {
  //   fixture.componentRef.setInput('size', [3, 3]);
  //   fixture.detectChanges();
  //   tick();
  //   const inputs = fixture.debugElement.queryAll(By.css('input'));
  //   expect(document.activeElement).toBe(inputs[0].nativeElement);
  // }));

  it('should move focus to the next input on value entry', () => {
    fixture.componentRef.setInput('size', [3, 3]);
    fixture.detectChanges();
    inputs = fixture.debugElement.queryAll(By.css('input'));
    triggerKeyEvent('keydown', '1', 0);
    expect(document.activeElement).toBe(inputs[1].nativeElement);
    inputs[2].nativeElement.focus();
    expect(document.activeElement).toBe(inputs[1].nativeElement);
  });

  it('should move focus to the previous input on backspace', () => {
    fixture.componentRef.setInput('size', [3, 3]);
    fixture.detectChanges();
    inputs = fixture.debugElement.queryAll(By.css('input'));
    triggerKeyEvent('keydown', '1', 0);
    triggerKeyEvent('keydown', '1', 1);
    triggerKeyEvent('keydown', 'Backspace', 2);
    expect(document.activeElement).toBe(inputs[1].nativeElement);
    inputs[0].nativeElement.focus();
    expect(document.activeElement).toBe(inputs[1].nativeElement);
  });

  it('should update value on input change', () => {
    fixture.componentRef.setInput('size', [3]);
    fixture.detectChanges();
    inputs = fixture.debugElement.queryAll(By.css('input'));
    jest.spyOn(component, 'updateValue');
    jest.spyOn(component, 'onChange');
    triggerKeyEvent('keydown', '1', 0);
    triggerKeyEvent('keydown', '2', 1);
    expect(component.onChange).not.toHaveBeenCalled();
    triggerKeyEvent('keydown', '3', 2);
    expect(component.onChange).toHaveBeenCalledWith('123');
    triggerKeyEvent('keydown', '4', 2);
    expect(component.lastValue).toBe('123');
    triggerKeyEvent('keydown', 'Backspace', 2);
    expect(component.onChange).toHaveBeenCalledWith('');
  });

  it('should not allow non-numeric input', () => {
    fixture.componentRef.setInput('size', [3]);
    fixture.detectChanges();
    inputs = fixture.debugElement.queryAll(By.css('input'));
    const event = triggerKeyEvent('keydown', 'a', 0);
    expect(event.defaultPrevented).toBe(true);
  });

  it('should write value correctly', fakeAsync(() => {
    fixture.componentRef.setInput('size', [3]);
    fixture.detectChanges();

    component.writeValue('123');

    inputs = fixture.debugElement.queryAll(By.css('input'));
    expect(inputs[0].nativeElement.value).toBe('1');
    expect(inputs[1].nativeElement.value).toBe('2');
    expect(inputs[2].nativeElement.value).toBe('3');
  }));

  it('should handle partial input correctly', fakeAsync(() => {
    fixture.componentRef.setInput('size', [3, 3]);
    fixture.detectChanges();

    component.writeValue('123');
    inputs = fixture.debugElement.queryAll(By.css('input'));
    expect(inputs[0].nativeElement.value).toBe('1');
    expect(inputs[1].nativeElement.value).toBe('2');
    expect(inputs[2].nativeElement.value).toBe('3');
    expect(inputs[3].nativeElement.value).toBe('');
    expect(inputs[4].nativeElement.value).toBe('');
    expect(inputs[5].nativeElement.value).toBe('');
  }));

  it('should update tabIndex correctly', () => {
    fixture.componentRef.setInput('size', [4]);
    fixture.detectChanges();
    inputs = fixture.debugElement.queryAll(By.css('input'));

    const getTabIndexes = () => inputs.map(i => i.nativeElement.tabIndex);

    expect(getTabIndexes()).toEqual([0, -1, -1, -1]);
    triggerKeyEvent('keydown', '1', 0);
    expect(getTabIndexes()).toEqual([-1, 0, -1, -1]);
    triggerKeyEvent('keydown', '2', 1);
    triggerKeyEvent('keydown', '3', 2);
    expect(getTabIndexes()).toEqual([-1, -1, -1, 0]);
    triggerKeyEvent('keydown', '4', 3);
    expect(getTabIndexes()).toEqual([-1, -1, -1, 0]);
  });

  it('should allow Tab key to move focus', () => {
    fixture.componentRef.setInput('size', [3]);
    fixture.detectChanges();
    inputs = fixture.debugElement.queryAll(By.css('input'));

    triggerKeyEvent('keydown', '1', 0);
    const event = triggerKeyEvent('keydown', 'Tab', 1);
    expect(event.defaultPrevented).toBeFalsy();
  });

  it('should register onChange', () => {
    const onChange = jest.fn();
    component.registerOnChange(onChange);
    component.onChange('123');
    expect(onChange).toHaveBeenCalledWith('123');
  });

  it('should register onTouched', () => {
    const onTouched = jest.fn();
    component.registerOnTouched(onTouched);
    component.onTouched();
    expect(onTouched).toHaveBeenCalled();
  });
});
