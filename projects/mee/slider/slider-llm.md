# Slider

```typescript
import { Slider } from '@/ui/slider';
```

## Components

### `mee-slider`

- **Inputs**
  - `value`: number - The value of the slider (2way)
  - `step`: number - The step of the slider
  - `min`: number - The minimum value of the slider
  - `max`: number - The maximum value of the slider
  - `range`: number - The range of the slider
  - `disabled`: boolean - Whether the slider is disabled
  - `orientation`: 'horizontal' | 'vertical' = 'horizontal' - The orientation of the slider
- **Export** - `meeSlider` - Template reference

## Usage

```html
<mee-slider [(ngModel)]="value" />
<mee-slider formControlName="value" [step]="10" [max]="200" [range]="3" />
<mee-slider
  [(value)]="value()"
  [step]="step()"
  [min]="min()"
  [max]="max()"
  [range]="range()"
  [disabled]="disabled()"
  [orientation]="orientation()"
></mee-slider>
```
