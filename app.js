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
const avatarInput = document.getElementById('avatarInput');
const clearAvatarBtn = document.getElementById('clearAvatarBtn');
const avatarFileName = document.getElementById('avatarFileName');

let lastShareData = null;
// ===== DATA: V32 ideal layout — 42 spots =====
const SPOTS_DATA = [
  { id: 'g1', tier: 'gold', x: 44, y: 36 },
  { id: 'g2', tier: 'gold', x: 56, y: 36 },
  { id: 'g3', tier: 'gold', x: 44, y: 51 },
  { id: 'g4', tier: 'gold', x: 56, y: 51 },

  { id: 'w1', tier: 'white', x: 39, y: 17 },
  { id: 'w2', tier: 'white', x: 50, y: 15 },
  { id: 'w3', tier: 'white', x: 61, y: 17 },
  { id: 'w4', tier: 'white', x: 31, y: 29 },
  { id: 'w5', tier: 'white', x: 40, y: 26 },
  { id: 'w6', tier: 'white', x: 60, y: 26 },
  { id: 'w7', tier: 'white', x: 69, y: 29 },
  { id: 'w8', tier: 'white', x: 26, y: 41 },
  { id: 'w9', tier: 'white', x: 35, y: 40 },
  { id: 'w10', tier: 'white', x: 65, y: 40 },
  { id: 'w11', tier: 'white', x: 74, y: 41 },
  { id: 'w12', tier: 'white', x: 31, y: 53 },
  { id: 'w15', tier: 'white', x: 69, y: 53 },
  { id: 'w16', tier: 'white', x: 38, y: 67 },
  { id: 'w17', tier: 'white', x: 62, y: 67 },

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

const BASE_PRICES = { gold: 250, white: 100, green: 50 };

function getCurrentPrices() {
  const claimedTotal = spots.filter(s => s.claimed).length;

  const multiplier = claimedTotal >= 10 ? 1.10 : 1;

  return {
    gold: Math.round(BASE_PRICES.gold * multiplier),
    white: Math.round(BASE_PRICES.white * multiplier),
    green: Math.round(BASE_PRICES.green * multiplier)
  };
}

const BAD_WORDS = [
  'fuck', 'shit', 'bitch', 'asshole', 'nigger', 'porn', 'sex', 'xxx',
  'порно', 'секс', 'хуй', 'пизд', 'еба', 'ебл', 'сука', 'бляд', 'блять',
  'нахуй', 'гандон', 'мудак'
];

const BLOCKED_DOMAINS = [
  'pornhub.com',
  'xvideos.com',
  'xnxx.com',
  'onlyfans.com',
  'fansly.com'
];

function containsBadContent(text = '') {
  const clean = String(text).toLowerCase();

  return BAD_WORDS.some(word => clean.includes(word));
}

function containsBlockedDomain(url = '') {
  const clean = String(url).toLowerCase();

  return BLOCKED_DOMAINS.some(domain => clean.includes(domain));
}

function validateClaimContent({ name, about, url }) {
  if (containsBadContent(name) || containsBadContent(about) || containsBadContent(url)) {
    return 'Please remove offensive or inappropriate content.';
  }

  if (containsBlockedDomain(url)) {
    return 'This link is not allowed.';
  }

  if (name.length < 2) {
    return 'Name is too short.';
  }

  if (about.length > 250) {
    return 'Description is too long.';
  }

  return null;
}

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
  const price = getCurrentPrices()[spot.tier];

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
  el.setAttribute('data-price', `$${getCurrentPrices()[spot.tier]}`);
}

  const radio = document.querySelector(`input[name="tier"][value="${spot.tier}"]`);
  if (radio) radio.checked = true;

  const hint = document.querySelector('.hint');
  if (hint) {
    hint.classList.add('selected');
    hint.innerHTML = `Selected: <strong>${capitalize(spot.tier)} Spot</strong> — $${getCurrentPrices()[spot.tier]}`;
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

if (avatarInput && avatarFileName) {
  avatarInput.addEventListener('change', () => {
    avatarFileName.textContent =
      avatarInput.files && avatarInput.files.length
        ? avatarInput.files[0].name
        : 'No file selected';
  });
}

if (clearAvatarBtn && avatarInput && avatarFileName) {
  clearAvatarBtn.addEventListener('click', () => {
    avatarInput.value = '';
    avatarFileName.textContent = 'No file selected';
  });
}

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
  const about = (formData.get('about') || '').trim().slice(0, 250);
  const url = normalizeUrl((formData.get('url') || '').trim());
  const validationError = validateClaimContent({ name, about, url });

if (validationError) {
  alert(validationError);
  return;
}
  const tier = formData.get('tier');
  const avatarFile = formData.get('avatar');

  if (selectedSpot.tier !== tier) {
    alert('Selected spot tier does not match. Please select a matching spot.');
    return;
  }

  const price = getCurrentPrices()[tier];
const confirmed = confirm(
  `Claim ${tier.toUpperCase()} Spot for $${price}?`
);

if (!confirmed) return;

  let avatarUrl = '';

  if (avatarFile && avatarFile.size > 0) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(avatarFile.type)) {
    alert('Only JPG, PNG or WEBP images are allowed.');
    return;
  }

  if (avatarFile.size > 3 * 1024 * 1024) {
    alert('Image is too large. Please upload an image under 3 MB.');
    return;
  }
}
  
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

