export const captionPlanner = ({ text, keywords = [] }: { text: string; keywords?: string[] }) => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const chunks: { text: string; highlight?: string }[] = [];
  for (let i = 0; i < words.length; i += 6) {
    const chunk = words.slice(i, i + 6).join(' ');
    const highlight = keywords.find((k) => chunk.toLowerCase().includes(k.toLowerCase()));
    chunks.push({ text: chunk, highlight });
  }
  return chunks.slice(0, 4);
};
