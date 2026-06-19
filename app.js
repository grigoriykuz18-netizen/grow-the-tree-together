// ===== CLOUDINARY CONFIG =====
const CLOUDINARY_CLOUD_NAME = 'dikcvnots';
const CLOUDINARY_UPLOAD_PRESET = 'grow-tree-avatars';
const SUPABASE_URL = 'https://tiraskewlhpvrhwmvwgg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_i14EF0J8VPaO65vetnFRMw_9Gu6Lc9C';
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const viewAllMembersBtn = document.getElementById('viewAllMembersBtn');
const membersModal = document.getElementById('membersModal');
const membersModalClose = document.getElementById('membersModalClose');
const membersGrid = document.getElementById('membersGrid');
const latestMemberCard = document.getElementById('latestMemberCard');
const raisedAmount = document.getElementById('raisedAmount');
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const shareModal = document.getElementById('shareModal');
const shareClose = document.getElementById('shareClose');
const shareTitle = document.getElementById('shareTitle');
const shareTextEl = document.getElementById('shareText');
const downloadStoryBtn = document.getElementById('downloadStoryBtn');
const shareXBtn = document.getElementById('shareXBtn');
const copyPostBtn = document.getElementById('copyPostBtn');
const copyLinkBtn = document.getElementById('copyLinkBtn');

let lastShareData = null;
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
  if (!spotsLayer) {
    console.error('spotsLayer not found');
    return;
  }

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
              ? `<img src="${spot.avatar}" class="avatar-img" alt="" loading="eager" decoding="sync">`
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

if (viewAllMembersBtn) {
  viewAllMembersBtn.addEventListener('click', () => {
    renderMembersGrid();
    membersModal.classList.add('visible');
  });
}
  
if (membersModalClose) {
  membersModalClose.addEventListener('click', () => {
    membersModal.classList.remove('visible');
  });
}

if (membersModal) {
  membersModal.addEventListener('click', e => {
    if (e.target === membersModal) {
      membersModal.classList.remove('visible');
    }
  });
}
  if (shareClose) {
  shareClose.addEventListener('click', () => {
    shareModal.classList.remove('visible');
  });
}

if (shareModal) {
  shareModal.addEventListener('click', e => {
    if (e.target === shareModal) {
      shareModal.classList.remove('visible');
    }
  });
}

