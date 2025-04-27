# MEE Carousel

```typescript
import { Carousel, CarouselItem, CarouselButton } from '@/ui/carousel';
```

## Components

### `<mee-carousel>, [meeCarousel]`

- **Export:** `#carousel="meeCarousel"` - Template reference

### `[meeCarouselItem]`

- **Export:** `#carouselItem="meeCarouselItem"` - Template reference

### `<mee-carousel-button>, [meeCarouselButton]`

- **Inputs:**

  - `meeCarouselButton`: 'next' | 'prev' | number - Carousel button

- **Export:** `#carouselButton="meeCarouselButton"` - Template reference

## Usage

```html
<mee-carousel>
  <div meeCarouselItem class="pl-4lg:basis-1/3 aspect-square shrink-0 grow-0 basis-full">
    Item 1
  </div>
  <div meeCarouselItem class="pl-4lg:basis-1/3 aspect-square shrink-0 grow-0 basis-full">
    Item 2
  </div>
  <button meeCarouselButton="next">Next</button>
  <button meeCarouselButton="prev">Prev</button>
</mee-carousel>
```
