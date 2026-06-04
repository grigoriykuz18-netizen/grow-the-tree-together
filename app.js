// ===== DATA: 72 spots (8 gold, 28 white, 36 green) =====
// Ring layout: wider horizontally, more distance between spots, all inside the crown.
const SPOTS_DATA = [];

function addRing(count, radiusX, radiusY, tier, prefix, centerX = 50, centerY = 46, offset = 0) {
  for (let i = 0; i < count; i++) {
    const angle = offset + (Math.PI * 2 * i) / count;
    const x = centerX + Math.cos(angle) * radiusX;
    const y = centerY + Math.sin(angle) * radiusY;

    SPOTS_DATA.push({
      id: `${prefix}${i + 1}`,
      tier,
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1))
    });
  }
}

// Premium center ring
addRing(8, 13, 12, 'gold', 'g', 50, 45, Math.PI / 8);

// Middle crown ring
addRing(28, 29, 25, 'white', 'w', 50, 45, Math.PI / 28);

// Outer crown ring — wide, but still inside the tree silhouette
addRing(36, 40, 33, 'green', 'gr', 50, 45, Math.PI / 36);

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
    el.type = 'button';

    if (spot.claimed) {
      el.innerHTML = `
        <div class="leaf-avatar">
          <div class="avatar">${initials(spot.name || 'A')}</div>
        </div>
      `;
    }

    el.addEventListener('mouseenter', e => showTooltip(e, spot));
    el.addEventListener('mousemove', e => showTooltip(e, spot));
    el.addEventListener('mouseleave', hideTooltip);
    el.addEventListener('click', () => {
      if (spot.claimed) {
        openClaimLink(spot);
      } else {
        selectSpot(spot);
      }
    });

    spotsLayer.appendChild(el);
  });
}

// ===== TOOLTIP =====
function showTooltip(e, spot) {
  const price = PRICES[spot.tier];

  if (spot.claimed) {
    tooltip.innerHTML = `
      <strong>${escapeHtml(spot.name || 'Claimed')}</strong><br>
      ${capitalize(spot.tier)} Spot<br>
      ${spot.url ? `<span>${escapeHtml(spot.url)}</span>` : '<span>No link</span>'}
    `;
  } else {
    tooltip.innerHTML = `
      <strong>${capitalize(spot.tier)} Spot — $${price}</strong><br>
      <span>Click to select this place</span>
    `;
  }

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
  const url = normalizeUrl((formData.get('url') || '').trim());
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

  const goldLeft = document.getElementById('goldLeft');
  const whiteLeft = document.getElementById('whiteLeft');
  const greenLeft = document.getElementById('greenLeft');

  if (goldLeft) goldLeft.textContent = spots.filter(s => s.tier === 'gold' && !s.claimed).length;
  if (whiteLeft) whiteLeft.textContent = spots.filter(s => s.tier === 'white' && !s.claimed).length;
  if (greenLeft) greenLeft.textContent = spots.filter(s => s.tier === 'green' && !s.claimed).length;
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
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';
}

// ===== START =====
init();
