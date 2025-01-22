import { injectService } from '@meeui/adk/test';
import { ICON_LOADER, IconService } from './icon.service';

describe('IconService', () => {
  let service: IconService;
  let mockLoader: jest.Mock;

  beforeEach(() => {
    mockLoader = jest.fn();
    service = injectService(IconService, [{ provide: ICON_LOADER, useValue: mockLoader }]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return cached icon if available', async () => {
    const iconName = 'test-icon';
    const iconContent = '<svg>test</svg>';
    service.icons.set(iconName, iconContent);

    const result = await service.getIcon(iconName);
    expect(result).toBe(iconContent);
  });

  it('should deduplicate concurrent requests for the same icon', async () => {
    const iconName = 'concurrent-icon';
    const iconContent = '<svg>concurrent</svg>';
    mockLoader.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(iconContent), 1)),
    );

    const promises = [
      service.getIcon(iconName),
      service.getIcon(iconName),
      service.getIcon(iconName),
    ];

    const results = await Promise.all(promises);
    expect(results).toEqual([iconContent, iconContent, iconContent]);
    expect(mockLoader).toHaveBeenCalledTimes(1);
  });
});
