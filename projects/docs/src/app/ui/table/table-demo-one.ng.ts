import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField } from '@meeui/ui/form-field';
import { Option, Select, SelectTrigger } from '@meeui/ui/select';
import { TableComponents } from '@meeui/ui/table';

interface Task {
  title: string;
  status: string;
  dueDate: string;
  assignee: string;
}

@Component({
  selector: 'app-table-demo-one',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponents, FormField, Select, SelectTrigger, Option],
  template: `
    <mee-form-field>
      <mee-select [(value)]="selectedColumn" multiple>
        <div meeSelectTrigger>
          {{ selectedColumn()[0] || 'Select a column' }}
          @if (selectedColumn().length > 1) {
            +({{ selectedColumn().length - 1 }})
          }
        </div>
        <mee-option value="title">Title</mee-option>
        <mee-option value="status">Status</mee-option>
        <mee-option value="dueDate">Due Date</mee-option>
        <mee-option value="assignee">Assignee</mee-option>
      </mee-select>
    </mee-form-field>
    <table meeTable [data]="tasks()" [trackBy]="trackByFn">
      <ng-container meeColumn="title">
        <th meeHead *meeHeadDef>Title</th>
        <td meeCell *meeCellDef="let task">
          {{ task.title }}
        </td>
      </ng-container>
      <ng-container meeColumn="status">
        <th meeHead *meeHeadDef>Status</th>
        <td meeCell *meeCellDef="let task">
          {{ task.status }}
        </td>
      </ng-container>
      <ng-container meeColumn="dueDate">
        <th meeHead *meeHeadDef>Due Date</th>
        <td meeCell *meeCellDef="let task">
          {{ task.dueDate }}
        </td>
      </ng-container>
      <ng-container meeColumn="assignee">
        <th meeHead *meeHeadDef>Assignee</th>
        <td meeCell *meeCellDef="let task">
          {{ task.assignee }}
        </td>
      </ng-container>
      <tr meeHeadRow *meeHeadRowDef="selectedColumn()"></tr>
      <tr meeBodyRow *meeBodyRowDef="let task; columns: selectedColumn()"></tr>
    </table>
  `,
})
export default class TableDemoOne {
  tasks = signal<Task[]>([
    {
      title: 'Task 1',
      status: 'In Progress',
      dueDate: '2023-01-01',
      assignee: 'John Doe',
    },
    {
      title: 'Task 2',
      status: 'Completed',
      dueDate: '2023-01-02',
      assignee: 'Jane Smith',
    },
  ]);
  readonly columns = signal<string[]>(['title', 'status', 'dueDate', 'assignee']);
  readonly selectedColumn = signal<string[]>(this.columns());
  trackByFn = (index: number, item: Task) => item.title;
}
