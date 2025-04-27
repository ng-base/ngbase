# MEE Datepicker

```typescript
import { FormField, Label } from '@/ui/form-field';
import { DatepickerTrigger } from '@/ui/datepicker';
```

## Components

### `[meeDatepickerTrigger]`

- **Inputs:**

  - `noOfCalendars`: number - The number of calendars to display
  - `range`: boolean - Whether to display a range of dates
  - `time`: boolean - Whether to display a time picker
  - `format`: string - The format of the date input
  - `fieldFormat`: string - The format of the date input in the datepicker group
  - `dateFilter`: (date: Date) => boolean - A function to filter dates
  - `pickerType`: 'date' | 'month' | 'year' - The type of picker to display
  - `pickerTemplate`: TemplateRef<any> - A template to display in the picker

## Usage

```html
<mee-form-field>
  <label meeLabel>Date</label>
  <mee-datepicker-trigger
    [noOfCalendars]="noOfCalendars"
    [range]="range"
    [time]="time"
    [format]="format"
    [fieldFormat]="fieldFormat"
    [dateFilter]="dateFilter"
    [pickerType]="'date'"
    [pickerTemplate]="pickerTemplate"
  />
  <ng-template #pickerTemplate>
    <button meeButton>Today</button>
    <button meeButton>Yesterday</button>
  </ng-template>
</mee-form-field>
```
