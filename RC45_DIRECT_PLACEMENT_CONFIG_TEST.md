# rc.45 test · toepassings-Config en Random v0.1

1. Open Config. Bovenaan staan drie groepen: **Algemeen**, **Calculated** en
   **Direct**. De knoppen zijn Algemeen, Language Tree, Greedy Grow en Random.
2. Kies **Algemeen**. Alleen algemene tabs zijn zichtbaar. Onder **Direct ·
   gedeeld** staan knopen per run, Play-snelheid, pad, nummers, diagnostiek,
   knoopgrootte en rastermarge. Language-Tree-, Greedy- en Random-velden zijn
   no-show.
3. Kies **Calculated → Language Tree**. Alleen Toepassingen, Beeld, LOG & LEX,
   JaN en Geavanceerd zijn zichtbaar. De Direct-panelen zijn no-show.
4. Ga terug naar Main, activeer **Greedy Grow** en open Config. Alleen Terug
   naar Main, Zoekstrategie, Oriëntatie, beide Uitleg-blokken en Config-save
   zijn zichtbaar. De toepassingsbalk, tabbladen, Algemeen, Language Tree en
   Random zijn volledig no-show.
5. Ga terug naar Main, activeer **Random** en open Config. Alleen Terug naar
   Main, de eigen Random-velden met Uitleg en Config-save zijn zichtbaar. De
   toepassingsbalk, tabbladen, Algemeen, Language Tree en Greedy Grow zijn
   volledig no-show. Er staan exact zeven keuzelijsten en drie
   getalvelden: Seed, Resetbeleid, Random-model, Plaatsing, Gridgrootte, Vaste
   kolommen, Vaste rijen, Snelheid, Hoe vaak en asimpact. De twee vaste maten
   zijn no-show zolang Gridgrootte niet op Vast grid staat.
6. Open bij ieder Greedy- en Random-veld **Uitleg**. Controleer dat de tekst
   effect en niet-effect uitlegt. Bij Seed moet staan dat `20260802` de datum 2
   augustus 2026 is en dat een groter getal niet meer toeval of snelheid geeft.
7. Kies **Vast grid**. Vaste kolommen en rijen worden zichtbaar. Vul minder in
   dan het aantal knopen per run; de effectieve engine-afmetingen moeten beide
   automatisch minimaal het aantal knopen blijven.
8. Kies onder Algemeen 12 knopen. Kies bij Random: seed 20260802, Vaste seed,
   snelheid 0,14 s, Vast grid 20 × 20 en 3 iteraties.
9. Kies **Uniform v1.0**. Main begint met
   `iteratie 1/3 · knoop 0/11`. WEST en SOUTH melden `0/3` rondes en bevatten
   nog geen hitspots.
10. Druk elfmaal Next. Main toont `iteratie 1/3 · knoop 11/11`. WEST bevat elf
    rij-hits en SOUTH elf kolomhits; beide melden `1/3`. Bewaar de twaalf
    knoopposities.
11. Voltooi ronde 2. Beide assen melden `2/3`; minstens één opnieuw geraakte
    coördinaat is donkerder en zwaarder. Druk eenmaal Previous: ronde 2 wordt
    uit het asbeeld genomen en `1/3` blijft over.
12. Druk Reset en schrijf ronde 1 opnieuw. Met Vaste seed, hetzelfde model,
    hetzelfde grid en dezelfde overige Config moeten de twaalf posities exact
    gelijk zijn. Wijzig alleen Snelheid; de posities moeten opnieuw gelijk
    blijven.
13. Kies **Onzuiver uniform v0.1 · hit-herhaling** en Reset. Ronde 1 is
    uniform. Vanaf ronde 2 mogen uitsluitend hits uit voltooide eerdere rondes
    de milde 20%-herhaalvoorkeur voeden. Unieke rijen en kolommen blijven hard.
14. Laat 50 rondes op een vast 48 × 48-grid met 31 knopen automatisch
    controleren. De vaste referentiereeks van v0.1 moet reproduceerbaar zijn en
    meer asvariantie hebben dan Uniform v1.0 met dezelfde seedreeks.
15. Controleer de grenssituatie met precies `N` rijen voor `N` knopen. Iedere
    niet-centrale WEST-plek moet iedere ronde geraakt worden; v0.1 kan daar dus
    geen patroon maken.
16. Kies asimpact **Uit**, **Bezettingskans** en **Relatief patroon**. Deze
    keuze verandert alleen het retrospectieve asbeeld en nooit de plaatsing.
17. Open Help. Controleer de seeduitleg, v0.1-formule en voorspelling, het vaste
    grid, snelheid, iteratiebediening en de no-show-contracten voor v0.2 en v0.3.
18. Bewaar Config, herlaad en controleer alle vier contexten. Schrijf de Config
    vervolgens naar `config/user-config.json` en controleer na herstart dat de
    userlaag de standaardconfig per sleutel overschrijft.
