import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RenderResult, fakeService, render } from '@meeui/adk/test';
import { MeeIcon } from './icon';
import { IconService } from './icon.service';

@Component({
  selector: 'mee-icon-test',
  hostDirectives: [{ directive: MeeIcon, inputs: ['name'] }],
  template: ``,
})
class TestComponent {}

const httpClientStub = fakeService(HttpClient, {
  get: jest.fn(),
});

describe('IconService', () => {
  let view: RenderResult<TestComponent>;
  let service: IconService;

  beforeEach(async () => {
    view = await render(TestComponent, [httpClientStub]);

    service = view.inject(IconService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should render the icon', async () => {
    const iconName = 'test-icon';
    const iconContent = '<svg>test</svg>';
    service.icons.set(iconName, iconContent);

    view.setInput('name', iconName);
    await view.whenStable();

    // we have to use queryRoot because the svg is not a angular element
    expect(view.queryRoot('svg')).toBeTruthy();
  });
});
