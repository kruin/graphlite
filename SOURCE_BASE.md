# SOURCE_BASE

- Release: `v2.0.0-rc.45`
- Actuele source build:
  `v2.0.0-rc.45-sources-language-tree-anafoor-extensie-20260821.16`.
- Leidende samenvoegbasis:
  `OpenGraph_Lite_Viewer_v2.0.0-rc.45_full_source(5)(1).zip`
  (source build `v2.0.0-rc.45-direct-config-context-only-20260802.6`).
- Overgezette uitbreiding: Anafoor · multi-OGN uit source build
  `v2.0.0-rc.45-multi-ogn-anafoor-20260813.5`; de overige code en
  gedragscontracten blijven van de leidende Sources-basis.
- Correctie 20260814.9: S2 houdt MAN als bron-subject; de coreferentierelatie
  MAN–MAN projecteert pas op LEX een toepasselijk profiel (HIJ, DIE of DIE MAN).
- Correctie 20260820.10: in `HOND BIJT MAN` behouden HOND en MAN exact hun
  bron-y; BIJT wisselt als enige naar de vrije LEX-gridrij halverwege beide.
- Correctie 20260821.11: Anafoor-Play toont S1 en S2 na elkaar, inclusief
  `ZIE → V2` en `DRAAGT → V2`; pas na MAN–MAN volgt `MAN → HIJ` op LEX.
- Correctie 20260821.12: Anafoor is Language Tree-extensie 1 met meerdere
  Config-combinaties en heterogene `relations[]`. De opdrachtgeversfixture
  bewaart naast `MAN→HIJ` ook `GISTEREN→VANDAAG (+1 dag)` als
  `semantic-only`; definities en zeven S1–S2-regressieparen zijn toegevoegd.
- Correctie 20260821.13 vervangt die historische `.12`-interpretatie:
  **Text** is uitsluitend de centrale uiting; **Context** is alles daaromheen
  en is een nog te ontwikkelen geminimaliseerde Open Graph Notation-boom.
  Iedere insertie is Context, ongeacht `origin`. `relations[]` bevat
  uitsluitend Text-coreferentie; `GISTEREN`, `VANDAAG`, `ER`, `NIET MEER`
  en `OMDAT` zijn zelfstandige Context-inserties op LEX. Config bevat vier
  combinaties en
  acht regressieparen. `De boer slaat de ezel omdat hij hem bezit.` heeft
  `BOER→HIJ` én `EZEL→HEM`; het bijzinswerkwoord blijft finaal. Nadere
  Context-uitwerking blijft p.m.; de Context-boom is gedocumenteerd.
- Correctie 20260821.14: Playwright en Chromium zijn alleen vereist voor de
  optionele echte Anafoor-browsertest en voor opnieuw afleiden van de
  publicatiecarrousel. Ontbreken zij, dan blijft `publish_checked.bat`
  publiceren; echte runtime- en afhankelijkheidsfouten blijven blokkeren.
- Correctie 20260821.15: alle bestanden uit de oorspronkelijke bronzip zijn
  behouden, inclusief de Config-uitlegstandaard en de actieve
  LEX-profielcontrole. Git staged eerst met `git add -A`; pas daarna volgt
  renormalisatie, ook wanneer een gevolgd bestand lokaal verdwenen is.
- Correctie 20260821.16: de projectnormalizer verwijdert ook trailing
  whitespace op iedere tekstregel vóór de releasecontrole en Git-staging;
  Markdown-hard-break-spaties blokkeren `git diff --cached --check` niet meer.
