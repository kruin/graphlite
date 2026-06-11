# Design decisions v4405

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
12. `Wissel S/O` wisselt lexicale vulling, niet de structurele rollen.
13. `Layout order` bepaalt de zoekrichting van vrije plaatsing: `left-first` of `right-first`.
14. Flip is layout, geen grammaticale transformatie.
15. Vanaf v4405 is flip configureerbaar per vertakking.
16. Default is `auto-compact`: kies per branch de kleinste bruikbare layout.
17. Tweede doel is `auto-align`: probeer verticale rolcorridors beter te alignen, bijvoorbeeld `object/PATIENS` en `subject/AGENS`.
18. Handmatige branch-overrides bestaan voor `Top S/CLAUSE`, `VP / ARG-STRUCT` en `Overig`.
19. Topicalisatie wordt voorbereid via een slot tussen beginknoop en bovenste boomknoop.
20. `slot 0` is Comp/(om)dat op LEX, boven de S/CLAUSE-box.
21. `slot 1` is vooropplaatsing/topicalisatie tussen startknoop en bovenste boomlaag.
