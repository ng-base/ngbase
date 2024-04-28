import {
  InjectionToken,
  Injector,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { Subscription, Subject, first, BehaviorSubject, filter } from 'rxjs';

export type DialogPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'tl'
  | 'tr'
  | 'bl'
  | 'br';

export abstract class BaseDialogComponent {
  dialogRef = inject(DialogRef);

  _afterViewSource = new BehaviorSubject<ViewContainerRef | null>(null);
  afterView = this._afterViewSource.asObservable().pipe(filter(Boolean));

  animationCompleted$ = new Subject<boolean>();

  setOptions(options: DialogOptions): void {}

  close() {
    this.dialogRef.close();
  }
}

export class DialogRef<T = any> {
  data: T = this.options.data;
  private backdropSub: Subscription | null = null;

  private onDestroySource = new Subject();
  onDestroy = this.onDestroySource.asObservable().pipe(first());

  private afterClosedSource = new Subject<any>();
  afterClosed = this.afterClosedSource.asObservable();

  events = new Subject<'created'>();

  constructor(
    public options: DialogOptions,
    private destroyParent: () => void,
    private closeAllFn: () => void,
  ) {}

  close = (data?: any) => {
    this.afterClosedSource.next(data);
    this.destroy();
  };

  closeAll() {
    this.closeAllFn();
  }

  private destroy() {
    this.backdropSub?.unsubscribe();
    this.afterClosedSource.complete();
    this.onDestroySource.next(false);
    this.destroyParent();
  }
}

export class DialogTestingRef {
  close() {}
}

export class DialogOptions {
  backdrop? = true;
  backdropColor? = true;
  hideOverlay? = false;
  data?: any;
  isSidePopup? = false;
  title?: string;
  fullWindow?: boolean;
  width?: string;
  height?: string;
  maxHeight?: string;
  classNames?: string[] = [];
  isHideHeader?: boolean;
  overrideLowerDialog?: boolean = false;
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
