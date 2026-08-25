# LEX-plaatsingsregels · actief rc.45-profiel

## Harde grens

Het actieve LEX-profiel bevat voorlopig precies drie mechanismen:

1. **Upward Wissel:** een bronknoop mag alleen naar een doel dat op het scherm
   hoger ligt dan zijn horizontale bronprojectie.
2. **Toepassingsinsertie:** een ingeschakelde toepassing mag een eigen
   insertieplaats schrijven wanneer de vereiste voorconfig actief is.
3. **Comp:** een complementizer zoals `DAT` of `OMDAT` wordt rechtstreeks in
   Comp/slot 0 geschreven en heeft daarom geen bronpijl.

Generieke lege posities `vóór`, `na` of `tussen` actieve LEX-rijen en iedere
downward/post-V2-Wissel zijn **no-show en inactief**. Ze verschijnen niet als
Config-optie, worden niet gerenderd en worden niet in nieuwe Config- of
OPN-bestanden opgeslagen. Oude velden worden alleen compatibel genegeerd.
Het gebruik van vóór, na en tussen wordt later afzonderlijk geëvalueerd.

## Bronhoogte is de enige richtingsreferentie

Iedere bronknoop projecteert eerst horizontaal naar LEX:

```text
bron → horizontale projectie op bronhoogte → eventueel expliciet hoger doel
```

Voor de zichtbare tekening geldt:

```text
ydoel < ybron  → voer de upward Wissel uit
ydoel ≥ ybron  → geen Wissel; blijf op ybron
```

Een LOG-reservering is planning en nooit een alternatieve bronhoogte. Ook als
een doel hoger ligt dan een door LOG gereserveerde rij, wordt het geweigerd
wanneer het lager ligt dan de werkelijk zichtbare bronknoop. Daardoor kunnen
LOG-planning en de renderer nooit samen ongemerkt een downward Wissel maken.

## Actieve systeemplaatsen

| Plaats | Actief gedrag |
|---|---|
| Comp / slot 0 | `DAT` of `OMDAT` rechtstreeks schrijven; geen bron, pijl of trace |
| V1 / slot 1 | persoonsvorm van een ja/nee-vraag omhoog wisselen, maar alleen als het doel werkelijk hoger ligt |
| Topic / slot 1 | expliciet getopicaliseerd bronitem omhoog wisselen |
| V2 / slot 2 | persoonsvorm of eenvoudig predicaat van een mededelende hoofdzin omhoog wisselen |
| Insertieplaats | rechtstreeks door een ingeschakelde toepassing schrijven; geen generieke lege kandidaat |

Een verplaatst bronitem krijgt hoogstens één rechtstreekse Wissel en één trace
op de horizontale bronrij. Er is geen zichtbare LOG-tussenstap.

## Zinsoort stuurt de clausale regel

Zinsoort is een afzonderlijke Language-Tree-laag en geen toepassing:

| Zinsoort | Voorbeeld | Actieve LEX-regel |
|---|---|---|
| Hoofdzin · mededelend | `HOND BIJT MAN` | `BIJT` kan omhoog naar V2; `HOND` en `MAN` blijven op bronhoogte |
| Vraagzin · ja/nee | `BIJT HOND MAN?` | `BIJT` kan omhoog naar V1 |
| Dat-zin | `DAT HOND MAN BIJT` | `DAT` direct in Comp; geen V2 |
| Omdat-zin | `OMDAT HOND MAN BIJT` | `OMDAT` direct in Comp; geen V2 |

Perfectum is een werkwoordsvorm, geen zinsoort. Het kan dus binnen een
hoofdzin of bijzin voorkomen. Nadruk en Onaffe zin blijven gereserveerde
toepassingen; Vraagzin is dat niet meer.

## Inserties zijn geen Wissels

Een toepassing declareert zelf welke insertiecapaciteit zij nodig heeft. De
toepassing Bijwoorden vereist bijvoorbeeld de vooraf ingeschakelde assen LEX
en LOG. Een LOG-minor kan een LEX-insertie plannen; een directe LEX-insertie
kan zonder LOG-minor worden geschreven. In beide gevallen is de insertie een
nieuw item zonder centrale bronknoop en dus geen upward of downward Wissel.

## Terminologische grens

`Upward` beschrijft hier uitsluitend de zichtbare richting in de viewer. Het
is geen zelfstandige taalwetenschappelijke claim over hiërarchie, c-command,
rightward movement of Lowering. Downward/post-V2, Heavy NP Shift,
extrapositie en morfologische Lowering vallen buiten het actieve profiel en
krijgen later alleen werking met een afzonderlijke regel, bron/doelcontract,
tracegedrag, Config en regressietests.
