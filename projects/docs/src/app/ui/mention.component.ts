import { Component, computed, signal } from '@angular/core';
import { Menu, MentionTrigger } from '@meeui/menu';
import { Input } from '@meeui/input';
import { Option } from '@meeui/select';
import { FormsModule } from '@angular/forms';
import { RangePipe } from '@meeui/utils';
import { Heading } from '@meeui/typography';
import { DocCode } from './code.component';

@Component({
  standalone: true,
  selector: 'app-placeholder',
  imports: [FormsModule, Heading, MentionTrigger, Input, Menu, Option, RangePipe, DocCode],
  template: `
    <h4 meeHeader class="mb-5" id="mentionPage">Mention</h4>
    <app-doc-code [tsCode]="code">
      <textarea
        class="min-h-24 w-96"
        placeholder="Enter @ to show mentions"
        meeInput
        [(ngModel)]="value"
        [meeMentionTrigger]="myMenu"
        (search)="search.set($event)"
        key="@"
      ></textarea>
      <mee-menu #myMenu>
        @for (item of filteredItems(); track item) {
          <div meeOption [value]="'Item ' + item" (selectedChange)="selected(item)">
            Item {{ item }}
          </div>
        }
      </mee-menu>
    </app-doc-code>
  `,
})
export class MentionComponent {
  value = signal('');
  search = signal('');
  items = signal(['Item 1', 'Item 2', 'Item 3']);
  filteredItems = computed(() => {
    const items = this.items();
    const search = this.search().toLowerCase();
    return search ? items.filter(item => item.toLowerCase().includes(search)) : items;
  });

  selected(ev: string) {
    console.log(ev);
    this.value.update(v => v + ev);
  }

  code = `
  import { Component } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { Menu, MentionTrigger } from '@meeui/menu';
  import { Input } from '@meeui/input';
  import { Option } from '@meeui/select';

  @Component({
    standalone: true,
    selector: 'app-root',
    imports: [FormsModule, MentionTrigger, Input, Menu, Option],
    template: \`
      <textarea
        class="w-full"
        placeholder="Enter @ to show mentions"
        meeInput
        [(ngModel)]="value"
        [meeMentionTrigger]="myMenu"
        (search)="search.set($event)"
        key="@"
      ></textarea>

      <mee-menu #myMenu (selected)="selected($event)">
        @for (item of filteredItems(); track item) {
          <div meeOption [value]="'Item ' + item">Item {{ item }}</div>
        }
      </mee-menu>
    \`
  })
  export class AppComponent {
    value = signal('');
    search = signal('');
    items = signal(['Item 1', 'Item 2', 'Item 3']);

    filteredItems = computed(() => {
      const items = this.items();
      const search = this.search().toLowerCase();
      return search ? items.filter(item => item.toLowerCase().includes(search)) : items;
    });

    selected(ev: any) {
      this.value.update(v => v + ev);
    }
  }
  `;
}
