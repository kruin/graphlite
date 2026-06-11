# Known issues v4408

1. Browsercache of oude tabs kunnen nog oude configbestanden opvragen. De no-cache server en querystrings beperken dit.
2. Lokale HTML-bestanden kunnen meestal niet direct door de browser worden overschreven. Editors downloaden nieuwe versies; de gebruiker vervangt het bestand handmatig.
3. Er is nog geen volwaardige lexiconeditor.
4. JSON/.OPN import/export is beperkt en niet de primaire bron voor structure-config of examples-input.
5. Topicalisatie is voorbereid met slots, maar nog niet volledig als aparte lokale LEX-regel uitgewerkt.
6. Perfectumstructuur is aanwezig, verdere varianten zoals passief/vragen zijn nog niet uitgewerkt.
7. De viewer is een demo/prototype, geen volledige grammatica-engine.


## Cache/root verwisseling
Als de debug meldt dat `index.html` ongeveer 3540 bytes is of niet `viewer-index OK`, wordt waarschijnlijk `docs/docs-home.html` als root geserveerd of staat GitHub Pages op `/docs` als bron. Start de server in de map `greedy-grow-viewer/` en gebruik voor GitHub Pages de root van deze map als publicatiebron.


## Root-index versus docs-index
Vanaf v4408 is `docs/index.html` verwijderd en heet de documentatie-startpagina `docs/docs-home.html`. Daardoor kan een unzip/publicatieproces de root `index.html` niet meer met de docs-index verwarren. `viewer.html` is een fallback-entry voor de viewer.


## Opgelost in v4408

- v4407-probleem: `Groei` actief → naar `LEX` → terug naar `Assen`/`Bron` gaf geen boom. Oorzaak: de niet-ondersteunde LEX-projectie clamped de globale groeistap naar 0. Oplossing: projectiewissel bewaart de laatst geldige groeistap en clamped alleen binnen ondersteunde groei-projecties.
