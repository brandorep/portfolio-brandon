import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// ── Root component ──
import { AppComponent } from './app.component';

// ── Directives ──
import { ScrollRevealDirective } from './directives/scroll-reveal.directive';

// ── Components ──
import { PreloaderComponent }      from './components/preloader/preloader.component';
import { NavComponent }            from './components/nav/nav.component';
import { HeroComponent }           from './components/hero/hero.component';
import { MarqueeComponent }        from './components/marquee/marquee.component';
import { AboutComponent }          from './components/about/about.component';
import { StackComponent }          from './components/stack/stack.component';
import { ServicesComponent }       from './components/services/services.component';
import { ProjectsComponent }       from './components/projects/projects.component';
import { ContactComponent }        from './components/contact/contact.component';
import { FooterComponent }         from './components/footer/footer.component';
import { HackerTerminalComponent } from './components/hacker-terminal/hacker-terminal.component';

/**
 * AppModule
 *
 * Root NgModule following the classic module-based Angular architecture.
 *
 * Declarations:
 *   Every component and directive that belongs to this feature scope
 *   must be listed here exactly once.
 *
 * Imports:
 *   - BrowserModule  : provides CommonModule + platform bootstrap utilities
 *   - CommonModule   : NgIf, NgFor, AsyncPipe (needed for standalone pipes
 *                      in some Angular 18 builds; safe to include always)
 *   - FormsModule    : two-way [(ngModel)] binding used in ContactComponent
 */
@NgModule({
  declarations: [
    AppComponent,

    // Directives
    ScrollRevealDirective,

    // Components
    PreloaderComponent,
    NavComponent,
    HeroComponent,
    MarqueeComponent,
    AboutComponent,
    StackComponent,
    ServicesComponent,
    ProjectsComponent,
    ContactComponent,
    FooterComponent,
    HackerTerminalComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
