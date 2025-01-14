import { Component, signal } from '@angular/core';
import { render, RenderResult } from '@meeui/adk/test';
import { MeePortalClose } from './portal-close.directive';
import { DialogRef } from './dialog-ref';

@Component({
  selector: 'mee-test-dialog',
  imports: [MeePortalClose],
  template: `<button [meePortalClose]="value()">Close</button>`,
})
class TestComponent {
  readonly value = signal<any>(undefined);
}

describe('DialogCloseDirective', () => {
  let component: TestComponent;
  let view: RenderResult<TestComponent>;
  let directive: MeePortalClose;

  beforeEach(async () => {
    view = await render(TestComponent, [{ provide: DialogRef, useValue: { close: jest.fn() } }]);
    component = view.host;
    directive = view.viewChild(MeePortalClose);
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog', () => {
    jest.spyOn(directive['dialogRef'], 'close');
    view.$('button').click();
    expect(directive['dialogRef'].close).toHaveBeenCalled();
  });

  it('should close the dialog with the value', () => {
    jest.spyOn(directive['dialogRef'], 'close');
    component.value.set('test');
    view.detectChanges();
    view.$('button').click();
    expect(directive['dialogRef'].close).toHaveBeenCalledWith('test');
  });
});
