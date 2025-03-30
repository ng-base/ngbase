import {
  Directive,
  OnDestroy,
  ViewContainerRef,
  afterNextRender,
  computed,
  inject,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { BaseDialog, DialogRef } from '@ngbase/adk/portal';
import { SheetOptions } from './sheet.service';
import { injectDirectionality } from '@ngbase/adk/bidi';

@Directive({
  selector: 'mee-sheet',
  host: {
    '[@parentAnimation]': '',
    '(@parentAnimation.done)': 'animationDone()',
  },
})
export class NgbSheetContainer extends BaseDialog implements OnDestroy {
  myDialog = viewChild('myDialog', { read: ViewContainerRef });
  readonly dir = injectDirectionality();
  backdropColor = true;
  options!: SheetOptions;
  classNames = '';
  isHideHeader = false;
  readonly position = computed(() => {
    return {
      params: {
        outTransform: this.dir.isRtl() ? 'translate3d(-100%, 0, 0)' : 'translate3d(100%, 0, 0)',
      },
    };
  });

  constructor() {
    super();
    afterNextRender(() => {
      this._afterViewSource.next(this.myDialog()!);
      // this.position.set('center');
    });
    const ref = inject(DialogRef);
    ref.afterClosed.subscribe(() => {
      console.log('afterClosed', this.options.position);
      // this.position.set(this.options.position as 'left' | 'right' | 'center');
      // this.position.set({
      //   params: {
      //     outTransform: this.dir.isRtl() ? 'translate3d(-100%, 0, 0)' : 'translate3d(100%, 0, 0)',
      //   },
      // });
    });
  }

  override setOptions(options: SheetOptions): void {
    this.options = options;
    this.classNames = this.options.classNames?.join(' ') || '';
    this.isHideHeader = this.options.header || false;
    this.backdropColor = this.options.backdropColor || true;
    // this.position.set(this.options.position as 'left' | 'right' | 'center');
  }

  ngOnDestroy(): void {
    // this.position.set(this.options.position as 'left' | 'right' | 'center');
  }
}

export function aliasSheet(dialog: typeof NgbSheetContainer) {
  return { provide: NgbSheetContainer, useExisting: dialog };
}
