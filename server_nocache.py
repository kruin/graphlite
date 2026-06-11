from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import sys

class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('X-Content-Type-Options', 'nosniff')
        super().end_headers()

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
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nServer stopped.')
