"""
Offline Celestial Mirror Prediction Server
Serves the Mirror Mirror UI and Swiss Ephemeris API for Gaze-Based Divination.
"""

import os
import sys
import json
import time
import socket
import datetime
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

from celestial_engine import CelestialEngine

PORT = 8000
BASE_DIR = Path(__file__).resolve().parent
# If running inside web, serve current dir; if in parent, serve web
WEB_DIR = BASE_DIR if (BASE_DIR / "index.html").exists() else BASE_DIR / "web"

engine = CelestialEngine(base_dir=BASE_DIR)

class CelestialHTTPHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEB_DIR), **kwargs)

    def log_message(self, format, *args):
        sys.stdout.write(f"[MirrorServer] {self.address_string()} - {format%args}\n")

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query_params = urllib.parse.parse_qs(parsed_url.query)

        # API Endpoints
        if path == "/api/prediction":
            self.handle_api_prediction(query_params)
            return

        elif path == "/api/planets":
            self.handle_api_planets(query_params)
            return

        elif path == "/api/status":
            self.handle_api_status()
            return

        # Serve static web files
        super().do_GET()

    def handle_api_prediction(self, query_params):
        try:
            direction = query_params.get("direction", ["left"])[0].lower()
            target_dt = datetime.datetime.now()

            result = engine.get_prediction(direction=direction, dt=target_dt)

            response_data = {
                "status": "success",
                "data": result
            }
            self.send_json_response(response_data)
        except Exception as e:
            self.send_json_response({
                "status": "error",
                "message": str(e)
            }, status_code=500)

    def handle_api_planets(self, query_params):
        try:
            target_dt = datetime.datetime.now()
            result = engine.calculate_planets(target_dt)
            self.send_json_response({
                "status": "success",
                "data": result
            })
        except Exception as e:
            self.send_json_response({
                "status": "error",
                "message": str(e)
            }, status_code=500)

    def handle_api_status(self):
        self.send_json_response({
            "status": "online",
            "corpus_left_count": len(engine.corpus_left),
            "corpus_right_count": len(engine.corpus_right),
            "server_time": datetime.datetime.now().isoformat()
        })

    def send_json_response(self, data, status_code=200):
        json_bytes = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(json_bytes)))
        self.end_headers()
        self.wfile.write(json_bytes)


def run_server(port=PORT):
    server_address = ("", port)
    httpd = HTTPServer(server_address, CelestialHTTPHandler)
    print(f"[MirrorServer] Running live on http://localhost:{port}/ (Serving from {WEB_DIR})")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[MirrorServer] Shutting down...")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
