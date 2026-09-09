# Bronwijzigingen v3.1.0-rc.10 · build 47

Bronstand: `v3.1.0-rc.10-west-start-subordinate-vcluster-subtree-flip-20260908.47`.

- De losse knop **Flip V-cluster** naast de input is verwijderd. De actie
  hoort uitsluitend op de echte syntactische `V-CLUSTER`-knoop.
- De actie is alleen beschikbaar bij bijzinsvolgorde. De herkenning gebruikt
  zinsoort, bijzinregel en de gedeclareerde `Comp`-positie, zodat behalve
  `omdat` en `dat` ook toekomstige onderschikkers zoals `hoewel` passen.
- De flip verwisselt eerst de twee dochters van de V-CLUSTER-subboom. LEX
  reconstrueert daarna de uiting uit die gewijzigde SYN-structuur; er wordt
  niet langer onafhankelijk in de woordlijst gewisseld.
- In de beginstand reconstrueert LEX de input. SYN toont de analyse;
  Functional en LOG blijven gelijk zolang functies, rollen en interpretatie
  niet veranderen.
- Hoofdzinnen en enkelvoudige vormen zoals `BEET` krijgen geen clusterflip.
  De anafoorreferent blijft bij iedere toegestane flip ongewijzigd.
- De vaste startstand blijft LEX op West, lokaal en op GitHub Pages.
