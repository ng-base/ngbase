import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleGroup } from './toggle-group.component';

describe('ToggleGroupComponent', () => {
  let component: ToggleGroup;
  let fixture: ComponentFixture<ToggleGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleGroup],
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
