import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Slider } from './slider.component';

describe('SliderComponent', () => {
  let component: Slider;
  let fixture: ComponentFixture<Slider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Slider],
    }).compileComponents();

    fixture = TestBed.createComponent(Slider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
