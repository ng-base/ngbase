# Table

```typescript
import { TableComponents } from '@/ui/table';
```

### `meeTable`

- **inputs**

  - `data`: `T[]`
  - `trackBy`: `(index: number, item: T) => string`

- **Exports** - `meeTable`

## Usage

```html
<table meeTable [data]="data" [trackBy]="trackBy">
  <ng-container meeColumn="name">
    <th meeHead *meeHeadDef>Name</th>
    <td meeCell *meeCellDef="let row">{{row.name}}</td>
  </ng-container>
  <ng-container meeColumn="age">
    <th meeHead *meeHeadDef>Age</th>
    <td meeCell *meeCellDef="let row">{{row.age}}</td>
  </ng-container>
  <tr meeHeadRow *meeHeadRowDef="columns()"></tr>
  <tr meeBodyRow *meeBodyRowDef="let row; columns: columns()"></tr>
</table>
```
