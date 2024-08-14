import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Switch } from './switch.component';

describe('SwitchComponent', () => {
  let component: Switch;
  let fixture: ComponentFixture<Switch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Switch],
    }).compileComponents();

    fixture = TestBed.createComponent(Switch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a unique id', () => {
    expect(component.id).toBeTruthy();
  });

  it('should toggle checked state', () => {
    expect(component.checked()).toBeFalsy();
    component.updateValue();
    expect(component.checked()).toBeTruthy();
    component.updateValue();
    expect(component.checked()).toBeFalsy();
  });

  it('should render content when checked', () => {
    component.checked.set(true);
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(content.classList).toContain('translate-x-full');

    component.checked.set(false);
    fixture.detectChanges();
    expect(content.classList).not.toContain('translate-x-full');
  });

  it('should call updateValue when clicked', () => {
    const spy = jest.spyOn(component, 'updateValue');
    const changeSpy = jest.spyOn(component.change, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(spy).toHaveBeenCalled();
    expect(changeSpy).toHaveBeenCalledWith(true);
  });

  it('should not call updateValue when writeValue is called', () => {
    const spy = jest.spyOn(component, 'updateValue');
    const onChangeSpy = jest.spyOn(component, 'onChange');
    component.writeValue(true);
    expect(spy).not.toHaveBeenCalled();
    expect(onChangeSpy).not.toHaveBeenCalled();
  });
});
