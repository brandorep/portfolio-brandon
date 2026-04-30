import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * FooterComponent
 *
 * Simple bottom bar with logo and copyright.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly currentYear: number = new Date().getFullYear();
}
