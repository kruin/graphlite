# Algemene Flip bij een klik op een SYN-item

## Wat zonder gevaar kan

Een klik op een binaire syntactische knoop kan zijn twee dochters
verwisselen. Dat is een structurele Flip: de knopen zelf blijven identiek;
alleen hun lokale links-rechtsvolgorde verandert. De geïmplementeerde
`V-CLUSTER`-klik is hiervan het kleinste controleerbare geval.

## Waarom dit bij anaforen niet blind algemeen mag

In een multi-OGN-uiting zijn antecedent en anafoor door gedeelde verticale
kolommen gekoppeld. Een lokale dochterswap kan daardoor tegelijk:

1. een vereiste coreferentiekolom verbreken;
2. twee niet-coreferente referenten onbedoeld in één kolom plaatsen;
3. een tweede kernzin dwingen mee te spiegelen.

Daarom mag een algemene klik in een anafoorcompositie geen directe mutatie
zijn. De klik moet als gewenste lokale volgorde naar de compositie-oplosser.
De oplosser moet daarna alle vaste coreferenties opnieuw toetsen en óf een
geldige gezamenlijke plaatsing berekenen, óf de Flip weigeren met uitleg.

## Huidig besluit

- Wel actief: de lokale binaire Flip van `V-CLUSTER`; die raakt geen
  referentiekolom.
- Niet stilzwijgend actief: willekeurige SYN-knoop-Flip in multi-OGN.
- Vervolgcontract: `klik → voorkeur → constraint solver → geldige plaatsing
  of gemotiveerde weigering`.

Een algemene Flip is dus uitvoerbaar, maar niet onvoorwaardelijk: alleen een
gedeclareerde binaire tak mag worden gewisseld en de resulterende volledige
plaatsing moet de unieke rij/kolom- en anafoorconstraints behouden. De
V-CLUSTER is het reeds actieve speciale geval. Tijdsvorming, vraagvorming en
passief zijn formaties en vallen niet onder deze Flip.
