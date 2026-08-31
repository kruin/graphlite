# LEX-asoriëntaties · v3.1.0-rc.10

De LEX-zijde staat op het hoofdscherm onder **LEX** en bovenaan onder **Config
→ Algemeen → Presentatie en leesrichting**. Daar zijn West, Oost, Noord en
Zuid direct kiesbaar; de onderliggende keuzelijst biedt dezelfde instelling.
De standaardwaarde is **Oost**. West blijft als alternatief beschikbaar. De
graphdata, kernzinnen, rollen, knoopidentiteiten en Flip worden
niet door de keuze herschreven.

| LEX-zijde | Leesrichting uiting | Boom ligt | S/Clause ontspringt |
|---|---|---|---|
| West | boven → beneden | rechts van LEX | boven |
| Oost | boven → beneden | boom blijft op dezelfde plaats; LEX rechts, SYNT links | boven |
| Noord | links → rechts | onder LEX | links |
| Zuid | links → rechts | boven LEX | links |

## Naar voren in de uiting

De semantische richting van een actieve LEX-Wissel heet voortaan **naar voren
in de uiting**. Dat wordt grafisch gerealiseerd als omhoog bij West/Oost en
naar links bij Noord/Zuid.

Hiermee blijft dezelfde regel bruikbaar voor topic, focus, nadruk, V1 en V2:
het lexicale element wil eerder in de mond genomen worden en eerder uit de mond
vertrekken. De uiteindelijke uiting zelf blijft altijd boven→beneden of
links→rechts leesbaar. Achterwaartse Wissels blijven buiten het actieve
profiel; insertie en Comp blijven afzonderlijk toegestaan.

## Implementatiecontract

West is de canonieke coördinatenruimte. Oost, Noord en Zuid worden rechtstreeks
uit West afgeleid; de renderer tekent dus niet eerst een tussenoriëntatie.
Labels en compacte knoop-/slotboxen worden na de assentransformatie
teruggedraaid, zodat tekst normaal leesbaar blijft. Het hulpraster blijft
ongedraaid en bepaalt het draaicentrum niet. Noord/Zuid gebruiken een grotere
woordlengte-afhankelijke horizontale woordstap en draaien de verticale oppervlaktevolgorde om naar
links→rechts zonder de woordvolgorde te spiegelen. LEX-zijde blijft
onafhankelijk van Flip, compactheid, Syntax/Functies, Interface en Play. De
keuze geldt voor alle berekende views, waaronder Uiting en Anafoor · multi-OGN;
Greedy Grow en Random behouden hun eigen directe assenruimte. Op mobiel meldt
een waarschuwing dat Noord/Zuid door woordlengte soms pannen of FIT vergt.

De horizontale plaats van de complete tekening in het scherm staat los van de
LEX-zijde. Onder **Config → Algemeen → Tekening in venster** kiest u **Links**
(standaard), **Midden** of **Rechts**. Dit verdeelt alleen de vrije
schermmarge; boom- en projectiecoördinaten blijven ongewijzigd.
Bij Noord/Zuid wordt de losse zintitel naast de graph verborgen; de woorden op
de uitingsas en de actieve uiting boven het canvas blijven zichtbaar. De
vrijgekomen ruimte hoort bij de regel- en labeltekst van de projecties.

## Maatvoering

Noord en Zuid sluiten standaard met hun werkelijke inhoud zonder FIT-marge
links aan; de algemene vensteruitlijning kan dit bewust naar Midden of Rechts
verplaatsen. De lengte van de horizontale as en de meedraaiende vertakkingen
wordt bepaald door de breedste aanwezige grafische vorm: LEX-items, zichtbare
labels, knoopomtrekken, slotboxen en LOG-badges.
De dwarsmaat gebruikt de gemeten stabiele teksthoogte plus een kleine leesgoot;
de oude brede verticale gridcel wordt niet als horizontale celhoogte hergebruikt.

West en Oost gebruiken één berekende ruimtecorridor. De grootste benodigde
ruimte van LEX en SYNT in beide standen bepaalt vooraf zowel de linker- als de
rechterreserve. De boom zelf wordt niet getransformeerd, gespiegeld of
verplaatst: alleen LEX en SYNT wisselen van zijde. Oost is dus nadrukkelijk
geen Flip.

## rc.9: Noord/Zuid en lijsten

Bij Zin-simplex gebruiken Noord en Zuid dezelfde grammaticale boomrichting.
Zuid wisselt eerst de canonieke LEX- en SYNT-zijde en gebruikt daarna dezelfde
rotatie als Noord. Daardoor verplaatst alleen de as; NP/VP- en NP/V-takken
worden niet ongemerkt geflipt. De simplex-dwarsmaat volgt de gemeten
teksthoogte, zodat de horizontale view compact blijft. De afzonderlijke
Uiting-compositie behoudt haar eigen reeds geldige Noord/Zuid-geometrie.

Oost is de startdefault en wordt eenmalig pas ná project- en browser-Config
toegepast. Config biedt voor Noord/Zuid afzonderlijke LEX-schakelaars voor
K1–K8. Desktop en mobiel gebruiken dezelfde volledige testmateriaalcatalogus.
Per interface zijn één tot vier echte lijstpanelen mogelijk. Een groep blijft
altijd volledig binnen één paneel; standaard scheidt desktop de families Zin
en Uiting over twee panelen, terwijl mobiel met één paneel begint.
