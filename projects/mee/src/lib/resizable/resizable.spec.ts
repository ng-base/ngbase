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
      <!-- <mee-resizable [size]="show() ? 50 : 0" />
      <mee-resizable size="auto" /> -->
      <mee-resizable [size]="show() ? '250px' : 0" />
      <mee-resizable size="250px" min="50px" max="300px" />
      <mee-resizable size="250px" min="50px" />
      <mee-resizable />
      @if (showLast()) {
        <mee-resizable size="250px" min="50px" />
      }
    </mee-resizable-group>
  `,
})
class ResizableTestComponent {
  readonly show = signal<boolean>(true);
  readonly showLast = signal<boolean>(true);

  toggle() {
    this.show.set(!this.show());
  }
  toggleShowLast() {
    this.showLast.set(!this.showLast());
  }
}

describe('Resizables', () => {
  let testComponent: ResizableTestComponent;
  let resizables: Resizable[];
  let view: RenderResult<ResizableTestComponent>;

  beforeEach(async () => {
    view = await render(ResizableTestComponent);
    testComponent = view.host;
    resizables = view.viewChildren(Resizable);
  });

  function drag(
    index: number,
    x: number,
    event: 'start' | 'move' | 'end',
    direction: 'left' | 'right' = 'left',
  ) {
    resizables[index].onDrag({ x: x, y: 0, type: event, direction } as DragData);
  }

  it('should create', async () => {
    const panel = resizables[0];
    jest.spyOn(panel, 'handleDrag');
    await view.whenStable();
    resizables = view.viewChildren(Resizable);
    expect(resizables.length).toBe(5);
    view.detectChanges();
    expect(panel.handleDrag).toHaveBeenCalled();
  });

  it('should last panel handleDrag be called', () => {
    const lastPanel = resizables[1];
    jest.spyOn(lastPanel, 'handleDrag');
    view.detectChanges();
    expect(lastPanel.handleDrag).toHaveBeenCalled();
  });

  it('should size change call handleDrag', () => {
    const panel = resizables[0];
    jest.spyOn(panel, 'handleDrag');
    testComponent.toggle();
    view.detectChanges();
    expect(panel.size()).toBe(0);
    expect(panel.handleDrag).toHaveBeenCalled();
  });

  // it('should onDrag call handleDrag', () => {
  //   const panel = resizables[0];
  //   view.detectChanges();
  //   jest.spyOn(panel.resizable, 'setAuto');
  //   drag(0, -10, 'start');
  //   expect(panel.resizable.setAuto).toHaveBeenCalled();
  //   expect(panel['reducedSize']).toBe(10);
  //   expect(panel.str).toBe('calc(50% - 10px)');
  //   expect(resizables[1].str).toBe('calc(100% - calc(50% - 10px))');
  // });

  it('should handle the size of the panels on drag left', async () => {
    await view.whenStable();
    resizables.forEach(r => {
      jest.spyOn(r, 'cSize').mockReturnValue(250);
    });

    drag(0, 0, 'start');
    drag(0, -10, 'move');
    validate([10, -10, -0, -0, 0]);
    drag(0, -210, 'move');
    validate([210, -50, -160, -0, 0]);
    drag(0, -210, 'end');
    validate([210, -50, -160, -0, 0]);
  });

  function validate(values: number[]) {
    for (let i = 0; i < resizables.length; i++) {
      expect(resizables[i]['reducedSize']).toBe(values[i]);
    }
  }

  it('should handle the size of the panels on drag right', async () => {
    await view.whenStable();
    resizables.forEach(r => {
      jest.spyOn(r, 'cSize').mockReturnValue(250);
    });

    drag(0, 0, 'start');
    drag(0, 10, 'move');
    validate([-10, 10, -0, -0, 0]);
    drag(0, 210, 'move');
    validate([-210, 200, 10, -0, 0]);
    drag(0, 210, 'end');
    validate([-210, 200, 10, -0, 0]);
  });
});
