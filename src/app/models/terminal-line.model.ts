export type TerminalLineType = 'cmd' | 'out' | 'ok' | 'dim' | 'warn' | 'err';

export interface TerminalLineModel {
  lineType: TerminalLineType;
  text: string;
  delayMs: number;
}
