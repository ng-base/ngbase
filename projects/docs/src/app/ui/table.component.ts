import { ChangeDetectionStrategy, Component, input, OnDestroy, signal } from '@angular/core';
import { ScrollArea } from '@meeui/scroll-area';
import { TableComponents } from '@meeui/table';
import { Heading } from '@meeui/typography';
import { DocCode } from './code.component';

interface Employee {
  Id: number;
  orderNumber: number;
  purchaseDate: string;
  customer: string;
  event: string;
  amount: string;
}

@Component({
  standalone: true,
  selector: 'app-table',
  imports: [TableComponents, ScrollArea, Heading, DocCode],
  template: `
    <h4 meeHeader class="mb-5">Table</h4>
    <!-- <button meeButton (click)="update()" class="mb-5">
      Click me {{ randomNum() }}
    </button> -->
    <!-- <div class="mb-b2 flex gap-b2">
      <mee-selectable
        [activeIndex]="1"
        (valueChanged)="$event === 0 ? startShuffle() : stopShuffle()"
      >
        <mee-selectable-item [value]="0">Start</mee-selectable-item>
        <mee-selectable-item [value]="1">Stop</mee-selectable-item>
      </mee-selectable>
      <button meeButton (click)="deleteAddShuffleData()">Shuffle</button>
      <button meeButton (click)="reverse()">Reverse</button>
    </div> -->
    <app-doc-code class="!p-0">
      <mee-scroll-area class="m-bb h-full max-h-[500px] max-w-4xl">
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
                {{ element[column] }}
              </td>
            </ng-container>
          }
          <ng-container meeRow="expandables">
            <th meeHead *meeHeadDef>Expandables</th>
            <td meeCell *meeCellDef="let element" [attr.colspan]="columns().length">
              @if (selected?.Id === element.Id) {
                {{ element.Id }} -- This is extented row for id {{ element.Id }}
              }
            </td>
          </ng-container>
          <tr meeHeadRow *meeHeadRowDef="columns()"></tr>
          <tr
            meeBodyRow
            *meeBodyRowDef="let row; columns: columns()"
            (click)="selected = selected === row ? undefined : row"
            class="cursor-pointer"
          ></tr>
          <tr
            meeBodyRow
            *meeBodyRowDef="let row; columns: ['expandables']"
            [class.hidden]="selected?.Id !== row.Id"
          ></tr>
        </table>
      </mee-scroll-area>
    </app-doc-code>
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
export class TableComponent implements OnDestroy {
  title = input<string>('Table');
  randomNum = signal(2);
  employees = signal<Employee[]>([
    // { id: 1, name: 'John Doe', t: 1 },
    // { id: 2, name: 'Jane Doe', t: 2 },
    // { id: 3, name: 'John Smith', t: 3 },
    // { id: 4, name: 'Jane Smith', t: 4 },
  ]);
  columns = signal<string[]>([]);
  selected: any;
  intervalId: any;

  constructor() {
    this.changeNumber(5000);
    const columns = new Set<string>();
    const employees = [];

    for (let i = 1; i <= 50; i++) {
      const obj = {
        Id: i,
      } as any;
      columns.add('Id');
      for (let j = 1; j <= 50; j++) {
        obj['Title ' + j] = i + j;
        columns.add('Title ' + j);
      }
      employees.push(obj);
    }
    this.columns.set([...columns]);
    this.employees.set(employees);
    // setInterval(() => {
    //   this.deleteAddShuffleData();
    // }, 10);
    // this.columns.set(Object.keys(DUMMY_DATA[0]));
    // this.employees.set(DUMMY_DATA);
  }

  startShuffle() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.deleteAddShuffleData();
    }, 10);
  }

  stopShuffle() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  changeNumber(_?: number) {
    // setTimeout(() => {
    this.randomNum.set(Math.floor(Math.random() * 10));
    // this.changeNumber(timeout);
    // }, timeout);
  }

  reverse() {
    this.employees.update(x => {
      return [...x.reverse()];
    });
  }

  deleteAddShuffleData() {
    // delete some random data 25%
    // const data = this.employees();
    // const randomIndex = Math.floor(Math.random() * data.length);
    // data.splice(randomIndex, randomIndex + Math.floor(data.length / 4));
    // // add some random data 25%
    // const randomData: Employee[] = [];
    // for (let i = 0; i < data.length / 4; i++) {
    //   randomData.push({
    //     Id: data.length + i + 1,
    //     orderNumber: Math.floor(Math.random() * 10000),
    //     purchaseDate: new Date().toDateString(),
    //     customer: 'Customer ' + (data.length + i + 1),
    //     event: 'Event ' + (data.length + i + 1),
    //     amount: 'US$' + (Math.random() * 100).toFixed(2),
    //   });
    // }

    this.employees.update(x => {
      return [...x.sort(() => Math.random() - 0.5)];
    });
  }

  trackByFn(_: number, value: Employee) {
    return value.Id;
  }

  now() {
    return new Date();
  }

  updateCell(c: any) {}

  update() {
    this.columns.set([]);
    this.employees.update(x => {
      x[0] = { ...x[0], customer: 'John 123' };
      // x.pop();
      return [...x];
    });
  }

  ngOnDestroy(): void {
    this.stopShuffle();
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

// const DUMMY_DATA: Employee[] = [
//   {
//     Id: 1,
//     orderNumber: 3000,
//     purchaseDate: 'May 9, 2024',
//     customer: 'Leslie Alexander',
//     event: 'Bear Hug: Live in Concert',
//     amount: 'US$80.00',
//   },
//   {
//     Id: 2,
//     orderNumber: 3001,
//     purchaseDate: 'May 5, 2024',
//     customer: 'Michael Foster',
//     event: 'Six Fingers — DJ Set',
//     amount: 'US$299.00',
//   },
//   {
//     Id: 3,
//     orderNumber: 3002,
//     purchaseDate: 'Apr 28, 2024',
//     customer: 'Dries Vincent',
//     event: 'We All Look The Same',
//     amount: 'US$150.00',
//   },
//   {
//     Id: 4,
//     orderNumber: 3003,
//     purchaseDate: 'Apr 23, 2024',
//     customer: 'Lindsay Walton',
//     event: 'Bear Hug: Live in Concert',
//     amount: 'US$80.00',
//   },
//   {
//     Id: 5,
//     orderNumber: 3004,
//     purchaseDate: 'Apr 18, 2024',
//     customer: 'Courtney Henry',
//     event: 'Viking People',
//     amount: 'US$114.99',
//   },
//   {
//     Id: 6,
//     orderNumber: 3005,
//     purchaseDate: 'Apr 14, 2024',
//     customer: 'Tom Cook',
//     event: 'Six Fingers — DJ Set',
//     amount: 'US$299.00',
//   },
//   {
//     Id: 7,
//     orderNumber: 3006,
//     purchaseDate: 'Apr 10, 2024',
//     customer: 'Whitney Francis',
//     event: 'We All Look The Same',
//     amount: 'US$150.00',
//   },
//   {
//     Id: 8,
//     orderNumber: 3007,
//     purchaseDate: 'Apr 6, 2024',
//     customer: 'Leonard Krasner',
//     event: 'Bear Hug: Live in Concert',
//     amount: 'US$80.00',
//   },
//   {
//     Id: 9,
//     orderNumber: 3008,
//     purchaseDate: 'Apr 3, 2024',
//     customer: 'Floyd Miles',
//     event: 'Bear Hug: Live in Concert',
//     amount: 'US$80.00',
//   },
//   {
//     Id: 10,
//     orderNumber: 3009,
//     purchaseDate: 'Mar 29, 2024',
//     customer: 'Emily Selman',
//     event: 'Viking People',
//     amount: 'US$114.99',
//   },
// ];
