from __future__ import annotations
import json,sys
from pathlib import Path

REQUIRED_TOP={"opn","document_type","opn_version","metadata","data","paradata"}
CURRENT_VERSION=(Path(__file__).resolve().parents[1]/"VERSION.txt").read_text(encoding="utf-8").strip()

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
