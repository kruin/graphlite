# Bronwijzigingen v3.1.0-rc.10 · build 44

Bronstand: `v3.1.0-rc.10-east-start-object-vcluster-flip-condensed-20260908.44`.

- Iedere nieuwe paginalaad begint onvoorwaardelijk met LEX op Oost. Een
  gekozen West-, Noord- of Zuidstand geldt alleen voor de lopende sessie.
  Browsercache en projectconfig kunnen deze startregel niet overschrijven.
- Een klik op `MAN` in `HOND BIJT MAN` opent nu dezelfde lexicale keuzelaag
  als subject en predicaat. Alleen patiënsen uit het actieve BIJTEN-frame
  worden aangeboden.
- De structureel gelijke causale gevallen zijn samengebracht in
  `Jan slaat Jek omdat die hem beet`. `BIJT`, `BEET`, `HEEFT GEBETEN` en
  `GEBETEN HEEFT` zijn vormkeuzen binnen dit ene geval.
- Bij de twee perfectumvormen bevat K2 een echte binaire syntactische
  `V-CLUSTER`. Klikken op die knoop verwisselt zijn dochters:
  `HEEFT GEBETEN ↔ GEBETEN HEEFT`.
- De oude URLs voor de twee vervallen doublures blijven als aliases werken.
  In de database hebben nummers 410 en 440 herstelbaar de status
  `VERVALLEN`; nummer 450 is het canonieke publieke geval.
- De ontwerpgrens voor een algemene klik-Flip staat in
  `ALGEMENE_SYN_FLIP.md`.
