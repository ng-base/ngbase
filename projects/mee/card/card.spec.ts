import { render, RenderResult } from '@meeui/adk/test';
import { Card } from './card';

describe('CardComponent', () => {
  let component: Card;
  let view: RenderResult<Card>;

  beforeEach(async () => {
    view = await render(Card);
    component = view.host;
    view.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
