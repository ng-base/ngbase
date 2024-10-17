import { render, RenderResult } from '../test';
import { InputOtp } from './otp';

describe('InputOtp', () => {
  let component: InputOtp;
  let view: RenderResult<InputOtp>;
  let inputs: HTMLInputElement[];

  function triggerKeyEvent(name: string, key: string, index: number) {
    const event = new KeyboardEvent(name, { key, cancelable: true });
    const inputElement = inputs[index];
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

  function getInputs() {
    return [...view.$$('input')] as HTMLInputElement[];
  }

  beforeEach(async () => {
    view = await render(InputOtp);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct number of input fields', () => {
    view.setInput('size', [3, 3]);
    view.detectChanges();
    const inputs = getInputs();
    expect(inputs.length).toBe(6);
  });

  it('should move focus to the next input on value entry', () => {
    view.setInput('size', [3, 3]);
    view.detectChanges();
    inputs = getInputs();
    triggerKeyEvent('keydown', '1', 0);
    expect(document.activeElement).toBe(inputs[1]);
    inputs[2].focus();
    expect(document.activeElement).toBe(inputs[1]);
  });

  it('should move focus to the previous input on backspace', () => {
    view.setInput('size', [3, 3]);
    view.detectChanges();
    inputs = getInputs();
    triggerKeyEvent('keydown', '1', 0);
    triggerKeyEvent('keydown', '1', 1);
    triggerKeyEvent('keydown', 'Backspace', 2);
    expect(document.activeElement).toBe(inputs[1]);
    inputs[0].focus();
    expect(document.activeElement).toBe(inputs[1]);
  });

  it('should update value on input change', () => {
    view.setInput('size', [3]);
    view.detectChanges();
    inputs = getInputs();
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
    view.setInput('size', [3]);
    view.detectChanges();
    inputs = getInputs();
    const event = triggerKeyEvent('keydown', 'a', 0);
    expect(event.defaultPrevented).toBe(true);
  });

  it('should write value correctly', () => {
    view.setInput('size', [3]);
    view.detectChanges();

    component.writeValue('123');

    inputs = getInputs();
    expect(inputs[0].value).toBe('1');
    expect(inputs[1].value).toBe('2');
    expect(inputs[2].value).toBe('3');
  });

  it('should handle partial input correctly', () => {
    view.setInput('size', [3, 3]);
    view.detectChanges();

    component.writeValue('123');
    inputs = getInputs();
    expect(inputs[0].value).toBe('1');
    expect(inputs[1].value).toBe('2');
    expect(inputs[2].value).toBe('3');
    expect(inputs[3].value).toBe('');
    expect(inputs[4].value).toBe('');
    expect(inputs[5].value).toBe('');
  });

  it('should update tabIndex correctly', () => {
    view.setInput('size', [4]);
    view.detectChanges();
    inputs = getInputs();

    const getTabIndexes = () => inputs.map(i => i.tabIndex);

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
    view.setInput('size', [3]);
    view.detectChanges();
    inputs = getInputs();

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
