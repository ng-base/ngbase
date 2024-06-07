import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Heading } from '@meeui/typography';
import { ChatService } from './chat.service';
import { Card } from '@meeui/card';
import { Separator } from '@meeui/separator';

@Component({
  standalone: true,
  selector: 'app-chat',
  imports: [Heading, Card, Separator],
  providers: [ChatService],
  template: `
    <h4 meeHeader class="mb-5">Chat</h4>
    <div class="flex w-full gap-2">
      <mee-card class="w-96"> </mee-card>
      <mee-card class="flex-1">
        @for (chat of chatService.data; track chat.id) {
          <div
            class="flex gap-2 py-4"
            [class]="chat.type == 'sent' ? 'bg-background' : ''"
          >
            <div class="items center flex">
              {{ chat.message }}
            </div>
          </div>
          <mee-separator></mee-separator>
        }
      </mee-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {
  chatService = inject(ChatService);

  constructor() {}

  ngOnInit() {}
}
