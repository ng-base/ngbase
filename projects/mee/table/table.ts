import { ChangeDetectionStrategy, Component, computed, Directive, input } from '@angular/core';
import {
  aliasBodyRow,
  aliasHeadRow,
  aliasSort,
  aliasSortHeader,
  aliasTable,
  NgbBodyRow,
  NgbBodyRowDef,
  NgbCell,
  NgbCellDef,
  NgbColumn,
  NgbHead,
  NgbHeadDef,
  NgbHeadRow,
  NgbHeadRowDef,
  NgbSort,
  NgbSortHeader,
  NgbTable,
} from '@ngbase/adk/table';
import { Select, Option, SelectTrigger } from '@meeui/ui/select';
import { FormField, InputSuffix } from '@meeui/ui/form-field';
import { Icon } from '@meeui/ui/icon';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowDown, lucideArrowUp, lucideChevronsUpDown } from '@ng-icons/lucide';
import { Button } from '@meeui/ui/button';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'table[meeTable]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasTable(Table)],
  template: `
    <thead>
      <ng-container #thead />
    </thead>
    <tbody>
      <ng-container #tbody />
    </tbody>
  `,
  host: {
    class: 'w-full text-sm border-separate border-spacing-0',
  },
})
export class Table<T> extends NgbTable<T> {}

// Cell
@Component({
  selector: '[meeCell]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [NgbCell],
  template: `<ng-content />`,
  host: {
    class: 'px-4 py-2 align-middle bg-background',
  },
})
export class Cell {}

@Directive({
  selector: '[meeCellDef]',
  hostDirectives: [NgbCellDef],
})
export class CellDef {}

// Body

@Directive({
  selector: '[meeBodyRowDef]',
  hostDirectives: [
    { directive: NgbBodyRowDef, inputs: ['ngbBodyRowDefColumns: meeBodyRowDefColumns'] },
  ],
})
export class BodyRowDef {}

@Component({
  selector: '[meeBodyRow]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasBodyRow(BodyRow)],
  template: `<ng-container #container />`,
  host: {
    class: '[&:not(:last-child)>td]:border-b hover:bg-muted h-12',
  },
})
export class BodyRow extends NgbBodyRow {}

// Column

@Directive({
  selector: '[meeColumn]',
  hostDirectives: [{ directive: NgbColumn, inputs: ['ngbColumn: meeColumn', 'sticky'] }],
})
export class Column {}

// Head Cell

@Directive({
  selector: '[meeHead]',
  hostDirectives: [NgbHead],
  host: {
    class:
      'px-4 py-2 text-left align-middle font-medium text-muted-foreground border-b bg-background [&[data-sticky]]:sticky [&[data-sticky]]:!z-20 [&[data-sticky="start"]]:left-0 [&[data-sticky="end"]]:right-0 [&[data-sticky="start"]]:border-r [&[data-sticky="end"]]:border-l',
  },
})
export class Head {}

@Directive({
  selector: '[meeHeadDef]',
  hostDirectives: [NgbHeadDef],
})
export class HeadDef {}

// Head Row

@Component({
  selector: '[meeHeadRow]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasHeadRow(HeadRow)],
  template: `<ng-container #container />`,
  host: {
    class: `h-10 [&[data-sticky]>th]:sticky [&[data-sticky]>th]:top-0 [&[data-sticky]>th]:bg-background [&[data-sticky]>th]:z-10`,
  },
})
export class HeadRow extends NgbHeadRow {}

@Directive({
  selector: '[meeHeadRowDef]',
  hostDirectives: [
    {
      directive: NgbHeadRowDef,
      inputs: ['ngbHeadRowDef: meeHeadRowDef', 'ngbHeadRowDefSticky: meeHeadRowDefSticky'],
    },
  ],
})
export class HeadRowDef {}

@Directive({
  selector: '[meeSort]',
  providers: [aliasSort(Sort)],
})
export class Sort extends NgbSort<any> {
  readonly mode = input<'selection' | 'toggle'>('toggle');
}

@Component({
  selector: '[meeSortHeader]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronsUpDown, lucideArrowDown, lucideArrowUp })],
  providers: [aliasSortHeader(SortHeader)],
  imports: [Select, Option, SelectTrigger, FormField, InputSuffix, Icon, Button, NgTemplateOutlet],
  template: `
    <ng-template #temp><ng-content /></ng-template>
    @if (sort.mode() === 'selection') {
      <mee-form-field class="[&>.mis]:h-8 [&>.mis]:min-h-8 [&>.mis]:border-none">
        <mee-select noIcon>
          <div meeSelectTrigger class="text-xs"><ng-container *ngTemplateOutlet="temp" /></div>
          <mee-option value="asc" (click)="setDirections('asc')">Asc</mee-option>
          <mee-option value="desc" (click)="setDirections('desc')">Desc</mee-option>
        </mee-select>
        <mee-icon meeSuffix [name]="directionIcon()" class="!ml-0.5 text-muted-foreground" />
      </mee-form-field>
    } @else {
      <button meeButton="ghost" class="h-8 gap-0.5 !px-2" (click)="toggle()">
        <ng-container *ngTemplateOutlet="temp" />
        <mee-icon [name]="directionIcon()" />
      </button>
    }
  `,
  host: {
    class: '!py-1 !px-2',
  },
})
export class SortHeader extends NgbSortHeader<Sort> {
  readonly directionIcon = computed(() => {
    return this.sortDirection() === 'asc'
      ? 'lucideArrowDown'
      : this.sortDirection() === 'desc'
        ? 'lucideArrowUp'
        : 'lucideChevronsUpDown';
  });
}
