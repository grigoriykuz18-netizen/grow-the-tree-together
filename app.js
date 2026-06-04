
const SPOTS_DATA = [];

function addRing(count, radiusX, radiusY, tier, prefix) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;

    const x = 50 + Math.cos(angle) * radiusX;
    const y = 48 + Math.sin(angle) * radiusY;

    SPOTS_DATA.push([
      `${prefix}${i + 1}`,
      tier,
      Number(x.toFixed(1)),
      Number(y.toFixed(1))
    ]);
  }
}

// GOLD (9)
addRing(9, 12, 10, "gold", "g");

// WHITE (42)
addRing(42, 26, 21, "white", "w");

// GREEN (49)
addRing(49, 37, 30, "green", "gr");
const PRICES={gold:250,white:100,green:50},KEY='gtree_claims_v2';
let spots=[],selectedSpot=null;
const $=id=>document.getElementById(id);
const spotsLayer=$('spotsLayer'),tooltip=$('tooltip'),claimedCountEl=$('claimedCount'),form=$('claimForm'),submitBtn=$('submitBtn'),spotIdInput=$('spotIdInput'),latestBar=$('latestBar');
const goldLeftEl=$('goldLeft'),whiteLeftEl=$('whiteLeft'),greenLeftEl=$('greenLeft');
const hint=document.querySelector('.hint');
function init(){load();renderSpots();updateCount();renderLatest();bind();}
function load(){let saved=[];try{saved=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){};spots=SPOTS_DATA.map(s=>{const c=saved.find(x=>x.id===s.id);return c?{...s,...c,claimed:true}:{...s}})}
function save(){localStorage.setItem(KEY,JSON.stringify(spots.filter(s=>s.claimed).map(({id,name,url,tier,when})=>({id,name,url,tier,when}))))}
function renderSpots(){spotsLayer.innerHTML='';spots.forEach(s=>{const el=document.createElement('button');el.type='button';el.className=`spot ${s.tier}${s.claimed?' claimed':''}`;el.style.left=s.x+'%';el.style.top=s.y+'%';el.dataset.id=s.id;if(s.claimed)el.innerHTML=`<div class="leaf-avatar"><div class="avatar">${initials(s.name)}</div></div>`;el.onmouseenter=e=>showTip(e,s);el.onmousemove=moveTip;el.onmouseleave=hideTip;el.onclick=()=>s.claimed?openLink(s):selectSpot(s);spotsLayer.appendChild(el)})}
function showTip(e,s){tooltip.innerHTML=s.claimed?`<b>${esc(s.name||'Claimed')}</b><br><span>${cap(s.tier)} Spot</span>${s.url?`<br><span>${esc(s.url)}</span>`:''}`:`<b>${cap(s.tier)} Spot — $${PRICES[s.tier]}</b><br><span>Click to select this place</span>`;tooltip.classList.add('visible');moveTip(e)}
function moveTip(e){const r=spotsLayer.getBoundingClientRect();tooltip.style.left=e.clientX-r.left+'px';tooltip.style.top=e.clientY-r.top-12+'px';tooltip.style.transform='translate(-50%,-100%)'}
function hideTip(){tooltip.classList.remove('visible')}
function selectSpot(s){document.querySelectorAll('.spot.selected').forEach(x=>x.classList.remove('selected'));selectedSpot=s;spotIdInput.value=s.id;submitBtn.disabled=false;const el=document.querySelector(`.spot[data-id="${s.id}"]`);if(el)el.classList.add('selected');const radio=document.querySelector(`input[name="tier"][value="${s.tier}"]`);if(radio)radio.checked=true;if(hint){hint.classList.add('selected');hint.innerHTML=`Selected: <strong>${cap(s.tier)} Spot</strong> — $${PRICES[s.tier]}`}hideTip()}
function bind(){form.onsubmit=handleSubmit;document.querySelectorAll('input[name="tier"]').forEach(r=>r.onchange=()=>{if(selectedSpot&&selectedSpot.tier!==r.value)clearSelected()});const reset=$('resetDemo');if(reset)reset.onclick=()=>{localStorage.removeItem(KEY);selectedSpot=null;load();renderSpots();updateCount();renderLatest();clearSelected()}}
function clearSelected(){document.querySelectorAll('.spot.selected').forEach(x=>x.classList.remove('selected'));selectedSpot=null;spotIdInput.value='';submitBtn.disabled=true;if(hint){hint.classList.remove('selected');hint.innerHTML='🌿 <strong>Select a glowing dot</strong> on the tree to see price and claim that spot.'}}
function handleSubmit(e){e.preventDefault();if(!selectedSpot)return;const fd=new FormData(form),name=(fd.get('name')||'Your Brand').trim().slice(0,32),url=norm((fd.get('url')||'').trim()),tier=fd.get('tier');if(selectedSpot.tier!==tier){alert('Selected spot tier does not match.');return}if(!confirm(`Pay $${PRICES[tier]} for ${tier.toUpperCase()} spot?\n\nDemo payment — click OK.`))return;const s=spots.find(x=>x.id===selectedSpot.id);Object.assign(s,{claimed:true,name,url,when:Date.now()});save();renderSpots();updateCount();renderLatest();form.reset();clearSelected()}
function updateCount(){claimedCountEl.textContent=spots.filter(s=>s.claimed).length;if(goldLeftEl)goldLeftEl.textContent=spots.filter(s=>s.tier==='gold'&&!s.claimed).length;if(whiteLeftEl)whiteLeftEl.textContent=spots.filter(s=>s.tier==='white'&&!s.claimed).length;if(greenLeftEl)greenLeftEl.textContent=spots.filter(s=>s.tier==='green'&&!s.claimed).length}
function renderLatest(){const arr=spots.filter(s=>s.claimed).sort((a,b)=>(b.when||0)-(a.when||0)).slice(0,8);if(!arr.length){latestBar.innerHTML='<p class="empty-msg">No spots claimed yet. Be the first.</p>';return}latestBar.innerHTML=arr.map(s=>`<a class="claim-pill" href="${s.url||'#'}" ${s.url?'target="_blank" rel="noopener"':''}><span class="pill-dot ${s.tier}"></span><strong>${esc(s.name)}</strong><span class="pill-tier">claimed ${cap(s.tier)} Spot</span></a>`).join('')}
function openLink(s){if(s.url)window.open(s.url,'_blank','noopener')}
function norm(u){if(!u)return'';if(u.startsWith('@'))return'https://t.me/'+u.slice(1);return/^https?:\/\//i.test(u)?u:'https://'+u}
function initials(n){return String(n||'?').split(/\s+/).filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase()}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1)}
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML}
init();
