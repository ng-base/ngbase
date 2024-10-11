import { render, RenderResult } from '../test';
import { Card } from './card.component';

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
