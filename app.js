/* ===================================================================
   Heavenly Tiers — Minecraft PvP Ranking Platform
   Single-file SPA. Player/mode/settings data synced via Firestore.
   Auth is real Firebase Authentication (Email/Password) — passwords are
   never touched or stored by this code at all, Firebase handles that
   server-side. Roles/usernames/PINs live in the "roles" Firestore
   collection, keyed by Firebase Auth UID.
   =================================================================== */

// ===== API CONFIG =====
// Change this if your Express server is on a different device
const API_BASE = 'http://localhost:3000';

// ===== SVG ICONS (reusable strings) =====
const S={
  home:'<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>',
  trophy:'<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0012 0V2z"/></svg>',
  flask:'<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v5.17a2 2 0 01-.59 1.42L4 15v4a2 2 0 002 2h12a2 2 0 002-2v-4l-5.41-5.41A2 2 0 0114 8.17V3"/></svg>',
  code:'<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>',
  crown:'<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4l3 12h14l3-12-5 4-5-4-5 4z"/><path d="M5 16h14v2H5z"/></svg>',
  search:'<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
  sun:'<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  moon:'<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>',
  copy:'<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
  trash:'<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
  plus:'<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  save:'<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>',
  clock:'<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  warn:'<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  lock:'<svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>',
  person:'<svg viewBox="0 0 24 48" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="0" width="16" height="16" rx="2"/><rect x="2" y="18" width="20" height="14" rx="1"/><rect x="2" y="34" width="8" height="14" rx="1"/><rect x="14" y="34" width="8" height="14" rx="1"/></svg>',
  shield:'<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  sword:'<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M15 21l6-6"/></svg>',
  check:'<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>',
  x:'<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
  info:'<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  inbox:'<svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2"><path d="M22 12h-6l-2 3H10l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>',
  people:'<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
  arrowR:'<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
  settings:'<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  log:'<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
  diamond:'<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 0L12 6L6 12L0 6Z"/></svg>',
  logout:'<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
  edit:'<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  image:'<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  discord:'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.74 19.74 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.11 13.11 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.3 12.3 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.84 19.84 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 00-.031-.03z"/></svg>'
};

// Title SVG icons (small inline)
const TI={
  Rookie:'<svg width="14" height="14" viewBox="0 0 24 24" fill="#e8a464"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#fff" stroke-width="1.5" fill="none"/></svg>',
  Novice:'<svg width="14" height="14" viewBox="0 0 24 24" fill="#60a5fa"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h8M8 14h4" stroke="#fff" stroke-width="1.5"/></svg>',
  Cadet:'<svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z"/></svg>',
  Specialist:'<svg width="14" height="14" viewBox="0 0 24 24" fill="#34d399"><path d="M12 2L2 12l10 10 10-10z"/></svg>',
  'Combat Ace':'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2"><path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M15 21l6-6"/></svg>',
  'Combat Master':'<svg width="14" height="14" viewBox="0 0 24 24" fill="#c084fc"><path d="M12 2L2 12l10 10 10-10z"/><circle cx="12" cy="12" r="3" fill="#fff"/></svg>',
  'Combat Grandmaster':'<svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700"><path d="M2 4l3 12h14l3-12-5 4-5-4-5 4z"/><path d="M5 16h14v3H5z"/></svg>',
  'Angelic Master':'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e0e7ff" stroke-width="1.5"><path d="M12 2v6M12 16v6M4 8c2 2 4 2.5 8 2.5S18 10 20 8M4 16c2-2 4-2.5 8-2.5S18 14 20 16" stroke-linecap="round"/><circle cx="12" cy="12" r="2" fill="#e0e7ff" stroke="none"/></svg>',
  'Heavenly Descendent':'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFD700" stroke-width="1.5"><path d="M12 2l2.5 6L21 9l-5 4 1.5 7L12 17l-5.5 3L8 13 3 9l6.5-1z" fill="#FFD700" stroke="#FFD700"/></svg>'
};

// Title pill helper — coloured badge with icon
function titlePill(name){
  const icon=TI[name]||'';
  const cls=name.replace(/\s+/g,'-');
  return name?`<span class="title-pill tp-${cls}">${icon} ${esc(name)}</span>`:'';
}

// ===== CONSTANTS =====
const DEFAULT_MODES=['Axe','Sword','Pot','NethPot','UHC','Crystal','SMP','Mace','Lifesteal','Spear','Spear-Mace'];
const DEFAULT_MODE_IC={
  Overall:{u:'https://iili.io/BpVgiN9.png'},
  Axe:{u:'https://iili.io/BpERGbR.png'},
  Sword:{u:'https://iili.io/BpVTUMB.png'},
  Pot:{u:'https://iili.io/BpEMgff.png'},
  NethPot:{u:'https://iili.io/BpEMSiG.png'},
  UHC:{u:'https://iili.io/Bp1ZRGs.png'},
  Crystal:{u:'https://iili.io/BpEuVkv.png'},
  SMP:{u:'https://iili.io/BpGdCGV.png'},
  Mace:{u:'https://static.wikia.nocookie.net/minecraft_gamepedia/images/6/63/Mace.png/revision/latest?cb=20260330015956'},
  Lifesteal:{u:'https://iili.io/BpVhPUu.png'},
  Spear:{u:'https://iili.io/BpEPvvS.png'},
  'Spear-Mace':{u:'https://iili.io/BpE4Qix.png'}
};

// lsg/lss — cloud when ready, localStorage always as fallback layer
function lsg(k,d){return window.getCloudValue?window.getCloudValue(k,d):d}
function lss(k,v){if(window.setCloudValue){window.setCloudValue(k,v)}}
function savePlayers(){lss('hp',window.players)}

// Read directly from localStorage NOW (Firebase module not yet executed at this point).
// cloud-ready handler will upgrade to Firestore data when it arrives.
function _lsGet(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}

window.players = _lsGet('hp',[]);

// Dynamic mode list + icons — persisted in localStorage "hm" and "hmi"
let MODES  = _lsGet('hm', DEFAULT_MODES);
let MODE_IC= _lsGet('hmi', DEFAULT_MODE_IC);
// Ensure Overall icon is always present
if(!MODE_IC.Overall)MODE_IC.Overall=DEFAULT_MODE_IC.Overall;
function saveModes(){lss('hm',MODES);lss('hmi',MODE_IC)}

const TIERS=['HT1','HT2','HT3','HT4','HT5','LT1','LT2','LT3','LT4','LT5'];
const TIER_PTS={HT1:60,LT1:45,HT2:30,LT2:20,HT3:10,LT3:6,HT4:4,LT4:3,HT5:2,LT5:1};
const TIER_ORD={HT1:0,LT1:1,HT2:2,LT2:3,HT3:4,LT3:5,HT4:6,LT4:7,HT5:8,LT5:9};
// "R" prefix = Retired — same tier, same points/rank position, just flagged inactive.
// Alias every base tier's points/order onto its RHT#/RLT# retired form so nothing
// elsewhere needs special-casing for points math or sort order.
Object.keys(TIER_PTS).forEach(k=>{TIER_PTS['R'+k]=TIER_PTS[k];TIER_ORD['R'+k]=TIER_ORD[k];});
const LT2_OK=['HT1','LT1','HT2','LT2']; // retired tiers deliberately excluded — Combat Master requires an active tier
function isRetiredTier(t){return !!t&&t[0]==='R'&&t!=='R'}
function baseTier(t){return isRetiredTier(t)?t.slice(1):t}
// Owner seeding handled via setup flow — no hardcoded creds in source.
// First person to sign up with role=Owner if no Owner exists yet.

// SVG fallback shape for broken mode icons
const MODE_FB='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M15 21l6-6"/></svg>';

// Region → flag emoji (continents, since regions aren't single countries)
const REGION_FLAG={NA:'🌎',EU:'🇪🇺',AS:'🌏',SA:'🌎',OC:'🌏',AF:'🌍'};

// Returns the icon markup for a mode: the owner's configured icon URL, with a safe fallback glyph if it 404s.
function modeIconMarkup(modeName){
  const ic=MODE_IC[modeName];
  if(ic&&ic.u)return `<img src="${esc(ic.u)}" alt="${esc(modeName)}" onerror="this.style.display='none';this.nextElementSibling.style.display=''"/><span class="mode-fb-ico" style="display:none">${MODE_FB}</span>`;
  return `<span class="mode-fb-ico">${MODE_FB}</span>`;
}

// Person silhouette SVG for cracked skins
const PERSON_SM=`<div class="svgp">${S.person}</div>`;
const PERSON_LG=`<div class="svgp svgp-lg">${S.person}</div>`;

// ===== PLAYER DATA (cloud synced across all visitors) =====
// players loaded after lsg is defined — see below

// ===== CACHED TESTER DATA (for panel display) =====
let testerCache={};

// ===== LOCALSTORAGE =====

// ── Backwards-compat migration: add skinType to old player objects ──
(function migrateSkinTypes(){
  let changed=false;
  window.players.forEach(p=>{
    if(!p.skinType){
      if(p.isPremium)p.skinType='java';
      else if(p.skinUrl)p.skinType='raw';
      else p.skinType='none';
      changed=true;
    }
  });
  if(changed)savePlayers();
})();


// ===== POINTS & TITLE =====
function getPoints(p){let s=0;for(const m of MODES){const t=p.tiers[m];if(t&&TIER_PTS[t])s+=TIER_PTS[t]}return s}
function getMissLT2(p){const ms=[];for(const m of MODES){const t=p.tiers[m];if(!t||!LT2_OK.includes(t))ms.push(m)}return ms}

function getTitle(p){
  const pts=getPoints(p);
  if(pts>=700)return{icon:'Heavenly Descendent',name:'Heavenly Descendent',pts};
  if(pts>=550)return{icon:'Angelic Master',name:'Angelic Master',pts};
  if(pts>=400)return{icon:'Combat Grandmaster',name:'Combat Grandmaster',pts};
  if(pts>=250){const ms=getMissLT2(p);if(!ms.length)return{icon:'Combat Master',name:'Combat Master',pts,miss:[]};return{icon:'Combat Ace',name:'Combat Ace',pts,miss:ms}}
  if(pts>=100)return{icon:'Combat Ace',name:'Combat Ace',pts};
  if(pts>=50)return{icon:'Specialist',name:'Specialist',pts};
  if(pts>=20)return{icon:'Cadet',name:'Cadet',pts};
  if(pts>=10)return{icon:'Novice',name:'Novice',pts};
  if(pts>=1)return{icon:'Rookie',name:'Rookie',pts};
  return{icon:'',name:'Unranked',pts:0}
}

// Progress to next title
const TITLE_THRESHOLDS=[{n:'Unranked',min:0},{n:'Rookie',min:1},{n:'Novice',min:10},{n:'Cadet',min:20},{n:'Specialist',min:50},{n:'Combat Ace',min:100},{n:'Combat Master',min:250},{n:'Combat Grandmaster',min:400},{n:'Angelic Master',min:550},{n:'Heavenly Descendent',min:700}];
function getProgress(pts){
  for(let i=TITLE_THRESHOLDS.length-1;i>=0;i--){
    if(pts>=TITLE_THRESHOLDS[i].min){
      const cur=TITLE_THRESHOLDS[i];
      const next=TITLE_THRESHOLDS[i+1];
      if(!next)return{pct:100,label:'Max title reached!'};
      const range=next.min-cur.min;
      const prog=pts-cur.min;
      return{pct:Math.min(100,Math.round(prog/range*100)),label:`${pts}/${next.min} pts to ${next.n}`}
    }
  }
  return{pct:0,label:'0 points'}
}

// ===== AUTH =====
// gU reads localStorage directly — works before cloud-ready, stays in sync because
// sU writes to both localStorage (via setCloudValue) AND Firestore.
// ===== REAL AUTH: session + roles cache =====
// _session is kept in sync by the fbOnAuthChange listener at the bottom of this file.
// gC() stays synchronous (matching how the rest of the codebase already calls it)
// by reading this in-memory cache rather than hitting Firestore on every call.
let _session=null;
function gC(){return _session}

// _rolesCache holds every user's role doc for the admin panel — refreshed
// explicitly (refreshRolesCache) rather than on every gU() call, since that's
// now a real async Firestore query instead of a free localStorage read.
let _rolesCache=[];
function gU(){return _rolesCache}
async function refreshRolesCache(){
  try{ _rolesCache = await window.getAllRoles(); }
  catch(e){ console.error('Failed to load roles',e); }
  return _rolesCache;
}

// Seed owner
// No auto-seed. First sign-up becomes Owner if none exists (see doSign).

// Tester IDs seeded post cloud-ready (see init at bottom) — avoids race with Firestore load.

// ===== SETTINGS =====
function gS(){return lsg('hs',{title:'Heavenly Tiers',tagline:'Rise Through the Ranks',discord:'https://discord.gg/M58KAtGzhy',serverIp:'heavenlyevents.falix.gg'})}
function apS(){
  const s=gS();
  document.getElementById('heroT').textContent=s.title;
  document.getElementById('heroS').textContent=s.tagline;
  document.getElementById('hdrT').textContent=s.title;
  document.title=s.title;
  const ipEl=document.getElementById('srvIp');
  if(ipEl)ipEl.textContent=s.serverIp;
  const dcCardBtn=document.getElementById('dcCardBtn');
  if(dcCardBtn)dcCardBtn.onclick=()=>window.open(s.discord,'_blank');
}

// ===== LOG =====
function logA(d,payload){let l=lsg('hal',[]);l.unshift({ts:new Date().toLocaleString(),desc:d,payload:payload||null});if(l.length>100)l=l.slice(0,100);lss('hal',l)}

