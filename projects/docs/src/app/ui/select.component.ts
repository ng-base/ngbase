import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Select, SelectInput, Option, OptionGroup } from '@meeui/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tooltip } from '@meeui/tooltip';
import { DocCode } from './code.component';
import { filterFunction } from '@meeui/utils';

@Component({
  standalone: true,
  selector: 'app-select',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Heading,
    Select,
    SelectInput,
    Option,
    OptionGroup,
    Tooltip,
    DocCode,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="selectPage">Select</h4>
    <app-doc-code>
      <form [formGroup]="form">
        <mee-select
          formControlName="select"
          (ngModelChange)="valueChanged()"
          class="w-full"
          id="select-test"
        >
          <input
            meeSelectInput
            placeholder="Search options"
            [(ngModel)]="optionsFilter.search"
            [ngModelOptions]="{ standalone: true }"
          />
          @for (item of optionsFilter.filteredList(); track item) {
            <mee-option [value]="item" [meeTooltip]="item">{{ item }}</mee-option>
          }
        </mee-select>
      </form>

      <h4 meeHeader class="my-5">Select with group</h4>
      <mee-select [(ngModel)]="groupValue" class="w-[196px]" placeholder="Select label" size="free">
        <span class="select-prefix text-muted">Select:</span>
        <input meeSelectInput placeholder="Search options" [(ngModel)]="groupSearch" />
        @for (item of groupOptionsFilter(); track item.label) {
          <mee-option-group [label]="item.label">
            @for (item of item.children; track item) {
              <mee-option [value]="item">{{ item }}</mee-option>
            }
          </mee-option-group>
        }
      </mee-select>

      <h4 meeHeader>Small select</h4>
      <mee-select class="w-30" size="free">
        <mee-option>Option 1</mee-option>
        <mee-option>Option 2</mee-option>
        <mee-option>Option 3</mee-option>
      </mee-select>
    </app-doc-code>
  `,
})
export class SelectComponent {
  selectValue = 'Option 1';
  options = Array.from({ length: 50 }, (_, i) => `Option ${i + 1}`);
  optionsFilter = filterFunction(this.options, { filter: option => option });

  form = new FormGroup({
    select: new FormControl('Option 2'),
  });

  groupValue = '';
  groupOptions = LARGE_DATA;

  groupSearch = signal('');
  groupOptionsFilter = computed(() => {
    const search = (this.groupSearch() || '').toLowerCase();
    return this.groupOptions.reduce(
      (acc, group) => {
        const filteredChildren = group.children.filter(option =>
          option.toLowerCase().includes(search),
        );
        if (filteredChildren.length) {
          acc.push({ ...group, children: filteredChildren });
        }
        return acc;
      },
      [] as { label: string; children: string[] }[],
    );
  });

  valueChanged() {
    this.optionsFilter.search.set('');
  }
}
// prettier-ignore
const LARGE_DATA = [
  {
      "label": "Group 1",
      "children": [
          "Option 1",
          "Option 1 -> This is a very long option 1",
          "Option 1 -> This is a very long option 2 with a very long text",
          "Option 1 -> This is a very long option 3 for select",
          "Option 1 -> This is a very long option 4 with a very long text",
          "Option 2",
          "Option 2 -> This is a very long option 5",
          "Option 2 -> This is a very long option 6 with a very long text",
          "Option 2 -> This is a very long option 7",
          "Option 2 -> This is a very long option 8 with a very long text",
      ]
  },
  {
      "label": "Group 2",
      "children": [
          "This is a very long option 9"
      ]
  },
  {
      "label": "Group 3",
      "children": [
          "This is a very long option 10",
      ]
  }
]
