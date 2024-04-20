import { ComponentRef, InjectionToken, Injector } from '@angular/core';
import { Subscription, Subject, first } from 'rxjs';
import { DialogComponent } from './dialog.component';

abstract class BaseDialogRef<T> {
  data: T = this.options.data;
  private backdropSub: Subscription | null = null;

  private onDestroySource = new Subject();
  onDestroy = this.onDestroySource.asObservable().pipe(first());

  private afterClosedSource = new Subject<any>();
  afterClosed = this.afterClosedSource.asObservable();

  constructor(
    private d: DialogComponent,
    private options: DialogOptions,
    private destroyParent: () => void,
  ) {
    this.backdropSub = d.backdrop.subscribe((r) => {
      if (options.backdrop || r === 'close') {
        this.close();
      }
    });
  }

  close(data?: any) {
    this.afterClosedSource.next(data);
    this.destroy();
  }

  private destroy() {
    this.backdropSub?.unsubscribe();
    this.afterClosedSource.complete();
    this.onDestroySource.next(false);
    this.destroyParent();
  }
}

export class DialogRef<T = any> extends BaseDialogRef<T> {}

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