// ===== TOAST =====
function toast(m,t='info'){
  const w=document.getElementById('twC');
  const e=document.createElement('div');
  const ic=t==='success'?S.check:t==='error'?S.x:S.info;
  e.className='tst '+(t==='success'?'s':t==='error'?'e':'i');
  e.innerHTML=ic+'<span>'+esc(m)+'</span>';
  w.appendChild(e);
  setTimeout(()=>{e.classList.add('out');setTimeout(()=>e.remove(),200)},3000);
}

// ===== THEME =====
function toggleTheme(){
  document.documentElement.classList.toggle('light');
  localStorage.setItem('ht-th',document.documentElement.classList.contains('light')?'light':'dark');
  updThemeIcon();
}
function updThemeIcon(){
  document.getElementById('thmBtn').innerHTML=document.documentElement.classList.contains('light')?S.moon:S.sun;
}
(function(){if(localStorage.getItem('ht-th')==='light')document.documentElement.classList.add('light')})();

// ===== MODAL =====
function openM(id){document.getElementById(id).classList.add('vis')}
function closeMs(){
  document.querySelectorAll('.mbg').forEach(m=>m.classList.remove('vis'));
  closeHam();
  if(location.pathname.startsWith('/profile/'))history.pushState(null,'','/');
}
function showAuthTab(t){
  document.getElementById('authLogin').style.display=t==='login'?'':'none';
  document.getElementById('authSign').style.display=t==='signup'?'':'none';
  document.getElementById('atL').className=t==='login'?'act':'';
  document.getElementById('atS').className=t==='signup'?'act':'';
}

// ===== ESCAPE HTML =====
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML}

// ===== HAMBURGER =====
function toggleHam(){
  const b=document.getElementById('hamBtn');
  const d=document.getElementById('hdrop');
  b.classList.toggle('open');
  d.classList.toggle('open');
}
function closeHam(){
  document.getElementById('hamBtn').classList.remove('open');
  document.getElementById('hdrop').classList.remove('open');
}
document.addEventListener('click',e=>{
  const hd=document.getElementById('hdrop');
  const hb=document.getElementById('hamBtn');
  if(hd.classList.contains('open')&&!hd.contains(e.target)&&!hb.contains(e.target))closeHam();
});

// ===== SPA ROUTER =====
let curPg='home';
const NAV_ITEMS=[
  {id:'home',label:'Home',svg:S.home},
  {id:'rankings',label:'Rankings',svg:S.trophy},
  {id:'testers',label:'Testers',svg:'<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v5.17a2 2 0 01-.59 1.42L4 15v4a2 2 0 002 2h12a2 2 0 002-2v-4l-5.41-5.41A2 2 0 0114 8.17V3"/></svg>'},
  {id:'api',label:'API',svg:S.code},
  {id:'panel',label:'Panel',svg:S.crown,auth:true}
];

function showPage(n,skipPush){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('vis'));
  const el=document.getElementById('pg-'+n);
  if(el){el.classList.add('vis');curPg=n}
  updNavActive();
  closeHam();
  if(n==='home')animStats();
  if(n==='rankings')renderRank();
  if(n==='testers')renderTesters();
  if(n==='panel')initPanel();
  if(!skipPush){
    if(n==='home')history.pushState(null,'','/');
    else if(n==='rankings')history.pushState(null,'',actMode==='Overall'?'/rankings':'/rankings/'+encodeURIComponent(actMode));
    else history.pushState(null,'','/'+n);
  }
  window.scrollTo({top:0});
}

function updNavActive(){
  // Desktop
  document.querySelectorAll('.nvd span').forEach(s=>s.classList.remove('act'));
  const nv=document.getElementById('nv-'+curPg);if(nv)nv.classList.add('act');
  // Mobile bottom tabs
  document.querySelectorAll('.btab span').forEach(s=>s.classList.remove('act'));
  const bt=document.getElementById('bt-'+curPg);if(bt)bt.classList.add('act');
  // Hamburger
  document.querySelectorAll('.hdrop span').forEach(s=>s.classList.remove('act'));
  const hd=document.getElementById('hd-'+curPg);if(hd)hd.classList.add('act');
}

// ===== AUTH UI =====
function upAuth(){
  const c=gC();
  const a=document.getElementById('authA');
  const show=c&&(c.role==='Owner'||c.role==='Admin');
  // Desktop nav
  document.getElementById('nv-panel').style.display=show?'':'none';
  // Mobile bottom + hamburger
  const bp=document.getElementById('bt-panel');if(bp)bp.style.display=show?'':'none';
  const hp=document.getElementById('hd-panel');if(hp)hp.style.display=show?'':'none';

  if(c){
    const icons={Owner:S.crown,Admin:S.shield,Member:S.sword};
    const colors={Owner:'#FFD700',Admin:'#60a5fa',Member:'#9ca3af'};
    a.innerHTML=`<div class="bb" style="background:${colors[c.role]};color:#000">${icons[c.role]} ${c.role}<div class="dd"><button onclick="doOut()">${S.logout} Logout</button><button onclick="openDangerZone()" style="color:#ff3860">⚠ Delete Account</button></div></div>`;
  }else{
    a.innerHTML=`<button class="btn-g" onclick="openM('authM')" style="font-size:12px;padding:6px 14px">Login</button>`;
  }
}

let _pendingOwnerLogin=null; // holds {uid,email,role,...} while the PIN modal is open
let _ownerPinVerifiedThisSession=false; // set true once per browser tab so a live Firestore
// listener re-fire (not a real fresh login) doesn't re-prompt the PIN mid-session
async function doLogin(){
  const e=document.getElementById('lE').value.trim().toLowerCase();
  const p=document.getElementById('lP').value;
  if(!e||!p)return toast('Fill in all fields','error');
  let fbUser;
  try{
    fbUser=await window.fbSignIn(e,p);
  }catch(err){
    return toast(friendlyAuthError(err),'error');
  }
  const role=await window.getRoleDoc(fbUser.uid);
  const u={uid:fbUser.uid,email:fbUser.email,username:role?role.username:fbUser.email.split('@')[0],role:role?role.role:'Member',pin:role?role.pin:undefined};
  if(u.role==='Owner'){
    _pendingOwnerLogin=u;
    closeMs();
    openOwnerPinStep();
    return;
  }
  _session=u;closeMs();upAuth();toast('Logged in as '+u.role,'success');
}
function openOwnerPinStep(){
  const u=_pendingOwnerLogin;if(!u)return;
  document.getElementById('opPinInput').value='';
  document.getElementById('opPinConfirm').value='';
  if(u.pin){
    document.getElementById('opPinTitle').textContent='Enter Owner PIN';
    document.getElementById('opPinDesc').textContent='Two-step verification is enabled for the Owner account.';
    document.getElementById('opPinConfirmWrap').style.display='none';
  }else{
    document.getElementById('opPinTitle').textContent='Set Owner PIN';
    document.getElementById('opPinDesc').textContent='First-time setup — choose a 4-digit PIN to protect the Owner account. You will need it on every future login.';
    document.getElementById('opPinConfirmWrap').style.display='block';
  }
  openM('ownerPinM');
}
async function submitOwnerPin(){
  const u=_pendingOwnerLogin;if(!u)return;
  const val=document.getElementById('opPinInput').value.replace(/\D/g,'').slice(0,4);
  if(val.length!==4)return toast('PIN must be exactly 4 digits','error');
  if(u.pin){
    if(val!==u.pin)return toast('Incorrect PIN','error');
    _ownerPinVerifiedThisSession=true;
    closeMs();_session=u;upAuth();toast('Logged in as Owner','success');
    _pendingOwnerLogin=null;
  }else{
    const conf=document.getElementById('opPinConfirm').value.replace(/\D/g,'').slice(0,4);
    if(val!==conf)return toast('PINs do not match','error');
    try{ await window.setRoleDoc(u.uid,{pin:val}); }catch(err){ return toast('Could not save PIN: '+err.message,'error'); }
    u.pin=val;
    _ownerPinVerifiedThisSession=true;
    closeMs();_session=u;upAuth();toast('Owner PIN set. Logged in as Owner','success');
    _pendingOwnerLogin=null;
  }
}
function cancelOwnerPin(){
  _pendingOwnerLogin=null;
  window.fbSignOut(); // they authenticated but bailed on the PIN step — don't leave a half-open session
  closeMs();
}
async function doSign(){
  const n=document.getElementById('sN').value.trim();
  const e=document.getElementById('sE').value.trim().toLowerCase();
  const p=document.getElementById('sP').value;
  const p2=document.getElementById('sP2').value;
  if(!n||!e||!p)return toast('Fill in all fields','error');
  if(p!==p2)return toast('Passwords do not match','error');
  if(p.length<6)return toast('Password too short (min 6 chars — Firebase requirement)','error');
  let fbUser;
  try{
    fbUser=await window.fbSignUp(e,p);
  }catch(err){
    return toast(friendlyAuthError(err),'error');
  }
  const isFirst=await window.claimOwnerIfFirst(fbUser.uid);
  const role=isFirst?'Owner':'Member';
  const roleData={username:n,role,email:fbUser.email};
  try{ await window.setRoleDoc(fbUser.uid,roleData); }catch(err){ return toast('Account created but role setup failed: '+err.message,'error'); }
  await refreshRolesCache();
  if(role==='Owner'){
    // First-ever account becomes Owner — route through PIN setup immediately,
    // same bar every subsequent Owner login goes through.
    _pendingOwnerLogin={uid:fbUser.uid,email:fbUser.email,username:n,role};
    closeMs();
    openOwnerPinStep();
    return;
  }
  _session={uid:fbUser.uid,email:fbUser.email,username:n,role};
  closeMs();upAuth();toast('Account created! Welcome, '+n,'success');
}
async function doOut(){
  await window.fbSignOut();
  _session=null;
  upAuth();
  showPage('home');
  toast('Logged out','info');
}

function openDangerZone(){
  const c=gC();if(!c)return;
  closeMs();
  document.getElementById('delAcctUn').textContent=c.username||c.email;
  const inp=document.getElementById('delAcctInput');
  inp.value='';
  checkDelAcctInput();
  openM('delAcctM');
}
function checkDelAcctInput(){
  const c=gC();if(!c)return;
  const btn=document.getElementById('delAcctBtn');
  const match=document.getElementById('delAcctInput').value===(c.username||c.email);
  btn.disabled=!match;
  btn.style.opacity=match?'1':'.5';
  btn.style.cursor=match?'pointer':'not-allowed';
}
async function doDeleteAccount(){
  const c=gC();if(!c)return;
  if(document.getElementById('delAcctInput').value!==(c.username||c.email))return;
  if(c.role==='Owner')return toast('The Owner account cannot be self-deleted — transfer ownership first','error');
  try{
    await window.deleteRoleDoc(c.uid);
    await window.fbAuth.currentUser.delete(); // removes the actual login credential, not just the role
  }catch(err){
    if(err.code==='auth/requires-recent-login')
      return toast('For security, please log out and back in, then try deleting again','error');
    return toast('Delete failed: '+err.message,'error');
  }
  logA(`${c.username||c.email} deleted their own account`);
  _session=null;
  closeMs();
  upAuth();
  showPage('home');
  toast('Account deleted','success');
}

// Turns Firebase's technical auth error codes into plain-language messages.
function friendlyAuthError(err){
  const code=err&&err.code||'';
  if(code==='auth/email-already-in-use')return 'That email is already registered — try logging in instead.';
  if(code==='auth/invalid-email')return 'That email address looks invalid.';
  if(code==='auth/weak-password')return 'Password is too weak (min 6 characters).';
  if(code==='auth/user-not-found'||code==='auth/wrong-password'||code==='auth/invalid-credential')return 'Invalid email or password.';
  if(code==='auth/too-many-requests')return 'Too many attempts — please wait a bit and try again.';
  return err&&err.message||'Something went wrong.';
}

// Restores the session on page load/refresh (Firebase persists the login itself;
// this is what actually reads that persisted state back into _session — without
// this, every refresh would silently look logged-out even though Firebase still
// has a valid credential). Registered from the cloud-ready handler below, never
// at top-level — firebase.js is a deferred module script, so window.fbOnAuthChange
// may not exist yet if called synchronously while app.js (a classic script) parses.
function registerAuthListener(){
  if(typeof window.fbOnAuthChange!=='function'){
    console.error('window.fbOnAuthChange missing — firebase.js failed to load, auth will not work.');
    return;
  }
  window.fbOnAuthChange(async(fbUser)=>{
    if(!fbUser){
      _session=null;
      _pendingOwnerLogin=null;
      upAuth();
      return;
    }
    let role;
    try{ role=await window.getRoleDoc(fbUser.uid); }
    catch(e){ console.error('Failed to load role on session restore',e); role=null; }
    const u={uid:fbUser.uid,email:fbUser.email,username:role?role.username:fbUser.email.split('@')[0],role:role?role.role:'Member',pin:role?role.pin:undefined};
    // No PIN re-check here — Firebase's own persisted session already IS the credential
    // being trusted across refreshes. PIN is only enforced at the moment of an actual
    // fresh sign-in (doLogin), not every time the tab reloads.
    _session=u;
    upAuth();
    if(curPg==='panel')initPanel();
  });
}

// ===== SEARCH (150ms debounce) =====
let sDeb=null;
function onSearch(){
  const clr=document.getElementById('srchClear');
  if(clr)clr.style.display=document.getElementById('sBar').value?'':'none';
  clearTimeout(sDeb);
  sDeb=setTimeout(()=>{if(curPg==='rankings')renderRank()},150);
}

