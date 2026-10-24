#!/usr/bin/env python3
# Collaudo automatico di IMPERIUM alla misura di un iPhone: gioca, apre ogni finestra, tocca i tasti
# e controlla errori, sovrapposizioni e finestre coperte.   Uso: python3 src/tools/collaudo.py [cartella_schermate]
import subprocess, time, sys, os
from playwright.sync_api import sync_playwright
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SHOTS = sys.argv[1] if len(sys.argv) > 1 else None
PORT = 8799
PROBLEMI = []
def ko(msg): PROBLEMI.append(msg); print('  ✗', msg)
def ok(msg): print('  ✓', msg)

# controllo comune: la finestra in cima è davvero visibile e toccabile, niente esce dallo schermo
CHECK = """(sel)=>{const out=[]; const el=document.querySelector(sel); if(!el||el.classList.contains('hidden')||getComputedStyle(el).display==='none') return ['non aperta'];
 const r=el.getBoundingClientRect(); const pts=[[r.left+r.width/2,r.top+Math.min(r.height-4,60)],[r.left+r.width/2,r.top+r.height/2]];
 for(const [x,y] of pts){ if(y<0||y>innerHeight) continue; const t=document.elementFromPoint(x,y); if(!t||!el.contains(t)) out.push('coperta da '+(t?(t.id||t.className||t.tagName):'nulla')); }
 if(r.right>innerWidth+1||r.left<-1) out.push('esce dallo schermo');
 const tb=document.querySelector('#tutb'); if(tb&&!tb.classList.contains('hidden')&&el.id!=='tutb'){ const q=tb.getBoundingClientRect(); if(q.bottom>r.top&&q.top<r.bottom&&q.right>r.left&&q.left<r.right&&!tb.classList.contains('mini')) out.push('la guida si sovrappone'); }
 for(const b of el.querySelectorAll('button')){ const q=b.getBoundingClientRect(); if(q.width>2&&q.right>innerWidth+1) out.push('tasto fuori schermo: '+b.textContent.trim().slice(0,20)); }
 return [...new Set(out)];}"""

