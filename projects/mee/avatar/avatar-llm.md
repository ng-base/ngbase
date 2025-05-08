# MEE Avatar

```typescript
import { Avatar, AvatarGroup } from '@/ui/avatar';
```

## Components

### `<mee-avatar-group>`

- **Inputs:**

  - `reverse`: boolean = false - Reverse the avatar group
  - `left`: boolean = false - Left the avatar group

- **Export:** `#avatarGroup="meeAvatarGroup"` - Template reference

### `<mee-avatar>, [meeAvatar]`

- **Inputs:**

  - `src`: string = '' - Avatar image source
  - `name`: string = '' - Avatar name
  - `text`: string = '' - Avatar text
  - `size`: 'sm' | 'md' | 'lg' = 'md' - Avatar size

- **Export:** `#avatar="meeAvatar"` - Template reference

## Usage

```html
<mee-avatar name="John Doe" src="https://x.me/0.jpg" />
<mee-avatar-group>
  <mee-avatar src="https://x.me/0.jpg" size="lg" />
  <button meeAvatar src="https://x.me/1.jpg" size="lg" />
</mee-avatar-group>
```

Note: Use `mee-avatar-group` to wrap the `mee-avatar` and `button`. Always use `mee-avatar` for image avatar.
