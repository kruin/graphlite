# LEX-bijwoordinsertie: gecontroleerde plaatsingsregels per bijwoord

> Actueel rc.15-contract: deze historische regels beschrijven klasse, scope
> en gemarkeerdheid. Plaatsing loopt nu via LOG-minors en LOG→LEX; `host`
> bepaalt geen afstand of rij. Zie `../projectie-master-spec.md`.

Versie: v4551


## Gebruikte grammaticale ankers

- ANS/e-ANS: beschrijvende bron; tijdsbepalingen gaan in het middenveld gewoonlijk vóór andere bijwoordelijke bepalingen; hier/daar staan vaak vroeg in het middenveld; kaderscheppende bepalingen kunnen op eerste zinsplaats staan.
- ANS/e-ANS: modale bepalingen kunnen op eerste zinsplaats staan en kunnen bereik over de hele zin of een deel daarvan hebben.
- ANS/e-ANS: focuspartikels zoals ook, alleen, zelfs, juist, al, nog, pas maken deel uit van een constituent; schakeringspartikels zoals toch, dan, maar, nou, eens, even kunnen niet zelfstandig op de eerste zinsplaats staan.
- Onze Taal en NT2-bronnen: bijwoorden kunnen werkwoord, ander bijwoord, adjectief, hele zin en soms NP bepalen; plaats hangt af van functie.

Bronnen staan ook als URL-lijst onderaan dit document.

## Hoofdcorrectie t.o.v. v4550

v4550 gebruikte te vaak één categorie-regel. De belangrijkste correcties zijn:

1. `host` en `lineaire plaats` zijn niet hetzelfde. `host=S` betekent zinsbereik; alleen `linear=fronted-v2` betekent eerste zinsplaats met V2.
2. `niet` heeft geen vaste V-host. De plaats hangt af van scope: zinsnegatie, partiële NP-negatie, AP-negatie, bijwoordnegatie, enz.
3. focuspartikels hebben geen vaste NP-host. De host is de concrete focusdrager.
4. graadwoorden hebben een verplicht target: AP of ander bijwoord. Zij zijn meestal niet zelfstandig op de LEX-as.
5. sommige woorden moeten worden gesplitst in aparte lexicale regels: `zeker`, `daar`, `buiten`, `nooit`, `anders`, `dan`, `ook`.

## Eigen regelmodel

```text
LEX-ADV[
  word=...,
  class=...,
  axis=LEX,
  source=external,
  scopeHost=...,
  anchorHost=...,
  linear=...,
  default=...,
  marked=...,
  order=before-movement
]
```

- `scopeHost`: interpretatief bereik, bijv. S, VP, NP, AP.
- `anchorHost`: de zichtbare hostbox/trace waarop het LEX-slot verticaal wordt geankerd.
- `linear`: middenveld, voorop/V2, vóór focusdoel, vóór eindwerkwoord, enz.
- `marked`: waar de gekozen plaats afwijkt van de lexicale default of een geforceerde scope kiest.

## Categorie-regels

