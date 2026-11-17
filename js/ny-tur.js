/* =========================================================
   LevaLeva – skjema for ny tur (ansatte)
   ========================================================= */
(function () {
  'use strict';
  const { BILDER, LEDERE, EKSTRA, NIVA, isoDato } = window.LevaData;
  const { ikon, esc, fmt, plasserHtml, bilde, Modal, toast } = window.LevaUI;
  const Api = window.LevaApi;

  const form = document.getElementById('tur-skjema');
  const $ = (id) => document.getElementById(id);

  /* ---------- Bygg dynamiske valg ---------- */
  $('leder').innerHTML = Object.entries(LEDERE)
    .map(([k, l]) => `<option value="${k}">${esc(l.navn)} – ${esc(l.rolle)}</option>`).join('');

  $('ekstra-valg').innerHTML = Object.entries(EKSTRA).map(([k, e]) =>
    `<div class="toggle"><input type="checkbox" id="ek-${k}" name="ekstra" value="${k}"><label for="ek-${k}">${ikon(e.ikon)}${esc(e.tekst)}</label></div>`).join('');

  $('bilde-valg').innerHTML = Object.entries(BILDER).map(([k, b], i) =>
    `<input type="radio" name="bilde" id="bi-${k}" value="${k}" ${i === 0 ? 'checked' : ''}><label for="bi-${k}"><img src="${b.src}" alt="" loading="lazy"><span>${esc(b.navn)}</span></label>`).join('');

  // Standard dato: i morgen
  const imorgen = new Date(); imorgen.setDate(imorgen.getDate() + 1);
  $('dato').min = isoDato(new Date());
  $('dato').value = isoDato(imorgen);

  /* ---------- Les skjemaet ---------- */
  function lesSkjema() {
    const fd = new FormData(form);
    const [t, m] = (fd.get('tid') || '10:00').split(':').map(Number);
    const start = fd.get('dato') ? new Date(fd.get('dato') + 'T00:00') : new Date(imorgen);
    start.setHours(t || 0, m || 0, 0, 0);
    return {
      navn: (fd.get('navn') || '').trim(),
      beskrivelse: (fd.get('beskrivelse') || '').trim(),
      niva: fd.get('niva') || 'lett',
      start,
      tid: fd.get('tid'),
      varighet: Number(fd.get('varighet')) || 60,
      oppmote: (fd.get('oppmote') || '').trim(),
      rute: (fd.get('rute') || '').trim(),
      leder: fd.get('leder'),
      maks: Math.min(50, Math.max(2, Number(fd.get('maks')) || 15)),
      ekstra: fd.getAll('ekstra'),
      ekstraTekst: (fd.get('ekstraTekst') || '').trim(),
      bilde: fd.get('bilde') || 'ekne'
    };
  }

  function medStandard(d) { // fyll inn eksempeltekst i forhåndsvisningen
    return Object.assign({}, d, {
      id: 'forhandsvisning',
      navn: d.navn || 'Navn på turen',
      oppmote: d.oppmote || 'Oppmøtested',
      rute: d.rute || 'Rute og mål',
      pameldte: 0, endring: null
    });
  }

  /* ---------- Live forhåndsvisning ---------- */
  function oppdaterForhandsvisning() {
    const d = medStandard(lesSkjema());
    $('pv-dag').textContent = fmt.dagKort(d.start);
    $('pv-dato').textContent = d.start.getDate() + '. ' + fmt.mndKort(d.start);
    $('pv-kalender').innerHTML = `<div class="tur" data-niva="${d.niva}">
      <span class="tur__tid">${ikon('clock')}${fmt.tid(d.start)}</span>
      <span class="tur__navn">${esc(d.navn)}</span>
      <span class="tur__meta">${NIVA[d.niva].tekst} · ${fmt.varighet(d.varighet)}</span>
      <span class="tur__plass tur__plass--ok">${d.maks} ledige</span></div>`;
    const b = bilde(d.bilde);
    $('pv-kort').innerHTML = `<div class="tour-card">
      <div class="tour-card__img"><img src="${b.src}" alt=""><span class="tour-card__date">${fmt.kort(d.start)} · ${fmt.tid(d.start)}</span></div>
      <div class="tour-card__body"><h3>${esc(d.navn)}</h3>
        <div class="tour-card__meta"><span>${ikon('pin')}${esc(d.oppmote)}</span><span>${ikon('timer')}${fmt.varighet(d.varighet)}</span></div>
        <div class="tour-card__foot">${plasserHtml(d)}</div></div></div>`;
    ['navn', 'beskrivelse'].forEach(f => {
      const el = $(f); const c = document.querySelector(`[data-counter="${f}"]`);
      if (c) c.textContent = el.value.length + ' / ' + el.maxLength;
    });
  }

  /* ---------- Validering ---------- */
  function valider() {
    const d = lesSkjema();
    const feil = {
      navn: !d.navn,
      dato: !$('dato').value || d.start < new Date(),
      tid: !$('tid').value,
      oppmote: !d.oppmote,
      rute: !d.rute
    };
    Object.entries(feil).forEach(([f, harFeil]) => {
      const felt = $(f).closest('.field');
      felt.classList.toggle('has-error', harFeil);
      $(f).setAttribute('aria-invalid', harFeil);
      if (harFeil) $(f).setAttribute('aria-describedby', f + '-feil'); else $(f).removeAttribute('aria-describedby');
    });
    const forste = Object.keys(feil).find(k => feil[k]);
    if (forste) { $(forste).focus(); $(forste).scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    return !forste;
  }

  /* ---------- Egne turer ---------- */
  async function renderEgne() {
    const liste = await Api.egneTurer();
    const el = $('egne');
    if (!liste.length) { el.innerHTML = '<p class="mine__empty">Ingen ennå. Turer du publiserer dukker opp her og i kalenderen.</p>'; return; }
    el.innerHTML = '<ul class="created-list">' + liste.map(t =>
      `<li><div><strong>${esc(t.navn)}</strong><small>${fmt.kort(t.start)} kl. ${fmt.tid(t.start)}</small></div>
        <a class="icon-btn" style="color:var(--navy-700)" href="pamelding.html?tur=${encodeURIComponent(t.id)}" aria-label="Vis «${esc(t.navn)}» i kalenderen">${ikon('eye')}</a>
        <button class="icon-btn" type="button" data-slett="${esc(t.id)}" aria-label="Slett «${esc(t.navn)}»">${ikon('trash')}</button></li>`).join('') + '</ul>';
  }

  /* ---------- Hendelser ---------- */
  form.addEventListener('input', (e) => {
    oppdaterForhandsvisning();
    const felt = e.target.closest('.field');
    if (felt && felt.classList.contains('has-error')) felt.classList.remove('has-error');
  });
  form.addEventListener('change', oppdaterForhandsvisning);
  form.addEventListener('reset', () => setTimeout(() => {
    $('dato').value = isoDato(imorgen);
    form.querySelectorAll('.has-error').forEach(f => f.classList.remove('has-error'));
    oppdaterForhandsvisning();
  }));

  document.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => {
    const inp = $('maks');
    inp.value = Math.min(50, Math.max(2, (Number(inp.value) || 15) + Number(b.dataset.step)));
    oppdaterForhandsvisning();
  }));

  $('forhandsvis').addEventListener('click', () => {
    Modal.apne(medStandard(lesSkjema()), { forhandsvisning: true });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!valider()) { toast('Sjekk feltene som er markert med rødt', 'alert'); return; }
    const knapp = $('publiser');
    knapp.disabled = true;
    knapp.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:3px;margin:0"></span>Publiserer …';
    const tur = await Api.opprettTur(lesSkjema());
    knapp.disabled = false;
    knapp.innerHTML = ikon('plus') + 'Publiser tur';
    toast('«' + tur.navn + '» er publisert i kalenderen');
    form.reset();
    renderEgne();
  });

  $('egne').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-slett]');
    if (!b) return;
    if (!confirm('Vil du slette denne turen? Påmeldte deltakere vil få beskjed (i ferdig løsning).')) return;
    await Api.slettTur(b.dataset.slett);
    toast('Turen er slettet', 'trash');
    renderEgne();
  });

  oppdaterForhandsvisning();
  renderEgne();
})();
