import { Component, OnInit, signal, ChangeDetectionStrategy, input } from '@angular/core';
import { CdkTableModule } from '@angular/cdk/table';
import {
  BodyRow,
  BodyRowDef,
  Cell,
  CellDef,
  Head,
  HeadDef,
  HeadRow,
  HeadRowDef,
  Row,
  Table,
} from '@meeui/table';
import { RangePipe } from '@meeui/utils';
import { Button } from '@meeui/button';
import { ScrollArea } from '@meeui/scroll-area';
import { Heading } from '@meeui/typography';
import { Card } from '@meeui/card';

interface Employee {
  id: number;
  name: string;
  t?: number;
}

@Component({
  standalone: true,
  selector: 'app-table',
  imports: [
    Table,
    Row,
    Cell,
    CellDef,
    Head,
    HeadDef,
    BodyRow,
    HeadRow,
    BodyRowDef,
    HeadRowDef,
    RangePipe,
    CdkTableModule,
    Button,
    ScrollArea,
    Heading,
    Card,
  ],
  template: `
    <h4 meeHeader class="mb-5">Table</h4>
    <!-- <button meeButton (click)="update()" class="mb-5">
      Click me {{ randomNum() }}
    </button> -->
    <mee-card class="p-b2">
      <mee-scroll-area class="m-bb h-full max-w-4xl">
        <table meeTable [data]="employees()" [trackBy]="trackByFn">
          @for (column of columns(); track column) {
            <ng-container [meeRow]="column">
              <th class="whitespace-nowrap" meeHead *meeHeadDef>
                {{ column }}
              </th>
              <td
                class="whitespace-nowrap"
                meeCell
                *meeCellDef="let element"
                (click)="updateCell(column)"
              >
                Value {{ element[column] }}
              </td>
            </ng-container>
          }
          <tr meeHeadRow *meeHeadRowDef></tr>
          <tr meeBodyRow *meeBodyRowDef></tr>
        </table>
      </mee-scroll-area>
    </mee-card>

    <!-- <table meeTable [data]="employees">
      @for (n of 5 | range; track n) {
        <ng-container [meeRow]="'Title ' + n">
          <th class="whitespace-nowrap" meeHead *meeHeadDef>Header {{ n }}</th>
          <td class="whitespace-nowrap" meeCell *meeCellDef="let element">
            Value {{ element.name }}
          </td>
        </ng-container>
      }
      <tr meeHeadRow *meeHeadRowDef></tr>
      <tr meeBodyRow *meeBodyRowDef></tr>
    </table> -->

    <!-- <table cdk-table [dataSource]="10 | range" [trackBy]="trackByFn">
          @for (n of 10 | range; track n) {
            <ng-container [cdkColumnDef]="'Title ' + n">
              <th cdk-header-cell *cdkHeaderCellDef>No.</th>
              <td cdk-cell *cdkCellDef="let element">Value {{ element }}</td>
            </ng-container>
          }
          <tr cdk-header-row *cdkHeaderRowDef="displayedColumns"></tr>
          <tr cdk-row *cdkRowDef="let row; columns: displayedColumns"></tr>
        </table> -->

    <!-- <table class="w-full text-sm">
        <thead>
          <tr class="border-b">
            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Header 1
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Header 2
            </th>
            <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Header 3
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b">
            <td class="p-4 align-middle">Value 1</td>
            <td class="p-4 align-middle">Value 2</td>
            <td class="p-4 align-middle">Value 3</td>
          </tr>
          <tr class="border-b">
            <td class="p-4 align-middle">Value 4</td>
            <td class="p-4 align-middle">Value 5</td>
            <td class="p-4 align-middle">Value 6</td>
          </tr>
          <tr class="border-b">
            <td class="p-4 align-middle">Value 7</td>
            <td class="p-4 align-middle">Value 8</td>
            <td class="p-4 align-middle">Value 9</td>
          </tr>
        </tbody>
      </table> -->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    `,
  ],
})
export class TableComponent {
  title = input<string>('Table');
  randomNum = signal(2);
  employees = signal<any[]>([
    // { id: 1, name: 'John Doe', t: 1 },
    // { id: 2, name: 'Jane Doe', t: 2 },
    // { id: 3, name: 'John Smith', t: 3 },
    // { id: 4, name: 'Jane Smith', t: 4 },
  ]);
  columns = signal<string[]>([]);