| Categorie | Default | Gemarkeerd | Uitzonderingen |
|---|---|---|---|
| `MODALITEIT` | host `S`, linear `middle-field-after-finite` | hosts `VP, V` | zeker heeft ook kwantificerende/benaderende waarde ('zeker tien mensen'); classificeer dan niet als MODALITEIT maar als KWANTIFICEREND/FOCUS |
| `TIJD` | host `VP`, linear `middle-field-time-before-place-manner` | hosts `S, V-CLUSTER` | nu kan ook discourse-/modaliteitswaarde hebben; toen/dan kunnen temporeel of voegwoordelijk zijn |
| `FREQUENTIE` | host `VP`, linear `middle-field-frequency` | hosts `S, V` | nooit is formeel ook frequentie, maar semantisch negatief; behandel nooit als NEG_FREQ wanneer scope belangrijk is |
| `PLAATS` | host `VP`, linear `early-middle-field-after-pronominals` | hosts `S, PP` | daar/hier kunnen ook deel zijn van voornaamwoordelijke bijwoorden (daarmee, hierop); buiten kan plaatsbepaling, partikel of predicatief zijn |
| `NEGATIE` | host `VP`, linear `scope-before-negated-domain-or-right-field` | hosts `NP, AP, V, V-CLUSTER, S` | niet is scope-gevoelig; 'HOND BIJT NIET MAN' is geen neutrale Nederlandse volgorde. Gebruik 'HOND BIJT MAN NIET' of in perfectum 'HOND HEEFT MAN NIET GEBETEN'. nooit/nergens hebben eigen negatieve bijwoordklasse |
| `GRAAD` | host `AP`, linear `immediately-before-modified-AP-or-ADV` | hosts `V, VP` | heel/erg kunnen een ander bijwoord modificeren ('heel hard'); GraphLite heeft daarom later een ADV-MOD-host nodig naast AP |
| `WIJZE` | host `VP`, linear `after-objects-before-final-verb-where-available` | hosts `V, V-CLUSTER, S` | hard/snel/goed kunnen ook adjectief zijn; classificeer alleen als WIJZE wanneer ze een werkwoordelijke handeling modificeren |
| `REDEN_OORZAAK` | host `S`, linear `fronted-v2-for-daarom-zodoende; middle-or-front-for-daardoor` | hosts `VP` | daarom is vooral reden/argumentatief; daardoor is oorzaak/middel en kan dichter bij VP staan; zodoende is formeler en vaak connector |
| `VOORWAARDE_GEVOLG` | host `S`, linear `fronted-v2-when-conditional-connector` | hosts `VP, AP` | anders en dan zijn polyfunctioneel. Splits: ANDERS_COND, ANDERS_MANNER, DAN_TEMP, DAN_COND, DAN_COMPARATIVE |
| `FOCUSPARTIKEL` | host `FOCUS_TARGET`, linear `directly-before-or-within-focus-constituent` | hosts `NP, VP, AP, PP, S` | alleen kan ook bijwoord van modaliteit/slechts zijn; ook/zelfs/al/nog/pas hebben complexe scope en moeten later per target worden gespecificeerd |
| `SCHAKEERPARTIKEL` | host `S`, linear `middle-field-particle-cluster` | hosts `VP` | deze klasse stond nog niet in v4550 maar is nodig voor spreektaal |

## Woordregels voor de huidige voorbeeldset

