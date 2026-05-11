export type SceneVisualPlan = {
  sceneComponent: string;
  effects: string[];
  emotionalIntensity: 'low' | 'medium' | 'high';
};

export const visualStyleSelector = ({ channel, sceneType, text, keywords = [], intensity = 'medium' }: { channel: string; sceneType: string; text: string; keywords?: string[]; intensity?: 'low'|'medium'|'high'; }): SceneVisualPlan => {
  const joined = `${text} ${keywords.join(' ')}`.toLowerCase();
  const cyber = /breach|exploit|port|linux|logs|password|vpn|osint|dark web|malware|incident/.test(joined);
  const finance = /credit|tax|cash flow|debt|leverage|income|investment|accounting|ledger|apr/.test(joined);
  const acquisitions = /acquisition|seller financing|boring business|ebitda|sde|deal|broker|due diligence/.test(joined);
  const privacy = /tracking|surveillance|data broker|metadata|leak|signal|identity|digital footprint/.test(joined);
  if (sceneType === 'hook') return { sceneComponent: 'HookScene', effects: privacy || cyber ? ['noise_overlay','scanlines'] : ['particle_field'], emotionalIntensity: 'high' };
  if (sceneType === 'outro') return { sceneComponent: 'OutroScene', effects: ['particle_field'], emotionalIntensity: 'low' };
  if (sceneType === 'affiliate') return { sceneComponent: 'AffiliateCardScene', effects: ['floating_cards'], emotionalIntensity: 'medium' };
  if (sceneType === 'sponsor') return { sceneComponent: 'SponsorReadScene', effects: ['floating_cards'], emotionalIntensity: 'medium' };
  if (finance || channel === 'Blackledger') return { sceneComponent: sceneType === 'stats' ? 'StatsScene' : 'FinanceLedgerScene', effects: ['animated_grid','number_ticker'], emotionalIntensity: intensity };
  if (acquisitions || channel === 'Operator Logic') return { sceneComponent: sceneType === 'checklist' ? 'ChecklistScene' : 'AcquisitionBoardScene', effects: ['animated_grid','floating_cards'], emotionalIntensity: intensity };
  if (privacy || channel === 'NullSignal') return { sceneComponent: sceneType === 'quote' ? 'QuoteScene' : sceneType === 'stats' ? 'StatsScene' : 'PrivacyDossierScene', effects: ['noise_overlay','scanlines'], emotionalIntensity: intensity };
  if (cyber || channel === 'Terminalecho') return { sceneComponent: sceneType === 'diagram' ? 'DiagramScene' : sceneType === 'checklist' ? 'ChecklistScene' : 'CodeTerminalScene', effects: ['scanlines','data_rain'], emotionalIntensity: intensity };
  return { sceneComponent: sceneType === 'diagram' ? 'DiagramScene' : sceneType === 'checklist' ? 'ChecklistScene' : sceneType === 'quote' ? 'QuoteScene' : 'ExplainerScene', effects: ['animated_grid'], emotionalIntensity: intensity };
};
