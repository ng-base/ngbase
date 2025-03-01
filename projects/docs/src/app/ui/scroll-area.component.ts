import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RangePipe } from '@ngbase/adk/utils';
import { List } from '@meeui/ui/list';
import { ScrollArea } from '@meeui/ui/scroll-area';
import { Heading } from '@meeui/ui/typography';

@Component({
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
export default class ScrollAreaComponent {}
