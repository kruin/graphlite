# Boom eerst versus recursie-techniek

## Boom eerst

**Boom eerst** is de didactische en notationele volgorde in OpenGraph/JAN. De centrale open boom is de bron. Daarna worden projecties getekend naar de assen:

- LEX links/west: woordvolgorde, plaatsingsregels en LEX-inserties.
- SYNTAX rechts/oost: syntactische regels op boomhoogte.
- LOG onder/zuid: logische/functionele volgorde.

De centrale boom hoeft dus niet zelf alle oppervlaktevolgorde of alle verplaatsingen te dragen. LEX-wissels, traces en inserties blijven zichtbaar op de LEX-as.

## Recursie-techniek in de boom

**Recursie** is hier de technische tekenmethode. De viewer bouwt de layout bottom-up:

1. begin bij bladeren/eindknopen;
2. combineer die tot categorieknopen;
3. bereken per subtree een box;
4. combineer subtrees en boxen tot de volledige boom;
5. teken daarna projectielijnen en assen.

Dit is iets anders dan de didactische keuze **boom eerst**. Boom eerst zegt welke informatielaag de gebruiker eerst ziet. Recursie zegt hoe de viewer de boom technisch construeert.

## English

### Tree first

**Tree first** is the didactic and notational sequence in OpenGraph/JAN. The central open tree is the source. Projections are then drawn to the axes: LEX west, SYNTAX east and LOG south. LEX exchanges, traces and insertions remain visible on the LEX axis.

### Recursion technique in the tree

**Recursion** is the technical drawing method. The viewer builds the layout bottom-up: leaves, category nodes, subtrees, boxes, and finally the complete tree. This is separate from the didactic choice called **tree first**.

## Actueel contract · v2.0.0-rc.45

Na de recursieve gridplaatsing volgt nu een tweede, intrinsieke meetpass.
Iedere subtree-box omvat de werkelijke nodevormen, labels, child-boxen en het
eigen caption. Kleine unary boxen zoals `NP → HOND` krijgen daardoor hun
benodigde breedte en hoogte in plaats van dezelfde vaste zijmarge als S of VP.
De meetpass gebruikt één centrale policy en levert alleen geometrie aan de
renderer.

Toepassingen mogen een abstracte layout-demand declareren. Bijwoorden vraagt
bijvoorbeeld ruimte voor brede LEX-insertie, maar bepaalt geen x/y. Handheld
MAX neemt de volledige LEX-inhoud en alle SYNT-regelboxen op in het stabiele
Syntax/Functional-kader. Het volledige contract staat in
`RECURSIVE_LAYOUT_AND_APPLICATION_CONTRACT.md`.
