import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

type Tab = 'home' | 'discover' | 'import' | 'spaces' | 'studio' | 'profile';
type Post = { id: string; author: string; text: string; stamp: string; hearts: number };
type Note = { title: string; text: string };
type RoomMessage = { id: string; author: string; text: string; mine?: boolean };
const KEY = 'moruette-hub:v1';
const sites = [
    { name: 'Chub AI', url: 'https://chub.ai', mark: '✦', note: 'Character cards & community creations' },
    { name: 'Janitor AI', url: 'https://janitorai.com', mark: '♡', note: 'Browse roleplay characters' },
    { name: 'Data Cat', url: 'https://datacat.chat', mark: '☾', note: 'Character discovery' },
    { name: 'SillyTavern', url: 'https://sillytavern.app', mark: '✿', note: 'Guides, extensions & community' },
];
const starterPosts: Post[] = [
    { id: 'p1', author: 'mothmilk', text: 'made a tiny moonlit library for tonight’s story ✧', stamp: '2 min ago', hearts: 24 },
    { id: 'p2', author: 'velvet.page', text: 'anyone have a good cozy fantasy bot rec? ☁️', stamp: '18 min ago', hearts: 12 },
];
const starterMessages: RoomMessage[] = [
    { id: 'm1', author: 'Mira', text: 'The lanterns are already lit in the old garden.' },
    { id: 'm2', author: 'Rowan', text: 'I saved you a seat by the window ☾' },
];
function readSaved(): Record<string, unknown> {
    try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Record<string, unknown>; }
    catch { return {}; }
}
function save(key: string, value: unknown) {
    const current = readSaved();
    localStorage.setItem(KEY, JSON.stringify({ ...current, [key]: value }));
}
function downloadJson(name: string, value: unknown) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = name; link.click();
    URL.revokeObjectURL(url);
}
function makeNotes(source: string): Note[] {
    const sections = source.split(/\n(?=#{1,3}\s)/u).map(part => part.trim()).filter(Boolean);
    if (!sections.length) return [];
    return sections.map((section, index) => {
        const lines = section.split('\n');
        const heading = lines[0]?.replace(/^#{1,3}\s*/u, '').trim();
        const text = lines.slice(1).join('\n').trim() || section;
        return { title: heading || `Fandom note ${index + 1}`, text };
    });
}
function Icon({ children }: { children: string }) { return <span className="mh-icon" aria-hidden="true">{children}</span>; }
function Hub() {
    const [tab, setTab] = useState<Tab>('home');
    const [posts, setPosts] = useState<Post[]>(() => Array.isArray(readSaved().posts) ? readSaved().posts as Post[] : starterPosts);
    const [profile, setProfile] = useState(() => ({ name: String(readSaved().name ?? 'softstar'), avatar: String(readSaved().avatar ?? ''), status: String(readSaved().status ?? 'making little worlds') }));
    const [draftPost, setDraftPost] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [sourceText, setSourceText] = useState('');
    const [notes, setNotes] = useState<Note[]>([]);
    const [server, setServer] = useState('moonlit-cafe');
    const [channel, setChannel] = useState('general');
    const [messages, setMessages] = useState<RoomMessage[]>(() => Array.isArray(readSaved().messages) ? readSaved().messages as RoomMessage[] : starterMessages);
    const [chatText, setChatText] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [query, setQuery] = useState('');
    const [toast, setToast] = useState('');
    const filteredSites = useMemo(() => sites.filter(site => site.name.toLowerCase().includes(query.toLowerCase())), [query]);
    useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 2600); return () => clearTimeout(timer); }, [toast]);
    function createPost() {
        if (!draftPost.trim()) return;
        const next = [{ id: crypto.randomUUID(), author: profile.name, text: draftPost.trim(), stamp: 'just now', hearts: 0 }, ...posts];
        setPosts(next); save('posts', next); setDraftPost('');
    }
    function publishProfile() { save('name', profile.name); save('avatar', profile.avatar); save('status', profile.status); setToast('profile saved on this device ✧'); }
    function buildLorebook() {
        const parsed = makeNotes(sourceText);
        if (!parsed.length) { setToast('paste some notes first, then try again ☁'); return; }
        setNotes(parsed);
        downloadJson('moruette-lorebook.json', { entries: Object.fromEntries(parsed.map((note, index) => [index, { uid: index, key: [note.title], comment: note.title, content: note.text, enabled: true, constant: false }])) });
        setToast(`${parsed.length} lore entries exported ✿`);
    }
    function sendRoomMessage() {
        if (!chatText.trim()) return;
        const next = [...messages, { id: crypto.randomUUID(), author: profile.name, text: chatText.trim(), mine: true }];
        setMessages(next); save('messages', next); setChatText('');
    }
    function pickFiles(list: FileList | null) { if (list) setFiles(current => [...current, ...Array.from(list)]); }
    const nav: { id: Tab; label: string; icon: string }[] = [
        { id: 'home', label: 'home', icon: '⌂' }, { id: 'discover', label: 'find', icon: '⌕' }, { id: 'import', label: 'lore', icon: '✧' },
        { id: 'spaces', label: 'spaces', icon: '☾' }, { id: 'studio', label: 'studio', icon: '✿' }, { id: 'profile', label: 'me', icon: '♡' },
    ];
    return <div className="mh-shell">
        <header className="mh-top"><div><span className="mh-kicker">a little pocket universe</span><h1>moruette <span>✿</span></h1></div><button className="mh-avatar" onClick={() => setTab('profile')} aria-label="Open profile">{profile.avatar ? <img src={profile.avatar} alt="" /> : '☁'}</button></header>
        <main className="mh-content">
            {tab === 'home' && <section className="mh-page"><div className="mh-banner"><span>✧ ･ﾟ: * welcome back * :ﾟ･ ✧</span><h2>what are we dreaming up?</h2><p>Your stories, favorite little corners, and character worlds—all in one place.</p><button className="mh-pill" onClick={() => setTab('studio')}>open your studio <b>↗</b></button></div>
                <div className="mh-section-title"><div><span className="mh-kicker">your tiny timeline</span><h2>soft signals</h2></div><span>✦ ✧ ✦</span></div>
                <form className="mh-compose" onSubmit={event => { event.preventDefault(); createPost(); }}><div className="mh-mini-avatar">{profile.avatar ? <img src={profile.avatar} alt="" /> : '♡'}</div><input value={draftPost} onChange={event => setDraftPost(event.target.value)} placeholder="leave a little note…" aria-label="Write a post" /><button aria-label="Post">＋</button></form>
                <div className="mh-feed">{posts.map(post => <article className="mh-post" key={post.id}><div className="mh-post-head"><span className="mh-mini-avatar">{post.author.slice(0, 1)}</span><div><b>@{post.author}</b><small>{post.stamp}</small></div><span className="mh-dots">···</span></div><p>{post.text}</p><button className="mh-heart" onClick={() => { const next = posts.map(item => item.id === post.id ? { ...item, hearts: item.hearts + 1 } : item); setPosts(next); save('posts', next); }}>♡ {post.hearts}</button></article>)}</div>
                <div className="mh-note"><b>little reminder</b><p>Be kind to creators. Keep source links with your fandom notes, and check a site’s rules before importing or sharing.</p></div>
            </section>}
            {tab === 'discover' && <section className="mh-page"><div className="mh-section-title"><div><span className="mh-kicker">good places to wander</span><h2>bot browser</h2></div><span>☁</span></div><label className="mh-search">⌕ <input value={query} onChange={event => setQuery(event.target.value)} placeholder="search directories" /></label><p className="mh-muted">Directory shortcuts open the service in your browser. This app does not scrape or log into third-party sites.</p><div className="mh-site-list">{filteredSites.map(site => <a className="mh-site" key={site.name} href={site.url} target="_blank" rel="noopener noreferrer"><span className="mh-site-mark">{site.mark}</span><span><b>{site.name}</b><small>{site.note}</small></span><i>↗</i></a>)}</div><div className="mh-card"><h3>bring a character home</h3><p>Use a service’s own export/share controls, then import a character card with SillyTavern’s existing character importer.</p><button className="mh-button" onClick={() => document.getElementById('create_button')?.click()}>open character tools</button></div></section>}
            {tab === 'import' && <section className="mh-page"><div className="mh-section-title"><div><span className="mh-kicker">fandom scrapbook</span><h2>make a lorebook</h2></div><span>✧</span></div><div className="mh-card mh-warning"><b>source-respectful import</b><p>Paste text you have permission to reuse. For web pages, open the source and copy the relevant public text here; browser security and site rules prevent reliable unrestricted scraping.</p></div><label className="mh-field">source URL <input value={sourceUrl} onChange={event => setSourceUrl(event.target.value)} placeholder="https://… (saved as attribution)" /></label><label className="mh-field">copied fandom notes <textarea value={sourceText} onChange={event => setSourceText(event.target.value)} placeholder={'# Places\nThe glass garden is hidden behind the old station.\n\n# Characters\nMira keeps the keys to the north wing.'} rows={8} /></label><div className="mh-button-row"><button className="mh-button" onClick={buildLorebook}>✧ export lorebook JSON</button><button className="mh-button secondary" onClick={() => { const title = sourceText.match(/^#\s+(.+)$/mu)?.[1] ?? 'New character'; downloadJson('moruette-character.json', { name: title, description: sourceText, creator_notes: sourceUrl ? `Source: ${sourceUrl}` : 'Created from your fandom notes' }); setToast('character draft exported ✿'); }}>♡ character draft</button></div>{notes.length > 0 && <div className="mh-card"><h3>entry preview</h3>{notes.map(note => <p key={note.title}><b>{note.title}</b><br />{note.text}</p>)}</div>}<div className="mh-card"><h3>image & document attachments</h3><p>Choose multiple files for this local draft. Files stay in this screen; they are not sent to a model or saved into chat.</p><label className="mh-button file-pick">＋ add images / text / PDF<input type="file" multiple accept="image/*,.txt,.md,.pdf,.json" onChange={event => pickFiles(event.currentTarget.files)} /></label>{files.map((file, index) => <div className="mh-file" key={`${file.name}-${index}`}>◇ {file.name} <button onClick={() => setFiles(items => items.filter((_, position) => position !== index))} aria-label={`Remove ${file.name}`}>×</button></div>)}</div></section>}
            {tab === 'spaces' && <section className="mh-page"><div className="mh-section-title"><div><span className="mh-kicker">imaginary little corners</span><h2>character spaces</h2></div><span>☾</span></div><p className="mh-muted">A local roleplay-room mockup for planning servers, channels, character statuses, and schedules. Messages here are not sent to AI or Discord.</p><div className="mh-server-tabs">{['moonlit-cafe', 'starfall-guild', '+ new'].map(item => <button className={server === item ? 'active' : ''} key={item} onClick={() => { if (item === '+ new') { const next = `new-room-${Date.now().toString().slice(-3)}`; setServer(next); setToast('new local room created ✧'); } else setServer(item); }}>{item === 'moonlit-cafe' ? '☕' : item === 'starfall-guild' ? '✦' : '＋'}</button>)}</div><div className="mh-chat-card"><div className="mh-room-head"><div><b>#{channel}</b><small>✦ {server}</small></div><button onClick={() => setChannel(channel === 'general' ? 'story-planning' : 'general')}>switch channel ↔</button></div><div className="mh-schedule">⏰ Mira: tending the garden · 18:00–20:00</div><div className="mh-messages">{messages.map(message => <div className={`mh-message ${message.mine ? 'mine' : ''}`} key={message.id}><b>{message.author}</b><p>{message.text}</p></div>)}</div><form className="mh-compose room-compose" onSubmit={event => { event.preventDefault(); sendRoomMessage(); }}><input value={chatText} onChange={event => setChatText(event.target.value)} placeholder={`message #${channel}`} aria-label="Room message" /><button>↑</button></form></div><button className="mh-button secondary full" onClick={() => setToast('schedule saved to this local mockup ✿')}>＋ add character schedule</button><div className="mh-card"><h3>plugins & proxy</h3><p>Compatible integrations need the provider’s documented API and your own credentials. Open Settings → Extensions for installed plugins; no credentials are collected by this prototype.</p></div></section>}
            {tab === 'studio' && <section className="mh-page"><div className="mh-section-title"><div><span className="mh-kicker">make a whole universe</span><h2>creator studio</h2></div><span>✿</span></div><div className="mh-creator-grid">{[['characters', '♡', 'Character cards'], ['personas', '☁', 'Personas'], ['lorebooks', '✧', 'Lorebooks'], ['presets', '⚙', 'Presets'], ['trackers', '⌗', 'Trackers'], ['agents', '✦', 'Agents'], ['extensions', '▧', 'Extensions']].map(([key, icon, label]) => <button className="mh-creator" key={key} onClick={() => key === 'lorebooks' ? setTab('import') : key === 'extensions' ? (document.getElementById('extensions_settings') as HTMLButtonElement | null)?.click() : setToast(`${label} use SillyTavern's existing tools; choose a guide below ✧`)}><span>{icon}</span><b>{label}</b><small>open tools ↗</small></button>)}</div><div className="mh-card"><h3>extension folder, gently explained</h3><p>A SillyTavern extension is usually a folder containing a <code>manifest.json</code>, JavaScript entry point, optional stylesheet, and a README. Install only code you trust: extensions can access the page and your chat data.</p><button className="mh-button secondary" onClick={() => downloadJson('moruette-extension-manifest.json', { display_name: 'My extension', loading_order: 1, js: 'index.js', css: 'style.css', version: '1.0.0', description: 'A small extension' })}>download starter manifest</button><button className="mh-text-button" onClick={() => setToast('See the companion information.md and skill.md in this repository ✿')}>read the build tutorial</button></div><div className="mh-card"><h3>chat modes & media</h3><p>Use SillyTavern’s existing one-to-one/group chat and attachment controls in the main chat. This hub is an add-on, not a replacement chat transport; vision and document support depend on your selected provider/model.</p><button className="mh-button" onClick={() => document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' })}>back to chat</button></div></section>}
            {tab === 'profile' && <section className="mh-page"><div className="mh-section-title"><div><span className="mh-kicker">your little corner</span><h2>profile card</h2></div><span>♡</span></div><div className="mh-profile-card"><div className="mh-profile-avatar">{profile.avatar ? <img src={profile.avatar} alt="Animated profile preview" /> : '☁'}</div><div><span className="mh-kicker">✧ online in your imagination</span><h2>@{profile.name || 'softstar'}</h2><p>{profile.status || 'making little worlds'}</p><span className="mh-nitro">✦ sparkle decor</span></div></div><label className="mh-field">display name<input value={profile.name} onChange={event => setProfile(current => ({ ...current, name: event.target.value }))} /></label><label className="mh-field">status<textarea rows={2} value={profile.status} onChange={event => setProfile(current => ({ ...current, status: event.target.value }))} /></label><label className="mh-field">avatar image URL (GIF supported)<input type="url" value={profile.avatar} onChange={event => setProfile(current => ({ ...current, avatar: event.target.value }))} placeholder="https://…/avatar.gif" /></label>{profile.avatar && <img className="mh-avatar-preview" src={profile.avatar} alt="Avatar preview" />}<button className="mh-button full" onClick={publishProfile}>save profile on this device ✧</button><div className="mh-card"><h3>privacy note</h3><p>This prototype stores your profile and feed in this device’s local browser storage. Animated avatar URLs are loaded from their source host.</p></div></section>}
        </main>
        <nav className="mh-nav" aria-label="Moruette sections">{nav.map(item => <button key={item.id} className={tab === item.id ? 'selected' : ''} onClick={() => setTab(item.id)}><Icon>{item.icon}</Icon><small>{item.label}</small></button>)}</nav>
        {toast && <div className="mh-toast" role="status">{toast}</div>}
    </div>;
}
async function mount() {
    const context = (window as Window & { SillyTavern?: { getContext?: () => { eventSource?: { once?: (event: unknown, callback: () => void) => void }; eventTypes?: { APP_READY?: unknown } } } }).SillyTavern?.getContext?.();
    if (!context?.eventSource?.once || context.eventTypes?.APP_READY === undefined) throw new Error('Moruette Hub: SillyTavern APP_READY event is unavailable');
    context.eventSource.once(context.eventTypes.APP_READY, () => {
        if (document.getElementById('moruette-hub-launcher')) return;
        const launcher = document.createElement('button'); launcher.id = 'moruette-hub-launcher'; launcher.className = 'mh-launcher'; launcher.type = 'button'; launcher.textContent = '✿ moruette'; launcher.setAttribute('aria-label', 'Open Moruette creative hub');
        document.body.append(launcher);
        const host = document.createElement('div'); host.id = 'moruette-hub-root'; document.body.append(host);
        const root = createRoot(host);
        launcher.addEventListener('click', () => { host.dataset.open = host.dataset.open === 'true' ? 'false' : 'true'; });
        root.render(<StrictMode><Hub /></StrictMode>);
        window.addEventListener('pagehide', () => { root.unmount(); launcher.remove(); host.remove(); }, { once: true });
    });
}
void mount().catch(error => { console.error('[MoruetteHub] Failed to mount', error); window.toastr?.error?.(error instanceof Error ? error.message : String(error)); });
