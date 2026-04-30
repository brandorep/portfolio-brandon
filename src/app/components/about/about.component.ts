import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SkillCardModel } from '../../models/skill-card.model';

/**
 * AboutComponent
 *
 * Two-column section: bio text on the left, skill card grid on the right.
 */
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  protected readonly skillCards: SkillCardModel[] = [
    { icon: '🎨', name: 'UI/UX Design',      technologies: 'Figma · Adobe XD'      },
    { icon: '⚡', name: 'Frontend Dev',       technologies: 'Angular · React · TS'  },
    { icon: '🛠️', name: 'Backend Dev',        technologies: 'Node.js · C# · .NET'  },
    { icon: '🔍', name: 'SEO & Performance',  technologies: 'Core Web Vitals'       },
    { icon: '🗄️', name: 'Databases',          technologies: 'PostgreSQL · MongoDB'  },
    { icon: '☁️', name: 'DevOps',             technologies: 'Docker · AWS · CI/CD' },
  ];
}
