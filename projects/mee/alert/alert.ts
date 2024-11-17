import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button, ButtonVariant } from '@meeui/ui/button';
import { DialogRef } from '@meeui/ui/portal';

export interface AlertOptions {
  title?: string;
  description?: string;
  actions?: {
    text: string;
    type?: ButtonVariant;
    handler: (fn: VoidFunction) => any;
  }[];
}

@Component({
  selector: 'mee-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  template: `
    <h4 class="mb-b2 text-base font-bold">{{ data?.title }}</h4>
    <p class="text-muted-foreground pb-b3">{{ data?.description }}</p>
    <div class="flex justify-end gap-4 pt-1">
      @for (action of data?.actions; track action) {
        <button
          meeButton
          type="button"
          [variant]="action.type || 'primary'"
          (click)="action.handler(diaRef.close)"
        >
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
