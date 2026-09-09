# Bronwijzigingen v3.1.0-rc.10 · build 46

Bronstand: `v3.1.0-rc.10-west-start-general-vcluster-flip-20260908.46`.

- De V-clusterflip is niet langer beperkt tot het causale K2-testitem.
  Iedere gewone Language Tree met zowel een persoonsvorm (`pv`) als voltooid
  deelwoord (`vdw`) herkent zijn echte syntactische `V-CLUSTER` als actie.
- Klikken of Enter op de clusterbox wisselt de twee clusterleden in de boom,
  op LEX en in de getoonde uiting. De vaste regressie is
  `OMDAT VROUW TRUI HEEFT GEBREID ↔ OMDAT VROUW TRUI GEBREID HEEFT`.
- Bij een gewone Language Tree staat daarnaast een zichtbare knop
  **Flip V-cluster** bij de input. De flip wordt bij een nieuw testitem
  teruggezet en verandert geen anafoorreferent.
- De vaste startstand blijft LEX op West, ook na cache en Config.
