import { DialogRef } from './dialog-ref';

describe('DialogRef', () => {
  let dialogRef: DialogRef<any>;
  let parent: { destroyParent: VoidFunction; closeAllFn: VoidFunction };
  let data: any;

  beforeEach(async () => {
    parent = { destroyParent: jest.fn(), closeAllFn: jest.fn() };
    data = { data: 'test' };
    dialogRef = new DialogRef(
      { backdropColor: true, fullWindow: false, data },
      parent.destroyParent,
      parent.closeAllFn,
    );
  });

  it('should create', () => {
    expect(dialogRef).toBeTruthy();
    expect(dialogRef.data).toBe(data);
  });

  it('should call the closeAll function when closeAll is called', () => {
    dialogRef.closeAll();
    expect(parent.closeAllFn).toHaveBeenCalled();
  });

  it('should call the destroy function when destroy is called', () => {
    let called = false;
    dialogRef.onDestroy.subscribe(() => (called = true));
    dialogRef.destroy();
    expect(called).toBeTruthy();
    expect(parent.destroyParent).toHaveBeenCalled();
  });

  it('should close method with data should call afterClosedSource.next', () => {
    let closeData = null;
    dialogRef.afterClosed.subscribe(data => (closeData = data));
    jest.spyOn(dialogRef, 'destroy');
    dialogRef.close('test');
    expect(closeData).toBe('test');
    expect(dialogRef.destroy).toHaveBeenCalled();
  });

  it('should close method without data and animation should call destroy', () => {
    let closeData = null;
    (dialogRef as any).animation = false;
    dialogRef.afterClosed.subscribe(data => (closeData = data));
    jest.spyOn(dialogRef, 'destroy');
    dialogRef.close();
    expect(closeData).toBeUndefined();
    expect(dialogRef.destroy).toHaveBeenCalled();
  });
});
