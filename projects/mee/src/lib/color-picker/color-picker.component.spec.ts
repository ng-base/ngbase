import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorPickerContainer } from './color-picker-container.component';

// test cases
// x: 0, y: 0 => s: 0, l: 100
// x: 100, y: 100 => s: 0, l: 0
// x: 0, y: 100 => s: 0, l: 0
// x: 100, y: 0 => s: 100, l: 50
// calculate(x: number, y: number): { s: number; l: number } {
//   // Calculate saturation and brightness based on x and y
// }
function calculate(x: number, y: number): { s: number; l: number } {
  // Convert x and y to values between 0 and 1
  const s = x - y >= 0 ? x - y : 0;
  const l = 100 - y - s / 2;

  return { s, l };
}

describe('ColorPicker2', () => {
  let component: ColorPickerContainer;
  let fixture: ComponentFixture<ColorPickerContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorPickerContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorPickerContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate saturation and lightness based on x and y', () => {
    expect(calculate(0, 0)).toEqual({ s: 0, l: 100 });
    expect(calculate(100, 100)).toEqual({ s: 0, l: 0 });
    expect(calculate(0, 100)).toEqual({ s: 0, l: 0 });
    expect(calculate(100, 0)).toEqual({ s: 100, l: 50 });
  });
});
