// ═══════════════════════════════════════════════════════════════════════════
// FRIENDZONE — game.js  (Firebase Realtime Database multiplayer)
// ═══════════════════════════════════════════════════════════════════════════

// ── FIREBASE INIT ──────────────────────────────────────────────────────────
let db = null;
let fbOk = false;

try {
  firebase.initializeApp(FIREBASE_CONFIG);
  db = firebase.database();
  db.ref('.info/connected').on('value', snap => {
    fbOk = snap.val() === true;
    setFbStatus(fbOk ? 'ok' : 'wait', fbOk ? 'En ligne' : 'Reconnexion…');
  });
} catch(e) {
  setFbStatus('err', 'Firebase non configuré');
}

function setFbStatus(state, text) {
  document.getElementById('fbDot').className = 'fb-dot ' + state;
  document.getElementById('fbText').textContent = text;
}

// ── DATA ───────────────────────────────────────────────────────────────────
const COLORS = ['#ff2d78','#00e5c8','#ffcc00','#9b4dff','#ff7043','#64ffda','#ffd740','#b388ff','#ff6b9d','#69f0ae'];

const LEVEL_META = {
  pote:    { label:'🤙 Potes',     color:'#9b4dff', textColor:'#fff' },
  amoureux:{ label:'💑 Amoureux',  color:'#ff6b9d', textColor:'#fff' },
  camarade:{ label:'🎓 Camarades', color:'#00e5c8', textColor:'#000' },
  famille: { label:'👨‍👩‍👧 Famille',  color:'#ffcc00', textColor:'#000' },
};

const GAME_NAMES = { av:'Action ou Vérité', ojnj:'On écoute, on ne juge pas', defi:'Le Grand Défi', spin:'Roue du Destin', hotSeat:'Siège Brûlant', neveri:"Je n'ai jamais…" };

const TYPE_MAP  = { verite:'Vérité', action:'Action', defi:'Défi', neveri:"Je n'ai jamais", amour:'Amour', famille:'Famille' };
const TYPE_CSS  = { verite:'type-verite', action:'type-action', defi:'type-defi', neveri:'type-neveri', amour:'type-amour', famille:'type-famille' };

