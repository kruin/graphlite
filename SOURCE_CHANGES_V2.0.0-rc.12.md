# SOURCE_CHANGES_V2.0.0-rc.12

## OPN-opslag

- `.opn` vervangen door een herlaadbaar JSON-gecodeerd OpenGraph-document.
- Topniveau gescheiden in `metadata`, `data` en `paradata`.
- Syntax- en FT-graphsnapshots, LEX/SYNT/LOG-projecties en LOG-volgorde in `data`.
- Centrale view, zichtbare projecties, pan/zoom, Play-status en sessie-events in `paradata`.
- Automatische metadata met document-id, tijdstippen, taal en generatorversie.
- Maximaal 250 paradata-events per export.
- Exportcheckbox toegevoegd om paradata volledig weg te laten.
- Oude vlakke JSON-import blijft ondersteund.
- Legacy JSON-export blijft tijdelijk beschikbaar voor debugging.
- UI aangepast naar `OPN/JSON openen`, `Download OPN` en `Legacy JSON`.

## Documentatie

- `OPN_STORAGE_FORMAT.md` toegevoegd aan root en docs.
- README, projectstatus, overdracht en documentatieregels bijgewerkt.
