// ===== DATA: zone layout spots (8 gold, 28 white, 36 green) =====
// Zone structure:
// center two columns = gold
// inner side columns = white
// outer side columns = green
// no bottom spots under the trunk
const SPOTS_DATA = [
  // GOLD — two central vertical zones
  { id: 'g1', tier: 'gold', x: 46, y: 24 },
  { id: 'g2', tier: 'gold', x: 54, y: 24 },
  { id: 'g3', tier: 'gold', x: 46, y: 34 },
  { id: 'g4', tier: 'gold', x: 54, y: 34 },
  { id: 'g5', tier: 'gold', x: 46, y: 44 },
  { id: 'g6', tier: 'gold', x: 54, y: 44 },
  { id: 'g7', tier: 'gold', x: 46, y: 54 },
  { id: 'g8', tier: 'gold', x: 54, y: 54 },

  // WHITE — left inner zone
  { id: 'w1', tier: 'white', x: 34, y: 18 },
  { id: 'w2', tier: 'white', x: 39, y: 23 },
  { id: 'w3', tier: 'white', x: 31, y: 28 },
  { id: 'w4', tier: 'white', x: 37, y: 33 },
  { id: 'w5', tier: 'white', x: 32, y: 39 },
  { id: 'w6', tier: 'white', x: 39, y: 44 },
  { id: 'w7', tier: 'white', x: 31, y: 50 },
  { id: 'w8', tier: 'white', x: 37, y: 56 },
  { id: 'w9', tier: 'white', x: 33, y: 63 },
  { id: 'w10', tier: 'white', x: 40, y: 65 },
  { id: 'w11', tier: 'white', x: 28, y: 35 },
  { id: 'w12', tier: 'white', x: 27, y: 47 },
  { id: 'w13', tier: 'white', x: 29, y: 59 },
  { id: 'w14', tier: 'white', x: 36, y: 70 },

  // WHITE — right inner zone
  { id: 'w15', tier: 'white', x: 66, y: 18 },
  { id: 'w16', tier: 'white', x: 61, y: 23 },
  { id: 'w17', tier: 'white', x: 69, y: 28 },
  { id: 'w18', tier: 'white', x: 63, y: 33 },
  { id: 'w19', tier: 'white', x: 68, y: 39 },
  { id: 'w20', tier: 'white', x: 61, y: 44 },
  { id: 'w21', tier: 'white', x: 69, y: 50 },
  { id: 'w22', tier: 'white', x: 63, y: 56 },
  { id: 'w23', tier: 'white', x: 67, y: 63 },
  { id: 'w24', tier: 'white', x: 60, y: 65 },
  { id: 'w25', tier: 'white', x: 72, y: 35 },
  { id: 'w26', tier: 'white', x: 73, y: 47 },
  { id: 'w27', tier: 'white', x: 71, y: 59 },
  { id: 'w28', tier: 'white', x: 64, y: 70 },

  // GREEN — far left outer zone
  { id: 'gr1', tier: 'green', x: 18, y: 30 },
  { id: 'gr2', tier: 'green', x: 23, y: 25 },
  { id: 'gr3', tier: 'green', x: 16, y: 38 },
  { id: 'gr4', tier: 'green', x: 23, y: 43 },
  { id: 'gr5', tier: 'green', x: 17, y: 52 },
  { id: 'gr6', tier: 'green', x: 24, y: 57 },
  { id: 'gr7', tier: 'green', x: 19, y: 66 },
  { id: 'gr8', tier: 'green', x: 27, y: 69 },
  { id: 'gr9', tier: 'green', x: 24, y: 34 },
  { id: 'gr10', tier: 'green', x: 21, y: 48 },
  { id: 'gr11', tier: 'green', x: 30, y: 23 },
  { id: 'gr12', tier: 'green', x: 29, y: 72 },

  // GREEN — left bridge / upper crown
  { id: 'gr13', tier: 'green', x: 37, y: 12 },
  { id: 'gr14', tier: 'green', x: 45, y: 10 },
  { id: 'gr15', tier: 'green', x: 42, y: 17 },
  { id: 'gr16', tier: 'green', x: 35, y: 75 },
  { id: 'gr17', tier: 'green', x: 43, y: 73 },
  { id: 'gr18', tier: 'green', x: 40, y: 82 },

  // GREEN — far right outer zone
  { id: 'gr19', tier: 'green', x: 82, y: 30 },
  { id: 'gr20', tier: 'green', x: 77, y: 25 },
  { id: 'gr21', tier: 'green', x: 84, y: 38 },
  { id: 'gr22', tier: 'green', x: 77, y: 43 },
  { id: 'gr23', tier: 'green', x: 83, y: 52 },
  { id: 'gr24', tier: 'green', x: 76, y: 57 },
  { id: 'gr25', tier: 'green', x: 81, y: 66 },
  { id: 'gr26', tier: 'green', x: 73, y: 69 },
  { id: 'gr27', tier: 'green', x: 76, y: 34 },
  { id: 'gr28', tier: 'green', x: 79, y: 48 },
  { id: 'gr29', tier: 'green', x: 70, y: 23 },
  { id: 'gr30', tier: 'green', x: 71, y: 72 },

  // GREEN — right bridge / upper crown
  { id: 'gr31', tier: 'green', x: 63, y: 12 },
  { id: 'gr32', tier: 'green', x: 55, y: 10 },
  { id: 'gr33', tier: 'green', x: 58, y: 17 },
  { id: 'gr34', tier: 'green', x: 65, y: 75 },
  { id: 'gr35', tier: 'green', x: 57, y: 73 },
  { id: 'gr36', tier: 'green', x: 60, y: 82 }
];

