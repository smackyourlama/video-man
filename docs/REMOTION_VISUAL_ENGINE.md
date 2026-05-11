# Remotion Visual Engine

## How it works
- `buildTimeline.ts` adapts existing VideoMan scene payloads or richer script JSON into one normalized timeline.
- `scenePlanner.ts` converts sections into visual scenes with topic-aware durations and scene purposes.
- `visualStyleSelector.ts` maps channel + keyword context into scene components and effect stacks.
- `transitionSelector.ts` chooses transitions with repetition control.
- `SceneRenderer.tsx` resolves each timeline item into a channel-aware scene component.

## Channel themes
- **Operator Logic**: acquisition war-room, muted gold/green, board layouts, deal flow.
- **Terminalecho**: terminal UI, blue/green, scanlines, controlled glitch/data motion.
- **Blackledger**: charcoal finance dashboard, gold/white/green, number counters, ledger visuals.
- **NullSignal**: dark documentary dossier, muted cyan/red/gray, static/noise overlays, surveillance maps.

## Scene types
- HookScene
- ExplainerScene
- DiagramScene
- ChecklistScene
- StatsScene
- QuoteScene
- CodeTerminalScene
- FinanceLedgerScene
- AcquisitionBoardScene
- PrivacyDossierScene
- CyberThreatScene
- AffiliateCardScene
- SponsorReadScene
- OutroScene

## Transition rules
- Default: fade, slide.
- Cyber / privacy / warning moments can use glitch or static cut.
- Finance content can use ledger flip.
- Terminalecho and technical sections can use terminal wipe or data stream.
- Transition repetition is limited in `transitionSelector.ts`.

## Captions
- `AnimatedCaption.tsx` uses `captionPlanner.ts`.
- Large readable lines, 1–2 line chunks.
- Keyword highlighting is style-aware.
- Captions stay in safe lower areas and animate subtly.

## Long-form vs short-form
- Long-form: `MainVideoComposition`, 16:9, slower pacing, 6–14 second scenes.
- Short-form: `ShortVideoComposition`, 9:16, faster pacing, 2–5 second scenes.

## Adding new scenes
1. Create the scene component under `remotion/src/remotion/scenes/`.
2. Register it in `SceneRenderer.tsx`.
3. Map it from `visualStyleSelector.ts` or `scenePlanner.ts`.

## Motion intensity tuning
- Reusable motion lives in `styles/motionPresets.ts`.
- Effects are layered in `SceneBase.tsx`.
- Reduce or increase scene energy by changing effect lists or per-scene typography scale.

## Preview commands
- `npm run remotion:preview:operator`
- `npm run remotion:preview:terminalecho`
- `npm run remotion:preview:blackledger`
- `npm run remotion:preview:nullsignal`

## Render commands
- `npm run remotion:render:operator`
- `npm run remotion:render:terminalecho`
- `npm run remotion:render:blackledger`
- `npm run remotion:render:nullsignal`

## Troubleshooting broken assets
- `assetResolver.ts` should always provide fallback visual metadata.
- Scenes are designed not to depend on external assets.
- If a screenshot or product image is missing, use cards/diagrams/callouts instead of empty space.

## Troubleshooting caption timing
- Adjust chunking in `captionPlanner.ts`.
- Tune caption segment duration in `AnimatedCaption.tsx`.

## Troubleshooting slow renders
- Reduce particle/card density.
- Use fewer overlay effects in heavy channels.
- Render preview samples before full long-form outputs.
