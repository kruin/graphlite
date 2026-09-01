# FIT, Ruimte slepen en Reset · bedieningscontract

## FIT

`FIT` is een vaste instructieterm in OpenGraph Lite:

> **Klik FIT om de actuele graph met alle zichtbare named projections opnieuw
> volledig en passend in het tekenvenster te zetten.**

FIT doet uitsluitend iets met het zichtvenster:

- wist handmatig pannen en zoomen;
- meet de actuele boom en de zichtbare LEX-, SYN- en LOG-projecties opnieuw;
- zet daar een kleine, stabiele zichtmarge omheen;
- gebruikt in Noord/Zuid ook de verticale LEX-items en de meegedraaide assen;
- geeft bij dezelfde graph en venstermaten opnieuw hetzelfde kader.

FIT verandert **geen** knoop, tak, boomruimte, Flip, woordvolgorde,
LEX-verplaatsing, Config, Play-stap of opgeslagen projectdata. FIT is dus geen
layoutbewerking en geen Reset.

Onder **Config → Algemeen → Marge links** kan 0–25% extra vrije ruimte links
aan het FIT-kader worden toegevoegd; standaard is dit 0%. Daardoor schuift de
complete graph bij FIT naar rechts zonder knopen of assen afzonderlijk te
verplaatsen. De instelling verandert alleen het zichtvenster. Na handmatig
pannen past een klik op **FIT** de gekozen marge opnieuw toe.

Korte UI-tekst:

> **FIT = actuele graph volledig passend in beeld.**

## Ruimte slepen (RZ)

Main bevat geen afzonderlijke knop `Ruimtezoom`. De functie wordt alleen
geactiveerd via:

**Config → Language Tree → Ruimte slepen**

Na activering sleept de gebruiker rechtstreeks vanaf een knoop. Horizontaal
slepen verandert de gezamenlijke boomruimte; verticaal slepen verandert de
ruimte van de actieve zin of kernzin. Anafoorkolommen blijven gekoppeld en dus
recht. **Ruimte terug naar Auto** herstelt de ruimtewaarden naar 100%.

`RZ` kan in werkinstructies als korte naam worden gebruikt, maar de zichtbare
Config-naam blijft **Ruimte slepen**. Zo blijft Main rustig en blijft de functie
vindbaar zonder verborgen toetscombinatie of langklik.

## Reset en Volledige startstand

De huidige knop `Reset` herbouwt het actieve voorbeeld en zet Play,
selectie, tijdelijke projectiestappen, lokale ruimte en pan/zoom terug. Hij wist
geen opgeslagen Config, testmateriaal, projectbestand of browserdatabase.

Bij iedere browserstart geldt automatisch de **Volledige startstand**:

1. **Volledige startstand bij iedere viewerstart**: standaarditem, standaardview,
   projecties, Play, pan/zoom en lokale ruimte opnieuw instellen.
2. Een expliciete `?item=...`-link blijft voorgaan, zodat publicatielinks het
   bedoelde testitem blijven openen.
3. Bewust opgeslagen Config, projectdata, testmateriaal en README-bewerkingen
   blijven behouden.
4. Een echte fabrieksreset die browseropslag wist blijft een afzonderlijke
   Config-actie met waarschuwing; die hoort niet onder de gewone Reset-knop.

De Volledige startstand **bewaart** dus:

- de bewust opgeslagen Config-snapshot;
- projecten en OPN-bestanden;
- lokaal en publiek testmateriaal;
- de browserdatabase;
- README-teksten, carrousels en andere bewaarde inhoud.

De Volledige startstand **herstelt** uitsluitend:

- het standaarditem (behalve bij een expliciete `?item=...`-link);
- Syntax als centrale startview en alle drie projecties;
- Play, selectie, Flip en tijdelijke projectiestappen;
- handmatig pannen/zoomen en lokale zin-/kernzinruimte.

De gewone knop **Reset** doet hetzelfde voor het actuele item en blijft op dat
item. Hij wist geen browseropslag. Een toekomstige knop **Fabrieksreset** hoort
alleen in Config, met een opsomming van te wissen gegevens en een bevestiging.
