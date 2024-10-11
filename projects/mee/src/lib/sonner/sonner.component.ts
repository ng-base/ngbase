import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { generateId } from '../utils';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Icon } from '../icon';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCircleAlert,
  lucideCircleCheck,
  lucideInfo,
  lucideTriangleAlert,
} from '@ng-icons/lucide';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'mee-sonner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, NgClass],
  providers: [
    provideIcons({
      lucideCircleCheck,
      lucideInfo,
      lucideTriangleAlert,
      lucideCircleAlert,
    }),
  ],
  template: `
    @if (messages().length) {
      <ul class="fixed bottom-0 right-0 m-4 flex w-96 flex-col gap-2">
        @for (msg of messages(); track msg.id) {
          <li
            class="absolute flex w-full flex-col gap-b rounded-base border bg-foreground p-4 shadow-lg transition-all duration-300"
            [ngClass]="{
              'bg-green-50 text-green-600': msg.type === 'success',
              'bg-red-50 text-red-600': msg.type === 'error',
              'bg-yellow-50 text-yellow-600': msg.type === 'warning',
            }"
            [style]="{
              'z-index': -$index,
              bottom: 16 * $index + 'px',
              transform: 'scale(' + (1 - $index * 0.08) + ')',
              visibility: $index < 3 ? 'visible' : 'hidden',
              opacity: $index < 3 ? 1 : 0,
            }"
            [@slideInOutAnimation]
          >
            <h4 class="flex items-center gap-b2 font-semibold">
              @if (msg.type !== 'default') {
                <mee-icon
                  [name]="
                    msg.type === 'success'
                      ? 'lucideCircleCheck'
                      : msg.type === 'error'
                        ? 'lucideCircleAlert'
                        : msg.type === 'info'
                          ? 'lucideInfo'
                          : msg.type === 'warning'
                            ? 'lucideTriangleAlert'
                            : ''
                  "
                />
              }
              {{ msg.message }}
            </h4>
            @if (msg.data?.description) {
              <p class="text-muted">{{ msg.data?.description }}</p>
            }
          </li>
        }
      </ul>
    }
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
export class Sonner {
  messages = signal<SonnerMessage[]>([]);

  addMessage(message: string, type: SonnerType, data?: SonnerData) {
    const id = generateId();
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
