# Source changes v2.0.9

## Plaatsingsplan vóór rendering

- De documentatie legt nu expliciet vast dat lexicale inserties vóór de centrale boomplaatsing in de layoutberekening worden opgenomen.
- Structuur, insertiegroepen, plaatsingsregels, Wissels en actieve projecties vormen samen de layoutinput.
- Gridposities, minor-ankers, fysieke boxafstand en Wissel-corridors worden vooraf gereserveerd.
- De kernzin is de structurele en lexicale invulling van het berekende plaatsingsplan.
- Play/Groei en gewone rendering onthullen hetzelfde vaste resultaat; zij maken geen nieuwe ruimte.

## Bijgewerkte documentatie

- ingebouwde README/LEESMIJ;
- `README.md`;
- `PROJECT_STATE_CURRENT.md`;
- `LAYOUT_RULES.md`;
- `LINGUISTIC_ACTIONS.md`;
- `DOCUMENTATION_RULES.md`;
- `HANDOVER_FOR_COLLABORATORS.md`;
- layout-, render-, lexicon- en LEX-insertiespecificaties onder `docs/`.

## Functionaliteit

De viewerfunctionaliteit en Config-save-werkwijze zijn niet gewijzigd. v2.0.9 formaliseert de al bedoelde architectuurvolgorde in de documentatie en specificaties.
