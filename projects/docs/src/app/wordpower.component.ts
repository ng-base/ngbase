import { Component } from '@angular/core';
import { RangePipe } from '@meeui/adk/utils';

const TRIPLE_WORD_SCORE = {
  '1,1': 1,
  '1,8': 1,
  '1,15': 1,
  '8,1': 1,
  '8,15': 1,
  '15,1': 1,
  '15,8': 1,
  '15,15': 1,
};
const DOUBLE_LETTER_SCORE = {
  '1,4': 2,
  '1,12': 2,
  '3,7': 2,
  '3,9': 2,
  '4,1': 2,
  '4,8': 2,
  '4,15': 2,
  '7,3': 2,
  '7,7': 2,
  '7,9': 2,
  '7,13': 2,
  '8,4': 2,
  '8,12': 2,
  '9,3': 2,
  '9,7': 2,
  '9,9': 2,
  '9,13': 2,
  '12,1': 2,
  '12,8': 2,
  '12,15': 2,
  '13,7': 2,
  '13,9': 2,
  '15,4': 2,
  '15,12': 2,
};
const TRIPLE_LETTER_SCORE = {
  '2,6': 3,
  '2,10': 3,
  '6,2': 3,
  '6,6': 3,
  '6,10': 3,
  '6,14': 3,
  '10,2': 3,
  '10,6': 3,
  '10,10': 3,
  '10,14': 3,
  '14,6': 3,
  '14,10': 3,
};
const DOUBLE_WORD_SCORE = {
  '2,2': 4,
  '3,3': 4,
  '4,4': 4,
  '5,5': 4,
  '11,11': 4,
  '12,12': 4,
  '13,13': 4,
  '14,14': 4,
  '2,14': 4,
  '3,13': 4,
  '4,12': 4,
  '5,11': 4,
  '11,5': 4,
  '12,4': 4,
  '13,3': 4,
  '14,2': 4,
};

@Component({
  standalone: true,
  selector: 'app-word-power',
  imports: [RangePipe],
  template: `
    <div class="flex flex-col gap-2">
      @for (row of 15 | range; track row) {
        <div class="flex gap-2">
          @for (col of 15 | range; track col) {
            <div
              class="grid aspect-square w-36 place-items-center rounded border p-2 text-center"
              [class.bg-red-400]="powers.get(row + ',' + col) === 1"
              [class.bg-blue-300]="powers.get(row + ',' + col) === 2"
              [class.bg-blue-600]="powers.get(row + ',' + col) === 3"
              [class.bg-red-200]="powers.get(row + ',' + col) === 4"
            >
              @switch (powers.get(row + ',' + col)) {
                @case (1) {
                  <span class="text-sm">Triple Word Score</span>
                }
                @case (2) {
                  <span class="text-sm">Double Letter Score</span>
                }
                @case (3) {
                  <span class="text-sm">Triple Letter Score</span>
                }
                @case (4) {
                  <span class="text-sm">Double Word Score</span>
                }
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  host: {
    class: 'block p-2',
  },
})
export class WordPowerComponent {
  powers: Map<string, number> = new Map();

  constructor() {
    this.powers = new Map(Object.entries(TRIPLE_WORD_SCORE));
    for (const [key, value] of Object.entries(DOUBLE_LETTER_SCORE)) {
      this.powers.set(key, value);
    }
    for (const [key, value] of Object.entries(TRIPLE_LETTER_SCORE)) {
      this.powers.set(key, value);
    }
    for (const [key, value] of Object.entries(DOUBLE_WORD_SCORE)) {
      this.powers.set(key, value);
    }
  }
}
