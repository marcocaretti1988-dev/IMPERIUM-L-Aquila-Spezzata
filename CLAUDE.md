# IMPERIUM – L'Aquila Spezzata (progetto unico)

Gioco gemello di FEUDUM, ambientato nell'antica Roma (Pannonia, 193 d.C.). Nato come copia di FEUDUM il 24/10/2026: da quel giorno i due giochi vanno ognuno per conto suo (nessuna sincronizzazione automatica).
Questo repository è L'UNICA fonte del gioco. Pubblicato con GitHub Pages: https://marcocaretti1988-dev.github.io/IMPERIUM-L-Aquila-Spezzata/

- Sorgenti: `src/` → `shell_pre.html` (HTML+CSS), `data.js` (atlanti sprite/texture), `fauna2_data.js`, `code.js` (tutto il gioco), `shell_post.html`.
- NON modificare a mano `index.html` in radice: si genera con `python3 src/build.py`.
- Le chiavi interne restano quelle di FEUDUM (es. edificio `mastio` = Castrum, `taverna` = Taberna, eroe `isolde` = Domina Livia): cambiano solo i testi mostrati.
- Salvataggi: chiavi `imperium_*` (separate da FEUDUM, che sta sullo stesso dominio github.io). Codice di esportazione `IMPERIUM1:`.
- Modelli 3D: file `m3d_<nome>.js` in radice. Nuovi modelli Meshy: `python3 src/tools/glb2m3d.py file.glb <nome> m3d_<nome>.js 30000`, poi aggiungere `<nome>` a `M3D_FILES` in `src/code.js`. Per modelli pieni di archi o dettagli sottili (es. l'Anfiteatro) aggiungere `--qem` in fondo: riduzione a quadriche (src/tools/qem.py), più lenta (3-4 minuti) ma non buca pilastri e pareti (per sostituire un modello medievale basta rigenerare lo stesso `<nome>`).
- Edifici romani provvisori (fatti a mano, in attesa di quelli Meshy): `python3 src/tools/roman3d/edifici.py [nome ...] [--preview cartella]` rigenera `m3d_<nome>.js` dal codice in `src/tools/roman3d/` (kit.py = geometria, texture e anteprima isometrica; edifici.py/altri.py = un edificio per funzione). Quartier generale: `castrum` (legno, livelli 1-4) e `castello` (Castellum di pietra, dal 5), scelti da `m3k()` in `code.js`. Un modello Meshy con lo stesso `<nome>` sostituisce quello fatto a mano.
- Villaggio iniziale: `initialBuildings()` in `src/code.js` — Anfiteatro (`anfiteatro`, 6x6, Colosseo d'epoca fatto a mano in `altri.py`: tre ordini di arcate, attico, cavea, velario) al centro della mappa, Castrum dietro. Le partite salvate senza Anfiteatro lo ricevono al primo spazio libero vicino al centro (`beginGame`).
- Centurione: modello Meshy `m3d_templare.js` = eroe Cassio Longino (chiave `templare`); nel villaggio sta sempre di guardia davanti alla porta del Castrum.
- Terreno: `python3 src/tools/terreno.py` riscrive le texture grass/dirt/path di `TEX_SRC` in `src/data.js` (erba pannonica, terra calpestata con ghiaia, basoli). Il piazzale rettangolare dell'accampamento con fossa e terrapieno sta in `groundMasks()` (`CAMP_R`).
- Personaggi: nel villaggio quelli di FEUDUM sono nascosti (`HIDE_FOLK` in `code.js`, la logica continua); si vedono solo i personaggi in `ROMAN3D` e quelli con sprite romani (`RUNIT`).
- Sprite romani: i fogli originali stanno in `src/sprites/`; `python3 src/tools/sprites.py [--preview cartella]` toglie lo sfondo, ritaglia le figure, le allinea sui piedi e scrive `src/data_roman.js` (RATLAS_SRC, RFR, RUNIT). In `sprites.py`: `SHEETS` dice cosa c'è in ogni riga di ogni foglio (walkF/walkS/walkB, idleF/idleS/idleB, atkS/atkF, hit, death), `UNITS` quali unità del gioco usano il personaggio, `SPLITS` come separare figure che si toccano. Nel gioco `drawRoman()` sceglie 4 direzioni (davanti, di lato specchiato, di spalle). Legionario = `miliziano` (Tirone) e `uomoarme` (Legionario, un po' più grande).
- Illustrazioni della storia: `ui/story_1..7.webp` (1-5 prologo, 6 cronache, 7 capitoli III-IV). Se mancano compare l'emoji segnaposto.
- Musica: `feudum.mp3` (villaggio), `raid.mp3` (razzie) — per ora le stesse di FEUDUM.
- `build.py` scrive anche `version.txt`: il gioco online si ricarica da solo quando esce una versione nuova.
- Collaudo automatico (misura iPhone): `python3 src/tools/collaudo.py [cartella_schermate]` — deve finire con "0 problemi trovati".
- Flusso: modifica `src/` → `python3 src/build.py` → `python3 src/tools/collaudo.py` → commit e push su `main`.
- Lingua del progetto e dei testi: italiano. Utente: Marco.
