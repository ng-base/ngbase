import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogClose } from './dialog-close.directive';
import { Component } from '@angular/core';
import { DialogRef } from './dialog-ref';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  selector: 'mee-test-dialog',
  imports: [DialogClose],
  template: `<button [meeDialogClose]="value">Close</button>`,
})
class TestComponent {
  value: any = undefined;
}

describe('DialogCloseDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: DialogClose;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [{ provide: DialogRef, useValue: { close: jest.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directive = fixture.debugElement.query(By.directive(DialogClose)).injector.get(DialogClose);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog', () => {
    jest.spyOn(directive.dialogRef, 'close');
    const el = fixture.nativeElement as HTMLElement;
    el.querySelector('button')!.click();
    expect(directive.dialogRef.close).toHaveBeenCalled();
  });

  it('should close the dialog with the value', () => {
    jest.spyOn(directive.dialogRef, 'close');
    component.value = 'test';
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    el.querySelector('button')!.click();
    expect(directive.dialogRef.close).toHaveBeenCalledWith('test');
  });
});
