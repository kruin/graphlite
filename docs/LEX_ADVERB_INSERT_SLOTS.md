# LEX-bijwoordslots - verschil in plaatsing

Versie: v4506

Deze notitie legt vast waar vrije LEX-inserts voor bijwoorden worden gereserveerd. De centrale boom blijft bronstructuur. Bijwoorden worden in deze fase niet als extra centrale boomknopen toegevoegd, maar als **externe LEX-inserts** of als **phrase-interne slots** op de LEX-as gerenderd.

## Hoofdregel

1. Reserveer standaard vrije slots **tussen zichtbare LEX-boxen**.
2. Als twee relevante boxen verticaal overlappen, plaats het slot op het midden van die overlap.
3. Corrigeer de plaatsing daarna met **scope**: het type bijwoord bepaalt of het slot hoog, VP-intern, V-nabij of phrase-intern moet zijn.

Dus:

```text
slot = boxgrens + verticale overlap + scope van het bijwoord
```

## Plaatsingsklassen

| klasse | plaats op LEX-as | functie |
|---|---|---|
| `S-LEFT` | vóór de zin / hoog links | vooropgeplaatste zinsbijwoorden |
| `S/VP` | overgang tussen zin en VP | zinsbijwoorden met propositie-scope |
| `VP-BETWEEN` | tussen argumentboxen of tussen V en object | tijd en frequentie |
| `VP-RIGHT` | rechts in VP | rechterrand voor tijd/frequentie/partikels |
| `V-NEAR` | vlak bij V/predicaat | wijze, werkwoordnabijheid |
| `NEG` | apart V-nabij negatieslot | `NIET` |
| `FOCUS` | bij de gefocuste phrase | `ALLEEN`, `OOK`, `ZELFS` |
| `AP/AdvP-INTERNAL` | intern in AP/AdvP/NP | graadwoorden |

## Bijwoorden en voorkeursplaatsing

| bijwoord | type | voorkeursplaatsing | opmerking |
|---|---|---|---|
| `GISTEREN` | tijd | `VP-BETWEEN` of `S-LEFT` | `HOND BIJT GISTEREN MAN`; bij vooropplaatsing is een LEX-regel nodig. |
| `MORGEN` | tijd | `VP-BETWEEN` of `S-LEFT` | Zelfde patroon; geen centrale boomknoop. |
| `VAAK` | frequentie | `VP-BETWEEN` | In bijzinnen vaak tussen subject en object: `OMDAT HOND VAAK MAN BIJT`. |
| `SOMS` | frequentie | `VP-BETWEEN` | VP-scope; lager dan S-bijwoorden. |
| `ALTIJD` | frequentie | `VP-BETWEEN` | VP-scope; niet AP/NP-intern. |
| `NIET` | negatie | `NEG` / `V-NEAR` | Apart slot, meestal object - `NIET` - V of VP-rechts. |
| `SNEL` | wijze | `V-NEAR` | Dicht bij V/predicaat; in perfectum vaak object - `SNEL` - participium. |
| `HARD` | wijze | `V-NEAR` of `VP-RIGHT` | Niet hoog als zinsbijwoord. |
| `ZACHTJES` | wijze | `V-NEAR` | Dicht bij de werkwoordelijke kern. |
| `MISSCHIEN` | zinsbijwoord | `S/VP` of `S-LEFT` | Hoge scope; niet V-nabij. |
| `WAARSCHIJNLIJK` | zinsbijwoord | `S/VP` | Scope over de propositie. |
| `HELAAS` | zinsbijwoord | `S-LEFT` of hoog `S/VP` | Vaak vooraan; vooropplaatsing vraagt een LEX-regel. |
| `ALLEEN` | focus | `FOCUS` | Bij subject, object of VP waarop het focus legt. |
| `OOK` | focus/partikel | `FOCUS` of `VP-RIGHT` | Bij de phrase waarop `OOK` scope heeft. |
| `ZELFS` | focus | `FOCUS` | Direct bij de gefocuste phrase. |
| `HEEL` | graad | `AP/AdvP-INTERNAL` | Bijvoorbeeld `HEEL GROTE HOND`; geen algemeen tussenbox-slot. |
| `ERG` | graad | `AP/AdvP-INTERNAL` | Bijvoorbeeld `ERG HARD`; intern bij wijze/AP. |
| `ZEER` | graad | `AP/AdvP-INTERNAL` | Phrase-intern bij AP/AdvP. |

