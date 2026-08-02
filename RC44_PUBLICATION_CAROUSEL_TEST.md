# RC44 publicatiecarrousel · handmatige controle

Datum: 2026-07-30

Versie: `v2.0.0-rc.44`

Akkoord rc.44: ja / nee

Tester:

Blokkerende herstelpunten:

## 1. Bestanden en volgorde

- [ ] `PUBLICATIE_README.md` noemt exact zeven slides.
- [ ] De bestanden `01` tot en met `07` staan in
      `publicatie-carrousel/slides/`.
- [ ] De nummering in de bestandsnaam, op de slide en in de README komt
      overeen.
- [ ] De reeks wordt als één gallery geüpload en niet als zeven losse posts.

## 2. Visuele controle op volledig formaat

- [ ] Iedere PNG opent op 1080 × 1080 pixels.
- [ ] Geen titel, kaart, onderschrift, footer of diagram is afgesneden.
- [ ] Alle tekst is leesbaar op een telefoon zonder inzoomen.
- [ ] LEX is consequent blauw, SYNT groen en LOG paars.
- [ ] De donkere begin- en eindslide hebben voldoende contrast.
- [ ] Slide 2 toont beide traditionele bomen duidelijk.
- [ ] Slide 4 maakt west/oost/zuid ruimtelijk begrijpelijk.
- [ ] Slide 5 houdt OGN Basis, Voorconfig en Toepassing inhoudelijk gescheiden.
- [ ] Slide 6 toont de user-config als overschrijving, niet als vervanging van
      de standaard.

## 3. Inhoudelijke controle

- [ ] “Structure is not word order” past bij de OGN-uitleg in README/LEESMIJ.
- [ ] De centrale graph wordt niet als woordvolgordeboom beschreven.
- [ ] LEX wordt als lineaire woordvolgorde genoemd.
- [ ] SYNT en LOG worden als afzonderlijke named projections genoemd.
- [ ] Bijwoorden staat alleen als toepassing na LEX + LOG-voorconfig.
- [ ] “Uit” betekent ook in de slide: geen voorbeelden, inserties,
      functionaliteit, documentatie of exportdata van die toepassing.
- [ ] rc.44 wordt overal release candidate genoemd en niet stabiele release.

## 4. Reddit-proefplaatsing

- [ ] De gekozen community staat afbeeldingen en meerdere beelden toe.
- [ ] De zeven bestanden zijn tegelijk geselecteerd in volgorde `01 → 07`.
- [ ] Titel en posttekst zijn aangepast aan de communityregels.
- [ ] `[LIVE_DEMO_URL]` en `[SOURCE_OR_RELEASE_URL]` zijn vervangen.
- [ ] De alt-tekst uit `PUBLICATIE_README.md` is toegevoegd waar de interface
      dat aanbiedt.
- [ ] De proefweergave is op desktop en telefoon gecontroleerd.
- [ ] Zelfpromotie of auteurschap is transparant vermeld.

## 5. Bewerkbare bron en herhaalbare export

- [ ] `publicatie-carrousel/index.html` toont zonder netwerkverbinding alle
      zeven slides.
- [ ] Een tekstwijziging wordt in de HTML-bron gedaan, niet rechtstreeks in
      een PNG.
- [ ] Na een bronwijziging zijn alle zeven PNG's opnieuw geëxporteerd.
- [ ] `publicatie-carrousel/derived-manifest.json` koppelt de actuele bron,
      exporter, versie en alle zeven PNG's; geen PNG is rechtstreeks bewerkt.
- [ ] `python tools/check_publication_carousel.py` meldt
      `PUBLICATION CAROUSEL CHECK: OK`.
- [ ] De volledige releasecontrole blijft slagen.

## Eindoordeel

Toelichting:

Akkoord voor publicatie:
