# OpenGraph Lite Viewer v2.0.5

Demo/viewer voor JaN / OPN / OpenGraph-taalstructuren.

## Start

Open:

```text
index.html
```

Of start lokaal met:

```bat
start-local-viewer.bat
```

GitHub Pages:

```text
https://kruin.github.io/graphlite/index.html?ogv=v2.0.5
```

## Talen

De app start bij een nieuwe installatie in **English**. Een eerder bewust gekozen taal blijft lokaal bewaard.

Beschikbare interfacetalen:

```text
English · Nederlands · Deutsch · Français · Español
```

Nederlands en Engels hebben de volledige interface- en uitle laag. In Duits, Frans en Spaans zijn de hoofdlabels vertaald; nog niet vertaalde technische uitleg valt terug op Engels.

**De voorbeeldzinnen zijn Nederlands en tonen Nederlandse woordvolgorde.** De gekozen interfacetaal vertaalt dus de bediening, niet de taalkundige voorbeelddata.

## Centrale views en projecties

```text
Views:       Syntax, Functional
Projecties:  LEX west, SYNT oost, LOG zuid
Default:     LEX + SYNT + LOG zichtbaar
```

LOG is geen centrale view. LOG-volgorde wijzigt uitsluitend de zuidprojectie.

## Topmenu

```text
Rij 1: Sentence/Zin · Adverb/Bijwoord · Syntax/Functional · Interface · Projections/Projecties · LOG order/LOG-volgorde
Rij 2: Language/Taal · README/LEESMIJ · Config
```

## Responsieve maximale view

Met `Boomruimte: Auto` volgt de grid-layout continu het werkelijk beschikbare canvas:

- portrait wordt smaller en hoger;
- landscape wordt breder en lager;
- desktop volgt de actuele vensterverhouding;
- viewBox en raster krijgen dezelfde schermverhouding;
- Syntax, Functional en alle projectiecombinaties behouden dezelfde positie en schaal binnen die viewport.

De volledige graph plus gekozen assen wordt zo groot mogelijk weergegeven zonder clipping.

## Interface

`Interface` en `Config → Boom → Interface` bieden Automatisch, Desktop, Mobiel staand en Mobiel liggend. Automatisch kiest op telefoon zelf de passende stand en herfit na oriëntatiewissel.

## Raster

Het raster staat standaard aan via:

```text
Config → Boom → Weergave → Raster zichtbaar
```

Op compacte schermen eindigt het raster bij de centrale boom en de uiteinden van de zichtbare projectielijnen. Handmatige interfacekeuzes veranderen deze inhoudsgrens niet.

## Groei en projecties

Met **Projecties groeien direct mee** verschijnt bij iedere nieuw gerenderde bronknoop meteen de geldige gekozen LEX-, SYNT- en/of LOG-projectie. LEX-Wissels volgen pas na de structurele knoopgroei.

## Eenvoudige releasewerkwijze

1. Pak de bronzip buiten Git uit.
2. Kopieer de inhoud over `C:\git\graphlite`; laat `.git` staan.
3. Start `start-local-viewer.bat` en test lokaal via `reset-cache.html`.
4. Start pas daarna `publish_checked.bat`.
5. Vul het commitbericht in; de BAT controleert, commit, pusht en opent na een geslaagde push de online resetpagina.

Er is geen `graphlite-next`, clone, bundle of promotiefase. De BAT gebruikt geen `git pull` en geen force-push. Zie `EENVOUDIGE_RELEASE_WERKWIJZE.md`.

## Controle

```bat
node --check viewer.js
check_release.bat
```

## Mobile landscape

Automatisch herkent een liggende telefoon via de korte viewportzijde en touch/coarse-pointer. Het landscapeprofiel maakt de graph platter en breder en voert na draaien opnieuw FIT uit.

## TODO

- Niet-binaire, meertakkige bomen.
- JaN (Just another Notation): `S:np-VP`, niet `S:NP-VP`.
- Werknotatie in onderzoek: `S+ np-VP`; eerst voor binaire bomen, later voor meertakkigheid.
- Flip van het verbale cluster: `heeft gebeten` ↔ `gebeten heeft`.
