/* =========================================================
   LevaLeva – felles funksjoner for alle sider
   Ikoner, header/meny, innlogging (ID-porten-placeholder),
   formatering, værmelding, modalvindu og toast-meldinger.
   ========================================================= */
(function () {
  'use strict';
  const { BILDER, LEDERE, EKSTRA, NIVA } = window.LevaData;

  /* ---------- Ikoner (SVG-sprite, Lucide-stil) ---------- */
  const IKONER = {
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    timer: '<path d="M10 2h4M12 14l3-3"/><circle cx="12" cy="14" r="8"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    'chev-l': '<path d="m15 18-6-6 6-6"/>',
    'chev-r': '<path d="m9 18 6-6-6-6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    wheelchair: '<circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1M5 8l3-3 5.5 3-2.36 3.5M4.24 14.5a5 5 0 0 0 6.88 6M13.76 17.5a5 5 0 0 0-6.88-6"/>',
    apple: '<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/>',
    paw: '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>',
    coffee: '<path d="M10 2v2M14 2v2M6 2v2M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>',
    stroller: '<circle cx="8" cy="20" r="2"/><circle cx="17" cy="20" r="2"/><path d="M2 5h2.5l2.2 10H19M13 4v8h8a8 8 0 0 0-8-8Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    'cloud-sun': '<path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/>',
    cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    rain: '<path d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24"/><path d="M16 14v6M8 14v6M12 16v6"/>',
    snow: '<path d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24"/><path d="M8 15h.01M8 19h.01M12 17h.01M12 21h.01M16 15h.01M16 19h.01"/>',
    fog: '<path d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24"/><path d="M16 17H7M17 21H9"/>',
    storm: '<path d="M6 16.33A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.97"/><path d="m13 12-3 5h4l-3 5"/>',
    wind: '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/>',
    drop: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    'arrow-r': '<path d="M5 12h14M12 5l7 7-7 7"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
    trees: '<path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6M13 19v3M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
    login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5M15 12H3"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    trash: '<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    stethoscope: '<path d="M11 2v2M5 2v2M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle cx="20" cy="10" r="2"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    ticket: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 17v2M13 11v2"/>',
    today: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><circle cx="12" cy="16" r="2"/>'
  };
  const sprite = document.createElement('div');
  sprite.style.display = 'none';
  sprite.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' +
    Object.entries(IKONER).map(([n, p]) => `<symbol id="i-${n}" viewBox="0 0 24 24">${p}</symbol>`).join('') + '</svg>';
  document.body.prepend(sprite);

  const ikon = (navn, kl = '') => `<svg class="icon ${kl}" aria-hidden="true"><use href="#i-${navn}"/></svg>`;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Formatering ---------- */
  const DAGER = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
  const MND = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
  const p2 = n => String(n).padStart(2, '0');
  const fmt = {
    tid: d => p2(d.getHours()) + ':' + p2(d.getMinutes()),
    dag: d => DAGER[d.getDay()],
    dagKort: d => DAGER[d.getDay()].slice(0, 3),
    mnd: d => MND[d.getMonth()],
    mndKort: d => MND[d.getMonth()].slice(0, 3),
    lang: d => { const s = DAGER[d.getDay()] + ' ' + d.getDate() + '. ' + MND[d.getMonth()]; return s[0].toUpperCase() + s.slice(1); },
    kort: d => DAGER[d.getDay()].slice(0, 3) + '. ' + d.getDate() + '. ' + MND[d.getMonth()].slice(0, 3) + '.',
    varighet: min => {
      const t = Math.floor(min / 60), m = min % 60;
      if (!t) return m + ' min';
      if (!m) return t === 1 ? '1 time' : t + ' timer';
      return t + ' t ' + m + ' min';
    },
    slutt: (d, min) => new Date(d.getTime() + min * 60000),
    uke: d => { // ISO 8601-ukenummer
      const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      const dn = x.getUTCDay() || 7;
      x.setUTCDate(x.getUTCDate() + 4 - dn);
      const y0 = new Date(Date.UTC(x.getUTCFullYear(), 0, 1));
      return Math.ceil(((x - y0) / 86400000 + 1) / 7);
    },
    sammeDag: (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(),
    dagerTil: d => {
      const a = new Date(); a.setHours(0, 0, 0, 0);
      const b = new Date(d); b.setHours(0, 0, 0, 0);
      return Math.round((b - a) / 86400000);
    },
    relativ: d => {
      const n = fmt.dagerTil(d);
      if (n === 0) return 'I dag';
      if (n === 1) return 'I morgen';
      if (n > 1 && n < 7) return 'Om ' + n + ' dager';
      return fmt.kort(d);
    }
  };

  /* ---------- Tur-status ---------- */
  function status(tur) {
    const ledige = Math.max(0, tur.maks - tur.pameldte);
    const forbi = tur.start < new Date();
    const avlyst = !!(tur.endring && tur.endring.type === 'avlyst');
    let niva = 'ok';
    if (ledige === 0) niva = 'full';
    else if (ledige <= 3) niva = 'few';
    return { ledige, forbi, avlyst, niva };
  }
  function plasserHtml(tur) {
    const s = status(tur);
    const pst = Math.round((tur.pameldte / tur.maks) * 100);
    const tekst = s.ledige === 0 ? 'Fullt' : (s.ledige === 1 ? '1 ledig plass' : s.ledige + ' ledige plasser');
    return `<div class="seats seats--${s.niva}">
      <div class="seats__row"><span>${tekst}</span><span>${tur.pameldte} av ${tur.maks} påmeldt</span></div>
      <div class="seats__bar" role="progressbar" aria-valuemin="0" aria-valuemax="${tur.maks}" aria-valuenow="${tur.pameldte}" aria-label="Påmeldte"><i style="width:${pst}%"></i></div>
    </div>`;
  }
  const initialer = navn => navn.split(/\s+/).map(x => x[0]).join('').slice(0, 2).toUpperCase();
  const bilde = key => BILDER[key] || BILDER.ekne;

  /* ---------- Toast ---------- */
  let toastWrap;
  function toast(tekst, ikonNavn = 'check') {
    if (!toastWrap) { toastWrap = document.createElement('div'); toastWrap.className = 'toast-wrap'; toastWrap.setAttribute('aria-live', 'polite'); document.body.appendChild(toastWrap); }
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = ikon(ikonNavn) + '<span>' + esc(tekst) + '</span>';
    toastWrap.appendChild(el);
    setTimeout(() => { el.classList.add('is-leaving'); setTimeout(() => el.remove(), 300); }, 3600);
  }

  /* ---------- Innlogging (ID-porten – kun placeholder) ---------- */
  const K_BRUKER = 'levaleva.bruker';
  const Auth = {
    bruker() {
      try { const v = sessionStorage.getItem(K_BRUKER); return v ? JSON.parse(v) : null; } catch (e) { return null; }
    },
    // TODO back-end: videresend til ID-porten (OIDC) og hent bruker fra /api/meg
    loggInn() {
      return new Promise(resolve => {
        const ov = document.createElement('div');
        ov.className = 'idp-overlay';
        ov.innerHTML = `<div class="idp-box" role="alertdialog" aria-live="assertive">
          <div class="spinner"></div><h3>Sender deg til ID-porten …</h3>
          <p>Dette er en demo. I den ferdige løsningen logger du inn med BankID, MinID eller Buypass.</p></div>`;
        document.body.appendChild(ov);
        setTimeout(() => {
          const b = { navn: 'Kari Nordmann', fornavn: 'Kari' };
          try { sessionStorage.setItem(K_BRUKER, JSON.stringify(b)); } catch (e) { /* ignorer */ }
          ov.remove();
          renderAuth();
          document.dispatchEvent(new CustomEvent('leva:auth'));
          toast('Du er logget inn som ' + b.navn);
          resolve(b);
        }, 1300);
      });
    },
    loggUt() {
      try { sessionStorage.removeItem(K_BRUKER); } catch (e) { /* ignorer */ }
      renderAuth();
      document.dispatchEvent(new CustomEvent('leva:auth'));
      toast('Du er logget ut', 'logout');
    }
  };

  function renderAuth() {
    const slot = document.getElementById('auth-slot');
    if (!slot) return;
    const b = Auth.bruker();
    if (!b) {
      slot.innerHTML = `<button class="btn btn--sm idporten-btn" type="button" data-login>${ikon('lock')}<span><span class="label-long">Logg inn med </span>ID-porten</span></button>`;
      slot.querySelector('[data-login]').addEventListener('click', () => Auth.loggInn());
      return;
    }
    slot.innerHTML = `<div class="user-menu">
      <button class="user-chip" type="button" aria-haspopup="true" aria-expanded="false"><span class="avatar">${initialer(b.navn)}</span><span class="label-long">${esc(b.fornavn)}</span></button>
      <div class="user-menu__pop" role="menu">
        <p>Innlogget som <strong>${esc(b.navn)}</strong> via ID-porten (demo)</p>
        <a href="pamelding.html#mine" role="menuitem">${ikon('ticket')} Mine påmeldinger</a>
        <button type="button" role="menuitem" data-logout>${ikon('logout')} Logg ut</button>
      </div></div>`;
    const menu = slot.querySelector('.user-menu');
    const knapp = menu.querySelector('.user-chip');
    knapp.addEventListener('click', (e) => {
      e.stopPropagation();
      const apen = menu.classList.toggle('open');
      knapp.setAttribute('aria-expanded', apen);
    });
    menu.querySelector('[data-logout]').addEventListener('click', () => Auth.loggUt());
  }
  document.addEventListener('click', () => {
    document.querySelectorAll('.user-menu.open').forEach(m => m.classList.remove('open'));
  });

  /* ---------- Værmelding (Open-Meteo, gratis og uten nøkkel) ---------- */
  const LEVANGER = { lat: 63.746, lon: 11.299 };
  let vaerPromise = null;
  function hentVaerdata() {
    if (!vaerPromise) {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${LEVANGER.lat}&longitude=${LEVANGER.lon}` +
        '&hourly=temperature_2m,precipitation,weather_code,wind_speed_10m&wind_speed_unit=ms&timezone=Europe%2FOslo&forecast_days=7';
      vaerPromise = fetch(url).then(r => { if (!r.ok) throw new Error('Vær'); return r.json(); })
        .catch(e => { vaerPromise = null; throw e; });
    }
    return vaerPromise;
  }
  function vaerKode(k) {
    if (k === 0) return { tekst: 'Klarvær', ikon: 'sun', sol: true };
    if (k <= 2) return { tekst: 'Lettskyet', ikon: 'cloud-sun', sol: true };
    if (k === 3) return { tekst: 'Skyet', ikon: 'cloud' };
    if (k === 45 || k === 48) return { tekst: 'Tåke', ikon: 'fog' };
    if (k >= 51 && k <= 57) return { tekst: 'Yr', ikon: 'rain' };
    if (k >= 61 && k <= 67) return { tekst: 'Regn', ikon: 'rain' };
    if (k >= 71 && k <= 77) return { tekst: 'Snø', ikon: 'snow' };
    if (k >= 80 && k <= 82) return { tekst: 'Regnbyger', ikon: 'rain' };
    if (k === 85 || k === 86) return { tekst: 'Snøbyger', ikon: 'snow' };
    if (k >= 95) return { tekst: 'Torden', ikon: 'storm' };
    return { tekst: 'Skyet', ikon: 'cloud' };
  }
  const Vaer = {
    VIS_DAGER: 4,
    erInnenfor(d) { const n = fmt.dagerTil(d); return n >= 0 && n <= this.VIS_DAGER && d > new Date(Date.now() - 3600000); },
    async forTur(tur) {
      const data = await hentVaerdata();
      const h = data.hourly;
      const nokkel = window.LevaData.isoDato(tur.start) + 'T' + p2(tur.start.getHours()) + ':00';
      const i = h.time.indexOf(nokkel);
      if (i < 0) return null;
      const timer = Math.max(1, Math.ceil(tur.varighet / 60));
      let nedbor = 0, vind = 0;
      for (let j = i; j < Math.min(h.time.length, i + timer); j++) {
        nedbor += h.precipitation[j] || 0;
        vind = Math.max(vind, h.wind_speed_10m[j] || 0);
      }
      const temp = Math.round(h.temperature_2m[i]);
      const k = vaerKode(h.weather_code[i]);
      let tips = '';
      if (k.ikon === 'snow' || (temp <= 0 && nedbor > 0)) tips = 'Det kan være glatt – brodder anbefales.';
      else if (nedbor >= 1) tips = 'Ta med regntøy og ekstra sokker.';
      else if (temp <= 0) tips = 'Minusgrader – kle deg godt, gjerne i lag.';
      else if (vind >= 8) tips = 'Det blåser friskt – ta med vindtett jakke.';
      else if (k.sol) tips = 'Fint turvær! Husk drikke.';
      return { temp, nedbor: Math.round(nedbor * 10) / 10, vind: Math.round(vind), tekst: k.tekst, ikon: k.ikon, sol: !!k.sol, tips };
    }
  };

  /* ---------- Modalvindu ---------- */
  let dialog, aktivTur = null, aktivOpts = {};
  function lagDialog() {
    dialog = document.createElement('dialog');
    dialog.className = 'modal';
    dialog.setAttribute('aria-labelledby', 'modal-tittel');
    document.body.appendChild(dialog);
    // Klikk på bakgrunnen lukker
    dialog.addEventListener('click', (e) => { if (e.target === dialog) lukk(); });
    dialog.addEventListener('close', () => { document.body.style.overflow = ''; aktivTur = null; });
  }
  function lukk() { if (dialog && dialog.open) dialog.close(); }

  function modalHtml(tur, opts) {
    const s = status(tur);
    const b = bilde(tur.bilde);
    const leder = LEDERE[tur.leder] || { navn: String(tur.leder || 'Turleder'), rolle: 'Turleder', farge: '' };
    const slutt = fmt.slutt(tur.start, tur.varighet);
    const gammel = tur.endring && tur.endring.gammelTid ? ` <s>kl. ${esc(tur.endring.gammelTid)}</s>` : '';
    const niva = NIVA[tur.niva] || NIVA.lett;
    const ekstra = (tur.ekstra || []).filter(k => EKSTRA[k]);

    let badges = `<span class="badge badge--glass"><span class="dot dot--${tur.niva}"></span>${niva.tekst}</span>`;
    if (ekstra.includes('rullestol')) badges += `<span class="badge badge--glass">${ikon('wheelchair')}Tilrettelagt</span>`;
    if (opts.forhandsvisning) badges += `<span class="badge badge--glass">${ikon('eye')}Forhåndsvisning</span>`;

    let endring = '';
    if (tur.endring) {
      const avl = tur.endring.type === 'avlyst';
      endring = `<div class="notice ${avl ? '' : 'notice--info'} modal__change">${ikon(avl ? 'alert' : 'info')}<p><strong>${avl ? 'Turen er avlyst.' : 'Endring:'}</strong> ${esc(tur.endring.tekst)}</p></div>`;
    }

    const ekstraHtml = ekstra.length || tur.ekstraTekst ? `<div class="box"><h4>Ekstra info</h4><ul class="extras">
        ${ekstra.map(k => `<li>${ikon(EKSTRA[k].ikon)}${EKSTRA[k].tekst}</li>`).join('')}
        ${tur.ekstraTekst ? `<li>${ikon('info')}${esc(tur.ekstraTekst)}</li>` : ''}
      </ul></div>` : '';

    return `
      <div class="modal__hero">
        <img src="${b.src}" alt="">
        <button class="modal__close" type="button" data-close aria-label="Lukk">${ikon('x')}</button>
        <div class="modal__badges">${badges}</div>
        <h2 id="modal-tittel">${esc(tur.navn)}</h2>
      </div>
      <div class="modal__body">
        ${endring}
        ${tur.beskrivelse ? `<p class="modal__desc">${esc(tur.beskrivelse)}</p>` : ''}
        <div class="modal__cols">
          <ul class="facts">
            <li><span class="facts__icon">${ikon('calendar')}</span><div><small>Dato og klokkeslett</small><strong>${fmt.lang(tur.start)}<br>kl. ${fmt.tid(tur.start)}–${fmt.tid(slutt)}${gammel}</strong></div></li>
            <li><span class="facts__icon">${ikon('timer')}</span><div><small>Varighet</small><strong>Ca. ${fmt.varighet(tur.varighet)}</strong></div></li>
            <li><span class="facts__icon">${ikon('pin')}</span><div><small>Turen starter</small><strong>${esc(tur.oppmote)}</strong></div></li>
            <li><span class="facts__icon">${ikon('route')}</span><div><small>Rute og mål</small><strong>${esc(tur.rute)}</strong></div></li>
            <li><span class="facts__icon">${ikon('user')}</span><div><small>Turleder</small>
              <div class="leader"><span class="avatar ${leder.farge}">${initialer(leder.navn)}</span><strong>${esc(leder.navn)}<small>${esc(leder.rolle)}</small></strong></div></div></li>
            <li><span class="facts__icon">${ikon('users')}</span><div><small>Plasser</small>${plasserHtml(tur)}</div></li>
          </ul>
          <div class="side-stack">
            <div class="box" data-weather><h4>Værmelding <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a></h4><div class="weather"></div></div>
            ${ekstraHtml}
          </div>
        </div>
      </div>
      <div class="modal__foot">
        <p class="privacy">${ikon('shield')}<span>Av hensyn til personvern viser vi bare antall påmeldte – aldri hvem.</span></p>
        <div class="modal__actions" data-actions></div>
      </div>`;
  }

  function renderHandlinger() {
    const tur = aktivTur, opts = aktivOpts;
    const el = dialog.querySelector('[data-actions]');
    const s = status(tur);
    const lukkBtn = `<button class="btn btn--ghost" type="button" data-close>Lukk</button>`;
    if (opts.forhandsvisning) { el.innerHTML = lukkBtn; return; }
    if (s.avlyst) { el.innerHTML = lukkBtn + `<button class="btn" disabled>Turen er avlyst</button>`; return; }
    if (s.forbi) { el.innerHTML = lukkBtn + `<button class="btn" disabled>Turen er gjennomført</button>`; return; }
    if (tur.erPameldt) {
      el.innerHTML = `<div class="success-burst"><span class="tick">${ikon('check')}</span><strong>Du er påmeldt!</strong></div>
        <button class="btn btn--danger" type="button" data-meldav>Meld meg av</button>`;
      return;
    }
    if (s.ledige === 0) { el.innerHTML = lukkBtn + `<button class="btn" disabled>Turen er full</button>`; return; }
    if (!Auth.bruker()) {
      el.innerHTML = lukkBtn + `<button class="btn idporten-btn" type="button" data-login>${ikon('lock')}Logg inn for å melde deg på</button>`;
      return;
    }
    el.innerHTML = lukkBtn + `<button class="btn btn--green" type="button" data-meldpa>${ikon('check')}Meld meg på</button>`;
  }

  async function oppdaterAktiv() {
    if (!aktivTur || aktivOpts.forhandsvisning) return;
    const ny = await window.LevaApi.hentTur(aktivTur.id);
    if (!ny) return;
    aktivTur = ny;
    const facts = dialog.querySelector('.facts li:last-child div');
    if (facts) facts.innerHTML = '<small>Plasser</small>' + plasserHtml(ny);
    renderHandlinger();
  }

  async function fyllVaer(tur) {
    const box = dialog.querySelector('[data-weather] .weather');
    if (!box) return;
    if (!Vaer.erInnenfor(tur.start)) {
      const tekst = tur.start < new Date()
        ? 'Turen er allerede gjennomført.'
        : 'Værmeldingen vises her når det er fire dager eller mindre til turen.';
      box.innerHTML = `<p class="weather__muted">${ikon('cloud-sun')}<span>${tekst}</span></p>`;
      return;
    }
    box.innerHTML = '<div class="skeleton" style="width:70%"></div><div class="skeleton" style="width:45%"></div>';
    try {
      const v = await Vaer.forTur(tur);
      if (aktivTur !== tur && (!aktivTur || aktivTur.id !== tur.id)) return;
      if (!v) throw new Error('mangler');
      box.innerHTML = `
        <div class="weather__main">
          <span class="weather__icon ${v.sol ? 'weather__icon--sun' : ''}">${ikon(v.ikon)}</span>
          <div><div class="weather__temp">${v.temp}°</div><div class="weather__desc">${v.tekst} kl. ${fmt.tid(tur.start)}</div></div>
        </div>
        <div class="weather__row"><span>${ikon('drop')}${String(v.nedbor).replace('.', ',')} mm</span><span>${ikon('wind')}${v.vind} m/s</span></div>
        ${v.tips ? `<div class="weather__tip">${esc(v.tips)}</div>` : ''}`;
    } catch (e) {
      box.innerHTML = `<p class="weather__muted">${ikon('cloud')}<span>Klarte ikke å hente værmeldingen akkurat nå. Prøv igjen senere.</span></p>`;
    }
  }

  const Modal = {
    async apne(turEllerId, opts = {}) {
      if (!dialog) lagDialog();
      const tur = typeof turEllerId === 'string' ? await window.LevaApi.hentTur(turEllerId) : turEllerId;
      if (!tur) return;
      aktivTur = tur; aktivOpts = opts;
      dialog.innerHTML = modalHtml(tur, opts);
      renderHandlinger();
      if (!dialog.open) { dialog.showModal(); document.body.style.overflow = 'hidden'; }
      dialog.querySelector('.modal__body').scrollTop = 0;
      fyllVaer(tur);
    },
    lukk
  };

  // Delegerte klikk i modalen
  document.addEventListener('click', async (e) => {
    if (!dialog || !dialog.contains(e.target)) return;
    const t = e.target.closest('button');
    if (!t) return;
    if (t.hasAttribute('data-close')) { lukk(); return; }
    if (t.hasAttribute('data-login')) { await Auth.loggInn(); renderHandlinger(); return; }
    if (t.hasAttribute('data-meldpa')) {
      t.disabled = true; t.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:3px;margin:0"></span>Melder på …';
      try {
        await window.LevaApi.meldPa(aktivTur.id);
        await oppdaterAktiv();
        toast('Du er påmeldt «' + aktivTur.navn + '»');
        document.dispatchEvent(new CustomEvent('leva:endret'));
      } catch (err) { toast(err.message, 'alert'); renderHandlinger(); }
      return;
    }
    if (t.hasAttribute('data-meldav')) {
      t.disabled = true; t.textContent = 'Melder av …';
      await window.LevaApi.meldAv(aktivTur.id);
      await oppdaterAktiv();
      toast('Du er meldt av turen', 'info');
      document.dispatchEvent(new CustomEvent('leva:endret'));
    }
  });
  document.addEventListener('leva:auth', () => { if (dialog && dialog.open) renderHandlinger(); });

  /* ---------- Header: aktiv lenke og mobilmeny ---------- */
  function initHeader() {
    const side = document.body.dataset.page;
    document.querySelectorAll('.main-nav a').forEach(a => {
      if (a.dataset.nav === side) a.setAttribute('aria-current', 'page');
    });
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('main-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        const apen = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', apen);
        toggle.innerHTML = ikon(apen ? 'x' : 'menu');
      });
    }
    renderAuth();
  }

  /* ---------- Footer: bildekreditering ---------- */
  function initFooter() {
    const ul = document.getElementById('credits-list');
    if (ul) {
      ul.innerHTML = Object.values(BILDER).map(b =>
        `<li>${esc(b.navn)}: <a href="${b.side}" target="_blank" rel="noopener">${esc(b.kreditt)}</a>, ${esc(b.lisens)}</li>`).join('');
    }
    const aar = document.getElementById('aar');
    if (aar) aar.textContent = new Date().getFullYear();
  }

  /* ---------- Animasjon ved scrolling ---------- */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-visible')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(e => io.observe(e));
  }

  initHeader();
  initFooter();
  initReveal();

  window.LevaUI = { ikon, esc, fmt, status, plasserHtml, initialer, bilde, toast, Modal, Auth, Vaer };
})();
