# SOURCE_CHANGES v2.0.0-rc.45

rc.45 herschrijft de algemene OGN-uitleg. De vaste volgorde is:

```text
OGN Free Placement
→ OGN Projection
→ OGN Calculated Placement
→ gespecialiseerde toepassingen
```

## OGN-kern

- De algemene kern schrijft knopen één voor één op vrije posities van een open
  grid.
- Iedere knoop is baas op één eigen horizontale en één eigen verticale
  gridlijn.
- De knoopregel is nu een harde invariant: `A ≠ B ⇒ x(A) ≠ x(B) én
  y(A) ≠ y(B)`. Kern, toepassingen, render en OPN-export mogen dus nooit twee
  knopen op dezelfde horizontale of verticale gridlijn toelaten; er bestaat
  geen ongeldige renderfallback. De vaste naam voor zo'n overtreding is
  `gridlijnhergebruik`.
- Iedere nieuwe stap leest eerst de door eerdere knopen opgebouwde bezetting.
- Een ruleset bepaalt welke vrije posities geldig zijn.
- Een zoekstrategie bepaalt de kandidaatvolgorde; de eerstgevonden geldige
  plek wordt bij directe plaatsing meteen geschreven.
- Greedy Grow begint bij het centrale gridpunt en schrijft dots één voor één.
  De geaccepteerde compacte vierarmige volgorde reproduceert de bewaarde
  12/31/96-demo's exact. De veldomtrek blijft diagnostiek; de reconstructie
  claimt geen bewezen wereldwijd optimum.
- Het vrije-plaatsenvoorbeeld gebruikt unieke binnenrijen en kolommen; de
  onderste gridrij blijft leeg.
- Verdere plaatsingsbeperkingen worden pas uitgewerkt in afzonderlijke
  rulesets voor directe of berekende plaatsing en blijven hier buiten beeld.

De normatieve beschrijving staat in
`OGN_CORE_PLACEMENT_ARCHITECTURE.md` en
`docs/OGN_CORE_PLACEMENT_ARCHITECTURE.md`.

## Drie lagen

- Projectie komt pas na de plaatsing van de bronknoop. Zij kan een marker of
  ordening afleiden zonder de bronknoop te verplaatsen.
- Berekende plaatsing is de derde laag: een toepassing mag eerst een
  plaatsingsplan berekenen en dat daarna door OGN laten schrijven en renderen.
- Two-Pass Language Tree is voortaan expliciet één berekende toepassing.
- LEX, SYNT en LOG zijn benoemde projecties binnen de taaltoepassing en
  definiëren de algemene OGN-kern niet.
- Het UI-profiel `OGN Basis` blijft de basis van de huidige taaltoepassing; de
  profielnaam betekent niet `OGN Core`.

## README en publicatie

- `README.md`, `LEESMIJ.md` en de ingebouwde README beginnen nu bij de
  algemene OGN-kern.
- Vier nieuwe ingebouwde uitlegbeelden tonen vrije gridplaatsing,
  sequentieel schrijven, verschillende zoekvolgorden en de laagvolgorde.
- De oude probleembomen blijven alleen als later taaltoepassingsmateriaal
  aanwezig.
- `PUBLICATIE_README.md` en alle sociale platformteksten zijn kern-eerst
  herschreven.
- De publicatiecarrousel bevat zeven beelden van 1080 × 1080. Slide 4 toont
  geplaatste knopen die naar WEST, SOUTH en EAST projecteren. `node`/`knoop`
  vervangt daar de eerdere term `source`/`bron`.
- Slide 5 is het voorbeeld **Direct — Greedy Grow** en wordt rechtstreeks uit
  de geaccepteerde engine afgeleid. Slide 6 is het voorbeeld
  **Calculated — Language Tree** en toont `HOND BIJT MAN` in het laatste
  stadium, met `HOND · BIJT · MAN` op de westelijke LEX-as.
- Beide voorbeeldslides tonen `github.com/kruin/graphlite`; de oude kaarten
  die de twee plaatsingssoorten uitlegden zijn verwijderd.
- De carrousel is voortaan strikt afgeleid: alleen
  `publicatie-carrousel/index.html` is bewerkbare beeldbron.
  `maak-publicatie-carrousel.bat` genereert altijd alle zeven PNG's en de
  carrouselzip opnieuw. Een SHA-256-manifest en de releasecontrole blokkeren
  verouderde of handmatig gewijzigde afgeleiden.
- Een schone Windows-uitpakmap bevat nu een vastgezette Playwright-installatie,
  een expliciete eenmalige installer en een startcontrole van Chromium.
  Dezelfde herbouw werkt vanuit de volledige projectmap en vanuit de losse
  carrouselmap; een browsertoevoeging als ` (6)` komt niet in de nieuwe zipnaam.
  Lokale `node_modules` en browserbestanden blijven buiten beide releasezips.

## Controles

- `tools/check_publication_carousel.py` controleert de nieuwe slideset,
  kerntermen, laagvolgorde, bestandsnamen, afmetingen en de hashes van bron,
  exporter en alle afgeleide PNG's.
- `tools/check_release.py` controleert de normatieve architectuur, de vier
  README-beelden, het vastgelegde rc.45-akkoord en de nieuwe carrousel.
- `RC45_OGN_CORE_EXPLANATION_TEST.md` bevat de handmatige inhoudelijke en
  visuele akkoordlijst.

## Lokale bronidentiteit

- `SOURCE_BUILD.txt` onderscheidt deze herziening met knoopprojecties,
  voorbeeldslides en GitHub-verwijzingen van eerdere pakketten die hetzelfde
  rc.45-appversienummer dragen.
- De lokale starter controleert voortaan versie én bronstand voordat hij
  `reset-cache.html` opent. Een nog draaiende oudere rc.45-server wordt dus
  niet meer stilzwijgend hergebruikt en kan geen misleidende 404 voor nieuwe
  bestanden zoals `greedy-grow.html` veroorzaken.
- `tools/check_local_start.py` toetst ook expliciet de fouttoestand waarin de
  appversie gelijk is maar de bronstand verschilt.

## Geaccepteerde Greedy Grow-reconstructie

- `greedy-grow-engine.js` herstelt de exacte vierarmige schrijfvolgorde uit de
  drie bewaarde demo's van 12, 31 en 96 knopen.
- `greedy-grow.html` maakt iedere directe `+1`-stap, undo, Play en actuele
  JSON-state afzonderlijk controleerbaar.
- Vier uit de oude browserproef herstelde kandidaatvolgorden leveren zichtbare
  alternatieven zonder vooraf een volledig eindbeeld op te slaan.
- `GREEDY_GROW_RECONSTRUCTION.md` scheidt teruggevonden feiten, operationele
  reconstructie en onbewezen optimaliteitsclaims.
- `tools/check_greedy_grow_reconstruction.js` vergelijkt alle bewaarde
  coördinaten exact en bewaakt unieke rijen/kolommen en direct schrijven.
- De gebruiker heeft de reconstructie en afbakening op 2 augustus 2026
  handmatig goedgekeurd. Publicatieslide 5 wordt uit dezelfde engine afgeleid.

## Niet gewijzigd

rc.45 verandert geen taalboom-graphdata, Config-opslag, OPN-formaat of
viewer-rendercontract. Greedy Grow is als afzonderlijke directe OGN-proef
toegevoegd; de bestaande technische lagen blijven verder intact.
