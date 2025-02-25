from flask import Flask, render_template, jsonify, request
from yt_dlp import YoutubeDL
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search')
def search():
    query = request.args.get('q')
    page = request.args.get('page', 1, type=int)
    
    ydl_opts = {
        'extract_flat': True,
        'quiet': True,
        'skip_download': True,
        'force_generic_extractor': True,
    }

    try:
        with YoutubeDL(ydl_opts) as ydl:
            result = ydl.extract_info(
                f"ytsearch{page*20}:{query}",
                download=False
            )
            
        videos = []
        for entry in result['entries'][(page-1)*20:page*20]:
            videos.append({
                'id': entry['id'],
                'title': entry.get('title', 'No title'),
                'channel': entry.get('uploader', 'Unknown channel'),
                'duration': entry.get('duration_string', 'N/A'),
                'thumbnail': f"https://i.ytimg.com/vi/{entry['id']}/hqdefault.jpg"
            })
        
        return jsonify({'videos': videos})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
