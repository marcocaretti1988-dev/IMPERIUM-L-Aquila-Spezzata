# Costruisce index.html (sito GitHub Pages) dai sorgenti in src/.  Uso: python3 src/build.py
import os
D = os.path.dirname(os.path.abspath(__file__)); R = os.path.dirname(D)
rd = lambda f: open(os.path.join(D, f), encoding='utf-8').read()
html = rd('shell_pre.html') + rd('data.js') + rd('fauna2_data.js') + rd('code.js') + rd('shell_post.html')
extra = ('<link rel="manifest" href="manifest.json">\n<link rel="apple-touch-icon" href="apple-touch-icon.png">\n<link rel="icon" href="icon-192.png">\n'
         '<meta name="apple-mobile-web-app-title" content="IMPERIUM">\n<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n<meta name="mobile-web-app-capable" content="yes">\n')
html = html.replace('<title>', extra + '<title>', 1)
html = html.replace("'m3d/' + k + '.js'", "'m3d_' + k + '.js'").replace("'music/feudum.mp3'", "'feudum.mp3'").replace("'music/raid.mp3'", "'raid.mp3'")
# versione: impronta del contenuto (sorgenti + icone). Serve a scavalcare la cache dell'iPhone.
import hashlib, re
hh = hashlib.sha1(html.encode())
for f in sorted(os.listdir(os.path.join(R, 'ui'))): hh.update(f.encode()); hh.update(open(os.path.join(R, 'ui', f), 'rb').read())
V = hh.hexdigest()[:10]
html = re.sub(r"url\((ui/[^)?]+)\)", lambda m: f"url({m.group(1)}?v={V})", html)
html = html.replace("'m3d_' + k + '.js'", f"'m3d_' + k + '.js?v={V}'").replace("__BUILD__", V)
open(os.path.join(R, 'version.txt'), 'w').write(V)
open(os.path.join(R, 'index.html'), 'w', encoding='utf-8').write(html)
print('index.html', len(html) // 1024, 'KB')
