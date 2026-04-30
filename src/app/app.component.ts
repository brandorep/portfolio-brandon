import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * AppComponent
 *
 * Root shell component. Responsibilities:
 * 1. Renders all page sections in order.
 * 2. Drives the cursor spotlight (smooth lerp via requestAnimationFrame)
 *    and the cursor dot (snappy direct position update).
 *
 * The spotlight and dot are declared in app.component.html and
 * their DOM elements are accessed via @ViewChild.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cursorSpotlight')
  private readonly cursorSpotlightRef!: ElementRef<HTMLDivElement>;

  @ViewChild('cursorDot')
  private readonly cursorDotRef!: ElementRef<HTMLDivElement>;

  private mouseX: number = -9999;
  private mouseY: number = -9999;
  private smoothX: number = -9999;
  private smoothY: number = -9999;
  private animationFrameId: number = 0;

  /** Bound listener references so we can remove them on destroy */
  private readonly mouseMoveHandler  = (event: MouseEvent): void => this.onMouseMove(event);
  private readonly mouseLeaveHandler = (): void => this.onMouseLeave();

  ngAfterViewInit(): void {
    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('mouseleave', this.mouseLeaveHandler);
    this.animationFrameId = requestAnimationFrame(
      (timestamp: number) => this.animateCursor(timestamp)
    );
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseleave', this.mouseLeaveHandler);
    cancelAnimationFrame(this.animationFrameId);
  }

  private onMouseMove(event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  private onMouseLeave(): void {
    this.mouseX = -9999;
    this.mouseY = -9999;
  }

  /**
   * RAF loop: spotlight smoothly lerps (0.12 factor) toward the real
   * cursor; the dot follows exactly with no lag for a snappier feel.
   */
  private animateCursor(_timestamp: number): void {
    // Lerp factor: 0.12 gives the spotlight a subtle lag behind the cursor
    const LERP_FACTOR = 0.12;
    this.smoothX += (this.mouseX - this.smoothX) * LERP_FACTOR;
    this.smoothY += (this.mouseY - this.smoothY) * LERP_FACTOR;

    const spotlightElement = this.cursorSpotlightRef?.nativeElement;
    const dotElement       = this.cursorDotRef?.nativeElement;

    if (spotlightElement) {
      spotlightElement.style.background =
        `radial-gradient(600px circle at ${this.smoothX}px ${this.smoothY}px, ` +
        `rgba(0,201,167,0.08) 0%, ` +
        `rgba(0,201,167,0.04) 30%, ` +
        `transparent 70%)`;
    }

    if (dotElement) {
      dotElement.style.left = `${this.mouseX}px`;
      dotElement.style.top  = `${this.mouseY}px`;
    }

    this.animationFrameId = requestAnimationFrame(
      (nextTimestamp: number) => this.animateCursor(nextTimestamp)
    );
  }
}