| Woord | Klasse | Ongemarkeerde plaatsing | Gemarkeerde/alternatieve plaatsing | Uitzondering |
|---|---|---|---|---|
| **waarschijnlijk** | `MODALITEIT` | `S` / `middle-field-after-finite` — HOND BIJT MAN WAARSCHIJNLIJK / HOND BIJT WAARSCHIJNLIJK MAN (modelvarianten) | S / fronted-v2: WAARSCHIJNLIJK BIJT HOND MAN; VP|V / hosted: HOND BIJT WAARSCHIJNLIJK MAN | niet automatisch fronted maken alleen omdat scope=S |
| **misschien** | `MODALITEIT` | `S` / `middle-field-after-finite` — HOND BIJT MISSCHIEN MAN | S / fronted-v2: MISSCHIEN BIJT HOND MAN; VP / hosted: HOND BIJT MISSCHIEN MAN | spreektaal vaak middenveld; fronting mogelijk |
| **zeker** | `MODALITEIT|KWANTIFICEREND` | `S` / `middle-field` — HOND BIJT ZEKER MAN | NP / before-quantified-NP: ZEKER DRIE HONDEN | zeker kan modaliteit of kwantificerend/benaderend zijn |
| **gisteren** | `TIJD` | `VP` / `middle-field-time` — HOND BEET GISTEREN MAN / HOND HEEFT GISTEREN MAN GEBETEN | S / fronted-v2: GISTEREN BEET HOND MAN; V-CLUSTER / before-final-verb: HOND HEEFT MAN GISTEREN GEBETEN | fronting is normaal, maar niet de enige default |
| **morgen** | `TIJD` | `VP` / `middle-field-time` — HOND BIJT MORGEN MAN | S / fronted-v2: MORGEN BIJT HOND MAN | toekomstige tijd wijzigt werkwoord niet automatisch |
| **nu** | `TIJD|DISCOURSE` | `VP` / `early-middle-field` — HOND BIJT NU MAN | S / fronted-v2: NU BIJT HOND MAN | nu kan ook discoursepartikel zijn; dan andere regel |
| **straks** | `TIJD` | `VP` / `middle-field-time` — HOND BIJT STRAKS MAN | S / fronted-v2: STRAKS BIJT HOND MAN | geen OVT-trigger |
| **vaak** | `FREQUENTIE` | `VP` / `middle-field-frequency` — HOND BIJT VAAK MAN | S / fronted-v2: VAAK BIJT HOND MAN; V / hosted: HOND BIJT VAAK MAN | niet boven AP/NP |
| **soms** | `FREQUENTIE` | `VP` / `middle-field-frequency` — HOND BIJT SOMS MAN | S / fronted-v2: SOMS BIJT HOND MAN | kan discourse-kader zijn |
| **altijd** | `FREQUENTIE` | `VP` / `middle-field-frequency` — HOND BIJT ALTIJD MAN | S / fronted-v2: ALTIJD BIJT HOND MAN | kan in interactie met negatie scopeproblemen geven |
| **zelden** | `FREQUENTIE` | `VP` / `middle-field-frequency` — HOND BIJT ZELDEN MAN | S / fronted-v2: ZELDEN BIJT HOND MAN | negatief-polaire nuance; behandel als NEG_FREQ waar nodig |
| **daar** | `PLAATS|R-ADV` | `VP` / `early-middle-field-after-pronouns` — HOND BIJT DAAR MAN | S / fronted-v2: DAAR BIJT HOND MAN; PP / split-r-pronoun: DAAR ... MEE/OP | daar kan voornaamwoordelijk bijwoord vormen; dan apart behandelen |
| **hier** | `PLAATS|R-ADV` | `VP` / `early-middle-field-after-pronouns` — HOND BIJT HIER MAN | S / fronted-v2: HIER BIJT HOND MAN; PP / split-r-pronoun:  | zelfde R-bijwoordprobleem als daar |
| **buiten** | `PLAATS|PREDICATIVE|PARTICLE` | `VP` / `middle-field-place` — HOND BIJT BUITEN MAN | S / fronted-v2: BUITEN BIJT HOND MAN; V / predicate-particle: DE FILM IS UIT/BUITEN? | kan predicatief/partikelachtig zijn; niet altijd gewone plaats |
| **ergens** | `PLAATS_ONBEPAALD` | `VP` / `middle-field-place` — HOND BIJT ERGENS MAN | S / fronted-v2: ERGENS BIJT HOND MAN | minder deiktisch dan hier/daar; geen PP-splitsing tenzij R-constructie |
| **niet** | `NEGATIE` | `VP|V-CLUSTER` / `after-definite-object-or-before-final-verb` — HOND BIJT MAN NIET / HOND HEEFT MAN NIET GEBETEN | NP / before-negated-NP: HOND BIJT NIET MAN MAAR VROUW; AP / before-AP: HOND IS NIET MOOI; V / before-adverb-or-predicate: HOND BIJT NIET HARD | oude voorbeeld 'HOND BIJT NIET MAN' is alleen contrastief/partiële negatie |
| **nooit** | `NEG_FREQ` | `VP` / `early-middle-field-before-place` — HOND BIJT NOOIT MAN | S / fronted-v2: NOOIT BIJT HOND MAN | niet behandelen als gewone 'niet'-negatie |
| **nergens** | `NEG_PLACE` | `VP` / `place-slot-negative` — HOND BIJT NERGENS MAN | S / fronted-v2: NERGENS BIJT HOND MAN | negatief plaatsbijwoord; geen extra niet erbij |
| **heel** | `GRAAD` | `AP|ADV-MOD` / `immediately-before-modified-word` — HOND IS HEEL MOOI / VROUW BREIT HEEL HARD | VP / reclassified: heel wat werken | vereist expliciet target AP of ander bijwoord; niet zelfstandig boven S/VP |
| **erg** | `GRAAD|ADJECTIVE` | `AP|ADV-MOD` / `immediately-before-modified-word` — HOND IS ERG MOOI | AP / predicate-adjective: DAT IS ERG | kan adjectief/predicaat zijn |
| **zeer** | `GRAAD` | `AP` / `immediately-before-AP` — HOND IS ZEER MOOI | S / formal-marked: ZEER waarschijnlijk... | formal register; meestal AP/AdvP |
| **nogal** | `GRAAD|MODAL` | `AP|ADV-MOD` / `immediately-before-modified-word` — HOND IS NOGAL MOOI | S / speaker-stance: NOGAL wiedes... | kan sprekerhouding bevatten; target nodig |
| **hard** | `WIJZE|ADJECTIVE` | `VP|V-CLUSTER` / `after-object-before-final-verb` — VROUW HEEFT TRUI HARD GEBREID | V / predicative-near: VROUW BREIT HARD TRUI; AP / adjective: HARDE TRUI? | hard kan adjectief zijn; lineaire positie afhankelijk van object/werkwoordcluster |
| **snel** | `WIJZE|ADJECTIVE` | `VP|V-CLUSTER` / `manner-near-final-verb` — VROUW HEEFT TRUI SNEL GEBREID | S / fronted-v2: SNEL BREIDE VROUW TRUI | kan adjectief zijn; fronting gemarkeerd |
| **zachtjes** | `WIJZE` | `VP|V-CLUSTER` / `manner-near-final-verb` — VROUW HEEFT TRUI ZACHTJES GEBREID | S / fronted-v2: ZACHTJES BREIDE VROUW TRUI | sterk manner; meestal niet S-default |
| **goed** | `WIJZE|ADJECTIVE` | `VP|V-CLUSTER` / `manner-or-result` — VROUW HEEFT TRUI GOED GEBREID | AP / adjective-predicate: TRUI IS GOED | kan resultaat/adjectief zijn |
| **daarom** | `REDEN_CONNECTOR` | `S` / `fronted-v2` — DAAROM BIJT HOND MAN | VP / hosted: HOND BIJT DAAROM MAN | vooral connector; default S is verdedigbaar |
| **daardoor** | `OORZAAK|MIDDEL` | `VP` / `cause-middle-field` — HOND BIJT DAARDOOR MAN | S / fronted-v2: DAARDOOR BIJT HOND MAN | niet hetzelfde als daarom; VP-default beter dan S-default |
| **zodoende** | `GEVOLG_CONNECTOR` | `S` / `fronted-v2` — ZODOENDE BIJT HOND MAN | VP / hosted: HOND BIJT ZODOENDE MAN | formeel; vaak zinsconnector |
| **anders** | `VOORWAARDE|WIJZE|ADJECTIVE` | `S` / `fronted-v2-when-conditional` — ANDERS BIJT HOND MAN | VP / manner: HOND BIJT ANDERS; AP / adjective: DAT IS ANDERS | splits conditioneel anders en wijze/adjectief anders |
| **dan** | `DAN_TEMP|DAN_COND|COMPARATIVE` | `S|VP` / `depends-on-function` — DAN BIJT HOND MAN / HOND BIJT DAN MAN | AP / comparison: GROTER DAN ... | niet één bijwoordregel; altijd functie kiezen |
| **alleen** | `FOCUSPARTIKEL|MODAL` | `FOCUS_TARGET` / `before-focus-target` — ALLEEN HOND BIJT MAN / HOND BIJT ALLEEN MAN | VP / scope-over-VP: HOND KAN ALLEEN BIJTEN; S / fronted-if-whole-focus-fronted: ALLEEN BIJT HOND MAN? | host NP is alleen default als de focusdrager NP is |
| **ook** | `FOCUSPARTIKEL|VOEGWOORDELIJK_BIJWOORD` | `FOCUS_TARGET` / `before-or-near-focus-target` — OOK HOND BIJT MAN / HOND BIJT OOK MAN | S / connective: OOK BIJT HOND MAN | kan focuspartikel én voegwoordelijk bijwoord zijn |
| **zelfs** | `FOCUSPARTIKEL` | `FOCUS_TARGET` / `before-focus-target` — ZELFS HOND BIJT MAN | VP / focus-over-VP: HOND ZOU ZELFS BIJTEN | geen gewone S/VP-default zonder focusdoel |
| **slechts** | `FOCUSPARTIKEL|FORMAL` | `FOCUS_TARGET` / `before-focus-target` — SLECHTS HOND BIJT MAN | VP / formal-focus: HOND KAN SLECHTS BIJTEN | formeel register; target verplicht |


