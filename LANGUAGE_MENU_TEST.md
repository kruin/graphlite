# Language menu test — v2.0.5

## Default

1. Verwijder voor een schone test `localStorage.opengraph_language`.
2. Open `index.html`.
3. De app start in **English**.
4. Kies Nederlands, herlaad en controleer dat de expliciete keuze bewaard blijft.

## Talenmenu

Controleer in Main, Config en README:

```text
English
Nederlands
Deutsch
Français
Español
```

De actieve taal heeft een vinkje en de samenvatting toont de gekozen taalnaam.

## Nederlandse taaldata

In iedere interfacetaal staat in het talenmenu een vertaalde mededeling met dezelfde inhoud:

```text
De voorbeeldzinnen zijn Nederlands en tonen de Nederlandse woordvolgorde.
```

De interfacetaal mag de Nederlandse voorbeeldzinnen, LEX-items of grammaticale volgorde niet vertalen.

## Fallback

- Nederlands en Engels: volledige bestaande UI/uitleglaag.
- Duits, Frans en Spaans: hoofdlabels vertaald.
- Nog niet vertaalde technische uitleg: Engels, niet Nederlands.
