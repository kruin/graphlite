#!/usr/bin/env python3
"""Beheer van OpenGraph-testmateriaal, DB-schema 2."""
from __future__ import annotations
import argparse, json, sqlite3
from datetime import datetime, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
DB=ROOT/'data'/'testmateriaal.sqlite'
PUBLIC=ROOT/'data'/'catalog.public.json'
def now(): return datetime.now(timezone.utc).replace(microsecond=0).isoformat()

def connect():
    if not DB.is_file(): raise FileNotFoundError(f'Database ontbreekt: {DB}')
    con=sqlite3.connect(DB); con.row_factory=sqlite3.Row; con.execute('PRAGMA foreign_keys=ON')
    tables={r[0] for r in con.execute("SELECT name FROM sqlite_master WHERE type='table'")}
    required={'metadata','categories','inputs','source_aliases','input_segments','kernels','relations','placement_rules'}
    if not required<=tables: raise RuntimeError('testmateriaal.sqlite is niet DB-schema 2')
    columns={r[1] for r in con.execute('PRAGMA table_info(inputs)')}
    for name,declaration in {'publication_phase':'INTEGER','platforms_json':"TEXT NOT NULL DEFAULT '[]'",'updated_at':"TEXT NOT NULL DEFAULT ''"}.items():
        if name not in columns: con.execute(f'ALTER TABLE inputs ADD COLUMN {name} {declaration}')
    con.execute('''CREATE TABLE IF NOT EXISTS revisions(id INTEGER PRIMARY KEY AUTOINCREMENT,input_number INTEGER NOT NULL REFERENCES inputs(number),revision INTEGER NOT NULL,changed_at TEXT NOT NULL,old_json TEXT NOT NULL,new_json TEXT NOT NULL)''')
    con.commit(); return con

def rows(con):
    result=[]
    for record in con.execute('SELECT i.*,c.name category_name,c.decision_rule FROM inputs i JOIN categories c ON c.code=i.category_code ORDER BY i.sort_order,i.number'):
        item=dict(record); item['features']=json.loads(item.pop('features_json') or '[]'); item['platforms']=json.loads(item.pop('platforms_json') or '[]'); n=item['number']
        item['source_ids']=[r[0] for r in con.execute('SELECT source_id FROM source_aliases WHERE input_number=? ORDER BY source_id',(n,))]
        item['source_id']=item['source_ids'][0] if item['source_ids'] else ''
        item['segments']=[r[0] for r in con.execute('SELECT text FROM input_segments WHERE input_number=? ORDER BY segment_no',(n,))]
        item['kernels']=[dict(r) for r in con.execute('SELECT kernel_no,text,analysis_status FROM kernels WHERE input_number=? ORDER BY kernel_no',(n,))]
        item['relations']=[dict(r) for r in con.execute('SELECT from_kernel,from_referent,to_kernel,to_referent,relation_type FROM relations WHERE input_number=? ORDER BY id',(n,))]
        item['placement_rules']=[dict(r) for r in con.execute('SELECT profile,rule_type,rule_value,status FROM placement_rules WHERE input_number=? ORDER BY id',(n,))]
        result.append(item)
    return result

def public_document():
    con=connect(); items=[]; keys=('number','source_id','source_ids','original_input','category_code','category_name','sort_order','status','completion','form','features','analysis_status','publication_phase','platforms','segments','kernels','relations','placement_rules')
    for row in rows(con):
        if row['status']=='OK': items.append({k:row[k] for k in keys})
    con.close(); return {'schema':'opengraph-testmateriaal-public','version':2,'generated_at':now(),'items':items}

