import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DialogRef } from '@meeui/portal';
import { Sheet } from './sheet.component';

const options = { title: 'Drawer' };
const mockDialogRef = new DialogRef(
  options,
  () => jest.fn(),
  () => jest.fn(),
  true,
);

describe('DrawerComponent', () => {
  let component: Sheet;
  let fixture: ComponentFixture<Sheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sheet],
      providers: [provideNoopAnimations(), { provide: DialogRef, useValue: mockDialogRef }],
    }).compileComponents();

    fixture = TestBed.createComponent(Sheet);
    component = fixture.componentInstance;
    component.setOptions(options);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
