import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface NavLinkModel {
  label: string;
  sectionId: string;
}

/**
 * NavComponent
 *
 * Fixed top navigation bar.
 * Uses IntersectionObserver to highlight the nav link
 * corresponding to the currently visible section.
 */
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent implements OnInit, OnDestroy {
  protected readonly navLinks: NavLinkModel[] = [
    { label: 'About',    sectionId: 'about'    },
    { label: 'Stack',    sectionId: 'stack'    },
    { label: 'Services', sectionId: 'services' },
    { label: 'Projects', sectionId: 'projects' },
    { label: 'Contact',  sectionId: 'contact'  },
  ];

  protected readonly activeSectionId$ = new BehaviorSubject<string>('home');

  private sectionIntersectionObserver!: IntersectionObserver;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initSectionObserver();
  }

  ngOnDestroy(): void {
    if (this.sectionIntersectionObserver) {
      this.sectionIntersectionObserver.disconnect();
    }
  }

  private initSectionObserver(): void {
    this.sectionIntersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            this.activeSectionId$.next(entry.target.id);
            this.changeDetectorRef.markForCheck();
          }
        });
      },
      { threshold: 0.4 }
    );

    const sectionElements = document.querySelectorAll('section[id]');
    sectionElements.forEach((sectionElement: Element) => {
      this.sectionIntersectionObserver.observe(sectionElement);
    });
  }

  protected isLinkActive(sectionId: string): boolean {
    return this.activeSectionId$.getValue() === sectionId;
  }
}