// ===== COPY IP =====
function copyIP(){
  navigator.clipboard.writeText(gS().serverIp)
    .then(()=>toast('IP copied!','success'))
    .catch(()=>toast('Failed to copy','error'));
}

// ===== ANIMATED STATS =====
function animStats(){
  const regs=new Set(window.players.map(p=>p.region));
  const targets={players:window.players.length,modes:MODES.length,regions:regs.size||6};
  document.querySelectorAll('#statsR .sn').forEach(el=>{
    const key=el.dataset.t;const end=targets[key]||0;
    if(end===0){el.textContent='0';return}
    let start=0;const dur=600;const startTime=performance.now();
    function step(now){
      const elapsed=now-startTime;const progress=Math.min(elapsed/dur,1);
      const eased=1-Math.pow(1-progress,3);
      el.textContent=Math.round(eased*end);
      if(progress<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// ===== STARS =====
function initStars(){
  const c=document.getElementById('stars');
  for(let i=0;i<50;i++){
    const s=document.createElement('span');
    s.className='star';
    s.style.left=Math.random()*100+'%';
    s.style.top=(80+Math.random()*20)+'%';
    s.style.width=(1+Math.random())+'px';
    s.style.height=s.style.width;
    s.style.animationDuration=(4+Math.random()*6)+'s';
    s.style.animationDelay=(Math.random()*6)+'s';
    c.appendChild(s);
  }
}


// ===== SKIN SYSTEM =====
// Determines effective skin type (handles legacy isPremium flag)
function skinType(p){
  if(p.skinType)return p.skinType;
  if(p.isPremium)return 'java';
  if(p.skinUrl)return 'raw';
  return 'none';
}

// Returns the best static body-render URL for the table row image
function getBodyRenderUrl(p){
  const st=skinType(p);
  if(st==='java'){
    return 'https://render.crafty.gg/3d/bust/'+encodeURIComponent(p.uuid||p.username);
  }
  if(st==='bedrock'){
    if(!p.bedrockGt)return null;
    return 'https://mc-api.io/render/bust/'+encodeURIComponent(p.bedrockGt)+'/bedrock?size=256';
  }
  if(st==='raw')return null; // no known-identity — canvas fallback only
  return null;
}

// Get the raw skin texture URL (for skinview3d and canvas renderer)
async function fetchSkinTexture(p){
  const st=skinType(p);
  if(st==='java'){
    return 'https://mc-heads.net/skin/'+encodeURIComponent(p.uuid||p.username);
  }
  if(st==='bedrock'&&p.xuid){
    try{
      const r=await fetch('https://api.geysermc.org/v2/skin/'+p.xuid);
      if(r.ok){
        const d=await r.json();
        if(d.texture_id)return 'https://textures.minecraft.net/texture/'+d.texture_id;
      }
    }catch(e){}
  }
  if(p.skinUrl)return p.skinUrl;
  return null;
}

// Fetch Bedrock XUID from gamertag via GeyserMC
async function fetchBedrockXUID(gamertag){
  try{
    const r=await fetch('https://api.geysermc.org/v2/xbox/xuid/'+encodeURIComponent(gamertag));
    if(r.ok){const d=await r.json();return d.xuid||null;}
  }catch(e){}
  return null;
}

// Draw a flat 2D front-facing character from a skin texture PNG onto a canvas.
// Layout follows the standard Minecraft 64x64 1.8+ skin UV map.
function drawSkin2DFront(canvas,img,scale,bust){
  const s=scale||3;
  // Character grid: 16 wide × 32 tall skin pixels → canvas size.
  // Bust mode just shows a shorter canvas (head+shoulders) — canvas clips
  // anything drawn past its own height automatically, so the exact same
  // draw calls below give a bust crop for free, no UV changes needed.
  canvas.width=16*s; canvas.height=(bust?16:32)*s;
  const ctx=canvas.getContext('2d');
  ctx.imageSmoothingEnabled=false;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // draw(src_x,src_y,src_w,src_h, dst_x,dst_y) — all in skin-pixel units, scaled
  const d=(sx,sy,sw,sh,dx,dy)=>ctx.drawImage(img,sx,sy,sw,sh,dx*s,dy*s,sw*s,sh*s);

  // ════════════════════════════════════════════════════════
  //  UV COORDINATES — Standard 64×64 Minecraft 1.8+ skin map
  //  Reference: attached layout image
  // ════════════════════════════════════════════════════════

  // ── Layer 1 ──────────────────────────────────────────────
  // Head face          src(8,8,8,8)     → char pos (4,0)
  d( 8,  8, 8, 8,  4,  0);
  // Body front         src(20,20,8,12)  → char pos (4,8)
  d(20, 20, 8,12,  4,  8);
  // Right arm front    src(44,20,4,12)  → char pos (0,8)
  d(44, 20, 4,12,  0,  8);
  // Left arm front     src(36,52,4,12)  → char pos (12,8)  [1.8+ lower half]
  d(36, 52, 4,12, 12,  8);
  if(!bust){
    // Right leg front    src(4,20,4,12)   → char pos (4,20)
    d( 4, 20, 4,12,  4, 20);
    // Left leg front     src(20,52,4,12)  → char pos (8,20)  [1.8+ lower half]
    d(20, 52, 4,12,  8, 20);
  }

  // ── Layer 2 / Second Layer (outer overlay) ────────────────
  // Hat / head overlay src(40,8,8,8)    → char pos (4,0)
  d(40,  8, 8, 8,  4,  0);
  // Body overlay       src(20,36,8,12)  → char pos (4,8)
  d(20, 36, 8,12,  4,  8);
  // Right arm overlay  src(44,36,4,12)  → char pos (0,8)
  d(44, 36, 4,12,  0,  8);
  // Left arm overlay   src(52,52,4,12)  → char pos (12,8)
  d(52, 52, 4,12, 12,  8);
  if(!bust){
    // Right leg overlay  src(4,36,4,12)   → char pos (4,20)
    d( 4, 36, 4,12,  4, 20);
    // Left leg overlay   src(4,52,4,12)   → char pos (8,20)
    d( 4, 52, 4,12,  8, 20);
  }

  // ── Subtle drop shadow to suggest depth ───────────────────
  ctx.save();
  ctx.globalCompositeOperation='multiply';
  ctx.globalAlpha=0.18;
  ctx.fillStyle='#000';
  // Right edge shadow on torso/shoulder
  ctx.fillRect(11*s,8*s,1*s,(bust?8:12)*s);
  if(!bust){
    // Bottom shadow on legs (full-body mode only)
    ctx.fillRect(4*s,31*s,8*s,1*s);
  }
  ctx.restore();
}

// Render a raw skin PNG URL onto a canvas element using the 2D flat method
function renderRawCanvas(canvas,skinUrl,scale,bust){
  if(!skinUrl)return;
  const img=new Image();
  img.crossOrigin='anonymous';
  img.onload=()=>drawSkin2DFront(canvas,img,scale||3,bust);
  img.onerror=()=>{/* leave blank */};
  img.src=skinUrl;
}

// Process all canvas skin placeholders in the rankings table
// Called after renderRank inserts HTML into the DOM
function processTableSkinCanvases(){
  document.querySelectorAll('canvas[data-skin-url]').forEach(c=>{
    if(c.dataset.rendered)return;
    c.dataset.rendered='1';
    renderRawCanvas(c,c.dataset.skinUrl,5,true);
  });
}

// Build the table-row skin cell HTML for any player type
function tableSkinCell(p,idx){
  const st=skinType(p);
  const bodyUrl=getBodyRenderUrl(p);
  if(bodyUrl){
    // Java or Bedrock with a known render URL — use img tag (already a 3D render)
    const skid='sk'+idx;
    const img=document.createElement('img');
    img.className='sk-body';
    img.src=bodyUrl;
    img.alt=p.username;
    img.onload=function(){const prev=document.getElementById(skid);if(prev)prev.style.display='none';};
    img.onerror=function(){this.style.display='none';const prev=document.getElementById(skid);if(prev)prev.style.display='none';};
    const sk=document.createElement('div');
    sk.className='sk-sh sk';
    sk.id=skid;
    // Return a wrapper that we'll use innerHTML on — attach elements after
    const wrap=document.createElement('span');
    wrap.style.display='contents';
    wrap.appendChild(sk);
    wrap.appendChild(img);
    // Return as temp container; will be resolved by postRender
    // For innerHTML compat: embed as data-attrs and let processTableSkinCanvases handle
    return '<div class="sk-sh sk" id="'+skid+'"></div>'
      +'<img class="sk-body" src="'+esc(bodyUrl)+'" alt="'+esc(p.username)+'" '
      +'onload="(function(el){var s=document.getElementById(\''+skid+'\');if(s)s.style.display=\'none\';})(this)" '
      +'onerror="this.style.display=\'none\';var s=document.getElementById(\''+skid+'\');if(s)s.style.display=\'none\';" />';
  }
  if(st==='raw'&&p.skinUrl){
    // Raw PNG — use canvas renderer
    return '<canvas class="sk-canvas" data-skin-url="'+esc(p.skinUrl)+'" width="40" height="80"></canvas>';
  }
  if(st==='bedrock'){
    if(p.xuid){
      return '<canvas class="sk-canvas" width="40" height="80" data-xuid="'+esc(p.xuid)+'" data-username="'+esc(p.username)+'" data-rendered=""></canvas>';
    }
    // No XUID yet — kick off async lookup, show skeleton meanwhile
    if(p.bedrockGt&&!p.xuid){
      // async resolve — will update on next renderRank after save
      fetchBedrockXUID(p.bedrockGt).then(x=>{if(x){p.xuid=x;savePlayers();}});
    }
    return PERSON_SM;
  }
  // Fallback: person silhouette
  return PERSON_SM;
}

// Process async Bedrock skin canvases (after table is in DOM)
async function processBedrockCanvases(){
  const els=document.querySelectorAll('canvas[data-xuid]:not([data-rendered])');
  for(const c of els){
    const xuid=c.dataset.xuid;
    if(!xuid)continue;
    c.removeAttribute('data-xuid'); // prevent re-processing
    try{
      const r=await fetch('https://api.geysermc.org/v2/skin/'+xuid);
      if(r.ok){
        const d=await r.json();
        if(d.texture_id&&document.contains(c)){
          // Build a 3D bust render from the Mojang-CDN texture hash GeyserMC gave us —
          // VZGE (visage.surgeplay.com) accepts raw texture IDs directly, no Mojang account needed.
          const bustUrl='https://visage.surgeplay.com/bust/160/'+d.texture_id;
          const un=c.dataset.username;
          const p=un?window.players.find(x=>x.username===un):null;
          if(p){p.renderUrl=bustUrl;savePlayers();}
          const img=document.createElement('img');
          img.className='sk-body';
          img.src=bustUrl;
          img.alt=un||'';
          img.onerror=function(){
            // VZGE failed — fall back to the flat 2D texture render
            renderRawCanvas(c,'https://textures.minecraft.net/texture/'+d.texture_id,5,true);
            c.style.display='';
          };
          c.replaceWith(img);
        }
      }
    }catch(e){}
  }
}

// Initialise a skinview3d animated viewer inside a container element
function initSkinViewer(container,p,w,h){
  container.innerHTML='';
  if(!window.skinview3d){
    // skinview3d failed to load — fallback to 2D canvas
    const fallback=document.createElement('canvas');
    fallback.style.cssText='width:'+(w||120)+'px;height:'+(h||240)+'px;border-radius:10px;background:var(--el)';
    container.appendChild(fallback);
    fetchSkinTexture(p).then(url=>{ if(url)renderRawCanvas(fallback,url,Math.floor((w||120)/16)); });
    return;
  }
  const canvas=document.createElement('canvas');
  container.appendChild(canvas);
  let viewer;
  try{
    viewer=new skinview3d.SkinViewer({canvas,width:w||120,height:h||240});
  }catch(e){return;}
  viewer.autoRotate=true;
  viewer.autoRotateSpeed=1.5;
  viewer.zoom=0.85;
  try{viewer.animation=new skinview3d.WalkingAnimation();viewer.animation.speed=0.4;}catch(e){}
  try{viewer.renderer.setClearColor(0x000000,0);}catch(e){} // transparent bg
  fetchSkinTexture(p).then(url=>{
    if(url){try{viewer.loadSkin(url);}catch(e){}}
  });
}

// ===== RANKINGS =====
let actMode='Overall';

function buildTabs(){
  const tc=document.getElementById('mTabs');tc.innerHTML='';

  // Sliding gold indicator
  const ind=document.createElement('div');
  ind.className='tab-ind';ind.id='tabInd';
  tc.appendChild(ind);

  ['Overall',...MODES].forEach(m=>{
    const ic=MODE_IC[m]||{u:''};
    const d=document.createElement('div');
    d.className='tab'+(m===actMode?' act':'');
    d.onclick=()=>{actMode=m;slideTabTo(d);renderRank();history.pushState(null,'',m==='Overall'?'/rankings':'/rankings/'+encodeURIComponent(m));};

    // Build icon using DOM — avoids quote-escaping bugs in innerHTML onerror attributes
    if(ic.u){
      const img=document.createElement('img');
      img.src=ic.u;
      img.alt=m;
      img.style.cssText='width:40px;height:40px;object-fit:contain;image-rendering:auto;flex-shrink:0';
      img.onerror=function(){
        const fb=document.createElement('span');
        fb.innerHTML=MODE_FB;
        this.parentNode.insertBefore(fb.firstChild,this);
        this.remove();
      };
      d.appendChild(img);
    }else{
      const fb=document.createElement('span');
      fb.innerHTML=MODE_FB;
      d.appendChild(fb.firstChild);
    }
    d.appendChild(document.createTextNode('\u00A0'+m));
    tc.appendChild(d);
  });

  // Use setTimeout so layout is fully computed before reading offsetLeft
  // (requestAnimationFrame fires before paint; page may still be display:none)
  setTimeout(()=>{
    const act=tc.querySelector('.tab.act');
    const indEl=document.getElementById('tabInd');
    if(act&&indEl){
      indEl.style.transition='none';
      indEl.style.width=act.offsetWidth+'px';
      indEl.style.transform='translateX('+act.offsetLeft+'px)';
      requestAnimationFrame(()=>{indEl.style.transition=''});
    }
  },30);
}

function slideTabTo(el){
  const ind=document.getElementById('tabInd');
  if(!ind)return;
  document.querySelectorAll('#mTabs .tab').forEach(t=>t.classList.remove('act'));
  el.classList.add('act');
  ind.style.width=el.offsetWidth+'px';
  ind.style.transform='translateX('+el.offsetLeft+'px)';
}

function highlightMatch(text,q){
  if(!q)return esc(text);
  const idx=text.toLowerCase().indexOf(q.toLowerCase());
  if(idx===-1)return esc(text);
  return esc(text.slice(0,idx))+'<span class="hi">'+esc(text.slice(idx,idx+q.length))+'</span>'+esc(text.slice(idx+q.length));
}

function renderRank(){
  // Reset actMode if it was a deleted mode
  if(actMode!=='Overall'&&!MODES.includes(actMode))actMode='Overall';
  buildTabs();
  const wrap=document.getElementById('rkTbl');
  const q=document.getElementById('sBar').value.trim().toLowerCase();
  const rf=document.getElementById('regF').value;

  let list=window.players.filter(p=>{
    if(q&&!p.username.toLowerCase().includes(q))return false;
    if(rf&&p.region!==rf)return false;
    if(actMode==='Overall')return getPoints(p)>0;
    return !!p.tiers[actMode];
  });

  if(actMode==='Overall'){list.sort((a,b)=>getPoints(b)-getPoints(a))}
  else{list.sort((a,b)=>{const oa=TIER_ORD[a.tiers[actMode]]??99;const ob=TIER_ORD[b.tiers[actMode]]??99;return oa!==ob?oa-ob:getPoints(b)-getPoints(a)})}

  document.getElementById('rkCnt').textContent=list.length+' player'+(list.length!==1?'s':'');

  if(!list.length){
    wrap.innerHTML=`<div class="em">${S.inbox}<p>No players yet. Add players from the Owner Panel.</p></div>`;
    return;
  }

  if(actMode!=='Overall'){
    wrap.innerHTML=renderModeTierCols(actMode,list);
    return;
  }

  function tierBadges(p){
    return MODES.map(m=>{
      const t=p.tiers[m];const ic=MODE_IC[m]||{u:''};
      const cls=t?'tc-'+t.toLowerCase():'tc-no';
      const pts=t?TIER_PTS[t]:0;const label=t||'-';
      const tip=t?`${m}: ${t} (${pts} pts)`:`${m}: No tier`;
      return `<div class="tbc"><div class="tp">${esc(tip)}</div><div class="tc ${cls}">${modeIconMarkup(m)}</div><div class="tl">${label}</div></div>`;
    }).join('');
  }

  let html='<table><thead><tr><th>#</th><th>Skin</th><th>Player</th><th>Region</th><th>Tiers</th></tr></thead><tbody>';
  list.forEach((p,i)=>{
    const rank=i+1;
    const rc=rank===1?'r1':rank===2?'r2':rank===3?'r3':'';
    const title=getTitle(p);
    const pts=getPoints(p);
    const rkColors=['#FFD700','#C0C0C0','#CD7F32'];
    const rkSt=rank<=3?`font-size:18px;font-weight:900;color:${rkColors[rank-1]};text-shadow:0 0 8px ${rkColors[rank-1]}55`:'font-weight:700;color:var(--fg3)';
    const delay=Math.min(i*10,300);

    let warnHtml='';
    if(title.miss&&title.miss.length){
      warnHtml=`<span class="warn-tt">${S.warn}<span class="ttp">Missing LT2+ in: ${title.miss.join(', ')}</span></span>`;
    }

    html+=`<tr class="rw ${rc}" onclick="showPD('${p.username.replace(/'/g,"\\'")}')" style="animation:rowIn .2s ease ${delay}ms both">
      <td style="${rkSt}">${rank}</td>
      <td class="sk-c">${tableSkinCell(p,i)}</td>
      <td class="un-c"><div class="un">${highlightMatch(p.username,q)}</div><div class="ut">${titlePill(title.name)}${isTester(p.username)?`<span class="tc-badge-tester"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 3h6M10 3v5.17a2 2 0 01-.59 1.42L4 15v4a2 2 0 002 2h12a2 2 0 002-2v-4l-5.41-5.41A2 2 0 0114 8.17V3"/></svg> Tester</span>`:''} <span style="color:var(--fg3)">(${pts} pts)</span>${warnHtml}</div></td>
      <td>${p.region}</td>
      <td><div class="tiers-r">${tierBadges(p)}</div></td>
    </tr>`;
  });
  html+='</tbody></table>';
  wrap.innerHTML=html;
  processTableSkinCanvases();
  processBedrockCanvases();
}

// mctiers-style leaderboard: 5 tier columns, each split into High/Low sub-groups.
// Used for any single-mode tab (not Overall, which stays as the detailed row table).
function renderModeTierCols(mode,list){
  const order=['HT1','HT2','HT3','HT4','HT5','LT1','LT2','LT3','LT4','LT5'];
  const cards=order.map(tk=>{
    // Group by base tier — a retired RHT1 counts as HT1's card, just visually flagged
    const players=list.filter(p=>baseTier(p.tiers[mode])===tk).sort((a,b)=>a.username.localeCompare(b.username));
    if(!players.length)return '';
    const rows=players.map((p,i)=>{
      const retired=isRetiredTier(p.tiers[mode]);
      const bodyUrl=getBodyRenderUrl(p);
      const av=bodyUrl
        ?`<img src="${esc(bodyUrl)}" alt="${esc(p.username)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/><div class="tc-prow-av-fb" style="display:none">${S.person}</div>`
        :`<div class="tc-prow-av-fb">${S.person}</div>`;
      return `<div class="tc-prow${i>=8?' tc-prow-more':''}${retired?' tc-prow-retired':''}" onclick="showPD('${p.username.replace(/'/g,"\\'")}')">
        <span class="tc-region tc-region-${(p.region||'na').toLowerCase()}">${esc(p.region||'')}</span>
        <div class="tc-prow-av">${av}</div>
        <span class="tc-pname">${esc(p.username)}</span>
        ${retired?'<span class="tc-retired-tag">Retired</span>':''}
        <svg class="tc-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
      </div>`;
    }).join('');
    const loadMore=players.length>8?`<button class="tc-loadmore" onclick="this.parentElement.querySelectorAll('.tc-prow-more').forEach(r=>r.classList.remove('tc-prow-more'));this.remove()">Load More \u2193</button>`:'';
    return `<div class="tc-card tc-card-${tk.toLowerCase()}">
      <div class="tc-card-h">${S.trophy}<span>${tk}</span><span class="tc-count">${players.length}</span></div>
      <div class="tc-card-body">${rows}</div>
      ${loadMore}
    </div>`;
  }).join('');
  return cards.trim()?`<div class="tc-board">${cards}</div>`:`<div class="em">${S.inbox}<p>No players have a tier in this mode yet.</p></div>`;
}

// ===== CONFETTI (for #1 profile) =====
function fireConfetti(){
  const colors=['#FFD700','#FFC200','#fff','#c084fc','#60a5fa'];
  const wrap=document.createElement('div');
  wrap.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden';
  document.body.appendChild(wrap);
  for(let i=0;i<60;i++){
    const p=document.createElement('span');
    const size=4+Math.random()*5;
    const startX=45+Math.random()*10;
    const drift=(Math.random()-0.5)*60;
    const dur=1.6+Math.random()*1.2;
    const delay=Math.random()*0.3;
    p.style.cssText=`position:absolute;left:${startX}%;top:35%;width:${size}px;height:${size*1.4}px;background:${colors[i%colors.length]};opacity:0;border-radius:1px;--drift:${drift}px;--dur:${dur}s;animation:confettiFall ${dur}s ease-out ${delay}s forwards;transform:rotate(${Math.random()*360}deg)`;
    wrap.appendChild(p);
  }
  setTimeout(()=>wrap.remove(),3200);
}

function goRandomPlayer(){
  if(!window.players.length)return toast('No players yet','error');
  const p=window.players[Math.floor(Math.random()*window.players.length)];
  showPD(p.username);
}

function showPD(un){
  const p=window.players.find(x=>x.username===un);if(!p)return;
  const c=document.getElementById('pdC');
  const title=getTitle(p);const pts=getPoints(p);
  const prog=getProgress(pts);
  const st=skinType(p);

  // Overall rank — same population/order as the Overall tab
  const ranked=window.players.filter(x=>getPoints(x)>0).sort((a,b)=>getPoints(b)-getPoints(a));
  const rankIdx=ranked.findIndex(x=>x.username===p.username);
  const rank=rankIdx>=0?rankIdx+1:null;

  const bodyUrl=getBodyRenderUrl(p);
  const avatarHtml=bodyUrl
    ?`<img src="${esc(bodyUrl)}" alt="${esc(p.username)}" onerror="this.style.display='none';this.parentNode.querySelector('.pd-av-fb').style.display=''"/><div class="pd-av-fb" style="display:none">${S.person}</div>`
    :`<div class="pd-av-fb">${S.person}</div>`;

  const nameMcLink=st==='java'
    ?`<a class="pd-namemc" href="https://namemc.com/profile/${encodeURIComponent(p.username)}" target="_blank" rel="noopener">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        NameMC <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
      </a>`
    :'';

  const s=p.socials||{};
  let socialLinks='';
  if(s.youtube)socialLinks+=`<a class="pd-social pd-social-yt" href="${esc(s.youtube)}" target="_blank" rel="noopener" title="YouTube"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2s-.2-1.6-.9-2.4c-.9-1-1.9-1-2.4-1.1C16.9 2.5 12 2.5 12 2.5h0s-4.9 0-8.2.2c-.5.1-1.5.1-2.4 1.1C.7 4.6.5 6.2.5 6.2S.3 8.1.3 10v1.9c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.4c.9 1 2.1.9 2.6 1 1.9.2 8 .2 8 .2s4.9 0 8.2-.3c.5-.1 1.5-.1 2.4-1.1.7-.8.9-2.4.9-2.4s.2-1.9.2-3.8V10c0-1.9-.2-3.8-.2-3.8zM9.7 14.1V7.4l6.5 3.4-6.5 3.3z"/></svg></a>`;
  if(s.twitch)socialLinks+=`<a class="pd-social pd-social-tw" href="${esc(s.twitch)}" target="_blank" rel="noopener" title="Twitch"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M4.3 2L2 7.5V19h5.5V22h3.4L14 19h4.4L22 15.4V2H4.3zM20 14.4l-2.6 2.6h-4.4L10.4 19.6V17H6V4h14v10.4z"/><path d="M16.6 7.4h2v5.1h-2zM11.1 7.4h2v5.1h-2z"/></svg></a>`;
  if(s.twitter)socialLinks+=`<a class="pd-social pd-social-x" href="${esc(s.twitter)}" target="_blank" rel="noopener" title="Twitter / X"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7.2L4.5 22H1.4l8.1-9.3L1 2h7.2l5 6.6L18.9 2zm-1.2 18h1.7L7.4 4h-1.8l12.1 16z"/></svg></a>`;

  const bioBlock=p.bio?`<div class="pd-bio">${esc(p.bio)}</div>`:'';

  const shareUrl=location.origin+'/profile/'+encodeURIComponent(p.username);
  const copyLinkBtn=`<button class="pd-social" title="Copy profile link" onclick="event.stopPropagation();navigator.clipboard.writeText('${esc(shareUrl)}');toast('Profile link copied!','success')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.07 0l1.93-1.93a5 5 0 00-7.07-7.07L10.5 5.5M14 11a5 5 0 00-7.07 0l-1.93 1.93a5 5 0 007.07 7.07L13.5 18.5"/></svg></button>`;

  let badges=MODES.map(m=>{
    const t=p.tiers[m];
    return `<div class="pd-tier-item ${t?'has-tier':''}">
      ${modeIconMarkup(m)}
      <span class="tbdg ${t?t.toLowerCase():''}" style="font-size:9px">${t||'—'}</span>
    </div>`;
  }).join('');

  let warn='';
  if(title.miss&&title.miss.length){
    warn=`<div class="pd-warn">${S.warn}<span>Missing LT2+ in: <strong>${title.miss.join(', ')}</strong> — needs these to unlock Combat Master.</span></div>`;
  }

  c.innerHTML=`<div class="mhandle"></div>
  <button class="mcl" onclick="closeMs()"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
  <div class="pd-hero">
    <div class="pd-av-circle">${S.crown}${avatarHtml}</div>
    <h2>${esc(p.username)}<span class="cpn" onclick="event.stopPropagation();navigator.clipboard.writeText('${esc(p.username)}');toast('Username copied!','success')">${S.copy}</span></h2>
    <div class="tit-ln">${titlePill(title.name)}${isTester(p.username)?`<span class="tc-badge-tester"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 3h6M10 3v5.17a2 2 0 01-.59 1.42L4 15v4a2 2 0 002 2h12a2 2 0 002-2v-4l-5.41-5.41A2 2 0 0114 8.17V3"/></svg> Tester</span>`:''}</div>
    <div class="rg">${REGION_FLAG[p.region]||''} ${p.region}</div>
    ${nameMcLink}
    <div class="pd-socials">${socialLinks}${copyLinkBtn}</div>
    ${bioBlock}
  </div>
  ${rank?`<div class="pd-pos-lbl">POSITION</div><div class="pd-pos-banner"><span class="pd-pos-num">${rank}.</span>${S.trophy}<span>OVERALL</span><span class="pd-pos-pts">(${pts} points)</span></div>`:''}
  <div class="pd-pos-lbl" style="margin-top:16px">TIERS</div>
  <div class="pd-tier-grid">${badges}</div>
  ${warn}
  <div class="prog-w" style="margin-top:14px"><div class="prog" style="width:${prog.pct}%"></div></div>
  <div class="prog-lbl">${prog.label}</div>`;
  history.pushState(null,'','/profile/'+encodeURIComponent(p.username));
  openM('pdM');
  if(rank===1)fireConfetti();
}

// ===== TESTERS (Minecraft profiles — bust render by skin type, no Discord needed) =====
function getTesters(){return lsg('ht',[])}
function isTester(username){
  if(!username)return false;
  const list=getTesters();
  return list.some(t=>t.toLowerCase()===username.toLowerCase());
}

// Builds one tester card. If the username matches a ranked player, shows their real
// bust render + title + points. If not (a tester who isn't ranked yet), shows a
// silhouette placeholder — still lists them, just without tier data to pull from.
function buildTesterCard(username,index){
  const p=window.players.find(x=>x.username.toLowerCase()===username.toLowerCase());
  const nc=document.createElement('div');
  nc.className='crd tc-card';
  nc.style.cssText='padding:20px 18px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;cursor:'+(p?'pointer':'default');
  nc.style.animation=`pgIn .3s ease ${index*70}ms both`;
  if(p)nc.onclick=()=>showPD(p.username);

  let avatarHtml;
  if(p){
    const bodyUrl=getBodyRenderUrl(p);
    avatarHtml=bodyUrl
      ?`<img src="${esc(bodyUrl)}" alt="${esc(username)}" style="width:64px;height:64px;object-fit:cover;border-radius:12px;background:var(--el)" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/><div class="tc-prow-av-fb" style="display:none;width:64px;height:64px">${S.person}</div>`
      :`<div class="tc-prow-av-fb" style="width:64px;height:64px">${S.person}</div>`;
  }else{
    avatarHtml=`<div class="tc-prow-av-fb" style="width:64px;height:64px">${S.person}</div>`;
  }

  const title=p?getTitle(p):null;
  const pts=p?getPoints(p):0;

  nc.innerHTML=`
    ${avatarHtml}
    <div style="font-weight:700;font-size:15px;display:flex;align-items:center;gap:6px;justify-content:center">
      ${esc(username)}
      <span class="tc-badge-tester"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 3h6M10 3v5.17a2 2 0 01-.59 1.42L4 15v4a2 2 0 002 2h12a2 2 0 002-2v-4l-5.41-5.41A2 2 0 0114 8.17V3"/></svg> Tester</span>
    </div>
    ${p?`<div>${titlePill(title.name)}</div><div style="font-size:12px;color:var(--fg3)">${pts} points</div>`
       :`<div style="font-size:11px;color:var(--fg3);font-style:italic">Not ranked yet</div>`}`;
  return nc;
}

function renderTesters(){
  const el=document.getElementById('testC');
  const countEl=document.getElementById('tsCount');
  if(!el)return;
  const ids=getTesters();
  el.innerHTML='';
  if(!ids.length){
    el.innerHTML=`<div style="padding:32px;text-align:center;color:var(--fg3)">No testers added yet. Add some from the Owner Panel.</div>`;
    if(countEl)countEl.textContent='';
    return;
  }
  ids.forEach((un,i)=>el.appendChild(buildTesterCard(un,i)));
  if(countEl)countEl.textContent=`${ids.length} tester${ids.length!==1?'s':''}`;
}

// ===== PANEL =====
async function initPanel(){
  const c=gC();
  const den=document.getElementById('pDen');
  const con=document.getElementById('pCon');
  if(!c||(c.role!=='Owner'&&c.role!=='Admin')){
    den.style.display='';
    den.innerHTML=`<div style="text-align:center;padding:60px 20px">${S.lock}<p style="color:var(--fg3);margin-top:16px;font-size:14px">Access denied. Please log in with an authorized account.</p></div>`;
    con.style.display='none';return;
  }
  den.style.display='none';con.style.display='';
  if(c.role==='Owner')await refreshRolesCache(); // Admins can't read the roles collection — see Firestore rules
  const isOw=c.role==='Owner';
  buildPanelTabs(isOw);
  buildSettings();
  buildAddEdit();
  sPT(isOw?'psSet':'psAdd');
}

function buildPanelTabs(isOw){
  const tabs=[
    {id:'psSet',label:'Settings',svg:S.settings,ow:true},
    {id:'psAdd',label:'Add/Edit',svg:S.plus},
    {id:'psRm',label:'Remove',svg:S.trash},
    {id:'psMod',label:'Modes',svg:S.trophy,ow:true},
    {id:'psTst',label:'Testers',svg:S.people,ow:true},
    {id:'psAdm',label:'Admins',svg:S.shield,ow:true},
    {id:'psLog',label:'Log',svg:S.log}
  ];
  const el=document.getElementById('pTabs');
  el.innerHTML=tabs.filter(t=>!t.ow||isOw).map(t=>`<span onclick="sPT('${t.id}')" id="pt-${t.id}">${t.svg} ${t.label}</span>`).join('');
}

function sPT(id){
  document.querySelectorAll('.ps').forEach(s=>s.classList.remove('vis'));
  document.querySelectorAll('.pt span').forEach(s=>s.classList.remove('act'));
  const sec=document.getElementById(id);if(sec)sec.classList.add('vis');
  const tab=document.getElementById('pt-'+id);if(tab)tab.classList.add('act');
  if(id==='psRm')renderRmL();
  if(id==='psLog')renderLogL();
  if(id==='psTst')renderTesterMgmt();
  if(id==='psMod')renderModeMgmt();
  if(id==='psAdm')refreshRolesCache().then(buildAdminSec);
}

function buildSettings(){
  const s=gS();
  const c=gC();
  const savedToken=lsg('ht_wt','')||'';
  const curEmail=c?c.email:'';
  document.getElementById('psSet').innerHTML=`
    <h2 style="font-weight:700;font-size:18px;margin-bottom:14px;display:flex;align-items:center;gap:8px">${S.settings} Site Settings</h2>
    <div class="pf"><label>Site Title</label><input type="text" id="sT" value="${esc(s.title)}"/></div>
    <div class="pf"><label>Tagline</label><input type="text" id="sTg" value="${esc(s.tagline)}"/></div>
    <div class="pf"><label>Discord Invite Link</label><input type="text" id="sDc" value="${esc(s.discord)}"/></div>
    <div class="pf"><label>Server IP</label><input type="text" id="sIp" value="${esc(s.serverIp)}" placeholder="play.example.net"/></div>
    <hr style="border-color:var(--bd);margin:18px 0"/>
    <h3 style="font-weight:700;font-size:15px;margin-bottom:10px">🎭 Discord Role Auto-Assign</h3>
    <p style="font-size:12px;color:var(--fg3);margin-bottom:12px">Paste the <strong>WEBSITE_TOKEN</strong> from your <code>.env</code> file. This lets the website tell your bot to assign roles when a player earns a new title.</p>
    <div class="pf"><label>Website Token <span style="color:var(--fg3);font-size:11px">(from .env)</span></label><input type="password" id="sWt" value="${esc(savedToken)}" placeholder="Paste WEBSITE_TOKEN here"/></div>
    <button class="btn-g" onclick="saveSets()" style="margin-top:6px;display:flex;align-items:center;gap:6px">${S.save} Save Settings</button>
    <hr style="border-color:var(--bd);margin:22px 0"/>
    <h3 style="font-weight:700;font-size:15px;margin-bottom:4px">🔑 Change Owner Credentials</h3>
    <p style="font-size:12px;color:var(--fg3);margin-bottom:12px">Current login: <strong style="color:var(--fg)">${esc(curEmail)}</strong></p>
    <div class="pf"><label>Current Password</label><input type="password" id="sCurP" placeholder="Enter current password"/></div>
    <div class="pf"><label>New Email <span style="color:var(--fg3);font-size:11px">(leave blank to keep current)</span></label><input type="email" id="sNE" placeholder="${esc(curEmail)}"/></div>
    <div class="pf"><label>New Password <span style="color:var(--fg3);font-size:11px">(leave blank to keep current)</span></label><input type="password" id="sNP" placeholder="New password"/></div>
    <div class="pf"><label>Confirm New Password</label><input type="password" id="sNP2" placeholder="Repeat new password"/></div>
    <button class="btn-g" onclick="saveCredentials()" style="margin-top:6px;display:flex;align-items:center;gap:6px">${S.save} Update Credentials</button>
    <hr style="border-color:var(--bd);margin:22px 0"/>
    <h3 style="font-weight:700;font-size:15px;margin-bottom:4px;color:#ff3860">⚠ Transfer Ownership</h3>
    <p style="font-size:12px;color:var(--fg3);margin-bottom:12px">Hands full Owner control to another account. You will be demoted to Admin. This cannot be undone by yourself — the new Owner must transfer it back.</p>
    <div class="pf"><label>New Owner</label><select id="toTarget">${gU().filter(u=>u.role!=='Owner').map(u=>`<option value="${esc(u.uid)}">${esc(u.username)} (${esc(u.role)})</option>`).join('')||'<option disabled>No eligible accounts</option>'}</select></div>
    <button class="btn-g" style="background:#ff3860" onclick="confirmTransferOwnership()">Transfer Ownership</button>`;
}

function buildAddEdit(){
  const modesHtml=MODES.map(m=>{
    return `<label><input type="checkbox" value="${esc(m)}"/>${modeIconMarkup(m)} ${esc(m)}</label>`;
  }).join('');

  document.getElementById('psAdd').innerHTML=`
    <h2 style="font-weight:700;font-size:18px;margin-bottom:14px;display:flex;align-items:center;gap:8px">${S.plus} Add / Edit Player</h2>

    <div class="pf"><label>Username</label><input type="text" id="apU" placeholder="Java/Bedrock gamertag or any name"/></div>

    <div class="pf">
      <label>Skin / Account Type</label>
      <div class="st-tabs">
        <div class="st-tab act" id="stJ" onclick="setSkinTab('java')">☕ Java</div>
        <div class="st-tab"     id="stB" onclick="setSkinTab('bedrock')">🪨 Bedrock</div>
        <div class="st-tab"     id="stR" onclick="setSkinTab('raw')">🖼 Raw PNG</div>
      </div>
      <div id="stInfo"></div>
    </div>

    <div class="pf"><label>Discord ID <span style="color:var(--fg3);font-size:11px;font-weight:400">(optional — needed for auto role)</span></label><input type="text" id="apDid" placeholder="e.g. 123456789012345678"/></div>
    <div class="pf"><label>Region</label><select id="apR"><option>NA</option><option>EU</option><option>AS</option><option>SA</option><option>OC</option><option>AF</option></select></div>
    <div class="pf"><label>Game Modes (select multiple)</label><div class="modes-grid" id="modesGrid">${modesHtml}</div></div>
    <div class="pf"><label>Tier</label><select id="apTr">${TIERS.map(t=>'<option>'+t+'</option>').join('')}</select></div>
    <div class="pf"><label style="display:flex;align-items:center;gap:6px;cursor:pointer"><input type="checkbox" id="apRetired" style="width:16px;height:16px;accent-color:var(--gld)"/> Mark as Retired <span style="color:var(--fg3);font-size:11px;font-weight:400">(same rank/points, flagged inactive)</span></label></div>

    <hr style="border-color:var(--bd);margin:18px 0"/>
    <h3 style="font-weight:700;font-size:14px;margin-bottom:10px">Socials & Details <span style="color:var(--fg3);font-size:11px;font-weight:400">(optional — shown on their profile)</span></h3>
    <div class="pf"><label>YouTube</label><input type="text" id="apYt" placeholder="https://youtube.com/@handle"/></div>
    <div class="pf"><label>Twitch</label><input type="text" id="apTw" placeholder="https://twitch.tv/handle"/></div>
    <div class="pf"><label>Twitter / X</label><input type="text" id="apX" placeholder="https://x.com/handle"/></div>
    <div class="pf"><label>Bio / Notes</label><textarea id="apBio" rows="3" placeholder="Short bio shown on their profile page" style="width:100%;resize:vertical;font-family:inherit"></textarea></div>

    <button class="btn-g" onclick="addEdit()" style="margin-top:6px;display:flex;align-items:center;gap:6px">${S.plus} Save Player</button>`;

  setSkinTab('java');
}

function setSkinTab(type){
  document.querySelectorAll('.st-tab').forEach(t=>t.classList.remove('act'));
  document.getElementById('stJ').classList.toggle('act',type==='java');
  document.getElementById('stB').classList.toggle('act',type==='bedrock');
  document.getElementById('stR').classList.toggle('act',type==='raw');
  document.getElementById('apU').placeholder=
    type==='java'?'Java username (e.g. Notch)':
    type==='bedrock'?'Bedrock gamertag (e.g. Steve)':
    'Player display name';
  const info=document.getElementById('stInfo');
  if(type==='java'){
    info.innerHTML='<div class="st-note">Fetches a full <strong>3D body render</strong> using the Mojang API + Crafatar. Enter the exact Java username. UUID is resolved automatically.</div>';
  }else if(type==='bedrock'){
    info.innerHTML='<div class="st-note">Fetches the Bedrock player skin via GeyserMC/Xbox API. Enter the Bedrock gamertag (Xbox username).<br><div class="pf" style="margin-top:8px"><label>Bedrock Gamertag</label><input type="text" id="apBgt" placeholder="Xbox gamertag"/></div></div>';
  }else{
    info.innerHTML='<div class="st-note">Provide a direct URL to a <strong>64×64 Minecraft skin PNG</strong>. The skin map is parsed and rendered as a 3D character using the standard UV layout.</div><div class="pf" style="margin-top:0"><label>Skin PNG URL</label><input type="text" id="apSk" placeholder="https://example.com/skin.png"/></div>';
  }
  document.getElementById('psAdd').dataset.skinType=type;
}

function toggleSkinUrl(){} // kept for compat

function saveSets(){
  const c=gC();if(!c||c.role!=='Owner')return toast('Owner only','error');
  const s={
    title:document.getElementById('sT').value.trim()||'Heavenly Tiers',
    tagline:document.getElementById('sTg').value.trim()||'Rise Through the Ranks',
    discord:document.getElementById('sDc').value.trim()||'https://discord.gg/xJ9r4vyG',
    serverIp:document.getElementById('sIp').value.trim()||'play.example.net'
  };
  const wt=document.getElementById('sWt').value.trim();
  if(wt)lss('ht_wt',wt);
  lss('hs',s);apS();logA('Settings updated by '+c.email);toast('Settings saved!','success');
}

async function saveCredentials(){
  const c=gC();if(!c||c.role!=='Owner')return toast('Owner only','error');
  const curP=document.getElementById('sCurP').value;
  const newE=(document.getElementById('sNE').value||'').trim().toLowerCase();
  const newP=document.getElementById('sNP').value;
  const newP2=document.getElementById('sNP2').value;
  if(!curP)return toast('Enter current password','error');
  if(newP&&newP!==newP2)return toast('New passwords do not match','error');
  if(newP&&newP.length<6)return toast('Password min 6 chars — Firebase requirement','error');
  try{
    await window.fbUpdateCredentials(curP,newE||null,newP||null);
  }catch(err){
    return toast(friendlyAuthError(err),'error');
  }
  if(newE)c.email=newE;
  logA('Owner credentials updated by '+c.email);
  toast('Credentials updated successfully','success');
  document.getElementById('sCurP').value='';
  document.getElementById('sNP').value='';
  document.getElementById('sNP2').value='';
}

function addEdit(){
  const c=gC();if(!c||(c.role!=='Owner'&&c.role!=='Admin'))return toast('Not authorized','error');
  const un=document.getElementById('apU').value.trim();
  const rg=document.getElementById('apR').value;
  const tr=(document.getElementById('apRetired').checked?'R':'')+document.getElementById('apTr').value;
  const did=document.getElementById('apDid').value.trim();
  const stEl=document.getElementById('psAdd');
  const st=stEl?stEl.dataset.skinType||'java':'java';
  if(!un)return toast('Username required','error');

  const selectedModes=[];
  document.querySelectorAll('#modesGrid input[type=checkbox]:checked').forEach(cb=>selectedModes.push(cb.value));
  if(!selectedModes.length)return toast('Select at least one game mode','error');

  // Extra skin fields depending on type
  const rawSkinUrl=(st==='raw'&&document.getElementById('apSk'))?document.getElementById('apSk').value.trim():'';
  const bedrockGt=(st==='bedrock'&&document.getElementById('apBgt'))?document.getElementById('apBgt').value.trim():'';

  // Validate required skin fields
  if(st==='raw'&&!rawSkinUrl)return toast('Provide a skin PNG URL for Raw type','error');
  if(st==='bedrock'&&!bedrockGt)return toast('Enter the Bedrock gamertag','error');

  // Optional socials & bio
  const socials={
    youtube:(document.getElementById('apYt').value||'').trim(),
    twitch:(document.getElementById('apTw').value||'').trim(),
    twitter:(document.getElementById('apX').value||'').trim()
  };
  const bio=(document.getElementById('apBio').value||'').trim();

  let p=window.players.find(x=>x.username.toLowerCase()===un.toLowerCase());
  const oldTitle=p?getTitle(p).name:'Unranked';
  const oldTiers=p?Object.assign({},p.tiers):{};

  if(p){
    selectedModes.forEach(m=>p.tiers[m]=tr);
    p.region=rg;
    p.skinType=st;
    if(st==='java'){p.isPremium=true;delete p.skinUrl;}
    if(st==='raw'){p.skinUrl=rawSkinUrl;p.isPremium=false;}
    if(st==='bedrock'){p.bedrockGt=bedrockGt;p.isPremium=false;}
    if(did)p.discordId=did;
    if(socials.youtube||socials.twitch||socials.twitter)p.socials=socials;
    if(bio)p.bio=bio;
    logA('Updated '+un+': '+selectedModes.join(',')+'to '+tr+' by '+c.email,{type:'updateTiers',username:un,tiers:oldTiers});
    toast('Updated '+un+' — '+selectedModes.length+' mode(s): '+tr,'success');
  }else{
    p={username:un,region:rg,tiers:{},skinType:st,isPremium:st==='java',discordId:did||''};
    if(st==='raw')p.skinUrl=rawSkinUrl;
    if(st==='bedrock')p.bedrockGt=bedrockGt;
    if(socials.youtube||socials.twitch||socials.twitter)p.socials=socials;
    if(bio)p.bio=bio;
    selectedModes.forEach(m=>p.tiers[m]=tr);
    window.players.push(p);
    logA('Added '+un+' ('+rg+', '+selectedModes.join(',')+': '+tr+') by '+c.email,{type:'addPlayer',username:un});
    toast('Added '+un,'success');
  }

  // ── Auto-resolve Bedrock XUID ───────────────────────────────
  if(st==='bedrock'&&bedrockGt&&!p.xuid){
    fetchBedrockXUID(bedrockGt).then(xuid=>{
      if(xuid){p.xuid=xuid;savePlayers();toast('Bedrock XUID resolved for '+un,'success');}
      else toast('Could not find Bedrock XUID for '+bedrockGt+' — skin will show as placeholder','error');
    });
  }

  // ── Save to localStorage immediately ───────────────────────
  savePlayers();

  // ── Discord role auto-assignment ───────────────────────────
  if(p.discordId){
    const token=lsg('ht_wt','')||'';
    if(token){
      const newTitle=getTitle(p).name;
      if(newTitle!==oldTitle&&newTitle!=='Unranked')
        assignDiscordRole(p.discordId,newTitle,p.username);
      selectedModes.forEach(m=>{
        if(tr!==(oldTiers[m]||null))
          assignModeTierRole(p.discordId,m,tr,p.username);
      });
    }
  }

  document.getElementById('apU').value='';
  document.getElementById('apDid').value='';
  document.querySelectorAll('#modesGrid input[type=checkbox]').forEach(cb=>cb.checked=false);
  if(curPg==='rankings')renderRank();

}


// Assign the matching Discord role for a website TITLE (Rookie, Novice, etc.)
async function assignDiscordRole(discordId,titleName,username){
  const token=lsg('ht_wt','')||'';
  if(!token){toast(`⚠️ No website token — set it in Settings to auto-assign roles`,'error');return;}
  try{
    const res=await fetch(`${API_BASE}/api/roles/assign`,{
      method:'POST',
      headers:{'Content-Type':'application/json','x-website-token':token},
      body:JSON.stringify({discordId,titleName}),
    });
    const data=await res.json();
    if(data.ok) toast(`🎭 Gave ${titleName} role to ${username} on Discord`,'success');
    else toast(`⚠️ Title role failed: ${data.reason||'check bot logs'}`,'error');
  }catch(e){toast(`⚠️ Could not reach API for title role`,'error');}
}

// Assign the matching Discord role for a GAMEMODE+TIER (e.g. Spearmace HT1)
async function assignModeTierRole(discordId,gamemode,tier,username){
  const token=lsg('ht_wt','')||'';
  if(!token)return; // silently skip if not configured
  try{
    const res=await fetch(`${API_BASE}/api/roles/assign-mode-tier`,{
      method:'POST',
      headers:{'Content-Type':'application/json','x-website-token':token},
      body:JSON.stringify({discordId,gamemode,tier}),
    });
    const data=await res.json();
    if(data.ok) toast(`🎭 Gave ${gamemode} ${tier} role to ${username}`,'success');
  }catch(e){/* silently ignore if API unreachable */}
}

function renderRmL(){
  const l=document.getElementById('psRm');
  if(!window.players.length){
    l.innerHTML=`<h2 style="font-weight:700;font-size:18px;margin-bottom:14px;display:flex;align-items:center;gap:8px">${S.trash} Remove Players</h2><p style="color:var(--fg3)">No players to remove.</p>`;return;
  }
  l.innerHTML=`<h2 style="font-weight:700;font-size:18px;margin-bottom:14px;display:flex;align-items:center;gap:8px">${S.trash} Remove Players</h2>
  <div class="rl">${window.players.map(p=>`<div class="ri"><div><span style="font-weight:600">${esc(p.username)}</span> <span style="color:var(--fg3);font-size:12px">${p.region} &middot; ${getPoints(p)} pts</span></div><button class="del" onclick="cfmRm('${p.username.replace(/'/g,"\\'")}')">${S.trash}</button></div>`).join('')}</div>`;
}

function cfmRm(un){
  document.getElementById('cfmH').innerHTML=S.warn+' Confirm Removal';
  document.getElementById('cfmMsg').textContent=`Remove player "${un}"? This cannot be undone.`;
  const y=document.getElementById('cfmY');
  y.textContent='Yes, Remove';
  y.onclick=()=>{
    const removed=window.players.find(p=>p.username===un);
    const snapshot=removed?JSON.parse(JSON.stringify(removed)):null;
    window.players=window.players.filter(p=>p.username!==un);
    savePlayers();
    const c=gC();logA(`Removed ${un} by ${c?c.email:'unknown'}`,{type:'removePlayer',player:snapshot});
    toast(`Removed ${un}`,'success');closeMs();renderRmL();
    if(curPg==='rankings')renderRank();
  };
  openM('cfmM');
}

function confirmTransferOwnership(){
  const sel=document.getElementById('toTarget');
  if(!sel||!sel.value)return toast('No account selected','error');
  const uid=sel.value;
  const target=gU().find(x=>x.uid===uid);
  if(!target)return toast('Account not found','error');
  document.getElementById('cfmH').innerHTML=S.warn+' Confirm Ownership Transfer';
  document.getElementById('cfmMsg').textContent=`Transfer Owner to "${target.username}"? You will be demoted to Admin immediately. This cannot be undone by yourself.`;
  const y=document.getElementById('cfmY');
  y.textContent='Yes, Transfer';
  y.onclick=()=>doTransferOwnership(uid);
  openM('cfmM');
}
async function doTransferOwnership(uid){
  const c=gC();if(!c||c.role!=='Owner')return;
  const target=gU().find(x=>x.uid===uid);
  if(!target)return toast('Account not found','error');
  try{
    await window.setRoleDoc(c.uid,{role:'Admin'});
    await window.setRoleDoc(uid,{role:'Owner'});
  }catch(err){
    return toast('Transfer failed: '+err.message,'error');
  }
  logA(`${c.username||c.email} transferred Owner to ${target.username}`);
  c.role='Admin';
  closeMs();
  upAuth();
  showPage('home');
  toast('Ownership transferred. You are now Admin.','success');
}

// ===== TESTER MANAGEMENT =====
function renderTesterMgmt(){
  const ids=getTesters();
  const el=document.getElementById('psTst');
  let cards=ids.map(un=>{
    const p=window.players.find(x=>x.username.toLowerCase()===un.toLowerCase());
    const bodyUrl=p?getBodyRenderUrl(p):null;
    return `<div class="tm-card" style="margin-bottom:8px">
      ${bodyUrl?`<img src="${esc(bodyUrl)}" style="width:32px;height:32px;border-radius:8px;object-fit:cover" onerror="this.style.display='none'"/>`:''}
      <div style="flex:1">
        <div class="tm-name">${esc(un)}</div>
        <div class="tm-id">${p?'Ranked player':'Not ranked yet'}</div>
      </div>
      <button class="del" onclick="rmTester('${un.replace(/'/g,"\\'")}')">${S.trash}</button>
    </div>`;
  }).join('');

  el.innerHTML=`<h2 style="font-weight:700;font-size:18px;margin-bottom:14px;display:flex;align-items:center;gap:8px">${S.people} Manage Testers</h2>
    <p style="font-size:12px;color:var(--fg3);margin-bottom:14px">Shows on the public Testers page with their Minecraft bust render, and tags them as a Tester on their tier profile.</p>
    ${cards}
    <div class="tm-add">
      <input type="text" id="newTstId" placeholder="Minecraft Username"/>
      <button onclick="addTester()">${S.plus}</button>
    </div>`;
}

function addTester(){
  const un=document.getElementById('newTstId').value.trim();
  if(!un)return toast('Enter a Minecraft username','error');
  let ids=getTesters();
  if(ids.some(x=>x.toLowerCase()===un.toLowerCase()))return toast('Tester already exists','error');
  ids.push(un);lss('ht',ids);
  const c=gC();logA(`Added tester ${un} by ${c?c.username||c.email:'unknown'}`);
  toast('Tester added!','success');
  renderTesterMgmt();
  if(curPg==='testers')renderTesters();
  if(curPg==='rankings')renderRank();
}

function rmTester(un){
  let ids=getTesters();
  document.getElementById('cfmH').innerHTML=S.warn+' Remove Tester';
  document.getElementById('cfmMsg').textContent=`Remove "${un}" from testers?`;
  const y=document.getElementById('cfmY');
  y.textContent='Yes, Remove';
  y.onclick=()=>{
    ids=ids.filter(x=>x.toLowerCase()!==un.toLowerCase());lss('ht',ids);
    const c=gC();logA(`Removed tester ${un} by ${c?c.username||c.email:'unknown'}`);
    toast('Tester removed','success');closeMs();renderTesterMgmt();
    if(curPg==='testers')renderTesters();
    if(curPg==='rankings')renderRank();
  };
  openM('cfmM');
}

// ===== GAME MODE MANAGEMENT (Owner only) =====
function renderModeMgmt(){
  const el=document.getElementById('psMod');
  const cards=MODES.map((m,i)=>{
    const ic=MODE_IC[m];
    const hasImg=ic&&ic.u;
    return `<div class="mm-card" data-mode="${esc(m)}">
      ${hasImg?`<img src="${ic.u}" alt="${esc(m)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/><div class="mm-noimg" style="display:none"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>`
        :`<div class="mm-noimg"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>`}
      <div class="mm-info">
        <div class="mm-name">${esc(m)}</div>
        ${hasImg?`<div class="mm-url">${esc(ic.u)}</div>`:'<div class="mm-url" style="color:var(--fg3);font-style:italic">No icon</div>'}
      </div>
      <div class="mm-acts">
        <button onclick="renameMode('${m.replace(/'/g,"\\'")}')" title="Rename">${S.edit}</button>
        <button onclick="editModeIcon('${m.replace(/'/g,"\\'")}')" title="Change icon">${S.image}</button>
        <button class="del" onclick="removeMode('${m.replace(/'/g,"\\'")}')" title="Remove">${S.trash}</button>
      </div>
    </div>`;
  }).join('');

  el.innerHTML=`<h2 style="font-weight:700;font-size:18px;margin-bottom:14px;display:flex;align-items:center;gap:8px">${S.trophy} Manage Game Modes</h2>
    <p style="font-size:12px;color:var(--fg3);margin-bottom:14px">${MODES.length} mode${MODES.length!==1?'s':''}. Rename, change icons, add or remove modes. Changes affect rankings and player tiers.</p>
    ${cards}
    <div class="mm-add">
      <div class="pf"><label>Mode Name</label><input type="text" id="newModeName" placeholder="e.g. Trident"/></div>
      <div class="pf"><label>Icon Image (optional)</label><input type="file" id="newModeIcon" accept="image/*"/></div>
      <button onclick="addMode()" title="Add mode">${S.plus}</button>
    </div>`;
}

// URL-safe key for a mode name — used for the /tier_icons/{slug} serving route.
function modeSlug(name){return String(name).toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')}

// Reads a File as base64 (no data: prefix) — used for icon uploads.
function fileToBase64(file){
  return new Promise((resolve,reject)=>{
    const r=new FileReader();
    r.onload=()=>resolve(r.result.split(',')[1]);
    r.onerror=reject;
    r.readAsDataURL(file);
  });
}

// Uploads an icon file for a mode, stores it in Firestore, and points MODE_IC at
// the clean serving URL. Shared by both Add Mode and the per-mode edit-icon button.
async function uploadAndSetModeIcon(modeName,file){
  if(!file)return false;
  if(file.size>800*1024){toast('Image too large — keep it under 800KB','error');return false;}
  if(!file.type.startsWith('image/')){toast('Please choose an image file','error');return false;}
  const slug=modeSlug(modeName);
  try{
    const base64=await fileToBase64(file);
    await window.uploadModeIcon(slug,base64,file.type);
  }catch(err){
    toast('Icon upload failed: '+(err.message||err),'error');
    return false;
  }
  MODE_IC[modeName]={u:'/tier_icons/'+slug+'?v='+Date.now()};
  return true;
}

async function addMode(){
  const c=gC();if(!c||c.role!=='Owner')return toast('Owner only','error');
  const name=document.getElementById('newModeName').value.trim();
  const fileInput=document.getElementById('newModeIcon');
  const file=fileInput&&fileInput.files&&fileInput.files[0];
  if(!name)return toast('Mode name is required','error');
  if(MODES.some(m=>m.toLowerCase()===name.toLowerCase()))return toast('Mode already exists','error');
  if(name.toLowerCase()==='overall')return toast('Cannot use "Overall" as a mode name','error');
  MODES.push(name);
  MODE_IC[name]={u:''};
  if(file){
    const ok=await uploadAndSetModeIcon(name,file);
    if(!ok){MODES.pop();delete MODE_IC[name];return;} // don't leave a half-added mode if upload failed
  }
  saveModes();
  logA(`Added game mode "${name}" by ${c.email}`);
  toast(`Added mode: ${name}`,'success');
  renderModeMgmt();
  buildAddEdit();
}

function renameMode(oldName){
  const newName=prompt('Rename "'+oldName+'" to:',oldName);
  if(!newName||!newName.trim()||newName.trim()===oldName)return;
  const nm=newName.trim();
  const c=gC();if(!c||c.role!=='Owner')return toast('Owner only','error');
  if(nm.toLowerCase()==='overall')return toast('Cannot use "Overall" as a mode name','error');
  if(MODES.some(m=>m.toLowerCase()===nm.toLowerCase()&&m!==oldName))return toast('Mode name already exists','error');
  // Update MODES array
  const idx=MODES.indexOf(oldName);
  if(idx===-1)return;
  MODES[idx]=nm;
  // Update MODE_IC
  MODE_IC[nm]=MODE_IC[oldName]||{u:''};
  if(nm!==oldName)delete MODE_IC[oldName];
  // Update all player tiers
  window.players.forEach(p=>{
    if(p.tiers[oldName]!==undefined){
      p.tiers[nm]=p.tiers[oldName];
      delete p.tiers[oldName];
    }
  });
  saveModes();
  logA(`Renamed mode "${oldName}" → "${nm}" by ${c.email}`);
  toast(`Renamed: ${oldName} → ${nm}`,'success');
  renderModeMgmt();
  buildAddEdit();
  if(curPg==='rankings')renderRank();
}

function editModeIcon(modeName){
  const c=gC();if(!c||c.role!=='Owner')return toast('Owner only','error');
  const input=document.createElement('input');
  input.type='file';
  input.accept='image/*';
  input.onchange=async()=>{
    const file=input.files&&input.files[0];
    if(!file)return;
    const oldUrl=MODE_IC[modeName]?MODE_IC[modeName].u:'';
    const ok=await uploadAndSetModeIcon(modeName,file);
    if(!ok)return;
    saveModes();
    logA(`Changed icon for "${modeName}" by ${c.email}`,{type:'changeIcon',mode:modeName,url:oldUrl});
    toast(`Icon updated for ${modeName}`,'success');
    renderModeMgmt();
    if(curPg==='rankings')renderRank();
  };
  input.click();
}

function removeMode(modeName){
  if(MODES.length<=1)return toast('Must have at least one game mode','error');
  const c=gC();if(!c||c.role!=='Owner')return toast('Owner only','error');
  document.getElementById('cfmH').innerHTML=S.warn+' Remove Game Mode';
  document.getElementById('cfmMsg').textContent=`Remove "${modeName}"? This will also remove all player tiers for this mode.`;
  const y=document.getElementById('cfmY');
  y.textContent='Yes, Remove';
  y.onclick=()=>{
    MODES=MODES.filter(m=>m!==modeName);
    delete MODE_IC[modeName];
    // Clean player tiers
    window.players.forEach(p=>{delete p.tiers[modeName]});
    saveModes();
    logA(`Removed game mode "${modeName}" by ${c.email}`);
    toast(`Removed mode: ${modeName}`,'success');
    closeMs();
    renderModeMgmt();
    buildAddEdit();
    if(curPg==='rankings')renderRank();
  };
  openM('cfmM');
}

// ===== MANAGE ADMINS — visual user list =====
function buildAdminSec(){
  const el=document.getElementById('psAdm');
  const c=gC();
  const us=gU();

  // Sort: Owner → Admin → Member, then alphabetically
  const roleOrder={Owner:0,Admin:1,Member:2};
  const sorted=[...us].sort((a,b)=>(roleOrder[a.role]??2)-(roleOrder[b.role]??2)||(a.username||'').localeCompare(b.username||''));

  el.innerHTML=`
    <h2 style="font-weight:700;font-size:18px;margin-bottom:6px;display:flex;align-items:center;gap:8px">${S.shield} Manage Users</h2>
    <p style="color:var(--fg3);font-size:13px;margin-bottom:14px">${us.length} registered account${us.length!==1?'s':''} — click a button to promote or demote.</p>
    <input class="adm-search" id="admQ" placeholder="🔍  Search by username or email…" oninput="filterAdmUsers(this.value)"/>
    <div class="usr-grid" id="usrGrid">${sorted.map(u=>userCard(u,c)).join('')}</div>`;
}

function userCard(u,cur){
  const isYou=cur&&cur.uid===u.uid;
  const isOwner=u.role==='Owner';
  const isAdmin=u.role==='Admin';
  const displayEmail=u.email||'';
  const initial=(u.username||displayEmail||'?')[0].toUpperCase();

  // Unique avatar colour derived from uid
  const hue=([...u.uid].reduce((a,ch)=>a+ch.charCodeAt(0),0))%360;
  const avBg=`hsl(${hue},50%,30%)`;
  const avFg=`hsl(${hue},80%,75%)`;

  const roleBadge=isOwner
    ?`<span class="role-badge rb-owner">👑 Owner</span>`
    :isAdmin
    ?`<span class="role-badge rb-admin">🛡 Admin</span>`
    :`<span class="role-badge rb-member">Member</span>`;

  // Buttons — only Owner can change roles; can't modify yourself or other Owner
  let btns='';
  if(cur&&cur.role==='Owner'&&!isOwner&&!isYou){
    btns=isAdmin
      ?`<button class="btn-demote" onclick="setRole('${esc(u.uid)}','Member')">Revoke Admin</button>`
      :`<button class="btn-promote" onclick="setRole('${esc(u.uid)}','Admin')">Make Admin</button>`;
    btns+=`<button class="btn-demote" style="background:rgba(255,56,96,.15);color:#ff3860;border-color:rgba(255,56,96,.3)" onclick="cfmDelUser('${esc(u.uid)}')">Delete User</button>`;
  }

  return `<div class="usr-card ${isOwner?'is-owner':isAdmin?'is-admin':''}" data-email="${esc(displayEmail.toLowerCase())}" data-name="${esc((u.username||displayEmail).toLowerCase())}">
    <div class="usr-av" style="background:${avBg};color:${avFg}">${initial}</div>
    <div class="usr-meta">
      <div class="usr-name">
        ${esc(u.username||displayEmail.split('@')[0]||'Unknown')}
        ${isYou?`<span class="usr-you">You</span>`:''}
      </div>
      <div class="usr-email">${esc(displayEmail)}</div>
      <div style="margin-top:5px">${roleBadge}</div>
    </div>
    ${btns?`<div class="usr-acts">${btns}</div>`:''}
  </div>`;
}

function filterAdmUsers(q){
  const term=q.toLowerCase();
  document.querySelectorAll('#usrGrid .usr-card').forEach(card=>{
    const match=card.dataset.email.includes(term)||card.dataset.name.includes(term);
    card.style.display=match?'':'none';
  });
}

function cfmDelUser(uid){
  const c=gC();if(!c||c.role!=='Owner')return toast('Owner only','error');
  const u=gU().find(x=>x.uid===uid);
  if(!u)return toast('User not found','error');
  if(u.role==='Owner')return toast('Cannot delete the Owner account','error');
  if(u.uid===c.uid)return toast('Cannot delete your own account here — use Danger Zone in the account menu','error');
  document.getElementById('cfmH').innerHTML=S.warn+' Confirm User Deletion';
  document.getElementById('cfmMsg').textContent=`Permanently delete "${u.username||u.email}"? This removes their role/access immediately. Note: their login itself can only be fully deleted via Firebase Console (client apps can't delete other users' auth accounts).`;
  const y=document.getElementById('cfmY');
  y.textContent='Yes, Delete';
  y.onclick=()=>doDelUser(uid);
  openM('cfmM');
}
async function doDelUser(uid){
  const c=gC();if(!c||c.role!=='Owner')return;
  const u=gU().find(x=>x.uid===uid);
  if(!u)return toast('User not found','error');
  if(u.role==='Owner')return toast('Cannot delete the Owner account','error');
  try{
    await window.deleteRoleDoc(uid);
  }catch(err){
    return toast('Delete failed: '+err.message,'error');
  }
  logA(`${u.username||u.email} deleted by ${c.username||c.email}`);
  closeMs();
  toast('User access removed','success');
  await refreshRolesCache();
  buildAdminSec();
}
async function setRole(uid,newRole){
  const c=gC();if(!c||c.role!=='Owner')return toast('Owner only','error');
  if(uid===c.uid)return toast('Cannot change your own role','error');
  const u=gU().find(x=>x.uid===uid);
  if(!u)return toast('User not found','error');
  try{
    await window.setRoleDoc(uid,{role:newRole});
  }catch(err){
    return toast('Failed: '+err.message,'error');
  }
  const label=newRole==='Admin'?'Granted Admin to':'Revoked Admin from';
  u.role=newRole; // update the local cache immediately so the UI reflects it without a refetch
  logA(`${label} ${u.username||u.email} by ${c.username||c.email}`);
  toast(`${u.username||'User'} is now ${newRole}`,'success');
  buildAdminSec(); // re-render with updated roles
}

function renderLogL(){
  const logs=lsg('hal',[]);
  const l=document.getElementById('psLog');
  l.innerHTML=`<h2 style="font-weight:700;font-size:18px;margin-bottom:14px;display:flex;align-items:center;gap:8px">${S.log} Action Log</h2>`;
  if(!logs.length){l.innerHTML+='<p style="color:var(--fg3)">No actions logged yet.</p>';return}
  l.innerHTML+=`<div class="ll">${logs.map((x,i)=>`<div class="li">${S.clock}<span class="ts">${x.ts}</span><span>${esc(x.desc)}</span>${x.payload?`<button class="log-redo" onclick="redoLogAction(${i})" title="Reverse this action">↺ Redo</button>`:''}</div>`).join('')}</div>`;
}

// Reverses a specific logged action using the payload snapshot captured at log time.
// Only entries with a stored payload show a Redo button — older/unsupported entries won't.
function redoLogAction(i){
  const logs=lsg('hal',[]);
  const entry=logs[i];
  if(!entry||!entry.payload)return;
  const p=entry.payload;
  const c=gC();
  switch(p.type){
    case 'removePlayer':
      if(!p.player)return toast('No snapshot to restore','error');
      if(window.players.find(x=>x.username===p.player.username))return toast(p.player.username+' already exists','error');
      window.players.push(p.player);
      savePlayers();
      toast('Restored '+p.player.username,'success');
      if(curPg==='rankings')renderRank();
      break;
    case 'addPlayer':
      window.players=window.players.filter(x=>x.username!==p.username);
      savePlayers();
      toast('Removed '+p.username,'success');
      if(curPg==='rankings')renderRank();
      break;
    case 'updateTiers':
      { const pl=window.players.find(x=>x.username===p.username);
        if(!pl)return toast(p.username+' not found','error');
        pl.tiers=JSON.parse(JSON.stringify(p.tiers));
        savePlayers();
        toast('Reverted tiers for '+p.username,'success');
        if(curPg==='rankings')renderRank();
      }
      break;
    case 'changeIcon':
      MODE_IC[p.mode]={u:p.url};
      saveModes();
      toast('Reverted icon for '+p.mode,'success');
      if(curPg==='rankings')renderRank();
      break;
    default:
      return toast('This action type can\'t be auto-reverted','error');
  }
  logA(`${c?c.email:'unknown'} used Redo on: "${entry.desc}"`);
  renderLogL();
}

// ===== BACK TO TOP =====
window.addEventListener('scroll',()=>{
  const btn=document.getElementById('btt');
  if(curPg==='rankings'&&window.scrollY>300)btn.classList.add('vis');
  else btn.classList.remove('vis');
});

// ===== KEYBOARD =====
document.addEventListener('keydown',e=>{
  if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){
    e.preventDefault();document.getElementById('sBar').focus();
  }
  if(e.key==='Escape'){closeMs();closeHam()}
});

// ===== STICKY HEADER HEIGHT =====
function upHdr(){document.documentElement.style.setProperty('--hdr-h',document.getElementById('hdr').offsetHeight+'px')}
window.addEventListener('resize',upHdr);

// ===== BUILD DYNAMIC SECTIONS =====
function buildUI(){
  // Features
  const feats=[
    {svg:'<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M15 21l6-6"/></svg>',t:MODES.length+' Game Modes',d:'Master every combat style across all modes.'},
    {svg:S.trophy,t:'Tier System',d:'HT1 through LT5 — climb the ranks and prove your skill.'},
    {svg:S.people,t:'Community',d:'Join a thriving community of PvP enthusiasts.'},
    {svg:S.code,t:'API Access',d:'Integrate player data into your own tools and bots.'}
  ];
  document.getElementById('featGrid').innerHTML=feats.map(f=>`<div class="crd fc"><div class="fci">${f.svg}</div><h3>${f.t}</h3><p>${f.d}</p></div>`).join('');

  // IP buttons
  document.getElementById('cpBtn').innerHTML=S.copy+' Copy IP';
  document.getElementById('dcBtn').innerHTML=S.discord+' Discord';
  document.getElementById('dcBtn').onclick=()=>window.open(gS().discord,'_blank');

  // Page headers with SVG
  document.getElementById('rkH').innerHTML=S.trophy+' Rankings';
  document.getElementById('tsH').innerHTML='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v5.17a2 2 0 01-.59 1.42L4 15v4a2 2 0 002 2h12a2 2 0 002-2v-4l-5.41-5.41A2 2 0 0114 8.17V3"/></svg> Testers';
  document.getElementById('apiH').innerHTML=S.code+' API Documentation';
  document.getElementById('panH').innerHTML=S.crown+' Owner / Admin Panel';

  // Info button
  document.getElementById('infoBtn').innerHTML=S.info+' Information';
  document.getElementById('randBtn').innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg> Random';

  // Info modal content
  document.getElementById('infC').innerHTML=`<div class="mhandle"></div>
    <button class="mcl" onclick="closeMs()"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
    <h2>${S.info} Tier & Title Information</h2>
    <h3 style="font-weight:700;font-size:14px;margin-bottom:6px">Point Values</h3>
    <table class="itbl"><tr><th>Tier</th><th>Points</th></tr>
    ${[['HT1',60],['LT1',45],['HT2',30],['LT2',20],['HT3',10],['LT3',6],['HT4',4],['LT4',3],['HT5',2],['LT5',1]].map(([t,p])=>`<tr><td><span class="tbdg ${t.toLowerCase()}">${t}</span></td><td>${p}</td></tr>`).join('')}
    </table>
    <h3 style="font-weight:700;font-size:14px;margin:16px 0 6px">Titles</h3>
    <table class="itbl"><tr><th>Title</th><th>Points</th></tr>
    <tr><td>${TI.Rookie} Rookie</td><td>1–9</td></tr>
    <tr><td>${TI.Novice} Novice</td><td>10–19</td></tr>
    <tr><td>${TI.Cadet} Cadet</td><td>20–49</td></tr>
    <tr><td>${TI.Specialist} Specialist</td><td>50–99</td></tr>
    <tr><td>${TI['Combat Ace']} Combat Ace</td><td>100–249</td></tr>
    <tr><td>${TI['Combat Master']} Combat Master</td><td>250–399</td></tr>
    <tr><td>${TI['Combat Grandmaster']} Combat Grandmaster</td><td>400–549</td></tr>
    <tr><td>${TI['Angelic Master']} Angelic Master</td><td>550–699</td></tr>
    <tr><td>${TI['Heavenly Descendent']} Heavenly Descendent</td><td>700+</td></tr>
    </table>
    <h3 style="font-weight:700;font-size:14px;margin:16px 0 6px">Overall Tab</h3>
    <p style="font-size:13px;color:var(--fg2);margin-bottom:12px">The Overall tab shows each player's total points summed across all ${MODES.length} game modes. It is not a game mode itself — it is auto-calculated.</p>
    <h3 style="font-weight:700;font-size:14px;margin-bottom:6px">Combat Master Requirement</h3>
    <p style="font-size:13px;color:var(--fg2)">A player must have <strong>LT2 or higher</strong> in every single one of the ${MODES.length} game modes to earn Combat Master. If they have 250+ points but haven't met this condition, they remain at Combat Ace with a warning listing the missing modes.</p>
    <h3 style="font-weight:700;font-size:14px;margin:16px 0 6px">Retired Tiers</h3>
    <p style="font-size:13px;color:var(--fg2)">A tier prefixed with <strong>R</strong> (e.g. RHT1) means that tier is <strong>retired</strong> — the player earned it but it's flagged inactive. It still counts the same points and rank position as the base tier, but doesn't count toward the Combat Master LT2 requirement above, and is shown muted/dashed throughout the site.</p>
    <div style="text-align:right;margin-top:18px"><button class="btn-o" onclick="closeMs()">Close</button></div>`;

  // API content
  document.getElementById('apiContent').innerHTML=`
    <h3 style="font-weight:600;font-size:16px;margin-bottom:4px;display:flex;align-items:center;gap:6px">${S.arrowR} GET <code style="color:var(--gld)">/api/players</code></h3>
    <p style="color:var(--fg2);font-size:13px;margin-bottom:6px">Returns all players with tiers, points, and title.</p>
    <div class="cb"><button class="cpb" onclick="cpCode(this)">Copy</button><span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/players'</span>);
