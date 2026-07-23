# GROWING_PROJECTIONS_TEST

Testplan voor `v2.0.0-rc.19`.

## Voorbereiding

1. Open `index.html`.
2. Kies `Projecties → Alle`.
3. Open `Config → Boom → Weergave`.
4. Controleer dat `Projecties groeien direct mee` is aangevinkt.
5. Klik Reset en daarna Play.

## Verwacht per groeistap

- De nieuwe centrale knoop verschijnt.
- Een geldige gekozen projectie van die knoop verschijnt in dezelfde renderstap.
- Bestaande projecties behouden exact hun positie.
- De viewBox en schaal veranderen niet.

## LEX

- Een lexicale projectielijn en projectiemerker verschijnen pas wanneer de corresponderende bronknoop zichtbaar is.
- Nog niet gerenderde lexicale bronknopen hebben geen marker.
- Na de laatste centrale knoop volgen de LEX-Wissels als afzonderlijke stappen.

## SYNT en FT

- Een regel verschijnt zodra de bijbehorende centrale categorieknoop verschijnt.
- Alleen regels van reeds zichtbare bronknopen zijn zichtbaar.

## LOG

- S, O en V verschijnen afzonderlijk zodra hun bronknoop zichtbaar is.
- De definitieve LOG-slotpositie verandert niet wanneer later andere LOG-items verschijnen.

## Projectiekeuzes

Herhaal de test voor:

- Alle;
- Geen/Bron met LEX;
- Geen/Bron met SYNT;
- Geen/Bron met LOG;
- LEX-only;
- SYNT-only;
- LOG-only;
- Syntax-view;
- FT-view.

## Vertraagde compatibiliteitsmodus

1. Zet `Projecties groeien direct mee` uit.
2. Start Groei opnieuw.
3. De boom groeit eerst volledig.
4. Daarna verschijnen de gekozen projecties.
5. LEX-Wissels volgen daarna.

## Statische controles

```text
node --check viewer.js
python tools/check_release.py
```
