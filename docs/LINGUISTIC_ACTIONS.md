# LINGUISTIC_ACTIONS

Taalkundige acties in OpenGraph Lite Viewer `v2.0.0-rc.42`.

## Basisafleiding

```text
LOG-majors/minors
→ neutrale LEX-rijen
→ Wissels
→ surface-validatie
```

### LOG-minor plaatsen

Een bijwoord wordt ingevoegd in een LOG-interval. De actie:

- voegt geen centrale SYNT- of Functional-knoop toe;
- vergroot de majorafstand met de vaste minorbreedte;
- bepaalt meteen de corresponderende neutrale LEX-rij;
- bewaart klasse, scopehost en markering als metadata.

### LOG-volgorde wijzigen

Beschikbare majorvolgorden:

```text
SOV · SVO · OVS · OSV-! · VSO-! · VOS-!
```

De majorvolgorde verandert de LOG-sequentie en daardoor de neutrale
LEX-basis. De centrale Syntax- en Functional-graphs blijven ongemoeid. `!` betekent
dat een aanvullende, expliciete LEX-verplaatsingsregel nodig kan zijn.

### Wissel

Een Wissel:

- werkt pas na LOG → LEX;
- vult een gereserveerde LEX-positie, zoals topic of V2;
- laat een trace op de LOG-afgeleide basispositie;
- muteert Syntax, Functional en LOG niet.

## Voorbeeldzin

De voorbeeldzin is een verwachte surface-realisatie. Zij valideert de
afleiding, maar bepaalt geen LOG-slot, LEX-basisrij of projectiecoördinaat.

## Oude hostnotatie

`above-S`, `above-VP` en vergelijkbare waarden blijven leesbaar als
scope-/compatibiliteitsmetadata. Bij actieve LOG-autoriteit zijn zij geen
plaatsingsactie meer.

## Lexicaal profiel kiezen

```text
lemma + context
→ kandidaatprofielen
→ voorstel
→ gebruikerskeuze alleen bij notatie-effect
→ effectieve LOG-/LEX-bron
→ vooraf berekend plaatsingsplan
```

De keuze is een eigenschap van de zinsinstantie. Zij wordt niet als nieuwe lemma-entry teruggeschreven.

## Lexicale insertie als voorafgaande layoutactie

Een lexicale insertie is geen element dat achteraf aan een voltooide boom wordt
geplakt. Zij is invoer voor het volledige plaatsingsplan. De berekening reserveert
haar landingsplaats en fysieke ruimte voordat de centrale boom wordt geplaatst.
De kernzin levert daarna de lexicale invulling. Rendering onthult het reeds
vastgelegde resultaat.

`origin=LOG`, `origin=LEX` en `origin=LOG+LEX` beschrijven de bron van de
insertie; alle drie eindigen op een vooraf berekend LEX-doel. Alleen LOG-bevattende
profielen krijgen een LOG-minor.

## JaN-notatie als toekomstige actiebron

De werknotatie is `S:np-VP`, niet `S:NP-VP`; `S+ np-VP` blijft een
onderzoeksvariant. Eerst worden binaire bomen ondersteund, later ook
meertakkige bomen. De verbale-clusterflip `heeft gebeten` ↔ `gebeten heeft`
blijft een afzonderlijke lineaire LEX-actie.