<span class="kw">const</span> players = <span class="kw">await</span> res.<span class="fn">json</span>();
<span class="cm">// [{ username, region, tiers, points, title, isPremium }, ...]</span></div>
    <h3 style="font-weight:600;font-size:16px;margin-bottom:4px;display:flex;align-items:center;gap:6px">${S.arrowR} GET <code style="color:var(--gld)">/api/player/:username</code></h3>
    <p style="color:var(--fg2);font-size:13px;margin-bottom:6px">Returns a single player by username.</p>
    <div class="cb"><button class="cpb" onclick="cpCode(this)">Copy</button><span class="kw">const</span> res = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">'/api/player/Dream'</span>);
<span class="kw">const</span> player = <span class="kw">await</span> res.<span class="fn">json</span>();
<span class="cm">// { username: "Dream", region: "NA", tiers: { Sword: "HT1", ... },</span>
<span class="cm">//   points: 330, title: "Combat Master", isPremium: true }</span></div>
    <h3 style="font-weight:600;font-size:16px;margin-top:24px;margin-bottom:8px">Response Shape</h3>
    <div class="cb"><button class="cpb" onclick="cpCode(this)">Copy</button>{
  <span class="str">"username"</span>: <span class="str">"string"</span>,
  <span class="str">"region"</span>: <span class="str">"NA | EU | AS | SA | OC | AF"</span>,
  <span class="str">"isPremium"</span>: <span class="kw">boolean</span>,
  <span class="str">"tiers"</span>: { <span class="str">"Axe"</span>: <span class="str">"HT1"</span>, ... },
  <span class="str">"points"</span>: <span class="kw">number</span>,
  <span class="str">"title"</span>: <span class="str">"string"</span>
}</div>`;

  // Build hamburger + mobile tabs
  const hNav=document.getElementById('hdropNav');
  const bTab=document.getElementById('btabIn');
  hNav.innerHTML=NAV_ITEMS.map(n=>`<span onclick="showPage('${n.id}')" id="hd-${n.id}" ${n.auth?'style="display:none"':''}>${n.svg} ${n.label}</span>`).join('');
  bTab.innerHTML=NAV_ITEMS.map(n=>`<span onclick="showPage('${n.id}')" id="bt-${n.id}" ${n.auth?'style="display:none"':''}>${n.svg}<span style="font-size:10px">${n.label}</span></span>`).join('');

  // Admin section
  buildAdminSec();
}

function cpCode(btn){
  const block=btn.parentElement;
  const text=block.textContent.replace('Copy','').trim();
  navigator.clipboard.writeText(text).then(()=>{btn.classList.add('done');btn.innerHTML=S.check+' Copied';setTimeout(()=>{btn.classList.remove('done');btn.innerHTML='Copy'},2000)});
}

// ===== INIT =====
buildUI();
initStars();
updThemeIcon();
upAuth();
apS();
upHdr();
openDeepLinkedProfile();
window.addEventListener('cloud-ready',()=>{
  // Prefer Firestore data if it contains something — else keep what was loaded from localStorage on init
  const cloudPlayers = window.cloudStore['hp'];
  if(cloudPlayers && Array.isArray(cloudPlayers) && cloudPlayers.length > 0)
    window.players = cloudPlayers;
  // else: window.players already has localStorage data from _lsGet at init — keep it

  const cloudModes = window.cloudStore['hm'];
  if(cloudModes && Array.isArray(cloudModes) && cloudModes.length > 0) MODES = cloudModes;

  const cloudModeIC = window.cloudStore['hmi'];
  if(cloudModeIC && typeof cloudModeIC === 'object') MODE_IC = cloudModeIC;
  if(!MODE_IC.Overall) MODE_IC.Overall = DEFAULT_MODE_IC.Overall;

  // Seed tester IDs only if Firestore truly has none yet
  if(!window.cloudStore['ht']) lss('ht',['1503408628261191755']);

  registerAuthListener(); // safe now — firebase.js's module body has definitely finished executing

  // Run skin type migration on freshly loaded players
  let changed=false;
  window.players.forEach(p=>{
    if(!p.skinType){
      if(p.isPremium)p.skinType='java';
      else if(p.skinUrl)p.skinType='raw';
      else p.skinType='none';
      changed=true;
    }
  });
  if(changed)savePlayers();

  renderRank();
  upAuth();
  apS();
  openDeepLinkedProfile();
});

// Shareable links: /profile/username opens that profile, /rankings/mode opens that
// mode's board — both real paths (not hash), so they work as normal shareable URLs.
function openDeepLinkedProfile(){
  const path=location.pathname;
  let m=path.match(/^\/profile\/([^/]+)\/?$/);
  if(m){
    const un=decodeURIComponent(m[1]);
    if(window.players.find(p=>p.username===un)){
      showPage('rankings',true);
      showPD(un);
    }
    return;
  }
  m=path.match(/^\/rankings\/([^/]+)\/?$/);
  if(m){
    const mode=decodeURIComponent(m[1]);
    const match=['Overall',...MODES].find(x=>x.toLowerCase()===mode.toLowerCase());
    if(match)actMode=match;
    showPage('rankings',true);
    return;
  }
  if(path==='/rankings')showPage('rankings',true);
}

// Back/forward browser buttons — re-parse whatever path we landed on.
window.addEventListener('popstate',()=>{
  if(location.pathname==='/'||location.pathname===''){
    closeMs();
    showPage('home');
    return;
  }
  openDeepLinkedProfile();
});
