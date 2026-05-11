export type TransitionType = 'fade' | 'slide' | 'glitch' | 'terminalWipe' | 'dataStream' | 'ledgerFlip' | 'staticCut';

export const transitionSelector = ({ channel, keywords = [], index, lastTransitions = [] }: { channel: string; keywords?: string[]; index: number; lastTransitions?: TransitionType[]; }): TransitionType => {
  const joined = keywords.join(' ').toLowerCase();
  const candidates: TransitionType[] = [];
  if (/credit|tax|cash flow|debt|ledger|accounting|apr/.test(joined) || channel === 'Blackledger') candidates.push('ledgerFlip');
  if (/linux|logs|exploit|breach|osint|password|port|malware/.test(joined) || channel === 'Terminalecho') candidates.push('terminalWipe', 'dataStream');
  if (/tracking|surveillance|data broker|metadata|signal|identity|privacy|leak/.test(joined) || channel === 'NullSignal') candidates.push('staticCut', 'glitch');
  candidates.push('fade', 'slide');
  const filtered = candidates.filter((t) => !(lastTransitions.length >= 2 && lastTransitions.slice(-2).every((lt) => lt === t)));
  return filtered[index % filtered.length] || 'fade';
};
