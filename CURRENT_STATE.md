# Current state · OpenGraph Lite Viewer v4408

v4408 bouwt voort op v4407 en corrigeert de groeistatus bij wisselen tussen projecties.

Belangrijk:
- De app blijft functioneel gelijk aan v4406 wat layoutdoelen betreft.
- Layout wordt nog steeds volledig vooraf berekend.
- Groei verandert geen x/y-posities. Het bepaalt alleen welke reeds berekende elementen zichtbaar zijn.
- GitHub Pages gebruikt `.nojekyll`; publiceer bij voorkeur vanaf `main / root`.
- `debug.html` controleert of `index.html`, `styles.css`, `viewer.js`, `structure-config.html`, `examples-input.html`, `lexicon-config.html` en `.nojekyll` bereikbaar zijn.

## Correctie v4408

Bij wisselen van `Groei` naar de niet-ondersteunde `LEX`-projectie werd de groeistap in v4407 naar 0 geclamped. Daardoor bleven `Assen`, `Bron` en `LOG/FT` daarna leeg zolang groei actief was.

Vanaf v4408 geldt:

```text
LEX ondersteunt groei niet, maar wist de groeistap niet.
Assen/Bron/LOG herstellen de laatst geldige groeistap.
Render/layout worden niet opnieuw door LEX bepaald.
```

## Groei-presentatie

Nieuwe bediening in het projectiepaneel:

```text
Groei checkbox
stap-slider
0 / ← / Play / →
```

Sneltoetsen:

```text
g = groei aan/uit
n = volgende stap
p = vorige stap
```

Groeivolgorde:

```text
0. raster/titels
1. leaves: HOND, BIJT, MAN / subject, predicate, object
2. kleinste categorie/role-nodes en hun boxes
3. grotere subtree-boxes
4. root S/CLAUSE
5. OPN-slot 1
6. LEX-projectie en projectiepanelen   [alleen in Assen-view]
```

Exacte stapnummers zijn afhankelijk van de diepte van de gekozen `structure-config`.

## Renderstatus

- Subtree-boxen worden als achtergrondlagen getekend: groot naar klein.
- Even grote subtree-boxen krijgen een vaste tie-break: boven→beneden, links→rechts, daarna oorspronkelijke layoutvolgorde.
- Box-captions worden pas na alle subtree-rects getekend.
- Node-shapes en node-labels zijn gescheiden lagen; labels liggen altijd bovenop.
- Groei-filtering gebeurt vóór het toevoegen van deze renderlagen aan SVG.

## Layoutstatus

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

## Start/cache

Gebruik bij cacheproblemen eerst `reset-cache.html?v4408`; daarna opent de viewer als `index.html?v4408&fresh=...`. Debug meldt expliciet als root `index.html` niet de viewer is.
