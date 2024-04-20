import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sonner } from './sonner.component';

describe('SonnerComponent', () => {
  let component: Sonner;
  let fixture: ComponentFixture<Sonner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sonner],
    }).compileComponents();

    fixture = TestBed.createComponent(Sonner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
