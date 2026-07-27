# RC41 recursieve layouttest

## Doel

Controleren dat iedere subtree-box uit haar werkelijke inhoud wordt gemeten,
de compacte LEX-goot nergens overlap veroorzaakt en volledige LEX- en
SYNT-inhoud in MAX zichtbaar blijft.

## Automatische controle

```text
NODE_PATH=<playwright-node_modules>
OGN_CHROMIUM_EXECUTABLE=<chromium>
node tools/check_recursive_box_fit_runtime.js
```

De test draait met een echte Chromium-browser en controleert:

1. alle zichtbare subtree-boxen hebben meetmodus `recursive-content`;
2. iedere box bevat recursief alle nodevormen, labels en child-boxen;
3. `NP → HOND` is smaller dan de vroegere vaste marge toeliet;
4. de rechterste LEX-Wissel overlapt de boom niet;
5. de resterende LEX-goot is maximaal 12 schermpixels;
6. alle LEX-inhoud valt binnen het SVG;
7. alle SYNT-regelboxen vallen binnen het SVG;
8. Syntax en Functional gebruiken dezelfde viewBox;
9. hetzelfde geldt voor mobiel staand, forced desktop en groot desktop;
10. met Bijwoorden actief blijven drie LOG-majors aanwezig en verschijnt
    minstens één LOG-minor.
11. alle 12 basiszinnen, alle 14 zinnen met de toepassing beschikbaar en de
    zes layoutdichtheden behouden dezelfde geometrische invarianten.

## Handmatige controle en jouw akkoord

Een groene automatische test betekent alleen dat de vastgelegde geometrische
invarianten kloppen. rc.41 is pas goedgekeurd nadat onderstaande visuele en
functionele punten handmatig zijn beoordeeld.

### A. Basis en subtree-boxen

- [ ] Start met een schone config. `OGN Basis` is actief; insertie op LEX,
  SYNT en LOG en de toepassing Bijwoorden staan uit.
- [ ] Open `HOND BIJT MAN` in Syntax. `BOX NP` rond HOND is zichtbaar smaller
  dan `BOX VP`.
- [ ] De NP-knoop, HOND en `BOX NP`-caption vallen volledig binnen de NP-box.
- [ ] Ook `NP → MAN`, `V → BIJT`, de bovenliggende VP en de rootbox bevatten
  hun volledige inhoud.
- [ ] Test ook Perfectum. `VDW` toont geen self-edge of dubbele categorie/leaf.

### B. Assen en zichtvenster

- [ ] Tussen de rechterste blauwe Wissel en de centrale boom staat slechts een
  smalle vrije strook, zonder overlap.
- [ ] De LEX-as en alle trace-, index- en slotinhoud vallen links binnen beeld.
- [ ] De groene SYNT-as en alle regelboxen vallen rechts binnen beeld.
- [ ] Het raster begint op LEX, eindigt op SYNT en stopt onderaan op LOG.
- [ ] Syntax → Functional verandert het stabiele viewBox, de schaal en de
  oostas niet.
- [ ] Herhaal dit in mobiel staand, mobiel liggend, forced desktop op een
  telefoon en groot desktop.

**Portret nauwkeurig beoordelen:** rc.41 houdt de volledige horizontale
LEX–boom–SYNT-compositie zichtbaar en benut daarvoor de breedte. Omdat die
compositie breed is, kan tekst klein blijven en kan boven/onder witruimte
overblijven. Dat is de huidige `contain`-keuze. Als dit toch onvoldoende
leesbaar is, noteer dat als verzoek voor een afzonderlijke gestapelde
portretlayout; het is niet met nog smallere subtree-boxen alleen op te lossen.

### C. Voorconfig en toepassingen

- [ ] Met alleen LEX-insertie aan blijft Bijwoorden geblokkeerd.
- [ ] Met LEX + LOG-insertie aan wordt Bijwoorden beschikbaar; SYNT-insertie is
  daarvoor niet nodig.
- [ ] Bijwoorden aan voegt toepassingsvoorbeelden en bijwoordbediening toe.
- [ ] Een LOG-gebaseerd bijwoord toont drie majors S/O/V plus minstens één
  minor in het gekozen interval.
- [ ] Een directe `origin=LEX`-insertie krijgt geen LOG-minor.
- [ ] LEX of LOG weer uitzetten schakelt Bijwoorden uit en verwijdert de
  bijwoordbediening, voorbeelden, minors en toepassingsdata.
- [ ] Syntax- en Functional-boomrelaties veranderen niet door een minor.

### D. README en bediening

- [ ] README toont in portret de onderwerpen boven de tekst; minstens drie
  onderwerpen zijn direct zichtbaar.
- [ ] De horizontale scheidingsgreep maakt onderwerpen en tekst aantoonbaar
  groter en kleiner.
- [ ] README toont in landschap onderwerpen links en tekst rechts.
- [ ] De verticale scheidingsgreep werkt ook daar en beide panelen blijven
  bruikbaar.
- [ ] Terug naar Main en een viewportwissel klappen de onderwerpenlijst niet
  opnieuw in.

### Technische afbakening die bij de beoordeling hoort

- De gridplaatsing van knopen blijft structureel en celgebaseerd.
- De recursieve pixelmeting bepaalt in rc.41 de zichtbare subtree-rects.
- Zij herplaatst nog geen knopen wanneer een label breder wordt.
- De westelijke LEX-positie gebruikt de gemeten linkerrand van de root-subtree.
- De gezamenlijke SYNT-oostas gebruikt de structurele Syntax/Functional-
  grid-envelop, niet de gemeten rechterrand van iedere subtree.

## Handmatig resultaat

```text
Datum/tijd:
Getest op:
Akkoord rc.41: ja / nee
Nog te herstellen:
```

## Verwacht resultaat

```text
RC41 RECURSIVE BOX FIT: OK
```
