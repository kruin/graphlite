# Source changes — v2.0.3

## Git-BAT

`graphlite_safe_update.bat` maakt na **Nieuwe release veilig voorbereiden en lokaal committen — J** voortaan direct een lokale commit, nadat alle bron-, JavaScript-, release- en Git-diffcontroles zijn geslaagd.

De BAT:

- staged de gecontroleerde wijzigingen met `git add -A`;
- controleert staged whitespace met `git diff --cached --check`;
- toont de staged wijzigingssamenvatting;
- vraagt één commitbericht;
- gebruikt bij Enter automatisch `release: <VERSION.txt>`;
- commit met een tijdelijk UTF-8-berichtbestand;
- meldt expliciet dat er nog niets is gepusht.

## Veiligheidsgrens

Commit en push zijn losgekoppeld. Na de lokale commit volgt een afzonderlijke J/N-vraag voor `git push origin HEAD`. Een vuile `graphlite-next` wordt niet gepusht. `git pull` en force-push blijven uitgesloten.

## Documentatie

README, veilige Git-werkwijze, deploydocumentatie, projectstatus en het BAT-testplan beschrijven de nieuwe volgorde:

```text
voorbereiden → controleren → lokaal committen → optioneel pushen → online testen → promoveren
```
