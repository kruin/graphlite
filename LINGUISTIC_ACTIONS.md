# LINGUISTIC_ACTIONS

Taalkundige acties in OpenGraph Lite Viewer `v2.0.0-rc.26`.

## Basisafleiding

```text
LOG-majors/minors
→ neutrale LEX-rijen
→ Wissels
→ surface-validatie
```

### LOG-minor plaatsen

Een bijwoord wordt ingevoegd in een LOG-interval. De actie:

- voegt geen centrale SYNT- of FT-knoop toe;
- vergroot de majorafstand met de vaste minorbreedte;
- bepaalt meteen de corresponderende neutrale LEX-rij;
- bewaart klasse, scopehost en markering als metadata.

### LOG-volgorde wijzigen

Beschikbare majorvolgorden:

```text
SOV · SVO · OVS · OSV-! · VSO-! · VOS-!
```

De majorvolgorde verandert de LOG-sequentie en daardoor de neutrale
LEX-basis. De centrale Syntax- en FT-graphs blijven ongemoeid. `!` betekent
dat een aanvullende, expliciete LEX-verplaatsingsregel nodig kan zijn.

### Wissel

Een Wissel:

- werkt pas na LOG → LEX;
- vult een gereserveerde LEX-positie, zoals topic of V2;
- laat een trace op de LOG-afgeleide basispositie;
- muteert Syntax, FT en LOG niet.

## Voorbeeldzin

De voorbeeldzin is een verwachte surface-realisatie. Zij valideert de
afleiding, maar bepaalt geen LOG-slot, LEX-basisrij of projectiecoördinaat.

## Oude hostnotatie

`above-S`, `above-VP` en vergelijkbare waarden blijven leesbaar als
scope-/compatibiliteitsmetadata. Bij actieve LOG-autoriteit zijn zij geen
plaatsingsactie meer.
