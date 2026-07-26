# Bijwoorden als LOG-minors · v2.0.0-rc.37

## Regel

Een bijwoord staat eerst als minor op de LOG-as:

```text
LOG-MINOR[word=VAAK, class=FREQUENTIE, after=O, before=V, width=1]
```

De minor:

- bezet één vast LOG-slot;
- vergroot de afstand tussen O en V met één;
- projecteert naar dezelfde neutrale LEX-rij;
- is geen centrale Syntax- of Functional-knoop.

## Configuratie

De gebruiker kiest `automatisch` of een expliciet interval:

```text
before-S · S-O · O-V · after-V
```

Automatisch gebruikt de klassekoppeling uit `structure-config.html`.
De vroegere hostwaarde blijft alleen als `scopehost` beschikbaar en stuurt
de afstand of rij niet.

## Meerdere minors

```text
S O m1 m2 V
```

levert:

```text
dLOG(O,V) = 3
```

De `order`-waarde bepaalt de stabiele volgorde van `m1` en `m2`.

## Vooropplaatsing

Een vooropgeplaatst bijwoord heeft eerst een gewone LOG-basispositie. Daarna
verplaatst een expliciete LEX-Wissel het naar het topic-slot; op de
LOG-afgeleide basisrij blijft een trace staan.
