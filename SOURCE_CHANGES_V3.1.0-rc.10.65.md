# Source changes v3.1.0-rc.10 · build 65

- `.ogn`-snapshots openen niet langer in een browserpopup of nieuw tabblad,
  maar in een zelfstandig venster binnen Graphlite.
- Het interne snapshotvenster is aan de titelbalk verplaatsbaar, via de
  rechteronderhoek schaalbaar en afzonderlijk sluitbaar.
- De interne viewer bewaart een eigen graph- en PLAY-toestand; de oorspronkelijke
  graph blijft achter het venster ongewijzigd beschikbaar.
- De snapshotoverdracht blijft same-origin en browserlokaal en werkt daardoor
  ook op een statische GitHub Pages-publicatie zonder popup-toestemming.
