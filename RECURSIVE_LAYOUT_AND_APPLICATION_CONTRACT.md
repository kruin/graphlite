# Recursieve layout en toepassingscontract

Normatief ontwerp voor OpenGraph Lite Viewer `v2.0.0-rc.45`. Deze
releasekandidaat is op 2 augustus 2026 handmatig goedgekeurd; de hieronder
beschreven technische grenzen blijven onderdeel van het contract.

## Hoofdbesluit

Ja: **recursief structureren en intrinsiek meten, daarna assen plaatsen en
renderen** is het juiste hoofdidee. Daarbij blijven vijf soorten informatie
strikt uit elkaar:

1. structurele configuratie;
2. voorconfig/capaciteiten per as;
3. toepassingen die capaciteiten gebruiken;
4. een concrete zin of analyse;
5. visuele layout-policy.

Een toepassing mag semantische eisen en benodigde soorten ruimte declareren,
maar nooit zelf losse SVG-coördinaten kiezen.

Kort contract: een toepassing levert een `layout-demand`; de meetpass levert
per box `requiredWidth/requiredHeight`.

## De zeven fasen

### 1. Config oplossen

De resolver maakt één effectieve configuratie:

```text
Basis
  + actieve voorconfig
  + toegestane toepassingen
  + concrete analysekeuzes
  = resolvedConfig
```

Een toepassing wordt alleen actief wanneer al haar vereiste voorconfig actief
is. Bijwoorden vereist nu `insertie.LEX + insertie.LOG`.

### 2. Semantisch model bouwen

Uit `structure-config`, lexicon en voorbeelddata ontstaat een model zonder
pixels:

- centrale Syntax- of Functional-boom;
- LEX-bronnen, doelen, traces en Wissels;
- SYNT-regels;
- LOG-majors;
- door toepassingen geleverde LOG-minors.

### 3. Recursief grid plaatsen

Bladeren krijgen een minimale gridpositie. Een parent plaatst complete
child-subtrees in vrije HOR/VER-corridors. De uitkomst is een structurele
layout in cellen. Groei en render mogen deze posities niet later wijzigen.

Hier geldt hard `A ≠ B ⇒ x(A) ≠ x(B) én y(A) ≠ y(B)`: twee verschillende
knopen delen nooit een horizontale of verticale gridlijn. Iedere
toepassingsverschuiving moet dezelfde invariant behouden. Na plaatsing, vóór
render en vóór OPN-export wordt dit gecontroleerd; bij een conflict wordt geen
fallbackknoop getekend. Zo'n conflict heet **gridlijnhergebruik**.

**Implementatiegrens in rc.42:** deze gridplaatsing krijgt de later gemeten
pixelbreedtes nog niet terug als invoer. Een langer label kan dus zijn
subtree-rechthoek verbreden, maar laat niet automatisch naburige knopen naar
een andere gridcel verhuizen.

### 4. Recursief visueel meten

Iedere node rapporteert zijn intrinsieke pixelmaat:

- cirkel of categorie-/role-box;
- hoofdlabel en sublabel;
- actieve lettergrootte en layoutdichtheid.

Een subtree-box wordt bottom-up gemeten als:

```text
eigen node
∪ alle visuele child-bounds
∪ caption
+ centrale binnenmarge
```

Daarom is `BOX NP` rond `HOND` smaller dan een grote `BOX VP`, maar nooit zo
smal dat de NP-knoop, HOND of het caption buiten de rand valt. Breedte en
hoogte komen uit dezelfde meting.

De tekstmeting gebeurt vóór het tekenen van de betrokken SVG-elementen via een
canvas-meetcontext. De renderer hoeft dus geen reeds getekende SVG te meten en
opnieuw te tekenen.

`requiredWidth/requiredHeight` bestuurt in rc.42 de zichtbare subtree-rect. Het
is nog geen algemene constraint- of collision-solver voor de hele graph.

### 5. Assen en toepassingsruimte oplossen

De as-layout leest alleen **layout demands**. Voorbeeld:

```text
Bijwoorden → LEX-contentsoort "wide-insertion"
```

De centrale render-policy vertaalt dat naar de benodigde linkerreikwijdte.
Bijwoorden levert geen `x=...` of `width=...`. Daardoor kan dezelfde toepassing
op mobiel, desktop en een andere dichtheid worden gebruikt.

Ook de rechterreikwijdte van LEX is inhoudsgestuurd. De resolver neemt de
breedste actieve slots en alleen de werkelijk benodigde Wissellanes mee, met
een vaste bovengrens voor vier lanes. Een korte analyse reserveert dus niet
stilzwijgend ruimte voor vier bewegingen.

### 6. Eén zichtvenster berekenen

De fit gebruikt de unie van:

- links: de gemeten linkerrand van de actieve root-subtree plus volledige
  actuele LEX-inhoud;
- midden: de gezamenlijke **structurele grid-envelop** van Syntax en
  Functional;
- de SYNT-as plus volledige Syntax- en Functional-regelboxen rechts;
- de LOG-as, majors en minors onderaan.

Syntax en Functional delen in MAX één stabiel kader, zodat een viewwissel niet
springt. Dit geldt ook voor staand, liggend en een geforceerde
Desktop-interface op een telefoon.

De groene oostas staat op de rechterrand van de gezamenlijke structurele
Syntax/Functional-grid-envelop, met een centrale vaste asafstand. Zij wordt dus
niet uit de gemeten rechterrand van iedere subtree afgeleid. Daardoor gebruikt
de smallere Syntaxboom in landschap dezelfde volle asbreedte als Functional,
zonder een tweede viewport of zinspecifieke verschuiving.

In portret blijft dit een brede links-naar-rechtscompositie. `contain` houdt
alles zichtbaar en benut de breedte, maar kan tekst klein maken en verticale
witruimte overlaten. Een gestapelde portretvariant is een afzonderlijke
toekomstige layoutkeuze, geen fout in de recursieve boxmeting.

### 7. Renderen

Pas nu tekent de renderer de berekende geometrie. De renderlaag:

- verzint geen nieuwe structuur;
- reserveert geen semantische slots;
- verandert geen major/minor-volgorde;
- bevat geen zinspecifieke pixelpatches.

## Welke config bestuurt wat?

| Laag | Bestuurt | Bestuurt niet |
|---|---|---|
| Basis | bomen, assen, standaardvoorbeelden | optionele bijwoorddata |
| Voorconfig | beschikbare insertie-, bewegings- en routecapaciteit per as | concrete woorden of minors |
| Toepassing | semantische bijdrage en abstracte layout demand | x/y en viewport-fit |
| Analyse | gekozen zin, bijwoord, host, gemarkeerd/default | globale render-policy |
| Layout-policy | marges, intrinsieke knoopmaten, lane-afstanden, fit | grammaticale interpretatie |

Pixelwaarden horen dus centraal in een layout-policy en niet als tientallen
losse Config-schuiven in de gebruikersinterface. Config mag wel een
betekenisvolle dichtheid kiezen, bijvoorbeeld MAX of compact; de policy
vertaalt die keuze naar consistente maten.

## Contract voor toepassingen

Een toepassing hoort uiteindelijk één descriptor te leveren:

```text
id
vereiste voorconfig
semantische bijdragen
layout demands
opslagvelden
UI- en documentatiesecties
validaties
cleanup bij uitschakelen
```

Voor Bijwoorden is het contract:

- vereist insertie op LEX en LOG;
- kan één LOG-minor per actieve bijwoordelijke eenheid leveren;
- declareert brede LEX-insertie-inhoud;
- levert host/scope/markering als semantische metadata;
- verandert de centrale Syntax-boom niet;
- verdwijnt volledig wanneer de toepassing uitstaat.

Een latere syntactische toepassing mag pas SYNT-inserties leveren wanneer
`insertie.SYNT` actief is. Zij mag niet via een bijwoord-specifieke uitzondering
de boom binnendringen.

