
## v4540 - Bijwoorden als externe LEX-slots

Bijwoordplaatsing blijft volledig op de LEX-as. `Boven S/NP/VP/V/PP/AP` betekent: plaats een extern LEX-slot verticaal net boven de gekozen syntactische hostbox. Het bijwoord wordt niet op de syntaxboom getekend en is geen projectie uit de basisboom. De host-subboom wordt lager gezet om ruimte te maken. Notatie: `LEX-ADV[..., axis=LEX, source=external, host=...]`.

# Design decisions v4430

## v4430 · projectie ≠ Wissel

33. LEX-projectie is horizontaal: bronknoop naar eigen bronpositie op de LEX-as.
34. Wissel is een lokale as-regel: vrije slotvulling en trace ontstaan op de LEX-as, niet in de centrale boom.
35. De voorbeeldzin blijft zichtbaar als string boven de viewer; de LEX-as toont de structurele projectie plus de lokale plaatsingsregel.


---

# Design decisions v4430

## v4430 · V2 als LEX-Wissel

19. V2 wordt niet in de centrale boom opgelost.
20. V2 is voorlopig een lokale LEX-plaatsingsregel.
21. Elke verplaatsing wordt als **Wissel** getoond: inhoud naar vrij slot, oude plaats = trace.
22. Nederlands gebruikt in hoofdzinnen slot 2 voor de persoonsvorm.
23. Bijzinnen met Comp/(om)dat gebruiken geen V2-Wissel in deze demo.
24. V1-talen kunnen later als aparte LEX-regel worden toegevoegd.

---

1. De boom wordt niet handmatig top-down getekend.
2. De boom wordt bottom-up recursief opgebouwd.
3. Per subtree worden eerst boxmaten en bezette cellen bepaald.
4. Daarna zoekt de layout vrije HOR/VER-plaatsen.
5. Pas na plaatsing wordt gerenderd.
6. Syntax en functioneel zijn aparte OPN-bronnen.
7. Functioneel gebruikt `CLAUSE → PRED ARG-STRUCT` zodat predicaat en argumentstructuur als eigen subtree-boxen vrij kunnen worden geplaatst.
8. Lexicale woorden staan niet in `structure-config.html`.
9. Woorden staan in `lexicon-config.html`.
10. Voorbeeldzinnen koppelen lexemen aan abstracte sources zoals `subject`, `object`, `predicate`, `pv`, `vdw`.
11. Lidwoorden/determinatoren zijn voorlopig uit het systeem verwijderd.
12. De oude `Wissel S/O`-route is uit de hoofdviewer gehaald; voorbeeldzinnen moeten via het lexicon en de thematische frames plausibel blijven.
13. `Layout order` bepaalt de zoekrichting van vrije plaatsing: `left-first` of `right-first`.
14. Flip is layout, geen grammaticale transformatie.
15. Vanaf v4402 is flip configureerbaar per vertakking.
16. Default is `auto-compact`: kies per branch de kleinste bruikbare layout.
17. Tweede doel is `auto-align`: probeer verticale rolcorridors beter te alignen, bijvoorbeeld `object/PATIENS` en `subject/AGENS`.
18. Handmatige branch-overrides bestaan voor `Top S/CLAUSE`, `VP / ARG-STRUCT` en `Overig`.
19. Topicalisatie wordt voorbereid via een slot tussen beginknoop en bovenste boomknoop.
20. `slot 0` is Comp/(om)dat op LEX, boven de S/CLAUSE-box.
21. `slot 1` is vooropplaatsing/topicalisatie tussen startknoop en bovenste boomlaag.

22. Vanaf v4430 is groei-presentatie een aparte presentatielaag bovenop de berekende layout.
23. Groei mag de layout niet herberekenen en geen x/y-posities wijzigen.
24. Groei gebruikt bottom-up node-hoogte: leaves eerst, root laatst; daarna verschijnen OPN-slot en projecties.
25. Render-volgorde blijft z-order; groei-volgorde blijft didactische presentatievolgorde.

26. Vanaf v4430 wordt het lexicon via `lexicon-editor.html` beheerbaar en uitbreidbaar.
27. De lexicon-editor mag geen structurele sources aanmaken; die blijven exclusief in `structure-config.html`.
28. De lexicon-editor exporteert alleen `lexicon-config.html`; concrete zinnen blijven in `examples-input.html`.

29. Vanaf v4430 beheert de lexicon-editor ook de verzameling korte voorbeelduitingen.
30. De aparte voorbeelden-editor blijft voorlopig compatibel, maar is niet langer de hoofdroute.
31. Voorbeelden blijven concrete HTML-input; de lexicon-editor genereert alleen de concrete korte uitingen, niet de structurele sources zelf.

32. Vanaf v4430 bevat het lexicon thematische rollen naast syntactische rollen.
33. Voor korte actieve zinnen geldt voorlopig: subject = agens, object = patiens.
34. Predicaten kunnen eenvoudige selectieframes hebben (`frameSubjects`, `frameObjects`).
35. De voorbeeldzin-bouwer mag geen uitingen voorstellen waarin een patiens-only lexeme, zoals `trui`, als agens optreedt.


36. Vanaf v4430 is er onderscheid tussen discrete layoutcoördinaten en pixelprojectie.
37. `Boomruimte` mag cellX/cellY/fontScale wijzigen, maar niet de grammaticale of LEX-volgorde.
38. Auto-fit wijzigt alleen de SVG-viewBox; het is geen layoutstrategie.


## v4535 — eenvoudige documentatie LEX-plaatsingsregels

Toegevoegd: `docs/LEX_MOVEMENT_RULES.md`.

Kernregel:

```text
basisprojectie blijft staan
vrije slots worden gevuld
oude plek wordt trace
resultaat = voorbeeldzin
```

Beschreven zinstypen: hoofdzin, bijzin met OMDAT, topicalisatie, perfectum en voorlopige vraagzin.


## v4506 - Bijwoorden op de LEX-as

Bijwoord-inserts worden niet automatisch centrale boomknopen. De LEX-as reserveert plaats tussen boxen; bij verticale overlap wordt het slot op de overlap geplaatst. De uiteindelijke plaatsing hangt af van scope: tijd/frequentie in VP-slots, negatie in een NEG/V-nabij slot, wijze V-nabij, zinsbijwoorden hoog S/VP, focus phrase-intern/focus, graad AP/AdvP-intern.