const Q = {
  av: {
    pote:[
      {t:'verite',e:'🤫',q:"Quel est ton plus grand secret que le groupe ne connaît pas ?"},
      {t:'action',e:'🕺',q:"Imite la façon de marcher d'un joueur de ton choix."},
      {t:'verite',e:'📱',q:"Montre le dernier message privé que tu as envoyé."},
      {t:'action',e:'🎤',q:"Chante 30 secondes d'une chanson choisie par le groupe."},
      {t:'verite',e:'💸',q:"Quel est le truc le plus inutile que tu aies acheté ?"},
      {t:'action',e:'📸',q:"Montre la photo la plus embarrassante dans ton téléphone."},
      {t:'verite',e:'🥶',q:"Quelle est ta plus grande peur inavouable ?"},
      {t:'action',e:'💃',q:"Danse pendant 20 secondes sans musique."},
      {t:'verite',e:'🤥',q:"Quel est le pire mensonge que tu aies dit à quelqu'un du groupe ?"},
      {t:'action',e:'🤙',q:"Appelle quelqu'un au hasard et dis 'Je pense fort à toi' puis raccroche."},
      {t:'verite',e:'🍀',q:"Quelle est la chose la plus folle que tu as faite en groupe ?"},
      {t:'action',e:'😂',q:"Fais rire tout le monde en 30 secondes — sinon tu perds un point !"},
      {t:'verite',e:'🌙',q:"Quelle heure tu rentres réellement quand tu dis 'je rentre tôt' ?"},
      {t:'action',e:'🥸',q:"Mets le plus d'objets possible sur ta tête et tiens debout 10 secondes."},
      {t:'verite',e:'👀',q:"Quelle est la première chose que tu remarques chez quelqu'un d'attirant ?"},
    ],
    amoureux:[
      {t:'verite',e:'💕',q:"Quel est le truc qui t'attire le plus chez moi ?"},
      {t:'action',e:'💋',q:"Dis 3 choses romantiques à ton/ta partenaire sans rire."},
      {t:'verite',e:'🔥',q:"C'est quoi ton plus grand fantasme romantique ?"},
      {t:'action',e:'💌',q:"Écris un petit poème de 4 lignes pour ton/ta partenaire maintenant."},
      {t:'verite',e:'🥺',q:"Quelle est la chose que je fais qui te touche le plus ?"},
      {t:'action',e:'🎵',q:"Chante une chanson qui me décrit parfaitement selon toi."},
      {t:'verite',e:'💭',q:"Qu'est-ce que tu n'as jamais osé me dire mais que tu penses souvent ?"},
      {t:'action',e:'🌹',q:"Fais la chose la plus romantique possible avec ce que tu as autour de toi."},
      {t:'verite',e:'😍',q:"Quel est ton moment préféré qu'on a vécu ensemble ?"},
      {t:'action',e:'🤳',q:"Envoie-moi le plus beau message que tu saches écrire maintenant."},
    ],
    camarade:[
      {t:'verite',e:'📚',q:"Quel cours / matière tu détestes en secret mais fais semblant d'aimer ?"},
      {t:'action',e:'🎭',q:"Imite le prof ou collègue le plus strict que vous avez en commun."},
      {t:'verite',e:'😅',q:"Quelle est la pire excuse inventée pour ne pas venir en cours/au boulot ?"},
      {t:'action',e:'🗣️',q:"Parle pendant 1 minute d'un sujet tiré au sort — tu ne peux pas t'arrêter."},
      {t:'verite',e:'🤫',q:"Qui dans le groupe imagines-tu le mieux s'en sortir dans la vie ?"},
      {t:'action',e:'🖊️',q:"Dessine le portrait d'un camarade en 30 secondes."},
    ],
    famille:[
      {t:'verite',e:'🏠',q:"Quel est ton meilleur souvenir de famille ?"},
      {t:'action',e:'👴',q:"Imite la façon de parler du membre le plus âgé de la famille."},
      {t:'verite',e:'🎁',q:"Quel est le plus beau cadeau que tu aies reçu dans la famille ?"},
      {t:'action',e:'🎶',q:"Chante une chanson que toute la famille connaît."},
      {t:'verite',e:'🍽️',q:"Quel plat familial tout le monde adore-t-il ?"},
      {t:'action',e:'😄',q:"Raconte une blague que les enfants peuvent entendre."},
    ],
  },
  ojnj: {
    pote:[
      {t:'defi',e:'🌙',q:"Raconte un moment où tu t'es senti(e) vraiment seul(e), même entouré(e)."},
      {t:'defi',e:'💙',q:"Quelle est la personne qui t'a le plus marqué(e) dans ta vie ? Pourquoi ?"},
      {t:'defi',e:'🌱',q:"De quoi es-tu le plus fier(ère) jusqu'ici ?"},
      {t:'defi',e:'🔥',q:"Quel est ton plus grand regret ? Le ferais-tu différemment ?"},
      {t:'defi',e:'🦋',q:"Qu'est-ce que les gens ne comprennent pas de toi ?"},
      {t:'defi',e:'🌟',q:"Quel est le rêve que tu as mis de côté et qui te manque encore ?"},
      {t:'defi',e:'💭',q:"Si tu pouvais parler à toi-même d'il y a 5 ans, que lui dirais-tu ?"},
      {t:'defi',e:'💪',q:"C'est quoi être fort(e) pour toi ?"},
      {t:'defi',e:'🤝',q:"Qu'est-ce que l'amitié représente vraiment pour toi ?"},
      {t:'defi',e:'🏠',q:"Qu'est-ce qui te donne le sentiment d'être vraiment chez toi ?"},
    ],
    amoureux:[
      {t:'amour',e:'💑',q:"Quelle est la chose que tu apprécies le plus dans notre relation ?"},
      {t:'amour',e:'🌈',q:"Qu'est-ce qui te fait peur dans notre avenir ?"},
      {t:'amour',e:'🕊️',q:"Y a-t-il quelque chose que tu voudrais que je change ? Dis-le avec douceur."},
      {t:'amour',e:'🌸',q:"Comment imagines-tu notre relation dans 5 ans ?"},
    ],
    camarade:[
      {t:'defi',e:'🎓',q:"Quel aspect de ta vie scolaire/pro gardes-tu souvent pour toi ?"},
      {t:'defi',e:'🏆',q:"Quel succès te rend fier(ère) mais dont tu ne parles jamais ?"},
    ],
    famille:[
      {t:'famille',e:'👨‍👩‍👧',q:"Quel membre de la famille t'a le plus inspiré(e) ? Pourquoi ?"},
      {t:'famille',e:'🏡',q:"Quel souvenir d'enfance t'a le plus marqué(e) ?"},
      {t:'famille',e:'🌻',q:"Qu'aimerais-tu que ta famille sache sur toi ?"},
    ],
  },
  defi: {
    pote:[
      {t:'defi',e:'🐔',q:"Imite un animal pendant 30 secondes. Le groupe note sur 10."},
      {t:'defi',e:'🎭',q:"Joue une scène dramatique avec le joueur suivant. 1 minute chrono !"},
      {t:'defi',e:'🗣️',q:"Parle 1 minute d'un objet banal comme s'il était le trésor du monde."},
      {t:'defi',e:'🤸',q:"Fais 10 sauts en chantant l'hymne national en même temps."},
      {t:'defi',e:'🎨',q:"Dessine un portrait d'un joueur en 30 secondes chrono."},
      {t:'defi',e:'😬',q:"Fais la plus grande grimace pendant que le groupe compte jusqu'à 15."},
      {t:'defi',e:'💃',q:"Apprends un pas de danse au groupe en 2 minutes."},
      {t:'defi',e:'🤫',q:"Chuchote une blague. Si quelqu'un rit, il perd un point avec toi."},
    ],
    famille:[
      {t:'famille',e:'🎩',q:"Fais un tour de magie avec ce que tu as à portée de main."},
      {t:'famille',e:'🎤',q:"Chante une chanson en changeant toutes les paroles par des mots de cuisine."},
    ],
    amoureux:[
      {t:'amour',e:'💌',q:"Compose une chanson de 4 lignes pour ton/ta partenaire maintenant."},
      {t:'amour',e:'🎭',q:"Rejoue la première fois que vous vous êtes rencontrés."},
    ],
    camarade:[
      {t:'defi',e:'🧑‍💼',q:"Fais un discours de PDG de 1 minute sur un produit complètement inutile."},
      {t:'defi',e:'📊',q:"Explique ton weekend comme si c'était une présentation professionnelle."},
    ],
  },
  spin: { pote:[], amoureux:[], camarade:[], famille:[] },
  hotSeat: {
    pote:[{t:'verite',e:'🔥',q:"Siège Brûlant ! Pendant 2 minutes, tout le groupe te pose des questions. Réponds honnêtement à TOUT !"}],
    amoureux:[{t:'amour',e:'💖',q:"Siège Brûlant romantique ! 2 minutes, ton/ta partenaire peut tout te demander !"}],
    camarade:[{t:'defi',e:'🎓',q:"Siège Brûlant camarade ! 2 minutes, répondez aux questions du groupe !"}],
    famille:[{t:'famille',e:'👨‍👩‍👧',q:"Siège Brûlant famille ! 2 minutes pour répondre aux questions. On reste bienveillant !"}],
  },
  neveri: {
    pote:[
      {t:'neveri',e:'✈️',q:"Je n'ai jamais pris l'avion seul(e) pour rejoindre quelqu'un."},
      {t:'neveri',e:'🌙',q:"Je n'ai jamais passé une nuit blanche à discuter avec quelqu'un."},
      {t:'neveri',e:'🤥',q:"Je n'ai jamais menti à quelqu'un que j'aime pour ne pas le blesser."},
      {t:'neveri',e:'😭',q:"Je n'ai jamais pleuré en regardant un film."},
      {t:'neveri',e:'💌',q:"Je n'ai jamais envoyé un message et regretté immédiatement."},
      {t:'neveri',e:'🏃',q:"Je n'ai jamais fui en faisant semblant d'avoir un appel."},
      {t:'neveri',e:'🍕',q:"Je n'ai jamais mangé une pizza entière seul(e) en une soirée."},
      {t:'neveri',e:'👻',q:"Je n'ai jamais ghosté quelqu'un que j'appréciais."},
      {t:'neveri',e:'😴',q:"Je n'ai jamais dormi plus de 14h d'affilée par flemme pure."},
    ],
    amoureux:[
      {t:'amour',e:'💕',q:"Je n'ai jamais regardé le profil de mon/ma ex juste pour voir."},
      {t:'amour',e:'🌹',q:"Je n'ai jamais pensé à toi à un moment totalement inattendu."},
      {t:'amour',e:'💌',q:"Je n'ai jamais relu une vieille conversation pour sourire."},
    ],
    famille:[
      {t:'famille',e:'🎄',q:"Je n'ai jamais raté un repas de famille volontairement."},
      {t:'famille',e:'🤐',q:"Je n'ai jamais gardé un secret familial pendant plus d'un an."},
    ],
    camarade:[
      {t:'defi',e:'📚',q:"Je n'ai jamais copié sur quelqu'un (ou laissé copier sur moi)."},
      {t:'defi',e:'😴',q:"Je n'ai jamais dormi en cours / au travail."},
    ],
  },
};

