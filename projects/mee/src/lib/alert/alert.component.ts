import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button, ButtonVariant } from '../button';
import { DialogRef } from '../portal';
import { Heading } from '../typography';

export interface AlertOptions {
  title: string;
  description: string;
  actions: {
    text: string;
    type?: ButtonVariant;
    handler: (fn: VoidFunction) => any;
  }[];
}

@Component({
  standalone: true,
  selector: 'mee-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Heading],
  template: `
    <h4 class="mb-b2 text-base font-bold">{{ options.data?.title }}</h4>
    <p class="text-muted-foreground pb-b3">{{ options.data?.description }}</p>
    <div class="flex justify-end gap-4 pt-1">
      @for (action of options.data?.actions; track action) {
        <button
          meeButton
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

  options = this.diaRef.options;
}
