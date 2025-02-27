import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbSonner, ngbSonnerPortal, sonnerAnimation, SonnerBase } from '@ngbase/adk/sonner';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCircleAlert,
  lucideCircleCheck,
  lucideInfo,
  lucideTriangleAlert,
} from '@ng-icons/lucide';

@Component({
  selector: 'mee-sonner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({ lucideCircleCheck, lucideInfo, lucideTriangleAlert, lucideCircleAlert }),
  ],
  imports: [Icon, SonnerBase],
  template: `
    <ul class="fixed bottom-0 right-0 flex flex-col gap-1">
      @for (msg of messages(); track msg.id) {
        <li
          [ngbSonnerBase]="$index"
          class="{{
            'm-4 w-96 rounded-lg border bg-foreground p-4 shadow-lg transition-all duration-300' +
              (msg.type === 'success' ? ' bg-green-50 text-green-600' : '') +
              (msg.type === 'error' ? ' bg-red-50 text-red-600' : '') +
              (msg.type === 'warning' ? ' bg-yellow-50 text-yellow-600' : '')
          }}"
        >
          <h4 class="flex items-center gap-2 font-semibold">
            @if (msg.type && icons[msg.type]; as iconName) {
              <mee-icon [name]="iconName" />
            }
            {{ msg.message }}
          </h4>
          @if (msg.data?.description) {
            <p class="text-muted">{{ msg.data?.description }}</p>
          }
        </li>
      }
    </ul>
  `,
  animations: [sonnerAnimation],
})
export class Sonner extends NgbSonner {
  readonly icons = {
    success: 'lucideCircleCheck',
    error: 'lucideCircleAlert',
    info: 'lucideInfo',
    warning: 'lucideTriangleAlert',
    default: '',
  };
}

export function sonnerPortal() {
  const portal = ngbSonnerPortal(Sonner);
  return portal;
}
