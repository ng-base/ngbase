import { Component, computed, signal } from '@angular/core';
import { MentionTrigger } from '@meeui/menu';
import { Input } from '@meeui/input';
import { Menu } from '@meeui/menu';
import { Option } from '@meeui/select';
import { FormsModule } from '@angular/forms';
import { RangePipe } from '@meeui/utils';
import { Heading } from '@meeui/typography';

@Component({
  standalone: true,
  selector: 'app-placeholder',
  imports: [
    FormsModule,
    Heading,
    MentionTrigger,
    Input,
    Menu,
    Option,
    RangePipe,
  ],
  template: `
    <h4 meeHeader class="mb-5" id="mentionPage">Mention</h4>
    <textarea
      meeInput
      [meeMentionTrigger]="myMenu"
      (search)="search.set($event)"
      class="w-full"
      key="@"
      [(ngModel)]="value"
      placeholder="Enter @ to show mentions"
    ></textarea>
    <mee-menu #myMenu (selected)="selected($event)">
      @for (item of filteredItems(); track item) {
        <div meeOption [value]="'Item ' + item">Item {{ item }}</div>
      }
    </mee-menu>
  `,
})
export class MentionComponent {
  value = signal('');
  search = signal('');
  items = signal(['Item 1', 'Item 2', 'Item 3']);
  filteredItems = computed(() => {
    const items = this.items();
    const search = (this.search() || '').toLowerCase();
    return search
      ? items.filter((item) => item.toLowerCase().includes(search))
      : items;
  });

  selected(ev: any) {
    this.value.update((v) => v + ev);
  }
}