// ── STATE ──────────────────────────────────────────────────────────────────
let mode = 'local'; // 'local' | 'online'
let isHost = false;
let myName = '';
let roomCode = '';
let roomRef = null;
let gameState = null; // synced from Firebase
let players = [];
let scores = {};
let selGame = 'av';
let selLevel = 'pote';
let selMode = 'auto';
let localCards = [];
let localCardIdx = 0;
let localPlayerIdx = 0;
let currentQM = 'auto';
let unsubscribeRoom = null;

// ── UTILS ──────────────────────────────────────────────────────────────────
function shuffle(a){ return [...a].sort(()=>Math.random()-.5); }
function rndCode(){ return Math.random().toString(36).substring(2,8).toUpperCase(); }
function el(id){ return document.getElementById(id); }
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  el(id).classList.add('active');
  window.scrollTo(0,0);
}
function openModal(id){ el(id).classList.add('open'); }
function closeModal(id){ el(id).classList.remove('open'); }
function toast(msg){
  const t=el('toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),2400);
}

// ── NAVIGATION ─────────────────────────────────────────────────────────────
function goHome(){
  unsubscribeAll();
  showPage('home');
  history.replaceState(null,'',window.location.pathname);
}

function goOnline(){
  if(!fbOk){ toast('⚠️ Firebase non configuré — suis le guide de déploiement !'); return; }
  openModal('hostNameModal');
  setTimeout(()=>el('hostName').focus(),200);
}

function goLocal(){
  mode='local'; isHost=true; players=[]; scores={};
  el('setupTitle').textContent='Jouer maintenant';
  el('setupBadge').textContent='👥 LOCAL';
  el('setupBadge').style.background='var(--neon5)';
  el('onlineSection').style.display='none';
  el('localSection').style.display='block';
  renderPList();
  showPage('setup');
}

// ── HOST CREATE ROOM ───────────────────────────────────────────────────────
function confirmHost(){
  const name = el('hostName').value.trim();
  if(!name){ toast('Entre ton prénom !'); return; }
  closeModal('hostNameModal');
  myName = name;
  isHost = true;
  mode = 'online';
  roomCode = rndCode();
  players = [name];
  scores = {};
  scores[name] = 0;

  el('setupTitle').textContent='Créer une partie';
  el('setupBadge').textContent='🌐 EN LIGNE';
  el('setupBadge').style.background='var(--neon4)';
  el('onlineSection').style.display='block';
  el('localSection').style.display='none';
  el('setupRoomCode').textContent=roomCode;
  const link = buildLink(roomCode);
  el('setupLink').value = link;
  showPage('setup');

  // Write room to Firebase
  roomRef = db.ref('rooms/' + roomCode);
  roomRef.set({
    host: name,
    status: 'setup',
    players: { [name]: { name, score:0, color: COLORS[0] } },
    game: null,
  });

  // Listen for new players
  roomRef.child('players').on('value', snap=>{
    const data = snap.val()||{};
    players = Object.values(data).map(p=>p.name);
    scores = {};
    Object.values(data).forEach(p=>{ scores[p.name]=p.score||0; });
    renderSetupOnlinePlayers(data);
  });

  // Listen for game start (redirect guest)
  roomRef.child('status').on('value', snap=>{
    if(snap.val()==='playing' && !isHost) enterArenaFromFirebase();
  });
}

function buildLink(code){
  return window.location.origin + window.location.pathname + '?room=' + code;
}

function copySetupLink(){ copyText(el('setupLink').value); }
function copyLobbyLink(){ copyText(el('lobbyLink').value); }
function copyText(txt){
  navigator.clipboard.writeText(txt).catch(()=>{});
  toast('📋 Lien copié !');
}

function renderSetupOnlinePlayers(data){
  const box = el('setupOnlinePlayers');
  const chips = Object.values(data).map((p,i)=>`
    <div class="ochip"><div class="odot"></div>${p.name}${p.name===myName?' (moi)':''}</div>`).join('');
  box.innerHTML = chips || '<span style="color:var(--muted);font-size:.82rem">En attente…</span>';
}

// ── JOIN ROOM ──────────────────────────────────────────────────────────────
function detectJoin(){
  const params = new URLSearchParams(window.location.search);
  const code = params.get('room');
  if(code){
    roomCode = code;
    el('joinCode').textContent = code;
    openModal('joinModal');
    setTimeout(()=>el('joinName').focus(),200);
  }
}

function confirmJoin(){
  const name = el('joinName').value.trim();
  if(!name){ toast('Entre ton prénom !'); return; }
  closeModal('joinModal');
  myName = name;
  isHost = false;
  mode = 'online';

  roomRef = db.ref('rooms/'+roomCode);
  const color = COLORS[Math.floor(Math.random()*COLORS.length)];
  roomRef.child('players/'+name).set({ name, score:0, color });

  // Go to lobby
  el('lobbyCode').textContent = roomCode;
  el('lobbyLink').value = buildLink(roomCode);
  showPage('lobby');

  // Listen players in lobby
  roomRef.child('players').on('value', snap=>{
    const data = snap.val()||{};
    players = Object.values(data).map(p=>p.name);
    renderLobbyPlayers(data);
  });

  // Listen for game start
  roomRef.child('status').on('value', snap=>{
    if(snap.val()==='playing') enterArenaFromFirebase();
  });

  toast('✓ Tu as rejoint la salle '+roomCode+' !');
}

function renderLobbyPlayers(data){
  const box = el('lobbyPlayers');
  box.innerHTML = Object.values(data).map((p,i)=>`
    <div class="lp-card">
      <div class="lp-av" style="background:${p.color||COLORS[i]}33;color:${p.color||COLORS[i]}">${p.name[0].toUpperCase()}</div>
      <div class="lp-name">${p.name}</div>
      ${p.name===Object.values(data)[0]?.name?'<div class="lp-host">👑 Hôte</div>':''}
    </div>`).join('');
}

// ── SETUP SELECTORS ────────────────────────────────────────────────────────
function selLv(el2){ document.querySelectorAll('.lcard').forEach(c=>c.classList.remove('sel')); el2.classList.add('sel'); selLevel=el2.dataset.lv; }
function selGm(el2){ document.querySelectorAll('.gcard').forEach(c=>c.classList.remove('sel')); el2.classList.add('sel'); selGame=el2.dataset.gm; }
function selMd(el2){ document.querySelectorAll('.mbtn').forEach(b=>b.classList.remove('sel')); el2.classList.add('sel'); selMode=el2.dataset.md; }

// ── PLAYERS (LOCAL) ────────────────────────────────────────────────────────
function addPlayer(){
  const inp=el('pInput'), name=inp.value.trim();
  if(!name) return;
  if(players.includes(name)){ toast('Joueur déjà ajouté !'); return; }
  if(players.length>=10){ toast('Max 10 joueurs !'); return; }
  players.push(name); scores[name]=0; inp.value='';
  renderPList(); toast('✓ '+name+' ajouté !');
}
el('pInput').addEventListener('keydown',e=>{ if(e.key==='Enter') addPlayer(); });

function removePlayer(name){ players=players.filter(p=>p!==name); delete scores[name]; renderPList(); }

function renderPList(){
  const box=el('pList');
  if(!players.length){ box.innerHTML='<span style="color:var(--muted);font-size:.85rem">Ajoute des joueurs…</span>'; return; }
  box.innerHTML=players.map((p,i)=>`
    <div class="pchip" style="border-color:${COLORS[i%COLORS.length]}44">
      <div class="pav" style="background:${COLORS[i%COLORS.length]}25;color:${COLORS[i%COLORS.length]}">${p[0].toUpperCase()}</div>
      <span>${p}</span>
      <span class="prm" onclick="removePlayer('${p.replace(/'/g,"\\'")}')" >✕</span>
    </div>`).join('');
}

// ── LAUNCH GAME ────────────────────────────────────────────────────────────
function launchGame(){
  if(players.length<2){ toast('⚠️ Ajoute au moins 2 joueurs !'); return; }
  const cards = Q[selGame][selLevel] || Q[selGame].pote || [];
  localCards = shuffle(cards);
  localCardIdx = 0; localPlayerIdx = 0;

  if(mode==='online' && isHost){
    // Push game config to Firebase and open arena for everyone
    roomRef.update({
      status:'playing',
      game: { name:selGame, level:selLevel, qMode:selMode },
      state: { cardIdx:0, playerIdx:0, card: localCards[0] || null, scores: {} }
    });
    // Host listens to state to stay in sync
    listenGameState();
  }

  initArenaUI();
  showPage('arena');
  if(selGame==='spin') renderSpin();
  else { currentQM = selMode==='manual'?'manual':'auto'; renderCard(); }
  renderArenaActions();
}

// ── HOST TRIGGERS NEXT CARD ────────────────────────────────────────────────
function nextCard(){
  localCardIdx++;
  localPlayerIdx++;
  if(localCardIdx >= localCards.length){ localCards = shuffle(localCards); localCardIdx=0; }
  const card = localCards[localCardIdx];
  if(mode==='online' && isHost){
    roomRef.child('state').update({ cardIdx:localCardIdx, playerIdx:localPlayerIdx, card });
  }
  renderCard();
  updateScoreHighlight();
  if(currentQM==='manual') showManualMode();
}

function hostStartGame(){ launchGame(); }

// ── FIREBASE SYNC (guests) ─────────────────────────────────────────────────
function enterArenaFromFirebase(){
  roomRef.child('game').once('value', snap=>{
    const cfg = snap.val();
    if(!cfg) return;
    selGame=cfg.name; selLevel=cfg.level; selMode=cfg.qMode;
    const cards = Q[selGame][selLevel] || Q[selGame].pote || [];
    localCards = shuffle(cards);
    initArenaUI();
    showPage('arena');
    listenGameState();
    renderArenaActions();
  });
}

function listenGameState(){
  if(unsubscribeRoom) unsubscribeRoom();
  const ref = roomRef.child('state');
  const handler = ref.on('value', snap=>{
    const s = snap.val();
    if(!s) return;
    gameState = s;
    // Sync scores
    if(s.scores){ Object.assign(scores, s.scores); renderScores(); }
    // Sync card for guests
    if(!isHost && s.card){
      localPlayerIdx = s.playerIdx||0;
      renderCardFromData(s.card, players[localPlayerIdx%players.length]);
      updateScoreHighlight();
    }
  });
  unsubscribeRoom = ()=> ref.off('value', handler);
}

function unsubscribeAll(){
  if(unsubscribeRoom){ unsubscribeRoom(); unsubscribeRoom=null; }
  if(roomRef) roomRef.off();
  if(roomCode && db) db.ref('rooms/'+roomCode).child('players/'+myName).remove().catch(()=>{});
}

// ── ARENA UI ───────────────────────────────────────────────────────────────
function initArenaUI(){
  const lm = LEVEL_META[selLevel];
  el('aTitle').textContent = GAME_NAMES[selGame];
  const lb = el('aLvBadge');
  lb.textContent=lm.label; lb.style.background=lm.color; lb.style.color=lm.textColor;
  lb.style.padding='5px 14px'; lb.style.borderRadius='50px'; lb.style.fontSize='.72rem'; lb.style.fontWeight='800';
  renderScores();
  el('qmWrap').style.display = selMode==='mixed'?'block':'none';
  el('qaBtn').classList.toggle('on', currentQM==='auto');
  el('qmBtn').classList.toggle('on', currentQM==='manual');
}

function renderScores(){
  const bar = el('scores');
  bar.innerHTML = players.map((p,i)=>`
    <div class="schip ${p===myName?'me':''}" id="sc${i}">
      <div class="sc-name">${p}</div>
      <div class="sc-pts" id="pts${i}">${scores[p]||0}</div>
    </div>`).join('');
}

function updateScoreHighlight(){
  const cur = players[localPlayerIdx%players.length];
  document.querySelectorAll('.schip').forEach((c,i)=>{
    c.classList.toggle('active', players[i]===cur);
  });
}

function addPoint(i){
  const name=players[i];
  scores[name]=(scores[name]||0)+1;
  el('pts'+i).textContent=scores[name];
  if(mode==='online' && isHost) roomRef.child('state/scores').update(scores);
  toast('🏆 +1 point pour '+name+' !');
}

// ── CARDS ──────────────────────────────────────────────────────────────────
function renderCard(){
  if(!localCards.length) return;
  const card = localCards[localCardIdx%localCards.length];
  const player = players[localPlayerIdx%players.length];
  renderCardFromData(card, player);
  updateScoreHighlight();
}

function renderCardFromData(card, player){
  el('autoWrap').style.display='block';
  el('manualWrap').style.display='none';
  el('waitingWrap').style.display='none';
  el('cturn').textContent='👤 '+player;
  const ci = players.indexOf(player);
  el('cturn').style.background = COLORS[(ci>=0?ci:0)%COLORS.length]+'25';
  el('cturn').style.color = COLORS[(ci>=0?ci:0)%COLORS.length];
  el('cemoji').textContent=card.e;
  el('cemoji').style.animation='none';
  void el('cemoji').offsetWidth;
  el('cemoji').style.animation='bounce .4s cubic-bezier(.36,.07,.19,.97)';
  el('ctype').textContent=TYPE_MAP[card.t]||card.t;
  el('ctype').className='ctype '+(TYPE_CSS[card.t]||'type-defi');
  el('ctext').textContent=card.q;
  el('spinRes').style.display='none';
}

function switchQM(m){
  currentQM=m;
  el('qaBtn').classList.toggle('on',m==='auto');
  el('qmBtn').classList.toggle('on',m==='manual');
  el('autoWrap').style.display=m==='auto'?'block':'none';
  el('manualWrap').style.display=m==='manual'?'block':'none';
  el('waitingWrap').style.display='none';
  if(m==='manual') showManualMode();
  else renderCard();
  renderArenaActions();
}

function showManualMode(){
  const asker=players[localPlayerIdx%players.length];
  const target=players[(localPlayerIdx+1)%players.length];
  el('mAsker').textContent=asker;
  el('mTarget').textContent=target;
  el('mTxt').value='';
  el('manualDisplay').style.display='none';
}

function submitManual(){
  const txt=el('mTxt').value.trim();
  if(!txt){ toast('Écris une question !'); return; }
  el('manualCardTxt').textContent=txt;
  el('manualDisplay').style.display='flex';
  renderArenaActions(true);
}

function renderArenaActions(afterManual=false){
  const acts=el('acts');
  if(selGame==='spin'){
    acts.innerHTML=`<button class="btn btn-spin" onclick="doSpin()">🎡 Tourner !</button>`;
    return;
  }
  const pts = players.map((p,i)=>`<button class="btn btn-point" onclick="addPoint(${i})">+1 ${p}</button>`).join('');
  // Online guests: no next button (host controls)
  const canNext = mode==='local' || isHost;
  if(currentQM==='manual' && !afterManual){
    acts.innerHTML='';
  } else {
    acts.innerHTML=(canNext?`<button class="btn btn-next" onclick="nextCard()">Carte suivante →</button>`:'')+ pts;
  }
}

// ── SPIN ───────────────────────────────────────────────────────────────────
function renderSpin(){
  el('autoWrap').style.display='block';
  el('manualWrap').style.display='none';
  el('cturn').textContent='🎡 Roue du Destin';
  el('cemoji').textContent='🎡';
  el('ctype').textContent='';
  el('ctext').textContent='Appuie sur le bouton pour désigner un joueur !';
  el('spinRes').style.display='none';
}

function doSpin(){
  const chosen=players[Math.floor(Math.random()*players.length)];
  el('ctext').textContent='...'; el('cemoji').textContent='🎡';
  el('spinRes').style.display='none';
  let spins=0;
  const iv=setInterval(()=>{
    el('ctext').textContent=players[Math.floor(Math.random()*players.length)];
    spins++;
    if(spins>22){
      clearInterval(iv);
      el('ctext').textContent='';
      el('spinRes').style.display='block';
      el('spinRes').textContent=chosen+' 🎯';
      el('cemoji').textContent='🎯';
      el('cturn').textContent='Désigné(e) !';
      toast('🎯 '+chosen+' a été choisi(e) !');
      el('acts').innerHTML=`<button class="btn btn-spin" onclick="doSpin()">🎡 Retourner</button>`;
    }
  },80);
}

// ── QUIT ───────────────────────────────────────────────────────────────────
function doQuit(){
  closeModal('quitModal');
  unsubscribeAll();
  showPage('home');
}



// ── INIT ───────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', ()=>{
  detectJoin();
  renderPList();
});
