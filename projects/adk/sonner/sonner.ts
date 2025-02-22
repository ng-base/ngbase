import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Directive, input, signal } from '@angular/core';
import { uniqueId } from '@ngbase/adk/utils';

@Directive({
  selector: '[ngbSonnerBase]',
  exportAs: 'ngbSonnerBase',
  host: {
    style: `position: absolute; right: 0; display: flex; flex-direction: column;`,
    '[style]': `{
      'z-index': -ngbSonnerBase(),
      bottom: 16 * ngbSonnerBase() + 'px',
      visibility: ngbSonnerBase() < 3 ? 'visible' : 'hidden',
      transform: 'scale(' + (1 - ngbSonnerBase() * 0.08) + ')',
      opacity: ngbSonnerBase() < 3 ? 1 : 0,
    }`,
    '[@slideInOutAnimation]': '',
  },
})
export class SonnerBase {
  readonly ngbSonnerBase = input.required<number>();
}

@Component({
  selector: 'ngb-sonner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SonnerBase],
  template: `
    <ul class="fixed bottom-0 right-0 flex flex-col gap-2">
      @for (msg of messages(); track msg.id) {
        <li
          [ngbSonnerBase]="$index"
          class="{{
            'm-4 w-96 gap-1 rounded-lg border bg-foreground p-4 shadow-lg transition-all duration-300' +
              (msg.type === 'success' ? ' bg-green-50 text-green-600' : '') +
              (msg.type === 'error' ? ' bg-red-50 text-red-600' : '') +
              (msg.type === 'warning' ? ' bg-yellow-50 text-yellow-600' : '')
          }}"
        >
          <h4 class="flex items-center gap-2 font-semibold">{{ msg.message }}</h4>
          @if (msg.data?.description) {
            <p class="text-muted">{{ msg.data?.description }}</p>
          }
        </li>
      }
    </ul>
  `,
  animations: [
    trigger('slideInOutAnimation', [
      state('1', style({ transform: 'none', opacity: 1 })),
      state('void', style({ transform: 'translateY(100%)', opacity: 0 })),
      state('0', style({ transform: 'translateY(100%)', opacity: 0 })),
      transition('* => *', animate('300ms ease-out')),
    ]),
  ],
})
export class NgbSonner {
  readonly messages = signal<SonnerMessage[]>([]);

  addMessage(message: string, type: SonnerType, data?: SonnerData) {
    const id = uniqueId();
    const { timeout = 3000 } = data ?? {};

    // push the new message to the top of the list
    // so that it will be displayed first
    // also the index is less than 3, the message will be visible
    this.messages.update(x => [{ id, message, data, type }, ...x]);

    if (timeout === 0) return;
    setTimeout(() => {
      this.messages.update(x => x.filter(msg => msg.id !== id));
    }, timeout);
  }

  clear() {
    this.messages.set([]);
  }
}

export interface SonnerMessage {
  message: string;
  data?: SonnerData;
  type?: SonnerType;
  id?: string;
}

export type SonnerType = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface SonnerData {
  description?: string;
  timeout?: number;
}
