# LINGUISTIC_ACTIONS

Ontwerpnotities voor taalkundige acties in GraphLite.

## Views

```text
Syntax tree              standaardweergave
Functional structure     standaard alternatieve weergave
```

## Named projections

```text
LEX    zichtbare woordvolgorde, lexicale plaatsing en projectiemerkers
SYNT   syntactische regels en categorieprojectie
LOG    logische S-O-V-volgordeprojectie
```

Elke named projection heeft eigen selectieregels.

## Projectiemerkers

De punten op named projections heten projectiemerkers.

```text
source node → projection line → projection marker
bronknoop   → projectielijn     → projectiemerker
```

Een projectiemerker is geen nieuwe centrale knoop.

## Taalactiebox

Voor nu bevat de taalactiebox:

```text
‹ SOV ›
```

De SOV/VSO/etc-keuze verandert de LOG-volgordeprojectie.

```text
SOV
SVO
OVS
OSV-!
VSO-!
VOS-!
```

`!` markeert een niet-neutrale of gemarkeerde variant.

## Geen syntaxmutatie

De SOV/VSO/etc-actie verandert niet:

- de centrale boomstructuur;
- de SYNT-projectie;
- de lexicale inhoud;
- de Functional structure-view.

Ze beïnvloedt alleen de LOG-volgordeprojectie.

## LEX-stappen

```text
1. Centrale bronknopen plaatsen.
2. LEX-projectiemerkers schrijven.
3. LEX-Wissels toepassen op gereserveerde lege plekken.
```

Verplaatsingen op de as worden pas actief nadat alle centrale knopen zijn geplaatst.

## Lege plekken op LEX

```text
Comp-slot                bijvoorbeeld OMDAT / DAT
vooropplaatsing/topic    eerste zinsdeel
V2/PV-slot               persoonsvormpositie
bijwoordslot             externe LEX-insertie
trace                    oude basispositie na Wissel
```

Ruimte kan worden gemaakt door:

```text
vrije rij
verlengde tak
host-subboom lager plaatsen
```

## Bijwoordplaatsing

Bijwoorden zijn LEX-inserties:

- extern toegevoegd;
- niet uit de syntaxboom geprojecteerd;
- geplaatst op de LEX-as;
- syntaxbox is hoogstens anker, geen bron.

## Wissel

Een Wissel is een LEX-regel:

- zichtbaar op de LEX-as;
- verandert woordvolgorde;
- laat syntaxstructuur ongemoeid;
- kan een trace/oude positie zichtbaar maken.


## Assen bij Bron (v2.0.0-rc.6)

- `Bron` is de centrale Syntax- of FT-view zonder verplichte named projection.
- De gebruiker kan bij Bron afzonderlijk LEX, SYNT en LOG activeren.
- De assen zijn onafhankelijk combineerbaar.
- De centrale bronstructuur muteert niet door deze keuze.
- De LOG-volgordeactie blijft uitsluitend gekoppeld aan een zichtbare LOG-as.
