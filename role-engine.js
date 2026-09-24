(function(global) {
    'use strict';
    const score = p => Math.min(10, Math.max(1, Number(p.score) || 5));
    function weightedPick(players, weights, random) {
        const weight = p => weights[score(p)] || 0.1;
        let ticket = random() * players.reduce((sum,p) => sum + weight(p), 0);
        for (const p of players) { ticket -= weight(p); if (ticket <= 0) return p; }
        return players[players.length - 1];
    }
    function generate(roster, config, policy = {}, random = Math.random) {
        const players = Object.entries(roster).map(([uid,p]) => ({...p, uid}));
        const result = {}, assigned = new Set(), skilled = new Set();
        const weights = config.scoreWeights?.priority || {}, skills = config.scoreWeights?.skill || {};
        const blank = () => ({role:null,skill:null,ineligibleSkills:[]});
        for (const rule of Object.values(config.priorities || {})) {
            for (let n=0; n < (rule.count ?? 1); n++) {
                let eligible = players.filter(p => !assigned.has(p.uid) && !result[p.uid]?.role && (rule.assignTo ? p.characterId === rule.assignTo : (rule.eligibleChars || []).includes(p.characterId)));
                if (!rule.assignTo) {
                    if (policy.prioritySelection === 'probability-filter') eligible = eligible.filter(p => random() < (weights[score(p)] || 0));
                    else {
                        const preferred = eligible.filter(p => score(p) >= (rule.minScore || 1));
                        eligible = policy.minimumScore === 'strict' || preferred.length ? preferred : eligible;
                    }
                }
                if (!eligible.length) break;
                const p = rule.assignTo ? eligible[0] : weightedPick(eligible, weights, random);
                result[p.uid] = {...blank(),role:rule.label,ineligibleSkills:rule.ineligibleSkills || []};
                if (rule.excludeFrom) assigned.add(p.uid);
            }
        }
        for (const [name,rule] of Object.entries(config.skills || {})) {
            const available = p => p && !skilled.has(p.uid) && !result[p.uid]?.ineligibleSkills.includes(name);
            let holder = players.find(p => p.characterId === rule.primary && available(p));
            if (!holder) {
                const backups = (rule.backups || []).map(id => players.find(p => p.characterId === id)).filter(available);
                holder = backups.find(p => random() <= (skills[score(p)] || 0));
                if (!holder && policy.skillFallback === 'first-eligible') holder = backups[0];
            }
            if (holder) { result[holder.uid] ||= blank(); result[holder.uid].skill = name; skilled.add(holder.uid); }
        }
        return result;
    }
    function missingRequired(assignments, config, requirements = []) {
        const labels = Object.values(assignments).map(a => a.role ?? a.priority);
        return requirements.filter(label => labels.filter(x => x === label).length < (Object.values(config.priorities || {}).find(r => r.label === label)?.count || 1));
    }
    global.RoleEngine = {generate, missingRequired};
})(window);
