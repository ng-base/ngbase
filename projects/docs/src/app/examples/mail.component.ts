import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Avatar } from '@meeui/avatar';
import { Badge } from '@meeui/badge';
import { Button } from '@meeui/button';
import { Card } from '@meeui/card';
import { Icon } from '@meeui/icon';
import { Input } from '@meeui/input';
import { List } from '@meeui/list';
import { MentionTrigger, Menu, MenuTrigger } from '@meeui/menu';
import { Resizable, ResizableGroup } from '@meeui/resizable';
import { ScrollArea } from '@meeui/scroll-area';
import { Select, Option } from '@meeui/select';
import { Selectable, SelectableItem } from '@meeui/selectable';
import { Separator } from '@meeui/separator';
import { Switch } from '@meeui/switch';
import { Tooltip } from '@meeui/tooltip';
import { Heading } from '@meeui/typography';
import { RangePipe } from '@meeui/utils';
import { provideIcons } from '@ng-icons/core';
import {
  lucideInbox,
  lucideStickyNote,
  lucideSend,
  lucideArchiveX,
  lucideTrash2,
  lucideArchive,
  lucideUsers,
  lucideInfo,
  lucideMessageSquare,
  lucideShoppingCart,
  lucideClock,
  lucideReply,
  lucideReplyAll,
  lucideForward,
  lucideSquareDot,
} from '@ng-icons/lucide';

