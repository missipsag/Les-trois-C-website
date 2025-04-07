from flask import Flask, send_from_directory
import os
import logging

# Configure logging for easier debugging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__, static_folder='.', static_url_path='')
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/booking.html')
def booking():
    return send_from_directory('.', 'booking.html')

@app.route('/admin.html')
def admin():
    return send_from_directory('.', 'admin.html')

# Serve any static file from the root directory
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)