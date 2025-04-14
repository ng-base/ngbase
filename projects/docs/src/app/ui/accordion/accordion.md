## Components

The accordion system consists of three main components:

1. `AccordionGroup` - Container for multiple accordion items
2. `Accordion` - Individual collapsible panel
3. `AccordionHeader` - Clickable header that controls the accordion state

## AccordionGroup Component

The `AccordionGroup` component serves as a container for multiple accordion items and manages their collective behavior.

### Selector

`mee-accordion-group`

### Inputs

| Input      | Type      | Default | Description                                                                                                                             |
| ---------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `multiple` | `boolean` | `false` | When `true`, allows multiple accordion items to be expanded simultaneously. When `false`, only one accordion can be expanded at a time. |

## Accordion Component

The `Accordion` component represents an individual collapsible panel.

### Selector

`mee-accordion`

### Inputs

| Input      | Type      | Default | Description                                                        |
| ---------- | --------- | ------- | ------------------------------------------------------------------ |
| `expanded` | `boolean` | `false` | Controls whether the accordion is expanded or collapsed.           |
| `disabled` | `boolean` | `false` | When `true`, the accordion cannot be toggled and appears disabled. |

### Outputs

| Output           | Type                    | Description                                                                                               |
| ---------------- | ----------------------- | --------------------------------------------------------------------------------------------------------- |
| `expandedChange` | `EventEmitter<boolean>` | Emits when the accordion's expanded state changes. Emits `true` when expanded and `false` when collapsed. |

## AccordionHeader Directive

The `AccordionHeader` directive is applied to the clickable element that toggles the accordion.

### Selector

`[meeAccordionHeader]`

### ARIA Attributes

Based on the implementation, the header automatically receives the following ARIA states:

| Attribute       | Description                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------- |
| `aria-disabled` | Set to `true` when the accordion is disabled, which affects the cursor styling and opacity. |
| `aria-expanded` | Indicates whether the accordion section is expanded (`true`) or collapsed (`false`).        |
| `aria-controls` | References the ID of the content panel that the header controls.                            |

## Implementation Notes

- The component is built on top of base directives from `@ngbase/adk/accordion`.
- It uses Angular's host directives feature to expose inputs and outputs.
- The component implements change detection strategy `OnPush` for better performance.
