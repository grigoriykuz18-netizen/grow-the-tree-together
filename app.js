const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const DATA_URL = 'data/spots.json';
const STORAGE_KEY = 'gtree_state_v1';
const claimsEl = $('#claimsMarquee');
const spotsLayer = $('#spotsLayer');
const tooltip = $('#tooltip');
const claimedCountEl = $('#claimedCount');
const claimBtn = $('#claimBtn');
const spotIdInput = $('#spotId');
const form = $('#claimForm');

let state = { tiers:{}, prices:{}, spots:[], claims:[] };
let selectedSpot = null;

init();

async function init(){
  // load from localStorage first
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try { state = JSON.parse(cached); } catch {}
  }
  // fetch fresh data (on GitHub Pages это статичный fetch)
  try {
    const res = await fetch(DATA_URL, { cache:'no-store' });
    if (res.ok) {
      const json = await res.json();
      // merge only structure; keep claimed flags if cached
      state.tiers = json.tiers;
      state.prices = json.prices;
      state.spots = json.spots.map(s => {
        const found = (state.spots || []).find(x => x.id === s.id);
        return found ? {...s, claimed: found.claimed, name: found.name, url: found.url, when: found.when} : s;
      });
    }
  } catch(e){ console.warn('Data fetch failed, using cache only'); }

  renderSpots();
  renderCounts();
  renderClaims();
  bindUI();
  persist();
}

function persist(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderSpots(){
  spotsLayer.innerHTML = '';
  state.spots.forEach(s => {
    const el = document.createElement('button');
    el.className = `spot ${s.tier} ${s.claimed ? 'claimed' : 'available'}`;
    el.style.left = s.x + '%';
    el.style.top  = s.y + '%';
    el.style.transformOrigin = 'center';
    el.setAttribute('data-id', s.id);
    el.setAttribute('aria-label', spotLabel(s));
    el.innerHTML = `<span class="core"></span>`;
    el.addEventListener('mouseenter', e => showTip(e.currentTarget, s));
    el.addEventListener('mouseleave', hideTip);
    el.addEventListener('click', () => onPickSpot(s));
    spotsLayer.appendChild(el);
  });
}

function spotLabel(s){
  const price = state.prices[s.tier];
  if (s.claimed) return `Claimed ${s.tier} spot by ${s.name || 'member'}`;
  return `${capitalize(s.tier)} spot — $${price}`;
}

function showTip(target, spot){
  const price = state.prices[spot.tier];
  tooltip.textContent = spot.claimed ? `${capitalize(spot.tier)} — claimed by ${spot.name}` : `${capitalize(spot.tier)} — $${price}`;
  const rect = target.getBoundingClientRect();
  const host = spotsLayer.getBoundingClientRect();
  const x = rect.left - host.left + rect.width/2;
  const y = rect.top - host.top - 8;
  tooltip.style.left = x + 'px';
  tooltip.style.top  = y + 'px';
  tooltip.hidden = false;
}
function hideTip(){ tooltip.hidden = true; }

function onPickSpot(spot){
  if (spot.claimed) return;
  selectedSpot = spot;
  spotIdInput.value = spot.id;
  claimBtn.disabled = false;
  // visual mark
  $$('.spot.selected').forEach(el => el.classList.remove('selected'));
  $(`.spot[data-id="${spot.id}"]`)?.classList.add('selected');
  hideTip();
  // sync radio to tier
  const r = $(`input[name="tier"][value="${spot.tier}"]`);
  if (r) r.checked = true;
}

function renderCounts(){
  const claimed = state.spots.filter(s => s.claimed).length;
  claimedCountEl.textContent = claimed;
}

function renderClaims(){
  const claimed = state.spots.filter(s => s.claimed)
    .sort((a,b)=> (b.when||0)-(a.when||0))
    .slice(0, 6);

  if (!claimed.length){
    claimsEl.textContent = 'No spots claimed yet. Be the first.';
    claimsEl.classList.add('empty');
    return;
  }
  claimsEl.classList.remove('empty');
  claimsEl.innerHTML = '';
  claimed.forEach(s => {
    const pill = document.createElement('a');
    pill.className = 'claim-pill';
    pill.href = s.url || '#';
    pill.target = '_blank';
    pill.rel = 'noopener';
    pill.innerHTML = `
      <span class="dot ${s.tier} leaf"></span>
      <b>${s.name || 'Member'}</b>
      <span class="muted">claimed ${capitalize(s.tier)} Spot</span>
    `;
    claimsEl.appendChild(pill);
  });
}

function bindUI(){
  // block submit if нет выбранного спота
  form.addEventListener('submit', onSubmit);
  // смена типа — подсвечивать доступные точки этого типа
  $$('input[name="tier"]').forEach(r => {
    r.addEventListener('change', () => {
      const tier = r.value;
      // если был выбран другой спот, убираем выделение
      if (selectedSpot && selectedSpot.tier !== tier){
        $(`.spot[data-id="${selectedSpot.id}"]`)?.classList.remove('selected');
        selectedSpot = null; spotIdInput.value = ''; claimBtn.disabled = true;
      }
      highlightTier(tier);
    });
  });
  highlightTier('green');
}

function highlightTier(tier){
  $$('.spot').forEach(el => el.style.filter = '');
  $$('.spot.available').forEach(el => {
    el.style.filter = 'grayscale(1) opacity(.5)';
  });
  $$('.spot.available.'+tier).forEach(el => {
    el.style.filter = 'none';
  });
}

async function onSubmit(e){
  e.preventDefault();
  const fd = new FormData(form);
  const name = (fd.get('name')||'').toString().trim().slice(0,32);
  const url = (fd.get('url')||'').toString().trim();
  const tier = fd.get('tier');
  const id = fd.get('spotId');

  if (!id){ shake(claimBtn); return; }

  const spot = state.spots.find(s => s.id === id);
  if (!spot || spot.claimed || spot.tier !== tier){ shake(claimBtn); return; }

  // Имитация платежа: редирект на PayPal или окно. Здесь — просто confirm.
  const price = state.prices[tier];
  const ok = confirm(`Proceed to pay $${price} for ${tier.toUpperCase()} spot #${id}?`);
  if (!ok) return;

  // «После оплаты» — помечаем как занято.
  spot.claimed = true;
  spot.name = name || 'Member';
  spot.url = sanitizeUrl(url);
  spot.when = Date.now();

  persist();
  renderSpots();
  renderCounts();
  renderClaims();

  // скролл к ленте
  document.querySelector('.latest').scrollIntoView({behavior:'smooth', block:'center'});
}

function sanitizeUrl(u){
  try{
    if (!u) return '';
    const url = new URL(u.startsWith('http')?u:`[${u}](https://${u})`);
    return url.href;
  }catch{ return ''; }
}
function shake(el){
  el.animate([{transform:'translateX(0)'},{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}],{duration:200});
}
function capitalize(s){ return s[0].toUpperCase()+s.slice(1); }
