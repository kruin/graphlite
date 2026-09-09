#!/usr/bin/env python3
"""Controleer nieuw, edit, deactiveren, groeperen en verwijderen via de lokale API."""
from pathlib import Path
from tempfile import TemporaryDirectory
import json, shutil, sys, threading
from http.server import ThreadingHTTPServer
from urllib.request import Request, urlopen

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from tools import testmateriaal_db as db
import server_nocache

html=(ROOT/'testmateriaal.html').read_text(encoding='utf-8')
js=(ROOT/'testmateriaal.js').read_text(encoding='utf-8')
for marker in ('newItem','group_name','is_active','toggleActive','deleteItem','applyBulkGroup'):
    assert marker in html,marker
for marker in ('startNew','toggleActive','deleteItem','__opengraph_testmateriaal_bulk_group'):
    assert marker in js,marker

def call(port,path,method='GET',payload=None):
    data=None if payload is None else json.dumps(payload).encode('utf-8')
    request=Request(f'http://127.0.0.1:{port}{path}',data=data,method=method,
                    headers={'Content-Type':'application/json'} if data else {})
    with urlopen(request,timeout=5) as response:
        return json.loads(response.read().decode('utf-8'))

with TemporaryDirectory() as temporary:
    temporary=Path(temporary); db.DB=temporary/'testmateriaal.sqlite'; db.PUBLIC=temporary/'catalog.public.json'
    shutil.copy2(ROOT/'data'/'testmateriaal.sqlite',db.DB)
    class QuietHandler(server_nocache.NoCacheHandler):
        def log_message(self,_format,*_args): return
    httpd=ThreadingHTTPServer(('127.0.0.1',0),QuietHandler)
    thread=threading.Thread(target=httpd.serve_forever,daemon=True); thread.start(); port=httpd.server_address[1]
    try:
        created=call(port,'/__opengraph_testmateriaal','POST',{
            'original_input':'ANNA TEST DE MUZIEK','category_code':900,'status':'NIEUW',
            'analysis_status':'VOORSTEL','form':'simplex','completion':'AF','group_name':'functioneel',
            'features_json':['stimulus','experiencer'],'platforms_json':[],'kernels':['ANNA TEST DE MUZIEK']})
        number=created['number']
        call(port,f'/__opengraph_testmateriaal/{number}','POST',{'internal_note':'bewerkt','group_name':'psychologisch'})
        inactive=call(port,f'/__opengraph_testmateriaal/{number}/active','POST',{'is_active':False})
        assert inactive['is_active'] is False
        grouped=call(port,'/__opengraph_testmateriaal_bulk_group','POST',{'numbers':[number],'group_name':'tijdtest'})
        assert grouped['group_name']=='tijdtest'
        con=db.connect(); before=con.execute("SELECT number,status,analysis_status FROM inputs WHERE status='OK' ORDER BY number LIMIT 1").fetchone(); public_number=before['number']; con.close()
        call(port,'/__opengraph_testmateriaal_bulk_group','POST',{'numbers':[public_number],'group_name':'basisgroep'})
        con=db.connect(); unchanged=con.execute('SELECT status,analysis_status,group_name FROM inputs WHERE number=?',(public_number,)).fetchone(); con.close()
        assert tuple(unchanged)==(before['status'],before['analysis_status'],'basisgroep')
        con=db.connect(); row=con.execute('SELECT original_input,internal_note,is_active,group_name FROM inputs WHERE number=?',(number,)).fetchone(); con.close()
        assert tuple(row)==('ANNA TEST DE MUZIEK','bewerkt',0,'tijdtest')
        deleted=call(port,f'/__opengraph_testmateriaal/{number}','DELETE')
        assert deleted['deleted'] is True
        con=db.connect(); assert con.execute('SELECT 1 FROM inputs WHERE number=?',(number,)).fetchone() is None; con.close()
    finally:
        httpd.shutdown(); httpd.server_close(); thread.join(timeout=2)
print('TESTMATERIAAL CRUD CHECK: OK (nieuw; edit; deactiveren; groeperen; verwijderen; echte HTTP-routes)')
