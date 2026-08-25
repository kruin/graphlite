# Multi-OGN-anafoor — S1/S2-coreferentie

Normatief contract voor de berekende Graphlite-toepassing **Anafoor ·
multi-OGN** in source build `20260813.5`.

## Vast eerste voorbeeld

- S1: **Ik zie een man.**
- S2: **Hij draagt een hoed.**
- MAN in S1 is het **antecedent** (ook: antecedent-uitdrukking).
- HIJ in S2 is de **anafoor**.
- MAN en HIJ zijn **coreferentieel**: beide uitdrukkingen hebben in dit
  voorbeeld dezelfde referent.

De natuurlijke zinnen houden de lidwoorden *een*. De vereenvoudigde bomen en
de gezamenlijke LEX-as volgen het aangeleverde JPG-voorbeeld en tonen als
lexicale knopen alleen `IK · ZIE · MAN · HIJ · DRAAGT · HOED`.

Deze eerste versie implementeert alleen de terugverwijzende S1→S2-constructie.
Dat is een versiegrens en geen algemene uitspraak dat natuurlijke taal nooit
vooruitverwijzing (catafoor) kent.

## Berekening en compositie

De volgorde is verplicht:

1. bereken de boom van S1 als een afzonderlijke, complete OGN;
2. bereken de boom van S2 als een afzonderlijke, complete OGN;
3. valideer in iedere afzonderlijke OGN de unieke rijen en kolommen;
4. plaats S1 boven S2;
5. verschuif de complete S2 **star** (één gelijke `dx,dy` voor iedere
   S2-knoop) totdat HIJ exact de gridkolom van MAN deelt;
6. valideer de samengestelde multi-OGN-toestand;
7. teken één gezamenlijke verticale LEX-as met alle S1-items vóór alle
   S2-items;
8. teken MAN–HIJ als één rechte verticale lijn zonder pijl, richting of
   verwijzingslabel.

Een compositor mag dus geen subtree van S2 afzonderlijk herschikken. De
interne afstanden en topologie van beide eerder berekende bomen blijven
ongewijzigd. **star verschuiven** betekent dat iedere S2-knoop exact dezelfde
delta krijgt.

## Gridinvariant: per afzonderlijke OGN

Binnen iedere eenheid geldt onverkort:

```text
A ≠ B  ⇒  x(A) ≠ x(B)  en  y(A) ≠ y(B)
```

Voor de multi-OGN-compositie bestaat geen nieuwe samengevoegde OGN waarin alle
knopen onder één globale invariant vallen. Het bereik is **per afzonderlijke
OGN**.

Tussen S1 en S2 geldt in deze eerste versie een nauw begrensde uitzondering:

- exact één gedeelde kolom is toegestaan;
- die kolom moet het gedeclareerde paar `S1:MAN ↔ S2:HIJ` bevatten;
- geen ander paar uit verschillende OGN’s mag een kolom delen;
- knopen uit verschillende OGN’s mogen geen rij delen.

De uitzondering is dus relationeel gedeclareerd, niet door de renderer
toevallig gevonden.

## Relatiebeeld

De verticale MAN–HIJ-lijn drukt gelijkheid van referent uit. Zij is geen
bewegingspijl en geen grafische pijl voor “verwijst naar”.

Vast beeldcontract:

- `type = coreference`;
- `direction = none`;
- rechte verticale lijn;
- geen `marker-start`, `marker-mid` of `marker-end`;
- geen pijlpunt;
- geen zichtbaar label op de lijn;
- MAN blijft zichtbaar als antecedent en HIJ als anafoor.

## Gezamenlijke LEX-as

De as ordent de twee OGN’s in discoursevolgorde:

```text
S1: IK → ZIE → MAN
S2: HIJ → DRAAGT → HOED
```

Alle S1-items staan vóór/boven alle S2-items. Daarmee is zichtbaar dat S2 later
komt dan S1. De LEX-as verbindt de OGN-eenheden op compositieniveau; zij maakt
van de twee bomen geen enkele interne OGN-gridtoestand.

## Eerste-versiegrenzen

- vast voorbeeld; nog geen vrij invoerveld voor meer zinnen;
- precies twee OGN-eenheden;
- precies één antecedent–anafoorpaar;
- alleen starre verschuiving;
- S1 vóór/boven S2;
- geen catafoor of keten van meerdere anaforen;
- geen instelbare lijnrichting of pijlvorm.

Deze begrenzing is ook zichtbaar in Config. Er worden geen niet-functionele
knoppen aangeboden.

## Engine, opslag en controles

`multi-ogn-composition-engine.js` valideert de eenheden vóór en na de starre
compositie en weigert extra gedeelde rijen of kolommen.

OPN gebruikt `data.composition.schema = "ogn-multi-composition-v1"` en bewaart:

- de twee afzonderlijke graphs;
- hun volgorde;
- de starre verschuiving per eenheid;
- het invariantbereik `per-ogn`;
- de beperkte kruis-OGN-uitzondering;
- de ongerichte coreferentierelatie;
- de gezamenlijke LEX-volgorde.

De statische contracttest staat in `tools/check_multi_ogn_anaphor.js`. De
browsertest controleert daarnaast de werkelijk getekende nodecoördinaten, de
verticale lijn zonder pijlpunt en de LEX-volgorde.
