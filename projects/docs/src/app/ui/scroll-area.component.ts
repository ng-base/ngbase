import { Component } from '@angular/core';
import { Heading } from '@meeui/typography';
import { FormsModule } from '@angular/forms';
import { ScrollArea } from '@meeui/scroll-area';
import { List } from '@meeui/list';
import { RangePipe } from '@meeui/utils';

@Component({
  standalone: true,
  selector: 'app-scroll-area',
  imports: [FormsModule, Heading, ScrollArea, List, RangePipe],
  template: `
    <h4 meeHeader class="mb-5" id="scrollAreaPage">Scroll Area</h4>
    <mee-scroll-area class="max-h-40 rounded-md border">
      @for (item of 10 | range; track item) {
        <button meeList>List 1</button>
      }
    </mee-scroll-area>
  `,
})
export class ScrollAreaComponent {}
