import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Heading } from '@meeui/ui/typography';
import { ChatService } from './chat.service';
import { Card } from '@meeui/ui/card';
import { Separator } from '@meeui/ui/separator';

@Component({
  selector: 'app-chat',
  imports: [Heading, Card, Separator],
  providers: [ChatService],
  template: `
    <h4 meeHeader class="mb-5">Chat</h4>
    <div class="flex w-full gap-2">
      <mee-card class="w-96"> </mee-card>
      <mee-card class="flex-1">
        @for (chat of chatService.data; track chat.id) {
          <div class="flex gap-2 py-4" [class]="chat.type == 'sent' ? 'bg-foreground' : ''">
            <div class="items center flex">
              {{ chat.message }}
            </div>
          </div>
          <mee-separator />
        }
      </mee-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  chatService = inject(ChatService);

  constructor() {}
}
