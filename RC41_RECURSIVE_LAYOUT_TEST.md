# RC41 recursieve layouttest

## Doel

Controleren dat iedere subtree-box uit haar werkelijke inhoud wordt gemeten,
de compacte LEX-goot nergens overlap veroorzaakt en volledige LEX- en
SYNT-inhoud in MAX zichtbaar blijft.

## Automatische controle

```text
NODE_PATH=<playwright-node_modules>
OGN_CHROMIUM_EXECUTABLE=<chromium>
node tools/check_recursive_box_fit_runtime.js
```

De test draait met een echte Chromium-browser en controleert:

1. alle zichtbare subtree-boxen hebben meetmodus `recursive-content`;
2. iedere box bevat recursief alle nodevormen, labels en child-boxen;
3. `NP → HOND` is smaller dan de vroegere vaste marge toeliet;
4. de rechterste LEX-Wissel overlapt de boom niet;
5. de resterende LEX-goot is maximaal 12 schermpixels;
6. alle LEX-inhoud valt binnen het SVG;
7. alle SYNT-regelboxen vallen binnen het SVG;
8. Syntax en Functional gebruiken dezelfde viewBox;
9. hetzelfde geldt voor mobiel staand, forced desktop en groot desktop;
10. met Bijwoorden actief blijven drie LOG-majors aanwezig en verschijnt
    minstens één LOG-minor.
11. alle 12 basiszinnen, alle 14 zinnen met de toepassing beschikbaar en de
    zes layoutdichtheden behouden dezelfde geometrische invarianten.

## Handmatige controle

- Open `HOND BIJT MAN` in mobiel staand.
- Vergelijk `BOX NP` rond HOND met `BOX VP`: NP moet zichtbaar smaller zijn.
- Controleer dat de NP-knoop en HOND volledig binnen de NP-box blijven.
- Controleer dat tussen de laatste blauwe Wissel en de boom slechts een smalle
  vrije strook staat.
- Schakel Syntax ↔ Functional: schaal en positie mogen niet springen.
- Controleer dat de groene regelboxen rechts volledig leesbaar binnen beeld
  blijven.
- Herhaal in mobiel liggend en met `Interface → Desktop`.
- Herhaal op een groot desktopscherm; ook daar blijft de LEX-goot maximaal
  12 schermpixels en gebruikt Syntax de gezamenlijke oostas.
- Activeer in Config eerst LEX + LOG-insertie en daarna Bijwoorden; kies een
  bijwoord en controleer de minor onder de drie majors.

## Verwacht resultaat

```text
RC41 RECURSIVE BOX FIT: OK
```
