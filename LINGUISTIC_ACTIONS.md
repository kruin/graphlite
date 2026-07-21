# LINGUISTIC_ACTIONS

Ontwerpnotities voor taalkundige acties in GraphLite.

## Views

```text
Syntax tree              standaardweergave
Functional structure     standaard alternatieve weergave
```

Functional structure toont functionele rollen zoals:

```text
CLAUSE
AGENS
PRED
PATIENS
```

## Projectie-assen

```text
LEX    zichtbare woordvolgorde en lexicale plaatsing
SYNT   syntactische regels en categorieprojectie
LOG    logische S-O-V-volgordeprojectie
```

## Principe

Taalkundige acties worden verzameld in een taalactiebox.

Voor nu bevat de taalactiebox:

```text
‹ SOV ›
```

## SOV/VSO/etc

De SOV/VSO/etc-keuze verandert de LOG-volgordeprojectie.

Mogelijke modi:

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

## Later uitbreidbaar

Kandidaten voor latere taalacties:

- lexicale insertie;
- bijwoordplaatsing;
- LEX-wissel;
- focus/contrast;
- negatiebereik;
- V2/PV-plaatsing;
- topicalisatie.

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
- kan een tracepositie zichtbaar maken.
