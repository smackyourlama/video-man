export const assetResolver = ({ channel, sceneType, topic, keywords = [] }: { channel: string; sceneType: string; topic: string; keywords?: string[]; }) => {
  return {
    iconSet: channel,
    badge: sceneType.toUpperCase(),
    headline: topic,
    keywordCards: keywords.slice(0, 4),
    fallbackVisual: `${channel} ${sceneType}`,
  };
};