  constructor() {
    this.changeNumber(5000);
    const columns = new Set<string>();
    const employees = [];

    // for (let i = 1; i <= 50; i++) {
    //   const obj = {} as any;
    //   for (let i = 1; i <= 50; i++) {
    //     obj['Title ' + i] = i;
    //     columns.add('Title ' + i);
    //   }
    //   employees.push(obj);
    // }
    // this.columns.set([...columns]);
    // this.employees.set(employees);
    this.columns.set(Object.keys(DUMMY_DATA[0]));
    this.employees.set(DUMMY_DATA);
  }

  changeNumber(timeout?: number) {
    // setTimeout(() => {
    this.randomNum.set(Math.floor(Math.random() * 10));
    // this.changeNumber(timeout);
    // }, timeout);
  }

  trackByFn(index: number, value: Employee) {
    return value.id;
  }

  now() {
    return new Date();
  }

  updateCell(c: any) {}

  update() {
    this.columns.set([]);
    this.employees.update(x => {
      x[0] = { ...x[0], name: 'John 123' };
      // x.pop();
      return [...x];
    });
  }
}

// Order number	Purchase date	Customer	Event	Amount
// 3000	May 9, 2024	Leslie Alexander

// Bear Hug: Live in Concert
// US$80.00
// 3001	May 5, 2024	Michael Foster

// Six Fingers — DJ Set
// US$299.00
// 3002	Apr 28, 2024	Dries Vincent

// We All Look The Same
// US$150.00
// 3003	Apr 23, 2024	Lindsay Walton

// Bear Hug: Live in Concert
// US$80.00
// 3004	Apr 18, 2024	Courtney Henry

// Viking People
// US$114.99
// 3005	Apr 14, 2024	Tom Cook

// Six Fingers — DJ Set
// US$299.00
// 3006	Apr 10, 2024	Whitney Francis

// We All Look The Same
// US$150.00
// 3007	Apr 6, 2024	Leonard Krasner

// Bear Hug: Live in Concert
// US$80.00
// 3008	Apr 3, 2024	Floyd Miles

// Bear Hug: Live in Concert
// US$80.00
// 3009	Mar 29, 2024	Emily Selman

// Viking People
// US$114.99

const DUMMY_DATA = [
  {
    orderNumber: 3000,
    purchaseDate: 'May 9, 2024',
    customer: 'Leslie Alexander',
    event: 'Bear Hug: Live in Concert',
    amount: 'US$80.00',
  },
  {
    orderNumber: 3001,
    purchaseDate: 'May 5, 2024',
    customer: 'Michael Foster',
    event: 'Six Fingers — DJ Set',
    amount: 'US$299.00',
  },
  {
    orderNumber: 3002,
    purchaseDate: 'Apr 28, 2024',
    customer: 'Dries Vincent',
    event: 'We All Look The Same',
    amount: 'US$150.00',
  },
  {
    orderNumber: 3003,
    purchaseDate: 'Apr 23, 2024',
    customer: 'Lindsay Walton',
    event: 'Bear Hug: Live in Concert',
    amount: 'US$80.00',
  },
  {
    orderNumber: 3004,
    purchaseDate: 'Apr 18, 2024',
    customer: 'Courtney Henry',
    event: 'Viking People',
    amount: 'US$114.99',
  },
  {
    orderNumber: 3005,
    purchaseDate: 'Apr 14, 2024',
    customer: 'Tom Cook',
    event: 'Six Fingers — DJ Set',
    amount: 'US$299.00',
  },
  {
    orderNumber: 3006,
    purchaseDate: 'Apr 10, 2024',
    customer: 'Whitney Francis',
    event: 'We All Look The Same',
    amount: 'US$150.00',
  },
  {
    orderNumber: 3007,
    purchaseDate: 'Apr 6, 2024',
    customer: 'Leonard Krasner',
    event: 'Bear Hug: Live in Concert',
    amount: 'US$80.00',
  },
  {
    orderNumber: 3008,
    purchaseDate: 'Apr 3, 2024',
    customer: 'Floyd Miles',
    event: 'Bear Hug: Live in Concert',
    amount: 'US$80.00',
  },
  {
    orderNumber: 3009,
    purchaseDate: 'Mar 29, 2024',
    customer: 'Emily Selman',
    event: 'Viking People',
    amount: 'US$114.99',
  },
];
