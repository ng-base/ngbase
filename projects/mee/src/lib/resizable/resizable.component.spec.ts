import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Resizable } from './resizable.component';

describe('ResizableComponent', () => {
  let component: Resizable;
  let fixture: ComponentFixture<Resizable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Resizable],
    }).compileComponents();

    fixture = TestBed.createComponent(Resizable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
