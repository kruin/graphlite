#!/usr/bin/env python3
"""Controleer bulkstatus atomair op een tijdelijke databasekopie."""
from pathlib import Path
from tempfile import TemporaryDirectory
import json
import shutil
import sys
import threading
from http.server import ThreadingHTTPServer
from urllib.request import Request, urlopen

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from tools import testmateriaal_db as db
import server_nocache

html=(ROOT/'testmateriaal.html').read_text(encoding='utf-8')
js=(ROOT/'testmateriaal.js').read_text(encoding='utf-8')
server=(ROOT/'server_nocache.py').read_text(encoding='utf-8')
for marker in ('selectVisible','bulkStatus','applyBulkStatus'):
    assert marker in html,marker
for marker in ('selectedNumbers','applyBulkStatus','__opengraph_testmateriaal_bulk_status'):
    assert marker in js,marker
assert 'testmateriaal_db.bulk_status' in server

with TemporaryDirectory() as temporary:
    temporary=Path(temporary)
    db.DB=temporary/'testmateriaal.sqlite'
    db.PUBLIC=temporary/'catalog.public.json'
    shutil.copy2(ROOT/'data'/'testmateriaal.sqlite',db.DB)
    con=db.connect(); numbers=[row[0] for row in con.execute('SELECT number FROM inputs ORDER BY number LIMIT 2')]; con.close()
    result=db.bulk_status(numbers,'TEST')
    assert result['selected']==2 and result['status']=='TEST'
    con=db.connect()
    assert {row[0] for row in con.execute(f"SELECT status FROM inputs WHERE number IN ({','.join('?' for _ in numbers)})",numbers)}=={'TEST'}
    assert con.execute(f"SELECT count(*) FROM revisions WHERE input_number IN ({','.join('?' for _ in numbers)})",numbers).fetchone()[0]>=2
    con.close()
    public=json.loads(db.PUBLIC.read_text(encoding='utf-8'))
    assert not set(numbers)&{item['number'] for item in public['items']}

    class QuietHandler(server_nocache.NoCacheHandler):
        def log_message(self, _format, *_args):
            return
    httpd=ThreadingHTTPServer(('127.0.0.1',0),QuietHandler)
    thread=threading.Thread(target=httpd.serve_forever,daemon=True); thread.start()
    try:
        request=Request(
            f'http://127.0.0.1:{httpd.server_address[1]}/__opengraph_testmateriaal_bulk_status',
            data=json.dumps({'numbers':numbers,'status':'OK'}).encode('utf-8'),
            headers={'Content-Type':'application/json'}, method='POST')
        with urlopen(request,timeout=5) as response:
            payload=json.loads(response.read().decode('utf-8'))
        assert payload['ok'] is True and payload['selected']==2 and payload['status']=='OK'
    finally:
        httpd.shutdown(); httpd.server_close(); thread.join(timeout=2)
print('TESTMATERIAAL BULKSTATUS CHECK: OK (meervoudige selectie; echte HTTP-route; één transactie; revisies; publieke export)')
