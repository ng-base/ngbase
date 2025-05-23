import { Component } from '@angular/core';
import { ElementHelper, render, RenderResult } from '@ngbase/adk/test';
import { RangePipe } from '@ngbase/adk/utils';
import { NgbInputOtp, NgbOtpInput, NgbOtpValue, aliasInputOtp } from './otp';

@Component({
  selector: 'test-component',
  imports: [RangePipe, NgbOtpInput, NgbOtpValue],
  providers: [aliasInputOtp(TestComponent)],
  template: `
    @for (num of size(); track $index; let l = $last) {
      @for (n of num | range; track n; let i = $index; let ll = $last) {
        <input ngbOtpValue />
      }
      @if (!l) {
        <div>-</div>
      }
    }
    <input ngbOtpInput />
  `,
})
class TestComponent extends NgbInputOtp {}

describe('InputOtp', () => {
  let component: TestComponent;
  let view: RenderResult<TestComponent>;
  let inputs: ElementHelper<HTMLInputElement>[];
  let input: ElementHelper<HTMLInputElement>;

  function getValueInputs() {
    return view.$All<HTMLInputElement>('[ngbotpvalue]');
  }

  function activeElement() {
    return getValueInputs().findIndex(i => !!i.el.getAttribute('data-focus'));
  }

  beforeEach(async () => {
    view = await render(TestComponent);
    component = view.host;
    view.detectChanges();
    input = view.$<HTMLInputElement>('input[ngbotpinput]');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct number of input fields', () => {
    view.setInput('size', [3, 3]);
    view.detectChanges();
    const inputs = getValueInputs();
    expect(inputs.length).toBe(6);
  });

  it('should move focus to the next input on value entry', () => {
    view.setInput('size', [3, 3]);
    view.detectChanges();
    inputs = getValueInputs();
    input.type('1');
    view.detectChanges();
    expect(activeElement()).toBe(1);
    input.type('2');
    view.detectChanges();
    expect(activeElement()).toBe(2);
  });

  it('should move focus to the previous input on backspace', () => {
    view.setInput('size', [3, 3]);
    view.detectChanges();
    inputs = getValueInputs();
    input.type('1');
    input.type('1');
    input.type(['Backspace']);
    view.detectChanges();
    expect(activeElement()).toBe(1);
    input.focus();
    view.detectChanges();
    expect(activeElement()).toBe(1);
  });

  // it('should update value on input change', () => {
  //   component['onChange'] = jest.fn();
  //   view.setInput('size', [3]);
  //   view.detectChanges();
  //   inputs = getValueInputs();
  //   jest.spyOn(component, 'updateValue');
  //   input.type('1');
  //   input.type('2');
  //   expect(component['onChange']).not.toHaveBeenCalled();
  //   input.type('3');
  //   expect(component['onChange']).toHaveBeenCalledWith('123');
  //   input.type('4');
  //   expect(component['lastValue']).toBe('123');
  //   input.type(['Backspace']);
  //   expect(component['onChange']).toHaveBeenCalledWith('');
  // });

  // it('should not allow non-numeric input', () => {
  //   view.setInput('size', [3]);
  //   view.detectChanges();
  //   inputs = getValueInputs();
  //   const event = input.type('a');
  //   expect(event.defaultPrevented).toBe(true);
  // });

  it('should write value correctly and validate tabIndex', () => {
    view.setInput('size', [3]);
    view.detectChanges();
    inputs = getValueInputs();

    component.writeValue('123');
    view.detectChanges();
    expect(getValues()).toEqual(['1', '2', '3']);
    expect(getTabIndexes()).toEqual([-1, -1, -1]);

    component.writeValue('');
    view.detectChanges();
    expect(getValues()).toEqual(['', '', '']);
    expect(getTabIndexes()).toEqual([-1, -1, -1]);
  });

  it('should handle partial input correctly', () => {
    view.setInput('size', [3, 3]);
    view.detectChanges();
    inputs = getValueInputs();

    component.writeValue('123');
    view.detectChanges();
    expect(getValues()).toEqual(['1', '2', '3', '', '', '']);
    expect(getTabIndexes()).toEqual([-1, -1, -1, -1, -1, -1]);
  });

  it('should update tabIndex correctly', () => {
    view.setInput('size', [4]);
    view.detectChanges();
    inputs = getValueInputs();

    expect(getTabIndexes()).toEqual([-1, -1, -1, -1]);
    input.type('1');
    view.detectChanges();
    expect(getTabIndexes()).toEqual([-1, -1, -1, -1]);
    input.type('2');
    input.type('3');
    view.detectChanges();
    expect(getTabIndexes()).toEqual([-1, -1, -1, -1]);
    input.type('4');
    view.detectChanges();
    expect(getTabIndexes()).toEqual([-1, -1, -1, -1]);
  });

  it('should handle the masked property', () => {
    view.setInput('size', [3]);
    view.setInput('masked', true);
    view.detectChanges();
    inputs = getValueInputs();
    expect(getValues()).toEqual(['', '', '']);

    component.writeValue('12');
    view.detectChanges();
    expect(getValues()).toEqual(['•', '•', '']);
  });

  it('should allow Tab key to move focus', () => {
    view.setInput('size', [3]);
    view.detectChanges();
    inputs = getValueInputs();

    input.type('1');
    let event = input.keydown('Tab');
    expect(event.defaultPrevented).toBeFalsy();

    input.type('2');
    input.type('3');
    for (const key of ['Tab', 'Enter', 'Backspace']) {
      input.focus();
      event = input.keydown(key);
      expect(event.defaultPrevented).toBeFalsy();
    }
  });

  it('should allow paste key', () => {
    view.setInput('size', [3]);
    view.detectChanges();
    inputs = getValueInputs();
    const event = input.keydown('v', { ctrlKey: true });
    expect(event.defaultPrevented).toBeFalsy();
  });

  it('should handle paste correctly', () => {
    view.setInput('size', [3]);
    view.detectChanges();
    inputs = getValueInputs();
    input.paste('12c');
    view.detectChanges();
    expect(getValues()).toEqual(['1', '2', '']);
    expect(getTabIndexes()).toEqual([-1, -1, -1]);
  });

  it('should call onChange when value is valid', () => {
    view.setInput('size', [3]);
    view.detectChanges();
    component['onChange'] = jest.fn();
    input.type('1');
    input.type('2');
    input.type('3');
    view.detectChanges();
    expect(component['onChange']).toHaveBeenCalledWith('123');
  });

  it('should register onChange', () => {
    const onChange = jest.fn();
    component.registerOnChange(onChange);
    component['onChange']!('123');
    expect(onChange).toHaveBeenCalledWith('123');
  });

  it('should register onTouched', () => {
    const onTouched = jest.fn();
    component.registerOnTouched(onTouched);
    component['onTouched']!();
    expect(onTouched).toHaveBeenCalled();
  });

  function getValues() {
    return inputs.map(i => i.el.textContent);
  }

  function getTabIndexes() {
    return inputs.map(i => i.el.tabIndex);
  }
});
