import { Component, signal } from '@angular/core';
import { render, RenderResult } from '@meeui/ui/test';
import { DialogClose } from './dialog-close.directive';
import { DialogRef } from './dialog-ref';

@Component({
  selector: 'mee-test-dialog',
  imports: [DialogClose],
  template: `<button [meeDialogClose]="value()">Close</button>`,
})
class TestComponent {
  readonly value = signal<any>(undefined);
}

describe('DialogCloseDirective', () => {
  let component: TestComponent;
  let view: RenderResult<TestComponent>;
  let directive: DialogClose;

  beforeEach(async () => {
    view = await render(TestComponent, [{ provide: DialogRef, useValue: { close: jest.fn() } }]);
    component = view.host;
    directive = view.viewChild(DialogClose);
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog', () => {
    jest.spyOn(directive.dialogRef, 'close');
    view.$0('button').click();
    expect(directive.dialogRef.close).toHaveBeenCalled();
  });

  it('should close the dialog with the value', () => {
    jest.spyOn(directive.dialogRef, 'close');
    component.value.set('test');
    view.detectChanges();
    view.$0('button').click();
    expect(directive.dialogRef.close).toHaveBeenCalledWith('test');
  });
});
