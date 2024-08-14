import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Input } from './input.directive';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [Input],
  template: ` <input meeInput /> `,
})
class TestInput {}

describe('InputComponent', () => {
  let component: TestInput;
  let fixture: ComponentFixture<TestInput>;
  let input: Input;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestInput],
    }).compileComponents();

    fixture = TestBed.createComponent(TestInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
    input = fixture.debugElement.children[0].injector.get(Input);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
