# LEX-plaatsingsregels

De viewer gebruikt de LEX-as om de zichtbare woordvolgorde van de voorbeeldzin te maken.

De centrale graph blijft staan. LEX-projectie en LEX-verplaatsing zijn asbewerkingen.

## Projectiemerkers

Eerst projecteren lexicale bronknopen horizontaal naar de LEX-as. De positie op de LEX-as heet een projectiemerker.

```text
bronknoop → projectielijn → projectiemerker
```

LEX en de LEX-projectielijnen zijn blauw.

## Hoofdregel

```text
1. Plaats alle centrale bronknopen.
2. Projecteer lexicale bronknopen naar LEX-projectiemerkers.
3. Activeer daarna LEX-verplaatsingen.
4. Verplaats alleen naar een gereserveerde lege plek.
5. Een verplaatste projectiemerker laat op de oude basisplek een trace achter.
6. Lees de zichtbare woorden; traces lees je niet mee.
```

## Lege plekken

```text
slot 0 = Comp / voegwoord, bijvoorbeeld OMDAT of DAT
slot 1 = vooropplaatsing / topic / eerste zinsdeel
slot 2 = V2 / persoonsvorm
slot 3+ = post-V2 of extra LEX-posities
bijwoordslot = extern slot boven hostbox
trace = oude basisplek na Wissel
```

## Ruimte maken

Lege plekken kunnen ontstaan door:

```text
vrije rij                         extra gridruimte
verlengde tak                     langere tak naar een subboom of grens
host-subboom lager plaatsen       ruimte boven S, NP, VP, V, PP of AP
```

## Hoofdzin

Voorbeeld:

```text
HOND BIJT MAN
```

Basisprojectie:

```text
HOND  MAN  BIJT
```

Plaatsingsregels:

```text
HOND  → slot 1  vooropplaatsing/topic
BIJT  → slot 2  V2 / persoonsvorm
MAN   blijft op de basisprojectiemerker
```

Resultaat:

```text
HOND BIJT MAN
```

Traces:

```text
t[subject] blijft op de oude HOND-basisplek
t[V]       blijft op de oude BIJT/V-basisplek
```

## Bijzin met OMDAT

Voorbeeld:

```text
OMDAT DE HOND DE MAN HEEFT GEBETEN
```

```text
OMDAT → slot 0 / Comp
subject, object en werkwoordcluster blijven in de bijzinvolgorde
geen V2-wissel
```

## Bijwoorden

Bijwoorden zijn externe LEX-inserties. Het lege bijwoordslot wordt eerst aangebracht op hosthoogte. Daarna pas werken LEX-Wissels.

```text
bijwoordslot boven S / NP / VP / V / PP / AP
hostbox of host-subboom maakt ruimte
syntaxstructuur blijft gelijk
```
