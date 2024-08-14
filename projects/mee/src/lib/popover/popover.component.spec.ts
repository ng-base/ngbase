import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DialogRef } from '@meeui/portal';
import { Popover } from './popover.component';

const options = { title: 'Drawer' };
const mockDialogRef = new DialogRef(
  options,
  () => jest.fn(),
  () => jest.fn(),
  true,
);

describe('DrawerComponent', () => {
  let component: Popover;
  let fixture: ComponentFixture<Popover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Popover],
      providers: [provideNoopAnimations(), { provide: DialogRef, useValue: mockDialogRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(Popover);
    component = fixture.componentInstance;
    component.setOptions(options);
    component.tooltipOptions = {
      anchor: true,
      target: { offsetWidth: 200, offsetHeight: 100 } as HTMLElement,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
