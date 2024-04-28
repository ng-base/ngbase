import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Separator } from './separator.component';

describe('SeparatorComponent', () => {
  let component: Separator;
  let fixture: ComponentFixture<Separator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Separator],
    }).compileComponents();

    fixture = TestBed.createComponent(Separator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
