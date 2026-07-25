# Source changes · v2.0.0-rc.18

## Horizontale LEX-projectie hersteld

De LOG-afgeleide doelrij werd in rc.17 ten onrechte meteen als
projectieanker gebruikt. Daardoor konden werkwoorden zoals `BIJT` te hoog op
LEX verschijnen en kreeg de bronprojectielijn een verticale sectie.

De afleiding is nu:

```text
bronknoop
→ horizontale LEX-projectie op SOURCE-Y
→ Wissel langs LEX naar de LOG-doelrij
→ eventuele expliciete topic-/V2-Wissel
```

- Bron → LEX blijft exact horizontaal.
- LOG bepaalt een doelrij, niet de bronhoogte.
- Bronanker → LOG-doel krijgt `Wissel LOG → LEX`.
- Op de horizontale bronhoogte blijft een trace staan.
- Een latere V2-Wissel vertrekt vanaf de LOG-doelrij en laat daar een tweede
  trace staan.

## Play

Na LOG en de gereserveerde doelruimte toont fase 3 eerst de horizontale
LEX-bronprojecties. De verplaatsingen naar LOG-doelrijen en daarna
topic-/V2-slots volgen als afzonderlijke stappen.

## Config en OPN

Het contract bevat nu expliciet:

```text
lex-projection-origin=SOURCE-Y
lex-placement-mode=horizontal-then-move
```

OPN bewaart dezelfde waarden als `lex_projection_origin` en
`lex_placement_mode`.

## Regressiecontrole

`tools/check_lex_horizontal_projection.py` controleert:

- dat een bronlijn geen verticale sectie bevat;
- dat `BIJT` eerst laag op zijn bronhoogte staat;
- daarna naar de LOG-doelrij gaat;
- en pas daarna naar het V2-slot verhuist.

De volledige DOM-rendercontrole bevestigt bovendien dat Play-fase 3 `BIJT`
nog op de lage bronhoogte toont.
