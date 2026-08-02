# SOURCE_BASE

- Release: `v2.0.0-rc.45`
- Actuele source build:
  `v2.0.0-rc.45-grid-style-direct-modes-eol-20260802.2`.
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
- Plaatsingscontract: LOG bepaalt via vaste slotafstand de neutrale LEX-basis;
  de voorbeeldzin valideert alleen.
- Meetcontract: subtree-boxen worden bottom-up uit nodevormen, labels,
  child-boxen en caption gemeten; toepassingen leveren abstracte demands en
  geen pixelcoördinaten.
- Normatieve specificatie: `projectie-master-spec.md`.
- Compatibiliteit: oude opgeslagen waarde `functional` wordt als `ft` gelezen.
- Gekozen UI-oplossing: bij `Bron` verschijnt de combineerbare keuze `Assen`; de bovenbalk is in rc.6 gecomprimeerd.
