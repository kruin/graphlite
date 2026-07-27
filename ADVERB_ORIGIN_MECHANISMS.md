# ADVERB_ORIGIN_MECHANISMS

## Status

Voorlopige ontwerp- en onderzoeksnotitie voor Open Graph Notation / JaN. Dit document scheidt twee mechanismen die beide een zichtbare positie op de LEX-as kunnen opleveren. Het is normatief voor terminologie en metadata, maar nog niet voor een visueel verschil in de renderer.

## Probleemstelling

De formulering `bijwoord = externe LEX-insertie` beschrijft alleen de zichtbare bestemming. Zij zegt nog niet waar het element grammaticaal of semantisch vandaan komt. Daardoor werden tot nu toe twee verschillende gevallen onder dezelfde noemer gebracht:

1. een semantische operator of relatie die op LOG bestaat en op LEX een woordvorm krijgt;
2. een partikel, focusmarker of lexicale modifier die rechtstreeks in de oppervlaktestring wordt geplaatst.

## Harde scheiding

```text
destination=LEX, origin=LOG
LOG → LEX-realisatie

destination=LEX, origin=LEX
directe LEX-insertie
```

De bestemming bepaalt de lineaire positie. De oorsprong bepaalt welke analyse de insertie motiveert.

## Mechanisme A — LOG → LEX-realisatie

Gebruik dit mechanisme wanneer de interpretatie onafhankelijk van een specifieke woordvorm als operator of relatie in LOG wordt gerepresenteerd. Voorlopige kandidaten:

- propositionele/epistemische modaliteit: `waarschijnlijk`, `misschien`, `blijkbaar`;
- evaluatieve zinsbijwoorden: `helaas`, `gelukkig`;
- negatie en polariteit: `niet`, affirmatief `wel`;
- frequentie/aspect: `vaak`, `altijd`, `nog`, `al`, voor zover als operator over gebeurtenissen of toestanden gemodelleerd;
- tijd, plaats en wijze zodra LOG expliciete tijd-, locatie- of gebeurtenismodificatie bevat.

Voorbeeld:

```text
LOG-OP[id=epistemic-1, type=EPISTEMIC, value=POSSIBLE]
LEX-REALIZE[origin=LOG, source=epistemic-1, form=MISSCHIEN, linear=post-object-pre-vcluster]
```

## Mechanisme B — directe LEX-insertie

Gebruik dit mechanisme wanneer geen zelfstandige LOG-node wordt aangenomen en de bijdrage primair lexicaal, lokaal-focusgerelateerd, interactioneel of pragmatisch is. Voorlopige kandidaten:

- schakerings-/modale partikels: `eens`, `even`, `maar`, `nou`, `toch`, `dan` en partikel-`wel`;
- focuspartikels die lokaal met hun focusconstituent één groep vormen: `ook`, `zelfs`, `alleen`, `juist`, `slechts`, `pas`;
- graadmodificeerders binnen AdvP/AP/PP: `heel`, `erg`, `vrij`, `nogal`;
- vaste of sterk gelexicaliseerde partikelclusters, zolang geen afzonderlijke LOG-analyse wordt gevraagd.

Voorbeeld:

```text
LEX-INSERT[origin=LEX, role=MODAL_PARTICLE, form=WEL, attachTo=misschien]
```

## Samengestelde insertiegroep

Een zichtbare LEX-groep mag componenten met verschillende bronnen bevatten.

```text
LEX-GROUP[
  surface=MISSCHIEN WEL,
  destination=LEX,
  components=[
    {form=MISSCHIEN, origin=LOG, role=EPISTEMIC_MODAL},
    {form=WEL, origin=LEX, role=MODAL_PARTICLE}
  ],
  slotCount=1,
  linear=post-object-pre-vcluster
]
```

`VAAK` blijft een afzonderlijke groep:

```text
LEX-GROUP[surface=VAAK, destination=LEX, origin=LOG, role=FREQUENCY, slotCount=1]
```

De lineaire output is dan:

```text
... OBJECT → MISSCHIEN WEL → VAAK → V-CLUSTER
```

## Gebruiksspecifieke classificatie

Een woordvorm krijgt niet voor alle gebruiksgevallen dezelfde bron.

| vorm | mogelijke LOG-bron | mogelijke directe LEX-bron |
|---|---|---|
| `wel` | affirmatieve polariteit | modaal/schakeringspartikel |
| `alleen` | brede restrictieve operator | nauw focuspartikel bij één constituent |
| `ook` | brede additieve operator | lokaal focuspartikel |
| `misschien` | epistemische modaliteit | verzachtend partikel in sommige directieve gebruiken |
| `nog`, `pas` | aspect/tijd/operator | lokaal focus- of partikelgebruik |

De analyse wordt dus per token of insertiecomponent opgeslagen, niet alleen per lemma.

## Relatie tot de literatuur

De Nederlandse grammaticale beschrijving onderscheidt zins-/clause-adverbials die scope over de volledige claus hebben van VP-adverbials die alleen de VP modificeren. Modale bijwoorden en negatie gedragen zich daarbij als scope-elementen in of aan de rand van het functionele domein. Focuspartikels kunnen daarentegen samen met de gefocuste constituent één constituent vormen. Onderzoek naar Nederlandse modale partikels behandelt onder meer `eens`, `even`, `maar`, `nou`, `toch` en `wel` als context- en interactiegevoelige elementen en wijst op volgordevoorkeuren binnen partikelclusters.

Deze literatuur ondersteunt de brononderscheiding, maar schrijft niet rechtstreeks de OGN-assen voor. De vertaling naar `origin=LOG` en `origin=LEX` is daarom een OGN-ontwerpbeslissing.

Onderzoeksbasis:

- Taalportaal, Dutch Syntax: VP adverbials; clause adverbials versus VP adverbials; order of scope-bearing clause adverbials; focus particles.
- Van Balen, Caspers & Van der Wouden (2010), modale partikels in het Nederlands als tweede taal.
- Fortuin (2004), imperatiefsubjecten en modale partikels.
- Van der Wouden e.a., onderzoek naar combinaties en volgorde van Nederlandse modale partikels.

## Implementatiestatus v2.0.0-rc.41

- De twee mechanismen zijn in LEESMIJ en specs benoemd.
- Voorbeeldmetadata kan `data-source-mechanism` en `data-source-components` bevatten.
- De parser bewaart deze velden in het insertieobject.
- De renderer gebruikt voor beide nog dezelfde LEX-slotgeometrie.
- Visuele markering en een echte LOG-adverbnode zijn vervolgwerk.


## Integration with usage profiles in rc.28

The research distinction is implemented through usage profiles rather than duplicate lemma records. One lemma may provide multiple profiles; a sentence instance selects one profile. `origin=LOG`, `origin=LEX` and `origin=LOG+LEX` remain the source mechanisms. An explicit sentence-instance linear landing position has priority over a broad category default when automatic placement is active.
