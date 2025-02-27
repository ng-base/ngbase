import { Injectable, Component, inject } from '@angular/core';
import { fakeService, render, RenderResult } from '@ngbase/adk/test';

@Injectable({ providedIn: 'root' })
class TestService {
  value = 'Hello World';
}

@Component({
  selector: 'app-test',
  template: `<p>{{ service.value }}</p>`,
})
class TestComponent {
  readonly service = inject(TestService);
}

const testServiceFake = fakeService(TestService, () => ({
  value: 'Hello World',
}));

describe('TestComponent', () => {
  let view: RenderResult<TestComponent>;

  beforeEach(async () => {
    view = await render(TestComponent, [testServiceFake]);
  });

  it('should create', () => {
    expect(view.host).toBeTruthy();
  });
});
