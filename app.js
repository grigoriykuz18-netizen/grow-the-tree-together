// ===== CLOUDINARY CONFIG =====
const CLOUDINARY_CLOUD_NAME = 'dikcvnots';
const CLOUDINARY_UPLOAD_PRESET = 'grow-tree-avatars';
const SUPABASE_URL = 'https://tiraskewlhpvrhwmvwgg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_i14EF0J8VPaO65vetnFRMw_9Gu6Lc9C';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// ===== DATA: V32 ideal layout — 42 spots =====
const SPOTS_DATA = [
  { id: 'g1', tier: 'gold', x: 44, y: 38 },
  { id: 'g2', tier: 'gold', x: 56, y: 38 },
  { id: 'g3', tier: 'gold', x: 44, y: 49 },
  { id: 'g4', tier: 'gold', x: 56, y: 49 },

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
const TOTALS = { gold: 4, white: 15, green: 21 };
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

async function loadState() {
  spots = SPOTS_DATA.map(s => ({ ...s, claimed: false }));

  const { data, error } = await supabaseClient
    .from('claims')
    .select('*');

  if (error) {
    console.error(error);
    alert('Could not load claims from Supabase.');
    return;
  }

  spots = SPOTS_DATA.map(s => {
    const claim = data.find(c => c.id === s.id);

return claim
  ? {
      ...s,
      claimed: true,
      name: claim.name,
      url: claim.url,
      about: claim.about,
      avatar: claim.avatar_url,
      tier: claim.tier,
      when: claim.created_at
        ? new Date(claim.created_at).getTime()
        : Date.now()
    }
      : { ...s, claimed: false };
  });
}

function saveState() {
  const claims = spots.filter(s => s.claimed).map(s => ({
    id: s.id,
    name: s.name,
    url: s.url,
    avatar: s.avatar,
    tier: s.tier,
    when: s.when
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
}

async function uploadAvatar(file) {
  if (!file || file.size === 0) return '';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'grow-tree-avatars');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error('Avatar upload failed');
  }

  const data = await response.json();
  return data.secure_url || '';
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

    const isTouchDevice =
  window.matchMedia('(hover: none)').matches ||
  window.matchMedia('(pointer: coarse)').matches;

if (!isTouchDevice) {
  el.addEventListener('mouseenter', e => {
    if (!spot.claimed) showTooltip(e, spot);
  });

  el.addEventListener('mousemove', e => {
    if (!spot.claimed) moveTooltip(e);
  });

  el.addEventListener('mouseleave', () => {
    if (!spot.claimed) hideTooltip();
  });
}

el.addEventListener('click', e => {
  e.stopPropagation();

if (spot.claimed) {
  clearSelected();
  showTooltip(e, spot, true);
  return;
}

  selectSpot(spot);
});

    spotsLayer.appendChild(el);
  });
}

function showTooltip(e, spot, pinned = false) {
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
      ${pinned ? `<button class="tooltip-close" type="button">×</button>` : ''}
      <strong>${escapeHtml(spot.name || 'Claimed')}</strong>
      <span>${capitalize(spot.tier)} Spot</span>
      ${spot.about ? `<p class="owner-about">${escapeHtml(spot.about)}</p>` : ''}
      ${spot.url ? `<a class="owner-link" href="${escapeHtml(spot.url)}" target="_blank" rel="noopener">${escapeHtml(shortUrl(spot.url))}</a>` : ''}
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
tooltip.style.left = '0px';
tooltip.style.top = '0px';
tooltip.style.marginLeft = '0';
moveTooltip(e);
  if (pinned) {
    tooltip.classList.add('pinned');

    const closeBtn = tooltip.querySelector('.tooltip-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', event => {
        event.stopPropagation();
        hideTooltip();
      });
    }
  }
}
function moveTooltip(e) {
  const container = spotsLayer.getBoundingClientRect();

  const x = e.clientX - container.left;
  const y = e.clientY - container.top;

  tooltip.style.left = `${x}px`;

  if (y < 150) {
    tooltip.style.top = `${y + 34}px`;
    tooltip.style.transform = 'translate(-50%, 0)';
  } else {
    tooltip.style.top = `${y - 16}px`;
    tooltip.style.transform = 'translate(-50%, -100%)';
  }

  requestAnimationFrame(() => {
    const tooltipRect = tooltip.getBoundingClientRect();
    const containerRect = spotsLayer.getBoundingClientRect();

    let shiftX = 0;

    if (tooltipRect.left < containerRect.left + 8) {
      shiftX = containerRect.left + 8 - tooltipRect.left;
    }

    if (tooltipRect.right > containerRect.right - 8) {
      shiftX = containerRect.right - 8 - tooltipRect.right;
    }

    tooltip.style.marginLeft = `${shiftX}px`;
  });
}

function hideTooltip() {
  tooltip.classList.remove('visible');
  tooltip.classList.remove('pinned');

  tooltip.innerHTML = '';
  tooltip.style.left = '-9999px';
  tooltip.style.top = '-9999px';
  tooltip.style.marginLeft = '0';
}

function selectSpot(spot) {
  if (spot.claimed) return;

  document.querySelectorAll('.spot.selected').forEach(el => el.classList.remove('selected'));

  selectedSpot = spot;
  spotIdInput.value = spot.id;
  submitBtn.disabled = false;

  const el = document.querySelector(`.spot[data-id="${spot.id}"]`);
  if (el) {
  el.classList.add('selected');
  el.setAttribute('data-price', `$${PRICES[spot.tier]}`);
}

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

  document.addEventListener('click', e => {
    if (!tooltip.classList.contains('pinned')) return;

    if (!tooltip.contains(e.target)) {
      hideTooltip();
    }
  });
}

