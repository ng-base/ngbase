import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Radio } from './radio.component';
import { RadioGroup } from './radio-group.component';
import { signal } from '@angular/core';

describe('RadioComponent', () => {
  let component: Radio;
  let fixture: ComponentFixture<Radio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Radio],
      providers: [{ provide: RadioGroup, useValue: { value: signal('1') } }],
    }).compileComponents();

    fixture = TestBed.createComponent(Radio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a unique id', () => {
    expect(component.inputId).toBeTruthy();
  });

  it('should check if value is equal to radio value', () => {
    expect(component.checked()).toBeFalsy();
    fixture.componentRef.setInput('value', '1');
    fixture.detectChanges();
    expect(component.checked()).toBeTruthy();
  });

  it('should call updateValue when clicked', () => {
    fixture.componentRef.setInput('value', '1');
    const spy = jest.spyOn(component, 'updateValue');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('should not call updateValue when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    const spy = jest.spyOn(component, 'updateValue');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should avoid the curosor pointer when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const button = fixture.nativeElement as HTMLButtonElement;
    expect(button.classList).toContain('cursor-not-allowed');
  });
});