## Niet als normale default gebruiken

```text
HOND BIJT NIET MAN
```

Deze volgorde is alleen bruikbaar als contrastieve partiële negatie van het object bedoeld is: `niet man maar vrouw`. Voor neutrale zinsnegatie gebruikt GraphLite voortaan:

```text
HOND BIJT MAN NIET
HOND HEEFT MAN NIET GEBETEN
```

## Nieuwe uitbreidingsklassen

Voor latere bijwoorden/bijwoordelijke constructies moet de config deze extra klassen toelaten:

```text
SCHAKEERPARTIKEL: toch, maar, nou, eens, even
VOEGWOORDELIJK_BIJWOORD: echter, bovendien, trouwens, immers, dus
R-BIJWOORD / VOORNAAMWOORDELIJK_BIJWOORD: er, hier, daar, waar + voorzetsel
NEG_FREQ: nooit, zelden
NEG_PLACE: nergens
FOCUSPARTIKEL: alleen, ook, zelfs, slechts, al, nog, pas, juist
ADV-MOD: heel hard, erg snel, zeer waarschijnlijk
```

## Bron-URL's

- https://e-ans.ivdnt.org/topics/pid/ans21040803lingtopic
- https://e-ans.ivdnt.org/topics/pid/ans21030203lingtopic
- https://e-ans.ivdnt.org/topics/pid/ans080302lingtopic
- https://onzetaal.nl/taalloket/bijwoord
- https://onzetaal.nl/taalloket/bijwoordelijke-bepaling
- https://grammaticavoornt2docenten.nl/grammatica/woordsoorten-het-bijwoord/
- https://thedutchonlineacademy.com/grammar/woordvolgorde-in-een-notendop
- https://zichtbaarnederlands.nl/nl/zinsbouw/tijd_hoe_plaats

## v4552-correctie: `NIET` als eigen LEX-rechterveldslot

De neutrale zin is:

```text
HOND | BIJT | MAN | NIET
```

Niet:

```text
HOND | BIJT | NIET | MAN
```

Daarom krijgt `NIET` niet alleen een hostbox, maar een eigen lineaire regel:

```text
LEX-ADV[
  word=NIET,
  class=NEGATIE,
  axis=LEX,
  source=external,
  defaultHost=VP,
  host=VP,
  linear=post-object-pre-vcluster,
  placement=right-field-negation,
  order=before-movement,
  marking=functional:neg-scope-default
]
```

Werking:

1. `NIET` wordt eerst extern ingevoegd op de LEX-as.
2. De insertie staat na het object in een eenvoudige transitieve hoofdzin.
3. In een meerwerkwoordconstructie staat de insertie vóór het eindwerkwoord of de V-cluster.
4. Daarna worden pas LEX-Wissels/V2/topicregels gelezen.
5. `HOND BIJT NIET MAN` blijft mogelijk, maar alleen als gemarkeerde contrastnegatie: `niet de man maar ...`.

Machineleesbaar:

```text
samples/adverb_placement_rules_v4552.json
samples/adverb_word_rules_v4552.json
```
