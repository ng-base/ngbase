import { InjectionToken, Injector, ViewContainerRef, inject, signal } from '@angular/core';
import { Subscription, Subject, first, BehaviorSubject, filter } from 'rxjs';

export type DialogPosition = 'top' | 'bottom' | 'left' | 'right' | 'tl' | 'tr' | 'bl' | 'br';

export abstract class BaseDialog {
  dialogRef = inject(DialogRef);

  _afterViewSource = new BehaviorSubject<ViewContainerRef | null>(null);
  afterView = this._afterViewSource.asObservable().pipe(filter(Boolean));

  target = signal<HTMLElement | null>(null);

  status = this.dialogRef.status;

  // counter is required because we have start and end animation
  // so we need to wait for both to finish before destroying the dialog
  count = 0;

  setOptions(options: DialogOptions): void {}

  close() {
    this.dialogRef.close();
  }

  animationDone = () => {
    this.count++;
    if (this.count === 2) {
      this.dialogRef.destroy();
    }
  };

  onOpen() {
    // make the body not scrollable and add padding to the right
    // calculate the padding based on the scrollbar width
    const padding = window.innerWidth - document.body.clientWidth;
    document.body.style.paddingRight = `${padding}px`;
    document.body.style.overflow = 'hidden';
  }

  onClose() {
    document.body.style.paddingRight = '';
    document.body.style.overflow = '';
  }
}

export class DialogRef<T = any> {
  data = this.options.data;
  private backdropSub: Subscription | null = null;

  private onDestroySource = new Subject();
  onDestroy = this.onDestroySource.asObservable().pipe(first());

  private afterClosedSource = new Subject<any>();
  afterClosed = this.afterClosedSource.asObservable().pipe(first());

  events = new Subject<'created'>();

  status = signal(true);

  constructor(
    public options: DialogOptions<T>,
    private destroyParent: VoidFunction,
    private closeAllFn: VoidFunction,
    private animation = true,
  ) {}

  close = (data?: any) => {
    this.status.set(false);
    this.afterClosedSource.next(data);
    if (!this.animation) {
      this.destroy();
    }
  };

  closeAll() {
    this.closeAllFn();
  }

  destroy() {
    this.backdropSub?.unsubscribe();
    this.afterClosedSource.complete();
    this.onDestroySource.next(false);
    this.destroyParent();
    // console.log('destroyed parent');
  }
}

export class DialogTestingRef {
  close() {}
}

export class DialogOptions<T = any> {
  backdrop? = true;
  backdropColor? = true;
  hideOverlay? = false;
  data?: T;
  // isSidePopup? = false;
  title?: string;
  fullWindow?: boolean;
  minWidth?: string;
  minHeight?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  classNames?: string[] = [];
  isHideHeader?: boolean;
  overrideLowerDialog?: boolean = false;
  disableClose? = false;
}

export const DIALOG_INJ = new InjectionToken('dialogInj');

export function createInj(parent: Injector, data: any, diaRef: DialogRef) {
  return Injector.create({
    providers: [
      { provide: DIALOG_INJ, useValue: data },
      { provide: DialogRef, useValue: diaRef },
    ],
    parent,
    name: 'dialogInj',
  });
}

export const DialogTestProviders = [
  { provide: DIALOG_INJ, useValue: {} },
  { provide: DialogRef, useValue: null },
];
