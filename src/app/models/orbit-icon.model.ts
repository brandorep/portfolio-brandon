export interface OrbitIconConfig {
  label: string;
  orbitRadius: number;
  speed: number;
  offsetDegrees: number;
  iconSrc: string;
}

export interface OrbitIconState extends OrbitIconConfig {
  angleDegrees: number;
  element: HTMLElement | null;
}
