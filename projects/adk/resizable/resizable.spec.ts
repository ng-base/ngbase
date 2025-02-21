import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DragData } from '@ngbase/adk/drag';
import { render, RenderResult } from '@ngbase/adk/test';
import { NgbResizable } from './resizable';
import { NgbResizableGroup } from './resizable-group';

@Component({
  imports: [NgbResizableGroup, NgbResizable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div ngbResizableGroup #resizableGroup>
      <!-- <ngb-resizable [size]="show() ? 50 : 0" />
      <ngb-resizable size="auto" /> -->
      <div ngbResizable [size]="show() ? '250px' : 0"></div>
      <div ngbResizable size="250px" min="50px" max="300px"></div>
      <div ngbResizable size="250px" min="50px"></div>
      <div ngbResizable></div>
      @if (showLast()) {
        <div ngbResizable size="250px" min="50px"></div>
      }
    </div>
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
  let resizables: NgbResizable[];
  let view: RenderResult<ResizableTestComponent>;

  beforeEach(async () => {
    view = await render(ResizableTestComponent);
    testComponent = view.host;
    resizables = view.viewChildren(NgbResizable);
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
    resizables = view.viewChildren(NgbResizable);
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