if (shareXBtn) {
  shareXBtn.addEventListener('click', () => {
    if (!lastShareData) return;

    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(lastShareData.text)}`,
      '_blank',
      'noopener'
    );
  });
}

if (copyPostBtn) {
  copyPostBtn.addEventListener('click', async () => {
    if (!lastShareData) return;

    await navigator.clipboard.writeText(lastShareData.text);
    alert('Post text copied.');
  });
}

if (copyLinkBtn) {
  copyLinkBtn.addEventListener('click', async () => {
    if (!lastShareData) return;

    await navigator.clipboard.writeText(lastShareData.url);
    alert('Link copied.');
  });
}

if (downloadStoryBtn) {
  downloadStoryBtn.addEventListener('click', () => {
    if (!lastShareData) return;

    downloadStoryImage(lastShareData);
  });
}
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
showShareMessage(name || 'Anonymous', tier, about, selectedSpot.id);

  form.reset();
  clearSelected();
  submitBtn.textContent = 'CLAIM SELECTED SPOT';
}

function updateCount() {
  const claimedTotal = spots.filter(s => s.claimed).length;

  const goldClaimed = spots.filter(s => s.tier === 'gold' && s.claimed).length;
  const whiteClaimed = spots.filter(s => s.tier === 'white' && s.claimed).length;
  const greenClaimed = spots.filter(s => s.tier === 'green' && s.claimed).length;

  const raised =
    goldClaimed * PRICES.gold +
    whiteClaimed * PRICES.white +
    greenClaimed * PRICES.green;

  if (raisedAmount) {
    raisedAmount.textContent = `$${raised}`;
  }

  if (claimedCountEl) {
    claimedCountEl.textContent = claimedTotal;
  }

  const percent = Math.round((claimedTotal / SPOTS_DATA.length) * 100);

  if (progressFill) {
    progressFill.style.width = `${percent}%`;
  }

  if (progressText) {
    progressText.textContent = `${percent}% of the tree is growing`;
  }

  updateTierUI('gold', goldClaimed);
  updateTierUI('white', whiteClaimed);
  updateTierUI('green', greenClaimed);
}

function updateTierUI(tier, claimed) {
  const total = TOTALS[tier];
  const left = Math.max(total - claimed, 0);

  const option = document.querySelector(`.tier-option.${tier}`);
  const input = document.querySelector(`input[name="tier"][value="${tier}"]`);
  const priceEl = option?.querySelector('.tier-price');

  if (!option || !input || !priceEl) return;

  if (left <= 0) {
    priceEl.textContent = `0 left · SOLD OUT`;
    input.disabled = true;
    option.classList.add('sold-out');
    return;
  }

  priceEl.textContent = `${left} left · $${PRICES[tier]}`;
  input.disabled = false;
  option.classList.remove('sold-out');
}

function renderLatest() {
  const latest = spots
    .filter(s => s.claimed)
    .sort((a, b) => (b.when || 0) - (a.when || 0))[0];

  if (latestMemberCard) {
    if (latest) {
      latestMemberCard.innerHTML = `
        <span class="latest-dot ${latest.tier}"></span>
        <div>
          <strong>Latest member</strong>
          <p>${escapeHtml(latest.name || 'Anonymous')} claimed ${capitalize(latest.tier)} Spot</p>
        </div>
      `;
    } else {
      latestMemberCard.innerHTML = `
        <span class="latest-dot green"></span>
        <div>
          <strong>Latest member</strong>
          <p>No members yet</p>
        </div>
      `;
    }
  }

const tierOrder = {
  gold: 0,
  white: 1,
  green: 2
};

const claimed = spots
  .filter(s => s.claimed)
  .sort((a, b) => {
    if (tierOrder[a.tier] !== tierOrder[b.tier]) {
      return tierOrder[a.tier] - tierOrder[b.tier];
    }

    return (b.when || 0) - (a.when || 0);
  })
  .slice(0, 12);

  if (claimed.length === 0) {
    latestBar.innerHTML = '<p class="empty-msg">No founding members yet. Be the first.</p>';
    return;
  }

  latestBar.innerHTML = claimed.map(s => `
    <a class="founder-card ${s.tier}" href="${s.url || '#'}" ${s.url ? 'target="_blank" rel="noopener"' : ''}>
      <div class="founder-avatar ${s.tier}">
        ${
          s.avatar
            ? `<img src="${s.avatar}" alt="" loading="eager" decoding="sync">`
            : `<span>👤</span>`
        }
      </div>

      <div class="founder-info">
        <strong>${escapeHtml(s.name || 'Anonymous')}</strong>
        ${s.about ? `<small>${escapeHtml(s.about)}</small>` : ''}
      </div>

      <span class="founder-open">↗</span>
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
function showShareMessage(name, tier, about = '', spotId = '') {
  const emoji = { gold: '🏆', white: '⚪', green: '🌿' };
  const label = { gold: 'Gold Founder', white: 'White Founder', green: 'Green Founder' };
  const url = 'https://growthetreetogether.com';

  const text = `${emoji[tier]} I just claimed a ${label[tier]} Spot on Grow The Tree Together.

Only 40 permanent spots exist on the tree.

🌳 Join the tree:
${url}`;

  lastShareData = {
    name,
    tier,
    about,
    spotId,
    emoji: emoji[tier],
    label: label[tier],
    url,
    text
  };

  if (shareTitle) shareTitle.textContent = `${emoji[tier]} Spot claimed!`;
  if (shareTextEl) shareTextEl.textContent = `${name} claimed a ${label[tier]} Spot.`;
  if (shareModal) shareModal.classList.add('visible');
}

function renderMembersGrid() {
const tierOrder = {
  gold: 0,
  white: 1,
  green: 2
};

const claimed = spots
  .filter(s => s.claimed)
  .sort((a, b) => {
    if (tierOrder[a.tier] !== tierOrder[b.tier]) {
      return tierOrder[a.tier] - tierOrder[b.tier];
    }

    return (b.when || 0) - (a.when || 0);
  });

  if (!membersGrid) return;

  if (claimed.length === 0) {
    membersGrid.innerHTML = '<p class="empty-msg">No founding members yet.</p>';
    return;
  }

  membersGrid.innerHTML = claimed.map(s => `
    <a class="founder-card ${s.tier}" href="${s.url || '#'}" ${s.url ? 'target="_blank" rel="noopener"' : ''}>
      <div class="founder-avatar ${s.tier}">
        ${
          s.avatar
            ? `<img src="${s.avatar}" alt="" loading="eager" decoding="sync">`
            : `<span>👤</span>`
        }
      </div>

      <div class="founder-info">
        <strong>${escapeHtml(s.name || 'Anonymous')}</strong>
        ${s.about ? `<small>${escapeHtml(s.about)}</small>` : ''}
      </div>

      <span class="founder-open">↗</span>
    </a>
  `).join('');
}
async function downloadStoryImage(data) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');

  // === Background gradient ===
  const bg = ctx.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, '#0a1510');
  bg.addColorStop(0.5, '#071208');
  bg.addColorStop(1, '#000000');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1920);

  // === Load tree image ===
  const treeImg = new Image();
  treeImg.crossOrigin = 'anonymous';
  treeImg.src = 'tree.png';

  await new Promise((resolve, reject) => {
    treeImg.onload = resolve;
    treeImg.onerror = reject;
  });

  // === Draw tree (centered, scaled) ===
  const treeW = 900;
  const treeH = treeW / 1.24;
  const treeX = (1080 - treeW) / 2;
  const treeY = 580;
  ctx.drawImage(treeImg, treeX, treeY, treeW, treeH);

  // === Draw all spots ===
  for (const spot of spots) {
    const sx = treeX + (spot.x / 100) * treeW;
    const sy = treeY + (spot.y / 100) * treeH;

    const isCurrentSpot = spot.id === data.spotId;
    const baseSize = spot.tier === 'gold' ? 28 : spot.tier === 'white' ? 22 : 18;
    const size = isCurrentSpot ? baseSize * 1.8 : baseSize;

    if (spot.claimed && spot.avatar) {
      // Draw avatar circle
      const avatarImg = new Image();
      avatarImg.crossOrigin = 'anonymous';
      avatarImg.src = spot.avatar;

      try {
        await new Promise((res, rej) => {
          avatarImg.onload = res;
          avatarImg.onerror = rej;
          setTimeout(rej, 3000);
        });

        ctx.save();
        ctx.beginPath();
        ctx.arc(sx, sy, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImg, sx - size / 2, sy - size / 2, size, size);
        ctx.restore();

        // Border
        ctx.strokeStyle = spot.tier === 'gold' ? '#ffd54a' : spot.tier === 'white' ? '#ffffff' : '#57ff7f';
        ctx.lineWidth = isCurrentSpot ? 4 : 2;
        ctx.beginPath();
        ctx.arc(sx, sy, size / 2 + 2, 0, Math.PI * 2);
        ctx.stroke();
      } catch {
        drawGlowDot(ctx, sx, sy, size, spot.tier);
      }
    } else if (spot.claimed) {
      drawGlowDot(ctx, sx, sy, size, spot.tier);
    } else {
      drawGlowDot(ctx, sx, sy, size * 0.6, spot.tier);
    }

    // Highlight current spot with golden ring
    if (isCurrentSpot) {
      ctx.strokeStyle = '#ffd54a';
      ctx.lineWidth = 5;
      ctx.shadowColor = '#ffd54a';
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(sx, sy, size / 2 + 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  // === Header text ===
  ctx.textAlign = 'center';

  // Logo
  ctx.font = '700 32px Inter, Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🌿 GROW THE TREE', 540, 60);
  ctx.font = 'italic 600 28px Inter, Arial';
  ctx.fillStyle = '#57ff7f';
  ctx.fillText('together', 540, 100);

  // Achievement
  ctx.font = '600 24px Inter, Arial';
  ctx.fillStyle = '#ffd54a';
  ctx.fillText('✨ ACHIEVEMENT UNLOCKED ✨', 540, 180);

  // Tier title
  const tierLabel = data.tier === 'gold' ? 'GOLD FOUNDER' : data.tier === 'white' ? 'WHITE FOUNDER' : 'GREEN FOUNDER';
  ctx.font = '900 72px Inter, Arial';
  ctx.fillStyle = data.tier === 'gold' ? '#ffd54a' : data.tier === 'white' ? '#ffffff' : '#57ff7f';
  ctx.fillText(tierLabel, 540, 280);

  // Number badge
  const claimedCount = spots.filter(s => s.claimed).length;
  ctx.font = '900 64px Inter, Arial';
  ctx.fillStyle = '#ffd54a';
  ctx.fillText(`#${claimedCount}`, 540, 380);

  // Name
  ctx.font = '700 42px Inter, Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('PROUDLY CLAIMED BY', 540, 460);
  ctx.font = '900 56px Inter, Arial';
  ctx.fillText(data.name, 540, 530);
  if (data.about) {
    ctx.font = '500 28px Inter, Arial';
    ctx.fillStyle = '#9aa9a1';
    ctx.fillText(data.about, 540, 580);
  }

  // === Footer ===
  // Badge
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  roundRect(ctx, 290, 1420, 500, 80, 16);
  ctx.fill();
  ctx.strokeStyle = '#ffd54a';
  ctx.lineWidth = 2;
  roundRect(ctx, 290, 1420, 500, 80, 16);
  ctx.stroke();

  ctx.font = '700 24px Inter, Arial';
  ctx.fillStyle = '#ffd54a';
  ctx.textAlign = 'center';
  ctx.fillText(`🏆 ONE OF ONLY ${TOTALS[data.tier]} ${data.tier.toUpperCase()} SPOTS`, 540, 1470);

  // Stats row
  const statsY = 1560;
  ctx.font = '600 20px Inter, Arial';
  ctx.fillStyle = '#b9c8bf';
  ctx.fillText('ONLY 40 SPOTS EXIST', 270, statsY);
  ctx.fillText('FOUNDING MEMBER', 540, statsY);
  ctx.fillText('PERMANENT PLACE', 810, statsY);

  // CTA
  ctx.fillStyle = 'rgba(87,255,127,0.12)';
  roundRect(ctx, 180, 1700, 720, 70, 35);
  ctx.fill();
  ctx.strokeStyle = '#57ff7f';
  ctx.lineWidth = 2;
  roundRect(ctx, 180, 1700, 720, 70, 35);
  ctx.stroke();

  ctx.font = '800 28px Inter, Arial';
  ctx.fillStyle = '#57ff7f';
  ctx.fillText('🌿 BE PART OF SOMETHING REAL. GROW TOGETHER. 🌿', 540, 1745);

  // URL
  ctx.font = '700 32px Inter, Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('growthetreetogether.com', 540, 1850);

  // === Download ===
  const link = document.createElement('a');
  link.download = `grow-the-tree-${data.tier}-founder-${data.name.replace(/\s+/g, '-')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function drawGlowDot(ctx, x, y, size, tier) {
  const color = tier === 'gold' ? '#ffd54a' : tier === 'white' ? '#ffffff' : '#57ff7f';
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

init();
