# Theme

```typescript
import { ThemeButton, injectTheme } from '@/ui/theme';
```

## Components

### ThemeButton

```html
<mee-theme-button />
```

## Usage

```typescript
const theme = injectTheme();

theme.toggle();
theme.mode(); // 'light' | 'dark' | ''
theme.mode.set('light');
```
