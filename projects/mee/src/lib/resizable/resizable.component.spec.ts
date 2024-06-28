import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResizableGroup } from './resizable-group.component';
import { ChangeDetectionStrategy, Component, signal, viewChildren } from '@angular/core';
import { Resizable } from './resizable.component';
import { DragData } from '../drag';

@Component({
  template: `
    <mee-resizable-group #resizableGroup>
      <mee-resizable [size]="show() ? 50 : 0"></mee-resizable>
      <mee-resizable size="auto"></mee-resizable>
    </mee-resizable-group>
  `,
  standalone: true,
  imports: [ResizableGroup, Resizable],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ResizableTestComponent {
  resizableGroup = viewChildren<Resizable>(Resizable);

  show = signal<boolean>(true);

  toggle() {
    this.show.set(!this.show());
  }
}

describe('Resizables', () => {
  let testComponent: ResizableTestComponent;
  let components: readonly Resizable[];
  let fixture: ComponentFixture<ResizableTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResizableTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResizableTestComponent);
    testComponent = fixture.componentInstance;
    components = fixture.componentInstance.resizableGroup();
  });

  it('should create', () => {
    expect(components.length).toBe(2);
    const panel = components[0];
    jest.spyOn(panel, 'handleDrag');
    fixture.detectChanges();
    expect(panel.handleDrag).toHaveBeenCalled();
  });

  it('should last panel handleDrag be called', () => {
    const lastPanel = components[1];
    jest.spyOn(lastPanel, 'handleDrag');
    fixture.detectChanges();
    expect(lastPanel.handleDrag).toHaveBeenCalled();
  });

  it('should size change call handleDrag', () => {
    const panel = components[0];
    jest.spyOn(panel, 'handleDrag');
    testComponent.toggle();
    fixture.detectChanges();
    expect(panel.size()).toBe(0);
    expect(panel.handleDrag).toHaveBeenCalled();
  });

  it('should onDrag call handleDrag', () => {
    const panel = components[0];
    fixture.detectChanges();
    jest.spyOn(panel.resizable, 'setAuto');
    panel.handleDrag({ xx: -10, yy: 0 } as DragData);
    expect(panel.resizable.setAuto).toHaveBeenCalled();
    expect(panel.reducedSize).toBe(10);
    expect(panel.str).toBe('calc(50% - 10px)');
    expect(components[1].str).toBe('calc(100% - calc(50% - 10px))');
  });
});
