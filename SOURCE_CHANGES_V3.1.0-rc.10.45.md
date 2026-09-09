# Bronwijzigingen v3.1.0-rc.10 · build 45

Bronstand: `v3.1.0-rc.10-west-start-visible-vcluster-flip-20260908.45`.

- Iedere nieuwe paginalaad begint onvoorwaardelijk met LEX op West, zowel
  lokaal als op GitHub Pages. Ook een opgeslagen Config, cachewaarde of het
  mobiele basismenu kan de start niet naar Oost, Noord of Zuid terugzetten.
- De causale werkwoordkeuze heeft een zichtbare actie. Vanuit `BIJT` of
  `BEET` maakt **Maak V-cluster** eerst `HEEFT GEBETEN`; daarna wisselt
  **Flip V-cluster** de twee dochters tussen `HEEFT GEBETEN` en
  `GEBETEN HEEFT`.
- Zodra de echte syntactische `V-CLUSTER`-knoop bestaat, voert een klik of
  Enter op die knoop dezelfde flip uit. De bediening toont na afloop de
  gerealiseerde clustervolgorde.
