# S1–S2-relaties · voorbeeld- en regressiefixtures

Deze set vult **Language Tree · extensie 1 · Anafoor** aan. Het bestand
`samples/s1-s2-relation-fixtures.json` scheidt drie zaken die in de
weergave niet door elkaar mogen lopen:

1. harde coreferentie tussen centrale Text-bronknopen;
2. gekozen interpretaties bij ambiguïteit;
3. Context-observaties en inserties, zonder centrale boomknoop; Context p.m.

## Overzicht

| Fixture | S1 | S2 | Verwachte kern |
|---|---|---|---|
| `user-man-yesterday-today` | Ik zag de man gisteren. | Vandaag was hij er niet meer. | Text `MAN→HIJ`; Context-inserties `GISTEREN`, `VANDAAG`, `ER`, `NIET MEER` |
| `explicit-place-anaphor` | Gisteren zag ik de man in het park. | Vandaag was hij daar niet meer. | Text `MAN→HIJ`; tijd en plaats zijn Context |
| `explicit-place-and-state` | Gisteren was de man in het park. | Vandaag was hij daar niet meer. | Text `MAN→HIJ`; plaats en toestand zijn Context |
| `entity-only-control` | Ik zag een man. | Hij droeg een hoed. | alleen entiteitscoreferentie |
| `temporal-only-control` | Gisteren regende het. | Vandaag schijnt de zon. | geen Text-anafoor; tijdsinformatie is Context |
| `unresolved-there-control` | Ik zag de man gisteren. | Vandaag was hij daar niet meer. | geen harde plaatsrelatie zonder plaatsantecedent |
| `ambiguous-double-pronoun` | Anna sprak met Eva. | Daarna belde zij haar. | twee complete lezingen; semantiek kiezen vóór layout/flip |
| `user-farmer-donkey-because` | De boer slaat de ezel | omdat hij hem bezit. | Text `BOER→HIJ`, `EZEL→HEM`; Context-insertie `OMDAT`; bijzin zonder V2 |
| `user-man-dog-because-perfect` | De man slaat de hond | omdat die hem heeft gebeten. | Text `HOND→DIE`, `MAN→HEM`; Context `OMDAT`; vier flipvarianten |

De geconstrueerde fixtures zijn tests, geen literatuurcitaten. De afzonderlijke
literatuurcatalogus staat in `ANAPHOR_S1_S2_LITERATURE_CATALOG.md`.

## Schema- en renderstatus

| Relatietype | Schema | Status |
|---|---|---|
| Text-coreferentie | `ogn-referent-anaphor-v1` | actief; iedere uitgelijnde relatie wordt getekend en op LEX gerealiseerd |
| Context-insertie | `ogn-lexical-insertion-v1` | actief op LEX; `layer: "Context"`; geen centrale Text-knoop |
| tijd, plaats, toestand, causaliteit | geen actief schema | Context: p.m. |

`status: "unresolved"` en `render: false` zijn normatief voor een kandidaat
zonder expliciet antecedent. De renderer mag zo’n kandidaat nooit zelfstandig
promoveren tot een harde relatie.

## Baseline in detail

Voor de door de opdrachtgever aangeleverde baseline geldt precies één harde
Text-anafoor:

```json
[
  {
    "schema": "ogn-referent-anaphor-v1",
    "id": "man-hij",
    "type": "coreference",
    "referent": "S1:MAN",
    "anaphor": "S2:HIJ"
  }
]
```

De lezing van *er* als “op de plaats waar ik hem zag” is aannemelijk, maar S1
noemt die plaats niet. Ook aanwezigheid tijdens *zien* is een pragmatische
afleiding, geen apart uitgesproken predicaat. Tijd, plaats en toestand zijn
uitsluitend Context-observaties; de woorden `GISTEREN`, `VANDAAG`, `ER` en
`NIET MEER` zijn Context-inserties buiten de Text-boom.

## Dubbele anafoor plus perfectumcluster

Voor de door de opdrachtgever aangeleverde flipfixture geldt:

- S1-Text: `MAN` subject, `HOND` object, `SLAAT` predicaat;
- S2-Text: `HOND` subject, `MAN` object,
  `V-CLUSTER(HEEFT,GEBETEN)` predicaat;
- relaties: `HOND(S1)↔HOND(S2)` met LEX `DIE`, en
  `MAN(S1)↔MAN(S2)` met LEX `HEM`;
- Context: `OMDAT`, zonder centrale Text-knoop;
- geen V2 in S2: het is een omdat-bijzin;
- drie gedeclareerde binaire branches met ieder de varianten `normal`,
  `left-right`, `short-long` en `both`.

De volledige zoekruimte bevat 64 kandidaten. De standaardoplossing is
`s1-root=left-right`, `s1-vp=left-right`, `s2-vcluster=normal`. Zij lijnt beide
relaties met één starre S2-shift uit. Voor de V-clusterbranch geven `normal`
en `left-right` de LEX-volgorde `HEEFT GEBETEN`; `short-long` en `both` geven
`GEBETEN HEEFT`. Bij de twee andere branches verandert kort–lang uitsluitend
de plaatsingsafstand.
