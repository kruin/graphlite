# rc.45 test · geïsoleerde Config voor Greedy Grow en Random

1. Kies **Language Tree** en open **Config → Direct**. Alleen Algemeen bevat:
   Knopen per run, Play-snelheid, pad, nummers, diagnostiek, knoopgrootte en
   rastermarge.
2. Ga terug, kies **Greedy Grow** en open Config. Het scherm bevat alleen
   Terug naar Main, Config-save, Zoekstrategie en Oriëntatie.
3. Controleer dat hoofdtabbladen, Algemeen/Greedy/Random-submenu, taalmenu,
   README-knop, algemene uitleg, configlog, Toon/Herstel en statusregels niet
   zichtbaar zijn.
4. Ga terug, kies **Random** en open Config. Het scherm bevat alleen Terug naar
   Main, Config-save, Seed, Resetbeleid, Spreiding, Hoe vaak, Impact op west-
   en zuidas en de berekende impactregel.
5. Controleer opnieuw dat alle algemene en methodevreemde bediening verborgen
   is.
6. Kies Algemeen: 31 knopen. Kies Random: 10 iteraties. De impactregel moet
   exact 10 × 30 = 300 waarnemingen per as melden.
7. Kies **Uit**. Er verschijnen geen Random-frequentielijnen langs de assen.
8. Kies **Bezettingskans**. Balklengte is telling gedeeld door 10 iteraties.
9. Kies **Relatief patroon**. De hoogst getelde coördinaat krijgt de maximale
   balk; andere balken worden daaraan gerelateerd.
10. Wissel tussen 1, 3, 10, 25, 50 en 100 iteraties. De berekende
    waarnemingentelling moet onmiddellijk volgen zonder de actieve run te
    resetten.
11. Kies bij Random een vaste seed en `Vaste seed herhalen`; Reset moet exact
    hetzelfde actieve beeld teruggeven.
12. Vergelijk Compact, Gebalanceerd en Ruim. Iedere afzonderlijke iteratie
    houdt unieke horizontale én verticale coördinaten.
13. Bewaar Config, herlaad en controleer de drie geïsoleerde blokken.
14. Schrijf de Config naar `config/user-config.json`; controleer na herstart
    dat de userlaag de standaardconfig per sleutel overschrijft.
