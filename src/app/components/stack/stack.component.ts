import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { OrbitIconConfig, OrbitIconState } from '../../models/orbit-icon.model';

/** Half of the icon element size in px (56px ÷ 2) — used for centering offset */
const ICON_HALF_SIZE_PX = 28;

/**
 * StackComponent
 *
 * Renders a three-ring orbit animation of tech icons.
 * The animation engine runs via requestAnimationFrame and is
 * paused on mouseenter / resumed on mouseleave.
 *
 * Icon positions are driven purely by TypeScript — no inline styles
 * are set in the template; they are applied directly to the DOM
 * elements via ElementRef after ViewInit to avoid ExpressionChanged errors.
 */
@Component({
  selector: 'app-stack',
  templateUrl: './stack.component.html',
  styleUrls: ['./stack.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('orbitIcon')
  private readonly orbitIconElements!: QueryList<ElementRef<HTMLDivElement>>;

  protected readonly orbitIconConfigs: OrbitIconConfig[] = [
    // Ring 1 — radius 110px, speed 0.4
    { label: 'Angular',      iconSrc: 'assets/images/angular-icon 2.png',     orbitRadius: 110, speed: 0.4,  offsetDegrees: 0   },
    { label: 'React',        iconSrc: 'assets/images/react 2.png',            orbitRadius: 110, speed: 0.4,  offsetDegrees: 90  },
    { label: 'Node.js',      iconSrc: 'assets/images/nodejs-icon 2.png',      orbitRadius: 110, speed: 0.4,  offsetDegrees: 180 },
    { label: 'Figma',        iconSrc: 'assets/images/figma 4.png',            orbitRadius: 110, speed: 0.4,  offsetDegrees: 270 },
    // Ring 2 — radius 170px, speed 0.25
    { label: 'JavaScript',   iconSrc: 'assets/images/javascript 2.png',       orbitRadius: 170, speed: 0.25, offsetDegrees: 30  },
    { label: 'MongoDB',      iconSrc: 'assets/images/mongodb-icon 2.png',     orbitRadius: 170, speed: 0.25, offsetDegrees: 90  },
    { label: 'PostgreSQL',   iconSrc: 'assets/images/postgresql 2.png',       orbitRadius: 170, speed: 0.25, offsetDegrees: 150 },
    { label: 'PHP',          iconSrc: 'assets/images/php 2.png',              orbitRadius: 170, speed: 0.25, offsetDegrees: 210 },
    { label: 'WordPress',    iconSrc: 'assets/images/wordpress-icon 2.png',    orbitRadius: 170, speed: 0.25, offsetDegrees: 270 },
    { label: 'MySQL',        iconSrc: 'assets/images/mysql-icon 2.png',        orbitRadius: 170, speed: 0.25, offsetDegrees: 330 },
    // Ring 3 — radius 210px, speed 0.15
    { label: 'Tailwind CSS', iconSrc: 'assets/images/tailwindcss-icon 2.png',  orbitRadius: 210, speed: 0.15, offsetDegrees: 15  },
    { label: 'Sass',         iconSrc: 'assets/images/sass 2.png',              orbitRadius: 210, speed: 0.15, offsetDegrees: 135 },
    { label: 'GitHub',       iconSrc: 'assets/images/github-icon 2.png',      orbitRadius: 210, speed: 0.15, offsetDegrees: 255 },
  ];

  private orbitIconStates: OrbitIconState[] = [];
  private animationFrameId: number = 0;
  private lastTimestamp: number | null = null;
  private isAnimationPaused: boolean = false;

  ngAfterViewInit(): void {
    const iconElementArray = this.orbitIconElements.toArray();

    // Build mutable state objects that combine config + current angle + DOM element
    this.orbitIconStates = this.orbitIconConfigs.map(
      (iconConfig: OrbitIconConfig, iconIndex: number) => ({
        ...iconConfig,
        angleDegrees: iconConfig.offsetDegrees,
        element: iconElementArray[iconIndex]?.nativeElement ?? null,
      })
    );

    // Position all icons centered in the orbit container
    this.orbitIconStates.forEach((iconState: OrbitIconState) => {
      if (iconState.element) {
        iconState.element.style.position = 'absolute';
        iconState.element.style.left = '50%';
        iconState.element.style.top = '50%';
      }
    });

    this.animationFrameId = requestAnimationFrame(
      (timestamp: number) => this.tick(timestamp)
    );
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  protected onOrbitMouseEnter(): void {
    this.isAnimationPaused = true;
  }

  protected onOrbitMouseLeave(): void {
    this.isAnimationPaused = false;
    // Reset delta to avoid a position jump after the pause
    this.lastTimestamp = null;
  }

  private tick(timestamp: number): void {
    if (this.lastTimestamp === null) {
      this.lastTimestamp = timestamp;
    }

    const deltaSeconds = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    if (!this.isAnimationPaused) {
      this.orbitIconStates.forEach((iconState: OrbitIconState) => {
        // Counter-clockwise rotation: subtract angle over time
        iconState.angleDegrees -= iconState.speed * deltaSeconds * 60;

        const angleRadians = iconState.angleDegrees * (Math.PI / 180);
        const xPosition = iconState.orbitRadius * Math.cos(angleRadians) - ICON_HALF_SIZE_PX;
        const yPosition = iconState.orbitRadius * Math.sin(angleRadians) - ICON_HALF_SIZE_PX;

        if (iconState.element) {
          iconState.element.style.transform =
            `translate(${xPosition}px, ${yPosition}px)`;
        }
      });
    }

    this.animationFrameId = requestAnimationFrame(
      (nextTimestamp: number) => this.tick(nextTimestamp)
    );
  }
}
