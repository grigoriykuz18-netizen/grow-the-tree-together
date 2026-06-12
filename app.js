// ===== DATA: V32 ideal layout — 42 spots =====
// 4 Gold center, 17 White middle, 21 Green perimeter.
// Fix: fewer white spots, more green spots, better spacing, closer to the approved reference.
const SPOTS_DATA = [
  // GOLD — 4 center
  { id: 'g1', tier: 'gold', x: 44, y: 38 },
  { id: 'g2', tier: 'gold', x: 56, y: 38 },
  { id: 'g3', tier: 'gold', x: 44, y: 49 },
  { id: 'g4', tier: 'gold', x: 56, y: 49 },

  // WHITE — 17 middle ring
  { id: 'w1', tier: 'white', x: 39, y: 19 },
  { id: 'w2', tier: 'white', x: 50, y: 17 },
  { id: 'w3', tier: 'white', x: 61, y: 19 },

  { id: 'w4', tier: 'white', x: 31, y: 29 },
  { id: 'w5', tier: 'white', x: 44, y: 28 },
  { id: 'w6', tier: 'white', x: 56, y: 28 },
  { id: 'w7', tier: 'white', x: 69, y: 29 },

  { id: 'w8', tier: 'white', x: 28, y: 41 },
  { id: 'w9', tier: 'white', x: 38, y: 40 },
  { id: 'w10', tier: 'white', x: 62, y: 40 },
  { id: 'w11', tier: 'white', x: 72, y: 41 },

  { id: 'w12', tier: 'white', x: 31, y: 53 },
  { id: 'w15', tier: 'white', x: 69, y: 53 },

  { id: 'w16', tier: 'white', x: 41, y: 67 },
  { id: 'w17', tier: 'white', x: 59, y: 67 },

  // GREEN — 21 perimeter
  { id: 'gr1', tier: 'green', x: 31, y: 9 },
  { id: 'gr2', tier: 'green', x: 41, y: 6 },
  { id: 'gr3', tier: 'green', x: 91, y: 55 },
  { id: 'gr4', tier: 'green', x: 59, y: 6 },
  { id: 'gr5', tier: 'green', x: 69, y: 9 },

  { id: 'gr6', tier: 'green', x: 24, y: 18 },
  { id: 'gr7', tier: 'green', x: 76, y: 18 },

  { id: 'gr8', tier: 'green', x: 18, y: 30 },
  { id: 'gr9', tier: 'green', x: 82, y: 30 },

  { id: 'gr10', tier: 'green', x: 15, y: 43 },
  { id: 'gr11', tier: 'green', x: 85, y: 43 },

  { id: 'gr12', tier: 'green', x: 18, y: 56 },
  { id: 'gr13', tier: 'green', x: 82, y: 56 },

  { id: 'gr14', tier: 'green', x: 25, y: 68 },
  { id: 'gr15', tier: 'green', x: 75, y: 68 },

  { id: 'gr16', tier: 'green', x: 35, y: 78 },
  { id: 'gr17', tier: 'green', x: 8, y: 73 },
  { id: 'gr18', tier: 'green', x: 65, y: 78 },

  { id: 'gr19', tier: 'green', x: 8, y: 55 },
  { id: 'gr20', tier: 'green', x: 91, y: 73 },
  { id: 'gr21', tier: 'green', x: 50, y: 4 }
];

const PRICES = { gold: 250, white: 100, green: 50 };
const STORAGE_KEY = 'gtree_claims_v32';

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
  el.innerHTML = `
    <div class="claimed-avatar ${spot.tier}">
      ${
        spot.avatar
          ? `<img src="${spot.avatar}" class="avatar-img" alt="">`
          : `<div class="avatar-placeholder">👤</div>`
      }
    </div>
  `;
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

  const borderColor =
    spot.tier === 'gold'
      ? '#ffd54a'
      : spot.tier === 'white'
        ? '#ffffff'
        : '#57ff7f';

  const glowColor =
    spot.tier === 'gold'
      ? 'rgba(255,213,74,.55)'
      : spot.tier === 'white'
        ? 'rgba(255,255,255,.45)'
        : 'rgba(87,255,127,.45)';

  tooltip.innerHTML = spot.claimed
    ? `
      <div
        class="owner-card"
        style="
          border:1px solid ${borderColor};
          box-shadow:
            0 0 18px ${glowColor},
            0 18px 46px rgba(0,0,0,.45);
        "
      >
        <strong>${escapeHtml(spot.name || 'Claimed')}</strong>
        <span>${capitalize(spot.tier)} Spot</span>
        ${spot.url ? `<small>${escapeHtml(spot.url)}</small>` : ''}
      </div>
    `
    : `
      <div
        class="owner-card"
        style="
          border:1px solid ${borderColor};
          box-shadow:
            0 0 18px ${glowColor},
            0 18px 46px rgba(0,0,0,.45);
        "
      >
        <strong>${capitalize(spot.tier)} Spot — $${price}</strong>
        <span>Click to claim this place</span>
      </div>
    `;

  tooltip.classList.add('visible');
  moveTooltip(e);
}

function moveTooltip(e) {
  const container = spotsLayer.getBoundingClientRect();
  const x = e.clientX - container.left;
  const y = e.clientY - container.top;

  tooltip.style.left = `${x}px`;

  if (y < 120) {
    tooltip.style.top = `${y + 26}px`;
    tooltip.style.transform = 'translate(-50%, 0)';
  } else {
    tooltip.style.top = `${y - 12}px`;
    tooltip.style.transform = 'translate(-50%, -100%)';
  }
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
  if (claimedCountEl) claimedCountEl.textContent = count;

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
