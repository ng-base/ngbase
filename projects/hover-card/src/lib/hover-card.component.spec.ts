import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverCardComponent } from './hover-card.component';

describe('HoverCardComponent', () => {
  let component: HoverCardComponent;
  let fixture: ComponentFixture<HoverCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoverCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HoverCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
