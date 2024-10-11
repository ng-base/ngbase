import { DOCUMENT } from '@angular/common';
import { AccessiblityService } from './accessiblity.service';
import { AccessibleGroup } from './accessiblity-group.directive';
import { injectService } from '../test';

describe('AccessibilityService', () => {
  let service: AccessiblityService;
  let mockDocument: Document;

  beforeEach(() => {
    mockDocument = document.implementation.createHTMLDocument();

    service = injectService(AccessiblityService, [
      AccessiblityService,
      { provide: DOCUMENT, useValue: mockDocument },
    ]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('active group management', () => {
    it('should set and remove active groups', () => {
      service.setActiveGroup('group1');
      service.setActiveGroup('group2');
      expect(service.isActive('group2')).toBe(true);

      service.removeActiveGroup('group2');
      expect(service.isActive('group1')).toBe(true);
    });

    it('should get the previous group', () => {
      const mockGroup1 = {} as AccessibleGroup;
      const mockGroup2 = {} as AccessibleGroup;

      service.addGroup('group1', mockGroup1);
      service.addGroup('group2', mockGroup2);

      service.setActiveGroup('group1');
      service.setActiveGroup('group2');

      expect(service.getPreviousGroup()).toBe(mockGroup1);
    });
  });

  describe('group management', () => {
    it('should add and remove groups', () => {
      const mockGroup = {} as AccessibleGroup;
      service.addGroup('testGroup', mockGroup);
      expect(service.getGroup('testGroup')).toBe(mockGroup);

      service.removeGroup('testGroup');
      expect(service.getGroup('testGroup')).toBeUndefined();
    });
  });

  describe('mouse and keyboard interaction', () => {
    it('should update usingMouse flag on mouse and keyboard events', () => {
      mockDocument.dispatchEvent(new MouseEvent('mousedown'));
      expect(service.usingMouse).toBe(true);

      mockDocument.dispatchEvent(new KeyboardEvent('keydown'));
      expect(service.usingMouse).toBe(false);
    });
  });

  // Add more test cases here to cover other scenarios and edge cases
});
