# Moruette Hub

This fork now includes a first-party mobile-friendly creative hub prototype, loaded from SillyTavern's extension menu as **Moruette Hub**.

The first iteration includes a local social feed and profile (GIF avatar URLs), directory links for Chub AI, Janitor AI, Data Cat and SillyTavern, a paste-based fandom notes exporter for lorebook/character JSON drafts, a local roleplay-room mockup with channels and schedules, multiple creator shortcuts, and a starter extension manifest/tutorial.

This is a UI foundation, not a complete social network or replacement chat backend. Third-party sites are opened externally; the hub does not crawl them. Imported text is user-pasted. Room messages, schedules, feed, and profile are local-only; they do not sync or trigger proactive AI. Existing TauriTavern/SillyTavern remain responsible for actual chat/group chat, file/image sending, agents, trackers, extension installation, provider API connections, and Lorebary proxy/plugin integration. See `src/scripts/extensions/moruette-hub/information.md` and `skill.md` for limitations and development notes.
