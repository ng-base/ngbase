import { ResizableGroup } from './resizable-group';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Resizable } from './resizable';
import { DragData } from '../drag';
import { render, RenderResult } from '../test';

@Component({
  standalone: true,
  imports: [ResizableGroup, Resizable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mee-resizable-group #resizableGroup>
      <mee-resizable [size]="show() ? 50 : 0" />
      <mee-resizable size="auto" />
    </mee-resizable-group>
  `,
})
class ResizableTestComponent {
  show = signal<boolean>(true);

  toggle() {
    this.show.set(!this.show());
  }
}

describe('Resizables', () => {
  let testComponent: ResizableTestComponent;
  let components: readonly Resizable[];
  let view: RenderResult<ResizableTestComponent>;

  beforeEach(async () => {
    view = await render(ResizableTestComponent);
    testComponent = view.host;
    components = view.viewChildren(Resizable);
  });

  it('should create', () => {
    expect(components.length).toBe(2);
    const panel = components[0];
    jest.spyOn(panel, 'handleDrag');
    view.detectChanges();
    expect(panel.handleDrag).toHaveBeenCalled();
  });

  it('should last panel handleDrag be called', () => {
    const lastPanel = components[1];
    jest.spyOn(lastPanel, 'handleDrag');
    view.detectChanges();
    expect(lastPanel.handleDrag).toHaveBeenCalled();
  });

  it('should size change call handleDrag', () => {
    const panel = components[0];
    jest.spyOn(panel, 'handleDrag');
    testComponent.toggle();
    view.detectChanges();
    expect(panel.size()).toBe(0);
    expect(panel.handleDrag).toHaveBeenCalled();
  });

  it('should onDrag call handleDrag', () => {
    const panel = components[0];
    view.detectChanges();
    jest.spyOn(panel.resizable, 'setAuto');
    panel.handleDrag({ dx: -10, dy: 0 } as DragData);
    expect(panel.resizable.setAuto).toHaveBeenCalled();
    expect(panel['reducedSize']).toBe(10);
    expect(panel.str).toBe('calc(50% - 10px)');
    expect(components[1].str).toBe('calc(100% - calc(50% - 10px))');
  });
});
