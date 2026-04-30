import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * MarqueeComponent
 *
 * Infinite scrolling ticker showing client/project names.
 * Items are duplicated in the template to create a seamless loop.
 */
@Component({
  selector: 'app-marquee',
  templateUrl: './marquee.component.html',
  styleUrls: ['./marquee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarqueeComponent {
  /** Original set — duplicated in the template for seamless looping */
  protected readonly clientNames: string[] = [
    'Glim Solar',
    'DecoClub Store',
    'Capital Core IT',
    'Glim Roofing',
    'Artesano Bed',
    'PE-US Projects',
  ];
}
