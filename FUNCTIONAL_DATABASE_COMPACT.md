# Functional, testmateriaaldatabase en Compact

Dit document legt de actuele samenhang vast tussen invoer, analyse, centrale
boomview en layout. Het is normatief voor de builds vanaf `.71`.

## Eén afleidingsketen

```text
ruwe input in SQLite
→ analysevoorstel
→ kernzin(nen), rollen en relaties
→ goedgekeurde actieve analyse
→ Syntax- of Functional-graphdata
→ normale of compacte rendering
→ publieke export wanneer status = OK
```

De database bewaart; de analyzer analyseert; de Graphlite-engine maakt
graphdata; de viewer tekent. De viewer leidt nooit zelfstandig kernzinnen of
rollen af uit de ruwe input.

## Functional

**Syntax** toont de syntactische structuur. **Functional** toont voor dezelfde
goedgekeurde kernzin de functionele rollen. De zichtbare rollen zijn, waar van
toepassing:

| Functionele knoop | Betekenis |
|---|---|
| `CLAUSE` | functionele kernzin |
| `ARG-STRUCT` | argumentstructuur |
| `PRED` | predicaat |
| `AGENS` | handelende deelnemer |
| `PATIENS` | getroffen deelnemer |
| `THEMA` | thema |
| `DOEL` | doel/ontvanger |

Syntax en Functional gebruiken dezelfde lexicale bronknopen, knoopidentiteiten,
LEX-realisatie, kernzingrenzen en cross-kernel-relaties. Wisselen van view
verandert dus geen analyse, woordvolgorde, anafoor of databasegegeven.

De tweestandenschakelaar **Syntax | Functional** staat permanent en prominent
buiten het menu **View/Placement method** wanneer de actieve toepassing een
berekende Language Tree of kernzincompositie is. Bij een uiting, story of
anafoorcompositie geldt de gekozen view voor iedere kernzin afzonderlijk.

Functional verschijnt alleen wanneer de actieve goedgekeurde analyse voldoende
rollen bevat. Greedy Grow, Random en kale Direct-weergaven krijgen geen
stilzwijgend afgeleide functionele analyse.

## Compact

De knop **Compact** staat naast **Syntax | Functional**. De knop wijzigt alleen
de weergave:

- recursieve boomdichtheid: `compact`;
- takvolgorde: `auto-compact`;
- kernzinvertakking horizontaal: `compact`;
- kernzinvertakking verticaal: `compact`;
- eerdere handmatige globale, lokale en gekoppelde uitrekking: terug naar
  `100%`.

Compact verkleint geen tekst, labels of knoopsymbolen. Ouder-kindrelaties,
rollen, Flip, LEX-volgorde en anafoorverbindingen blijven gelijk. Bij meerdere
kernzinnen blijft iedere verplaatsing binnen haar eigen kernzin; Compact mag
K2/K3 nooit in de ruimte van een eerdere kernzin plaatsen.

De actieve Compact-markering betekent dat het veilige compacte preset actief
is. Verdere handmatige ruimteaanpassing mag de boom weer verruimen.

## Lokale SQLite-database

`data/testmateriaal.sqlite` is lokaal de volledige standaardcatalogus en reist
mee in de volledige project-ZIP. De lokale Python-server gebruikt haar voor de
viewer en `testmateriaal.html`. GitHub Pages kan SQLite niet bewerken en gebruikt
uitsluitend de afgeleide `data/catalog.public.json`.

Belangrijkste scheiding:

| Gegeven | Functie |
|---|---|
| oorspronkelijke input | onveranderde gebruikersinvoer |
| inputsegmenten | afzonderlijke zinnen van een meerzinsinput |
| analyseversie | voorgestelde kernzinnen, rollen en relaties |
| actieve analyse | de goedgekeurde versie die Graphlite mag tekenen |
| analysestatus | niet geanalyseerd / voorstel / goedgekeurd |
| publicatiestatus | onder meer `OK` of `TEST` |
| categorie/kenmerken | volgen uit de goedgekeurde kernzinanalyse |

`status = OK` en `analysis_status = GOEDGEKEURD` hebben verschillende taken.
Alleen `OK` bepaalt opname in de publieke catalogus; alleen een actieve
goedgekeurde analyse mag nieuwe graphdata leveren. In DB-schema 2 staan de
huidige kernzinanalyses nog als `VOORSTEL`; bestaande ingebouwde graphs vormen
tot de volgende schemamigratie de compatibiliteitslaag.

De categorieën zijn:

- `100` — Zin · simplex;
- `200` — Bijzin zonder hoofdzin, waaronder dat- en omdat-zinnen;
- `300` — Vraagzin; de input bevat verplicht `?` en geldt als `AF`;
- `400` — Zin · complex;
- `500` — Story; minimaal twee kernzinnen en een aantoonbare cross-kernelrelatie;
- `600–800` — gereserveerd;
- `900` — experimenteel.

`AF/ONAF` en kenmerken zoals anafoor, relatief, reflexief, context,
LEX-insertie en rol-flip staan los van de hoofdcategorie. `ONAF` kan dus in
iedere categorie voorkomen, behalve waar een specifieker contract dat uitsluit,
zoals de huidige vraagzinregel.

## Beheer en publicatie

In **Testmateriaal** zijn alle lokale records zichtbaar en bewerkbaar. Meerdere
records kunnen worden geselecteerd en in één transactie bijvoorbeeld op `TEST`
worden gezet. Iedere wijziging krijgt een revisierecord; daarna wordt de
publieke JSON eenmaal opnieuw opgebouwd.

Alleen records met exact `status = OK` gaan mee in
`data/catalog.public.json`. Nieuwe of gewijzigde input kan lokaal aanwezig zijn
zonder online zichtbaar te worden.

Een andere lokale database wordt veilig ingevoegd met:

```bat
voeg-lokale-db-in "C:\pad\naar\testmateriaal.sqlite"
```

Het commando controleert schema en integriteit, maakt een lokale reservekopie,
vervangt atomair, bouwt de publieke export en herstelt bij fouten de vorige
database.

## Controles

De releasecontrole bewaakt minimaal:

- DB-schema, SQLite-integriteit, vraagzin- en Story-contract;
- meervoudige statuswijziging via de echte lokale HTTP-route;
- alleen `OK` in de publieke export;
- zichtbare Syntax/Functional-schakelaar bij berekende kernzinviews;
- daadwerkelijk tekenen van `CLAUSE` en `ARG-STRUCT` in Functional;
- Compact-knop en compact-contract;
- onveranderde knoopidentiteiten en kernzingrenzen;
- uitsluitend upward LEX-verplaatsingen binnen de eigen kernzin.

Zie daarnaast `TESTMATERIAAL_BEHEER.md`, `UITING_EN_KERNZINNEN.md` en
`RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md`.
