# Test — plaatsingsplan vóór rendering

## Documentatiecontrole

Controleer dat de actuele documentatie de volgorde vastlegt:

```text
plaatsingsplan berekenen → kernzin invullen → groei/rendering
```

De tekst moet expliciet vermelden:

1. structuur, lexicale inserties, plaatsingsregels, Wissels en actieve projecties zijn layoutinput;
2. insertieslots, minor-ankers en Wissel-corridors worden vóór centrale plaatsing gereserveerd;
3. de kernzin vult de vooraf berekende plaatsen;
4. Play/Groei en rendering herberekenen geen coördinaten en maken geen nieuwe ruimte.

## Ingebouwde LEESMIJ

Open README/LEESMIJ en controleer:

- `Volgordelijke notatie` noemt het volledige plaatsingsplan vóór rendering;
- `LEX` noemt vooraf gereserveerde slots en corridors;
- `Bijwoorden` noemt insertiegroepen als input vóór de centrale boomplaatsing;
- Nederlands en Engels geven dezelfde architectuurregel.

## Regressie

- `index.html` en `viewer.html` zijn identiek;
- bestaande meervoudige insertievoorbeelden blijven aanwezig;
- Config-save-werkwijze is ongewijzigd;
- `node --check viewer.js` slaagt;
- `python tools/check_release.py` rapporteert `RELEASE CHECK: OK (v2.0.10)`.
