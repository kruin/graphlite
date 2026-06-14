## v4430 · Voorbeeldzin als resultaat

Voorbeeldzinnen bepalen de eindvolgorde. De plaatsingsregels verklaren de route vanaf de basisprojectie naar die eindvolgorde.

# Lexicon en voorbeeldzinnen v4430

## v4430 · plaatsingsregels op de LEX-as

Voorlopig worden plaatsingsregels alleen op de LEX-as genoteerd. De regel heet **Wissel**:

```text
Wissel = vul een vrij slot met een broninhoud;
         op de oude bron-/basispositie verschijnt een trace.
```

Nederlandse hoofdzinnen gebruiken V2:

```text
subject/topic → slot 1 indien vooropgeplaatst
persoonsvorm/predicaat → slot 2
oude plek → t[V] of t[pv]
```

Bijzinnen met `OMDAT` gebruiken slot 0 voor Comp en hebben in deze demo geen V2-Wissel. V1-talen kunnen later als andere LEX-regel worden toegevoegd: de persoonsvorm zou dan in een eerste vrij slot staan in plaats van in slot 2.

---

Vanaf v4430 is `lexicon-editor.html` de gecombineerde editor voor lexemen en voorbeelduitingen. De verzameling uitingen wordt dus niet meer primair in een losse voorbeelden-editor beheerd.

## Beheermodel

```text
structure-config.html  = structurele sources en LEX-slots
lexicon-config.html    = lexemen / woordvormen
examples-input.html    = concrete korte uitingen
lexicon-editor.html    = beheer van lexicon + korte uitingen
```


## Thematische rollen en selectieframes

Naast syntactische rollen gebruikt het lexicon nu thematische rollen. Voor de korte actieve patronen geldt voorlopig:

```text
subject → agens
object  → patiens
```

Een noun kan dus syntactisch `object` zijn en thematisch `patiens`. Een predicaat kan daarnaast een eenvoudig frame hebben:

```html
data-frame-subjects="vrouw"
data-frame-objects="trui"
```

Voor `breit` betekent dit: de uitingenbouwer laat `vrouw` als agens toe en `trui` als patiens. `trui` wordt niet als agens aangeboden.

## Ondersteunde korte uitingen in v4430

| type | LEX-volgorde | voorbeeld |
|---|---|---|
| hoofdzin | subject predicate object | HOND BIJT MAN |
| omdat-bijzin | comp subject object predicate | OMDAT HOND MAN BIJT |
| perfectum | subject aux object participle | HOND HEEFT MAN GEBETEN |

De editor gebruikt bij export dezelfde HTML-structuur als de viewer al leest: `article.example-input` met een `ol.lex-sequence` en `li.lex-token`-tokens.

---

# Lexicon en voorbeeldzinnen v4430

## Bestanden

```text
lexicon-config.html
lexicon-editor.html
examples-input.html
examples-editor.html
```

## Lexicon

`lexicon-config.html` is de leesbare bron met `div.lexicon-entry`-regels. Elke entry gebruikt data-attributen:

```html
<div class="lexicon-entry"
  data-id="hond"
  data-label="HOND"
  data-lemma="hond"
  data-cat="N"
  data-phrase="NP"
  data-kind="noun"
  data-roles="subject object">
```

Belangrijke velden:

| veld | betekenis |
|---|---|
| `id` | stabiele lexeme-id, gebruikt in examples-input |
| `label` | zichtbaar woord op LEX-as |
| `lemma` | woordenboekvorm |
| `cat` | categorie: N, V, AUX, COMP, ... |
| `phrase` | eventuele phrasecategorie, bv. NP |
| `kind` | editorgroep: noun, verb, aux, comp, ... |
| `roles` | bruikbare rollen: subject/object/predicate/... |
| `source-default` | standaard structurele source, bv. predicate |
| `slot-default` | standaard LEX-slot, bv. comp of aux |
| `infinitive` | werkwoordvorm voor latere regels |
| `participle` | VDW/perfectumvorm |

## Lexicon-editor

`lexicon-editor.html` laadt `lexicon-config.html` en `structure-config.html`. Daardoor kan de editor valideren of `sourceDefault` en `slotDefault` werkelijk in de omgeving bestaan.

De editor kan lexemen toevoegen, dupliceren, verwijderen, zoeken/filteren, lokaal als concept bewaren en een nieuwe `lexicon-config.html` downloaden.

## Voorbeeldzinnen

`examples-input.html` koppelt lexemen aan abstracte sources:

```text
lexeme=hond  source=subject
lexeme=bijt  source=predicate
lexeme=man   source=object
```

Het lexeme kan wisselen; de source blijft de structurele projectiebron.

## Markering in examples-input

```html
<strong>subject</strong>
<em>object</em>
```

Lidwoorden zijn verwijderd. Dus:

```text
de man  → man
de hond → hond
de trui → trui
```

## v4430 · LEX-volgorde

De volgorde van `<li class="lex-token">` in `examples-input.html` is de gezaghebbende woordvolgorde op de LEX-as. V2, topicalisatie en andere plaatsingsregels mogen die lijst niet herordenen; zij tekenen alleen gevulde vrije slots, Wissel-pijlen en traces.

## v4430 · trace als lokaal LEX-object

Voor V2 en topicalisatie wordt de trace als lokaal LEX-object behandeld. De voorbeeldzin bepaalt de gevulde slots; de Wisselregel tekent daarnaast een trace-slot op de LEX-as. Daardoor worden `HOND BIJT MAN` en `TRUI BREIT VROUW` als oppervlaktestring behouden, terwijl de oude basispositie als lokale trace zichtbaar blijft.



## v4445

- Bij keuze van een nieuwe voorbeeldzin reset de groei automatisch: playback stopt, stap gaat naar 0, selectie en role-swap worden leeggemaakt.
- Voorbeeldzinnen worden inhoudelijk gevalideerd op thematische rollen en selectieframes.
- Ongeldige combinaties zoals `TRUI BREIT VROUW` met `TRUI` als subject/agens worden afgekeurd met reden: `trui` is patiens/object, geen agens/subject.
- Gemarkeerde/topicalisatie-uitingen zoals `TRUI BREIT VROUW` worden geaccepteerd wanneer `TRUI` object/patiens blijft en `VROUW` subject/agens blijft; de viewer toont dan een notice.
