import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPicker } from './color-picker.component';

describe('ColorPickerComponent', () => {
  let component: ColorPicker;
  let fixture: ComponentFixture<ColorPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorPicker],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
