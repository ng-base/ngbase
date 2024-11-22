import { ElementHelper, render, RenderResult } from '@meeui/ui/test';
import { InputOtp } from './otp';

describe('InputOtp', () => {
  let component: InputOtp;
  let view: RenderResult<InputOtp>;
  let inputs: ElementHelper<HTMLInputElement>[];

  function getInputs() {
    return view.$0All<HTMLInputElement>('input');
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
    inputs[0].type('1');
    expect(document.activeElement).toBe(inputs[1].el);
    inputs[2].focus();
    expect(document.activeElement).toBe(inputs[1].el);
  });

  it('should move focus to the previous input on backspace', () => {
    view.setInput('size', [3, 3]);
    view.detectChanges();
    inputs = getInputs();
    inputs[0].type('1');
    inputs[1].type('1');
    inputs[2].type(['Backspace']);
    expect(document.activeElement).toBe(inputs[1].el);
    inputs[0].focus();
    expect(document.activeElement).toBe(inputs[1].el);
  });

  it('should update value on input change', () => {
    component.onChange = jest.fn();
    view.setInput('size', [3]);
    view.detectChanges();
    inputs = getInputs();
    jest.spyOn(component, 'updateValue');
    inputs[0].type('1');
    inputs[1].type('2');
    expect(component.onChange).not.toHaveBeenCalled();
    inputs[2].type('3');
    expect(component.onChange).toHaveBeenCalledWith('123');
    inputs[2].type('4');
    expect(component.lastValue).toBe('123');
    inputs[2].type(['Backspace']);
    expect(component.onChange).toHaveBeenCalledWith('');
  });

  it('should not allow non-numeric input', () => {
    view.setInput('size', [3]);
    view.detectChanges();
    inputs = getInputs();
    const event = inputs[0].type('a');
    expect(event.defaultPrevented).toBe(true);
  });

  it('should write value correctly', () => {
    view.setInput('size', [3]);
    view.detectChanges();

    component.writeValue('123');

    inputs = getInputs();
    expect(inputs[0].el.value).toBe('1');
    expect(inputs[1].el.value).toBe('2');
    expect(inputs[2].el.value).toBe('3');
  });

  it('should handle partial input correctly', () => {
    view.setInput('size', [3, 3]);
    view.detectChanges();

    component.writeValue('123');
    inputs = getInputs();
    expect(inputs[0].el.value).toBe('1');
    expect(inputs[1].el.value).toBe('2');
    expect(inputs[2].el.value).toBe('3');
    expect(inputs[3].el.value).toBe('');
    expect(inputs[4].el.value).toBe('');
    expect(inputs[5].el.value).toBe('');
  });

  it('should update tabIndex correctly', () => {
    view.setInput('size', [4]);
    view.detectChanges();
    inputs = getInputs();

    const getTabIndexes = () => inputs.map(i => i.el.tabIndex);

    expect(getTabIndexes()).toEqual([0, -1, -1, -1]);
    inputs[0].type('1');
    expect(getTabIndexes()).toEqual([-1, 0, -1, -1]);
    inputs[1].type('2');
    inputs[2].type('3');
    expect(getTabIndexes()).toEqual([-1, -1, -1, 0]);
    inputs[3].type('4');
    expect(getTabIndexes()).toEqual([-1, -1, -1, 0]);
  });

  it('should allow Tab key to move focus', () => {
    view.setInput('size', [3]);
    view.detectChanges();
    inputs = getInputs();

    inputs[0].type('1');
    const event = inputs[1].type(['Tab']);
    expect(event.defaultPrevented).toBeFalsy();
  });

  it('should register onChange', () => {
    const onChange = jest.fn();
    component.registerOnChange(onChange);
    component.onChange!('123');
    expect(onChange).toHaveBeenCalledWith('123');
  });

  it('should register onTouched', () => {
    const onTouched = jest.fn();
    component.registerOnTouched(onTouched);
    component.onTouched!();
    expect(onTouched).toHaveBeenCalled();
  });
});
