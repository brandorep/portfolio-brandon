import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ProjectModel } from '../../models/project.model';

/**
 * ProjectsComponent
 *
 * Three-column grid of project cards with hover overlays.
 */
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  protected readonly projects: ProjectModel[] = [
    {
      name: 'Glim Solar',
      projectType: 'Landing Page · Solar Energy',
      tags: ['WordPress', 'SEO'],
      link: '#',
      placeholderLabel: 'Glim Solar',
      imageSrc: 'assets/images/glimsolar.png',
    },
    {
      name: 'Artesano Bed',
      projectType: 'E-Commerce · Home Decor',
      tags: ['E-Commerce', 'UX/UI'],
      link: '#',
      placeholderLabel: 'Artesano Bed',
      imageSrc: 'assets/images/artesanobed.png',
    },
    {
      name: 'Glim Roofing',
      projectType: 'Landing Page · Construction',
      tags: ['WordPress', 'Design'],
      link: '#',
      placeholderLabel: 'Glim Roofing',
      imageSrc: 'assets/images/glimroofing.png',
    },
  ];
}
