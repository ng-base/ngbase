import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Radio } from './radio.component';

describe('RadioComponent', () => {
  let component: Radio;
  let fixture: ComponentFixture<Radio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Radio],
    }).compileComponents();

    fixture = TestBed.createComponent(Radio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
