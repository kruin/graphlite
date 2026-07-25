# Source changes · v2.0.0-rc.17

## Correctie van LOG-gestuurde plaatsing

- `data-example-controls-layout="false"` wordt nu daadwerkelijk afgedwongen.
- Lineaire posities en oude `data-log-*`-hints uit een voorbeeldzin kunnen
  de automatische LOG-plaatsing niet meer overschrijven.
- De bijwoordklasse uit `structure-config.html` bepaalt het interval:
  `MODALITEIT → S-O` en `FREQUENTIE → O-V`.
- Een expliciete intervalkeuze in de Config-UI houdt altijd voorrang.

Voor de twee voorbeelden met `MISSCHIEN WEL` en `VAAK` is de afleiding nu:

```text
LOG: S — MISSCHIEN WEL — O — VAAK — V
LEX: DE HOND — MISSCHIEN WEL — DE MAN — VAAK — GEBETEN — HEEFT
```

De voorbeeldzin blijft validatie-invoer en levert geen layoutcoördinaten.

## Regressiecontrole

`tools/check_log_slot_distance.py` controleert nu ook:

- de klassegestuurde intervalkeuze;
- het negeren van oude voorbeeldhints;
- de voorrang van een expliciete Config-keuze;
- de LOG-afgeleide LEX-rijen voor beide bijwoordgroepen.
