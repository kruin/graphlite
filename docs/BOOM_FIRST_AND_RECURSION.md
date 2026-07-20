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
