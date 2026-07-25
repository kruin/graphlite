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
        projections=data.get("projections",{})
        log=projections.get("log",{})
        lex=projections.get("lex",{})
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
