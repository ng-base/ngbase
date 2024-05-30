import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { Heading } from '@meeui/typography';
import { Select, SelectInput, Option, OptionGroup } from '@meeui/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 meeHeader class="mb-5" id="selectPage">Select</h4>
    <mee-select
      [(ngModel)]="selectValue"
      (ngModelChange)="valueChanged()"
      class="w-full"
    >
      <input
        meeSelectInput
        placeholder="Search options"
        [formControl]="search"
      />
      @for (item of optionsFilter(); track item) {
        <mee-option [value]="item">{{ item }}</mee-option>
      }
    </mee-select>

    <h4 meeHeader class="my-5">Select with group</h4>
    <mee-select
      [(ngModel)]="groupValue"
      class="w-[196px]"
      size="free"
      placeholder="Select label"
    >
      <input
        meeSelectInput
        placeholder="Search options"
        [formControl]="groupSearch"
      />
      @for (item of groupOptionsFilter(); track item.label) {
        <mee-option-group [label]="item.label">
          @for (item of item.children; track item) {
            <mee-option [value]="item">{{ item }}</mee-option>
          }
        </mee-option-group>
      }
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
    return this.options.filter((option) =>
      option.toLowerCase().includes(search),
    );
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
        const filteredChildren = group.children.filter((option) =>
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
      "label": "CD ",
      "children": [
          " Closing Disclosure Date Issued ",
          " Closing/Settlement Date ",
          " Loan Amount ",
          " Compliance Loan Product ",
          " Closing Disclosure Receipt Date ",
          " Finance Charge ",
          " APR ",
          " Fees ",
          " Fees -> Loan Cost ",
          " Fees -> Loan Cost -> Origination Cost ",
          " Fees -> Loan Cost -> Origination Cost -> Fee Name ",
          " Fees -> Loan Cost -> Origination Cost -> Borrower Paid At Closing ",
          " Fees -> Loan Cost -> Origination Cost -> Borrower Paid Before Closing ",
          " Fees -> Loan Cost -> Origination Cost -> Seller Paid At Closing ",
          " Fees -> Loan Cost -> Origination Cost -> Seller Paid Before Closing ",
          " Fees -> Loan Cost -> Origination Cost -> Paid by Others ",
          " Fees -> Loan Cost -> Services Borrower Did not Shop For ",
          " Fees -> Loan Cost -> Services Borrower Did not Shop For -> Fee Name ",
          " Fees -> Loan Cost -> Services Borrower Did not Shop For -> Borrower Paid At Closing ",
          " Fees -> Loan Cost -> Services Borrower Did not Shop For -> Borrower Paid Before Closing ",
          " Fees -> Loan Cost -> Services Borrower Did not Shop For -> Seller Paid At Closing ",
          " Fees -> Loan Cost -> Services Borrower Did not Shop For -> Seller Paid Before Closing ",
          " Fees -> Loan Cost -> Services Borrower Did not Shop For -> Paid by Others ",
          " Fees -> Loan Cost -> Services Borrower Did Shop For ",
          " Fees -> Loan Cost -> Services Borrower Did Shop For -> Fee Name ",
          " Fees -> Loan Cost -> Services Borrower Did Shop For -> Borrower Paid At Closing ",
          " Fees -> Loan Cost -> Services Borrower Did Shop For -> Borrower Paid Before Closing ",
          " Fees -> Loan Cost -> Services Borrower Did Shop For -> Seller Paid At Closing ",
          " Fees -> Loan Cost -> Services Borrower Did Shop For -> Seller Paid Before Closing ",
          " Fees -> Loan Cost -> Services Borrower Did Shop For -> Paid by Others ",
          " Fees -> Other Costs ",
          " Fees -> Other Costs -> Taxes and Government Fees ",
          " Fees -> Other Costs -> Taxes and Government Fees -> Fee Name ",
          " Fees -> Other Costs -> Taxes and Government Fees -> Borrower Paid At Closing ",
          " Fees -> Other Costs -> Taxes and Government Fees -> Borrower Paid Before Closing ",
          " Fees -> Other Costs -> Taxes and Government Fees -> Seller Paid At Closing ",
          " Fees -> Other Costs -> Taxes and Government Fees -> Seller Paid Before Closing ",
          " Fees -> Other Costs -> Taxes and Government Fees -> Paid by Others ",
          " Fees -> Other Costs -> Prepaids ",
          " Fees -> Other Costs -> Prepaids -> Fee Name ",
          " Fees -> Other Costs -> Prepaids -> Borrower Paid At Closing ",
          " Fees -> Other Costs -> Prepaids -> Borrower Paid Before Closing ",
          " Fees -> Other Costs -> Prepaids -> Seller Paid At Closing ",
          " Fees -> Other Costs -> Prepaids -> Seller Paid Before Closing ",
          " Fees -> Other Costs -> Prepaids -> Paid by Others ",
          " Fees -> Other Costs -> Prepaids -> From Date ",
          " Fees -> Other Costs -> Prepaids -> To Date ",
          " Fees -> Other Costs -> Prepaids -> Days ",
          " Fees -> Other Costs -> Initial Escrow At Closing ",
          " Fees -> Other Costs -> Initial Escrow At Closing -> Fee Name ",
          " Fees -> Other Costs -> Initial Escrow At Closing -> Borrower Paid At Closing ",
          " Fees -> Other Costs -> Initial Escrow At Closing -> Borrower Paid Before Closing ",
          " Fees -> Other Costs -> Initial Escrow At Closing -> Seller Paid At Closing ",
          " Fees -> Other Costs -> Initial Escrow At Closing -> Seller Paid Before Closing ",
          " Fees -> Other Costs -> Initial Escrow At Closing -> Paid by Others ",
          " Fees -> Other Costs -> Other ",
          " Fees -> Other Costs -> Other -> Fee Name ",
          " Fees -> Other Costs -> Other -> Borrower Paid At Closing ",
          " Fees -> Other Costs -> Other -> Borrower Paid Before Closing ",
          " Fees -> Other Costs -> Other -> Seller Paid At Closing ",
          " Fees -> Other Costs -> Other -> Seller Paid Before Closing ",
          " Fees -> Other Costs -> Other -> Paid by Others ",
          " Fees -> Other Costs -> Total Closing Costs ",
          " Fees -> Other Costs -> Total Closing Costs -> Fee Name ",
          " Fees -> Other Costs -> Total Closing Costs -> Borrower Paid At Closing ",
          " Fees -> Other Costs -> Total Closing Costs -> Borrower Paid Before Closing ",
          " Fees -> Other Costs -> Total Closing Costs -> Seller Paid At Closing ",
          " Fees -> Other Costs -> Total Closing Costs -> Seller Paid Before Closing ",
          " Fees -> Other Costs -> Total Closing Costs -> Paid by Others "
      ]
  },
  {
      "label": "layout ",
      "children": [
          " Block "
      ]
  },
  {
      "label": "OCR Annotation ",
      "children": [
          " Text "
      ]
  }
]
