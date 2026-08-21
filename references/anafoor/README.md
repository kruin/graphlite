# Referenties · Anafoor / multi-OGN

Aangeleverd voorbeeldmateriaal voor `Ik zie een man. Hij draagt een hoed.`

- `man-hoed-anafoor-reference.jpg` is de inhoudelijk leidende visuele
  referentie: twee afzonderlijke bomen, S1 boven S2, gezamenlijke LEX-as en
  een verticale MAN–HIJ-verbinding. Dat is legacy-beeldmateriaal: de actuele
  bronrepresentatie corrigeert deze lijn naar MAN–MAN en projecteert HIJ pas
  op LEX.
- `simplified-multi-ogn.png` toont de vereenvoudigde recente variant.
- de twee `.graph`-bestanden zijn historische Graphlite/JGraphEd-invoer en
  worden inhoudelijk ongewijzigd als provenance bewaard; alleen de algemene
  projectnormalisatie naar LF met één afsluitende EOL is toegepast.

De actieve implementatie leest deze legacybestanden niet rechtstreeks. Het
normatieve, reproduceerbare contract staat in `../../MULTI_OGN_ANAPHOR.md` en
`../../multi-ogn-composition-engine.js`.
