import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Select, SelectInput, Option, OptionGroup } from '@meeui/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Tooltip } from '@meeui/tooltip';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="selectPage">Select</h4>
    <mee-select [(ngModel)]="selectValue" (ngModelChange)="valueChanged()" class="w-full">
      <input meeSelectInput placeholder="Search options" [formControl]="search" />
      @for (item of optionsFilter(); track item) {
        <mee-option [value]="item" [meeTooltip]="item">{{ item }}</mee-option>
      }
    </mee-select>

    <h4 meeHeader class="my-5">Select with group</h4>
    <mee-select [(ngModel)]="groupValue" class="w-[196px]" placeholder="Select label" size="free">
      <span class="select-prefix text-muted">Select:</span>
      <input meeSelectInput placeholder="Search options" [formControl]="groupSearch" />
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
  `,
})
export class SelectComponent {
  selectValue = 'Option 1';
  search = new FormControl('');
  searchChange = toSignal(this.search.valueChanges);
  options = Array.from({ length: 50 }, (_, i) => `Option ${i + 1}`);

  optionsFilter = computed(() => {
    const search = (this.searchChange() || '').toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(search));
  });

  groupValue = '';
  groupSearch = new FormControl('');
  groupSearchChange = toSignal(this.groupSearch.valueChanges);
  // groupOptions = Array.from({ length: 3 }, (_, i) => {
  //   const children = Array.from({ length: 6 }, (_, j) => `Option ${j + 1}`);
  //   return { label: `Group ${i + 1}`, children };
  // });
  groupOptions = LARGE_DATA;

  groupOptionsFilter = computed(() => {
    const search = (this.groupSearchChange() || '').toLowerCase();
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
    this.search.setValue('');
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
