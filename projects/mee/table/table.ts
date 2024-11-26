import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeTable } from '@meeui/adk/table';

@Component({
  selector: 'table[meeTable]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full text-sm',
  },
  providers: [{ provide: MeeTable, useExisting: Table }],
  template: `
    <thead>
      <ng-container #thead />
    </thead>
    <tbody>
      <ng-container #tbody />
    </tbody>
  `,
})
export class Table<T> extends MeeTable<T> {}
