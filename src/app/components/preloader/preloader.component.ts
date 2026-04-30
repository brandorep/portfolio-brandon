import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';

/**
 * PreloaderComponent
 *
 * Animates the SVG signature paths using strokeDashoffset technique,
 * tracks a glowing "pen dot" at the tip of the drawing stroke,
 * shows a progress bar, then fades out.
 *
 * Emits (loaded) when the exit animation completes so AppComponent
 * can clean up the body.is-loading class.
 */
@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreloaderComponent implements AfterViewInit, OnDestroy {
  @Output() readonly loaded = new EventEmitter<void>();

  @ViewChild('preloaderEl') private readonly preloaderRef!: ElementRef<HTMLDivElement>;
  @ViewChild('progressFill') private readonly progressFillRef!: ElementRef<HTMLDivElement>;
  @ViewChild('preloaderLabel') private readonly preloaderLabelRef!: ElementRef<HTMLDivElement>;
  @ViewChild('penDot') private readonly penDotRef!: ElementRef<HTMLDivElement>;
  @ViewChild('sigSvg') private readonly sigSvgRef!: ElementRef<SVGSVGElement>;
  @ViewChild('sigWrap') private readonly sigWrapRef!: ElementRef<HTMLDivElement>;

  /** IDs of the SVG paths, in drawing order */
  protected readonly pathIds: string[] = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'];

  /** Labels shown during the progress animation */
  private readonly labelStages: string[] = [
    'initializing...',
    'rendering...',
    'almost ready...',
    'done.',
  ];

  /** Total draw duration in milliseconds */
  private readonly DRAW_DURATION_MS: number = 3200;

  /** Pause after signature completes before exit fade */
  private readonly HOLD_AFTER_MS: number = 600;

  private animationFrameId: number = 0;
  private pathElements: SVGPathElement[] = [];
  private pathLengths: number[] = [];
  private totalPathLength: number = 0;
  private animationStartTime: number | null = null;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    document.body.classList.add('is-loading');

    // Collect path elements by ID and set up dasharray
    this.pathElements = this.pathIds.map((pathId: string) => {
      const pathElement = document.getElementById(pathId) as unknown as SVGPathElement;
      const pathLength = pathElement.getTotalLength();
      pathElement.style.strokeDasharray = String(pathLength);
      pathElement.style.strokeDashoffset = String(pathLength);
      return pathElement;
    });

    this.pathLengths = this.pathElements.map(
      (pathElement: SVGPathElement) => pathElement.getTotalLength()
    );

    this.totalPathLength = this.pathLengths.reduce(
      (sum: number, length: number) => sum + length,
      0
    );

    // Small delay so fonts/styles are painted before we start
    setTimeout(() => {
      this.animationFrameId = requestAnimationFrame(
        (timestamp: number) => this.animateDraw(timestamp)
      );
    }, 200);
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private animateDraw(timestamp: number): void {
    if (!this.animationStartTime) {
      this.animationStartTime = timestamp;
    }

    const elapsed = timestamp - this.animationStartTime;
    const rawProgress = Math.min(elapsed / this.DRAW_DURATION_MS, 1);

    // Ease-in-out cubic for natural pen feel
    const easedProgress =
      rawProgress < 0.5
        ? 4 * rawProgress * rawProgress * rawProgress
        : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

    const drawnLength = easedProgress * this.totalPathLength;

    // Update progress bar and label
    this.progressFillRef.nativeElement.style.width =
      (easedProgress * 100).toFixed(1) + '%';

    const labelIndex = Math.min(
      Math.floor(easedProgress * this.labelStages.length),
      this.labelStages.length - 1
    );
    this.preloaderLabelRef.nativeElement.textContent = this.labelStages[labelIndex];

    // Distribute the drawn length across paths in sequence
    let remainingDraw = drawnLength;
    let activePath: SVGPathElement | null = null;
    let activeDrawnLength = 0;

    this.pathElements.forEach((pathElement: SVGPathElement, pathIndex: number) => {
      const pathLength = this.pathLengths[pathIndex];

      if (remainingDraw <= 0) {
        // Not yet reached — keep fully hidden
        pathElement.style.strokeDashoffset = String(pathLength);
      } else if (remainingDraw >= pathLength) {
        // Fully drawn — offset = 0
        pathElement.style.strokeDashoffset = '0';
        remainingDraw -= pathLength;
      } else {
        // Partially drawn — this is the active tip
        pathElement.style.strokeDashoffset = String(pathLength - remainingDraw);
        activePath = pathElement;
        activeDrawnLength = remainingDraw;
        remainingDraw = 0;
      }
    });

    // Move the glowing pen dot to the current tip
    if (activePath) {
      this.updatePenDotPosition(activePath, activeDrawnLength);
    } else if (rawProgress >= 1) {
      const lastPath = this.pathElements[this.pathElements.length - 1];
      this.updatePenDotPosition(lastPath, this.pathLengths[this.pathLengths.length - 1]);
    }

    if (rawProgress < 1) {
      this.animationFrameId = requestAnimationFrame(
        (nextTimestamp: number) => this.animateDraw(nextTimestamp)
      );
    } else {
      this.onDrawComplete();
    }
  }

  private updatePenDotPosition(
    pathElement: SVGPathElement,
    drawnLength: number
  ): void {
    const clampedLength = Math.min(
      Math.max(drawnLength, 0),
      pathElement.getTotalLength()
    );
    const svgPoint = pathElement.getPointAtLength(clampedLength);
    const svgBounds = this.sigSvgRef.nativeElement.getBoundingClientRect();
    const wrapBounds = this.sigWrapRef.nativeElement.getBoundingClientRect();
    const viewBox = this.sigSvgRef.nativeElement.viewBox.baseVal;

    const scaleX = svgBounds.width / viewBox.width;
    const scaleY = svgBounds.height / viewBox.height;

    const penDotEl = this.penDotRef.nativeElement;
    penDotEl.style.left =
      svgBounds.left - wrapBounds.left + svgPoint.x * scaleX + 'px';
    penDotEl.style.top =
      svgBounds.top - wrapBounds.top + svgPoint.y * scaleY + 'px';
  }

  private onDrawComplete(): void {
    // Fade pen dot
    setTimeout(() => {
      this.penDotRef.nativeElement.style.opacity = '0';
    }, 200);

    // Exit preloader after hold delay
    setTimeout(() => {
      this.preloaderRef.nativeElement.classList.add('exit');
      document.body.classList.remove('is-loading');

      setTimeout(() => {
        this.preloaderRef.nativeElement.style.display = 'none';
        this.loaded.emit();
        this.changeDetectorRef.markForCheck();
      }, 950);
    }, this.HOLD_AFTER_MS);
  }
}
