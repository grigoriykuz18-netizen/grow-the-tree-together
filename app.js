// ===== DATA: 72 spots (8 gold, 28 white, 36 green) =====
const SPOTS_DATA = [
  // GOLD (8) — center/premium positions
  { id: 'g1', tier: 'gold', x: 50, y: 18 },
  { id: 'g2', tier: 'gold', x: 42, y: 24 },
  { id: 'g3', tier: 'gold', x: 58, y: 24 },
  { id: 'g4', tier: 'gold', x: 46, y: 30 },
  { id: 'g5', tier: 'gold', x: 54, y: 30 },
  { id: 'g6', tier: 'gold', x: 50, y: 36 },
  { id: 'g7', tier: 'gold', x: 44, y: 38 },
  { id: 'g8', tier: 'gold', x: 56, y: 38 },

  // WHITE (28) — middle layer
  { id: 'w1', tier: 'white', x: 35, y: 20 },
  { id: 'w2', tier: 'white', x: 65, y: 20 },
  { id: 'w3', tier: 'white', x: 30, y: 28 },
  { id: 'w4', tier: 'white', x: 70, y: 28 },
  { id: 'w5', tier: 'white', x: 36, y: 34 },
  { id: 'w6', tier: 'white', x: 64, y: 34 },
  { id: 'w7', tier: 'white', x: 40, y: 44 },
  { id: 'w8', tier: 'white', x: 60, y: 44 },
  { id: 'w9', tier: 'white', x: 32, y: 42 },
  { id: 'w10', tier: 'white', x: 68, y: 42 },
  { id: 'w11', tier: 'white', x: 28, y: 36 },
  { id: 'w12', tier: 'white', x: 72, y: 36 },
  { id: 'w13', tier: 'white', x: 38, y: 26 },
  { id: 'w14', tier: 'white', x: 62, y: 26 },
  { id: 'w15', tier: 'white', x: 45, y: 48 },
  { id: 'w16', tier: 'white', x: 55, y: 48 },
  { id: 'w17', tier: 'white', x: 34, y: 50 },
  { id: 'w18', tier: 'white', x: 66, y: 50 },
  { id: 'w19', tier: 'white', x: 50, y: 54 },
  { id: 'w20', tier: 'white', x: 42, y: 56 },
  { id: 'w21', tier: 'white', x: 58, y: 56 },
  { id: 'w22', tier: 'white', x: 26, y: 46 },
  { id: 'w23', tier: 'white', x: 74, y: 46 },
  { id: 'w24', tier: 'white', x: 30, y: 54 },
  { id: 'w25', tier: 'white', x: 70, y: 54 },
  { id: 'w26', tier: 'white', x: 38, y: 60 },
  { id: 'w27', tier: 'white', x: 62, y: 60 },
  { id: 'w28', tier: 'white', x: 50, y: 62 },

  // GREEN (36) — outer layer
  { id: 'gr1', tier: 'green', x: 22, y: 30 },
  { id: 'gr2', tier: 'green', x: 78, y: 30 },
  { id: 'gr3', tier: 'green', x: 18, y: 38 },
  { id: 'gr4', tier: 'green', x: 82, y: 38 },
  { id: 'gr5', tier: 'green', x: 20, y: 46 },
  { id: 'gr6', tier: 'green', x: 80, y: 46 },
  { id: 'gr7', tier: 'green', x: 16, y: 54 },
  { id: 'gr8', tier: 'green', x: 84, y: 54 },
  { id: 'gr9', tier: 'green', x: 22, y: 60 },
  { id: 'gr10', tier: 'green', x: 78, y: 60 },
  { id: 'gr11', tier: 'green', x: 26, y: 66 },
  { id: 'gr12', tier: 'green', x: 74, y: 66 },
  { id: 'gr13', tier: 'green', x: 32, y: 68 },
  { id: 'gr14', tier: 'green', x: 68, y: 68 },
  { id: 'gr15', tier: 'green', x: 40, y: 70 },
  { id: 'gr16', tier: 'green', x: 60, y: 70 },
  { id: 'gr17', tier: 'green', x: 50, y: 72 },
  { id: 'gr18', tier: 'green', x: 46, y: 68 },
  { id: 'gr19', tier: 'green', x: 54, y: 68 },
  { id: 'gr20', tier: 'green', x: 24, y: 22 },
  { id: 'gr21', tier: 'green', x: 76, y: 22 },
  { id: 'gr22', tier: 'green', x: 28, y: 16 },
  { id: 'gr23', tier: 'green', x: 72, y: 16 },
  { id: 'gr24', tier: 'green', x: 36, y: 14 },
  { id: 'gr25', tier: 'green', x: 64, y: 14 },
  { id: 'gr26', tier: 'green', x: 44, y: 12 },
  { id: 'gr27', tier: 'green', x: 56, y: 12 },
  { id: 'gr28', tier: 'green', x: 50, y: 10 },
  { id: 'gr29', tier: 'green', x: 14, y: 44 },
  { id: 'gr30', tier: 'green', x: 86, y: 44 },
  { id: 'gr31', tier: 'green', x: 12, y: 52 },
  { id: 'gr32', tier: 'green', x: 88, y: 52 },
  { id: 'gr33', tier: 'green', x: 18, y: 64 },
  { id: 'gr34', tier: 'green', x: 82, y: 64 },
  { id: 'gr35', tier: 'green', x: 34, y: 74 },
  { id: 'gr36', tier: 'green', x: 66, y: 74 }
];

