import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ServiceModel } from '../../models/service.model';

/**
 * ServicesComponent
 *
 * Grid of four service offering cards with hover effects.
 */
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  protected readonly services: ServiceModel[] = [
    {
      number: '01',
      icon: '🎨',
      title: 'Web Design',
      description:
        'Visually stunning, user-centered designs built in Figma and WordPress. ' +
        'I craft interfaces that convert visitors into customers.',
    },
    {
      number: '02',
      icon: '🔍',
      title: 'SEO Optimization',
      description:
        'Data-driven search engine optimization strategies that increase your ' +
        'organic visibility and drive qualified traffic to your business.',
    },
    {
      number: '03',
      icon: '✏️',
      title: 'UI/UX Design',
      description:
        'Research-driven user experience design. From wireframes to high-fidelity ' +
        'prototypes — I design systems that users love.',
    },
    {
      number: '04',
      icon: '💻',
      title: 'Web Development',
      description:
        'Full-stack development with Angular, React, Node.js and .NET. Scalable, ' +
        'performant applications built to production standards.',
    },
  ];
}
