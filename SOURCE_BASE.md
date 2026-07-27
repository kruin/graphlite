# SOURCE_BASE

- Release: `v2.0.0-rc.39`
- Volledige basis: `OpenGraph_Lite_Viewer_v1.0.16_stable_central_tree_views.zip`
- Overnamebeleid: alle bestanden uit de bijlage behouden waar technisch mogelijk.
- Functionele correctie: `Functional` is de tweede centrale view na `Syntax`; `LOG` blijft uitsluitend de zuidas/named projection.
- Profielcontract: OGN Basis gebruikt alleen S/O/V-majors; ingeschakelde
  toepassingen kunnen aanvullende plaatsingsdata toevoegen.
- Voorconfigcontract: algemene mogelijkheden gaan vooraf aan toepassingen;
  insertie is afzonderlijk schakelbaar op LEX, SYNT en LOG. Bijwoorden vereist
  LEX + LOG.
- Mobiel layoutcontract: MAX focust het stabiele asgebied, ook bij geforceerd
  Desktop; README blijft verstelbaar en het raster eindigt op LEX/SYNT/LOG.
- Lokaal testcontract: staand/liggend blijft onder MAX een vast telefoonframe;
  de cachequery gebruikt de actuele viewerversie.
- Plaatsingscontract: LOG bepaalt via vaste slotafstand de neutrale LEX-basis;
  de voorbeeldzin valideert alleen.
- Normatieve specificatie: `projectie-master-spec.md`.
- Compatibiliteit: oude opgeslagen waarde `functional` wordt als `ft` gelezen.
- Gekozen UI-oplossing: bij `Bron` verschijnt de combineerbare keuze `Assen`; de bovenbalk is in rc.6 gecomprimeerd.