def main():
    srv = subprocess.Popen(['python3', '-m', 'http.server', str(PORT)], cwd=REPO, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1)
    try:
        with sync_playwright() as p:
            b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
            ctx = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, has_touch=True, is_mobile=True); pg = ctx.new_page()
            errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.route('**/fonts.googleapis.com/**', lambda r: r.abort())
            ev = lambda js: pg.evaluate('()=>{' + js + '}')
            def shot(n):
                if SHOTS: pg.screenshot(path=os.path.join(SHOTS, f'col_{n}.png'))
            def sheet(nome, js, sel='#sheet'):
                try:
                    ev('closeSheet(); askClose&&askClose(); ' + js); pg.wait_for_timeout(350)
                    r = pg.evaluate(CHECK, sel)
                    if r: ko(f'{nome}: ' + '; '.join(r)); shot(nome)
                    else: ok(nome)
                except Exception as e: ko(f'{nome}: errore {str(e)[:120]}')
            pg.goto(f'http://localhost:{PORT}/'); pg.wait_for_timeout(3000)
            print('— Prologo')
            vis = ev("return !document.querySelector('#story').classList.contains('hidden')")
            ok('il prologo parte alla prima apertura') if vis else ko('il prologo non parte')
            for i in range(5): pg.touchscreen.tap(195, 500); pg.wait_for_timeout(250)
            ok('il prologo si chiude toccando') if ev("return document.querySelector('#story').classList.contains('hidden')") else ko('il prologo non si chiude')
            print('— Menu principale')
            for k, nome in [('k-cron', 'Cronache'), ('k-rlm', 'Altri Regni')]:
                pg.tap(f'#tbtns .{k}'); pg.wait_for_timeout(400); r = pg.evaluate(CHECK, '#sheet')
                ko(f'{nome} dal menu: ' + '; '.join(r)) if r else ok(f'{nome} dal menu'); ev('closeSheet()')
            pg.tap('#tset .btn:nth-child(1)'); pg.wait_for_timeout(300); ok('Layout dal menu') if ev("return !!document.querySelector('#tbtns .lay')") else ko('Layout dal menu non si apre'); ev('showTitle()')
            pg.tap('#tbtns .k-new'); pg.wait_for_timeout(4500)
            ok('nuova campagna avviata') if ev("return MODE==='village'") else ko('la campagna non parte')
            print('— Guida')
            ev("S.tut=0;TUT_SHOWN=-1"); pg.wait_for_timeout(400)
            ok('guida visibile') if ev("return !document.querySelector('#tutb').classList.contains('hidden')") else ko('guida non visibile')
            ev("openBuildingInfo(S.buildings.find(b=>b.t==='mastio'))"); pg.wait_for_timeout(400)
            ok('la guida si fa da parte con una finestra aperta') if ev("return document.querySelector('#tutb').classList.contains('hidden')") else ko('la guida resta sopra una finestra')
            ev('closeSheet(); tutSkip()')
            print('— Pulsanti in basso')
            for i, nome in enumerate(['Costruisci', 'Esercito', 'Castrum', 'Attacca', 'Menu']):
                ev('closeSheet()'); pg.tap(f'#hud-bot .hb:nth-child({i + 1})'); pg.wait_for_timeout(400); r = pg.evaluate(CHECK, '#sheet')
                ko(f'tasto {nome}: ' + '; '.join(r)) if r else ok(f'tasto {nome}')
            print('— Finestre')
            ev("S.mastio=8; S.mq=12; for(const r of RES) S.res[r]=5000; S.army.miliziano=10; S.army.arccorto=6")
            for nome, js in [('Decorazioni', "openBuild('d')"), ('Promemoria', 'openMemo()'), ('Diplomazia', 'openDiplo()'), ('Mercato', 'openMarket&&openMarket()'), ('Meteo', 'openWeather()'),
                             ('Diario', 'openDiary()'), ('Umore', 'openMood()'), ('Stemma', 'openArms()'), ('Cronache', 'openCronache()'), ('Copie di sicurezza', 'openBackups()'),
                             ('Menu Layout+Qualità', "openMenu('look')"), ('Menu Partita', "openMenu('game')"), ('Menu Audio', "openMenu('audio')"), ('Aiuto', 'openHelp()'),
                             ('Evento', 'openEvent(EVENTS[0])'), ('Capitolo', 'openChapter(1)'), ('Animale', 'openAnimal(S.fauna[0])'), ('Caserma', "openBuildingInfo(S.buildings.find(b=>b.t==='caserma'))")]:
                sheet(nome, js)
            sheet('Conferma', "askYes('Prova?',()=>{})", '#askd')
            ev('askClose()')
            print('— Caccia')
            ev("closeSheet(); const a=S.fauna.find(f=>!FAUNA[f.k].need); window._a=a; huntAnimal(a.id)"); pg.wait_for_timeout(500)
            ok('il cacciatore parte') if ev("return SC.U.some(u=>u.hunter)") else ko('il cacciatore non parte')
            print('— Razzia')
            ev('startRaid()'); pg.wait_for_timeout(2500)
            ok('razzia avviata') if ev("return MODE==='raid'") else ko('la razzia non parte')
            ev("for(let t=0;t<200&&!BT.ended;t+=0.1){updateScene(SC,0.1);battleTick(0.1);} if(!BT.ended) endBattle()"); pg.wait_for_timeout(1400)
            r = pg.evaluate(CHECK, '#sheet'); ko('esito razzia: ' + '; '.join(r)) if r else ok('esito razzia')
            ev('backToVillage()'); pg.wait_for_timeout(1500)
            print('— Assedio')
            ev("closeSheet(); openMap()"); pg.wait_for_timeout(400)
            ok('frammento della corona nella Mappa') if ev("return S.targets.some(t=>t.frag!=null)") else ko('nessun castello col frammento nella Mappa')
            ev("closeSheet(); S.army.miliziano=10; S.army.arccorto=6; startAttack(S.targets.findIndex(t=>t.frag!=null))"); pg.wait_for_timeout(2500)
            pg.tap('#bcards .ucard.all'); pg.wait_for_timeout(500)
            ok('Schiera tutti') if ev("return SC.U.filter(u=>u.pl).length>=10") else ko('Schiera tutti non schiera')
            ev("BT.mastioDown=true; BT.stars=3; for(const b of SC.B) if(!BDEF[b.t].wall&&!BDEF[b.t].decor) b.dead=true; endBattle()"); pg.wait_for_timeout(1400)
            r = pg.evaluate(CHECK, '#sheet'); ko('esito assedio: ' + '; '.join(r)) if r else ok('esito assedio')
            ok('frammento ottenuto') if ev("return S.frag===1") else ko('il frammento non viene assegnato')
            ev('backToVillage()'); pg.wait_for_timeout(2500)
            ok('racconto del frammento') if ev("return !document.querySelector('#story').classList.contains('hidden')") else ko('il racconto del frammento non parte')
            ev('storyEnd()')
            print('— Salvataggi')
            ev("save(); localStorage.removeItem('imperium_bk_'+SAVE_KEY); save()")
            ok('copia di sicurezza creata') if ev("return !!localStorage.getItem(SAVE_KEY+'_bk_h')") else ko('nessuna copia di sicurezza')
            print('— Qualità grafica')
            for q in ['bassa', 'media', 'alta']:
                ev(f"setQual('{q}'); closeSheet()"); pg.wait_for_timeout(600)
            ok('cambio qualità senza errori')
            print('— Errori JavaScript')
            if errs: [ko('errore: ' + e[:160]) for e in errs[:10]]
            else: ok('nessun errore')
            b.close()
    finally: srv.kill()
    print(f'\n{len(PROBLEMI)} problemi trovati')
    return len(PROBLEMI)

if __name__ == '__main__': sys.exit(1 if main() else 0)
