/* =========================================================
   LevaLeva – forside
   ========================================================= */
(function () {
  'use strict';
  const { mandag } = window.LevaData;
  const { ikon, esc, fmt, plasserHtml, bilde, Modal, toast } = window.LevaUI;
  const Api = window.LevaApi;

  function datoFlis(d) {
    return `<span class="date-tile" aria-hidden="true"><span class="date-tile__m">${fmt.mndKort(d)}</span><span class="date-tile__d">${d.getDate()}</span></span>`;
  }

  async function nesteTur() {
    const el = document.getElementById('neste-tur');
    const turer = await Api.kommende(12);
    const tur = turer.find(t => t.pameldte < t.maks) || turer[0];
    if (!tur) { el.remove(); return; }
    el.innerHTML = `
      <div class="next-card__label"><span>Neste tur · ${fmt.relativ(tur.start)}</span><span class="live-dot">Påmelding åpen</span></div>
      <div class="next-card__body">
        ${datoFlis(tur.start)}
        <div>
          <h3>${esc(tur.navn)}</h3>
          <div class="next-card__meta">
            <span>${ikon('clock')}kl. ${fmt.tid(tur.start)}</span>
            <span>${ikon('pin')}${esc(tur.oppmote)}</span>
          </div>
        </div>
      </div>
      <div style="margin-top:16px">${plasserHtml(tur)}</div>
      <div class="next-card__foot">
        <span class="badge badge--${tur.niva}"><span class="dot dot--${tur.niva}"></span>${tur.niva[0].toUpperCase() + tur.niva.slice(1)} · ${fmt.varighet(tur.varighet)}</span>
        <button class="btn btn--sm" type="button" data-id="${esc(tur.id)}">Se turen ${ikon('arrow-r')}</button>
      </div>`;
  }

  async function kommende() {
    const el = document.getElementById('kommende');
    const turer = await Api.kommende(4);
    el.innerHTML = turer.map(t => {
      const b = bilde(t.bilde);
      return `<button class="tour-card reveal" type="button" data-id="${esc(t.id)}">
        <div class="tour-card__img"><img src="${b.src}" alt="${esc(b.alt)}" loading="lazy"><span class="tour-card__date">${fmt.relativ(t.start)} · ${fmt.tid(t.start)}</span></div>
        <div class="tour-card__body">
          <h3>${esc(t.navn)}</h3>
          <div class="tour-card__meta"><span>${ikon('pin')}${esc(t.oppmote)}</span><span>${ikon('timer')}${fmt.varighet(t.varighet)}</span></div>
          <div class="tour-card__foot">${plasserHtml(t)}</div>
        </div>
      </button>`;
    }).join('');
    // Kort som legges til etter innlasting skal også animeres inn
    requestAnimationFrame(() => el.querySelectorAll('.reveal').forEach((k, i) => setTimeout(() => k.classList.add('is-visible'), 80 * i)));
  }

  async function statistikk() {
    const fra = mandag(new Date());
    const til = new Date(fra.getTime() + 7 * 86400000);
    const turer = (await Api.hentTurer(fra, til)).filter(t => !(t.endring && t.endring.type === 'avlyst'));
    document.querySelector('[data-stat="turer"]').textContent = turer.length;
    document.querySelector('[data-stat="tilrettelagt"]').textContent = turer.filter(t => (t.ekstra || []).includes('rullestol')).length;
  }

  // Marker dagens åpningstid
  const dag = new Date().getDay();
  const rad = document.querySelector(`#apningstider tr[data-dag="${dag === 0 ? 6 : dag}"]`);
  if (rad) rad.classList.add('is-today');

  document.addEventListener('click', (e) => {
    const k = e.target.closest('[data-id]');
    if (k && !k.closest('dialog')) Modal.apne(k.dataset.id);
    const ph = e.target.closest('[data-placeholder]');
    if (ph) { e.preventDefault(); toast('Timebestilling kommer i neste versjon', 'info'); }
  });
  document.addEventListener('leva:endret', () => { nesteTur(); kommende(); });

  nesteTur();
  kommende();
  statistikk();
})();