def export_public():
    document=public_document()
    PUBLIC.write_text(json.dumps(document,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    return len(document['items'])

def update(number:int, changes:dict):
    kernels=changes.pop('kernels',None); allowed={'original_input','category_code','sort_order','status','completion','form','features_json','analysis_status','publication_phase','platforms_json','internal_note'}
    bad=set(changes)-allowed
    if bad: raise ValueError(f'Niet-toegestane velden: {sorted(bad)}')
    con=connect(); old=con.execute('SELECT * FROM inputs WHERE number=?',(number,)).fetchone()
    if not old: raise ValueError(f'Onbekend nummer {number}')
    clean=dict(changes)
    for field in ('features_json','platforms_json'):
        if field in clean and not isinstance(clean[field],str): clean[field]=json.dumps(clean[field],ensure_ascii=False)
    substantive=any(k not in {'status','publication_phase','platforms_json','sort_order','internal_note','analysis_status'} and clean[k]!=old[k] for k in clean)
    if kernels is not None:
        normalized=[str(x).strip().upper() for x in kernels if str(x).strip()]
        if not normalized: raise ValueError('Minimaal één kernzin vereist')
        current=[r[0] for r in con.execute('SELECT text FROM kernels WHERE input_number=? ORDER BY kernel_no',(number,))]
        if normalized!=current:
            relation_count=con.execute('SELECT count(*) FROM relations WHERE input_number=?',(number,)).fetchone()[0]
            if relation_count and len(normalized)<2: raise ValueError('Relaties vereisen minimaal twee kernzinnen')
            con.execute('DELETE FROM kernels WHERE input_number=?',(number,)); con.executemany('INSERT INTO kernels(input_number,kernel_no,text,analysis_status) VALUES(?,?,?,?)',[(number,i,text,'VOORSTEL') for i,text in enumerate(normalized,1)])
            clean['analysis_status']='VOORSTEL'; substantive=True
    if substantive:
        clean.setdefault('analysis_status','VOORSTEL')
        if old['status']=='OK' and 'status' not in clean: clean['status']='TEST'
    revision=old['revision']+1; clean.update(revision=revision,updated_at=now())
    sets=', '.join(f'{k}=?' for k in clean); con.execute(f'UPDATE inputs SET {sets} WHERE number=?',(*clean.values(),number))
    new=con.execute('SELECT * FROM inputs WHERE number=?',(number,)).fetchone(); con.execute('INSERT INTO revisions(input_number,revision,changed_at,old_json,new_json) VALUES(?,?,?,?,?)',(number,revision,now(),json.dumps(dict(old),ensure_ascii=False),json.dumps(dict(new),ensure_ascii=False)))
    con.commit(); con.close(); export_public()

def bulk_status(numbers, status):
    allowed_statuses={'NIEUW','ANALYSE','TEST','OK','PARKEREN','AFGEKEURD','VERVALLEN'}
    status=str(status or '').upper()
    if status not in allowed_statuses: raise ValueError(f'Ongeldige status: {status!r}')
    normalized=sorted({int(number) for number in numbers})
    if not normalized: raise ValueError('Selecteer minimaal één input')
    con=connect()
    try:
        placeholders=','.join('?' for _ in normalized)
        existing={row['number']:row for row in con.execute(f'SELECT * FROM inputs WHERE number IN ({placeholders})',normalized)}
        missing=sorted(set(normalized)-set(existing))
        if missing: raise ValueError(f'Onbekende nummers: {missing}')
        changed=0
        for number in normalized:
            old=existing[number]
            if old['status']==status: continue
            revision=old['revision']+1; changed_at=now()
            con.execute('UPDATE inputs SET status=?,revision=?,updated_at=? WHERE number=?',(status,revision,changed_at,number))
            new=dict(old); new.update(status=status,revision=revision,updated_at=changed_at)
            con.execute('INSERT INTO revisions(input_number,revision,changed_at,old_json,new_json) VALUES(?,?,?,?,?)',(number,revision,changed_at,json.dumps(dict(old),ensure_ascii=False),json.dumps(new,ensure_ascii=False)))
            changed+=1
        con.commit()
    except Exception:
        con.rollback(); raise
    finally:
        con.close()
    export_public()
    return {'selected':len(normalized),'changed':changed,'status':status,'numbers':normalized}

def verify():
    con=connect(); all_items=rows(con); export_public(); public=json.loads(PUBLIC.read_text(encoding='utf-8'))
    assert con.execute('PRAGMA integrity_check').fetchone()[0]=='ok'
    assert all_items and all(x['kernels'] for x in all_items)
    assert all(x['status']=='OK' for x in public['items'])
    assert {x['number'] for x in public['items']}=={x['number'] for x in all_items if x['status']=='OK'}
    assert not con.execute("SELECT number FROM inputs WHERE category_code=300 AND (instr(original_input,'?')=0 OR completion<>'AF')").fetchall()
    bad=con.execute('''SELECT i.number FROM inputs i WHERE i.category_code=500 AND ((SELECT count(*) FROM kernels k WHERE k.input_number=i.number)<2 OR NOT EXISTS(SELECT 1 FROM relations r WHERE r.input_number=i.number AND r.from_kernel<>r.to_kernel))''').fetchall(); assert not bad,bad
    assert all(x['source_ids'] for x in all_items)
    viewer=(ROOT/'viewer.js').read_text(encoding='utf-8'); publish=(ROOT/'publish_checked.bat').read_text(encoding='utf-8'); zipper=(ROOT/'maak-volledige-zip.bat').read_text(encoding='utf-8')
    server=(ROOT/'server_nocache.py').read_text(encoding='utf-8')
    assert 'loadPublicTestmateriaalCatalog' in viewer and 'publicItemAllowed(value)' in viewer and 'source_ids' in viewer
    assert "'/__opengraph_testmateriaal', '/__opengraph_testmateriaal_public', 'data/catalog.public.json'" in viewer
    assert "['data/catalog.public.json']" in viewer
    assert "'/__opengraph_testmateriaal_public'" in server and 'testmateriaal_db.public_document()' in server
    assert '"data/testmateriaal.sqlite"' in publish and 'testmateriaal.sqlite' not in zipper
    kernel_count=sum(len(x['kernels']) for x in all_items)
    con.close(); print(f"TESTMATERIAAL DB-SCHEMA 2 CHECK: OK ({len(all_items)} lokaal; {len(public['items'])} publiek; {kernel_count} kernzinnen; Story- en vraagcontract)")

if __name__=='__main__':
    p=argparse.ArgumentParser(); p.add_argument('action',choices=['export','verify']); a=p.parse_args(); {'export':export_public,'verify':verify}[a.action]()
