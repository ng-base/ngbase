import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Drawer } from './drawer.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DialogRef } from '@meeui/portal';

const options = { title: 'Drawer' };
const mockDialogRef = new DialogRef(
  options,
  () => jest.fn(),
  () => jest.fn(),
  true,
);

describe('DrawerComponent', () => {
  let component: Drawer;
  let fixture: ComponentFixture<Drawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Drawer],
      providers: [provideNoopAnimations(), { provide: DialogRef, useValue: mockDialogRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(Drawer);
    component = fixture.componentInstance;
    component.setOptions(options);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
