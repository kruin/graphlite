# Config voor directe plaatsing

Dit is de documentatiekopie van
[`../DIRECT_PLACEMENT_CONFIG.md`](../DIRECT_PLACEMENT_CONFIG.md).

Config is toepassingsgericht en gebruikt overal **no-show** voor irrelevante
velden:

- **Algemeen**: projectbrede en gedeelde instellingen;
- **Calculated → Language Tree**: uitsluitend Language Tree;
- **Direct → Greedy Grow**: uitsluitend de twee eigen Greedy-velden;
- **Direct → Random**: uitsluitend de eigen Random-velden.

In de actieve Greedy-Grow- of Random-modus is ook de Config-hiërarchie zelf
no-show. Config toont dan alleen **Terug naar Main**, de eigen bewerkbare
velden met uitleg en **Config opslaan**. Algemeen, Language Tree en de andere
directe methode zijn daar niet zichtbaar; wisselen begint in Main.

Ieder zichtbaar veld heeft een compacte, inklapbare uitleg. De volledige vaste
regel staat in
[`CONFIG_UI_EXPLANATION_STANDARD.md`](CONFIG_UI_EXPLANATION_STANDARD.md).

Random bevat nu functioneel **Uniform v1.0** als ongewijzigde standaard en
**Onzuiver uniform v0.1 · hit-herhaling** als alternatief. v0.1 mengt per vrije
ascoördinaat 80% uniform met 20% voorkeur op basis van hits in voltooide eerdere
rondes. De eerste ronde is uniform. Dezelfde seed, versie, gridgrootte en alle
overige instellingen leveren dezelfde reeks; een grotere seed geeft niet meer
toeval en verandert de snelheid niet.

Gridgrootte kan de interface volgen, een vast aantal kolommen en rijen gebruiken
of met de inhoud meegroeien. De vaste maten worden minimaal gelijk aan het
aantal knopen per run. Snelheid gebruikt de gedeelde Play-klok en beïnvloedt
alleen de zichtbare wachttijd.

Projectie-hits verschijnen uitsluitend na voltooide rondes. Rijen projecteren
naar WEST en kolommen naar SOUTH; herhaalde hits maken dezelfde spot donkerder
en zwaarder. Voorspellingen, de v0.1-formule en de nog verborgen contracten voor
v0.2 en v0.3 staan in het volledige contract.
