export interface ContactLinkModel {
  icon: string;
  label: string;
  value: string;
  href: string;
  isExternal: boolean;
}

export interface ContactFormModel {
  name: string;
  email: string;
  subject: string;
  message: string;
}
