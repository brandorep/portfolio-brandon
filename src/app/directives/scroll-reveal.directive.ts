import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

/**
 * ScrollRevealDirective
 *
 * Adds the CSS class 'visible' to the host element when it enters
 * the viewport, triggering the .reveal transition defined in styles.scss.
 *
 * Usage:
 *   <div class="reveal" appScrollReveal></div>
 *   <div class="reveal reveal-delay-2" appScrollReveal></div>
 */
@Directive({
  selector: '[appScrollReveal]',
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  /** Percentage of element visible before triggering (0.0 – 1.0) */
  @Input() revealThreshold: number = 0.12;

  /** Root margin offset so reveal triggers slightly before fully entering */
  @Input() revealRootMargin: string = '0px 0px -50px 0px';

  private intersectionObserver!: IntersectionObserver;

  constructor(private readonly hostElementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.intersectionObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: this.revealThreshold,
        rootMargin: this.revealRootMargin,
      }
    );

    this.intersectionObserver.observe(this.hostElementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.intersectionObserver.disconnect();
  }
}
