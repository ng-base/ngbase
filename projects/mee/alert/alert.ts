import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogInput, DialogOptions, DialogRef } from '@ngbase/adk/portal';
import { Button, ButtonVariant } from '@meeui/ui/button';
import { dialogPortal } from '@meeui/ui/dialog';

export interface AlertOptions {
  title?: string;
  description?: string;
  actions?: {
    text: string;
    type?: ButtonVariant;
    handler: (fn: VoidFunction) => any;
  }[];
}

export function alertPortal() {
  const base = dialogPortal();

  function open<T>(opt: AlertOptions, comp?: DialogInput<T>) {
    const options: DialogOptions = {
      ...new DialogOptions(),
      data: opt,
      title: opt.title,
      width: '32rem',
      maxWidth: '95vw',
      disableClose: true,
      header: true,
      focusTrap: true,
    };

    const diaRef = base.open(comp || Alert, options);

    return diaRef;
  }

  function closeAll() {
    base.closeAll();
  }
  return { open, closeAll };
}

@Component({
  selector: 'mee-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  template: `
    <h4 class="mb-2 text-base font-bold">{{ data?.title }}</h4>
    <p class="text-muted-foreground pb-3">{{ data?.description }}</p>
    <div class="flex justify-end gap-4 pt-1">
      @for (action of data?.actions; track action) {
        <button [meeButton]="action.type || 'primary'" (click)="action.handler(diaRef.close)">
          {{ action.text }}
        </button>
      }
    </div>
  `,
})
export class Alert {
  diaRef = inject<DialogRef<AlertOptions>>(DialogRef);

  data = this.diaRef.options?.data;
}
