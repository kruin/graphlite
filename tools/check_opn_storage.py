from __future__ import annotations
import json,sys
from pathlib import Path

REQUIRED_TOP={"opn","document_type","opn_version","metadata","data","paradata"}
CURRENT_VERSION=(Path(__file__).resolve().parents[1]/"VERSION.txt").read_text(encoding="utf-8").strip()

def validate_multi_ogn(doc: dict) -> list[str]:
    errors=[]
    metadata=doc.get("metadata",{})
    data=doc.get("data",{})
    composition=data.get("composition",{})
    schema=composition.get("schema")
    legacy=schema=="ogn-multi-composition-v1"
    if metadata.get("profile")!="multi-ogn": errors.append("metadata.profile moet multi-ogn zijn")
    if metadata.get("extras")!=["multi-ogn-anaphor"]: errors.append("metadata.extras moet alleen multi-ogn-anaphor bevatten")
    if schema not in {"ogn-multi-composition-v1","ogn-multi-composition-v2"}: errors.append("data.composition.schema is ongeldig")
    if composition.get("order")!=["S1","S2"]: errors.append("data.composition.order moet S1, S2 zijn")
    if composition.get("calculation")!="independent-before-composition": errors.append("S1 en S2 moeten vóór compositie afzonderlijk worden berekend")
    if composition.get("rigid_shift_only") is not True: errors.append("data.composition.rigid_shift_only moet true zijn")
    if composition.get("grid_invariant_scope")!="per-ogn": errors.append("gridinvariant moet per-ogn gelden")
    if composition.get("cross_ogn_exception")!="declared-coreference-column-only": errors.append("kruis-OGN-uitzondering is ongeldig")
    units=composition.get("units")
    if not isinstance(units,list) or len(units)!=2:
        errors.append("data.composition.units moet exact twee eenheden bevatten")
        units=[]
    if units and [unit.get("id") for unit in units] != ["S1","S2"]:
        errors.append("multi-OGN-eenheden moeten S1 en S2 zijn")
    layouts=[]
    for unit in units:
        graph=unit.get("graph",{})
        nodes=graph.get("nodes")
        if not isinstance(nodes,list) or not nodes:
            errors.append(f"{unit.get('id','OGN')}.graph.nodes is leeg")
            continue
        if not isinstance(graph.get("edges"),list): errors.append(f"{unit.get('id','OGN')}.graph.edges ontbreekt")
        ids=[str(node.get("id", "")) for node in nodes]
        xs=[node.get("x") for node in nodes]
        ys=[node.get("y") for node in nodes]
        if not all(ids) or len(set(ids))!=len(ids): errors.append(f"{unit.get('id','OGN')} heeft ongeldige knoop-id's")
        if not all(isinstance(value,(int,float)) and not isinstance(value,bool) for value in xs+ys):
            errors.append(f"{unit.get('id','OGN')} heeft ongeldige gridcoördinaten")
        elif len(set(xs))!=len(xs) or len(set(ys))!=len(ys):
            errors.append(f"{unit.get('id','OGN')} schendt de unieke rij-/kolomregel")
        layouts.append(nodes)
    relation=composition.get("relation",{})
    antecedent=relation.get("antecedent",{})
    lower_endpoint=relation.get("anaphor",{}) if legacy else relation.get("referent",{})
    expected_lower_id="s2-hij" if legacy else "s2-man"
    if relation.get("type")!="coreference" or relation.get("direction")!="none": errors.append("relatie moet ongerichte coreference zijn")
    if relation.get("line")!="straight-vertical-no-arrow": errors.append("coreferentielijn moet recht, verticaal en zonder pijl zijn")
    if antecedent.get("nodeId")!="s1-man" or lower_endpoint.get("nodeId")!=expected_lower_id:
        errors.append(f"relatie moet s1-man en {expected_lower_id} verbinden")
    if len(layouts)==2:
        upper={node.get("id"):node for node in layouts[0]}
        lower={node.get("id"):node for node in layouts[1]}
        man=upper.get("s1-man")
        lower_node=lower.get(expected_lower_id)
        if not man or not lower_node or man.get("x")!=lower_node.get("x") or not lower_node.get("y",0)>man.get("y",0):
            errors.append(f"MAN–{'HIJ' if legacy else 'MAN'} moet verticaal zijn met S2 onder S1")
        if not legacy and (not lower_node or str(lower_node.get("label","")).upper()!="MAN"):
            errors.append("de bronknoop voor het S2-subject moet MAN blijven")
        shared_rows=[(a.get("id"),b.get("id")) for a in layouts[0] for b in layouts[1] if a.get("y")==b.get("y")]
        shared_cols=[(a.get("id"),b.get("id")) for a in layouts[0] for b in layouts[1] if a.get("x")==b.get("x")]
        if shared_rows: errors.append("S1 en S2 mogen geen rij delen")
        if shared_cols != [("s1-man",expected_lower_id)]: errors.append(f"alleen de MAN–{'HIJ' if legacy else 'MAN'}-kolom mag worden gedeeld")
    if not legacy:
        lexicalization=relation.get("lexicalization",{})
        if lexicalization.get("type")!="anaphor-lex-projection": errors.append("relation.lexicalization.type is ongeldig")
        if lexicalization.get("source_node_id")!="s2-man": errors.append("LEX-anafoor moet uit s2-man worden geprojecteerd")
        if lexicalization.get("antecedent_lexeme")!="man": errors.append("LEX-anafoor moet antecedentlexeem man gebruiken")
        profiles={"hij":"HIJ","die":"DIE","die-man":"DIE MAN"}
        profile_id=lexicalization.get("profile_id")
        if profile_id not in profiles or lexicalization.get("surface")!=profiles.get(profile_id):
            errors.append("LEX-profiel en oppervlaktevorm zijn niet toepasselijk voor MAN")
    lex=composition.get("shared_lex_axis",{})
    if lex.get("order")!="S1-before-S2": errors.append("gezamenlijke LEX-as moet S1 vóór S2 ordenen")
    items=lex.get("items")
    expected_items=["s1-ik","s1-zie","s1-man",expected_lower_id,"s2-draagt","s2-hoed"]
    if not isinstance(items,list) or [item.get("node_id") for item in items] != expected_items:
        errors.append("gezamenlijke LEX-volgorde is ongeldig")
    elif not legacy:
        projected=items[3]
        if projected.get("source_label")!="MAN" or projected.get("label")!=relation.get("lexicalization",{}).get("surface"):
            errors.append("S2 MAN moet op LEX als het gekozen anaforische profiel verschijnen")
    return errors

