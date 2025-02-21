import { Component } from '@angular/core';
import { render, RenderResult } from '@ngbase/adk/test';
import { Avatar } from './avatar';

@Component({
  imports: [Avatar],
  template: '<mee-avatar></mee-avatar>',
})
export class AvatarComponent {}

describe('AvatarComponent', () => {
  let view: RenderResult<AvatarComponent>;

  beforeEach(async () => {
    view = await render(AvatarComponent);
  });
  it('should create', async () => {
    expect(true).toBe(true);
  });
});
