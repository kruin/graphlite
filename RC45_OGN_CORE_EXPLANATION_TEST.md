# RC45 OGN Core Explanation Test

Gebruik deze lijst voor de handmatige goedkeuring van `v2.0.0-rc.45`.

Datum akkoord: 2026-08-02

Carrouselherziening 2026-08-02: slides 4–7 zijn na dit akkoord gewijzigd op
verzoek van de gebruiker. Automatische controle en eerste visuele QA zijn
uitgevoerd; het nieuwe gebruikersakkoord volgt na controle van de geleverde
PNG's.

## 1. Vaste inhoudsvolgorde

- [x] README en LEESMIJ beginnen bij vrije plaatsing zonder een nog niet
  geïntroduceerde uitbreiding te noemen.
- [x] De eerste uitleg zegt dat OGN knopen één voor één op vrije gridposities
  schrijft.
- [x] De uitleg zegt dat iedere knoop één horizontale en één verticale
  gridlijn bezit.
- [x] De harde invariant staat leesbaar én formeel vermeld:
  `A ≠ B ⇒ x(A) ≠ x(B) én y(A) ≠ y(B)`; twee verschillende knopen delen
  nooit een horizontale of verticale gridlijn.
- [x] De invariant geldt expliciet voor kern, toepassingen, render en
  OPN-export; een ongeldige fallbackknoop wordt niet getekend.
- [x] De overtreding heet consequent `gridlijnhergebruik`: horizontaal
  hergebruik deelt een rij, verticaal hergebruik een kolom.
- [x] Ruleset en zoekstrategie worden als verschillende verantwoordelijkheden
  uitgelegd: geldigheid tegenover kandidaatvolgorde.
- [x] Greedy Grow staat als directe plaatsingsproef beschreven: centraal
  startpunt, dots één voor één en geen compleet plan vooraf.
- [x] De compacte vierarmige kandidaatvolgorde is exact vastgelegd, schrijft
  direct en reproduceert de bewaarde 12/31/96-demo's. De veldomtrek wordt niet
  als bewezen wereldwijd optimum gepresenteerd.
- [x] Het vrije-plaatsenvoorbeeld zet A, B en C op unieke horizontale en
  verticale gridlijnen; geen knoop staat op de onderste gridrand.
- [x] Verdere plaatsingsbeperkingen worden niet vooruitlopend behandeld; die
  horen later bij afzonderlijke rulesets voor directe of berekende plaatsing.
- [x] Projectie wordt pas na vrije plaatsing geïntroduceerd.
- [x] Berekende plaatsing wordt pas na projectie geïntroduceerd.
- [x] Two-Pass Language Tree staat uitsluitend als berekende toepassing en
  niet als definitie van OGN.
- [x] LEX, SYNT en LOG staan uitsluitend als benoemde voorbeelden binnen de
  taaltoepassing.

## 2. Ingebouwde README

- [x] `README / LEESMIJ` opent op **Start · OGN-kern / Start · OGN Core**.
- [x] De eerste carousel bevat exact vier beelden:
  `ogn-free-grid.svg`, `ogn-sequential-write.svg`,
  `ogn-placement-strategies.svg` en `ogn-three-layers.svg`.
- [x] Alle vier beelden en onderschriften zijn in Nederlands en Engels
  begrijpelijk.
- [x] De navigatievolgorde onder Open Graph is Vrije plaatsing →
  Plaatsingsstrategieën → Projectie → Berekende plaatsing.
- [x] De oude probleembomen verschijnen pas later bij de taaltoepassing.
- [x] De uitleg blijft leesbaar in desktop, mobiel staand en mobiel liggend.
- [x] De README-scheidingsgreep blijft werken.

## 3. Publicatiecarrousel

- [x] Alleen `publicatie-carrousel/index.html` is als beeldbron bewerkt; geen
  losse PNG en geen carrouselzip is rechtstreeks aangepast.
- [x] `maak-publicatie-carrousel.bat` heeft na de laatste bronwijziging alle
  zeven PNG's en de carrouselzip opnieuw gebouwd.
- [x] `publicatie-carrousel/derived-manifest.json` hoort bij de actuele bron,
  exporter, versie en zeven PNG's.
- [x] Er zijn exact zeven PNG's, genummerd `01` tot en met `07`.
- [x] Iedere PNG is exact 1080 × 1080 pixels.
- [x] Slide 1 noemt de eigendom van horizontale en verticale gridlijnen.
- [x] Slide 1 zegt expliciet dat geen andere knoop één van beide lijnen mag
  gebruiken.
- [x] Slide 2 toont drie gestippelde vrije plekken op drie verschillende rijen
  en drie verschillende kolommen.
- [x] Slide 2 toont A, B en C op drie verschillende binnenrijen; de onderste
  gridrij blijft leeg.
- [x] Slide 3 toont één knoop schrijven en daarna herhalen.
- [ ] Slide 4 toont geplaatste knopen die naar de expliciet benoemde assen
  WEST, SOUTH en EAST projecteren; iedere knoop blijft op zijn gridpositie.
- [ ] Slide 4 gebruikt overal `node`/`knoop` en niet `source`/`bron` voor de
  geplaatste knoop.
- [ ] Slide 5 wordt rechtstreeks uit `greedy-grow-engine.js` afgeleid en toont
  de eerste twaalf dots van de geaccepteerde vierarmige volgorde.
- [ ] Slide 5 noemt uitsluitend het directe voorbeeld Greedy Grow en bevat
  een zichtbare verwijzing naar `github.com/kruin/graphlite`.
- [ ] Slide 6 noemt uitsluitend het berekende voorbeeld Language Tree en toont
  `HOND BIJT MAN` in het laatste stadium.
- [ ] Slide 6 toont de verplaatste woorden als `HOND · BIJT · MAN` op de
  westelijke LEX-as en bevat een zichtbare GitHub-verwijzing.
- [ ] Geen tekst, kaart, label of footer wordt afgesneden of overlapt.
- [ ] Kleine tekst blijft bij normale galleryweergave voldoende leesbaar.
- [ ] De zeven beelden zijn na de hashcontrole ook handmatig bekeken; een
  technisch geldige afleiding is niet als inhoudelijk akkoord behandeld.

## 4. Platformtekst

- [x] LinkedIn, Reddit, Facebook, YouTube en korte socialtekst beginnen bij de
  OGN-kern.
- [ ] De platformteksten introduceren Language Tree pas als het concrete
  berekende voorbeeld en verwijzen bij beide voorbeelden naar GitHub.
- [x] De feitenlijst noemt Greedy Grow niet als berekende plaatsing en maakt
  de bewijsgrens rond wereldwijde optimaliteit expliciet.
- [x] Alle placeholders zijn vóór werkelijk publiceren vervangen.
- [x] Alle getoonde versies zijn `v2.0.0-rc.45`.

## 5. Regressie

- [x] Syntax en Functional openen en renderen zoals in rc.44.
- [x] LEX, SYNT en LOG blijven afzonderlijk schakelbaar.
- [x] Config, Voorconfig, Toepassingen en LEESMIJ-items blijven bruikbaar.
- [x] Een eigen `config/user-config.json` blijft de standaardconfig
  overschrijven zonder die te vervangen.
- [x] `check_release.bat` eindigt met `RELEASE CHECK: OK`.

## Akkoord

```text
Akkoord rc.45: ja
Getest door: gebruiker
Datum: 2026-08-02
Opmerkingen: “ik accepteer all alles.” Greedy Grow-reconstructie, technische
afbakening, desktop, mobiel, carrousel en volledige rc.45-controle geaccepteerd.
```
