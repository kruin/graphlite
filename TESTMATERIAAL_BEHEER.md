# Testmateriaalbeheer · DB-schema 2

`data/testmateriaal.sqlite` is lokaal de volledige, leidende en standaardcatalogus. De lokale Python-server leest haar rechtstreeks voor zowel de beheerpagina als de viewer. De volledige bron-ZIP bevat deze database. GitHub Pages bevat haar niet. De database bewaart input, bronaliassen, segmenten, voorgestelde kernzinnen, cross-kernel-relaties en plaatsingsregels afzonderlijk.

Open Graphlite via de lokale starter en kies **Testmateriaal** in het hoofdmenu. Alle bestaande input is bij de eerste migratie `OK`. Nieuwe input krijgt later `NIEUW`. Een inhoudelijke wijziging van een bestaand `OK`-item zet het automatisch terug naar `TEST`, tenzij de gebruiker in dezelfde bewerking bewust opnieuw `OK` kiest.

De hoofdreeksen zijn: 100 Zin · simplex; 200 Bijzin; 300 Vraagzin; 400 Zin · complex; 500 Story; 600–800 Gereserveerd; 900 Experimenteel. `AF/ONAF` en kenmerken zoals anafoor, relatief, reflexief, context, LEX-insertie en rol-flip staan daar los van. Categorieën volgen uit de kernzinanalyse. Vraagzinnen bevatten verplicht `?` en zijn `AF`; Story bevat minimaal twee kernzinnen en minimaal één aantoonbare cross-kernel-relatie.

`data/catalog.public.json` is uitsluitend de statische GitHub-Pages-export. Alleen records met exact `status = OK` staan erin. Alle bronaliassen worden geëxporteerd, zodat samengevoegde dubbele invoer onder de bestaande viewer-ID’s bereikbaar blijft. `check_release.bat` bouwt en controleert deze export vóór publicatie. De viewer probeert lokaal eerst de SQLite-API en valt alleen online terug op deze JSON.

## Een nieuwe lokale database invoegen

Gebruik vanuit de uitgepakte projectmap:

```bat
voeg-lokale-db-in "C:\pad\naar\testmateriaal.sqlite"
```

Het commando controleert eerst DB-schema 2, SQLite-integriteit en de Story- en vraagzincontracten. Daarna maakt het in `data\backups` een lokale reservekopie, vervangt de database atomair, bouwt `catalog.public.json` opnieuw en voert de databasecontrole uit. Bij een fout wordt de vorige database automatisch teruggezet. Reservekopieën gaan niet mee naar GitHub of de volledige bron-ZIP.

## Meerdere statussen tegelijk wijzigen

De beheerpagina heeft selectievakjes per input en de keuze **Alles zichtbaar**. Kies daarna bijvoorbeeld `TEST` en druk op **Status toepassen**. Alle geselecteerde nummers worden in één database-transactie gewijzigd, ieder met een eigen revisierecord. Daarna wordt de publieke JSON eenmaal opnieuw opgebouwd. Filters kunnen eerst worden gebruikt; **Alles zichtbaar** selecteert uitsluitend de huidige gefilterde lijst.

## Analyse- en publicatiepipeline

Nieuwe input wordt nooit rechtstreeks als graph geïnterpreteerd. De normatieve afleiding is:

```text
ruwe input
→ inputrecord in SQLite
→ analysevoorstel
→ kernzinnen en relaties
→ goedkeuring van één analyseversie
→ categorie en kenmerken
→ actieve analyse
→ publieke JSON
→ Graphlite-engine
→ viewer
```

Bij nieuwe input zijn `analysis_status = NOG_NIET_GEANALYSEERD`, `category_code = NULL` en `active_analysis_version = NULL` de bedoelde beginwaarden. Een analyzer mag één of meer voorstellen toevoegen, maar mag de ruwe input niet vervangen of ontbrekend taalmateriaal verzinnen. Eenvoudige bekende patronen mogen lokaal deterministisch worden geanalyseerd; complexe of dubbelzinnige gevallen mogen door Codex worden voorbereid. De gebruiker hoeft geen kernzinnen handmatig in te voeren. Alleen inhoudelijk relevante alternatieven worden ter keuze voorgelegd.

Een voorstel bevat minimaal kernzinnen, relaties, reconstructiegegevens en een categorievoorstel. Het heeft `analysis_status = VOORSTEL` en is niet renderbaar. Pas na expliciete of contractueel toegestane automatische goedkeuring krijgt een analyse `analysis_status = GOEDGEKEURD` en wordt zij als `active_analysis_version` aangewezen. Een nieuwe voorstelversie verwijdert of overschrijft de vorige goedgekeurde versie niet.

De viewer leest uitsluitend de actieve, goedgekeurde analyse. Hij mag ruwe input, een voorstel of een alternatieve analyse nooit als noodgraph tekenen. Zonder actieve goedgekeurde analyse blijft het item lokaal zichtbaar in Testmateriaal met de melding **analyse nog niet goedgekeurd**; het verschijnt niet als nieuwe graph in de gewone viewer.

In een samengestelde kernzinweergave heet de zichtbare LEX-realisatie-as **Uiting**. Intern blijft dit de LEX-projectie. Iedere verplaatsing blijft binnen haar eigen kernzin, gaat in het actieve profiel uitsluitend omhoog en is in de vaste eindweergave herkenbaar aan een gekromde pijl. De centrale keuze **Syntax/Functional** geldt ook voor uitingen en anafoorcomposities; de knoopidentiteiten en relaties blijven bij die wissel gelijk. De keuze staat als een permanent zichtbare tweestandenschakelaar boven het hoofdmenu. Functional wordt alleen aangeboden voor berekende Language Trees en goedgekeurde kernzinanalyses waarvoor de rollen bekend zijn. Greedy Grow, Random en kale Direct-weergaven krijgen geen afgeleide functionele analyse.

Publicatiestatus en analysestatus zijn onafhankelijk. `status = OK` betekent dat een item publiceerbaar is, maar een nieuwe databasegestuurde graph vereist daarnaast een actieve goedgekeurde analyse. Een bestaande gepubliceerde analyse mag actief blijven terwijl een opvolgende versie als voorstel wordt bewerkt.

## Verantwoordelijkheden

| Onderdeel | Verantwoordelijkheid |
|---|---|
| SQLite | Ruwe input, versies, voorstellen, goedgekeurde analyse, categorie, kenmerken en publicatiestatus bewaren |
| Analyzer/Codex | Kernzinnen, relaties, LEX-realisatie, reconstructie en categorievoorstel maken |
| Beheerpagina | Voorstellen tonen, alternatieven vergelijken en goedkeuring beheren |
| Graphlite-engine | Uitsluitend de actieve goedgekeurde analyse omzetten in graphdata |
| Viewer | Graphdata tekenen; geen taalanalyse uitvoeren of aanvullen |

DB-schema 2 bewaart de huidige kernzinnen nog als `VOORSTEL`. De volledige versie- en activatietabellen hierboven zijn het contract voor de volgende schemamigratie; tot die migratie blijven de bestaande hardgecodeerde graphs de actieve compatibiliteitslaag.