const currentPrices = getCurrentPrices();

const raised =
  goldClaimed * currentPrices.gold +
  whiteClaimed * currentPrices.white +
  greenClaimed * currentPrices.green;

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
  updatePriceNotice(claimedTotal);
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

  priceEl.textContent = `${left} left · $${getCurrentPrices()[tier]}`;
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

  try {
    const treeImg = await loadCanvasImage('tree.png', false);

    const avatarImages = {};
    for (const spot of spots.filter(s => s.claimed && s.avatar)) {
      try {
        avatarImages[spot.id] = await loadCanvasImage(spot.avatar, true);
      } catch (e) {
        console.warn('Avatar skipped:', spot.avatar);
      }
    }

    drawStoryPoster(ctx, canvas, treeImg, avatarImages, data);
    exportStory(canvas, data);
  } catch (err) {
    console.error(err);
    alert('Could not generate story image.');
  }
}

function loadCanvasImage(src, useCors = true) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    if (useCors) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Image failed: ${src}`));

    img.src = src;
  });
}

function drawStoryPoster(ctx, canvas, treeImg, avatarImages, data) {
  const W = canvas.width;
  const H = canvas.height;

  const colors = {
    gold: '#ffd54a',
    white: '#ffffff',
    green: '#57ff7f'
  };

  const tierTitle = {
    gold: 'GOLD FOUNDER',
    white: 'WHITE FOUNDER',
    green: 'GREEN FOUNDER'
  };

  const tierLimit = {
    gold: '4 GOLD SPOTS',
    white: '15 WHITE SPOTS',
    green: '21 GREEN SPOTS'
  };

  const mainColor = colors[data.tier] || colors.green;
  const claimedCount = spots.filter(s => s.claimed).length;
  const activeSpot = spots.find(s => s.id === data.spotId);

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#07120d');
  bg.addColorStop(0.45, '#041008');
  bg.addColorStop(1, '#000000');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  drawStoryParticles(ctx, W, H, mainColor);

  // Header
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  ctx.font = '900 44px Inter, Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🌿 GROW THE TREE', W / 2, 70);

  ctx.font = 'italic 800 36px Inter, Arial';
  ctx.fillStyle = '#57ff7f';
  ctx.fillText('together', W / 2, 118);

  ctx.font = '800 34px Inter, Arial';
  ctx.fillStyle = mainColor;
  ctx.shadowColor = mainColor;
  ctx.shadowBlur = 18;
  ctx.fillText('✨ ACHIEVEMENT UNLOCKED ✨', W / 2, 205);
  ctx.shadowBlur = 0;

  ctx.font = '900 96px Inter, Arial';
  ctx.fillStyle = mainColor;
  ctx.shadowColor = mainColor;
  ctx.shadowBlur = 26;
  ctx.fillText(tierTitle[data.tier] || 'FOUNDER', W / 2, 330);
  ctx.shadowBlur = 0;

  drawFounderNumberBadge(ctx, W / 2, 435, claimedCount, mainColor);

  ctx.font = '800 28px Inter, Arial';
  ctx.fillStyle = '#dbe8e0';
  ctx.fillText('PROUDLY CLAIMED BY', W / 2, 555);

  ctx.font = '900 58px Inter, Arial';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255,255,255,.35)';
  ctx.shadowBlur = 14;
  ctx.fillText(data.name || 'Founder', W / 2, 625);
  ctx.shadowBlur = 0;

  // Tree area — крупнее и ближе к референсу
  const treeX = 20;
  const treeY = 650;
  const treeW = 1040;
  const treeH = 790;

  ctx.save();

  const treeGlow = ctx.createRadialGradient(W / 2, treeY + 420, 80, W / 2, treeY + 420, 520);
  treeGlow.addColorStop(0, `${mainColor}55`);
  treeGlow.addColorStop(0.45, 'rgba(87,255,127,.12)');
  treeGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = treeGlow;
  ctx.fillRect(0, treeY - 80, W, treeH + 180);

  ctx.drawImage(treeImg, treeX, treeY, treeW, treeH);

  drawStorySpots(ctx, treeX, treeY, treeW, treeH, activeSpot, avatarImages);

  ctx.restore();

  // Bottom tier badge
  drawPremiumBadge(
    ctx,
    W / 2,
    1510,
    `🏆 ONE OF ONLY ${tierLimit[data.tier]}`,
    mainColor
  );

  drawStoryStats(ctx, W, 1645, mainColor);

  drawBottomCTA(ctx, W / 2, 1810);

  ctx.font = '900 38px Inter, Arial';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255,255,255,.25)';
  ctx.shadowBlur = 10;
  ctx.fillText('growthetreetogether.com', W / 2, 1900);
  ctx.shadowBlur = 0;
}

function drawStorySpots(ctx, treeX, treeY, treeW, treeH, activeSpot, avatarImages) {
  const colors = {
    gold: '#ffd54a',
    white: '#ffffff',
    green: '#57ff7f'
  };

  // ВАЖНО: отдельная безопасная область для точек внутри дерева.
  // Поэтому точки больше не выходят за пределы дерева на story-картинке.
  const spotArea = {
    x: treeX + 90,
    y: treeY + 70,
    w: treeW - 180,
    h: treeH - 165
  };

  spots.forEach(spot => {
    const color = colors[spot.tier] || colors.green;
    const isActive = activeSpot && spot.id === activeSpot.id;

    let x = spotArea.x + (spot.x / 100) * spotArea.w;
    let y = spotArea.y + (spot.y / 100) * spotArea.h;

    // Защита от крайних точек
    x = clamp(x, treeX + 55, treeX + treeW - 55);
    y = clamp(y, treeY + 45, treeY + treeH - 85);

    const emptySize =
      spot.tier === 'gold' ? 22 :
      spot.tier === 'white' ? 18 :
      16;

    const claimedSize =
      spot.tier === 'gold' ? 54 :
      spot.tier === 'white' ? 44 :
      38;

    const size = spot.claimed ? claimedSize : emptySize;
    const finalSize = isActive ? size + 26 : size;

    if (isActive) {
      drawActiveSpotAura(ctx, x, y, finalSize, color);
    }

    if (spot.claimed && avatarImages[spot.id]) {
      drawAvatarCircle(ctx, avatarImages[spot.id], x, y, finalSize, color, isActive);
    } else if (spot.claimed) {
      drawPlaceholderCircle(ctx, x, y, finalSize, color, isActive);
    } else {
      drawEmptyDot(ctx, x, y, finalSize, color);
    }
  });
}

function drawAvatarCircle(ctx, img, x, y, size, color, isActive) {
  ctx.save();

  ctx.shadowColor = color;
  ctx.shadowBlur = isActive ? 34 : 18;

  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = '#06100c';
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, size / 2 - 5, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, x - size / 2 + 5, y - size / 2 + 5, size - 10, size - 10);
  ctx.restore();

  ctx.lineWidth = isActive ? 7 : 4;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawPlaceholderCircle(ctx, x, y, size, color, isActive) {
  ctx.save();

  ctx.shadowColor = color;
  ctx.shadowBlur = isActive ? 34 : 18;

  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = '#06100c';
  ctx.fill();

  ctx.lineWidth = isActive ? 7 : 4;
  ctx.strokeStyle = color;
  ctx.stroke();

  ctx.font = `${Math.round(size * 0.42)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#b9c8bf';
  ctx.fillText('👤', x, y + 1);

  ctx.restore();
}

