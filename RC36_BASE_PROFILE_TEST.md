# RC36 OGN Basis-profieltest

1. Open de viewer met lege lokale opslag.
2. Open Config: `Basis & extra’s` is actief en `Bijwoorden` staat uit.
3. Controleer Main: er is geen Bijwoordmenu.
4. Controleer Zin: de twee voorbeelden met optionele inserties ontbreken.
5. Controleer Help, LOG & LEX en de mobiele bediening: er staat geen
   bijwoordfunctionaliteit.
6. Exporteer OPN: `metadata.profile` is `base`, `metadata.extras` is leeg en
   LEX/LOG bevatten geen featurevelden of minors.
7. Vink `Bijwoorden` aan: menu, voorbeelden, profielen, LOG-minors,
   LEX-inserties en featuredocumentatie worden beschikbaar.
8. Vink `Bijwoorden` weer uit: alle featurestaat wordt gewist en Basis is
   opnieuw actief.
9. Open voorbeelden-, lexicon- en structuureditors vanuit Basis: de
   `profile=base`-weergave bevat alleen basisonderdelen.
10. Voer `python tools/check_feature_profiles.py` en daarna de volledige
    releasecontrole uit.
