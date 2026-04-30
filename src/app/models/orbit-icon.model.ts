export interface OrbitIconConfig {
  emoji: string;
  label: string;
  orbitRadius: number;
  speed: number;
  offsetDegrees: number;
}

export interface OrbitIconState extends OrbitIconConfig {
  angleDegrees: number;
  element: HTMLElement | null;
}
