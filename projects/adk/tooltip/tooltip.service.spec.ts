import { injectService } from '@ngbase/adk/test';
import { TooltipService } from './tooltip.service';
import { createMockElement } from '../popover/utils.spec';
import { Component } from '@angular/core';
import { NgbTooltipTemplate } from './tooltip';

@Component({
  template: `{{ content() }}`,
})
class TestComponent extends NgbTooltipTemplate {}

describe('TooltipService', () => {
  let service: TooltipService;

  beforeEach(async () => {
    service = injectService(TooltipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should destroy if position is different', () => {
    const el = createMockElement({ width: 150, height: 30, top: 20 });
    jest.spyOn(service, 'destroy');
    service.insert(el, 'test', 'bottom', () => {}, TestComponent);
    expect(service.destroy).not.toHaveBeenCalled();
    service.insert(el, 'test123', 'bottom', () => {}, TestComponent);
    expect(service.destroy).not.toHaveBeenCalled();
    service.insert(el, 'test', 'top', () => {}, TestComponent);
    expect(service.destroy).toHaveBeenCalled();
  });
});
