# Voorconfig en toepassingen

Vanaf `v2.0.0-rc.37` maakt Config onderscheid tussen:

1. **Voorconfig** — algemene infrastructuur zonder taalkundige inhoud;
2. **Toepassingen** — concrete uitbreidingen die die infrastructuur gebruiken.

## Actief in rc.37: insertie per as

Insertie kan onafhankelijk worden voorbereid op:

- **LEX** — plaatsing of projectie van lexicale inserties;
- **SYNT** — gereserveerd voor een latere syntactische insertietoepassing;
- **LOG** — LOG-minors en hun afstands- of intervalwerking.

Alle drie staan standaard uit. Een ingeschakelde as maakt alleen de capaciteit
beschikbaar. Zonder actieve toepassing verschijnen geen inserties.

De toepassing **Bijwoorden** vereist de combinatie **LEX + LOG**. Zolang een
van beide uitstaat, kan Bijwoorden niet worden aangevinkt. Wordt LEX of LOG
later uitgezet, dan schakelt Bijwoorden automatisch uit en wordt alle
bijwoordstaat gewist.

## Volgende voorconfig-kandidaten

Deze kandidaten zijn in rc.37 zichtbaar als ontwerpvoorraad, maar nog niet
schakelbaar:

- **Verplaatsing per as** — bepalen op welke as Wissels of andere bewegingen
  zijn toegestaan;
- **Lege posities en sporen per as** — traces en lege doelposities los van een
  concrete toepassing configureren;
- **Bron-naar-doel-koppelingen** — toegestane routes zoals `LOG → LEX` vooraf
  vastleggen;
- **Host- en scoperegels** — algemene structurele host en semantische scope
  scheiden voordat een toepassing ze invult.

Een kandidaat wordt pas een actieve voorconfig wanneer bediening, opslag,
import/export, afhankelijkheden en regressietests samen zijn geïmplementeerd.

## Gereserveerde toepassingen in rc.42

Config toont twee vervolgtoepassingen als vaste, uitgeschakelde reserveringen:

- **Nadruk**, met als richtinggevend voorbeeld `juist díe trui`;
- **Onaffe zin**.

Vraagzin is na rc.42 heringedeeld als actieve Language-Tree-zinsoort en staat
daarom niet meer in de toepassingreserveringen.

Deze namen staan in `RESERVED_APPLICATION_DEFINITIONS`, niet in de actieve
`FEATURE_DEFINITIONS`. Daardoor krijgen ze geen checkboxwerking, runtime-state,
resources, voorbeeldzinnen, inserties, documentatielinks, opslagvelden,
OPN-extra of layout-demand. Ook een ingeschakelde LEX-, SYNT- of LOG-voorconfig
maakt een reservering niet actief.

Bij latere uitwerking wordt per toepassing eerst afzonderlijk bepaald welke
voorconfig nodig is. Pas wanneer functionaliteit, cleanup, opslag/export,
documentatie en regressietests samen gereed zijn, verhuist zij naar de actieve
featurecatalogus.

## Layout-demand van een toepassing

Voorconfig bepaalt **of** een capaciteit beschikbaar is. Een toepassing mag
daarnaast declareren **welk soort** renderinhoud zij kan toevoegen, maar geen
pixelcoördinaten. Bijwoorden declareert in rc.42 bijvoorbeeld
`lexContent: wide-insertion`. De centrale layout-policy vertaalt dat naar
voldoende zichtbare ruimte op ieder viewport.

Hierdoor blijft de richting van afhankelijkheid zuiver:

```text
voorconfig → toepassing → semantische bijdrage/layout-demand → layout-policy
```

De renderer leest geen bijwoord-specifieke x/y-patches. Een toekomstige
toepassing kan hetzelfde contract gebruiken voor LEX-inhoud, SYNT-inserties of
LOG-minors. Zie `RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md`.

## Opslag

OPN en de lokale Config-snapshot bewaren de drie asschakelaars expliciet:

```json
{
  "preconfig": {
    "insertion": {
      "lex": false,
      "synt": false,
      "log": false
    }
  }
}
```

Een document met insertiedata wordt niet stilzwijgend geopend wanneer de
vereiste voorconfig ontbreekt; de viewer meldt welke assen eerst moeten worden
ingeschakeld.
