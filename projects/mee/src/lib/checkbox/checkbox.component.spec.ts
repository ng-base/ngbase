import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Checkbox } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: Checkbox;
  let fixture: ComponentFixture<Checkbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkbox],
    }).compileComponents();

    fixture = TestBed.createComponent(Checkbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disbale the checkbox', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(['cursor-pointer'].every(x => el.className.includes(x))).toBeTruthy();
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(['opacity-60', 'cursor-not-allowed'].every(x => el.className.includes(x))).toBeTruthy();
  });

  it('should disabled checkbox should not be clickable', () => {
    const el = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('disabled', true);
    expect(component.checked()).toBeFalsy();
    el.querySelector('button')!.click();
    expect(component.checked()).toBeFalsy();
  });

  it('should update the checked when writeValue is called', () => {
    jest.spyOn(component.change, 'emit');
    expect(component.checked()).toBeFalsy();
    component.writeValue(true);
    expect(component.checked()).toBeTruthy();
    expect(component.change.emit).not.toHaveBeenCalled();
  });

  it('should emit change event when checkbox is clicked', () => {
    jest.spyOn(component.change, 'emit');
    jest.spyOn(component, 'updateValue');
    expect(component.checked()).toBeFalsy();
    const el = fixture.nativeElement as HTMLElement;
    el.querySelector('button')!.click();
    expect(component.checked()).toBeTruthy();
    expect(component.updateValue).toHaveBeenCalled();
    expect(component.change.emit).toHaveBeenCalledWith(true);
  });

  it('should add svg when checkbox is checked', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('svg')).toBeFalsy();
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();
    expect(el.querySelector('svg')).toBeTruthy();
  });
});
