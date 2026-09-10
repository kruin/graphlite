# OGN_STORAGE_FORMAT

Opslagcontract voor **Open Graph Notation**-documenten. De extensie is `.ogn`.
Het formaat gebruikt UTF-8 en JSON-syntaxis, maar is het eigen, heropenbare
projectformaat van Graphlite.

## Identificatie

Een document begint minimaal met:

```json
{
  "ogn": "Open Graph Notation",
  "document_type": "open-graph-notation-document",
  "ogn_version": "1.0",
  "metadata": {},
  "data": {},
  "paradata": {"included": false}
}
```

Bestandsextensie: `.ogn`. MIME-type:
`application/vnd.opengraph.ogn+json`. `ogn_version` versioneert het formaat;
de generatorversie onder `metadata.generator.version` versioneert de app die
het document schreef.

## Topniveau

`.ogn` scheidt:

```text
metadata    documentidentiteit en generator
data        reproduceerbare graph- en projectieanalyse
paradata    optionele workspace en lokale sessie-events
```

Graphinhoud mag niet afhangen van de aanwezigheid van paradata.

## Profiel en extra's

Vanaf `v2.0.0-rc.36` legt metadata vast welk functieprofiel het document gebruikt:

```json
{
  "profile": "base",
  "extras": []
}
```

Het basisprofiel bevat alleen de kernanalyse. Velden voor een uitgeschakelde extra
worden niet als lege compatibiliteitsvelden bewaard, maar volledig weggelaten.
Met de extra Bijwoorden ingeschakeld wordt dit `"profile": "custom"` met
`"extras": ["adverbs"]`; pas dan mogen bijwoordinserties, LOG-minors en de
bijbehorende LEX- en LOG-velden voorkomen.

## Voorconfig

Vanaf `v2.0.0-rc.37` bewaart metadata de algemene insertiecapaciteit per as:

```json
{
  "preconfig": {
    "insertion": {
      "lex": false,
      "synt": false,
      "log": false
    }
  }
}
```

Deze schakelaars voegen zelf geen taalkundige inhoud toe. Ze moeten vooraf
actief zijn wanneer een toepassing insertiedata gebruikt. De toepassing
Bijwoorden vereist de combinatie `lex: true` en `log: true`. `synt` is
onafhankelijk gereserveerd voor een latere toepassing.

## LOG- en LEX-data

`data.projections.log` bewaart minimaal:

```json
{
  "axis": "south",
  "authority": "LOG",
  "order": "SOV",
  "position_unit": "slot",
  "sequence": [
    {"kind": "major", "short": "S", "logical_slot": 0},
    {"kind": "major", "short": "O", "logical_slot": 1},
    {"kind": "major", "short": "V", "logical_slot": 2}
  ],
  "distances": {"S_O": 1, "O_V": 1, "S_V": 2},
  "lex_position_source": "LOG",
  "lex_projection_origin": "SOURCE-Y",
  "lex_placement_mode": "horizontal-then-move",
  "example_controls_layout": false
}
```

`data.projections.lex.position_source` is `LOG` en
`data.projections.lex.projection_origin` is `SOURCE-Y`.
`data.projections.lex.placement_mode` is `horizontal-then-move`.
`data.projections.lex.logical_sequence` bewaart dezelfde doelvolgorde.

`data.example.sentence_type` bewaart de afzonderlijke clausale keuze. Geldige
waarden zijn:

```json
"main-declarative"
"polar-question"
"subordinate-dat"
"subordinate-omdat"
```

Perfectum is een werkwoordsvorm en geen waarde van `sentence_type`.

Het actieve LEX-profiel bewaart uitsluitend upward-Wissels,
toepassingsgebonden inserties en rechtstreeks geschreven Comp. De oude velden
`additional_open_slot_count` en `additional_open_slot_placement` voor
generieke plaatsen vóór, na of tussen zijn no-show: de import mag ze uit een
ouder document negeren, maar een nieuw document schrijft ze niet. Ook een
downward/post-V2-plan wordt niet opgeslagen als actief plaatsingscontract.
Bij het basisprofiel ontbreken vrije LEX-insertieslots, bijwoordmetadata en
`log.insertion_interval` volledig.

## Multi-OGN-compositie

De toepassing Anafoor · multi-OGN gebruikt profiel `multi-ogn` met extra
`multi-ogn-anaphor`. De reproduceerbare inhoud staat onder
`data.composition`:

```json
{
  "schema": "ogn-multi-composition-v1",
  "order": ["S1", "S2"],
  "calculation": "independent-before-composition",
  "rigid_shift_only": true,
  "grid_invariant_scope": "per-ogn",
  "cross_ogn_exception": "declared-coreference-column-only",
  "units": [
    {"id": "S1", "order": 1, "rigid_shift": {"dx": 0, "dy": 0}, "graph": {}},
    {"id": "S2", "order": 2, "rigid_shift": {"dx": 4, "dy": 7}, "graph": {}}
  ],
  "relation": {
    "type": "coreference",
    "direction": "none",
    "line": "straight-vertical-no-arrow",
    "antecedent": {"unitId": "S1", "nodeId": "s1-man"},
    "anaphor": {"unitId": "S2", "nodeId": "s2-hij"}
  },
  "shared_lex_axis": {
    "axis": "west",
    "order": "S1-before-S2",
    "items": []
  }
}
```

