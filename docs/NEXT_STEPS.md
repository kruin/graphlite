
## v4540 - Bijwoorden als externe LEX-slots

Bijwoordplaatsing blijft volledig op de LEX-as. `Boven S/NP/VP/V/PP/AP` betekent: plaats een extern LEX-slot verticaal net boven de gekozen syntactische hostbox. Het bijwoord wordt niet op de syntaxboom getekend en is geen projectie uit de basisboom. De host-subboom wordt lager gezet om ruimte te maken. Notatie: `LEX-ADV[..., axis=LEX, source=external, host=...]`.

# Next steps v4430

## Na v4430

- Controleer visueel per voorbeeldzin of alle projectielijnen naar LEX exact horizontaal zijn.
- Maak een compacte legenda: projectie = horizontaal, Wissel = lokaal op de as.
- Breid later uit met V1 als aparte LEX-regel.


---

# Next steps v4430

## Na v4430 · V2/Wissel

- V1 als aparte LEX-regel modelleren.
- Topicalisatie-editor expliciet maken: topic kiezen zonder thematische rollen te wijzigen.
- Meer trace-typen toevoegen (`t[NP]`, `t[V]`, `t[pv]`) en exporteren in `.opn`.

---

1. Topicalisatie als LEX-regel uitwerken.
2. Lexiconeditor koppelen aan voorbeeldeditor met directe refresh/exportflow.
3. `structure-config.html` en `lexicon-config.html` uniformer valideren.
4. Preview in editors verbeteren: direct laten zien welke OPN-bron en LEX-projectie ontstaan.
5. Handleiding uitwerken met screenshots, inclusief groei-stappen.
6. Export maken van docs naar PDF of HTML-handleiding.
7. Functionele structuur verder testen met perfectum en meer werkwoorden.
8. Voorbeeldenset uitbreiden zonder lidwoorden.
9. Configschema documenteren met foutmeldingen per regel.

## Na v4430

- Uitingeneditor uitbreiden van korte zinnen naar meerdere zinstypen en grotere sets.
- Groepering/tags toevoegen aan voorbeeldzinnen en selectieframes verder verfijnen.
- Exportbundel maken voor beide HTML-configs tegelijk.

- Dynamische boomruimte visueel testen met bredere voorbeeldsets en langere zinnen.


## Na v4535

- Vraagzin als echt voorbeeldtype toevoegen.
- Per zinstype automatische validatie toevoegen: resultaat moet exact de voorbeeldzin zijn.
- Visueel controleren dat de LEX-as niet comprimeert en dat traces op de oude basisplek blijven.


## v4537 — bijwoordvoorbeeldset

- Toegevoegd: `examples-adverbs.html`.
- Toegevoegd: `docs/LEX_ADVERB_EXAMPLE_SET.md`.
- Toegevoegd: `samples/adverb_host_examples_v4537.json`.
- `examples-input.html` bevat nu een aparte bijwoordtestset naast HOND BIJT MAN / VROUW BREIT TRUI.
- Eén bijwoord per voorbeeldzin.
- Default-host per categorie: MODALITEIT→S, TIJD→S, FREQUENTIE→VP, PLAATS→VP, NEGATIE→V, GRAAD→AP, WIJZE→V, REDEN/OORZAAK→S, VOORWAARDE→S, FOCUS→NP.
- Geforceerde afwijkingen krijgen notatie `functional:marked-host`.
