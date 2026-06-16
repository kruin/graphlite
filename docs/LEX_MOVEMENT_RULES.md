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


## v4449 · stapsgewijze LEX-Wissels

- De boomgroei blijft deterministisch: binnen een groeilaag wordt gerenderd van boven naar beneden en daarna van links naar rechts.
- Flip/layout wijzigt de berekende posities; daardoor kan de groeivolgorde indirect veranderen, maar de renderregel blijft ruimtelijk: boven → beneden, links → rechts.
- In Assen verschijnt de LEX-as nu stapsgewijs: eerst de horizontale basisprojectie, daarna per stap één lokale Wissel met trace, daarna pas het volledige resultaat met projectiepanelen.
- Verplaatsingen blijven lokaal op de LEX-as; er komen geen verplaatsingslijnen vanuit de boom.


## v4478 · configureerbare vrije LEX-slots

Vrije slots zijn nu gesplitst in twee soorten. **Boom vrije rijen** reserveren lege ruimte onder de wortel van de centrale OPN-boom. **LEX vrije slots** zijn configureerbare, plaatsbare insertiepunten op de LEX-as. Ze zijn voorbereid op toekomstig gebruik: insertie van lexicale elementen uit andere LEX-assen/andere bomen, bijvoorbeeld bijwoordelijke onthoofde zinnen, en anaforische elementen uit andere zinnen of uitingen. De export noteert daarom `lex_free_slot_count`, `lex_free_slot_placement` en een schema voor toekomstige bronnen. De NOORD-as blijft als mogelijke toekomstige as genoteerd, maar is nog niet actief.

## v4505 - OSV-! en LEX-rendering

OSV-! is bewust gemarkeerd met een uitroepteken. De box-aanpak kan nooit OSV opleveren als basisalternatief: de VP blijft object en werkwoord als subtree groeperen. Een pure flip van boxen is dan onvoldoende.

Voor een correcte zichtbare LEX-as moet altijd een expliciete verplaatsingsregel werken. OSV-! is dus geen basis-layout of taalkundig alternatief, maar een waarschuwing/testlabel bij een onmogelijke boxvariant. De andere volgordes en bestaande flips blijven hierdoor ongemoeid.

