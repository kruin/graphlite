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

## Syntax en Functies

**Syntax** toont de syntactische structuur. **Functies** toont voor dezelfde
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

Syntax en Functies gebruiken dezelfde lexicale bronknopen, knoopidentiteiten,
LEX-realisatie, kernzingrenzen en cross-kernel-relaties. Wisselen van view
verandert dus geen analyse, woordvolgorde, anafoor of databasegegeven.

De tweestandenschakelaar **Syntax | Functies** staat permanent en prominent
buiten het menu **View/Placement method** wanneer de actieve toepassing een
berekende Language Tree of kernzincompositie is. Bij een uiting, story of
anafoorcompositie geldt de gekozen view voor iedere kernzin afzonderlijk.

Functies verschijnt alleen wanneer de actieve goedgekeurde analyse voldoende
rollen bevat. Greedy Grow, Random en kale Direct-weergaven krijgen geen
stilzwijgend afgeleide functionele analyse.

## Automatisch compacte plaatsing

De kernzinbomen worden automatisch aaneengesloten geplaatst; een aparte knop
**Compact** is daarom niet nodig. Ongebruikte gaten tussen bezette bronkolommen
worden verwijderd. Zo staat in testitem 420 `BRENGT` dichter bij de overige
knopen van K2, zonder dat tekst wordt verkleind.

Iedere knoop behoudt een eigen rij en kolom. Ouder-kindrelaties, rollen, Flip,
LEX-volgorde en anafoorverbindingen blijven gelijk. Bij meerdere kernzinnen
blijft iedere verplaatsing binnen haar eigen kernzin en K2/K3 worden niet in de
ruimte van een eerdere kernzin geplaatst. De bestaande handmatige H/V-
ruimtebediening kan de automatisch compacte basis daarna nog verruimen.

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

De knop **Testmateriaal** blijft op een lokaal desktopscherm in het hoofdmenu.
Op een publieke host is deze beheerknop verborgen. Op mobiel — staand én
liggend — worden alle beschikbare testitems samengebracht in één genummerde
keuzelijst boven de graph; er zijn daar geen afzonderlijke testmateriaallijsten.

De geforceerde interfacekeuze (**Automatisch**, **Desktop**, **Mobiel staand**
en **Mobiel liggend**) staat onder **Config → Algemeen**. Zij is een
weergave-/testinstelling en verplaatst het lokale testmateriaalbeheer niet naar
Config.

## LEX Play als gesproken uiting

Na het opbouwen van de kernzinbomen laat Play de gerealiseerde uiting op LEX
woord voor woord verschijnen. De volgorde loopt van boven naar beneden over de
LEX-as. Eerder verschenen woorden blijven zichtbaar wanneer het volgende woord
verschijnt. Pas nadat alle woorden zichtbaar zijn, worden de resterende
relaties en het volledige eindbeeld afgerond. Iedere wisselpijl blijft daarbij
gekromd, upward en binnen de eigen kernzin.

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
- zichtbare Syntax/Functies-schakelaar bij berekende kernzinviews;
- daadwerkelijk tekenen van `CLAUSE` en `ARG-STRUCT` in Functies;
- één mobiele testmateriaalkeuzelijst en lokaal beheer op het hoofdscherm;
- progressieve LEX Play in de zichtbare volgorde van boven naar beneden;
- automatische compacte kolomplaatsing en het eigen-kolomcontract;
- onveranderde knoopidentiteiten en kernzingrenzen;
- uitsluitend upward LEX-verplaatsingen binnen de eigen kernzin.

Zie daarnaast `TESTMATERIAAL_BEHEER.md`, `UITING_EN_KERNZINNEN.md` en
`RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md`.
