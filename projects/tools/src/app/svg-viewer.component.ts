import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Input } from "@meeui/input";
import { ResizableGroup, Resizable } from "@meeui/resizable";

@Component({
    standalone: true,
    selector: 'app-svg-viewer',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, Input, ResizableGroup, Resizable],
    template: `
    <mee-resizable-group>
        <mee-resizable [size]="40">
            <textarea meeInput class="w-full h-full" [(ngModel)]="svg"></textarea>
        </mee-resizable>
        <mee-resizable [size]="60">
            <div [innerHTML]="safeSvg()"></div>
        </mee-resizable>
</mee-resizable-group>
    `
})
export class SvgViewerComponent {
    sanitise = inject(DomSanitizer);
    svg = signal('');
    safeSvg = computed(() => {
        return this.sanitise.bypassSecurityTrustHtml(this.svg());
    });
}