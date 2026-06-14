# LEX-plaatsingsregels — simpel overzicht

Deze viewer gebruikt de LEX-as om de woordvolgorde van de voorbeeldzin te maken.

De boom zelf blijft de basisstructuur. Verplaatsingen worden niet vanuit de boom getekend. Ze staan alleen lokaal op de LEX-as.

## Hoofdregel

```text
1. Bouw eerst de syntaxboom.
2. Projecteer de lexicale knopen horizontaal naar de LEX-as.
3. Pas daarna lokale plaatsingsregels toe op de LEX-as.
4. Verplaats alleen naar een vrij slot.
5. Een verplaatste knoop laat op de oude basisplek een trace achter.
6. Lees de voorbeeldzin door de gevulde woorden te lezen; traces lees je niet mee.
```

## Vrije slots

Voorlopig zijn er drie vrije slots:

```text
slot 0 = Comp / voegwoord, bijvoorbeeld OMDAT
slot 1 = eerste zinsdeel / topic
slot 2 = V2 / persoonsvorm
```

Een gewone NP of V mag dus niet zomaar ergens heen. Er is alleen een Wissel als een van deze slots gevuld moet worden.

---

## 1. Hoofdzin

Voorbeeld:

```text
HOND BIJT MAN
```

Basisboom:

```text
S → NP VP
VP → NP V
```

Basisvolgorde op de LEX-as:

```text
HOND  MAN  BIJT
```

Plaatsingsregels:

```text
HOND  → slot 1  eerste zinsdeel
BIJT  → slot 2  V2 / persoonsvorm
MAN   blijft op de basisplek
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

---

## 2. Bijzin met OMDAT

Voorbeeld:

```text
OMDAT HOND MAN BIJT
```

Basisboom:

```text
S → NP VP
VP → NP V
```

Plaatsingsregels:

```text
OMDAT → slot 0  Comp
HOND  blijft op basisplek
MAN   blijft op basisplek
BIJT  blijft op basisplek
```

Resultaat:

```text
OMDAT HOND MAN BIJT
```

Geen V2-Wissel. Geen extra traces.

---

## 3. Topicalisatie

Voorbeeld:

```text
TRUI BREIT VROUW
```

De thematische rollen blijven hetzelfde:

```text
VROUW = agens / subject
TRUI  = patiens / object
```

Basisvolgorde:

```text
VROUW  TRUI  BREIT
```

Plaatsingsregels:

```text
TRUI  → slot 1  eerste zinsdeel / topic
BREIT → slot 2  V2 / persoonsvorm
VROUW blijft op basisplek
```

Resultaat:

```text
TRUI BREIT VROUW
```

Traces:

```text
t[object] blijft op de oude TRUI/object-basisplek
t[V]      blijft op de oude BREIT/V-basisplek
```

---

## 4. Perfectum

Voorbeeld:

```text
HOND HEEFT MAN GEBETEN
```

Plaatsingsregels:

```text
HOND  → slot 1  eerste zinsdeel
HEEFT → slot 2  V2 / persoonsvorm
MAN   blijft op basisplek
GEBETEN blijft op basisplek
```

Resultaat:

```text
HOND HEEFT MAN GEBETEN
```

Traces:

```text
t[subject] blijft op de oude HOND-basisplek
t[pv]      blijft op de oude HEEFT/PV-basisplek
```

---

## 5. Vraagzin

Nog niet volledig uitgewerkt in de voorbeelden.

Eenvoudige voorlopige regel voor een ja/nee-vraag:

```text
persoonsvorm → eerste verbale vrije positie
subject en object blijven op basisplekken, tenzij een aparte topicregel geldt
```

Voorbeeld later:

```text
BIJT HOND MAN?
```

Daarvoor moet de viewer nog een apart vraagzin-type krijgen. Tot die tijd wordt vraagzin niet als volwaardig zinstype gevalideerd.

---

## Wat niet mag

```text
Niet: woorden automatisch naar gewone woordrijen schuiven.
Niet: MAN verplaatsen alleen omdat MAN visueel hoger/lager staat.
Niet: Wissellijnen vanuit de boom tekenen.
Niet: LEX-as comprimeren zodat basisplekken hun horizontale hoogte verliezen.
```

## Korte formule

```text
basisprojectie blijft staan
vrije slots worden gevuld
oude plek wordt trace
resultaat = voorbeeldzin
```


## v4446 · stapsgewijze LEX-Wissels

- De boomgroei blijft deterministisch: binnen een groeilaag wordt gerenderd van boven naar beneden en daarna van links naar rechts.
- Flip/layout wijzigt de berekende posities; daardoor kan de groeivolgorde indirect veranderen, maar de renderregel blijft ruimtelijk: boven → beneden, links → rechts.
- In Assen verschijnt de LEX-as nu stapsgewijs: eerst de horizontale basisprojectie, daarna per stap één lokale Wissel met trace, daarna pas het volledige resultaat met projectiepanelen.
- Verplaatsingen blijven lokaal op de LEX-as; er komen geen verplaatsingslijnen vanuit de boom.
