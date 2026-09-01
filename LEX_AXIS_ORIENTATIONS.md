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
| Noord | links → rechts; ieder LEX-item letter voor letter verticaal | onder LEX | links |
| Zuid | links → rechts; ieder LEX-item letter voor letter verticaal | boven LEX | links |

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

West is de canonieke coördinatenruimte. Oost wordt rechtstreeks uit West
afgeleid. Noord en Zuid leggen eerst de volledige assenruimte in de gekozen
Noord/Zuid-view vast. De draaiknop regelt daarna handmatig de overgang van
een horizontale woordrij (0°) naar een verticale letterkolom (90°). Iedere
tussenstand is zichtbaar en omkeerbaar. De boomspreiding volgt exact dezelfde
knopstand; LEX, SYNT, LOG en hun verbindingen bewegen met de versmalling mee.
De view zelf draait dus niet opnieuw van West naar Noord/Zuid.
Gewone labels en compacte knoop-/slotboxen worden na de assentransformatie
teruggedraaid, zodat tekst normaal leesbaar blijft. Alleen LEX-items worden
letter voor letter verticaal gezet, bijvoorbeeld `M` / `A` / `N`. De
lettervolgorde blijft in Noord én Zuid van boven naar beneden; de uiting blijft
langs de as links naar rechts lezen. Het hulpraster blijft
ongedraaid en bepaalt het draaicentrum niet. Noord/Zuid gebruiken een grotere
woordlengte-afhankelijke horizontale woordstap en draaien de verticale oppervlaktevolgorde om naar
links→rechts zonder de woordvolgorde te spiegelen. LEX-zijde blijft
onafhankelijk van Flip, compactheid, Syntax/Functies, Interface en Play. De
keuze geldt voor alle berekende views, waaronder Uiting en Anafoor · multi-OGN;
Greedy Grow en Random behouden hun eigen directe assenruimte. Op mobiel meldt
een korte aanwijzing dat FIT de volledige meegedraaide assen opnieuw kadert.

De horizontale plaats van de complete tekening in het scherm staat los van de
LEX-zijde. Onder **Config → Algemeen → Tekening in venster** kiest u **Links**
(standaard), **Midden** of **Rechts**. Dit verdeelt alleen de vrije
schermmarge; boom- en projectiecoördinaten blijven ongewijzigd.
Onder **Config → Algemeen → Marge links** kan bovendien 0–25% extra vrije
FIT-ruimte links worden gekozen; de standaard is 0%. Een klik op **FIT** past
deze marge toe op de complete graph, inclusief alle meedraaiende assen.
Bij Noord/Zuid wordt de losse zintitel naast de graph verborgen; de woorden op
de uitingsas en de actieve uiting boven het canvas blijven zichtbaar. De
vrijgekomen ruimte hoort bij de regel- en labeltekst van de projecties.

## Maatvoering

Noord en Zuid sluiten standaard met hun werkelijke inhoud en een kleine vaste
zichtmarge links aan. De LEX-as begint vlak vóór het eerste werkelijke
LEX-item, zichtbare slot of projectiepunt en eindigt vlak na het laatste; een
kunstmatige systeemstaart telt niet mee. De algemene vensteruitlijning kan dit bewust naar Midden
of Rechts verplaatsen. In Main telt de verborgen editor-rechterkolom niet mee:
het SVG gebruikt daar de volledige beschikbare vensterbreedte. De lengte van
de horizontale as en de meedraaiende vertakkingen wordt in Noord/Zuid niet meer
door de volle breedte van een LEX-woord bepaald. De compacte structurele vorm
plus leesgoot bepaalt de doelkolom. Tijdens de graduele letterdraaiing wordt de
boom daarom zichtbaar smaller. De tegenoverliggende Noord- of Zuid-as en alle
overige projecties draaien als één assenruimte mee.
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
De verticale LEX-items, draaiknop en graduele versmalling gelden gelijk voor
Zin, Uiting en Anafoor; dit verandert geen knoop, takvolgorde, anafoorkolom of
Flip.

## Bediening · Draaiknop

Kies bij Zin-simplex eerst **LEX · Noord** of **LEX · Zuid** en open daarna
dezelfde LEX-control. Pak de ronde draaiknop vast en sleep rondom het middelpunt.
Bij **0°** staat `HOND` op een woordrij. Terwijl de knop naar **90°** draait,
gaan `H / O / N / D` stap voor stap onder elkaar staan en worden boom en assen
gelijktijdig smaller. Terugdraaien maakt alles weer breder. De control toont de
actuele graad. Bij ieder gekozen testitem wordt de beginstand opnieuw
gekalibreerd. Meer kernzinnen, meer labels of een langer LEX-item leveren een
grotere beginhoek op: de items staan dan verticaler en de complete graph neemt
minder horizontale ruimte in. Daarna blijft iedere handmatige tussenstand
mogelijk. Met de
pijltjestoetsen verandert de stand één graad per stap; `Home` kiest 0° en `End`
kiest 90°. De Noord/Zuid-view zelf blijft tijdens deze bediening staan.
Tijdens het draaien blijft ook het zichtvenster vast. Daardoor is de
versmalling werkelijk zichtbaar en wordt zij niet door een automatische FIT
weggezoomd. Klik pas na het instellen bewust op **FIT** wanneer de actuele
stand opnieuw beeldvullend moet worden gekaderd.
Dezelfde draaiknop werkt bij alle berekende testmateriaalitems: Zin-simplex,
Uiting en Anafoor/multi-OGN. De volledige inhoudelijke assenruimte versmalt
mee: LEX, SYNT en LOG, hun projectielijnen, markers, boom en LEX-items. Het
raster blijft als schermreferentie staan. Bij drukke items worden LEX-, regel-
en aslabels automatisch iets lichter en zo nodig iets kleiner. Tekst en de bijbehorende regel- en LOG-boxen
worden lokaal rechtop gehouden, zodat een label niet uit een smalle gedraaide
box loopt. FIT meet de werkelijk getransformeerde actuele knopstand.
De onderlinge letterafstand gebruikt geen vaste gok: voor ieder LEX-item wordt
eerst de werkelijke tekstbreedte en teksthoogte in het actieve font gemeten.
De horizontale woordrij krijgt minimaal 15 SVG-eenheden per letter en de
verticale letterkolom minimaal 24 SVG-eenheden regelafstand. Brede kapitalen
zoals `M` en `W` kunnen daardoor niet over hun buurletter heen vallen.

Oost is de startdefault en wordt eenmalig pas ná project- en browser-Config
toegepast. Config biedt voor Noord/Zuid afzonderlijke LEX-schakelaars voor
K1–K8. Desktop en mobiel gebruiken dezelfde volledige testmateriaalcatalogus.
Per interface zijn één tot vier echte lijstpanelen mogelijk. Een groep blijft
altijd volledig binnen één paneel; standaard scheidt desktop de families Zin
en Uiting over twee panelen, terwijl mobiel met één paneel begint.
