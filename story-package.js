(function (global) {
    'use strict';
    const cache = new Map();
    let catalogPromise;
    let appliedThemeKeys = [];
    let appliedPageKeys = [];
    const clone = value => JSON.parse(JSON.stringify(value));
    const fail = message => { throw new Error('Story package: ' + message); };
    function id(value, label) {
        if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(value)) fail('invalid ' + label);
        return value;
    }
    function validateExperience(p) {
        if (!p || p.version !== 1 || !Array.isArray(p.steps) || !p.steps.length) fail('experience needs version 1 and steps');
        const ids = new Set();
        for (const step of p.steps) {
            id(step.id, 'step ID');
            if (ids.has(step.id)) fail('duplicate step ' + step.id);
            ids.add(step.id);
            if (!['title', 'questionnaire', 'placeholder', 'exploration', 'dialogue'].includes(step.type)) fail('unsupported step type ' + step.type);
            if (step.durationSeconds !== undefined && (!Number.isFinite(step.durationSeconds) || step.durationSeconds <= 0)) fail('invalid duration in ' + step.id);
        }
        for (const step of p.steps) if (step.next && !ids.has(step.next)) fail('unknown next step ' + step.next);
        if (p.steps.some(step => step.type === 'questionnaire') && !p.questionnaire) fail('questionnaire step needs questionnaire content');
        if (p.questionnaire) {
            if (!Array.isArray(p.questionnaire.fields) || !p.questionnaire.fields.length) fail('empty questionnaire');
            const fields = new Set();
            for (const field of p.questionnaire.fields) {
                id(field.id, 'questionnaire field');
                if (fields.has(field.id) || field.id === 'completedAt') fail('duplicate or reserved questionnaire field');
                fields.add(field.id);
                if (!field.label || !Array.isArray(field.options) || !field.options.length) fail('invalid question ' + field.id);
                if (new Set(field.options.map(o => String(o.value))).size !== field.options.length) fail('duplicate answer values');
                if (field.valueType === 'number' && field.options.some(o => !Number.isFinite(Number(o.value)))) fail('invalid numeric answer');
            }
        }
        if (p.map) {
            if (typeof p.map.image !== 'string' || !p.map.image || /^(?:[a-z]+:|\/\/)/i.test(p.map.image)) fail('map image must be a site asset');
            if (!(p.map.width > 0 && p.map.height > 0) || !Array.isArray(p.map.rooms)) fail('invalid map geometry');
            const rooms = new Set();
            for (const r of p.map.rooms) {
                if (!Array.isArray(r) || r.length !== 6) fail('invalid room');
                id(r[0], 'room ID');
                if (rooms.has(r[0])) fail('duplicate room');
                rooms.add(r[0]);
                const [, name, x, y, w, h] = r;
                if (!name || ![x,y,w,h].every(Number.isFinite) || x < 0 || y < 0 || w <= 0 || h <= 0 || x+w > 100 || y+h > 100) fail('room outside map: ' + r[0]);
            }
        }
        if (p.map?.roomViews) {
            const ids = new Set(p.map.rooms.map(room => room[0]));
            for (const [roomId, view] of Object.entries(p.map.roomViews)) {
                if (!ids.has(roomId)) fail('room view references unknown room: ' + roomId);
                if (!view || typeof view.image !== 'string' || !view.image || /^(?:[a-z]+:|\/\/)/i.test(view.image) || view.image.includes('..')) fail('room view image must be a site asset');
                if (typeof view.alt !== 'string' || !view.alt.trim()) fail('room view needs descriptive alt text: ' + roomId);
            }
        }
        const siteAsset = value => typeof value === 'string' && value.length > 0 && !/^(?:[a-z]+:|\/\/)/i.test(value) && !value.includes('..');
        for (const [speakerId, speaker] of Object.entries(p.speakers || {})) {
            id(speakerId, 'speaker ID');
            if (!speaker?.name || !speaker.alt || !siteAsset(speaker.portrait)) fail('invalid dialogue portrait');
            if (speaker.background === 'map' ? !p.map?.image : !siteAsset(speaker.background)) fail('invalid dialogue background');
        }
        for (const [roomId, gate] of Object.entries(p.map?.access || {})) {
            if (gate.speakerId && !p.speakers?.[gate.speakerId]) fail('unknown dialogue speaker');
            if (!p.map.rooms.some(r => r[0] === roomId)) fail('access rule references unknown room');
            if (!gate || !gate.title || !gate.speaker || !gate.text || !gate.tapeLabel) fail('incomplete room access interaction');
            if (gate.unlockAtStep != null && !p.steps.some(s => s.id === gate.unlockAtStep)) fail('unknown room unlock step');
        }
        for (const step of p.steps) {
            if (step.type === 'dialogue' && (!p.speakers?.[step.speakerId] || !step.text || !p.map?.roomViews?.[step.roomId])) fail('dialogue needs speaker, text and room artwork');
            if (step.autoAdvance && (!step.next || !step.durationSeconds)) fail('automatic step needs duration and next step');
        }
        const interactionIds = new Set(), rewardIds = new Set();
        if(p.caseBoard!==undefined&&(!p.caseBoard||typeof p.caseBoard.inventoryOnly!=='boolean'))fail('invalid case board settings');
        const setIds=new Set(),personalIds=new Set();
        for(const set of p.playerItemSets||[]){id(set.id,'personal item set');if(setIds.has(set.id)||!Array.isArray(set.items)||!set.items.length||set.items.length>16)fail('invalid personal item set');setIds.add(set.id);for(const item of set.items){id(item.id,'personal item ID');if(personalIds.has(item.id)||!item.name||!item.text)fail('invalid personal item');personalIds.add(item.id);}}
        if (p.interactions !== undefined && !Array.isArray(p.interactions)) fail('interactions must be an array');
        for (const item of p.interactions || []) {
            if(item.parentInteraction&&!p.interactions.some(i=>i.id===item.parentInteraction&&i.id!==item.id&&!i.parentInteraction&&i.roomId===item.roomId))fail('invalid parent interaction');
            id(item.id, 'interaction ID');
            if (interactionIds.has(item.id)) fail('duplicate interaction');
            interactionIds.add(item.id);
            if (!p.map?.rooms?.some(r => r[0] === item.roomId)) fail('unknown interaction room');
            if (!['noteSequence','evidence','inventory','objectSequence','poolShot','inspection'].includes(item.type) || !item.name || !item.description) fail('invalid interaction');
            if (Object.prototype.hasOwnProperty.call(item, 'unlockAtStep') && item.unlockAtStep !== null && !p.steps.some(s => s.id === item.unlockAtStep)) fail('unknown interaction unlock step');
            if (item.characterIds !== undefined) { if (!Array.isArray(item.characterIds) || !item.characterIds.length || new Set(item.characterIds).size !== item.characterIds.length) fail('invalid action characters'); for (const character of item.characterIds) id(character, 'action character ID'); }
            if (item.itemKind !== undefined) id(item.itemKind, 'item kind');
            if (item.isEvidence !== undefined && typeof item.isEvidence !== 'boolean') fail('invalid evidence flag');
            if(item.isPuzzleItem!==undefined&&typeof item.isPuzzleItem!=='boolean')fail('invalid puzzle item flag');
            if(item.view!==undefined&&(item.view!=='caseBoard'||item.type!=='inspection'))fail('invalid interaction view');
            if(item.guidance!==undefined){if(item.type!=='inspection'||!p.speakers?.[item.speakerId]||!Array.isArray(item.guidance)||!item.guidance.length)fail('invalid guidance interaction');for(const rule of item.guidance){if(!rule.text||rule.stepId&&!ids.has(rule.stepId))fail('invalid guidance rule');}}
            if (item.pages !== undefined) {
                if (!Array.isArray(item.pages) || !item.pages.length || item.pages.length > 30) fail('invalid booklet pages');
                const pageIds=new Set();
                for(const page of item.pages){id(page.id,'page ID');if(pageIds.has(page.id)||!page.title||!page.text)fail('invalid booklet page');pageIds.add(page.id);}
            }
            if (item.requiresInventory !== undefined) id(item.requiresInventory, 'required inventory ID');
            if(item.personalItemSet!==undefined&&!setIds.has(item.personalItemSet))fail('unknown personal item set');
            if(item.letterPuzzle){
                const l=item.letterPuzzle,keys=['top-left','top-right','middle-left','middle-right','bottom-left','bottom-right'];
                if(item.type!=='poolShot'||!personalIds.has(l.itemId)||!l.prompt||typeof l.word!=='string'||!/^[A-Z]{1,16}$/.test(l.word)||!l.pockets||Object.keys(l.pockets).length!==6||keys.some(k=>typeof l.pockets[k]!=='string'||!/^([A-Z] )*[A-Z]$/.test(l.pockets[k])))fail('invalid letter-pocket puzzle');
                const letters=keys.flatMap(k=>l.pockets[k].split(' '));if(letters.length!==26||new Set(letters).size!==26)fail('pocket board must cover the alphabet exactly once');
            }
            if (item.maze !== undefined) {
                const c=item.maze;
                if(item.type!=='inspection'||!Number.isInteger(c.durationSeconds)||c.durationSeconds<30||!Number.isInteger(c.shufflePauseSeconds)||c.shufflePauseSeconds<2||c.shufflePauseSeconds>30||!Array.isArray(c.mazes)||!c.mazes.length||c.mazes.length>8)fail('invalid cooperative maze');
                const mazeIds=new Set();
                for(const m of c.mazes){id(m.id,'maze ID');if(mazeIds.has(m.id)||!m.label||!m.symbol||!/^#[0-9a-f]{6}$/i.test(m.color))fail('invalid maze identity');mazeIds.add(m.id);
                    if(!Array.isArray(m.grid)||m.grid.length<3||m.grid.length>15||m.grid.some(r=>typeof r!=='string'||r.length!==m.grid[0].length||!/^[#.]+$/.test(r))||m.grid[0].length>15)fail('invalid maze grid');
                    for(const point of [m.start,m.goal])if(!Array.isArray(point)||point.length!==2||!point.every(Number.isInteger)||m.grid[point[1]]?.[point[0]]!=='.')fail('invalid maze endpoint');
                    const queue=[m.start],seen=new Set([m.start.join()]);while(queue.length){const [x,y]=queue.shift();for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const p=[x+dx,y+dy];if(m.grid[p[1]]?.[p[0]]==='.'&&!seen.has(p.join())){seen.add(p.join());queue.push(p);}}}
                    if(m.start.join()===m.goal.join()||!seen.has(m.goal.join()))fail('unreachable maze goal');
                }
            }
            if (item.image !== undefined && (!siteAsset(item.image) || typeof item.imageAlt !== 'string' || !item.imageAlt.trim())) fail('interaction artwork needs a site asset and alt text');
            if (item.requiresPuzzle !== undefined) id(item.requiresPuzzle, 'required puzzle ID');
            if (item.type === 'poolShot') {
                if (!Number.isInteger(item.maxStrikes) || item.maxStrikes < 1 || item.maxStrikes > 5 || !Array.isArray(item.shots) || !item.shots.length || item.shots.length > 5) fail('invalid pool-shot challenge');
                for (const shot of item.shots) {
                    if (!shot.start || !Number.isFinite(shot.start.x) || !Number.isFinite(shot.start.y) || shot.start.x <= 50 || shot.start.x >= 310 || shot.start.y <= 50 || shot.start.y >= 490) fail('invalid ball start');
                    if (!['top-left','top-right','middle-left','middle-right','bottom-left','bottom-right'].includes(shot.pocket) || (shot.cushions !== undefined && (!Array.isArray(shot.cushions) || shot.cushions.length > 5 || shot.cushions.some(c => !['top','bottom','left','right'].includes(c))))) fail('invalid pool-shot route');
                }
                if (item.memory && (!item.memory.characterId || !item.memory.title || !item.memory.text)) fail('invalid challenge memory');
            }
            if (item.type === 'objectSequence') {
                if (!Array.isArray(item.objects) || item.objects.length < 2 || item.objects.length > 16) fail('invalid sequence objects');
                const objects = new Set();
                for (const object of item.objects) { id(object.id, 'object ID'); if (!object.label || objects.has(object.id)) fail('invalid sequence object'); objects.add(object.id); }
                if (!Array.isArray(item.solution) || item.solution.length !== objects.size || new Set(item.solution).size !== objects.size || item.solution.some(key => !objects.has(key))) fail('invalid object solution');
            }
            if (item.type === 'noteSequence') {
            if (!Array.isArray(item.keys) || item.keys.length < 2 || item.keys.length > 24) fail('invalid note keys');
            const keys = new Set();
            for (const key of item.keys) {
                id(key.id, 'note ID');
                if (keys.has(key.id) || !key.label || !Number.isInteger(key.midi) || key.midi < 21 || key.midi > 108) fail('invalid note key');
                keys.add(key.id);
                if(key.keyboard!==undefined&&!/^[A-G]$/.test(key.keyboard))fail('invalid keyboard shortcut');
            }
            const shortcuts=item.keys.filter(k=>k.keyboard).map(k=>k.keyboard+!!k.black);
            if(new Set(shortcuts).size!==shortcuts.length)fail('duplicate keyboard shortcut');
            if (!item.keys.some(k => !k.black) || !Array.isArray(item.solution) || !item.solution.length || item.solution.length > 32 || item.solution.some(k => !keys.has(k))) fail('invalid note solution');
            }
            if (!item.reward?.name || !item.reward?.text) fail('interaction needs reward');
            id(item.reward.id, 'reward ID');
            if (rewardIds.has(item.reward.id)) fail('duplicate interaction reward');
            rewardIds.add(item.reward.id);
        }
        for (const item of p.interactions || []) {
            if(item.playInteraction&&!p.interactions.some(i=>i.id===item.playInteraction&&i.type==='noteSequence'))fail('unknown booklet piano');
            if (item.memory?.whenInspected && !interactionIds.has(item.memory.whenInspected)) fail('unknown memory inspection trigger');
            for(const rule of item.guidance||[]){for(const key of ['requiresInspected','uninspected','unsolvedPuzzle'])if(rule[key]&&!interactionIds.has(rule[key]))fail('unknown guidance interaction');for(const key of ['requiresInventory','missingInventory'])if(rule[key]&&!rewardIds.has(rule[key]))fail('unknown guidance inventory');}
            if (item.requiresInventory && !p.interactions.some(i => i.type === 'inventory' && i.reward.id === item.requiresInventory)) fail('unknown required inventory');
            if (item.requiresPuzzle && !p.interactions.some(i => (i.maze||['noteSequence','objectSequence','poolShot'].includes(i.type)) && i.id === item.requiresPuzzle)) fail('unknown required puzzle');
        }
        const collections=new Set();
        for(const collection of p.collections||[]){
            id(collection.id,'collection ID');id(collection.reward?.id,'collection inventory ID');
            if(collections.has(collection.reward.id)||rewardIds.has(collection.reward.id)||!collection.reward.name||!collection.reward.text)fail('invalid collection');collections.add(collection.reward.id);
            if(!Array.isArray(collection.pages)||!collection.pages.length||collection.pages.length>30)fail('invalid collection pages');
            const pages=new Set();
            for(const page of collection.pages){id(page.id,'page ID');if(pages.has(page.id)||!page.title||!page.text||!p.interactions.some(i=>i.type==='inventory'&&i.reward.id===page.requiresInventory))fail('invalid discoverable page');pages.add(page.id);}
            if(collection.playInteraction&&!p.interactions.some(i=>i.id===collection.playInteraction&&i.type==='noteSequence'))fail('unknown collection instrument');
        }
        return p;
    }
    function validate(p) {
        if (!p || p.schemaVersion !== 1) fail('unsupported schema');
        id(p.id, 'story ID');
        if (!p.metadata?.name) fail('missing story name');
        if (p.experience) validateExperience(p.experience);
        const cast = p.content?.characters || {};
        for (const key of Object.keys(cast)) id(key, 'character ID');
        const roles = p.content?.roles;
        for (const role of Object.values(roles?.priorities || {})) {
            if (!role.label || !Number.isInteger(role.count ?? 1) || (role.count ?? 1) < 1) fail('invalid role');
            for (const key of role.assignTo ? [role.assignTo] : role.eligibleChars || []) if (!cast[key]) fail('unknown character in role: ' + key);
        }
        const scans = p.content?.scans;
        if (scans) {
            if (scans.skillPrefixes && (!Array.isArray(scans.skillPrefixes) || scans.skillPrefixes.some(prefix => typeof prefix !== 'string' || !prefix))) fail('invalid scan prefixes');
            for (const entries of Object.values(scans.routes || {})) for (const entry of Object.values(entries)) {
                if (!['item','skill','photo','page'].includes(entry.type)) fail('unsupported scan capability');
                if (entry.type === 'photo' && !entry.image) fail('photo scan needs an image');
                if (entry.type === 'page' && !p.presentation?.pages?.[entry.page]) fail('scan page is missing');
                if (entry.counter) id(entry.counter,'scan counter');
            }
        }
        const phaseIds = new Set();
        for (const phase of p.content?.flow?.phases || []) {
            id(phase.id,'phase ID'); if (phaseIds.has(phase.id)) fail('duplicate phase'); phaseIds.add(phase.id);
            for (const event of phase.social?.schedule || []) {
                if (!Number.isFinite(event.afterSeconds) || event.afterSeconds < 0) fail('invalid scheduled event time');
                if (!['quiz','reveal'].includes(event.action)) fail('unsupported social event');
                if (event.action === 'reveal' && !event.item) fail('reveal event needs an item');
            }
        }
        return p;
    }
    async function json(url, optional = false) {
        const r = await fetch(url, {cache:'no-store'});
        if (optional && r.status === 404) return null;
        if (!r.ok) fail('cannot load ' + url + ' (' + r.status + ')');
        try { return await r.json(); } catch (e) { fail('invalid JSON at ' + url); }
    }
    function catalog() {
        if (!catalogPromise) catalogPromise = json('stories/catalog.json').catch(e => { catalogPromise = null; throw e; });
        return catalogPromise;
    }
    async function resolve(storyId) {
        id(storyId, 'story ID');
        const c = await catalog();
        return id(c.aliases?.[storyId] || storyId, 'resolved story ID');
    }
    async function load(storyId) {
        const resolved = await resolve(storyId);
        if (!cache.has(resolved)) cache.set(resolved, (async () => {
            const p = await json('stories/' + resolved + '/package.json');
            if (p.id !== resolved) fail('story ID does not match package path');
            if (p.experienceFile) {
                if (!/^[a-zA-Z0-9_-]+\.json$/.test(p.experienceFile)) fail('invalid experience filename');
                p.experience = await json('stories/' + resolved + '/' + p.experienceFile);
            }
            return validate(p);
        })().catch(e => { cache.delete(resolved); throw e; }));
        return clone(await cache.get(resolved));
    }
    // Explicit v1 adapter for existing global-based renderers. Replaces all data,
    // including absent collections, to prevent previous-story data leaking in.
    async function legacy(storyId) {
        const p = await load(storyId), c = p.content || {};
        const items = c.items || [], counts = {};
        for (const item of items) item._number = counts[item.category] = (counts[item.category] || 0) + 1;
        Object.assign(global, {
            currentStoryPackage: p, characterDatabase: c.characters || {}, SKILL_BACKSTORIES: c.skillBackstories || {},
            skillsDatabase: c.skills || {}, revelationsDatabase: c.revelations || {}, itemDatabase: items,
            itemTotals: {total: items.length, clues: counts.clue || 0, containers: counts.container || 0, keys: counts.key || 0, redherrings: counts.redherring || 0},
            rolesConfig: c.roles || {priorities:{},skills:{},scoreWeights:{priority:{},skill:{}}},
            gameFlow: c.flow || {phases:[]}, storyFacts: c.facts || [], questsDatabase: c.quests || {}, cocktailMenu: c.menu || {sections:[]}
        });
        const arrayGlobals = ['ACT_REVELATIONS','STANDALONE_CLUES','CIN_SECTIONS'];
        const objectGlobals = ['ACT_TARGETS','DJ_AUTO','DJ_TEXTS','CONFESSIONS','CLUE_CAPTIONS','CLUE_ICONS','CLUE_THUMBS','CLUE_LAYOUT','LEGACY_KEY_MAP','DR_TEXTS','DR_BY_ACT','CONFESSION_BY_ACT'];
        for (const key of arrayGlobals) global[key] = p.presentation?.legacyGlobals?.[key] || [];
        for (const key of objectGlobals) global[key] = p.presentation?.legacyGlobals?.[key] || {};
        for (const key of appliedPageKeys) { const section=document.getElementById(key);if(section)section.replaceChildren(); }
        appliedPageKeys=Object.keys(p.presentation?.pages || {});
        for (const [key, html] of Object.entries(p.presentation?.pages || {})) { const section = document.getElementById(key); if (section) section.innerHTML = html; }
        global.DJ_DELAY_MS = p.presentation?.legacyGlobals?.DJ_DELAY_MS || 0;
        for (const key of appliedThemeKeys) document.documentElement.style.removeProperty(key);
        appliedThemeKeys = Object.keys(p.presentation?.theme || {}).filter(key => key.startsWith('--'));
        for (const key of appliedThemeKeys) document.documentElement.style.setProperty(key,p.presentation.theme[key]);
        return p;
    }
    async function fromContext(db, options = {}) {
        const params = options.params || new URLSearchParams(location.search);
        let session = options.session;
        if (!session) { try { session = JSON.parse(localStorage.getItem('userSession')) || {}; } catch (_) { session = {}; } }
        let storyId = params.get('story') || session.storyId;
        const gameId = params.get('game') || session.currentGameId;
        if (gameId && db) {
            if (/[.#$\[\]/]/.test(gameId)) fail('invalid game ID');
            const game = (await db.ref('games/' + gameId).once('value')).val();
            if (!game?.storyId) fail('game not found or missing story');
            if (storyId && await resolve(storyId) !== await resolve(game.storyId)) fail('story does not match this game');
            storyId = game.storyId;
        }
        if (!storyId) {
            const c = await catalog();
            storyId = c.legacyRoutes?.[location.pathname.split('/').pop() + '?' + (params.get('item') || params.get('id') || '')];
        }
        if (!storyId) fail('open this page from a game or include its story ID');
        return legacy(storyId);
    }
    global.StoryPackage = {load, legacy, catalog, resolve, fromContext, validate, validateExperience};
})(window);
