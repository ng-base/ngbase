import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Drawer } from './drawer.component';

describe('DrawerComponent', () => {
  let component: Drawer;
  let fixture: ComponentFixture<Drawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Drawer],
    }).compileComponents();

    fixture = TestBed.createComponent(Drawer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
