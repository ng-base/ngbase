import { ElementHelper, render, RenderResult } from '@meeui/adk/test';
import { MeeInputOtp } from './otp';

describe('InputOtp', () => {
  let component: MeeInputOtp;
  let view: RenderResult<MeeInputOtp>;
  let inputs: ElementHelper<HTMLInputElement>[];
  let input: ElementHelper<HTMLInputElement>;

  function getValueInputs() {
    return view.$All<HTMLInputElement>('[meeotpvalue]');
  }

  function activeElement() {
    return getValueInputs().findIndex(i => !!i.el.getAttribute('data-focus'));
  }

  beforeEach(async () => {
    view = await render(MeeInputOtp);
    component = view.host;
    view.detectChanges();
    input = view.$<HTMLInputElement>('input[meeotpinput]');
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

  it('should update value on input change', () => {
    component['onChange'] = jest.fn();
    view.setInput('size', [3]);
    view.detectChanges();
    inputs = getValueInputs();
    jest.spyOn(component, 'updateValue');
    input.type('1');
    input.type('2');
    expect(component['onChange']).not.toHaveBeenCalled();
    input.type('3');
    expect(component['onChange']).toHaveBeenCalledWith('123');
    input.type('4');
    expect(component['lastValue']).toBe('123');
    input.type(['Backspace']);
    expect(component['onChange']).toHaveBeenCalledWith('');
  });

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

  it('should allow Tab key to move focus', () => {
    view.setInput('size', [3]);
    view.detectChanges();
    inputs = getValueInputs();

    input.type('1');
    const event = input.keydown('Tab');
    expect(event.defaultPrevented).toBeFalsy();
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
