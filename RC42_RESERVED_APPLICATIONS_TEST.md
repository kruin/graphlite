# RC42-test · gereserveerde toepassingen

## Doel

Controleren dat Vraagzin, Nadruk en Onaffe zin zichtbaar gereserveerd zijn in
Config, zonder al als echte toepassingen te functioneren.

## Automatische controle

```text
python tools/check_feature_profiles.py
node tools/check_feature_profiles_runtime.js
python tools/check_release.py
```

De controles bewaken:

1. exact drie reserveringen met stabiele IDs;
2. de zichtbare namen Vraagzin, Nadruk en Onaffe zin;
3. het voorbeeld `juist díe trui` bij Nadruk;
4. drie uitgeschakelde en niet-aangevinkte inputs;
5. afwezigheid uit `FEATURE_DEFINITIONS` en `state.features`;
6. afwezigheid uit `metadata.extras` en andere OPN-velden;
7. ongewijzigd gedrag wanneer LEX, SYNT of LOG wordt ingeschakeld;
8. ongewijzigd Bijwoorden-gedrag met LEX + LOG.

## Handmatige controle en jouw akkoord

- [ ] Open `Config → Toepassingen`.
- [ ] Bijwoorden staat als bestaande toepassing bovenaan.
- [ ] Daaronder staat het duidelijke blok `Gereserveerde toepassingen`.
- [ ] Vraagzin, Nadruk en Onaffe zin zijn alle drie zichtbaar.
- [ ] Bij Nadruk staat exact het voorbeeld `juist díe trui`.
- [ ] Geen van de drie reserveringen kan worden aangevinkt.
- [ ] De uitleg zegt dat ze niets toevoegen aan voorbeelden, inserties,
  documentatie, opslag, export of rendering.
- [ ] Schakel LEX, SYNT en LOG afzonderlijk en gezamenlijk in; de drie
  reserveringen blijven uitgeschakeld.
- [ ] Activeer Bijwoorden met LEX + LOG; alleen Bijwoorden wordt actief.
- [ ] Exporteer OPN met en zonder Bijwoorden; de gereserveerde IDs ontbreken
  steeds uit `metadata.extras` en overige data.

## Handmatig resultaat

```text
Datum:
Getest op:
Akkoord rc.42: ja / nee
Nog te herstellen:
```
