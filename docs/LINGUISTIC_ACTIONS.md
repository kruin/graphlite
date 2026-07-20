# LINGUISTIC_ACTIONS

Ontwerpnotities voor taalkundige acties in GraphLite.

## Principe

Taalkundige acties horen niet als willekeurige UI-knoppen door het scherm te zweven. Ze worden verzameld in een taalactiebox.

Voor nu bevat de taalactiebox alleen:

```text
‹ SOV ›
```

Later kunnen hier meer acties bijkomen.

## LOG en FT

- LOG is de zuidas.
- LOG toont de logische S-O-V-volgordeprojectie.
- FT is géén onderdeel van de zuidas.
- FT is de functionele view naast de standaard syntaxboom-view.
- Een flip verandert LOG, niet SYNT, LEX of de FT-bronrollen.

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
- de FT-view als functionele rolbron.

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
- kan een trace/oude positie zichtbaar maken.

## v1.0.7 — View-keuze syntaxboom / functional structure

- Hoofdmenu krijgt een compacte `View`-keuze.
- Standaard: syntax tree / syntaxboom.
- Alternatief: functional structure met `CLAUSE`, `PRED`, `AGENS` en `PATIENS`.
- FT blijft een view naast de syntaxboom-view, niet een onderdeel van de LOG-zuidas.
- LOG blijft de zuidas voor de logische S-O-V-projectie.
