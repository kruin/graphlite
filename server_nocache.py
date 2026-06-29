from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parent
ALLOWED_WRITES = {
    'examples-input.html',
    'lexicon-config.html',
    'structure-config.html',
}

class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()

    def _json_response(self, status, payload):
        data = json.dumps(payload, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):
        if self.path.split('?', 1)[0] != '/__opengraph_save_file':
            self._json_response(404, {'ok': False, 'error': 'unknown endpoint'})
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
            raw = self.rfile.read(length)
            payload = json.loads(raw.decode('utf-8'))
            filename = str(payload.get('filename') or '').replace('\\', '/').split('/')[-1]
            content = payload.get('content')
            if filename not in ALLOWED_WRITES:
                self._json_response(400, {'ok': False, 'error': f'file not allowed: {filename}'})
                return
            if not isinstance(content, str):
                self._json_response(400, {'ok': False, 'error': 'content must be a string'})
                return
            target = ROOT / filename
            target.write_text(content, encoding='utf-8', newline='')
            self._json_response(200, {'ok': True, 'filename': filename, 'path': str(target), 'bytes': len(content.encode('utf-8'))})
        except Exception as exc:
            self._json_response(500, {'ok': False, 'error': str(exc)})

if __name__ == '__main__':
    host = '0.0.0.0'
    port = 8088
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f'Ongeldige poort: {sys.argv[1]!r}. Gebruik 8088.')
            port = 8088
    httpd = ThreadingHTTPServer((host, port), NoCacheHandler)
    print(f'Serving HTTP on {host} port {port} (http://{host}:{port}/) ...', flush=True)
    print('OpenGraph save endpoint actief: POST /__opengraph_save_file', flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nServer stopped.')
