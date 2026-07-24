# Source changes v2.0.8

## Meervoudige lexicale inserties

- Voorbeeldzinnen kunnen een lijst `lexInsertions` bevatten.
- `MISSCHIEN WEL` wordt als één meerwoordige insertiegroep behandeld.
- `VAAK` wordt als tweede zelfstandige insertie toegevoegd.
- Iedere groep behoudt eigen tekst, categorie, host, scope en volgorde.
- De centrale Syntax- en Functional-boom krijgen geen extra syntaxknopen.

## Geen visuele overlap

- Insertiecentra liggen op minor-gridankers.
- De centrumafstand wordt dynamisch op minimaal 72 SVG-pixels gehouden.
- Bij een laag `cellY`-profiel gebruikt de renderer automatisch meer dan één logische rij tussen twee boxen.
- De hostsubboom wordt automatisch voldoende omlaag geplaatst.

## Voorbeelden

```text
DE HOND HEEFT DE MAN MISSCHIEN WEL VAAK GEBETEN
OMDAT DE HOND DE MAN MISSCHIEN WEL VAAK HEEFT GEBETEN
```

Beide voorbeelden bevatten twee insertiegroepen: `MISSCHIEN WEL` en `VAAK`.

## Compatibiliteit

- De bestaande enkele bijwoordkeuze blijft werken.
- De bestaande Config-save-werkwijze is niet gewijzigd.
- Handmatige wijziging van aantal, inhoud of host schakelt de voorbeeldspecifieke insertielijst uit.
- `index.html` en `viewer.html` blijven identiek.
