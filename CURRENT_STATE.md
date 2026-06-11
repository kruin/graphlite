# Current state · OpenGraph Lite Viewer v4405

v4405 is een herstelbuild op v4402.

Belangrijk:
- De app blijft functioneel gelijk aan v4402 wat layoutdoelen betreft.
- GitHub Pages krijgt nu `.nojekyll`, zodat Jekyll niet probeert de projectdocumentatie/configbestanden te bouwen.
- `__pycache__`/`.pyc` zijn verwijderd en worden lokaal niet meer aangemaakt door `start-local-viewer.bat`.
- `debug.html` controleert of `index.html`, `styles.css`, `viewer.js`, `structure-config.html`, `examples-input.html`, `lexicon-config.html` en `.nojekyll` bereikbaar zijn.

Layoutstatus:
- Syntax en functioneel gebruiken bottom-up recursieve vrije boxplaatsing.
- Projecties naar LEX zijn horizontaal.
- Layout order: `left-first` / `right-first`.
- Flipdoel: compact, align, normal, flip-all.
- Per-vertakking-config: top, VP/ARG-STRUCT, overig.

Functionele structuur:

```text
CLAUSE
├─ PRED
│  └─ predicate
└─ ARG-STRUCT
   ├─ ARG1
   │  └─ NP
   │     └─ subject
   └─ ARG2
      └─ NP
         └─ object
```


## v4405 startfix
Gebruik bij cacheproblemen eerst `reset-cache.html?v4405`; daarna opent de viewer als `index.html?v4405&fresh=...`. Debug meldt expliciet als root `index.html` niet de viewer is.
