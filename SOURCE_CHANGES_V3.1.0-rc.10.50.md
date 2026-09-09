# Bronwijzigingen v3.1.0-rc.10 build 50

- De algemene S/O/V-boomsortering behandelt alleen de gewone `VP` en niet
  langer de interne dochters van `V-CLUSTER` (`vp-perfectum`).
- Een V-clusterflip blijft daardoor zichtbaar in de **werkelijke syntactische
  subboom**: `AUX → VDW` wordt `VDW → AUX` en omgekeerd.
- De releasecontrole voert nu een regressietest uit op de dochtervolgorde in
  de uiteindelijke, voor layout voorbereide taalboom.
