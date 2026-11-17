/* =========================================================
   LevaLeva – data og API-lag
   ---------------------------------------------------------
   All data her er EKSEMPELDATA (placeholders). Funksjonene i
   LevaApi returnerer Promises slik at de senere enkelt kan
   byttes ut med ekte fetch()-kall mot back-end, f.eks.:

     hentTurer:  GET    /api/turer?fra=YYYY-MM-DD&til=YYYY-MM-DD
     hentTur:    GET    /api/turer/:id
     meldPa:     POST   /api/turer/:id/pameldinger   (krever ID-porten)
     meldAv:     DELETE /api/turer/:id/pameldinger
     opprettTur: POST   /api/turer                   (krever ansatt-rolle)
     slettTur:   DELETE /api/turer/:id

   Personvern: API-et gir aldri ut HVEM som er påmeldt,
   bare antall (feltet `pameldte`).
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Bilder (Wikimedia Commons, fri lisens) ---------- */
  const WM = 'https://upload.wikimedia.org/wikipedia/commons/';
  const BILDER = {
    ekne: {
      navn: 'Ekne',
      src: WM + 'thumb/f/f2/Ekne.JPG/1280px-Ekne.JPG',
      stor: WM + 'thumb/f/f2/Ekne.JPG/1920px-Ekne.JPG',
      alt: 'Grønne jorder og Trondheimsfjorden ved Ekne i Levanger',
      kreditt: 'Ohlen', lisens: 'Public domain',
      side: 'https://commons.wikimedia.org/wiki/File:Ekne.JPG'
    },
    ytteroya: {
      navn: 'Ytterøya',
      src: WM + 'thumb/d/d2/Ytter%C3%B8ya_Eidet.jpg/1280px-Ytter%C3%B8ya_Eidet.jpg',
      stor: WM + 'thumb/d/d2/Ytter%C3%B8ya_Eidet.jpg/1920px-Ytter%C3%B8ya_Eidet.jpg',
      alt: 'Utsikt fra Eidet på Ytterøya over fjorden',
      kreditt: 'Morten Olsen Haugen', lisens: 'CC BY-SA 4.0',
      side: 'https://commons.wikimedia.org/wiki/File:Ytter%C3%B8ya_Eidet.jpg'
    },
    alstadutsikt: {
      navn: 'Alstadhaug',
      src: WM + '9/9e/Alstadhaug%2812%29_Udsigt_fra_kirkeg%C3%A5rden.jpg',
      stor: WM + '9/9e/Alstadhaug%2812%29_Udsigt_fra_kirkeg%C3%A5rden.jpg',
      alt: 'Utsikt mot fjorden mellom store løvtrær ved Alstadhaug',
      kreditt: 'Hideko Bondesen', lisens: 'CC BY-SA 2.5',
      side: 'https://commons.wikimedia.org/wiki/File:Alstadhaug(12)_Udsigt_fra_kirkeg%C3%A5rden.jpg'
    },
    alstadkirke: {
      navn: 'Alstadhaug kirke',
      src: WM + 'thumb/8/8c/Alstadhaug_kirke_001.JPG/1280px-Alstadhaug_kirke_001.JPG',
      stor: WM + 'thumb/8/8c/Alstadhaug_kirke_001.JPG/1920px-Alstadhaug_kirke_001.JPG',
      alt: 'Den hvite middelalderkirken på Alstadhaug en solrik dag',
      kreditt: 'Finn Rindahl', lisens: 'Public domain',
      side: 'https://commons.wikimedia.org/wiki/File:Alstadhaug_kirke_001.JPG'
    },
    kirkegata: {
      navn: 'Kirkegata',
      src: WM + 'thumb/7/71/Kirkegata_i_Levanger_1.jpg/1280px-Kirkegata_i_Levanger_1.jpg',
      stor: WM + 'thumb/7/71/Kirkegata_i_Levanger_1.jpg/1920px-Kirkegata_i_Levanger_1.jpg',
      alt: 'Kirkegata i Levanger sentrum',
      kreditt: 'Bent Sigmund Olsen', lisens: 'CC BY-SA 2.0',
      side: 'https://commons.wikimedia.org/wiki/File:Kirkegata_i_Levanger_1.jpg'
    },
    levangerkirke: {
      navn: 'Levanger kirke',
      src: WM + 'thumb/a/ab/Levanger_kirke_2016.jpg/1280px-Levanger_kirke_2016.jpg',
      stor: WM + 'thumb/a/ab/Levanger_kirke_2016.jpg/1920px-Levanger_kirke_2016.jpg',
      alt: 'Levanger kirke med det høye tårnet',
      kreditt: 'Henny Stokseth', lisens: 'CC BY-SA 4.0',
      side: 'https://commons.wikimedia.org/wiki/File:Levanger_kirke_2016.jpg'
    }
  };

  /* ---------- Turledere ---------- */
  const LEDERE = {
    ingrid: { navn: 'Ingrid Moe',   rolle: 'Fysioterapeut',          farge: '' },
    martin: { navn: 'Martin Aune',  rolle: 'Fastlege',               farge: 'avatar--green' },
    siri:   { navn: 'Siri Vollan',  rolle: 'Sykepleier',             farge: 'avatar--rose' },
    jonas:  { navn: 'Jonas Lyng',   rolle: 'Tannpleier og turleder', farge: 'avatar--amber' }
  };

  /* ---------- Ekstra-info ---------- */
  const EKSTRA = {
    rullestol: { ikon: 'wheelchair', tekst: 'Tilrettelagt for rullestolbrukere' },
    barnevogn: { ikon: 'stroller',   tekst: 'Fin trasé for barnevogn' },
    fruktpause:{ ikon: 'apple',      tekst: 'Fruktpause ved gapahuken' },
    kaffe:     { ikon: 'coffee',     tekst: 'Kaffe og te underveis' },
    hund:      { ikon: 'paw',        tekst: 'Hund i bånd er velkommen' },
    staver:    { ikon: 'route',      tekst: 'Staver kan lånes ved oppmøte' },
    benker:    { ikon: 'info',       tekst: 'Benker for hvile underveis' },
    ferge:     { ikon: 'info',       tekst: 'Fergebillett betales selv' }
  };

  const NIVA = {
    lett:     { tekst: 'Lett',     beskrivelse: 'Flatt og rolig tempo' },
    middels:  { tekst: 'Middels',  beskrivelse: 'Noen bakker, jevnt tempo' },
    krevende: { tekst: 'Krevende', beskrivelse: 'Lengre tur med stigning' }
  };

  /* ---------- Faste ukentlige turer (maler) ---------- */
  const MALER = [
    { key: 'holmen', ukedag: 1, tid: '10:00', navn: 'Formiddagstur på Levangerholmen', niva: 'lett', varighet: 60,
      oppmote: 'LevaLeva, hovedinngangen', rute: 'Sentrum → Levangerholmen → rundt holmen og tilbake',
      leder: 'ingrid', maks: 15, ekstra: ['rullestol', 'benker'], bilde: 'kirkegata',
      beskrivelse: 'En rolig og sosial runde ut til holmen. Perfekt hvis du er i gang igjen etter sykdom eller skade – vi går i det tempoet gruppa trenger.' },
    { key: 'rinnleiret', ukedag: 2, tid: '17:30', navn: 'Kveldstur til Rinnleiret', niva: 'middels', varighet: 90,
      oppmote: 'Parkeringen ved Rinnleiret', rute: 'Rundtur langs fjorden og gjennom skogen på Rinnleiret',
      leder: 'martin', maks: 20, ekstra: ['fruktpause', 'hund'], bilde: 'ekne',
      beskrivelse: 'Frisk kveldsluft langs Trondheimsfjorden. Turen har noen korte bakker, og vi tar en pause med frukt ved gapahuken.' },
    { key: 'trilletur', ukedag: 3, tid: '11:00', navn: 'Trilletur for småbarnsforeldre', niva: 'lett', varighet: 60,
      oppmote: 'LevaLeva, hovedinngangen', rute: 'Langs Levangerelva til Moan og tilbake',
      leder: 'siri', maks: 10, ekstra: ['barnevogn', 'rullestol', 'kaffe'], bilde: 'levangerkirke',
      beskrivelse: 'Ta med vogna og bli med på en hyggelig tur med andre foreldre. Helsesykepleier går med og svarer gjerne på spørsmål.' },
    { key: 'kultursti', ukedag: 3, tid: '18:00', navn: 'Kultursti i trehusbyen', niva: 'lett', varighet: 45,
      oppmote: 'Levanger torg', rute: 'Kirkegata → Levanger kirke → Sjøgata',
      leder: 'jonas', maks: 12, ekstra: ['rullestol', 'barnevogn'], bilde: 'kirkegata',
      beskrivelse: 'En kort tur gjennom den vernede trehusbyen, med små historiske stopp underveis. Hele ruta går på fortau og asfalt.' },
    { key: 'alstadhaug', ukedag: 4, tid: '09:30', navn: 'Pilegrimstur til Alstadhaug', niva: 'middels', varighet: 150,
      oppmote: 'Skogn stasjon', rute: 'Skogn → Alstadhaug kirke, med utsikt over Trondheimsfjorden',
      leder: 'siri', maks: 15, ekstra: ['fruktpause', 'kaffe'], bilde: 'alstadkirke',
      beskrivelse: 'Gå i gamle fotspor til middelalderkirken på Alstadhaug. Vi spiser medbrakt niste med utsikt over fjorden.' },
    { key: 'stavgang', ukedag: 4, tid: '18:00', navn: 'Stavgang på Moan', niva: 'middels', varighet: 60,
      oppmote: 'Levanger fritidspark, Moan', rute: 'Grusløype rundt Moan, ca. 5 km',
      leder: 'martin', maks: 25, ekstra: ['staver'], bilde: 'alstadutsikt',
      beskrivelse: 'Stavgang gir mer trening for hele kroppen og er skånsomt for knærne. Nybegynnere får en kort innføring før start.' },
    { key: 'ekne', ukedag: 5, tid: '10:00', navn: 'Fjordtur ved Ekne', niva: 'middels', varighet: 120,
      oppmote: 'Ekne kirke', rute: 'Ekne → kulturlandskapet langs fjorden og tilbake',
      leder: 'jonas', maks: 15, ekstra: ['fruktpause', 'hund'], bilde: 'ekne',
      beskrivelse: 'Åpent kulturlandskap og vid utsikt over Trondheimsfjorden. Samkjøring fra LevaLeva kan avtales ved påmelding.' },
    { key: 'hammervatnet', ukedag: 6, tid: '11:00', navn: 'Lørdagstur rundt Hammervatnet', niva: 'krevende', varighet: 180,
      oppmote: 'Parkeringen ved Hammervatnet', rute: 'Rundtur på sti og skogsbilvei rundt deler av vannet',
      leder: 'ingrid', maks: 20, ekstra: ['kaffe', 'hund'], bilde: 'alstadutsikt',
      beskrivelse: 'Helgens lengste tur. Gode sko og klær etter vær anbefales. Vi fyrer bål og koker kaffe midtveis.' },
    { key: 'ytteroya', ukedag: 7, tid: '12:00', navn: 'Øytur til Ytterøya', niva: 'krevende', varighet: 240,
      oppmote: 'Fergekaia i Levanger', rute: 'Ferge til Ytterøya → tur over Eidet → ferge tilbake',
      leder: 'jonas', maks: 12, ekstra: ['ferge', 'fruktpause'], bilde: 'ytteroya',
      beskrivelse: 'En skikkelig søndagstur: ferge ut til Ytterøya og en lengre tur med fantastisk utsikt over fjorden.' }
  ];

  /* ---------- Hjelpefunksjoner for dato ---------- */
  function mandag(d) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
    return x;
  }
  function isoDato(d) {
    const p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
  function tilfeldig(str) { // deterministisk "tilfeldig" tall 0–1 basert på tekst
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0) / 4294967295;
  }

  /* ---------- Lokal lagring (demo i stedet for database) ---------- */
  const lager = {
    les(nokkel, standard) {
      try { const v = localStorage.getItem(nokkel); return v ? JSON.parse(v) : standard; }
      catch (e) { return standard; }
    },
    skriv(nokkel, verdi) {
      try { localStorage.setItem(nokkel, JSON.stringify(verdi)); } catch (e) { /* ignorer */ }
    }
  };
  const K_PAMELDT = 'levaleva.pameldinger';
  const K_EGNE = 'levaleva.egneTurer';

  /* ---------- Generer turer for noen uker rundt i dag ---------- */
  const UKER_BAKOVER = 2, UKER_FREMOVER = 6;

  function genererTurer() {
    const denneUka = mandag(new Date());
    const turer = [];
    for (let u = -UKER_BAKOVER; u <= UKER_FREMOVER; u++) {
      MALER.forEach(m => {
        const dato = new Date(denneUka);
        dato.setDate(dato.getDate() + u * 7 + (m.ukedag - 1));
        const [t, min] = m.tid.split(':').map(Number);
        dato.setHours(t, min, 0, 0);
        const id = m.key + '-' + isoDato(dato);
        const r = tilfeldig(id);
        if (r < 0.06 && u !== 0) return; // noen uker har ikke alle turene

        const tur = Object.assign({}, m, {
          id, start: dato, pameldte: Math.min(m.maks, Math.round(m.maks * (0.15 + r * 0.75))), endring: null
        });

        // Noen faste eksempler på endringer, så de alltid vises i demoen
        if (u === 0 && m.key === 'rinnleiret') tur.pameldte = m.maks;               // fullt
        if (u === 0 && m.key === 'stavgang') tur.pameldte = m.maks - 2;             // få plasser
        if (u === 1 && m.key === 'ekne') {
          const ny = new Date(dato); ny.setHours(12, 0);
          tur.endring = { type: 'tid', tekst: 'Nytt klokkeslett: 12:00 (før ' + m.tid + ')', gammelTid: m.tid };
          tur.start = ny; tur.tid = '12:00';
        }
        if (u === 1 && m.key === 'kultursti') {
          tur.endring = { type: 'avlyst', tekst: 'Avlyst på grunn av sykdom. Vi beklager!' };
        }
        if (u > 1 && r > 0.95) {
          tur.endring = { type: 'avlyst', tekst: 'Avlyst – turleder er bortreist denne uka.' };
        }
        turer.push(tur);
      });
    }
    return turer;
  }

  let CACHE = null;
  function alleTurer() {
    if (!CACHE) CACHE = genererTurer();
    const egne = lager.les(K_EGNE, []).map(t => Object.assign({}, t, { start: new Date(t.start), egen: true }));
    const pameldt = lager.les(K_PAMELDT, []);
    return CACHE.concat(egne)
      .map(t => Object.assign({}, t, {
        erPameldt: pameldt.includes(t.id),
        pameldte: Math.min(t.maks, t.pameldte + (pameldt.includes(t.id) ? 1 : 0))
      }))
      .sort((a, b) => a.start - b.start);
  }

  const vent = (ms) => new Promise(r => setTimeout(r, ms)); // simulerer nettverk

  /* ---------- API (placeholder for back-end) ---------- */
  const LevaApi = {
    // TODO back-end: GET /api/turer?fra=&til=
    async hentTurer(fra, til) {
      return alleTurer().filter(t => t.start >= fra && t.start < til);
    },
    // TODO back-end: GET /api/turer/:id
    async hentTur(id) {
      return alleTurer().find(t => t.id === id) || null;
    },
    // TODO back-end: GET /api/turer/kommende?antall=
    async kommende(antall) {
      const na = new Date();
      return alleTurer().filter(t => t.start > na && !(t.endring && t.endring.type === 'avlyst')).slice(0, antall);
    },
    // TODO back-end: GET /api/meg/pameldinger
    async minePameldinger() {
      const na = new Date();
      return alleTurer().filter(t => t.erPameldt && t.start > na);
    },
    // TODO back-end: POST /api/turer/:id/pameldinger
    async meldPa(id) {
      await vent(650);
      const tur = await this.hentTur(id);
      if (!tur) throw new Error('Fant ikke turen.');
      if (tur.pameldte >= tur.maks) throw new Error('Turen er dessverre full.');
      const liste = lager.les(K_PAMELDT, []);
      if (!liste.includes(id)) { liste.push(id); lager.skriv(K_PAMELDT, liste); }
      return this.hentTur(id);
    },
    // TODO back-end: DELETE /api/turer/:id/pameldinger
    async meldAv(id) {
      await vent(400);
      lager.skriv(K_PAMELDT, lager.les(K_PAMELDT, []).filter(x => x !== id));
      return this.hentTur(id);
    },
    // TODO back-end: POST /api/turer
    async opprettTur(data) {
      await vent(700);
      const liste = lager.les(K_EGNE, []);
      const tur = Object.assign({}, data, {
        id: 'egen-' + Date.now().toString(36),
        start: data.start.toISOString(), pameldte: 0, endring: null
      });
      liste.push(tur);
      lager.skriv(K_EGNE, liste);
      return tur;
    },
    // TODO back-end: GET /api/turer?opprettetAv=meg
    async egneTurer() {
      return lager.les(K_EGNE, []).map(t => Object.assign({}, t, { start: new Date(t.start) })).sort((a, b) => a.start - b.start);
    },
    // TODO back-end: DELETE /api/turer/:id
    async slettTur(id) {
      lager.skriv(K_EGNE, lager.les(K_EGNE, []).filter(t => t.id !== id));
    }
  };

  window.LevaData = { BILDER, LEDERE, EKSTRA, NIVA, MALER, mandag, isoDato, UKER_BAKOVER, UKER_FREMOVER };
  window.LevaApi = LevaApi;
})();
