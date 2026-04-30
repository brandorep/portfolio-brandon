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
    },
    {
      name: 'DecoClub Store',
      projectType: 'E-Commerce · Home Decor',
      tags: ['E-Commerce', 'UX/UI'],
      link: '#',
      placeholderLabel: 'DecoClub Store',
    },
    {
      name: 'Glim Roofing',
      projectType: 'Landing Page · Construction',
      tags: ['WordPress', 'Design'],
      link: '#',
      placeholderLabel: 'Glim Roofing',
    },
  ];
}