## Voorbeelden per plaatsing

### Tijd en frequentie: tussenbox / VP

```text
HOND BIJT GISTEREN MAN
HOND BIJT GISTEREN MAN
HOND BIJT MORGEN MAN
HOND BIJT VAAK MAN
HOND BIJT SOMS MAN
HOND BIJT ALTIJD MAN
```

Advies: reserveer een slot tussen de V-box en de object-NP-box. Als de VP-box en objectzone verticaal overlappen, gebruik het midden van die overlap.

Bijzin:

```text
OMDAT HOND GISTEREN MAN BIJT
OMDAT HOND VAAK MAN BIJT
```

Advies: reserveer een VP-intern slot tussen subject-NP en object-NP of tussen object-NP en V, afhankelijk van de gekozen LEX-regel.

### Negatie: apart NEG-slot

```text
HOND BIJT MAN NIET
OMDAT HOND MAN NIET BIJT
VROUW HEEFT TRUI NIET GEBREID
```

Advies: behandel `NIET` niet als gewoon tijdsbijwoord. Gebruik een apart NEG-slot dicht bij V/predicaat.

### Wijze: V-nabij

```text
HOND BIJT MAN HARD
HOND BIJT MAN ZACHTJES
VROUW HEEFT TRUI SNEL GEBREID
```

Advies: `SNEL`, `HARD` en `ZACHTJES` horen bij de werkwoordelijke kern. Reserveer daarom een V-nabij slot of een VP-rechts slot, niet een hoog S-slot.

### Zinsbijwoorden: hoog S/VP

```text
MISSCHIEN BIJT HOND MAN
WAARSCHIJNLIJK BIJT HOND MAN
HELAAS BIJT HOND MAN
OMDAT HOND MISSCHIEN MAN BIJT
```

Advies: `MISSCHIEN`, `WAARSCHIJNLIJK` en `HELAAS` hebben zins- of propositie-scope. Gebruik `S-LEFT` bij vooropplaatsing en een hoog `S/VP`-slot bij interne plaatsing.

### Focus: bij de gefocuste phrase

```text
ALLEEN HOND BIJT MAN
HOND BIJT ALLEEN MAN
HOND BIJT MAN OOK
ZELFS HOND BIJT MAN
```

Advies: `ALLEEN`, `OOK` en `ZELFS` horen bij de phrase waarop ze focus leggen. Plaats ze dus bij subject-NP, object-NP of VP, niet automatisch tussen twee grote boxen.

### Graad: phrase-intern

```text
HEEL GROTE HOND BIJT MAN
HOND BIJT ERG HARD
ZEER GROTE HOND BIJT MAN
```

Advies: `HEEL`, `ERG` en `ZEER` zijn geen algemene LEX-as-inserts. Ze horen intern in AP/AdvP/NP. Voor de viewer kunnen ze als LEX-insert worden getest, maar de documentatie markeert ze als phrase-intern.

## Implementatieregel

Voor de viewer/config:

```text
1. maak vrije LEX-slots tussen LEX-boxen;
2. plaats het slot op verticale overlap als die bestaat;
3. kies per bijwoordtype een voorkeursdomein;
4. voeg het bijwoord toe als externe LEX-insert of phrase-interne insert;
5. herschrijf de centrale boom niet.
```

## Relatie tot OSV-!

OSV-! bevestigt dezelfde scheiding. De box-aanpak kan geen OSV als basisboom opleveren. Als de LEX-as een andere oppervlakteschikking nodig heeft, moet een LEX-verplaatsingsregel werken. Bijwoorden en OSV-! horen dus in de LEX-renderlaag, niet als basisalternatief van de centrale boom.

## v4511 - OSV-!, VSO-! en VOS-!

`VSO` en `VOS` worden nu net als `OSV` gemarkeerd: `VSO-!` en `VOS-!`. Het uitroepteken betekent dat de box-aanpak deze volgorde niet als basisalternatief kan opleveren. Correcte LEX-rendering vraagt een expliciete verplaatsingsregel. Bestaande bomen en bestaande flips blijven ongemoeid.