const PRICES = { gold: 250, white: 100, green: 50 };
const STORAGE_KEY = 'gtree_claims_v1';

// ===== STATE =====
let spots = [];
let selectedSpot = null;

// ===== DOM =====
const spotsLayer = document.getElementById('spotsLayer');
const tooltip = document.getElementById('tooltip');
const claimedCountEl = document.getElementById('claimedCount');
const form = document.getElementById('claimForm');
const submitBtn = document.getElementById('submitBtn');
const spotIdInput = document.getElementById('spotIdInput');
const latestBar = document.getElementById('latestBar');

// ===== INIT =====
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

// ===== RENDER SPOTS =====
function renderSpots() {
  spotsLayer.innerHTML = '';
  spots.forEach(spot => {
    const el = document.createElement('button');
    el.className = `spot ${spot.tier}${spot.claimed ? ' claimed' : ''}`;
    el.style.left = `${spot.x}%`;
    el.style.top = `${spot.y}%`;
    el.style.transform = 'translate(-50%, -50%)';
    el.dataset.id = spot.id;

    el.addEventListener('mouseenter', e => showTooltip(e, spot));
    el.addEventListener('mouseleave', hideTooltip);
    el.addEventListener('click', () => selectSpot(spot));

    spotsLayer.appendChild(el);
  });
}

// ===== TOOLTIP =====
function showTooltip(e, spot) {
  const price = PRICES[spot.tier];
  const text = spot.claimed
    ? `${capitalize(spot.tier)} — ${spot.name || 'Claimed'}`
    : `${capitalize(spot.tier)} Spot — $${price}`;

  tooltip.textContent = text;
  tooltip.classList.add('visible');

  const rect = e.target.getBoundingClientRect();
  const container = spotsLayer.getBoundingClientRect();
  const x = rect.left - container.left + rect.width / 2;
  const y = rect.top - container.top - 10;

  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
  tooltip.style.transform = 'translate(-50%, -100%)';
}

function hideTooltip() {
  tooltip.classList.remove('visible');
}

// ===== SELECT SPOT =====
function selectSpot(spot) {
  if (spot.claimed) return;

  // Deselect previous
  document.querySelectorAll('.spot.selected').forEach(el => el.classList.remove('selected'));

  // Select new
  selectedSpot = spot;
  spotIdInput.value = spot.id;
  submitBtn.disabled = false;

  const el = document.querySelector(`.spot[data-id="${spot.id}"]`);
  if (el) el.classList.add('selected');

  // Sync tier radio
  const radio = document.querySelector(`input[name="tier"][value="${spot.tier}"]`);
  if (radio) radio.checked = true;

  hideTooltip();
}

// ===== BIND EVENTS =====
function bindEvents() {
  form.addEventListener('submit', handleSubmit);

  // Tier radio changes
  document.querySelectorAll('input[name="tier"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (selectedSpot && selectedSpot.tier !== radio.value) {
        document.querySelectorAll('.spot.selected').forEach(el => el.classList.remove('selected'));
        selectedSpot = null;
        spotIdInput.value = '';
        submitBtn.disabled = true;
      }
    });
  });
}

function handleSubmit(e) {
  e.preventDefault();

  if (!selectedSpot) return;

  const formData = new FormData(form);
  const name = (formData.get('name') || '').trim().slice(0, 32);
  const url = (formData.get('url') || '').trim();
  const tier = formData.get('tier');

  if (selectedSpot.tier !== tier) {
    alert('Selected spot tier does not match. Please select a matching spot.');
    return;
  }

  const price = PRICES[tier];
  const confirmed = confirm(`Pay $${price} for ${tier.toUpperCase()} spot?\n\n(This is a demo — click OK to simulate payment)`);

  if (!confirmed) return;

  // Mark as claimed
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

  // Reset
  selectedSpot = null;
  spotIdInput.value = '';
  submitBtn.disabled = true;
  form.reset();

  // Scroll to latest
  document.querySelector('.latest-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===== UPDATE COUNT =====
function updateCount() {
  const count = spots.filter(s => s.claimed).length;
  claimedCountEl.textContent = count;
}

// ===== RENDER LATEST =====
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
    <a class="claim-pill" href="${s.url || '#'}" target="_blank" rel="noopener">
      <span class="pill-dot ${s.tier}"></span>
      <strong>${escapeHtml(s.name)}</strong>
      <span class="pill-tier">claimed ${capitalize(s.tier)} Spot</span>
    </a>
  `).join('');
}

// ===== HELPERS =====
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== START =====
init();
