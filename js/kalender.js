/* =========================================================
   LevaLeva – turkalender (ukeplan med to uker)
   ========================================================= */
(function () {
  'use strict';
  const { mandag, UKER_BAKOVER, UKER_FREMOVER, NIVA } = window.LevaData;
  const { ikon, esc, fmt, status, Modal, Auth } = window.LevaUI;
  const Api = window.LevaApi;

  const DAG_MS = 86400000;
  const denneUka = mandag(new Date());
  const MIN = new Date(denneUka.getTime() - UKER_BAKOVER * 7 * DAG_MS);
  const MAX = new Date(denneUka.getTime() + UKER_FREMOVER * 7 * DAG_MS);

  const state = { ukeStart: new Date(denneUka), niva: new Set(), rullestol: false, ledig: false };

  const $ = (id) => document.getElementById(id);
  const kalender = $('kalender');

  const leggTilDager = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

  function filtrer(tur) {
    if (state.niva.size && !state.niva.has(tur.niva)) return false;
    if (state.rullestol && !(tur.ekstra || []).includes('rullestol')) return false;
    if (state.ledig) { const s = status(tur); if (s.ledige === 0 || s.avlyst || s.forbi) return false; }
    return true;
  }

  function turKnapp(tur) {
    const s = status(tur);
    const kl = ['tur'];
    if (s.forbi) kl.push('is-past');
    if (s.avlyst) kl.push('is-avlyst');
    if (tur.erPameldt) kl.push('is-pameldt');

    let plass;
    if (s.avlyst) plass = '';
    else if (s.forbi) plass = `<span class="tur__meta">Gjennomført</span>`;
    else if (s.ledige === 0) plass = `<span class="tur__plass tur__plass--full">Fullt</span>`;
    else plass = `<span class="tur__plass tur__plass--${s.niva}">${s.ledige} ledige</span>`;

    let flagg = '';
    if (s.avlyst) flagg = `<span class="tur__flag tur__flag--avlyst">Avlyst</span>`;
    else if (tur.endring) flagg = `<span class="tur__flag">Endret</span>`;
    if (tur.erPameldt && !s.avlyst) flagg += `<span class="tur__flag tur__flag--pameldt">${ikon('check')}Påmeldt</span>`;

    const niva = (NIVA[tur.niva] || NIVA.lett).tekst;
    const ariaTekst = `${tur.navn}, ${fmt.lang(tur.start)} klokka ${fmt.tid(tur.start)}. ${niva}.` +
      (s.avlyst ? ' Avlyst.' : s.ledige === 0 ? ' Fullt.' : ` ${s.ledige} ledige plasser.`);

    return `<button class="${kl.join(' ')}" type="button" data-id="${esc(tur.id)}" data-niva="${esc(tur.niva)}" aria-label="${esc(ariaTekst)}">
      <span class="tur__tid">${ikon('clock')}${fmt.tid(tur.start)}</span>
      <span class="tur__navn">${esc(tur.navn)}</span>
      <span class="tur__meta">${niva} · ${fmt.varighet(tur.varighet)}</span>
      ${plass}${flagg}
    </button>`;
  }

  function ukeEtikett(start) {
    const diff = Math.round((start - denneUka) / (7 * DAG_MS));
    if (diff === 0) return '<span class="week__tag">Denne uka</span>';
    if (diff === 1) return '<span class="week__tag week__tag--next">Neste uke</span>';
    if (diff === -1) return '<span class="week__tag week__tag--next">Forrige uke</span>';
    return '';
  }

  async function renderUke(start) {
    const slutt = leggTilDager(start, 7);
    const turer = (await Api.hentTurer(start, slutt)).filter(filtrer);
    const idag = new Date();
    const utenforPlan = start > MAX || slutt <= MIN;
    const sluttDag = leggTilDager(start, 6);

    let html = `<section class="week" aria-label="Uke ${fmt.uke(start)}">
      <div class="week__head"><h3>Uke ${fmt.uke(start)}</h3>${ukeEtikett(start)}<span>${start.getDate()}. ${fmt.mndKort(start)} – ${sluttDag.getDate()}. ${fmt.mndKort(sluttDag)}</span></div>`;

    if (utenforPlan) {
      return html + `<div class="cal-empty">${ikon('calendar')}<p><strong>Turplanen for denne uka er ikke publisert ennå.</strong><br>Nye turer legges ut fortløpende – sjekk igjen senere.</p></div></section>`;
    }

    html += '<div class="week-grid">';
    for (let i = 0; i < 7; i++) {
      const dag = leggTilDager(start, i);
      const dagensTurer = turer.filter(t => fmt.sammeDag(t.start, dag));
      const erIdag = fmt.sammeDag(dag, idag);
      const forbi = !erIdag && dag < idag;
      const kl = ['day'];
      if (erIdag) kl.push('is-today');
      if (forbi) kl.push('is-past');
      if (!dagensTurer.length) kl.push('no-tours');
      html += `<div class="${kl.join(' ')}">
        <div class="day__head"><span class="day__name">${fmt.dagKort(dag)}${erIdag ? ' · i dag' : ''}</span><span class="day__num">${dag.getDate()}.</span></div>
        <div class="day__body">${dagensTurer.length ? dagensTurer.map(turKnapp).join('') : '<span class="day__empty">Ingen turer</span>'}</div>
      </div>`;
    }
    return html + '</div></section>';
  }

  async function render() {
    const uke1 = state.ukeStart;
    const uke2 = leggTilDager(uke1, 7);
    const sisteDag = leggTilDager(uke2, 6);
    $('cal-tittel').textContent = `Uke ${fmt.uke(uke1)} og ${fmt.uke(uke2)}`;
    $('cal-periode').textContent = `${uke1.getDate()}. ${fmt.mnd(uke1)} – ${sisteDag.getDate()}. ${fmt.mnd(sisteDag)} ${sisteDag.getFullYear()}`;
    $('forrige').disabled = uke1 <= MIN;
    $('neste').disabled = uke1 >= MAX;
    $('idag').disabled = uke1.getTime() === denneUka.getTime();

    const html = (await renderUke(uke1)) + (await renderUke(uke2));
    kalender.innerHTML = html;

    // Vis en melding hvis filteret skjuler alt
    if (!kalender.querySelector('.tur') && !kalender.querySelector('.cal-empty') && (state.niva.size || state.rullestol || state.ledig)) {
      kalender.insertAdjacentHTML('afterbegin', `<div class="cal-empty" style="margin-top:24px">${ikon('search')}<p><strong>Ingen turer passer filteret ditt.</strong><br>Prøv å fjerne et filter.</p></div>`);
    }
  }

  async function renderMine() {
    const el = $('mine-innhold');
    if (!Auth.bruker()) {
      el.innerHTML = `<p class="mine__empty">Logg inn med ID-porten for å se turene du er påmeldt.</p>
        <button class="btn btn--sm idporten-btn" type="button" data-login-mine style="margin-top:14px">${ikon('lock')}Logg inn</button>`;
      el.querySelector('[data-login-mine]').addEventListener('click', () => Auth.loggInn());
      return;
    }
    const liste = await Api.minePameldinger();
    if (!liste.length) {
      el.innerHTML = '<p class="mine__empty">Du er ikke påmeldt noen turer ennå. Trykk på en tur i kalenderen for å melde deg på.</p>';
      return;
    }
    el.innerHTML = '<ul>' + liste.map(t => `<li><button type="button" data-id="${esc(t.id)}">
        <span class="date-tile" style="width:48px"><span class="date-tile__m">${fmt.mndKort(t.start)}</span><span class="date-tile__d" style="font-size:1.2rem">${t.start.getDate()}</span></span>
        <span><strong>${esc(t.navn)}</strong><small>${fmt.relativ(t.start)} kl. ${fmt.tid(t.start)}</small></span></button></li>`).join('') + '</ul>';
  }

  /* ---------- Hendelser ---------- */
  $('forrige').addEventListener('click', () => { state.ukeStart = leggTilDager(state.ukeStart, -7); render(); });
  $('neste').addEventListener('click', () => { state.ukeStart = leggTilDager(state.ukeStart, 7); render(); });
  $('idag').addEventListener('click', () => { state.ukeStart = new Date(denneUka); render(); });

  document.querySelectorAll('.cal-filters .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const pa = chip.getAttribute('aria-pressed') !== 'true';
      chip.setAttribute('aria-pressed', pa);
      if (chip.dataset.niva) pa ? state.niva.add(chip.dataset.niva) : state.niva.delete(chip.dataset.niva);
      if (chip.dataset.filter === 'rullestol') state.rullestol = pa;
      if (chip.dataset.filter === 'ledig') state.ledig = pa;
      render();
    });
  });

  // Åpne modal ved klikk på en tur (kalender og "mine påmeldinger")
  document.addEventListener('click', (e) => {
    const knapp = e.target.closest('#kalender .tur, #mine-innhold button[data-id]');
    if (knapp) Modal.apne(knapp.dataset.id);
  });

  // Piltaster for å bla mellom uker
  document.addEventListener('keydown', (e) => {
    if (document.querySelector('dialog[open]') || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    if (e.key === 'ArrowLeft' && !$('forrige').disabled) $('forrige').click();
    if (e.key === 'ArrowRight' && !$('neste').disabled) $('neste').click();
  });

  document.addEventListener('leva:endret', () => { render(); renderMine(); });
  document.addEventListener('leva:auth', () => { render(); renderMine(); });

  render().then(() => {
    // Direkte lenke til en tur: pamelding.html?tur=<id>
    const id = new URLSearchParams(location.search).get('tur');
    if (id) Modal.apne(id);
  });
  renderMine();
})();
