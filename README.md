# LevaLeva – trimturer (frontend)

Skoleprosjekt (Bolk 1 – Frontend): nettside for lege- og tannlegekontoret **LevaLeva** i Levanger, der pasienter kan se og melde seg på trimturer.

## Sider

| Side | Fil | Innhold |
|---|---|---|
| Forside | `index.html` | Hero med neste tur, kommende turer, «slik fungerer det», tjenester, kontakt og kart |
| Turkalender / påmelding | `pamelding.html` | Ukeplan for **denne og neste uke**, bla mellom uker, filtrering, «Mine påmeldinger» |
| Ny tur (ansatte) | `ny-tur.html` | Skjema med validering og live forhåndsvisning av turen |

## Funksjoner

- **Kalender:** viser to uker om gangen med navn og klokkeslett på hver tur. Du blar med knappene eller piltastene, «I dag» hopper tilbake, og du kan filtrere på nivå, tilrettelegging og ledige plasser. En tydelig melding sier at endringer kan skje, og avlyste og endrede turer er merket.
- **Modalvindu:** åpnes ved klikk på en tur og viser:
  - navn, dato og tid, varighet, start og rute, turleder
  - ledige plasser av totalt antall
  - ekstra info, f.eks. rullestol eller fruktpause ved gapahuken
  - **ekte værmelding** fra Open-Meteo når turen er innen fire dager
  - knapp for påmelding når det er ledige plasser

  Modalen lukkes med ×, Esc eller klikk utenfor.
- **Personvern:** bare *antall* påmeldte vises, aldri hvem.
- **ID-porten:** innloggingen er bare en placeholder som simulerer pålogging.
- **Klar for back-end:** all datatilgang går via `LevaApi` i `js/data.js`. Hver funksjon har en `TODO back-end` med endepunktet den skal kalle. Påmeldinger og nye turer lagres midlertidig i `localStorage`.

## Kjøre lokalt

Åpne `index.html` direkte i nettleseren, eller start en enkel server:

```bash
python -m http.server 5173
```

og gå til http://localhost:5173.

## Struktur

```
index.html, pamelding.html, ny-tur.html
css/style.css          – felles design (farger fra logoen)
js/data.js             – eksempeldata + LevaApi (placeholder for back-end)
js/common.js           – ikoner, header, innlogging, værmelding, modal, toast
js/forside.js, js/kalender.js, js/ny-tur.js – logikk per side
assets/                – logo og favicon
```

## Bilder

Fotoene er fra Wikimedia Commons, under fri lisens (Public domain / CC BY-SA). Fotografene er kreditert nederst på hver side.
