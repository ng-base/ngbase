import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { filterFunction } from '@ngbase/adk/utils';
import { FormField, Label } from '@meeui/ui/form-field';
import { Option, OptionGroup, Select, SelectInput, SelectTrigger } from '@meeui/ui/select';
import { Heading } from '@meeui/ui/typography';
import { DocCode } from './code.component';

@Component({
  selector: 'app-select',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Heading,
    FormField,
    Label,
    Select,
    SelectTrigger,
    // SelectOption,
    SelectInput,
    Option,
    OptionGroup,
    DocCode,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="selectPage">Select</h4>
    <app-doc-code>
      <form [formGroup]="form">
        <mee-form-field class="mt-5 min-w-52">
          <label meeLabel>Select</label>
          <mee-select
            formControlName="select"
            (ngModelChange)="valueChanged()"
            [options]="options"
            class="w-full"
            id="select-test"
          />
        </mee-form-field>
        <!-- <input
            meeSelectInput
            placeholder="Search options"
            [(ngModel)]="optionsFilter.search"
            [ngModelOptions]="{ standalone: true }"
          /> -->
        <!-- @for (item of optionsFilter.filteredList(); track item) {
            <mee-option [value]="item" [meeTooltip]="item">{{ item }}</mee-option>
            } -->
        <!-- <ng-template meeSelectOption let-item let-index>
            <mee-option [value]="item" [meeTooltip]="item">{{ item }}</mee-option>
          </ng-template> -->
        <!-- </mee-select> -->
      </form>

      <mee-form-field class="mt-5 min-w-52">
        <label meeLabel>Select with group</label>
        <mee-select
          [(ngModel)]="groupValue"
          class="w-[196px]"
          placeholder="Select label"
          size="free"
        >
          <span class="select-prefix text-muted">Select:</span>
          <input meeSelectInput placeholder="Search options" [(ngModel)]="groupSearch" />
          @for (item of groupOptionsFilter(); track item.label) {
            <mee-option-group [label]="item.label">
              @for (item of item.children; track item) {
                <mee-option [value]="item">{{ item }}</mee-option>
              }
            </mee-option-group>
          }
          <div class="select-footer border-t px-3 py-2">Footer</div>
        </mee-select>
      </mee-form-field>
      <mee-form-field class="mt-5 min-w-52">
        <label meeLabel>Small select</label>
        <mee-select class="w-30">
          <div meeSelectTrigger>Great</div>
          @for (item of selectValues(); track item) {
            <mee-option [value]="item">{{ item }}</mee-option>
          }
        </mee-select>
      </mee-form-field>
    </app-doc-code>
  `,
})
export default class SelectComponent {
  selectValue = 'Option 1';
  options = Array.from({ length: 50 }, (_, i) => `Option ${i + 1}`);
  optionsFilter = filterFunction(this.options, { filter: option => option });

  readonly selectValues = signal([1, 2, 3]);

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
