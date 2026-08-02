# CONFIG_UI_EXPLANATION_STANDARD

Vaste ontwerp- en documentatieregel voor configuratieschermen. Deze regel is
projectoverstijgend bedoeld: neem haar bij iedere volgende bronwijziging ook op
in het betreffende project en in iedere nieuwe volledige projectbron.

## Regel

Iedere instelling die de gebruiker kan veranderen, heeft in hetzelfde
configuratiescherm een korte, op mobiel bedienbare **Uitleg**. Gebruik geen
uitleg die alleen via hover of een desktoptooltip bereikbaar is. Houd de uitleg
standaard ingeklapt wanneer een voortdurend zichtbare tekst het scherm onnodig
groot maakt.

De uitleg beantwoordt, voor zover van toepassing:

1. wat de instelling verandert;
2. welke waarden, eenheid, standaard en grenzen gelden;
3. wat een hogere, lagere of andere keuze doet;
4. wat de instelling nadrukkelijk **niet** verandert;
5. welke andere instellingen samen de uitkomst en reproduceerbaarheid bepalen.

Een technische naam zonder gebruiksbetekenis is onvoldoende. Gebruik een
concreet voorbeeld wanneer een waarde anders makkelijk verkeerd wordt gelezen.

## Config blijft Config

- Toon alleen bedieningen die werkelijk functioneel en veranderbaar zijn.
- Plaats berekende status, statistiek en uitvoer niet tussen de instellingen.
- Verberg toekomstige opties totdat hun gedrag functioneel is.
- Een toelichting mag in Config staan; uitgebreide onderbouwing en formules
  blijven daarnaast in Help en de bron-documentatie.
- Een meertalige interface levert dezelfde uitleg in alle ondersteunde
  interfacetalen.
- In een methodegebonden Config is de overige Config zelf no-show. Voor
  Greedy Grow en Random blijven uitsluitend Terug naar Main, de eigen
  bewerkbare velden met Uitleg en Config opslaan zichtbaar. De gebruiker kiest
  een andere context eerst in Main.

## Seed en snelheid

Beschrijf deze begrippen altijd afzonderlijk:

- **Seed:** startcode van een deterministische toevalsreeks. Een groter getal
  geeft niet meer toeval en maakt de uitvoering niet sneller. Dezelfde seed,
  programmaversie en alle plaatsingsinstellingen leveren dezelfde reeks.
- **Snelheid:** zichtbare wachttijd tussen stappen, gewoonlijk in
  milliseconden. Snelheid verandert de berekende plaatsingsreeks niet.

Voor OpenGraph is `20260802` een herkenbare datumseed: 2 augustus 2026. Het
geldige bereik is `1` tot en met `4.294.967.295`.

## Bronnen en controle

- Neem dit bestand op in iedere volledige projectbron waarin Config voorkomt.
- Leg projectspecifieke betekenissen daarnaast vast in Help en de relevante
  Config-specificatie.
- Controleer automatisch dat iedere nieuwe Configbediening een bereikbare
  uitleg heeft; het inhoudelijke en visuele oordeel blijft handmatig.
- Meld bij het openen van een bestaand project dat deze regel wordt toegepast.
  Op de prompt `meer uitleg` wordt de volledige regel en de projectspecifieke
  uitwerking toegelicht.
