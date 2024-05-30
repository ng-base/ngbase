import { Cell, CellDef } from './body-cell';
import { BodyRow, BodyRowDef } from './body-row';
import { Row } from './column';
import { Head, HeadDef } from './head-cell';
import { HeadRow, HeadRowDef } from './head-row';
import { Table } from './table';

export * from './table';
export * from './column';
export * from './body-cell';
export * from './head-cell';
export * from './body-row';
export * from './head-row';

export const TableComponents = [
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
];