function drawEmptyDot(ctx, x, y, size, color) {
  ctx.save();

  ctx.shadowColor = color;
  ctx.shadowBlur = 22;

  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, size / 2 + 5, 0, Math.PI * 2);
  ctx.strokeStyle = `${color}66`;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}

function drawActiveSpotAura(ctx, x, y, size, color) {
  ctx.save();

  const aura = ctx.createRadialGradient(x, y, 8, x, y, size * 1.8);
  aura.addColorStop(0, `${color}cc`);
  aura.addColorStop(0.32, `${color}55`);
  aura.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(x, y, size * 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.shadowColor = color;
  ctx.shadowBlur = 35;
  ctx.beginPath();
  ctx.arc(x, y, size / 2 + 18, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, size / 2 + 30, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawFounderNumberBadge(ctx, x, y, number, color) {
  ctx.save();

  ctx.shadowColor = color;
  ctx.shadowBlur = 24;

  ctx.fillStyle = 'rgba(0,0,0,.62)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;

  roundRect(ctx, x - 145, y - 60, 290, 104, 22);
  ctx.fill();
  ctx.stroke();

  ctx.font = '900 78px Inter, Arial';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(`#${number}`, x, y + 17);

  ctx.restore();
}

function drawPremiumBadge(ctx, x, y, text, color) {
  ctx.save();

  ctx.fillStyle = 'rgba(0,0,0,.68)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.shadowColor = color;
  ctx.shadowBlur = 22;

  roundRect(ctx, x - 340, y - 48, 680, 96, 20);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;

  ctx.font = '900 30px Inter, Arial';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y + 10);

  ctx.restore();
}

function drawStoryStats(ctx, W, y, color) {
  const items = [
    ['🌿', 'ONLY', '40 SPOTS'],
    ['👥', 'FOUNDING', 'MEMBER'],
    ['🛡️', 'VISIBLE', 'PLACE'],
    ['🌍', 'CONNECT', '& GROW']
  ];

  const centers = [145, 410, 670, 935];

  ctx.save();

  items.forEach((item, i) => {
    const x = centers[i];

    ctx.beginPath();
    ctx.arc(x, y, 38, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(87,255,127,.10)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(87,255,127,.45)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(item[0], x, y + 1);

    ctx.textBaseline = 'alphabetic';

    ctx.font = '800 18px Inter, Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(item[1], x, y + 78);

    ctx.font = '900 22px Inter, Arial';
    ctx.fillStyle = color;
    ctx.fillText(item[2], x, y + 106);
  });

  ctx.restore();
}

function drawBottomCTA(ctx, x, y) {
  ctx.save();

  ctx.fillStyle = 'rgba(87,255,127,.10)';
  ctx.strokeStyle = '#57ff7f';
  ctx.lineWidth = 3;

  roundRect(ctx, x - 395, y - 42, 790, 84, 42);
  ctx.fill();
  ctx.stroke();

  ctx.font = '900 30px Inter, Arial';
  ctx.fillStyle = '#57ff7f';
  ctx.textAlign = 'center';
  ctx.fillText('BE PART OF SOMETHING REAL. GROW TOGETHER.', x, y + 10);

  ctx.restore();
}

function drawStoryParticles(ctx, W, H, color) {
  ctx.save();

  for (let i = 0; i < 120; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const r = Math.random() * 2.4 + 0.4;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = i % 4 === 0 ? color : 'rgba(87,255,127,.42)';
    ctx.globalAlpha = Math.random() * 0.65;
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) {
  const words = String(text || '').split(' ');
  const lines = [];
  let line = '';

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;

    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }

    if (lines.length >= maxLines) break;
  }

  if (line && lines.length < maxLines) {
    lines.push(line);
  }

  lines.forEach((l, i) => {
    ctx.fillText(l, x, y + i * lineHeight);
  });
}

function exportStory(canvas, data) {
  const fileName = `grow-the-tree-${data.tier}-founder-${String(data.name || 'founder').replace(/\s+/g, '-')}.png`;

  canvas.toBlob(async blob => {
    if (!blob) {
      alert('Could not export image.');
      return;
    }

    const file = new File([blob], fileName, { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'Grow The Tree Together',
          text: data.text,
          files: [file]
        });
        return;
      } catch (e) {
        console.warn('Share cancelled or failed:', e);
      }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }, 'image/png');
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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

function updatePriceNotice(claimedTotal) {
  const kicker = document.getElementById('priceKicker');
  const headline = document.getElementById('priceHeadline');
  const subtext = document.getElementById('priceSubtext');

  if (!kicker || !headline || !subtext) return;

  if (claimedTotal >= 10) {
    kicker.textContent = 'Founder pricing active';
    headline.textContent = 'The first 10 founder spots have been claimed.';
    subtext.textContent = 'Current prices include the 10% founder price increase.';
  } else {
    const left = 10 - claimedTotal;

    kicker.textContent = 'Early founder price';
    headline.textContent = 'Prices increase by 10% after the first 10 claimed spots.';
    subtext.textContent = `${left} early founder spots left before the price increase.`;
  }
}

init();
