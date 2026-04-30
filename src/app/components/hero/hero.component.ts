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
    { label: 'Angular' },
    { label: 'React'   },
    { label: 'Node.js' },
    { label: 'Figma'   },
    { label: 'C#'      },
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
