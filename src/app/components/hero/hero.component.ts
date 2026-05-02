import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface HeroStatModel {
  value: string;
  label: string;
}

interface HeroTagModel {
  label: string;
  iconSrc: string;
  top: string;
  left?: string;
  right?: string;
  size?: string;
  delay?: string;
}

/**
 * HeroComponent
 *
 * Full-screen landing section with:
 * - Animated typewriter role effect (RxJS-driven)
 * - Floating tech tags
 * - Animated orb visual
 * - Stats row
 */
@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  protected readonly roles: string[] = [
    'Full Stack Developer',
    'UX/UI Designer',
    'Creative Builder',
    'Problem Solver',
  ];

  protected readonly floatingTags: HeroTagModel[] = [
    { label: 'Angular', iconSrc: 'assets/icon/Group%202408.png', top: '8%', left: '10%', size: '56px', delay: '0s' },
    { label: 'React', iconSrc: 'assets/icon/Group%202409.png', top: '5%', right: '15%', size: '52px', delay: '0.8s' },
    { label: 'Node.js', iconSrc: 'assets/icon/Group%202410.png', top: '20%', left: '-2%', size: '54px', delay: '1.2s' },
    { label: 'Figma', iconSrc: 'assets/icon/Group%202411.png', top: '18%', right: '2%', size: '58px', delay: '0.4s' },
    { label: 'C#', iconSrc: 'assets/icon/Group%202412.png', top: '42%', left: '6%', size: '50px', delay: '1.5s' },
    { label: 'HTML', iconSrc: 'assets/icon/Group%202413.png', top: '38%', right: '8%', size: '56px', delay: '0.2s' },
    { label: 'JavaScript', iconSrc: 'assets/icon/Group%202414.png', top: '62%', left: '12%', size: '54px', delay: '1s' },
    { label: 'MongoDB', iconSrc: 'assets/icon/Group%202415.png', top: '58%', right: '10%', size: '52px', delay: '0.6s' },
    { label: 'PostgreSQL', iconSrc: 'assets/icon/Group%202416.png', top: '78%', left: '8%', size: '48px', delay: '1.3s' },
    { label: 'GitHub', iconSrc: 'assets/icon/Group%202418.png', top: '0%', left: '28%', size: '52px', delay: '0.1s' },
    { label: 'Firebase', iconSrc: 'assets/icon/Group%202419.png', top: '3%', right: '38%', size: '54px', delay: '1.1s' },
    { label: 'TypeScript', iconSrc: 'assets/icon/Group%202420.png', top: '48%', left: '-4%', size: '56px', delay: '0.7s' },
    { label: 'Tailwind', iconSrc: 'assets/icon/Group%202421.png', top: '52%', right: '-2%', size: '54px', delay: '1.4s' },
    { label: 'WordPress', iconSrc: 'assets/icon/Group%202422.png', top: '90%', left: '44%', size: '50px', delay: '0.3s' },
    { label: 'Docker', iconSrc: 'assets/icon/Group%202423.png', top: '85%', right: '28%', size: '52px', delay: '1.6s' },
    { label: 'Astro', iconSrc: 'assets/icon/Group%202425.png', top: '86%', left: '28%', size: '48px', delay: '0.5s' },
    { label: 'Sass', iconSrc: 'assets/icon/Group%202426.png', top: '68%', right: '0%', size: '50px', delay: '1.2s' },
    { label: 'Vector', iconSrc: 'assets/icon/Vector%20144.png', top: '82%', right: '8%', size: '46px', delay: '0.9s' },
  ];

  protected readonly stats: HeroStatModel[] = [
    { value: '3+',  label: 'Years experience'   },
    { value: '15+', label: 'Projects delivered' },
    { value: '5+',  label: 'Happy clients'      },
  ];

  protected displayedRole: string = '';

  private currentRoleIndex: number = 0;
  private currentCharIndex: number = 0;
  private isDeleting: boolean = false;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.runTypeLoop();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private runTypeLoop(): void {
    const currentRole = this.roles[this.currentRoleIndex];

    if (this.isDeleting) {
      this.displayedRole = currentRole.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
    } else {
      this.displayedRole = currentRole.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
    }

    this.changeDetectorRef.markForCheck();

    if (!this.isDeleting && this.currentCharIndex === currentRole.length) {
      // Pause at full word before starting to delete
      timer(1800)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.isDeleting = true;
          this.runTypeLoop();
        });
      return;
    }

    if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
    }

    const delayMs = this.isDeleting ? 50 : 80;

    timer(delayMs)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.runTypeLoop());
  }
}