function clearSelected() {
  document.querySelectorAll('.spot.selected').forEach(el => {
  el.classList.remove('selected');
  el.removeAttribute('data-price');
});
  selectedSpot = null;
  spotIdInput.value = '';
  submitBtn.disabled = true;

  const hint = document.querySelector('.hint');
  if (hint) {
    hint.classList.remove('selected');
    hint.innerHTML = '🌿 Choose an available spot on the tree and become part of its history.';
  }
}

async function handleSubmit(e) {
  e.preventDefault();

  if (!selectedSpot) return;

  const formData = new FormData(form);
  const name = (formData.get('name') || '').trim().slice(0, 32);
  const about = (formData.get('about') || '').trim().slice(0, 100);
  const url = normalizeUrl((formData.get('url') || '').trim());
  const tier = formData.get('tier');
  const avatarFile = formData.get('avatar');

  if (selectedSpot.tier !== tier) {
    alert('Selected spot tier does not match. Please select a matching spot.');
    return;
  }

  const price = PRICES[tier];
const confirmed = confirm(
  `Claim ${tier.toUpperCase()} Spot for $${price}?`
);

if (!confirmed) return;

  let avatarUrl = '';

  try {
    if (avatarFile && avatarFile.size > 0) {
      submitBtn.textContent = 'UPLOADING PHOTO...';
      submitBtn.disabled = true;
      avatarUrl = await uploadAvatar(avatarFile);
    }
  } catch (err) {
    console.error(err);
    alert('Could not upload photo. Try another image or claim without photo.');
    submitBtn.textContent = 'CLAIM SELECTED SPOT';
    submitBtn.disabled = false;
    return;
  }

const { error } = await supabaseClient
  .from('claims')
.insert({
  id: selectedSpot.id,
  tier,
  name: name || 'Anonymous',
  url,
  about,
  avatar_url: avatarUrl || null
});

if (error) {
  console.error(error);

  if (error.code === '23505') {
    alert('This spot is already claimed.');
  } else {
    alert('Could not save claim to Supabase.');
  }

  submitBtn.textContent = 'CLAIM SELECTED SPOT';
  submitBtn.disabled = false;
  return;
}

await loadState();
renderSpots();
updateCount();
renderLatest();
showShareMessage(name || 'Anonymous', tier);

  form.reset();
  clearSelected();
  submitBtn.textContent = 'CLAIM SELECTED SPOT';
}

function updateCount() {
  const claimedTotal = spots.filter(s => s.claimed).length;

  const goldClaimed = spots.filter(s => s.tier === 'gold' && s.claimed).length;
  const whiteClaimed = spots.filter(s => s.tier === 'white' && s.claimed).length;
  const greenClaimed = spots.filter(s => s.tier === 'green' && s.claimed).length;

  if (claimedCountEl) {
    claimedCountEl.textContent = claimedTotal;
  }

  updateTierUI('gold', goldClaimed);
  updateTierUI('white', whiteClaimed);
  updateTierUI('green', greenClaimed);
}

function updateTierUI(tier, claimed) {
  const total = TOTALS[tier];
  const left = total - claimed;

  const option = document.querySelector(`.tier-option.${tier}`);
  const input = document.querySelector(`input[name="tier"][value="${tier}"]`);
  const priceEl = option?.querySelector('.tier-price');

  if (!option || !input || !priceEl) return;

  if (claimed >= total) {
    priceEl.textContent = 'SOLD OUT';
    input.disabled = true;
    option.classList.add('sold-out');
  } else {
    priceEl.textContent = `${left} left · $${PRICES[tier]}`;
    input.disabled = false;
    option.classList.remove('sold-out');
  }
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
    ${
      s.avatar
        ? `<img src="${s.avatar}" class="member-avatar" alt="">`
        : `<span class="member-placeholder">👤</span>`
    }
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

  const clean = url.trim();

  if (clean.startsWith('@')) {
    return `https://t.me/${clean.slice(1)}`;
  }

  if (/^(t\.me|telegram\.me|instagram\.com|x\.com|twitter\.com|linkedin\.com|youtube\.com)\//i.test(clean)) {
    return `https://${clean}`;
  }

  if (!/^https?:\/\//i.test(clean)) {
    return `https://${clean}`;
  }

  return clean;
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

async function init() {
  await loadState();
  renderSpots();
  updateCount();
  renderLatest();
  bindEvents();
}

function shortUrl(url) {
  const clean = String(url || '')
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '');

  const parts = clean.split('/').filter(Boolean);
  const host = parts[0] || 'Open link';
  const username = parts[1];

  if (host.includes('instagram.com') && username) {
    return `instagram.com/${username}`;
  }

  if (host.includes('t.me') && username) {
    return `t.me/${username}`;
  }

  return host;
}
function showShareMessage(name, tier) {
  const text = `🌿 ${name} just claimed a ${capitalize(tier)} Spot on Grow The Tree Together.`;
  const url = 'https://growthetreetogether.com';

  const shareText = `${text}\n${url}`;

  if (navigator.share) {
    navigator.share({
      title: 'Grow The Tree Together',
      text,
      url
    }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(shareText);
    alert('🌿 Your spot has been claimed! Share text copied.');
  }
}

init();
