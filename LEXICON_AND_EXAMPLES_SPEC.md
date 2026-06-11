# Lexicon en voorbeeldzinnen v4405

## Bestanden

```text
lexicon-config.html
examples-input.html
examples-editor.html
```

## Lexicon

Bescheiden startlexicon:

| klasse | items |
|---|---|
| N/NP | man, hond, kat, vrouw, trui |
| V | bijt, breit |
| VDW | gebeten, gebreid |
| AUX/pv | heeft |
| COMP | omdat, dat |

Lidwoorden zijn verwijderd. Dus:

```text
de man  → man
de hond → hond
de trui → trui
```

## Markering in examples-input

```html
<strong>subject</strong>
<em>object</em>
```

Voorbeelden:

```html
<strong>HOND</strong> BIJT <em>MAN</em>
OMDAT <strong>HOND</strong> <em>MAN</em> BIJT
<strong>VROUW</strong> BREIT <em>TRUI</em>
OMDAT <strong>VROUW</strong> <em>TRUI</em> BREIT
<strong>HOND</strong> HEEFT <em>MAN</em> GEBETEN
```

## Koppeling

Een voorbeeldzin koppelt zichtbare lexemen aan structurele bronnen:

```text
lexeme = HOND
source = subject
```

Het lexeme kan wisselen. De source blijft de projectiebron.
