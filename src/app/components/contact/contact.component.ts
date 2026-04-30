import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ContactFormModel, ContactLinkModel } from '../../models/contact.model';

/**
 * ContactComponent
 *
 * Two-column contact section:
 * - Left: contact links (email, LinkedIn, GitHub)
 * - Right: contact form with send-state feedback
 *
 * The form uses template-driven binding via FormsModule (ngModel).
 */
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  protected readonly contactLinks: ContactLinkModel[] = [
    {
      icon: '✉️',
      label: 'Email',
      value: 'brandon@example.com',
      href: 'mailto:brandon@example.com',
      isExternal: false,
    },
    {
      icon: '💼',
      label: 'LinkedIn',
      value: 'linkedin.com/in/brandoncampos',
      href: 'https://linkedin.com',
      isExternal: true,
    },
    {
      icon: '🐙',
      label: 'GitHub',
      value: 'github.com/brandoncampos',
      href: 'https://github.com',
      isExternal: true,
    },
  ];

  protected readonly isSubmitted$ = new BehaviorSubject<boolean>(false);

  protected formData: ContactFormModel = {
    name:    '',
    email:   '',
    subject: '',
    message: '',
  };

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  protected onSubmit(): void {
    if (this.isSubmitted$.getValue()) return;

    this.isSubmitted$.next(true);
    this.changeDetectorRef.markForCheck();

    // Reset after 3 seconds to allow re-submission
    setTimeout(() => {
      this.isSubmitted$.next(false);
      this.formData = { name: '', email: '', subject: '', message: '' };
      this.changeDetectorRef.markForCheck();
    }, 3000);
  }
}
