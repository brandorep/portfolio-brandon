import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TerminalLineModel, TerminalLineType } from '../../models/terminal-line.model';

/**
 * HackerTerminalComponent
 *
 * Floating 3D terminal panel that slides in after the user scrolls
 * past 45% of the viewport height. Displays rotating sequences of
 * terminal-style output lines animated with per-line delays.
 *
 * Features:
 * - Scroll-triggered appearance via window scroll listener
 * - Minimise / reopen via a slide-out tab
 * - 3D tilt effect on mousemove
 * - Clean timeout tracking for safe teardown on ngOnDestroy
 */
@Component({
  selector: 'app-hacker-terminal',
  templateUrl: './hacker-terminal.component.html',
  styleUrls: ['./hacker-terminal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HackerTerminalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('terminalPanel')
  private readonly terminalPanelRef!: ElementRef<HTMLDivElement>;

  @ViewChild('terminalInner')
  private readonly terminalInnerRef!: ElementRef<HTMLDivElement>;

  @ViewChild('terminalBody')
  private readonly terminalBodyRef!: ElementRef<HTMLDivElement>;

  protected readonly isVisible$    = new BehaviorSubject<boolean>(false);
  protected readonly isMinimized$  = new BehaviorSubject<boolean>(false);
  protected readonly showReopenTab$ = new BehaviorSubject<boolean>(false);

  /** Lines rendered in the DOM via @for, rebuilt on each sequence change */
  protected renderedLines: TerminalLineModel[] = [];

  private readonly terminalSequences: TerminalLineModel[][] = [
    [
      { lineType: 'cmd',  text: '❯ nmap -sV brandoncampos.dev',            delayMs: 0    },
      { lineType: 'dim',  text: 'Starting Nmap 7.94 scan...',              delayMs: 600  },
      { lineType: 'out',  text: 'PORT    STATE  SERVICE  VERSION',         delayMs: 900  },
      { lineType: 'ok',   text: '80/tcp  open   http     nginx 1.25',      delayMs: 1100 },
      { lineType: 'ok',   text: '443/tcp open   https    TLSv1.3',         delayMs: 1300 },
      { lineType: 'out',  text: '3000/tcp open  node.js  v20.11.0',        delayMs: 1500 },
      { lineType: 'dim',  text: 'Nmap done. 1 IP address scanned.',        delayMs: 1900 },
    ],
    [
      { lineType: 'cmd',  text: '❯ git log --oneline -6',                  delayMs: 0    },
      { lineType: 'out',  text: 'a3f91bc feat: add SignalR real-time',     delayMs: 500  },
      { lineType: 'out',  text: '7b2e044 fix: ChangeDetectorRef leak',     delayMs: 700  },
      { lineType: 'out',  text: 'c91a02f refactor: NgRx store cleanup',    delayMs: 900  },
      { lineType: 'ok',   text: '4de12fd feat: orbit animation engine',    delayMs: 1100 },
      { lineType: 'out',  text: '0fa33b1 style: cursor spotlight fx',      delayMs: 1300 },
      { lineType: 'warn', text: 'e88cd3a wip: 3d hacker terminal ui',      delayMs: 1500 },
    ],
    [
      { lineType: 'cmd',  text: '❯ docker ps --format "table {{.Names}}"', delayMs: 0    },
      { lineType: 'dim',  text: 'CONTAINER ID   IMAGE          STATUS',    delayMs: 500  },
      { lineType: 'ok',   text: 'portfolio-fe   node:20-alpine Up 3h',     delayMs: 700  },
      { lineType: 'ok',   text: 'api-backend    mcr.net/dotnet Up 3h',     delayMs: 900  },
      { lineType: 'ok',   text: 'postgres-db    postgres:16    Up 3h',     delayMs: 1100 },
      { lineType: 'ok',   text: 'nginx-proxy    nginx:alpine   Up 3h',     delayMs: 1300 },
      { lineType: 'dim',  text: '4 containers running.',                   delayMs: 1700 },
    ],
    [
      { lineType: 'cmd',  text: '❯ ng build --configuration=production',   delayMs: 0    },
      { lineType: 'dim',  text: '✔ Browser application bundle complete.',  delayMs: 700  },
      { lineType: 'out',  text: 'Initial chunk files | Names | Raw size',  delayMs: 1000 },
      { lineType: 'out',  text: 'main.js             |       | 342.18 kB', delayMs: 1200 },
      { lineType: 'out',  text: 'styles.css          |       |  28.42 kB', delayMs: 1400 },
      { lineType: 'ok',   text: '✔ Build at dist/ — 2.34s',               delayMs: 1900 },
    ],
    [
      { lineType: 'cmd',  text: '❯ curl -s https://api.brandon.dev/health', delayMs: 0   },
      { lineType: 'dim',  text: 'Connecting to api.brandon.dev...',         delayMs: 400 },
      { lineType: 'ok',   text: '{ "status": "healthy",',                  delayMs: 800  },
      { lineType: 'ok',   text: '  "uptime": "99.98%",',                   delayMs: 1000 },
      { lineType: 'ok',   text: '  "env": "production",',                  delayMs: 1200 },
      { lineType: 'ok',   text: '  "version": "2.4.1" }',                  delayMs: 1400 },
      { lineType: 'dim',  text: 'Response: 200 OK — 18ms',                 delayMs: 1800 },
    ],
  ];

  private currentSequenceIndex: number = 0;
  private lineTimeoutIds: ReturnType<typeof setTimeout>[] = [];
  private loopTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private hasBeenShownOnce: boolean = false;

  private readonly scrollHandler = (): void => this.onWindowScroll();

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollHandler);
    this.clearAllTimeouts();
  }

  protected onCloseTerminal(): void {
    this.isMinimized$.next(true);
    this.isVisible$.next(false);
    this.clearAllTimeouts();

    setTimeout(() => {
      this.showReopenTab$.next(true);
      this.changeDetectorRef.markForCheck();
    }, 400);
  }

  protected onReopenTerminal(): void {
    this.showReopenTab$.next(false);
    this.isMinimized$.next(false);
    this.isVisible$.next(true);
    this.changeDetectorRef.markForCheck();
    this.renderTerminalSequence(this.currentSequenceIndex);
  }

  protected onTerminalMouseMove(mouseEvent: MouseEvent): void {
    const terminalBounds = this.terminalPanelRef.nativeElement.getBoundingClientRect();
    const relativeX =
      (mouseEvent.clientX - terminalBounds.left) / terminalBounds.width - 0.5;
    const relativeY =
      (mouseEvent.clientY - terminalBounds.top) / terminalBounds.height - 0.5;

    this.terminalInnerRef.nativeElement.style.transform =
      `rotateY(${relativeX * 10}deg) rotateX(${-relativeY * 6}deg)`;
  }

  protected onTerminalMouseLeave(): void {
    this.terminalInnerRef.nativeElement.style.transform = '';
  }

  protected lineTypeClass(lineType: TerminalLineType): string {
    return `hacker-line ${lineType}`;
  }

  private onWindowScroll(): void {
    const scrollThreshold = window.innerHeight * 0.45;
    const hasScrolledPastThreshold = window.scrollY > scrollThreshold;
    const isCurrentlyMinimized = this.isMinimized$.getValue();

    if (hasScrolledPastThreshold && !this.hasBeenShownOnce && !isCurrentlyMinimized) {
      this.hasBeenShownOnce = true;
      this.isVisible$.next(true);
      this.changeDetectorRef.markForCheck();
      this.renderTerminalSequence(this.currentSequenceIndex);
    }
  }

  private renderTerminalSequence(sequenceIndex: number): void {
    this.clearAllTimeouts();
    this.renderedLines = [];
    this.changeDetectorRef.markForCheck();

    const currentSequence = this.terminalSequences[sequenceIndex];

    currentSequence.forEach((terminalLine: TerminalLineModel) => {
      const timeoutId = setTimeout(() => {
        this.renderedLines = [...this.renderedLines, terminalLine];
        this.changeDetectorRef.markForCheck();

        // Auto-scroll body to bottom
        const bodyEl = this.terminalBodyRef.nativeElement;
        bodyEl.scrollTop = bodyEl.scrollHeight;
      }, terminalLine.delayMs);

      this.lineTimeoutIds.push(timeoutId);
    });

    const lastLineDelay = currentSequence[currentSequence.length - 1].delayMs;

    this.loopTimeoutId = setTimeout(() => {
      this.currentSequenceIndex =
        (this.currentSequenceIndex + 1) % this.terminalSequences.length;
      this.renderTerminalSequence(this.currentSequenceIndex);
    }, lastLineDelay + 3500);
  }

  private clearAllTimeouts(): void {
    this.lineTimeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    this.lineTimeoutIds = [];

    if (this.loopTimeoutId !== null) {
      clearTimeout(this.loopTimeoutId);
      this.loopTimeoutId = null;
    }
  }
}
