import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormField, MeeInput } from '@meeui/ui/form-field';
import { Option, Select, SelectTrigger } from '@meeui/ui/select';
import { EmptyState, Sort, SortHeader, TableComponents } from '@meeui/ui/table';

interface Task {
  title: string;
  status: string;
  dueDate: string;
  assignee: string;
}

@Component({
  selector: 'app-table-demo-one',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableComponents,
    FormField,
    Select,
    SelectTrigger,
    Option,
    Sort,
    SortHeader,
    MeeInput,
    EmptyState,
  ],
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

    <mee-form-field>
      <input meeInput placeholder="Search" type="text" [(value)]="search" />
    </mee-form-field>

    <table meeTable [data]="tasks()" [trackBy]="trackByFn" meeSort mode="selection" class="border">
      <ng-container meeColumn="title">
        <th meeHead *meeHeadDef meeSortHeader>Title</th>
        <td meeCell *meeCellDef="let task">
          {{ task.title }}
        </td>
      </ng-container>
      <ng-container meeColumn="status">
        <th meeHead *meeHeadDef meeSortHeader>Status</th>
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
        <th meeHead *meeHeadDef meeSortHeader>Assignee</th>
        <td meeCell *meeCellDef="let task">
          {{ task.assignee }}
        </td>
      </ng-container>
      <tr meeEmptyState>
        No data
      </tr>
      <tr meeHeadRow *meeHeadRowDef="displayColumns()"></tr>
      <tr meeBodyRow *meeBodyRowDef="let task; columns: displayColumns()"></tr>
    </table>
  `,
})
export default class TableDemoOne {
  readonly search = signal('');
  private readonly data = signal<Task[]>([
    {
      title: 'Task 1',
      status: 'Completed',
      dueDate: '2023-01-01',
      assignee: 'John Smith',
    },
    {
      title: 'Task 2',
      status: 'In Progress',
      dueDate: '2023-01-02',
      assignee: 'Jane Doe',
    },
  ]);
  readonly tasks = computed(() =>
    this.data().filter(task => task.title.toLowerCase().includes(this.search().toLowerCase())),
  );
  readonly columns = signal<string[]>(['title', 'status', 'dueDate', 'assignee']);
  readonly selectedColumn = signal<string[]>(this.columns());
  readonly displayColumns = computed(() =>
    this.columns().filter(c => this.selectedColumn().includes(c)),
  );
  trackByFn = (index: number, item: Task) => item.title;
}
