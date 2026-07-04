# LEX-bijwoordinsertie: plaatsingsregels per categorie

Versie: v4550

## Hoofdprincipe

Bijwoorden zijn in GraphLite geen projecties uit de basisboom en geen nieuwe SYNT-knopen. Een bijwoord wordt als externe lexicale insertie op de LEX-as geplaatst:

```text
LEX-ADV[word=..., class=..., axis=LEX, source=external, defaultHost=..., host=..., placement=above-host, order=before-movement, marking=...]
```

De hostbox is alleen een hoogteanker. `boven VP` betekent dus: een LEX-slot op de LEX-as net boven de VP-box/trace. De host-subboom schuift lager om een vrije rij te maken. Het bijwoord staat niet in de box.

## Afleidingsvolgorde

```text
1. bereken centrale basisboom
2. plaats externe LEX-ADV-slots boven hun hostbox/trace
3. voer LEX-Wissels uit: V2, topicalisatie, post-V2, enz.
4. laat traces staan waar zinsdelen zijn gewisseld
```

Daarom kan een bijwoord boven de oorspronkelijke host/trace blijven staan als het gehoste zinsdeel later naar een ander LEX-slot wisselt.

## Ongemarkeerd en gemarkeerd

- Ongemarkeerd: `host = defaultHost`, met `marking=functional:default-host`.
- Voorop/V2: bij `host=S` in een hoofdzin vult het bijwoord LEX-slot 1 en blijft de persoonsvorm V2 in slot 2. Markering: `functional:fronted-v2`.
- Gemarkeerd: `host != defaultHost` of expliciet `marking=functional:marked-host`.
- Gemarkeerd is functioneel/notationeel: het drukt scope, focus, contrast of predicaatnabijheid uit. Het is geen SYNT-transformatie.

## Configtabel

| Categorie | Voorbeelden | Ongemarkeerd/default | Gemarkeerd mogelijk | Werking |
|---|---|---|---|---|
| `MODALITEIT` | waarschijnlijk, misschien, zeker | `S` / `functional:fronted-v2` | `VP, V` / `functional:marked-host` | zinsmodaal: scope over de hele propositie; in hoofdzin als vooropplaatsing met V2/PV in slot 2 Gemarkeerd: smallere/predicaatnabije lezing of contrastieve focus |
| `TIJD` | gisteren, morgen, nu, straks | `S` / `functional:fronted-v2` | `VP, V-CLUSTER` / `functional:marked-host` | tijdskader voor de hele zin; voorop op de LEX-as activeert V2/inversie Gemarkeerd: tijdskader lager in het predicaat-/VP-domein; geen automatische V2 wanneer niet in slot 1 |
| `FREQUENTIE` | vaak, soms, altijd, zelden | `VP` / `functional:default-host` | `S, V` / `functional:marked-host` | frequentie van de VP/gebeurtenis Gemarkeerd: S = zinsbreed/focus; V = predicaatnabij of smaller bereik |
| `PLAATS` | daar, hier, buiten, ergens | `VP` / `functional:default-host` | `PP, S` / `functional:marked-host` | plaats van gebeurtenis in het VP-domein Gemarkeerd: PP = gekoppeld aan expliciete plaatsphrase; S = topicale/vooropgezette plaats |
| `NEGATIE` | niet, nooit, nergens | `V` / `functional:default-host` | `VP, S` / `functional:marked-host` | V-nabije negatie; bij perfectum boven V-CLUSTER, niet in de cluster Gemarkeerd: bredere scope over VP of hele propositie |
| `GRAAD` | heel, erg, zeer, nogal | `AP` / `functional:default-host` | `V, VP` / `functional:marked-host` | graadmodificatie van AP/kwaliteit Gemarkeerd: gemarkeerde graad/intonatie of predicaatbrede intensivering |
| `WIJZE` | hard, snel, zachtjes, goed | `V` / `functional:default-host` | `VP, S` / `functional:marked-host` | wijze van de handeling, predicaatnabij; bij perfectum boven V-CLUSTER Gemarkeerd: VP = gebeurtenisbreed; S = sterk gemarkeerd/contrastief |
| `REDEN_OORZAAK` | daarom, daardoor, zodoende | `S` / `functional:fronted-v2` | `VP` / `functional:marked-host` | zinsverband/reden voor de hele propositie; voorop met V2 Gemarkeerd: reden/oorzaak binnen het VP-domein of contrastief lager geplaatst |
| `VOORWAARDE` | anders, dan | `S` / `functional:fronted-v2` | `VP` / `functional:marked-host` | zinsverband/voorwaarde; voorop met V2 Gemarkeerd: voorwaardelijke lezing dichter bij predicaat/gebeurtenis |
| `FOCUS` | alleen, ook, zelfs, slechts | `NP` / `functional:default-host` | `VP, S` / `functional:marked-host` | scope over de gefocuste phrase, meestal NP Gemarkeerd: scope verschuift naar VP of hele zin; zichtbaar als functioneel gemarkeerd |

## Voorbeelden

### Ongemarkeerd zinsbijwoord

```text
LEX-ADV[word=WAARSCHIJNLIJK, class=MODALITEIT, axis=LEX, source=external, defaultHost=S, host=S, order=before-movement, marking=functional:fronted-v2]
```

Surface in hoofdzin:

```text
WAARSCHIJNLIJK | BIJT | HOND | MAN
slot 1         | V2   | subj | obj
```

### Gemarkeerde modale plaatsing

```text
LEX-ADV[word=WAARSCHIJNLIJK, class=MODALITEIT, axis=LEX, source=external, defaultHost=S, host=V, order=before-movement, marking=functional:marked-host]
```

Dit betekent: de modale lezing is niet neutraal zinsbreed, maar functioneel gemarkeerd dichter bij het predicaat geplaatst.

### Bijwoord vóór verplaatsing

```text
LEX-ADV[word=ALLEEN, class=FOCUS, axis=LEX, source=external, defaultHost=NP, host=NP, order=before-movement, marking=functional:default-host]
LEX-MOVE[source=NP, target=slot1, trace=t[NP], order=after-adverb]
```

Het bijwoord blijft op de LEX-as boven de oorspronkelijke NP/trace; de NP zelf kan later naar slot 1 wisselen.

## Klikbare gemarkeerde variant

Als voor hetzelfde woord een default- en een marked-variant bestaan, is de bijwoordknoop klikbaar. Klikken wisselt alleen `host` en `marking`. De centrale boom, SYNT-categorieën en lexicale bronitems blijven ongewijzigd.
