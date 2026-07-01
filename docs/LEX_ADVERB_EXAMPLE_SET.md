# LEX-bijwoorden — voorbeeldset v4540

Status: GraphLite. De Java-app is buiten scope.

## Regel

Bijwoorden worden in deze fase niet als tussenboxen op de LEX-as getekend. Elk bijwoord krijgt een host en wordt boven een geldige syntactische categoriebox geplaatst.

Geldige hostboxes:

```text
S, NP, VP, V, PP, AP
```

De host is default ongemarkeerd. Een afwijking van de default-host is gemarkeerd/geforceerd.

## Notatievoorstel voor markering

Gebruik voorlopig een functionele annotatie, niet SYNT:

```text
ADV[word=WAARSCHIJNLIJK, class=MODALITEIT, defaultHost=S, host=S, marking=default]
ADV[word=WAARSCHIJNLIJK, class=MODALITEIT, defaultHost=S, host=V, marking=functional:marked-host]
```

Motivatie: de plaatsing wijzigt de centrale syntactische boom niet. De markering zegt iets over scope/focus/interpretatie van de projectie, niet over een nieuwe syntactische categorie.

## Defaults per categorie

| categorie | voorbeeld | default-host | toelichting |
|---|---:|---:|---|
| MODALITEIT | waarschijnlijk | S | scope over de propositie |
| TIJD | gisteren | S | zinstijd; VP is mogelijk bij smallere event-scope |
| FREQUENTIE | vaak | VP | event-/predicaatdomein |
| PLAATS | daar | VP | locatief in VP-domein; PP bij expliciete PP-structuur |
| NEGATIE | niet | V | V-nabij; VP/S alleen bij bredere scope |
| GRAAD | heel | AP | modificeert adjectief/adverbium |
| WIJZE | hard | V | dicht bij predicaat |
| REDEN/OORZAAK | daarom | S | verklaart de propositie/uiting |
| VOORWAARDE | anders | S | conditionele/gevolg-scope |
| FOCUS/RESTRICTIEF | alleen | NP | bij NP-focus; VP bij VP-focus |

## Voorbeeldzinnen — één bijwoord per zin

| id | zin | categorie | default-host | actuele host | markering |
|---|---|---|---|---|---|
| `adv-modal-waarschijnlijk-s` | HOND BIJT WAARSCHIJNLIJK MAN | MODALITEIT | `S` | `S` | `default` |
| `adv-time-gisteren-s` | HOND BIJT GISTEREN MAN | TIJD | `S` | `S` | `default` |
| `adv-freq-vaak-vp` | HOND BIJT VAAK MAN | FREQUENTIE | `VP` | `VP` | `default` |
| `adv-place-daar-vp` | HOND BIJT DAAR MAN | PLAATS | `VP` | `VP` | `default` |
| `adv-neg-niet-v` | HOND BIJT NIET MAN | NEGATIE | `V` | `V` | `default` |
| `adv-degree-heel-ap` | HOND IS HEEL MOOI | GRAAD | `AP` | `AP` | `default` |
| `adv-manner-hard-v` | VROUW BREIT HARD TRUI | WIJZE | `V` | `V` | `default` |
| `adv-cause-daarom-s` | DAAROM BIJT HOND MAN | REDEN_OORZAAK | `S` | `S` | `default` |
| `adv-cond-anders-s` | ANDERS BIJT HOND MAN | VOORWAARDE | `S` | `S` | `default` |
| `adv-focus-alleen-np` | ALLEEN HOND BIJT MAN | FOCUS | `NP` | `NP` | `default` |
| `adv-marked-waarschijnlijk-v` | HOND BIJT WAARSCHIJNLIJK MAN | MODALITEIT | `S` | `V` | `functional:marked-host` |


## Regels voor vervolg

1. Een bijwoord krijgt precies één host zolang er één bijwoord per zin wordt getest.
2. Default-host = ongemarkeerd.
3. Host ≠ default-host = gemarkeerd/geforceerd.
4. Markering blijft voorlopig functioneel: `functional:marked-host`.
5. SYNT blijft alleen de hostbox leveren; de syntactische boom wordt niet gemuteerd.
6. Later kunnen meerdere bijwoorden een eigen stack boven dezelfde host krijgen.
