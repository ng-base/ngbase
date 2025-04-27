# Stepper

```typescript
import { Stepper, Step, StepHeader } from '@/ui/stepper';
```

## Components

### `mee-stepper`

- **Inputs**
  - `activeIndex`: number = 0 - The index of the active step (2way)
  - `direction`: 'horizontal' | 'vertical' = 'horizontal' - The direction of the stepper
- **Export** - `meeStepper` - Template reference

### `mee-step`

- **Inputs**
  - `title`: string - The title of the step
- **Export** - `meeStep` - Template reference

### `[meeStepHeader]`

## Usage

```html
<mee-stepper [(activeIndex)]="activeIndex" [direction]="direction()">
  <mee-step title="Step 1"> Step 1 </mee-step>
  <mee-step title="Step 2"> Step 2 </mee-step>
  <mee-step title="Step 3"> Step 3 </mee-step>
</mee-stepper>
```
