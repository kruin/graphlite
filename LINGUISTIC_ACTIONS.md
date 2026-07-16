# LINGUISTIC_ACTIONS

Ontwerpnotities voor taalkundige acties in GraphLite.

## Principe

Taalkundige acties horen niet als willekeurige UI-knoppen door het scherm te zweven. Ze worden verzameld in een taalactiebox.

Voor nu bevat de taalactiebox alleen:

```text
‹ SOV ›
```

Later kunnen hier meer acties bijkomen.

## SOV/VSO/etc

De SOV/VSO/etc-keuze verandert de LOG/FT-volgordeprojectie.

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
- de lexicale inhoud.

Ze beïnvloedt alleen de logische/functionele volgordeprojectie.

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

## v1.0.3 LOG versus FT

- LOG is de projectie van logische volgorde, inclusief SOV/SVO/VSO-flips.
- FT is de functioneel-thematische laag met rollen zoals agens, patiens en predicaat.
- Een flip verandert LOG, niet SYNT, LEX of de FT-bronrollen.