- Volledige basis: `OpenGraph_Lite_Viewer_v1.0.16_stable_central_tree_views.zip`
- Overnamebeleid: alle bestanden uit de bijlage behouden waar technisch mogelijk.
- Functionele correctie: `Functional` is de tweede centrale view na `Syntax`; `LOG` blijft uitsluitend de zuidas/named projection.
- OGN-kerncontract: iedere knoop is baas op zijn eigen horizontale en verticale
  gridlijn; hard geldt `A ≠ B ⇒ x(A) ≠ x(B) én y(A) ≠ y(B)`. Twee knopen
  delen dus nooit een horizontale of verticale lijn. Knopen worden één voor
  één op vrije plaatsen geschreven; zo'n overtreding heet gridlijnhergebruik
  en een ongeldige fallback wordt niet getekend.
- Plaatsingscontract algemeen: een ruleset bepaalt geldige plaatsen en een
  zoekstrategie bepaalt de kandidaatvolgorde; de eerstgevonden geldige plek
  wordt bij directe plaatsing meteen geschreven.
- Geaccepteerde Greedy Grow-reconstructie: centraal startpunt, direct één knoop per stap en
  geen toekomstig eindbeeld in state. De historische vierarmige volgorde
  reproduceert de bewaarde 12/31/96-demo's exact. Experimentele zoekvolgorden
  hebben vastgelegde tie-breaks; de gemeten omtrekkende beweging is geen
  bewezen wereldwijd optimum. Geaccepteerd op 2 augustus 2026; slide 5 wordt
  rechtstreeks uit dezelfde engine afgeleid.
- Interfacehiërarchie: Language Tree is de prominente berekende toepassing;
  Greedy Grow en Random zijn directe OGN-illustraties. Random gebruikt een
  afzonderlijke seedbare engine en wijzigt de Greedy-carrouselbron niet.
- Lijnbeeldcontract: rasterkleur en raster-, projectie- en boxlijnzwaarte zijn
  onafhankelijk instelbaar; LEX, SYNT en LOG hebben afzonderlijke kleuren voor
  overeenkomstige assen, projectielijnen en boxen.
- Tekstbroncontract: `.gitattributes` bepaalt LF/CRLF en de normalizer bewaakt
  exact één afsluitende EOL vóór release en staging.
- Laagvolgorde: OGN Free Placement → OGN Projection → OGN Calculated
  Placement. De Two-Pass Language Tree is één berekende toepassing.
- Taalprofielcontract: het zichtbare profiel OGN Basis is de basis van de
  taaltoepassing en gebruikt alleen S/O/V-majors; ingeschakelde toepassingen
  kunnen aanvullende plaatsingsdata toevoegen.
- Voorconfigcontract: algemene mogelijkheden gaan vooraf aan toepassingen;
  insertie is afzonderlijk schakelbaar op LEX, SYNT en LOG. Bijwoorden vereist
  LEX + LOG.
- Mobiel layoutcontract: MAX omvat volledige LEX-inhoud, de stabiele centrale
  unie en volledige SYNT-regelboxen, ook bij geforceerd Desktop; README blijft
  verstelbaar en het raster eindigt op LEX/SYNT/LOG.
- Landscapecontract: menu, SVG en Play overlappen niet; de lagere, bredere
  layout gebruikt een `contain`-fit waarin LEX, SYNT en LOG volledig blijven.
- Lokaal testcontract: staand/liggend blijft onder MAX een vast telefoonframe;
  de cachequery gebruikt de actuele viewerversie.
- Plaatsingscontract: LOG plant via vaste slotafstand mogelijke LEX-plaatsen,
  maar alleen expliciete topic-/V1-/V2-regels verplaatsen bronwoorden; de
  voorbeeldzin valideert alleen.
- Meetcontract: subtree-boxen worden bottom-up uit nodevormen, labels,
  child-boxen en caption gemeten; toepassingen leveren abstracte demands en
  geen pixelcoördinaten.
- Normatieve specificatie: `projectie-master-spec.md`.
- Compatibiliteit: oude opgeslagen waarde `functional` wordt als `ft` gelezen.
- Gekozen UI-oplossing: bij `Bron` verschijnt de combineerbare keuze `Assen`; de bovenbalk is in rc.6 gecomprimeerd.