@Component({
  standalone: true,
  selector: 'app-mail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    Card,
    Heading,
    Select,
    Option,
    ResizableGroup,
    Resizable,
    Selectable,
    SelectableItem,
    List,
    Separator,
    Input,
    ScrollArea,
    Badge,
    RangePipe,
    Icon,
    Button,
    Tooltip,
    Avatar,
    Switch,
    Menu,
    MenuTrigger,
  ],
  viewProviders: [
    provideIcons({
      lucideInbox,
      lucideStickyNote,
      lucideSend,
      lucideArchiveX,
      lucideTrash2,
      lucideArchive,
      lucideUsers,
      lucideInfo,
      lucideMessageSquare,
      lucideShoppingCart,
      lucideClock,
      lucideReply,
      lucideReplyAll,
      lucideForward,
      lucideSquareDot,
    }),
  ],
  template: `
    <mee-card class="flex max-h-[700px] overflow-hidden !p-0">
      <mee-resizable-group>
        <mee-resizable [size]="20">
          <div class="px-2 py-2">
            <mee-select placeholder="Select" [(ngModel)]="account">
              @for (account of accounts; track account) {
                <mee-option [value]="account">{{ account.email }}</mee-option>
              }
            </mee-select>
          </div>
          <mee-separator />
          <div class="p-2">
            <button meeList meeHeader class="bg-muted-background">
              <mee-icon name="lucideInbox" /> Inbox
            </button>
            <button meeList meeHeader><mee-icon name="lucideStickyNote" /> Draft</button>
            <button meeList meeHeader><mee-icon name="lucideSend" /> Sent</button>
            <button meeList meeHeader><mee-icon name="lucideArchiveX" /> Junk</button>
            <button meeList meeHeader><mee-icon name="lucideTrash2" /> Trash</button>
            <button meeList meeHeader><mee-icon name="lucideArchive" /> Archive</button>
          </div>

          <mee-separator />
          <div class="p-2">
            <button meeList meeHeader><mee-icon name="lucideUsers" /> Social</button>
            <button meeList meeHeader><mee-icon name="lucideInfo" /> Updates</button>
            <button meeList meeHeader><mee-icon name="lucideMessageSquare" /> Forums</button>
            <button meeList meeHeader><mee-icon name="lucideShoppingCart" /> Shopping</button>
            <button meeList meeHeader><mee-icon name="lucideArchive" /> Promotions</button>
          </div>
        </mee-resizable>
        <mee-resizable [size]="40" class="flex flex-col">
          <div class="my-b2 flex items-center justify-between px-b4">
            <h4 meeHeader="sm" class="text-xl">Inbox</h4>
            <mee-selectable [(activeIndex)]="type">
              <mee-selectable-item [value]="0" class="whitespace-nowrap">
                All mail
              </mee-selectable-item>
              <mee-selectable-item [value]="1">Unread</mee-selectable-item>
            </mee-selectable>
          </div>
          <mee-separator />

          <div class="flex flex-1 flex-col overflow-hidden">
            <div class="p-b4"><input meeInput placeholder="Search mail" class="w-full" /></div>

            <mee-scroll-area class="flex flex-1 flex-col gap-b4 px-b4 pb-b4">
              @for (mail of filteredMails(); track $index) {
                <button
                  meeCard
                  class="hover:bg-muted-background"
                  (click)="select(mail)"
                  [class.bg-muted-background]="selected() === mail"
                >
                  <div class="flex justify-between">
                    <h4 meeHeader class="!font-semibold">
                      {{ mail.name }}
                      @if (mail.status === 'unread') {
                        <mee-badge class="!ml-2">New</mee-badge>
                      }
                    </h4>
                    <span class="text-muted-foreground text-xs">7 months ago</span>
                  </div>
                  <h4 class="text-xs">{{ mail.subject }}</h4>
                  <p class="text-muted-foreground my-b2 line-clamp-2 text-xs">
                    {{ mail.content }}
                  </p>
                  <div class="flex gap-b2">
                    @for (tag of mail.tags; track tag) {
                      <mee-badge>{{ tag }}</mee-badge>
                    }
                  </div>
                </button>
              }
            </mee-scroll-area>
          </div>
        </mee-resizable>
        <mee-resizable [size]="40" class="flex flex-col">
          <div class="flex justify-between">
            <div class="flex gap-b2 px-b3 py-b2.5">
              <button meeButton variant="ghost" class="h-9 w-9 flex-none !p-0" meeTooltip="Archive">
                <mee-icon name="lucideArchive" />
              </button>
              <button
                meeButton
                variant="ghost"
                class="h-9 w-9 flex-none !p-0"
                meeTooltip="Move to junk"
              >
                <mee-icon name="lucideArchiveX" />
              </button>
              <button
                meeButton
                variant="ghost"
                class="h-9 w-9 flex-none !p-0"
                meeTooltip="Move to trash"
              >
                <mee-icon name="lucideTrash2" />
              </button>
              <mee-separator orientation="vertical" />
              <button meeButton variant="ghost" class="h-9 w-9 flex-none !p-0" meeTooltip="Snooze">
                <mee-icon name="lucideClock" />
              </button>
            </div>
            <div class="flex gap-2 px-3 py-2">
              <button meeButton variant="ghost" class="h-9 w-9 flex-none !p-0" meeTooltip="Reply">
                <mee-icon name="lucideReply" />
              </button>
              <button
                meeButton
                variant="ghost"
                class="h-9 w-9 flex-none !p-0"
                meeTooltip="Reply All"
              >
                <mee-icon name="lucideReplyAll" />
              </button>
              <button meeButton variant="ghost" class="h-9 w-9 flex-none !p-0" meeTooltip="Forward">
                <mee-icon name="lucideForward" />
              </button>
              <mee-separator orientation="vertical" />
              <button
                meeButton
                variant="ghost"
                class="h-9 w-9 flex-none !p-0"
                [meeMenuTrigger]="mailOptions"
              >
                <mee-icon name="lucideSquareDot" />
              </button>

              <mee-menu #mailOptions>
                <button meeOption>Mark as read</button>
                <button meeOption>Star thread</button>
                <button meeOption>Add label</button>
                <button meeOption>Mute thread</button>
              </mee-menu>
            </div>
          </div>
          <mee-separator />
          <div>
            <div class="flex gap-b4 p-b4">
              <div>
                <mee-avatar name="William Smith" />
              </div>
              <div>
                <h4 meeHeader>{{ selected().name }}</h4>
                <h4 class="text-xs">{{ selected().subject }}</h4>
                <h4 class="text-xs">Reply-To: {{ selected().email }}</h4>
              </div>
              <div>
                <p class="text-muted-foreground text-xs">Oct 22, 2023, 9:00:00 AM</p>
              </div>
            </div>
          </div>

          <mee-separator />
          <div class="flex-1 whitespace-pre-wrap p-b4">
            {{ selected().content }}
          </div>
          <mee-separator />
          <div class="p-b4">
            <textarea
              meeInput
              class="min-h-20 w-full"
              [placeholder]="'Reply ' + selected().name"
            ></textarea>
            <div class="flex justify-between pt-b4">
              <mee-switch class="text-sm">Mute this thread</mee-switch>
              <button meeButton variant="primary">Send</button>
            </div>
          </div>
        </mee-resizable>
      </mee-resizable-group>
    </mee-card>
  `,
})
export class MailComponent {
  accounts = [
    { name: 'Alicia Koch', email: 'alicia@example.com' },
    { name: 'Alicia Koch', email: 'alicia@gmail.com' },
    { name: 'Alicia Koch', email: 'alicia@me.com' },
  ];

  account = signal(this.accounts[0]);
  type = signal(0);

  mails = Array.from({ length: 10 }, (_, i) => ({
    name: `William Smith ${i}`,
    status: i % 2 ? 'unread' : 'read',
    subject: `Meeting Tomorrow ${i}`,
    email: 'williamsmith@exampl.com',
    date: '7 months ago',
    tags: ['meeting', 'work', 'important'],
    content: `Hi,let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's crucial that we align on our next steps to ensure the project's success.

Please come prepared with any questions or insights you may have. Looking forward to our meeting!

Best regards, William`,
  }));

  filteredMails = computed(() => {
    const type = this.type();
    return this.mails.filter(mail => {
      return type === 0 || (type === 1 && mail.status === 'unread');
    });
  });

  selected = signal(this.mails[0]);

  select(mail: any) {
    this.selected.set(mail);
  }
}
