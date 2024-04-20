import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { generateId } from '../../../utils';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'mee-sonner',
  standalone: true,
  imports: [],
  template: `
    @if (messages().length) {
      <ul class="fixed bottom-0 right-0 m-4 flex w-96 flex-col gap-2">
        @for (msg of messages(); track msg.id) {
          <li
            class="absolute w-full rounded-md border bg-white p-4 shadow-md transition-all"
            [style]="{
              'z-index': -$index,
              bottom: 16 * $index + 'px',
              transform: 'scale(' + (1 - $index * 0.08) + ')',
              visibility: $index < 3 ? 'visible' : 'hidden'
            }"
            [@slideInOutAnimation]
          >
            <h4 class="font-semibold">{{ msg.name }}</h4>
            <p class="text-muted">{{ msg.message }}</p>
          </li>
        }
      </ul>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  addMessage(data: SonnerMessage) {
    data.id = generateId();
    const { id, timeout = 3000 } = data;

    // push the new message to the top of the list
    // so that it will be displayed first
    // also the index is less than 3, the message will be visible
    this.messages.update((x) => [data, ...x]);

    if (timeout === 0) return;
    setTimeout(() => {
      this.messages.update((x) => x.filter((msg) => msg.id !== id));
    }, timeout);
  }

  clear() {
    this.messages.set([]);
  }
}

export interface SonnerMessage {
  name: string;
  message: string;
  id?: string;
  timeout?: number;
}