const PRICES = { gold: 250, white: 100, green: 50 };
const STORAGE_KEY = 'gtree_claims_v29';

let spots = [];
let selectedSpot = null;

const spotsLayer = document.getElementById('spotsLayer');
const tooltip = document.getElementById('tooltip');
const claimedCountEl = document.getElementById('claimedCount');
const form = document.getElementById('claimForm');
const submitBtn = document.getElementById('submitBtn');
const spotIdInput = document.getElementById('spotIdInput');
const latestBar = document.getElementById('latestBar');

const goldLeftEl = document.getElementById('goldLeft');
const whiteLeftEl = document.getElementById('whiteLeft');
const greenLeftEl = document.getElementById('greenLeft');

function init() {
  loadState();
  renderSpots();
  updateCount();
  renderLatest();
  bindEvents();
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const claims = JSON.parse(saved);
      spots = SPOTS_DATA.map(s => {
        const claim = claims.find(c => c.id === s.id);
        return claim ? { ...s, ...claim, claimed: true } : { ...s, claimed: false };
      });
    } catch {
      spots = SPOTS_DATA.map(s => ({ ...s, claimed: false }));
    }
  } else {
    spots = SPOTS_DATA.map(s => ({ ...s, claimed: false }));
  }
}

function saveState() {
  const claims = spots.filter(s => s.claimed).map(s => ({
    id: s.id,
    name: s.name,
    url: s.url,
    tier: s.tier,
    when: s.when
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
}

function renderSpots() {
  spotsLayer.innerHTML = '';

  spots.forEach(spot => {
    const el = document.createElement('button');
    el.className = `spot ${spot.tier}${spot.claimed ? ' claimed' : ''}`;
    el.style.left = `${spot.x}%`;
    el.style.top = `${spot.y}%`;
    el.style.transform = 'translate(-50%, -50%)';
    el.dataset.id = spot.id;
    el.type = 'button';

    if (spot.claimed) {
      el.innerHTML = `<div class="leaf-avatar"><div class="avatar">${initials(spot.name || 'A')}</div></div>`;
    }

    el.addEventListener('mouseenter', e => showTooltip(e, spot));
    el.addEventListener('mousemove', e => moveTooltip(e));
    el.addEventListener('mouseleave', hideTooltip);
    el.addEventListener('click', () => spot.claimed ? openClaimLink(spot) : selectSpot(spot));

    spotsLayer.appendChild(el);
  });
}

function showTooltip(e, spot) {
  const price = PRICES[spot.tier];

  tooltip.innerHTML = spot.claimed
    ? `<div class="owner-card"><strong>${escapeHtml(spot.name || 'Claimed')}</strong><span>${capitalize(spot.tier)} Spot</span>${spot.url ? `<small>${escapeHtml(spot.url)}</small>` : ''}</div>`
    : `<div class="owner-card"><strong>${capitalize(spot.tier)} Spot — $${price}</strong><span>Click to claim this place</span></div>`;

  tooltip.classList.add('visible');
  moveTooltip(e);
}

function moveTooltip(e) {
  const container = spotsLayer.getBoundingClientRect();
  const x = e.clientX - container.left;
  const y = e.clientY - container.top - 12;

  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
  tooltip.style.transform = 'translate(-50%, -100%)';
}

function hideTooltip() {
  tooltip.classList.remove('visible');
}

function selectSpot(spot) {
  if (spot.claimed) return;

  document.querySelectorAll('.spot.selected').forEach(el => el.classList.remove('selected'));

  selectedSpot = spot;
  spotIdInput.value = spot.id;
  submitBtn.disabled = false;

  const el = document.querySelector(`.spot[data-id="${spot.id}"]`);
  if (el) el.classList.add('selected');

  const radio = document.querySelector(`input[name="tier"][value="${spot.tier}"]`);
  if (radio) radio.checked = true;

  const hint = document.querySelector('.hint');
  if (hint) {
    hint.classList.add('selected');
    hint.innerHTML = `Selected: <strong>${capitalize(spot.tier)} Spot</strong> — $${PRICES[spot.tier]}`;
  }

  hideTooltip();
}

function bindEvents() {
  form.addEventListener('submit', handleSubmit);

  document.querySelectorAll('input[name="tier"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (selectedSpot && selectedSpot.tier !== radio.value) {
        clearSelected();
      }
    });
  });
}

