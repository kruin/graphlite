from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
import json
import sys

ROOT = Path(__file__).resolve().parent
APP_VERSION = (ROOT / 'VERSION.txt').read_text(encoding='utf-8-sig').strip()
ALLOWED_WRITES = {
    'examples-input.html': ROOT / 'examples-input.html',
    'lexicon-config.html': ROOT / 'lexicon-config.html',
    'structure-config.html': ROOT / 'structure-config.html',
    'config/user-config.json': ROOT / 'config' / 'user-config.json',
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
            filename = str(payload.get('filename') or '').replace('\\', '/').lstrip('/')
            content = payload.get('content')
            if filename not in ALLOWED_WRITES:
                self._json_response(400, {'ok': False, 'error': f'file not allowed: {filename}'})
                return
            if not isinstance(content, str):
                self._json_response(400, {'ok': False, 'error': 'content must be a string'})
                return
            if filename == 'config/user-config.json':
                document = json.loads(content)
                if (
                    not isinstance(document, dict)
                    or document.get('schema') != 'opengraph-project-config'
                    or document.get('version') != APP_VERSION
                    or document.get('kind') != 'user'
                    or document.get('enabled') is not True
                    or not isinstance(document.get('config'), dict)
                ):
                    self._json_response(400, {'ok': False, 'error': 'invalid OpenGraph user config'})
                    return
            target = ALLOWED_WRITES[filename]
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(content, encoding='utf-8', newline='')
            self._json_response(200, {'ok': True, 'filename': filename, 'path': str(target), 'bytes': len(content.encode('utf-8'))})
        except Exception as exc:
            self._json_response(500, {'ok': False, 'error': str(exc)})


def probe_server_state(host, port, expected_version, nonce):
    query = urlencode({'nocache': nonce})
    url = f'http://{host}:{port}/VERSION.txt?{query}'
    request = Request(url, headers={'Cache-Control': 'no-cache'})
    try:
        with urlopen(request, timeout=2) as response:
            served_version = response.read(4096).decode('utf-8-sig', errors='replace').strip()
    except HTTPError as exc:
        return 'wrong', f'HTTP {exc.code}'
    except (URLError, TimeoutError, OSError):
        return 'down', ''

    if served_version == expected_version:
        return 'ok', served_version
    return 'wrong', served_version or '<lege VERSION.txt>'


def probe_server(host, port, expected_version, nonce):
    state, served_version = probe_server_state(
        host,
        port,
        expected_version,
        nonce,
    )
    print(f'{state}|{served_version}', flush=True)
    return 0


def run_server(port):
    host = '0.0.0.0'
    httpd = ThreadingHTTPServer((host, port), NoCacheHandler)
    print(f'Serving HTTP on {host} port {port} (http://{host}:{port}/) ...', flush=True)
    print('OpenGraph save endpoint actief: POST /__opengraph_save_file', flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nServer stopped.')
    finally:
        httpd.server_close()
    return 0


def main(argv):
    if len(argv) > 1 and argv[1] == '--probe':
        if len(argv) != 6:
            print('down|', flush=True)
            return 0
        try:
            port = int(argv[3])
        except ValueError:
            print('down|', flush=True)
            return 0
        return probe_server(argv[2], port, argv[4], argv[5])

    port = 8088
    if len(argv) > 1:
        try:
            port = int(argv[1])
        except ValueError:
            print(f'Ongeldige poort: {argv[1]!r}. Gebruik 8088.')
            port = 8088
    return run_server(port)


if __name__ == '__main__':
    raise SystemExit(main(sys.argv))
