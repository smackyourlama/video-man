import { colorPalettes } from './colorPalettes';
import { typography } from './typography';

export const channelThemes = {
  'Operator Logic': {
    id: 'operator',
    palette: colorPalettes.operator,
    typography,
    motion: 'measured',
    introLabel: 'ACQUISITION WAR ROOM',
    logoText: 'OL',
    defaultSceneTypes: ['AcquisitionBoardScene', 'ChecklistScene', 'StatsScene', 'DiagramScene', 'AffiliateCardScene'],
    preferredTransitions: ['fade', 'slide', 'ledgerFlip'],
  },
  Terminalecho: {
    id: 'terminal',
    palette: colorPalettes.terminal,
    typography,
    motion: 'technical',
    introLabel: 'TERMINAL FEED',
    logoText: 'TE',
    defaultSceneTypes: ['CodeTerminalScene', 'CyberThreatScene', 'DiagramScene', 'ChecklistScene', 'StatsScene'],
    preferredTransitions: ['terminalWipe', 'glitch', 'staticCut', 'dataStream'],
  },
  Blackledger: {
    id: 'ledger',
    palette: colorPalettes.ledger,
    typography,
    motion: 'financial',
    introLabel: 'LEDGER ANALYSIS',
    logoText: 'BL',
    defaultSceneTypes: ['FinanceLedgerScene', 'StatsScene', 'ChecklistScene', 'DiagramScene', 'QuoteScene', 'AffiliateCardScene'],
    preferredTransitions: ['ledgerFlip', 'fade', 'slide'],
  },
  NullSignal: {
    id: 'nullsignal',
    palette: colorPalettes.nullsignal,
    typography,
    motion: 'documentary',
    introLabel: 'SURVEILLANCE DOSSIER',
    logoText: 'NS',
    defaultSceneTypes: ['PrivacyDossierScene', 'CyberThreatScene', 'QuoteScene', 'DiagramScene', 'StatsScene'],
    preferredTransitions: ['staticCut', 'fade', 'glitch'],
  },
} as const;

export type ChannelName = keyof typeof channelThemes;

export const normalizeChannel = (channel?: string): ChannelName => {
  const raw = String(channel || 'Operator Logic').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const map: Record<string, ChannelName> = {
    operatorlogic: 'Operator Logic',
    terminalecho: 'Terminalecho',
    blackledger: 'Blackledger',
    nullsignal: 'NullSignal',
  };
  return map[raw] || 'Operator Logic';
};