function clearSelected() {
  document.querySelectorAll('.spot.selected').forEach(el => el.classList.remove('selected'));
  selectedSpot = null;
  spotIdInput.value = '';
  submitBtn.disabled = true;

  const hint = document.querySelector('.hint');
  if (hint) {
    hint.classList.remove('selected');
    hint.innerHTML = '🌿 <strong>Select a glowing dot</strong> on the tree to see price and claim that spot.';
  }
}

function handleSubmit(e) {
  e.preventDefault();

  if (!selectedSpot) return;

  const formData = new FormData(form);
  const name = (formData.get('name') || '').trim().slice(0, 32);
  const url = normalizeUrl((formData.get('url') || '').trim());
  const tier = formData.get('tier');

  if (selectedSpot.tier !== tier) {
    alert('Selected spot tier does not match. Please select a matching spot.');
    return;
  }

  const price = PRICES[tier];
  const confirmed = confirm(`Pay $${price} for ${tier.toUpperCase()} spot?\n\n(This is a demo — click OK to simulate payment)`);
  if (!confirmed) return;

  const spot = spots.find(s => s.id === selectedSpot.id);
  if (spot) {
    spot.claimed = true;
    spot.name = name || 'Anonymous';
    spot.url = url;
    spot.when = Date.now();
  }

  saveState();
  renderSpots();
  updateCount();
  renderLatest();

  form.reset();
  clearSelected();
}

function updateCount() {
  const count = spots.filter(s => s.claimed).length;
  claimedCountEl.textContent = count;

  if (goldLeftEl) goldLeftEl.textContent = spots.filter(s => s.tier === 'gold' && !s.claimed).length;
  if (whiteLeftEl) whiteLeftEl.textContent = spots.filter(s => s.tier === 'white' && !s.claimed).length;
  if (greenLeftEl) greenLeftEl.textContent = spots.filter(s => s.tier === 'green' && !s.claimed).length;
}

function renderLatest() {
  const claimed = spots
    .filter(s => s.claimed)
    .sort((a, b) => (b.when || 0) - (a.when || 0))
    .slice(0, 8);

  if (claimed.length === 0) {
    latestBar.innerHTML = '<p class="empty-msg">No spots claimed yet. Be the first.</p>';
    return;
  }

  latestBar.innerHTML = claimed.map(s => `
    <a class="claim-pill" href="${s.url || '#'}" ${s.url ? 'target="_blank" rel="noopener"' : ''}>
      <span class="pill-dot ${s.tier}"></span>
      <strong>${escapeHtml(s.name)}</strong>
      <span class="pill-tier">claimed ${capitalize(s.tier)} Spot</span>
    </a>
  `).join('');
}

function openClaimLink(spot) {
  if (!spot.url) return;
  window.open(spot.url, '_blank', 'noopener');
}

function normalizeUrl(url) {
  if (!url) return '';
  if (url.startsWith('@')) return `https://t.me/${url.slice(1)}`;
  if (!/^https?:\/\//i.test(url)) return `https://${url}`;
  return url;
}

function initials(name) {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

init();
