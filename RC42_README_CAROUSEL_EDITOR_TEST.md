# RC42-test · LEESMIJ-carousels

## Doel

Controleren dat ieder zichtbaar LEESMIJ-item een eigen carouselruimte heeft en
dat die carousel via Config veilig en begrijpelijk kan worden bewerkt.

## Automatische controle

```text
python tools/check_readme_carousel_editor.py
node tools/check_readme_carousel_editor_runtime.js
python tools/check_release.py
```

De controles bewaken:

1. een afzonderlijke Config-tab `LEESMIJ-carousels`;
2. alle basis-LEESMIJ-items in de onderwerpkeuze;
3. maximaal twintig slides per item;
4. toevoegen, verwijderen, vorige/volgende en herstellen;
5. beeldpad, breed/smal, alt-tekst NL/EN en onderschrift NL/EN;
6. directe voorvertoning en directe weergave in LEESMIJ;
7. bewaren en terugladen via `Ja · bewaar config`;
8. herstel naar de ingebouwde broncarousel of lege gereserveerde ruimte;
9. blokkeren van `javascript:`, `vbscript:`, `data:` en `file:` als beeldbron;
10. vrije tekstinvoer zonder activering van graph-sneltoetsen;
11. verbergen en opruimen van bijwoordonderwerpen wanneer Bijwoorden uitstaat.

## Handmatige controle en jouw akkoord

- [ ] Open `Config → LEESMIJ-carousels`.
- [ ] Kies achtereenvolgens enkele LEESMIJ-items; elk item heeft een eigen
  slide-aantal en voorvertoning.
- [ ] Het intro-item toont zijn vier bestaande bronbeelden.
- [ ] Kies een item zonder beelden en voeg een slide toe.
- [ ] Vul een bestaand lokaal beeldpad in.
- [ ] Vul alt-tekst en onderschrift in, zowel NL als EN.
- [ ] Typ in de onderschriften ook letters als `f`, `g`, `n` en `p`; Config
  blijft open en de graph verandert niet.
- [ ] Wissel tussen breed en smal; de voorvertoning blijft bruikbaar.
- [ ] Voeg een tweede slide toe en test vorige/volgende.
- [ ] Open LEESMIJ en controleer dezelfde carousel en onderschriften.
- [ ] Kies `Ja · bewaar config`, herlaad de viewer en controleer dat de
  carousel bewaard is.
- [ ] Kies `Herstel dit item`; de ingebouwde bronstandaard of lege
  carouselruimte komt terug.
- [ ] Test op mobiel staand en liggend: editorvelden en voorvertoning blijven
  volledig bereikbaar.
- [ ] De zins-/FIT-balk van Main en de lokale viewporttestknop liggen niet
  bovenop Config of LEESMIJ.

## Handmatig resultaat

```text
Datum:
Getest op:
Akkoord rc.42: ja / nee
Nog te herstellen:
```