`units[].graph` bewaart voor iedere zin de complete afzonderlijke OGN met
unieke rijen en kolommen. De opgeslagen shift is één starre delta voor de hele
eenheid. Import weigert een richting op de relatie, een niet-verticale
MAN–HIJ-lijn, gedeelde rijen, of een tweede gedeelde kolom.


## Metadata en paradata

`metadata.schema` is `data-metadata-paradata`. Paradata bevat alleen de
actuele workspace, optionele sessie-events en exporttijd. Uitschakelen van
paradata schrijft:

```json
{"included": false}
```

## Compatibiliteit

- OGN-documenten zonder LOG-sequentie blijven leesbaar.
- Zonder minors is de afstand tussen opeenvolgende majors één slot.
- Zonder `sentence_type` leidt de import de zinsoort af uit `lex_rule` en het
  eerste Comp-item; zonder herkenbare aanwijzing geldt `main-declarative`.
- Oude platte viewer-JSON blijft als migratie-/debugformaat leesbaar.
- Oude hostvelden worden als scope-/compatibiliteitsmetadata geïmporteerd.
- Oude `additional_open_slot_*`-velden worden zonder runtime-effect genegeerd.

## Bestandsnamen

```text
hond-bijt-man.v2.0.0-rc.15.ogn
hond-bijt-man.v2.0.0-rc.15.legacy.json
```

## Import en export

- **OGN exporteren** schrijft de volledige actieve analyse: input,
  syntactische en functionele graph, projecties, notatiekeuzes, tijdsvorm,
  workspace en — indien aangevinkt — paradata.
- **OGN importeren** valideert de identificatie, reconstrueert de actieve
  testcase en herstelt de opgeslagen analyse- en workspacekeuzes.
- Een ouder plat JSON-bestand blijft alleen als migratie-input leesbaar.
  Nieuwe projectdocumenten worden altijd als `.ogn` geschreven.
- SVG, PNG en video zijn afgeleide publicatieformaten. Ze bevatten geen
  voldoende projectmodel en zijn daarom bewust niet importeerbaar.

## Hervatbare snapshots en paradata

**Snapshot opslaan** maakt een werkcheckpoint van de graph zoals die op dat
moment zichtbaar is. Anders dan bij een gewone OGN-export is paradata hierbij
verplicht. De snapshot staat in `paradata.snapshot` met schema
`ogn-resumable-view-snapshot-v1` en bewaart:

- de actieve syntax-/functionele view en zichtbare LEX-, SYNT- en LOG-projecties;
- de actuele graphkeuzes, waaronder tijd, V-clusterflip, LOG-volgorde en spacing;
- de precieze PLAY-engine, huidige stap en maximale stap;
- bij directe plaatsing de configuratie, seed, iteratie en engine-snapshot;
- de recente graph-acties waarmee de gebruiker de snapshot benoemde.

Bij **Snapshot openen** reconstrueert Graphlite deze toestand en pauzeert op de
opgeslagen stap. Een volgende klik op **Play** gaat vanaf die stap verder. De
knoppen staan daarom permanent naast Play, ook als overige werkknoppen niet
zichtbaar zijn.

De snapshot bevat het volledige graphmodel, maar bewaart de zichtbare
PLAY-stap afzonderlijk. Daardoor kan de gebruiker na heropening verder bouwen
zonder dat nog niet bereikte stappen meteen zichtbaar worden. De overdracht
naar het interne venster begint pas wanneer dat venster volledig is gestart.

Voor de bestandsnaam toont de app recente paradata als keuzelijst. De gebruiker
combineert acties met de huidige views, kiest een van minstens drie voorstellen
en kan de definitieve naam vrij aanpassen. Ieder voorstel bevat een volgnummer;
de extensie blijft `.ogn`.

Het naamvenster is aan de titelbalk versleepbaar. **Snapshot openen** laat een
`.ogn`-snapshot kiezen en maakt daarna binnen de app een verplaatsbaar en
schaalbaar Graphlite-venster met een eigen viewer en PLAY-toestand. De snapshot
wordt same-origin en browserlokaal aan die viewer overgedragen. Dit werkt op een
statische GitHub Pages-publicatie zonder upload, serveropslag of popup.

## Exportmap

Onder **Config → Exportmap en uitvoer** kan de gebruiker één map kiezen. De
browser bewaart de gekozen directory-handle lokaal in IndexedDB. Alle
bestandsuitvoer gebruikt daarna dezelfde map: OGN, SVG, PNG, video, Legacy
JSON en logs.

De browserbeveiliging blijft leidend:

1. de gebruiker kiest en bevestigt de map zelf;
2. bij een nieuwe browsertoestemming kan Graphlite om bevestiging vragen;
3. als de directory-API ontbreekt, toestemming vervalt of schrijven mislukt,
   valt de app terug op de normale browserdownload;
4. **Gebruik browserdownload** wist alleen de lokaal onthouden maphandle en
   verwijdert geen bestanden.

**Open .ogn uit exportmap** start, indien ondersteund, de bestandskiezer in de
gekozen map en accepteert alleen `.ogn`. Zonder deze browserfunctie opent de
gewone OGN-bestandskiezer.

## Exportformaten

| formaat | doel | importeerbaar |
|---|---|---|
| `.ogn` | volledige analyse en reconstructie | ja |
| `.svg` | zelfstandige schaalbare graph | nee |
| `.png` | vaste afbeelding voor publicatie | nee |
| `.mp4` / `.webm` | opname van de Play-sequentie | nee |
| `.legacy.json` | tijdelijke migratie/debug-uitvoer | alleen als oude JSON |
| `.log` / `.txt` | controle- en configuratielog | nee |
