import { ChangeDetectionStrategy, Component, Directive, signal } from '@angular/core';
import { aliasTable, NgbTable } from './table';
import { render, RenderResult } from '@ngbase/adk/test';
import { NgbColumn } from './column';
import { aliasHeadRow, NgbHeadRow, NgbHeadRowDef } from './head-row';
import { NgbBodyRow, NgbBodyRowDef } from './body-row';
import { NgbCell } from './body-cell';
import { NgbHead } from './head-cell';
import { NgbHeadDef } from './head-cell';
import { NgbCellDef } from './body-cell';

@Component({
  selector: 'table[tTable]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasTable(TTable)],
  template: `
    <thead>
      <ng-container #thead />
    </thead>
    <tbody>
      <ng-container #tbody />
    </tbody>
  `,
})
export class TTable<T> extends NgbTable<T> {}

// Cell
@Component({
  selector: '[tCell]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [NgbCell],
  template: `<ng-content />`,
})
export class TCell {}

@Directive({
  selector: '[tCellDef]',
  hostDirectives: [NgbCellDef],
})
export class TCellDef {}

// Body

@Directive({
  selector: '[tBodyRowDef]',
  hostDirectives: [
    { directive: NgbBodyRowDef, inputs: ['ngbBodyRowDefColumns: tBodyRowDefColumns'] },
  ],
})
export class TBodyRowDef {}

@Component({
  selector: '[tBodyRow]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container #container />`,
})
export class TBodyRow extends NgbBodyRow {}

// Column

@Directive({
  selector: '[tColumn]',
  hostDirectives: [{ directive: NgbColumn, inputs: ['ngbColumn: tColumn', 'sticky'] }],
})
export class TColumn {}

// Head Cell

@Component({
  selector: '[tHead]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [NgbHead],
  template: `<ng-content />`,
})
export class THead {}

@Directive({
  selector: '[tHeadDef]',
  hostDirectives: [NgbHeadDef],
})
export class THeadDef {}

// Head Row

@Component({
  selector: '[tHeadRow]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasHeadRow(THeadRow)],
  template: `<ng-container #container />`,
})
export class THeadRow extends NgbHeadRow {}

@Directive({
  selector: '[tHeadRowDef]',
  hostDirectives: [
    {
      directive: NgbHeadRowDef,
      inputs: ['ngbHeadRowDef: tHeadRowDef', 'ngbHeadRowDefSticky: tHeadRowDefSticky'],
    },
  ],
})
export class THeadRowDef {}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TTable,
    TBodyRow,
    TBodyRowDef,
    TCell,
    TCellDef,
    THead,
    THeadDef,
    THeadRow,
    THeadRowDef,
    TColumn,
  ],
  template: `<table tTable [data]="data()" [trackBy]="trackBy">
    <ng-container tColumn="id">
      <th tHead *tHeadDef>Id</th>
      <td tCell *tCellDef="let element">{{ element.id }}</td>
    </ng-container>
    <ng-container tColumn="name">
      <th tHead *tHeadDef>Name</th>
      <td tCell *tCellDef="let element">{{ element.name }}</td>
    </ng-container>
    <ng-container tColumn="email">
      <th tHead *tHeadDef>Email</th>
      <td tCell *tCellDef="let element">{{ element.email }}</td>
    </ng-container>

    <tr tHeadRow *tHeadRowDef="columns(); sticky: true"></tr>
    <tr tBodyRow *tBodyRowDef="let row; columns: columns()"></tr>
  </table>`,
})
export class TestTable {
  data = signal<any[]>([
    { id: 1, name: 'John Smith', email: 'john.smith@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
  ]);
  columns = signal<string[]>(['id', 'name', 'email']);
  trackBy = (index: number, item: any) => item.id;
}

describe('Table', () => {
  let view: RenderResult<TestTable>;

  beforeEach(async () => {
    view = await render(TestTable);
    view.detectChanges();
  });

  it('should create a table', () => {
    expect(view.host).toBeTruthy();
    expect(view.$All('th').length).toBe(3);
    expect(view.$All('td').length).toBe(6);
  });

  it('should remove rows when columns are removed', () => {
    view.host.columns.set(['id', 'name']);
    view.detectChanges();
    expect(view.$All('td').length).toBe(4);
  });

  it('should maintain the order of the columns', () => {
    view.host.columns.set(['name', 'id']);
    view.detectChanges();
    expect(view.$All('th')[0].textContent).toBe('Name');
    expect(view.$All('th')[1].textContent).toBe('Id');
    expect(view.$All('td')[0].textContent).toBe('John Smith');
    expect(view.$All('td')[1].textContent).toBe('1');

    view.host.columns.set(['id', 'name']);
    view.detectChanges();
    expect(view.$All('th')[0].textContent).toBe('Id');
    expect(view.$All('th')[1].textContent).toBe('Name');
    expect(view.$All('td')[0].textContent).toBe('1');
    expect(view.$All('td')[1].textContent).toBe('John Smith');
  });

  it('should swap rows when rows are moved', () => {
    view.host.data.set([
      { id: 1, name: 'John Smith', email: 'john.smith@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
    ]);
    view.detectChanges();
    expect(view.$All('td')[0].textContent).toBe('1');
    expect(view.$All('td')[1].textContent).toBe('John Smith');

    view.host.data.set([
      { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
      { id: 1, name: 'John Smith', email: 'john.smith@example.com' },
    ]);
    view.detectChanges();
    expect(view.$All('td')[0].textContent).toBe('2');
    expect(view.$All('td')[1].textContent).toBe('Jane Doe');
  });

  it('should update the value of the row when the data changes', async () => {
    view.host.data.set([
      { id: 1, name: 'John Smith', email: 'john.smith@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
    ]);

    view.detectChanges();
    expect(view.$All('td')[0].textContent).toBe('1');
    expect(view.$All('td')[1].textContent).toBe('John Smith');

    view.host.data.set([
      { id: 1, name: 'John Smith 123', email: 'john.smith@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
    ]);
    view.detectChanges();
    expect(view.$All('td')[0].textContent).toBe('1');
    expect(view.$All('td')[1].textContent).toBe('John Smith 123');
  });

  it('should add, move and remove rows', () => {
    // add
    view.host.data.set([
      { id: 1, name: 'John Smith', email: 'john.smith@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
    ]);
    view.detectChanges();
    expect(view.$All('td')[0].textContent).toBe('1');
    expect(view.$All('td')[1].textContent).toBe('John Smith');

    // move
    view.host.data.set([
      { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
      { id: 1, name: 'John Smith', email: 'john.smith@example.com' },
    ]);
    view.detectChanges();
    expect(view.$All('td')[0].textContent).toBe('2');
    expect(view.$All('td')[1].textContent).toBe('Jane Doe');

    // remove
    view.host.data.set([{ id: 1, name: 'John Smith', email: 'john.smith@example.com' }]);
    view.detectChanges();
    expect(view.$All('td')[0].textContent).toBe('1');
    expect(view.$All('td')[1].textContent).toBe('John Smith');
    expect(view.$All('td').length).toBe(3);
  });
});