def validate(path: Path) -> list[str]:
    errors=[]
    try:
        doc=json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        return [f"ongeldige JSON: {exc}"]
    missing=REQUIRED_TOP-set(doc)
    if missing: errors.append(f"topniveau ontbreekt: {sorted(missing)}")
    if doc.get("document_type")!="opengraph-document": errors.append("document_type moet opengraph-document zijn")
    if doc.get("metadata",{}).get("schema")!="data-metadata-paradata": errors.append("metadata.schema ontbreekt of is fout")
    data=doc.get("data",{})
    if data.get("composition",{}).get("schema") in {"ogn-multi-composition-v1","ogn-multi-composition-v2"}:
        errors.extend(validate_multi_ogn(doc))
        para=doc.get("paradata",{})
        if para.get("included") is True and not isinstance(para.get("events"),list): errors.append("paradata.events moet een lijst zijn wanneer included=true")
        return errors
    for key in ["example","graphs","projections","notation"]:
        if key not in data: errors.append(f"data.{key} ontbreekt")
    for view in ["syntax","ft"]:
        graph=data.get("graphs",{}).get(view,{})
        if not graph.get("nodes"): errors.append(f"data.graphs.{view}.nodes is leeg")
        if not isinstance(graph.get("edges"),list): errors.append(f"data.graphs.{view}.edges ontbreekt")
    for axis in ["lex","synt","log"]:
        if axis not in data.get("projections",{}): errors.append(f"data.projections.{axis} ontbreekt")
    generator_version=str(doc.get("metadata",{}).get("generator",{}).get("version",""))
    if generator_version == CURRENT_VERSION:
        metadata=doc.get("metadata",{})
        projections=data.get("projections",{})
        log=projections.get("log",{})
        lex=projections.get("lex",{})
        example=data.get("example",{})
        profile=metadata.get("profile")
        extras=metadata.get("extras")
        preconfig=metadata.get("preconfig")
        insertion=preconfig.get("insertion") if isinstance(preconfig,dict) else None
        if profile not in {"base","custom"}: errors.append("metadata.profile moet base of custom zijn")
        if not isinstance(extras,list): errors.append("metadata.extras moet een lijst zijn")
        if not isinstance(insertion,dict):
            errors.append("metadata.preconfig.insertion moet een object zijn")
            insertion={}
        for axis in ["lex","synt","log"]:
            if not isinstance(insertion.get(axis),bool):
                errors.append(f"metadata.preconfig.insertion.{axis} moet true of false zijn")
        if isinstance(extras,list) and "adverbs" in extras:
            if insertion.get("lex") is not True or insertion.get("log") is not True:
                errors.append("extra adverbs vereist metadata.preconfig.insertion.lex en .log")
        lex_feature_keys=["free_slot_count","free_slot_placement","insertion_content","insertion_extension_targets","free_slots","adverb"]
        if ("lex_insertions" in example or any(key in lex for key in lex_feature_keys)) and insertion.get("lex") is not True:
            errors.append("LEX-insertiedata vereist metadata.preconfig.insertion.lex=true")
        sequence=log.get("sequence")
        if ("insertion_interval" in log or isinstance(sequence,list) and any(item.get("kind")=="minor" for item in sequence if isinstance(item,dict))) and insertion.get("log") is not True:
            errors.append("LOG-insertiedata vereist metadata.preconfig.insertion.log=true")
        synt=projections.get("synt",{})
        if isinstance(synt.get("insertions"),list) and synt.get("insertions") and insertion.get("synt") is not True:
            errors.append("SYNT-insertiedata vereist metadata.preconfig.insertion.synt=true")
        if profile=="base":
            if extras != []: errors.append("metadata.extras moet leeg zijn voor profiel base")
            if "lex_insertions" in example: errors.append("data.example.lex_insertions hoort niet in profiel base")
            for key in lex_feature_keys:
                if key in lex: errors.append(f"data.projections.lex.{key} hoort niet in profiel base")
            if "insertion_interval" in log: errors.append("data.projections.log.insertion_interval hoort niet in profiel base")
            if isinstance(sequence,list) and any(item.get("kind")=="minor" for item in sequence if isinstance(item,dict)):
                errors.append("data.projections.log.sequence mag geen minors bevatten in profiel base")
        if log.get("authority")!="LOG": errors.append("data.projections.log.authority moet LOG zijn")
        if log.get("position_unit")!="slot": errors.append("data.projections.log.position_unit moet slot zijn")
        if not isinstance(log.get("sequence"),list) or not log.get("sequence"): errors.append("data.projections.log.sequence ontbreekt")
        if not isinstance(log.get("distances"),dict): errors.append("data.projections.log.distances ontbreekt")
        if log.get("lex_position_source")!="LOG": errors.append("data.projections.log.lex_position_source moet LOG zijn")
        if log.get("lex_projection_origin")!="SOURCE-Y": errors.append("data.projections.log.lex_projection_origin moet SOURCE-Y zijn")
        if log.get("lex_placement_mode")!="horizontal-then-move": errors.append("data.projections.log.lex_placement_mode moet horizontal-then-move zijn")
        if log.get("example_controls_layout") is not False: errors.append("data.projections.log.example_controls_layout moet false zijn")
        if lex.get("position_source")!="LOG": errors.append("data.projections.lex.position_source moet LOG zijn")
        if lex.get("projection_origin")!="SOURCE-Y": errors.append("data.projections.lex.projection_origin moet SOURCE-Y zijn")
        if lex.get("placement_mode")!="horizontal-then-move": errors.append("data.projections.lex.placement_mode moet horizontal-then-move zijn")
        if not isinstance(lex.get("logical_sequence"),list): errors.append("data.projections.lex.logical_sequence ontbreekt")
    para=doc.get("paradata",{})
    if para.get("included") is True and not isinstance(para.get("events"),list): errors.append("paradata.events moet een lijst zijn wanneer included=true")
    return errors

def main(argv:list[str])->int:
    if len(argv)<2:
        print("gebruik: check_opn_storage.py bestand.opn [...]")
        return 2
    all_errors=[]
    for name in argv[1:]:
        p=Path(name)
        for err in validate(p): all_errors.append(f"{p}: {err}")
    if all_errors:
        print("OPN CHECK: FOUT")
        for err in all_errors: print("-",err)
        return 1
    print(f"OPN CHECK: OK ({len(argv)-1} bestand(en))")
    return 0

if __name__=="__main__": raise SystemExit(main(sys.argv))