Vraagzin, Nadruk (`juist díe trui`) en Onaffe zin zijn in rc.42 uitsluitend
gereserveerde namen. Ze leveren nog geen descriptor, vereisen nog geen
voorconfig en mogen dus geen state, bijdrage, layout-demand, opslagveld,
documentatiesectie of cleanup activeren.

## LOG-majors en -minors

### Majors

Majors zijn het vaste raamwerk van de LOG-as, nu S/O/V. Hun identiteit en
volgorde komen uit de LOG-config. Een toepassing mag een major niet stil
vervangen of verwijderen.

### Minors

Een minor is een bijdrage van een toepassing binnen een benoemd interval,
bijvoorbeeld `S-O`. De resolver:

1. valideert een stabiel uniek ID;
2. valideert het interval;
3. voegt de minor alleen in dat interval in;
4. berekent de nieuwe slotvolgorde;
5. vergroot alleen de relevante afstand;
6. gebruikt die LOG-volgorde voor LEX-planning, zonder bronwoorden te
   verplaatsen.

Een minor verlaagt geen host-subtree en verandert geen Syntax- of
Functional-relatie. Markering of vooropplaatsing volgt pas daarna als
LEX-Wissel.

### Meerdere toepassingen

Wanneer later meerdere toepassingen minors leveren, moet de resolver ze
deterministisch samenvoegen op:

```text
interval → prioriteit → toepassings-id → item-id
```

Dubbele IDs, een onbekend interval of een minor zonder vereiste voorconfig zijn
harde validatiefouten. De renderlaag lost zulke conflicten niet zelf op.

## Wat rc.42 al uitvoert

- recursieve structurele plaatsing blijft leidend;
- subtree-boxen worden recursief uit werkelijke node-, label- en
  child-bounds gemeten;
- één policy beheert boxmarge en knoopmaten;
- unary boxes zoals `NP → HOND` zijn inhoudsgestuurd compacter;
- de actieve LEX-slots en Wissellanes bepalen hun rechterreserve; de goot vóór
  de boom blijft op ieder scherm compact;
- toepassingen declareren een abstracte LEX-contentsoort;
- volledige LEX-inhoud en volledige SYNT-regelboxen tellen mee in handheld MAX;
- Syntax en Functional delen één oostas op hun gezamenlijke structurele
  grid-envelop;
- Syntax/Functional, staand/liggend en forced desktop worden in Chromium
  gecontroleerd;
- Bijwoorden wordt met drie LOG-majors en minstens één actieve minor getest.
- alle 12 basiszinnen, 14 zinnen met toepassingen beschikbaar en zes
  layoutdichtheden doorlopen dezelfde containment- en viewportcontrole;
- categorie- en leaf-nodes hebben unieke IDs; de perfectum-`vdw` self-edge is
  verwijderd.
- de mobiele README bewaart haar werkelijk gerenderde lijstmaat bij resize;
  lijst, tekstpaneel en sleepgreep worden in portret en landschap getest.

## Aanbevolen vervolgstappen

1. Laat ook de gridplaatsing rekening houden met gemeten pixel-demand wanneer
   labels structureel breder worden dan één cel.
2. Maak een algemene `ApplicationContributionRegistry` voor minors,
   LEX-inserties, SYNT-inserties en documentatiesecties.
3. Meet major- en minor-boxen met dezelfde intrinsieke tekstfunctie in plaats
   van vaste breedtes.
4. Voeg een layout-diagnosepaneel toe dat per box `requiredWidth`,
   `requiredHeight`, demand-bron en eventuele collision toont.
5. Test iedere nieuwe toepassing in de matrix:
   uit / vereiste voorconfig ontbreekt / actief / import-export / mobiel /
   Syntax / Functional / groei.
6. Beslis afzonderlijk of portret naast de volledige horizontale compositie
   ook een gestapelde, beter leesbare presentatie moet krijgen.

De hoofdregel blijft: **semantiek levert eisen; layout berekent ruimte; render
tekent alleen het resultaat**.
