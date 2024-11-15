import { DOCUMENT } from '@angular/common';
import {
  ElementRef,
  InjectionToken,
  Injector,
  TemplateRef,
  Type,
  ViewContainerRef,
  inject,
  signal,
} from '@angular/core';
import { BehaviorSubject, Subject, Subscription, filter, first } from 'rxjs';

export type DialogInput<T = any> = Type<T> | TemplateRef<any>;

export abstract class BaseDialog {
  dialogRef = inject(DialogRef);
  document = inject(DOCUMENT);
  el = inject(ElementRef);

  _afterViewSource = new BehaviorSubject<ViewContainerRef | null>(null);
  afterView = this._afterViewSource.asObservable().pipe(filter(Boolean));

  target = signal<HTMLElement | null>(null);

  // counter is required because we have start and end animation
  // so we need to wait for both to finish before destroying the dialog
  count = 0;
  private isFirst = true;
  private currentActiveElement = new WeakRef(this.document.activeElement as HTMLElement);

  constructor() {
    this.onOpen();
  }

  setOptions(_: DialogOptions): void {}

  close() {
    this.dialogRef.close();
  }

  animationDone = () => {
    this.count++;
    if (this.count === 2) {
      this.onClose();
    }
  };

  private onOpen() {
    // make the body not scrollable and add padding to the right
    // calculate the padding based on the scrollbar width
    this.isFirst = this.document.body.style.overflow !== 'hidden';
    if (this.isFirst) {
      const padding = window.innerWidth - this.document.body.clientWidth;
      this.document.body.style.paddingRight = `${padding}px`;
      this.document.body.style.overflow = 'hidden';
    }
  }

  getTarget(): HTMLElement {
    return this.target()!;
  }

  onClose = () => {
    if (this.isFirst) {
      this.document.body.style.paddingRight = '';
      this.document.body.style.overflow = '';
    }
    const target = this.getTarget() || this.currentActiveElement.deref();
    target?.focus();
  };
}

export class DialogRef<T = any> {
  data = this.options.data;
  private backdropSub: Subscription | null = null;

  private onDestroySource = new Subject();
  onDestroy = this.onDestroySource.asObservable().pipe(first());

  private afterClosedSource = new Subject<any>();
  afterClosed = this.afterClosedSource.asObservable().pipe(first());

  events = new Subject<'created'>();

  constructor(
    public options: DialogOptions<T>,
    private destroyParent: VoidFunction,
    private closeAllFn: VoidFunction,
    private animation = true,
  ) {}

  close = (data?: any) => {
    this.afterClosedSource.next(data);
    // if (!this.animation) {
    this.destroy();
    // }
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
  header?: boolean;
  overrideLowerDialog?: boolean = false;
  disableClose? = false;
  ayId?: string;
  focusTrap? = true;
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
