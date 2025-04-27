# Radio

```typescript
import { Radio, RadioGroup } from '@/ui/radio';
```

## Components

### `mee-radio-group`

- **Inputs**
  - `value`: any - The value of the radio group (2way)
  - **Outputs**
  - `valueChange`: EventEmitter<any> - The event emitter for the value change
- **Exports** - `meeRadioGroup`

### `mee-radio`

- **Inputs**
  - `value`: any - The value of the radio
  - `disabled`: boolean - Whether the radio is disabled
- **Exports** - `meeRadio`

## Usage

```html
<mee-radio-group [(value)]="value">
  <mee-radio value="1">Radio 1</mee-radio>
  <mee-radio value="2">Radio 2</mee-radio>
</mee-radio-group>

<mee-radio-group [(ngModel)]="value">
  <mee-radio value="1">Radio 1</mee-radio>
  <mee-radio value="2">Radio 2</mee-radio>
</mee-radio-group>
```
