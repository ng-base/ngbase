import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '@meeui/button';
import { Card } from '@meeui/card';
import { Icon } from '@meeui/icon';
import { Key } from '@meeui/keys';
import { List } from '@meeui/list';
import { Menu, MenuTrigger, NavigationMenu } from '@meeui/menu';
import { ScrollArea } from '@meeui/scroll-area';
import { Option } from '@meeui/select';
import { Selectable, SelectableItem } from '@meeui/selectable';
import { Separator } from '@meeui/separator';
import { Heading } from '@meeui/typography';
import { RangePipe } from '@meeui/utils';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCirclePlay,
  lucideLayoutGrid,
  lucideRadio,
  lucideListMusic,
  lucideMusic2,
  lucideUser,
  lucideMic,
  lucideLibrary,
} from '@ng-icons/lucide';

@Component({
  standalone: true,
  selector: 'app-music',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Card,
    Heading,
    Button,
    NavigationMenu,
    Menu,
    MenuTrigger,
    List,
    Separator,
    Option,
    Icon,
    Selectable,
    SelectableItem,
    ScrollArea,
    RangePipe,
    Key,
  ],
  viewProviders: [
    provideIcons({
      lucideCirclePlay,
      lucideLayoutGrid,
      lucideRadio,
      lucideListMusic,
      lucideMusic2,
      lucideUser,
      lucideMic,
      lucideLibrary,
    }),
  ],
  template: `
    <mee-card class="!p-0">
      <div class="flex gap-b2 px-b4 py-b" meeNavigationMenu>
        <button meeButton variant="ghost" class="small !font-bold" [meeMenuTrigger]="music">
          Music
        </button>
        <button meeButton variant="ghost" class="small" [meeMenuTrigger]="file">File</button>
        <button meeButton variant="ghost" class="small" [meeMenuTrigger]="edit">Edit</button>
        <button meeButton variant="ghost" class="small" [meeMenuTrigger]="view">View</button>
        <button meeButton variant="ghost" class="small" [meeMenuTrigger]="account">Account</button>
      </div>
      <mee-menu #music>
        <button meeOption>About Music</button>
        <button meeOption>Preferences <mee-key>⇧⌘P</mee-key></button>
        <button meeOption>Hide Music</button>
        <button meeOption>Hide Others</button>
      </mee-menu>

      <mee-menu #file>
        <button meeOption>New</button>
        <button meeOption>Open Stream URL <mee-key>⇧⌘P</mee-key></button>
        <button meeOption>Close Window</button>
        <button meeOption>LibraryImport</button>
        <button meeOption>Burn Playlist to Disc</button>
        <button meeOption>Show in Finder <mee-key>⇧⌘P</mee-key></button>
        <mee-separator class="my-b" />
        <button meeOption>Convert</button>
        <button meeOption>Page Setup <mee-key>⇧⌘P</mee-key></button>
        <button meeOption>Print</button>
      </mee-menu>

      <mee-menu #edit>
        <button meeOption>Undo</button>
        <button meeOption>Redo</button>
        <mee-separator class="my-b" />
        <button meeOption>Cut</button>
        <button meeOption>Copy</button>
        <button meeOption>Paste</button>
        <button meeOption>Select All</button>
        <button meeOption>Deselect All</button>
        <mee-separator class="my-b" />
        <button meeOption>Smart Dictation...</button>
        <button meeOption>Emoji & Symbols</button>
      </mee-menu>

      <mee-menu #view>
        <button meeOption>Show Playing Next</button>
        <button meeOption>Show Lyrics</button>
        <button meeOption>Show Status Bar</button>
        <mee-separator class="my-b" />
        <button meeOption>Hide Sidebar</button>
        <button meeOption>Enter Full Screen</button>
      </mee-menu>

      <mee-menu #account>
        <button meeOption>Switch Account</button>
        <mee-separator class="my-b" />
        <button meeOption>Andy</button>
        <button meeOption>Benoit</button>
        <button meeOption>Luis</button>
        <mee-separator class="my-b" />
        <button meeOption>Manage Family...</button>
        <button meeOption>Add Account...</button>
      </mee-menu>

      <mee-separator />
      <div class="flex">
        <div class="w-52 flex-none p-b4">
          <h4 meeHeader="sm" class="mb-b2 mt-5 pl-b2">Discover</h4>
          <div class="py-2">
            <button meeList class="bg-muted-background font-medium">
              <mee-icon name="lucideCirclePlay" />Listen Now
            </button>
            <button meeList class="font-medium"><mee-icon name="lucideLayoutGrid" /> Browse</button>
            <button meeList class="font-medium"><mee-icon name="lucideRadio" /> Radio</button>
          </div>

          <h4 meeHeader="sm" class="mb-b2 mt-5 pl-b2">Library</h4>
          <div class="py-2">
            <button meeList class="font-medium"><mee-icon name="lucideListMusic" />Playlist</button>
            <button meeList class="font-medium"><mee-icon name="lucideMusic2" /> Songs</button>
            <button meeList class="font-medium"><mee-icon name="lucideUser" /> Made for You</button>
            <button meeList class="font-medium"><mee-icon name="lucideMic" /> Artists</button>
            <button meeList class="font-medium"><mee-icon name="lucideLibrary" /> Albums</button>
          </div>
        </div>
        <mee-separator orientation="vertical" />
        <div class="flex-1 overflow-hidden p-b4">
          <div class="flex justify-between">
            <mee-selectable [activeIndex]="0">
              <mee-selectable-item [value]="0">Music</mee-selectable-item>
              <mee-selectable-item [value]="1">Podcast</mee-selectable-item>
              <mee-selectable-item [value]="2">Live</mee-selectable-item>
            </mee-selectable>
            <button meeButton>Add Music</button>
          </div>

          <h4 meeHeader="sm" class="mt-5">Listen Now</h4>
          <p class=" text-muted-foreground">Top picks for you. Updated daily.</p>
          <mee-separator class="my-b4" />

          <mee-scroll-area>
            <div class="flex gap-2">
              @for (item of 10 | range; track item) {
                <div class="">
                  <mee-card
                    class="grid h-80 w-60 flex-none place-items-center bg-contain"
                    [style.backgroundImage]="'url(/music1.webp)'"
                    meeHeader="sm"
                  >
                    {{ item }}
                  </mee-card>
                  <h4 meeHeader class="mt-b2">React Rendezvous</h4>
                  <p class=" text-muted-foreground">Ethan Byte</p>
                </div>
              }
            </div>
          </mee-scroll-area>

          <h4 meeHeader="sm" class="mt-8">Made for You</h4>
          <p class=" text-muted-foreground">Your personal playlists. Updated daily.</p>
          <mee-separator class="my-b4" />

          <mee-scroll-area>
            <div class="flex gap-2">
              @for (item of 10 | range; track item) {
                <div class="">
                  <mee-card
                    class="grid h-40 w-40 flex-none place-items-center"
                    [style.backgroundImage]="'url(/music1.webp)'"
                    meeHeader="sm"
                  >
                  </mee-card>
                  <h4 meeHeader class="mt-b2">React Rendezvous</h4>
                  <p class=" text-muted-foreground">Ethan Byte</p>
                </div>
              }
            </div>
          </mee-scroll-area>
        </div>
      </div>
    </mee-card>
  `,
})
export class MusicComponent {}
// 'Switch AccountAndyBenoitLuisManage Family...Add Account...'
