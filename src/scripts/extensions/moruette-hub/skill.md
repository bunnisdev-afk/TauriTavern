# Skill: Build a SillyTavern extension (Moruette Hub starter)

## Goal
Create a small, reviewable SillyTavern-compatible extension that works in TauriTavern's mobile WebView. Prefer existing platform capabilities and the official extension lifecycle over DOM hacks.

## Files

- `manifest.json`: name, loading order, JS entry, optional CSS, version and description.
- `src/index.tsx`: first-party React island entry. Wait for the host/app readiness boundary before touching application UI.
- `style.css`: scoped styles; use `--SmartTheme*` variables where possible and support small viewports, safe areas, keyboard resizing, accessible labels and reduced motion.
- `information.md`: user-facing capabilities, data flow, permissions and limitations.
- `skill.md`: contributor setup and review instructions.

## Build steps in this repository

1. Add a dedicated Rspack entry and output directory for the extension; do not combine unrelated feature bundles.
2. Add its TypeScript source directory to `tsconfig.ui.json` and the first-party UI guardrail source roots.
3. Keep the React island presentation-only. Compose typed platform actions at the host boundary; never invoke Rust commands directly from React.
4. Use `window.__TAURITAVERN__.ready` and a documented API when a feature needs TauriTavern host state. Fail visibly when a required capability is missing.
5. For SillyTavern page events, use the page's `SillyTavern.getContext()` event source and unsubscribe on teardown.
6. Scope CSS under a feature root. Test touch targets, narrow screens, keyboard/IME overlap, safe areas, high contrast, and reduced motion.
7. Run `pnpm run check:types`, `pnpm run check:frontend`, `pnpm run check:lint`, `pnpm run web:build`, and the focused UI/contract tests.

## Safe import and scripting practices

- Do not fetch arbitrary user-entered URLs from a privileged host-side service. This can create SSRF, local-network access, credential leakage, and site-policy issues. Prefer explicit user copy/paste or a documented source API with appropriate consent.
- Treat imported text, HTML, images, and character cards as untrusted. Do not use `innerHTML` for user content; sanitize HTML when rendering is necessary.
- Do not execute arbitrary JavaScript from HTML/CSS character data. HTML/CSS presentation must not grant script execution or native bridge access.
- Restrict external links to expected `https:` URLs and always use `rel="noopener noreferrer"` for new tabs.
- Do not promise unlimited attachment size/count: model/provider request limits, mobile memory, and platform file APIs still apply.
- Keep API keys in the existing secret/connection manager, never in extension localStorage or exported drafts.

## Verification checklist

- Manifest paths resolve to real build artifacts.
- A missing host API or app lifecycle event produces an actionable error.
- Create/export flows preserve source attribution and never silently report a failed write as success.
- The feature can be closed and reopened without duplicate launchers or event listeners.
- Mobile usability is checked in a real Android WebView; DOM test environments cannot validate IME and native viewport behavior.
