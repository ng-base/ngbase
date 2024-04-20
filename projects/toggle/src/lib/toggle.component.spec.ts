import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Toggle } from './toggle.component';

describe('ToggleComponent', () => {
  let component: Toggle;
  let fixture: ComponentFixture<Toggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toggle],
    }).compileComponents();

    fixture = TestBed.createComponent(Toggle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
