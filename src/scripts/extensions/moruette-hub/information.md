# Moruette Hub: companion information

Moruette Hub is an optional, first-party SillyTavern extension UI prototype in TauriTavern. It adds a mobile-friendly creative dashboard with a locally stored social feed/profile, outbound character-directory links, a user-pasted fandom-notes-to-lorebook exporter, a local roleplay-room mockup, and shortcuts/guidance for existing SillyTavern tools.

## Current scope and boundaries

- It does not create a new social network backend, synchronize profiles, or upload posts.
- It does not log in to or scrape third-party bot sites. Use their own export/share features and respect their terms and creators' permissions.
- The fandom importer processes text the user pastes and can export a starter lorebook JSON. Review the export in SillyTavern before use; it is not a full crawler or a guaranteed import of every World Info format.
- The room UI is a local planning mockup. It does not connect to Discord, run AI characters proactively, or generate background bots.
- Chat, groups, vision providers, file attachments, extensions, agents, trackers, Sophia's Lorebary proxy/plugins, and media hosting continue to depend on existing SillyTavern features and provider APIs. The hub does not claim a vision model accepts unlimited files.
- Profile/feed/room state uses browser localStorage on this device. Do not store API credentials or sensitive data there.

## Build and installation

The extension is loaded by the TauriTavern Rspack first-party bundle entry and manifest. Run `pnpm run web:build` to build the UI. The host extension discovery/runtime remains responsible for activation. Android usability relies on the existing Tauri mobile WebView and responsive surface styles.

See `skill.md` for a step-by-step extension authoring guide and security checklist.
