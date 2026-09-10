# Bronwijzigingen v3.1.0-rc.10.67

- publish_checked.bat staget voortaan toevoegingen, wijzigingen en
  verwijderingen vóór git add --renormalize.
- Daardoor kan een hernoemd of verwijderd gevolgd bestand de publicatie niet
  meer afbreken met unable to stat.
- De releasecontrole bewaakt de vereiste stagingvolgorde.
