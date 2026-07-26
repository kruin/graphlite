# RC37 Voorconfig-test

1. Open de viewer met lege lokale opslag.
2. Open Config: `Voorconfig` is de eerste en actieve tab.
3. Controleer dat insertie op LEX, SYNT en LOG afzonderlijk uitstaat.
4. Open `Toepassingen`: Bijwoorden is uit en nog niet aanklikbaar.
5. Schakel alleen LEX in: Bijwoorden blijft geblokkeerd.
6. Schakel SYNT aan en weer uit: dit verandert niets aan Bijwoorden.
7. Schakel LOG in: Bijwoorden wordt aanklikbaar.
8. Activeer Bijwoorden en controleer voorbeelden, LOG-minors, LEX-inserties,
   bediening en documentatie.
9. Schakel LEX uit: Bijwoorden valt automatisch uit en alle bijwoordstaat
   verdwijnt; LOG blijft aan.
10. Kies `Alle insertie uit` en controleer dat LEX, SYNT en LOG uitstaan.
11. Exporteer OPN in Basis: `metadata.preconfig.insertion` bevat drie
    `false`-waarden en er zijn geen insertievelden of minors.
12. Activeer LEX + LOG en Bijwoorden, exporteer opnieuw en controleer dat LEX
    en LOG `true` zijn, SYNT `false` is en de toepassingdata aanwezig is.
13. Voer `python tools/check_feature_profiles.py` en daarna de volledige
    releasecontrole uit.
