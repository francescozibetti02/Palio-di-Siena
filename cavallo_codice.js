/* ═══════════════════════════════════════════════════════════
   CODICE DEL DISEGNO DEL CAVALLO — estratto da index.html (Palio di Siena)
   1. COLORI_CONTRADE + disegnaPallinoPalio   (rosetta della fascetta sul capo del cavallo)
   1b. coloriFantino, posizioniManiFantino, disegnaFantinoPalio  (fantino visto dall'alto, animato)
   2. Palette mantello: PALETTE_CAVALLO_DEFAULT, estraiColoreCavalloDB,
      normalizzaColoreHex, sfumaColoreHex, costruisciPaletteCavallo
   3. disegnaCavalloPalio                     (funzione principale, vista dall'alto, animata)
   4. disegnaCavalloAlCanapo                  (wrapper usato nella scena al canapo)
   5. ANIMAZIONI_CAVALLO_SCOSSO, disegnaCavalloScosso  (cavallo scosso, senza fantino: 17 animazioni, una per contrada)
   6. CADUTA_FANTINO_CONTRADE, creaCadutaFantino, disegnaCadutaFantino, ANIMAZIONI_CADUTA_FANTINO
      (il fantino cade e il cavallo resta scosso: 17 animazioni, una per contrada)
   7. VITTORIA_CONTRADE, statoVittoria, disegnaCavalloVittoria, ANIMAZIONI_VITTORIA_FANTINO
      (il cavallo galoppa e il fantino festeggia agitando in aria il nerbo alzato: 17 animazioni, una per contrada)
   8. CADUTA_CAVALLO_CONTRADE, creaCadutaCavallo, disegnaCadutaCavallo, ANIMAZIONI_CADUTA_CAVALLO
      (cade anche il cavallo, insieme al fantino sbalzato: 17 animazioni, una per contrada)
   9. SORPASSO_CONTRADE, statoSorpasso, disegnaCavalloSorpasso, ANIMAZIONI_SORPASSO_NERBO
      (il fantino a cavallo frusta col nerbo, a destra, il fantino rivale che tenta il sorpasso:
       il rivale NON è disegnato; 17 animazioni, una per contrada)
   10. AFFERRA_CONTRADE, statoAfferra, disegnaCavalloAfferra, ANIMAZIONI_AFFERRA_GIUBBA
      (il fantino a cavallo stacca la mano SINISTRA dalle redini e strattona per la giubba il
       fantino che tenta il sorpasso a sinistra: il rivale NON è disegnato, si vede solo la
       mano che afferra e tira; 17 animazioni, una per contrada)
   ═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   COLORI CONTRADE — pallini araldici per la simulazione grafica
   Ogni funzione disegna il pallino su un <canvas> 2D
═══════════════════════════════════════════════ */
const COLORI_CONTRADE = {
  'Aquila':      { tipo:'cerchi', sfondo:'#E8C830', cerchi:[{r:.38,col:'#1A3A9C'},{r:.20,col:'#111111'}] },
  'Bruco':       { tipo:'quadrantie', q1:'#E8C830', q2:'#2E7A2E', centro:{r:.28,col:'#1A3A9C'} },
  'Chiocciola':  { tipo:'quadrantie', q1:'#E8C830', q2:'#CC2222', centro:{r:.28,col:'#1A3A9C'} },
  'Civetta':     { tipo:'quadrantie', q1:'#CC2222', q2:'#111111', centro:{r:.28,col:'#FFFFFF'} },
  'Drago':       { tipo:'quadrantie', q1:'#CC2222', q2:'#2E7A2E', centro:{r:.28,col:'#E8C830'} },
  'Giraffa':     { tipo:'quadrantie', q1:'#FFFFFF', q2:'#CC2222', centro:null },
  'Istrice':     { tipo:'istrice', sfondo:'#FFFFFF', interno:'#111111', raggi:['#1A3A9C','#CC2222','#111111'] },
  'Leocorno':    { tipo:'quadrantie', q1:'#FFFFFF', q2:'#E87020', centro:{r:.28,col:'#1A3A9C'} },
  'Lupa':        { tipo:'quadrantie', q1:'#FFFFFF', q2:'#111111', centro:{r:.28,col:'#E87020'} },
  'Nicchio':     { tipo:'cerchi', sfondo:'#1A3A9C', cerchi:[{r:.38,col:'#E8C830'},{r:.20,col:'#CC2222'}] },
  'Oca':         { tipo:'quadrantie', q1:'#FFFFFF', q2:'#2E7A2E', centro:{r:.28,col:'#CC2222'} },
  'Onda':        { tipo:'quadrantie', q1:'#FFFFFF', q2:'#7ABCDC', centro:null },
  'Pantera':     { tipo:'quadrantie', q1:'#1A3A9C', q2:'#CC2222', centro:{r:.28,col:'#FFFFFF'} },
  'Selva':       { tipo:'quadrantie', q1:'#E87020', q2:'#2E7A2E', centro:{r:.28,col:'#FFFFFF'} },
  'Tartuca':     { tipo:'quadrantie', q1:'#E8C830', q2:'#1A3A9C', centro:null },
  'Torre':       { tipo:'cerchi', sfondo:'#6B1020', cerchi:[{r:.38,col:'#FFFFFF'},{r:.20,col:'#1A3A9C'}] },
  'Valdimontone':{ tipo:'quadrantie', q1:'#E8C830', q2:'#CC2222', centro:{r:.28,col:'#FFFFFF'} },
};

/* ═══════════════════════════════════════════════
   FASCETTA SUL CAPO DEL CAVALLO — colori per contrada
   Ogni schema è l'elenco delle strisce [colore, peso] affiancate da un lato
   all'altro della fascetta: ogni striscia è una linea che corre lungo il
   cavallo, dal muso verso il posteriore (primo colore = lato sinistro del
   cavallo). Il peso è lo spessore relativo (le "piccole strisce" hanno peso basso).
   Tartuca: base gialla con una striscia blu in obliquo (campo 'obliqua').
═══════════════════════════════════════════════ */
const FC = { giallo:'#E8C830', blu:'#1A3A9C', rosso:'#CC2222', verde:'#2E7A2E', nero:'#111111',
             bianco:'#FFFFFF', arancio:'#E87020', azzurro:'#7ABCDC', bordeaux:'#6B1020', oro:'#E8C830' };
const FASCIA_CONTRADE = {
  'Istrice':      { segmenti: [[FC.blu,1],[FC.bianco,1],[FC.rosso,1],[FC.bianco,1],[FC.nero,1]] },
  'Lupa':         { segmenti: [[FC.nero,3],[FC.arancio,1.2],[FC.bianco,3]] },
  'Bruco':        { segmenti: [[FC.giallo,3],[FC.blu,1.2],[FC.verde,3]] },
  'Giraffa':      { segmenti: [[FC.bianco,1],[FC.rosso,1]] },
  'Leocorno':     { segmenti: [[FC.arancio,3],[FC.blu,1.2],[FC.bianco,3]] },
  // Torre: bordeaux con striscia bianca centrale e linea blu al centro del bianco
  'Torre':        { segmenti: [[FC.bordeaux,2.2],[FC.bianco,1.2],[FC.blu,.4],[FC.bianco,1.2],[FC.bordeaux,2.2]] },
  'Nicchio':      { segmenti: [[FC.blu,1],[FC.giallo,1],[FC.rosso,1],[FC.blu,1]] },
  'Valdimontone': { segmenti: [[FC.rosso,3],[FC.bianco,1.2],[FC.giallo,3]] },
  'Onda':         { segmenti: [[FC.bianco,1],[FC.azzurro,1]] },
  'Tartuca':      { segmenti: [[FC.giallo,1]], obliqua: FC.blu },
  'Chiocciola':   { segmenti: [[FC.rosso,3],[FC.blu,1.2],[FC.giallo,3]] },
  'Pantera':      { segmenti: [[FC.rosso,3],[FC.bianco,1.2],[FC.blu,3]] },
  'Aquila':       { segmenti: [[FC.giallo,3],[FC.nero,1],[FC.blu,1],[FC.giallo,3]] },
  'Selva':        { segmenti: [[FC.arancio,3],[FC.bianco,1.2],[FC.verde,3]] },
  'Civetta':      { segmenti: [[FC.rosso,3],[FC.bianco,1.2],[FC.nero,3]] },
  'Oca':          { segmenti: [[FC.bianco,3],[FC.rosso,1.2],[FC.verde,3]] },
  'Drago':        { segmenti: [[FC.rosso,3],[FC.oro,1.2],[FC.verde,3]] },
};

/* Colore di capezza e redini per contrada (un solo colore, quello più
   riconoscibile/visibile della contrada). Modificabile liberamente. */
const CAPEZZA_CONTRADE = {
  'Aquila':FC.giallo, 'Bruco':FC.verde, 'Chiocciola':FC.rosso, 'Civetta':FC.rosso,
  'Drago':FC.rosso, 'Giraffa':FC.rosso, 'Istrice':FC.blu, 'Leocorno':FC.arancio,
  'Lupa':FC.bianco, 'Nicchio':FC.blu, 'Oca':FC.verde, 'Onda':FC.azzurro,
  'Pantera':FC.blu, 'Selva':FC.arancio, 'Tartuca':FC.giallo, 'Torre':FC.bordeaux,
  'Valdimontone':FC.rosso,
};
function coloreCapezzaContrada(nomeCon) {
  let col = CAPEZZA_CONTRADE[nomeCon];
  if (!col && nomeCon) {
    const k = Object.keys(CAPEZZA_CONTRADE).find(k => nomeCon.toLowerCase().includes(k.toLowerCase()));
    col = k ? CAPEZZA_CONTRADE[k] : null;
  }
  if (col) return col;
  const cols = coloriFasciaContrada(nomeCon);
  return cols && cols.length ? cols[0] : '#C8991E';
}

/* Schema della fascetta di una contrada (nome esatto o corrispondenza parziale);
   se la contrada non è in tabella, ricade sui colori dello stemma in parti uguali */
function schemaFasciaContrada(nomeCon) {
  let schema = FASCIA_CONTRADE[nomeCon];
  if (!schema && nomeCon) {
    const k = Object.keys(FASCIA_CONTRADE).find(k => nomeCon.toLowerCase().includes(k.toLowerCase()));
    schema = k ? FASCIA_CONTRADE[k] : null;
  }
  if (schema) return schema;
  const cols = coloriFasciaContrada(nomeCon);
  return cols && cols.length ? { segmenti: cols.map(c => [c, 1]) } : null;
}

function disegnaPallinoPalio(ctx, x, y, r, nomeCon, senzaBordo) {
  // Cerca sia nome esatto sia corrispondenza parziale
  let def = COLORI_CONTRADE[nomeCon];
  if (!def) {
    const k = Object.keys(COLORI_CONTRADE).find(k => nomeCon && nomeCon.toLowerCase().includes(k.toLowerCase()));
    def = k ? COLORI_CONTRADE[k] : null;
  }
  if (!def) {
    // Fallback: pallino arancio generico
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle='#C8991E'; ctx.fill();
    return;
  }

  const tipo = def.tipo;

  if (tipo === 'cerchi') {
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle = def.sfondo; ctx.fill();
    def.cerchi.forEach(c => {
      ctx.beginPath(); ctx.arc(x,y,r*c.r,0,Math.PI*2);
      ctx.fillStyle = c.col; ctx.fill();
    });

  } else if (tipo === 'quadrantie') {
    // 4 quadranti: alto-sin e basso-dx = q1, alto-dx e basso-sin = q2
    ctx.save();
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.clip();
    // alto-sin (q1)
    ctx.fillStyle = def.q1;
    ctx.fillRect(x-r, y-r, r, r);
    // basso-dx (q1)
    ctx.fillRect(x, y, r, r);
    // alto-dx (q2)
    ctx.fillStyle = def.q2;
    ctx.fillRect(x, y-r, r, r);
    // basso-sin (q2)
    ctx.fillRect(x-r, y, r, r);
    ctx.restore();
    if (def.centro) {
      ctx.beginPath(); ctx.arc(x,y,r*def.centro.r,0,Math.PI*2);
      ctx.fillStyle = def.centro.col; ctx.fill();
    }

  } else if (tipo === 'istrice') {
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle = def.sfondo; ctx.fill();
    // Raggi alternati
    const colori = def.raggi;
    const nRaggi = 12;
    for (let i=0; i<nRaggi; i++) {
      const ang = (i/nRaggi)*Math.PI*2;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(ang)*r*0.26, y + Math.sin(ang)*r*0.26);
      ctx.lineTo(x + Math.cos(ang)*r*0.92, y + Math.sin(ang)*r*0.92);
      ctx.strokeStyle = colori[i % colori.length];
      ctx.lineWidth = r*0.13;
      ctx.stroke();
    }
    // Pallino nero centrale con pallino bianco
    ctx.beginPath(); ctx.arc(x,y,r*0.32,0,Math.PI*2);
    ctx.fillStyle = def.interno; ctx.fill();
    ctx.beginPath(); ctx.arc(x,y,r*0.14,0,Math.PI*2);
    ctx.fillStyle = '#FFFFFF'; ctx.fill();
  }

  // Bordo sottile per leggibilità (omesso se senzaBordo: es. rosetta della fascetta del cavallo)
  if (!senzaBordo) {
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
    ctx.strokeStyle='rgba(0,0,0,.35)'; ctx.lineWidth=1; ctx.stroke();
  }
}

/* ═══════════════════════════════════════════════
   FANTINO VISTO DALL'ALTO — sostituisce il vecchio pallino sopra il cavallo
   Pantaloni (cosce), giubba a maniche lunghe con falda che sventola,
   braccia che terminano con le mani (rosa) sulle redini, zucchino.
   Si disegna nel sistema di riferimento del cavallo (asse x = senso di
   marcia), quindi ruota con lui. Pantaloni/giubba/zucchino usano i colori
   della contrada. Si anima con la stessa "fase" del galoppo.
═══════════════════════════════════════════════ */
const COLORE_MANI_FANTINO = '#F4A0B0';   // rosa

/* Colori del fantino ricavati dalla contrada (stessa tabella della fascetta) */
function coloriFantino(nomeCon) {
  const c = coloriFasciaContrada(nomeCon) || ['#C8991E', '#8a1c1c', '#F2F2F2'];
  const giubba    = c[0];
  const pantaloni = c[1] || c[0];
  const zucchino  = c[2] || c[1] || c[0];
  const dettaglio = c.find(x => x !== giubba) || '#FFFFFF';
  return { giubba, pantaloni, zucchino, dettaglio };
}

/* ═══════════════════════════════════════════════
   NERBO — il fantino lo tiene sempre nella mano destra (linea dritta gialla).
   Ogni contrada ha il PROPRIO schema che si ripete: N cicli di galoppo "normali"
   (nerbo in mano, ma entrambe le mani sulle redini) seguiti da M cicli con le
   nerbate: in questi la mano destra stacca dalle redini (restano nella sinistra)
   e colpisce il posteriore del cavallo, una nerbata per ciclo. Un "ciclo" = una
   falcata completa (fase += 2π). N, M e il punto di partenza (sfas, in cicli
   interi, così i cicli restano allineati alla falcata) cambiano da contrada a
   contrada (NERBO_CONTRADE), per cui i fantini non nerbano mai tutti insieme
   anche se la fase del galoppo è la stessa. Schema di default (contrada non in
   tabella): 2 normali + 2 con nerbate.
   statoNerbo(fase, nomeCon) → { w, phi, k }
     w   = 0 (mano destra sulle redini) … 1 (mano destra staccata, nerbo in azione),
           con dissolvenza morbida all'inizio e alla fine dei cicli con nerbate
     phi = angolo del nerbo rispetto alla direzione "verso la coda" (negativo = armato
           verso l'esterno, positivo = colpisce la groppa)
     k   = 0 (braccio armato) … 1 (colpo a segno)
═══════════════════════════════════════════════ */
const COLORE_NERBO = '#E8C830';                    // giallo
const NERBO_ANGOLO_RIPOSO = 0.7;                   // rad: a riposo punta avanti-fuori, lungo il fianco del collo
/* normali = cicli con le mani sulle redini, nerbate = cicli con le nerbate,
   sfas = cicli interi di sfasamento iniziale (0 … normali+nerbate-1) */
const NERBO_CONTRADE = {
  'Aquila':       { normali:2, nerbate:2, sfas:0 },
  'Bruco':        { normali:3, nerbate:2, sfas:1 },
  'Chiocciola':   { normali:1, nerbate:2, sfas:2 },
  'Civetta':      { normali:4, nerbate:1, sfas:3 },
  'Drago':        { normali:2, nerbate:3, sfas:0 },
  'Giraffa':      { normali:3, nerbate:1, sfas:2 },
  'Istrice':      { normali:1, nerbate:1, sfas:1 },
  'Leocorno':     { normali:2, nerbate:1, sfas:1 },
  'Lupa':         { normali:4, nerbate:2, sfas:4 },
  'Nicchio':      { normali:3, nerbate:3, sfas:2 },
  'Oca':          { normali:1, nerbate:3, sfas:1 },
  'Onda':         { normali:2, nerbate:2, sfas:3 },
  'Pantera':      { normali:5, nerbate:2, sfas:3 },
  'Selva':        { normali:1, nerbate:2, sfas:0 },
  'Tartuca':      { normali:3, nerbate:2, sfas:4 },
  'Torre':        { normali:2, nerbate:4, sfas:2 },
  'Valdimontone': { normali:4, nerbate:3, sfas:5 },
};
function schemaNerbo(nomeCon) {
  let sc = NERBO_CONTRADE[nomeCon];
  if (!sc && nomeCon) {
    const k = Object.keys(NERBO_CONTRADE).find(k => nomeCon.toLowerCase().includes(k.toLowerCase()));
    sc = k ? NERBO_CONTRADE[k] : null;
  }
  return sc || { normali:2, nerbate:2, sfas:0 };
}

function statoNerbo(fase, nomeCon) {
  const sm = (t) => { t = Math.max(0, Math.min(1, t)); return t*t*(3 - 2*t); };
  const sc = schemaNerbo(nomeCon);
  const periodo = sc.normali + sc.nerbate;
  const cicli = ((((fase / (Math.PI*2)) + sc.sfas) % periodo) + periodo) % periodo;   // 0…periodo
  const RAMP = 0.25;                                              // durata (in cicli) di stacco/ripresa delle redini
  const w = cicli < sc.normali ? 0 : sm((cicli - sc.normali)/RAMP) * sm((periodo - cicli)/RAMP);
  const p = cicli % 1;                                            // posizione dentro il ciclo corrente
  const ARM = -0.5, COLPO = 0.45;                                 // angoli: armato / a segno
  let phi;
  if      (p < 0.35) phi = ARM;                                                   // braccio armato
  else if (p < 0.50) { const q = (p - 0.35)/0.15; phi = ARM + (COLPO - ARM)*q*q; } // colpo (accelera)
  else if (p < 0.78) phi = COLPO + (ARM - COLPO)*sm((p - 0.50)/0.28);             // ritorno
  else               phi = ARM;
  return { w, phi, k: (phi - ARM)/(COLPO - ARM) };
}

/* Mani come le vede il fantino: la sinistra resta sulle redini; la destra, quando
   usa il nerbo, si sposta indietro-fuori (armata) e poi vicino alla groppa (colpo) */
function posizioniManiConNerbo(r, fase, nerbo, nomeCon) {
  const rip = posizioniManiFantino(r, fase);
  const st = nerbo || statoNerbo(fase, nomeCon);
  const T = { x: r*(0.30 - 0.65*st.k), y: r*(1.35 - 0.40*st.k) };
  return {
    sx: rip.sx,
    dx: { x: rip.dx.x + (T.x - rip.dx.x)*st.w, y: rip.dx.y + (T.y - rip.dx.y)*st.w }
  };
}

/* Posizione delle due mani (coord. locali del cavallo: +x = avanti).
   Condivisa fra il fantino (che le disegna) e le redini del cavallo (che vi
   si attaccano): le mani vanno avanti e indietro seguendo la falcata. */
function posizioniManiFantino(r, fase) {
  return {
    sx: { x: r*(1.62 + 0.20*Math.sin(fase + 0.35)), y: -r*(0.40 + 0.035*Math.sin(fase*2 + 0.6)) },
    dx: { x: r*(1.62 + 0.20*Math.sin(fase - 0.35)), y:  r*(0.40 + 0.035*Math.sin(fase*2 - 0.6)) }
  };
}

/* ═══════════════════════════════════════════════
   DIVISE DEL FANTINO PER CONTRADA (pantaloni, giubba, maniche, zucchino, visiera)
   Convenzioni (lato sinistro del cavallo = y negativo, destro = y positivo):
   • contrade "a metà" (A,B nell'ordine indicato): giubba sx=A / dx=B; pantaloni
     opposti (sx=B / dx=A); ogni manica ha il colore OPPOSTO alla metà di giubba a
     cui è attaccata; zucchino in quattro spicchi alternati (davanti-sx=B,
     davanti-dx=A, dietro-sx=A, dietro-dx=B), quindi opposto alla giubba;
     visiera: colore unico, oppure (null) divisa a metà con i lati opposti
     rispetto agli spicchi anteriori dello zucchino (sx=A, dx=B)
   • contrade "tinta unita": tutto dello stesso colore
   • Istrice: bianco con linee rosse/blu/nere, zucchino a cerchi concentrici
═══════════════════════════════════════════════ */
const ROSA_FANTINO = '#F7B6CE';   // rosa chiaro
const solidoFantino = (c, vis) => ({
  pant: { tipo:'unito', c }, giub: { tipo:'unito', c }, man: { sx:c, dx:c },
  zuc:  { tipo:'unito', c }, vis
});
const divisaFantino = (A, B, vis) => ({
  pant: { tipo:'meta', sx:B, dx:A },
  giub: { tipo:'meta', sx:A, dx:B },
  man:  { sx:B, dx:A },
  zuc:  { tipo:'quarti', fs:B, fd:A, bs:A, bd:B },
  vis:  vis || { sx:A, dx:B }
});
const FANTINO_CONTRADE = {
  'Aquila':       solidoFantino(FC.giallo, FC.giallo),
  'Bruco':        divisaFantino(FC.giallo, FC.verde,   FC.blu),
  'Chiocciola':   divisaFantino(FC.giallo, FC.rosso,   FC.blu),
  'Civetta':      divisaFantino(FC.nero,   FC.rosso,   FC.bianco),
  'Drago':        divisaFantino(FC.verde,  FC.rosso,   FC.giallo),
  'Giraffa':      divisaFantino(FC.bianco, FC.rosso,   null),
  'Istrice':      { pant:{tipo:'istrice'}, giub:{tipo:'istrice'}, man:{tipo:'istrice'},
                    zuc:{tipo:'istriceCerchi'}, vis:FC.bianco },
  'Leocorno':     divisaFantino(FC.bianco, FC.arancio, FC.blu),
  'Lupa':         divisaFantino(FC.bianco, FC.nero,    FC.arancio),
  'Nicchio':      solidoFantino(FC.blu, FC.blu),
  'Oca':          divisaFantino(FC.bianco, FC.verde,   FC.rosso),
  'Onda':         divisaFantino(FC.bianco, FC.azzurro, null),
  'Pantera':      divisaFantino(FC.blu,    FC.rosso,   FC.bianco),
  'Selva':        divisaFantino(FC.verde,  FC.arancio, FC.bianco),
  'Tartuca':      divisaFantino(FC.giallo, FC.blu,     null),
  'Torre':        solidoFantino(FC.bordeaux, FC.bordeaux),
  'Valdimontone': { pant:{tipo:'unito', c:ROSA_FANTINO}, giub:{tipo:'unito', c:ROSA_FANTINO},
                    man:{ sx:ROSA_FANTINO, dx:ROSA_FANTINO },
                    zuc:{tipo:'quarti', fs:FC.giallo, fd:FC.rosso, bs:FC.rosso, bd:FC.giallo},
                    vis:FC.bianco },
};

/* Dettagli aggiuntivi della divisa (si applicano sopra la divisa base):
   • striscia = colore della fascia sulla parte bassa della giubba (falda posteriore)
   • punto    = cerchietto al centro dello zucchino: un colore, oppure
                [esterno, interno] per due cerchietti concentrici */
const DETTAGLI_FANTINO = {
  'Aquila':       { striscia:FC.blu,     punto:[FC.nero, FC.blu] },
  'Bruco':        { striscia:FC.blu,     punto:FC.blu },
  'Chiocciola':   { striscia:FC.blu,     punto:FC.blu },
  'Civetta':      { striscia:FC.bianco,  punto:FC.bianco },
  'Drago':        { striscia:FC.giallo,  punto:FC.giallo },
  'Leocorno':     { striscia:FC.blu,     punto:FC.blu },
  'Lupa':         { striscia:FC.arancio, punto:FC.arancio },
  'Nicchio':      { striscia:FC.rosso,   punto:[FC.rosso, FC.giallo] },
  'Oca':          { striscia:FC.rosso,   punto:FC.rosso },
  'Pantera':      { striscia:FC.bianco,  punto:FC.bianco },
  'Selva':        { striscia:FC.bianco,  punto:FC.bianco },
  'Torre':        { striscia:FC.blu,     punto:[FC.bianco, FC.blu] },
  'Valdimontone': { striscia:FC.giallo,  punto:FC.bianco },
  // Giraffa, Istrice, Onda, Tartuca: nessun dettaglio
};
Object.keys(DETTAGLI_FANTINO).forEach(k => Object.assign(FANTINO_CONTRADE[k], DETTAGLI_FANTINO[k]));

/* Divisa di una contrada (nome esatto o corrispondenza parziale); se la contrada
   non è in tabella ricade sui vecchi colori ricavati dallo stemma, a tinta unita */
function specFantinoContrada(nomeCon) {
  let s = FANTINO_CONTRADE[nomeCon];
  if (!s && nomeCon) {
    const k = Object.keys(FANTINO_CONTRADE).find(k => nomeCon.toLowerCase().includes(k.toLowerCase()));
    s = k ? FANTINO_CONTRADE[k] : null;
  }
  if (s) return s;
  const c = coloriFantino(nomeCon);
  return { pant:{tipo:'unito', c:c.pantaloni}, giub:{tipo:'unito', c:c.giubba},
           man:{ sx:c.giubba, dx:c.giubba }, zuc:{tipo:'unito', c:c.zucchino}, vis:'#1a1a1a' };
}

/* Riempie la forma tracciata da traccia() secondo la divisa: tinta unita,
   metà sinistra/destra (divise dall'asse del cavallo) oppure bianco a righe Istrice */
function riempiParteFantino(ctx, r, spec, traccia) {
  const R = r*3;
  ctx.save();
  traccia(); ctx.clip();
  if (spec.tipo === 'meta') {
    ctx.fillStyle = spec.sx; ctx.fillRect(-R, -R, 2*R, R);
    ctx.fillStyle = spec.dx; ctx.fillRect(-R, 0, 2*R, R);
  } else if (spec.tipo === 'istrice') {
    ctx.fillStyle = FC.bianco; ctx.fillRect(-R, -R, 2*R, 2*R);
    const cols = [FC.blu, FC.rosso, FC.nero];
    for (let k = -10; k <= 10; k++) {                    // linee parallele all'asse del cavallo
      ctx.fillStyle = cols[((k % 3) + 3) % 3];
      ctx.fillRect(-R, k*r*0.22 - r*0.035, 2*R, r*0.07);
    }
  } else {
    ctx.fillStyle = spec.c; ctx.fillRect(-R, -R, 2*R, 2*R);
  }
  ctx.restore();
}

/* Capsula (segmento con estremità tonde) di larghezza w fra P0 e P1, come path */
function tracciaCapsulaFantino(ctx, P0, P1, w) {
  const dx = P1.x - P0.x, dy = P1.y - P0.y, L = Math.hypot(dx, dy) || 1;
  const nx = -dy/L, ny = dx/L, h = w/2, a0 = Math.atan2(ny, nx);
  ctx.beginPath();
  ctx.moveTo(P0.x + nx*h, P0.y + ny*h);
  ctx.lineTo(P1.x + nx*h, P1.y + ny*h);
  ctx.arc(P1.x, P1.y, h, a0, a0 - Math.PI, true);
  ctx.lineTo(P0.x - nx*h, P0.y - ny*h);
  ctx.arc(P0.x, P0.y, h, a0 + Math.PI, a0, true);
  ctx.closePath();
}

function disegnaFantinoPalio(ctx, r, nomeCon, fase, vitt, sorp, affr) {
  const div  = specFantinoContrada(nomeCon);
  // affr (facoltativo) = { w } : la mano SINISTRA strattona per la giubba il rivale che sorpassa a sinistra (vedi statoAfferra).
  // In questa azione la destra resta sulle redini e il nerbo a riposo.
  const affOn = !!(affr && !vitt && !sorp);
  const nerbo = affOn ? { w:0, phi:-0.5, k:0 } : statoNerbo(fase, nomeCon);
  const mani = posizioniManiConNerbo(r, fase, nerbo, nomeCon);   // mano destra staccata durante le nerbate
  // vitt (facoltativo) = { w } : festeggiamento, braccio destro alzato col nerbo che sventola (w = 0…1 transizione)
  const vit = vitt ? statoVittoria(r, fase, nomeCon, vitt.w == null ? 1 : vitt.w) : null;
  if (vit) mani.dx = { x: mani.dx.x + (vit.mano.x - mani.dx.x)*vit.e, y: mani.dx.y + (vit.mano.y - mani.dx.y)*vit.e };
  // sorp (facoltativo) = { w } : nerbata a destra contro il rivale che sorpassa (vedi statoSorpasso)
  const sor = (!vit && sorp) ? statoSorpasso(r, fase, nomeCon, sorp.w == null ? 1 : sorp.w) : null;
  if (sor) mani.dx = { x: mani.dx.x + (sor.mano.x - mani.dx.x)*sor.e, y: mani.dx.y + (sor.mano.y - mani.dx.y)*sor.e };
  // aff: mano sinistra che esce a sinistra, afferra la giubba del rivale (non disegnato) e tira
  const aff = affOn ? statoAfferra(r, fase, nomeCon, affr.w == null ? 1 : affr.w) : null;
  if (aff) mani.sx = { x: aff.mano.x, y: aff.mano.y };
  const lw   = Math.max(0.5, r*0.035);
  const contorno = 'rgba(0,0,0,.45)';
  const raggioMano = r*0.16;

  ctx.save();
  // Il busto "pompa" avanti-indietro col ritmo della falcata e ondeggia appena
  ctx.translate(r*0.05*Math.sin(fase*2), 0);
  ctx.rotate(Math.sin(fase*0.55 + 0.4) * 0.045 + (sor ? 0.07*sor.k*sor.e : 0) - (aff ? 0.09*aff.lean : 0));   // nella nerbata il busto si sporge appena a destra; nella presa si piega a sinistra
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';

  // ── 1) Pantaloni: bacino + due cosce piegate in avanti e in fuori (ginocchia) ──
  [-1, 1].forEach(lato => {
    const kx = r*(0.25 + 0.06*Math.sin(fase*2 + lato));
    const P0 = { x: -r*0.55, y: lato*r*0.38 }, P1 = { x: kx, y: lato*r*0.94 };
    const spec = div.pant.tipo === 'meta' ? { tipo:'unito', c: lato < 0 ? div.pant.sx : div.pant.dx } : div.pant;
    const traccia = () => tracciaCapsulaFantino(ctx, P0, P1, r*0.56);
    riempiParteFantino(ctx, r, spec, traccia);
    traccia(); ctx.strokeStyle = contorno; ctx.lineWidth = lw; ctx.stroke();
  });
  const bacino = (k) => () => { ctx.beginPath(); ctx.ellipse(-r*0.60, 0, r*0.50*k, r*0.62*k, 0, 0, Math.PI*2); };
  riempiParteFantino(ctx, r, div.pant, bacino(1));
  bacino(1)(); ctx.strokeStyle = contorno; ctx.lineWidth = lw; ctx.stroke();
  riempiParteFantino(ctx, r, div.pant, bacino(0.96));    // senza contorno nel punto di giunzione con le cosce

  // ── 2) Maniche (SECONDO PIANO: sopra i pantaloni, ma sotto la giubba che le copre).
  // Sottili: spalla → gomito (in fuori) → polso. Si fermano PRIMA della mano. ──
  [-1, 1].forEach(lato => {
    const m  = lato < 0 ? mani.sx : mani.dx;
    const S  = { x: r*0.42, y: lato*r*0.68 };
    const E  = { x: (S.x + m.x)/2 - r*0.05, y: lato*(r*1.02 + r*0.07*Math.sin(fase*2 + lato)) };
    const wM = r*0.26*(1 + 0.10*Math.sin(fase*2.4 + lato)) * ((vit && lato > 0) ? 1 + 0.30*vit.e : 1) * ((sor && lato > 0) ? 1 + 0.12*sor.e : 1) * ((aff && lato < 0) ? 1 + 0.12*aff.e : 1);  // la manica "gonfia" e sgonfia (più grossa se alzata: è più vicina)
    const tFine = 0.90;                                            // il polso: la mano viene dopo
    const traccia = (t0, t1, off) => {                             // tratto di quadratica S-E-m fra t0 e t1 (off = scostamento laterale)
      ctx.beginPath();
      for (let k = 0; k <= 12; k++) {
        const t = t0 + (t1 - t0)*k/12, u = 1 - t;
        let x = u*u*S.x + 2*u*t*E.x + t*t*m.x;
        let y = u*u*S.y + 2*u*t*E.y + t*t*m.y;
        if (off) {
          const dx = 2*u*(E.x - S.x) + 2*t*(m.x - E.x), dy = 2*u*(E.y - S.y) + 2*t*(m.y - E.y);
          const L = Math.hypot(dx, dy) || 1;
          x -= dy/L*off; y += dx/L*off;
        }
        if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
    };
    traccia(0, tFine, 0); ctx.strokeStyle = contorno; ctx.lineWidth = wM + lw*2; ctx.stroke();
    if (div.man.tipo === 'istrice') {
      traccia(0, tFine, 0); ctx.strokeStyle = FC.bianco; ctx.lineWidth = wM; ctx.stroke();
      [[-0.30, FC.blu], [0, FC.rosso], [0.30, FC.nero]].forEach(([o, c]) => {   // linee lungo la manica
        traccia(0, tFine, wM*o); ctx.strokeStyle = c; ctx.lineWidth = wM*0.10; ctx.stroke();
      });
    } else {
      traccia(0, tFine, 0); ctx.strokeStyle = lato < 0 ? div.man.sx : div.man.dx; ctx.lineWidth = wM; ctx.stroke();
    }
  });

  // ── 3) Giubba: busto con ANGOLI ARROTONDATI e falda posteriore che sventola ──
  const bill = r*0.07*Math.sin(fase*2 + 0.5);          // gonfiore dei fianchi
  const N = 8;
  const hem = [];                                      // punti dell'orlo posteriore ondulato
  for (let i = 0; i <= N; i++) {
    const u = i/N;
    const ang = Math.sin(fase*2.2 - u*3.2);            // onda che corre lungo l'orlo
    const centro = 1 - 0.35*Math.pow(2*u - 1, 2);      // la falda è più lunga al centro
    hem.push({
      x: -r*0.74 - r*(0.10 + 0.13*(0.5 + 0.5*ang))*centro,
      y: r*0.42*(1 - 2*u) + Math.sin(fase*1.7 + u*5)*r*0.03
    });
  }
  const tracciaGiubba = () => {
    ctx.beginPath();
    ctx.moveTo(r*0.50, -r*0.50);
    ctx.lineTo(r*0.50,  r*0.50);                                                   // bordo anteriore (colletto)
    ctx.quadraticCurveTo(r*0.50, r*0.76, r*0.25, r*0.78 + bill);                   // spalla destra arrotondata
    ctx.bezierCurveTo(-r*0.05, r*0.80 + bill, -r*0.35, r*0.64 + bill, -r*0.58, r*0.60 + bill);   // fianco destro
    ctx.quadraticCurveTo(hem[0].x, r*0.60 + bill, hem[0].x, hem[0].y);             // angolo posteriore destro arrotondato
    for (let i = 1; i < N; i++) {                                                  // orlo morbido (curve, niente spigoli)
      const mx = (hem[i].x + hem[i+1].x)/2, my = (hem[i].y + hem[i+1].y)/2;
      ctx.quadraticCurveTo(hem[i].x, hem[i].y, mx, my);
    }
    ctx.lineTo(hem[N].x, hem[N].y);
    ctx.quadraticCurveTo(hem[N].x, -r*0.60 - bill, -r*0.58, -r*0.60 - bill);       // angolo posteriore sinistro arrotondato
    ctx.bezierCurveTo(-r*0.35, -r*0.64 - bill, -r*0.05, -r*0.80 - bill, r*0.25, -r*0.78 - bill); // fianco sinistro
    ctx.quadraticCurveTo(r*0.50, -r*0.76, r*0.50, -r*0.50);                        // spalla sinistra arrotondata
    ctx.closePath();
  };
  riempiParteFantino(ctx, r, div.giub, tracciaGiubba);
  if (div.striscia) {                                  // fascia sulla parte bassa (falda posteriore)
    ctx.save();
    tracciaGiubba(); ctx.clip();
    ctx.fillStyle = div.striscia;
    ctx.fillRect(-r*3, -r*3, r*3 - r*0.62, r*6);
    ctx.restore();
  }
  tracciaGiubba(); ctx.strokeStyle = contorno; ctx.lineWidth = lw; ctx.stroke();

  // ── 4) Zucchino: calotta rotonda con visiera, leggermente avanti alle spalle ──
  const hx = r*0.80, hr = r*0.38;
  const tracciaVisiera = () => { ctx.beginPath(); ctx.ellipse(hx + hr*0.95, 0, r*0.14, r*0.26, 0, 0, Math.PI*2); };
  const tracciaCalotta = () => { ctx.beginPath(); ctx.arc(hx, 0, hr, 0, Math.PI*2); };
  // visiera: colore unico oppure divisa a metà (sinistra/destra)
  const vis = typeof div.vis === 'string' ? { tipo:'unito', c:div.vis } : { tipo:'meta', sx:div.vis.sx, dx:div.vis.dx };
  riempiParteFantino(ctx, r, vis, tracciaVisiera);
  tracciaVisiera(); ctx.strokeStyle = contorno; ctx.lineWidth = lw; ctx.stroke();
  // calotta: tinta unita, quattro spicchi alternati oppure cerchi concentrici (Istrice)
  ctx.save();
  tracciaCalotta(); ctx.clip();
  const zuc = div.zuc;
  if (zuc.tipo === 'quarti') {                     // fs/fd = davanti sx/dx, bs/bd = dietro sx/dx
    ctx.fillStyle = zuc.fs; ctx.fillRect(hx,      -hr, hr, hr);
    ctx.fillStyle = zuc.fd; ctx.fillRect(hx,       0,  hr, hr);
    ctx.fillStyle = zuc.bs; ctx.fillRect(hx - hr, -hr, hr, hr);
    ctx.fillStyle = zuc.bd; ctx.fillRect(hx - hr,  0,  hr, hr);
  } else if (zuc.tipo === 'istriceCerchi') {       // dal centro: bianco, nero, bianco, rosso, blu, bianco
    const anelli = [FC.bianco, FC.blu, FC.rosso, FC.bianco, FC.nero, FC.bianco];   // dal più esterno al centro
    anelli.forEach((c, i) => {
      ctx.beginPath(); ctx.arc(hx, 0, hr*(1 - i/6), 0, Math.PI*2);
      ctx.fillStyle = c; ctx.fill();
    });
  } else {
    ctx.fillStyle = zuc.c; ctx.fillRect(hx - hr, -hr, hr*2, hr*2);
  }
  if (div.punto) {                                 // cerchietto (o due concentrici) al centro dello zucchino
    const pt = Array.isArray(div.punto) ? div.punto : [div.punto];
    const rr = pt.length > 1 ? [hr*0.40, hr*0.22] : [hr*0.28];
    pt.forEach((c, i) => {
      ctx.beginPath(); ctx.arc(hx, 0, rr[i], 0, Math.PI*2);
      ctx.fillStyle = c; ctx.fill();
    });
  }
  ctx.restore();
  ctx.beginPath(); ctx.ellipse(hx + hr*0.15, -hr*0.38, hr*0.28, hr*0.16, -0.5, 0, Math.PI*2);
  ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fill();                               // riflesso
  tracciaCalotta(); ctx.strokeStyle = contorno; ctx.lineWidth = lw; ctx.stroke();

  // ── 5a) Nerbo: linea dritta gialla impugnata nella mano destra ──
  {
    const H = mani.dx;
    let th = NERBO_ANGOLO_RIPOSO*(1 - nerbo.w) + (Math.PI + nerbo.phi)*nerbo.w;
    let Lw = r*1.6, spess = r*0.07;
    let dx = Math.cos(th), dy = Math.sin(th);
    if (sor) {                                     // nerbata a destra: direzione e lunghezza dettate dalla nerbata
      dx += (sor.dir.x - dx)*sor.e; dy += (sor.dir.y - dy)*sor.e;
      const nn = Math.hypot(dx, dy) || 1; dx /= nn; dy /= nn;
      Lw += (sor.L - Lw)*sor.e;
    }
    if (vit) {                                     // festeggiamento: il nerbo alzato (più vicino alla vista) sventola in aria
      dx += (vit.dir.x - dx)*vit.e; dy += (vit.dir.y - dy)*vit.e;
      const nn = Math.hypot(dx, dy) || 1; dx /= nn; dy /= nn;
      Lw += (vit.L - Lw)*vit.e; spess *= 1 + 0.45*vit.e;
    }
    const tip = { x: H.x + dx*Lw, y: H.y + dy*Lw };
    ctx.lineCap = 'round';
    if (sor && sor.e > 0.01 && sor.vel > 0.05) {   // scia della sferzata: arco tenue percorso dalla punta + codino della frusta
      const a1 = Math.atan2(dy, dx);
      ctx.beginPath(); ctx.arc(H.x, H.y, Lw*0.97, a1, a1 + sor.scia*sor.vel, false);
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.38*sor.vel*sor.e).toFixed(3) + ')';
      ctx.lineWidth = Math.max(0.6, r*0.05); ctx.stroke();
      const lc = r*(0.30 + 0.35*sor.vel);          // il codino resta indietro rispetto al moto della punta
      const qx = tip.x - dx*lc - dy*lc*0.55*sor.vel, qy = tip.y - dy*lc + dx*lc*0.55*sor.vel;
      ctx.beginPath(); ctx.moveTo(tip.x, tip.y);
      ctx.quadraticCurveTo((tip.x + qx)/2 - dy*lc*0.25*sor.vel, (tip.y + qy)/2 + dx*lc*0.25*sor.vel, qx, qy);
      ctx.strokeStyle = COLORE_NERBO; ctx.lineWidth = Math.max(0.5, spess*0.55); ctx.stroke();
    }
    if (vit && vit.e > 0.01) {                     // ombra del nerbo sul terreno (è in alto)
      const o = { x: r*0.30*vit.e, y: r*0.55*vit.e };
      ctx.beginPath(); ctx.moveTo(H.x + o.x, H.y + o.y); ctx.lineTo(tip.x + o.x, tip.y + o.y);
      ctx.strokeStyle = 'rgba(0,0,0,' + (0.20*vit.e).toFixed(3) + ')'; ctx.lineWidth = spess; ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(H.x, H.y); ctx.lineTo(tip.x, tip.y);
    ctx.strokeStyle = contorno;     ctx.lineWidth = spess + lw*2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(H.x, H.y); ctx.lineTo(tip.x, tip.y);
    ctx.strokeStyle = COLORE_NERBO; ctx.lineWidth = spess;        ctx.stroke();
    if (vit && vit.e > 0.3) {                      // punta del nerbo: piccolo "ventaglio" che sventola
      ctx.beginPath(); ctx.arc(tip.x, tip.y, r*0.07*vit.e, 0, Math.PI*2);
      ctx.fillStyle = COLORE_NERBO; ctx.fill();
    }
  }

  // ── 5) Mani: pallini rosa DOPO le maniche, sulle redini ──
  [mani.sx, mani.dx].forEach(m => {
    const sxAff = !!(aff && m === mani.sx);
    const rm = (vit && m === mani.dx) ? raggioMano*(1 + 0.35*vit.e)
             : sxAff ? raggioMano*(1 + 0.30*aff.g) : raggioMano;
    if (sxAff && AFFERRA_MOSTRA_STOFFA && aff.g > 0.05) {   // lembo di giubba stretto nel pugno (il rivale NON è disegnato)
      const u = aff.dir, nx = -u.y, ny = u.x;
      const L = r*(0.20 + 0.26*aff.tira)*aff.g, wv = Math.sin(fase*3.1)*r*0.04;
      const P = (a, b) => ({ x: m.x + u.x*a + nx*b, y: m.y + u.y*a + ny*b });
      const A = P(0, rm*0.85), B = P(L*0.75, rm*1.15 + wv), C = P(L*1.15, rm*0.15 + wv),
            D = P(L*0.80, -rm*1.10 - wv), E = P(0, -rm*0.85);
      ctx.beginPath(); ctx.moveTo(A.x, A.y);
      ctx.quadraticCurveTo(B.x, B.y, C.x, C.y);
      ctx.quadraticCurveTo(D.x, D.y, E.x, E.y);
      ctx.closePath();
      ctx.fillStyle = COLORE_STOFFA_RIVALE; ctx.fill();
      ctx.strokeStyle = contorno; ctx.lineWidth = lw; ctx.stroke();
      const F0 = P(L*0.15, 0), F1 = P(L*0.95, wv*0.5);                // piega della stoffa tesa
      ctx.beginPath(); ctx.moveTo(F0.x, F0.y); ctx.lineTo(F1.x, F1.y);
      ctx.strokeStyle = 'rgba(0,0,0,.28)'; ctx.lineWidth = Math.max(0.5, lw*0.8); ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(m.x, m.y, rm, 0, Math.PI*2);
    ctx.fillStyle = COLORE_MANI_FANTINO; ctx.fill();
    ctx.strokeStyle = contorno; ctx.lineWidth = lw; ctx.stroke();
    if (sxAff && aff.g > 0.3) {                                    // pugno chiuso: nocche
      ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = Math.max(0.5, lw*0.8);
      [-0.45, 0, 0.45].forEach(o => {
        ctx.beginPath(); ctx.arc(m.x + rm*0.15, m.y + rm*o, rm*0.38, -1.1, 1.1); ctx.stroke();
      });
    }
  });

  ctx.restore();
}

/* ═══════════════════════════════════════════════
   CAVALLO VISTO DALL'ALTO — disegno realistico e animato
   Corpo centrale (col fantino sopra), collo con criniera,
   testa con orecchie, coda. Il tutto animato in base alla fase di
   galoppo (legata alla distanza percorsa, non al tempo assoluto:
   così un cavallo più veloce "corre" visivamente più veloce).
   x,y  = posizione del centro del cavallo sulla pista (coord. canvas)
   r    = raggio di riferimento (stessa unità usata per il fantino)
   nomeCon = nome della contrada (colori del fantino)
   angolo  = direzione di marcia in radianti (atan2, coerente col canvas)
   fase    = fase di galoppo continua (radianti), cresce con la distanza
   palette = { chiaro, medio, scuro, colloA, colloB, testaA, testaB }
             tonalità derivate dal colore/mantello del cavallo preso dal
             database esterno (CAVALLI_DB); se assente si usa il bruno
             di default (retrocompatibilità con dati senza colore)
═══════════════════════════════════════════════ */

// Colore di mantello di default (usato se il cavallo non ha un colore nel DB)
const PALETTE_CAVALLO_DEFAULT = {
  chiaro: '#8a5a34', medio: '#6b4222', scuro: '#4a2c14',
  colloA: '#6b4222', colloB: '#7a4d28',
  testaA: '#7a4d28', testaB: '#4a2c14'
};

/* Estrae la stringa colore/mantello di un cavallo dal database esterno,
   provando i possibili nomi di campo usati in cavalli_db.js */
function estraiColoreCavalloDB(cav) {
  if (!cav) return null;
  const candidati = [cav.colore, cav.color, cav.mantello, cav.colorePelo, cav.coloreManto, cav.colorMantello];
  const trovato = candidati.find(v => typeof v === 'string' && v.trim().length > 0);
  return trovato ? trovato.trim() : null;
}

/* Normalizza una qualsiasi stringa colore CSS valida (nome, hex, rgb...)
   nell'equivalente esadecimale, usando un canvas 1x1 come "interprete"
   ufficiale dei colori del browser. Ritorna null se il colore non è valido. */
function normalizzaColoreHex(colorStr) {
  if (!colorStr) return null;
  try {
    if (!window._coloreProbeCanvas) {
      window._coloreProbeCanvas = document.createElement('canvas');
      window._coloreProbeCanvas.width = 1;
      window._coloreProbeCanvas.height = 1;
    }
    const cx = window._coloreProbeCanvas.getContext('2d');
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = '#000000';
    cx.fillStyle = colorStr; // se non valido, il browser ignora l'assegnazione
    const provaFill = cx.fillStyle;
    cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data;
    if (provaFill === '#000000' && colorStr.toLowerCase() !== 'black' && colorStr.toLowerCase() !== '#000' && colorStr.toLowerCase() !== '#000000') {
      return null; // colore non riconosciuto dal browser
    }
    return '#' + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return null;
  }
}

/* Schiarisce (percent > 0) o scurisce (percent < 0) un colore esadecimale */
function sfumaColoreHex(hex, percent) {
  const num = parseInt(hex.slice(1), 16);
  let r = (num >> 16) & 0xff, g = (num >> 8) & 0xff, b = num & 0xff;
  const amt = Math.round(2.55 * percent);
  r = Math.min(255, Math.max(0, r + amt));
  g = Math.min(255, Math.max(0, g + amt));
  b = Math.min(255, Math.max(0, b + amt));
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

/* Costruisce la palette di tonalità (corpo/collo/testa) a partire dal
   colore grezzo del cavallo preso dal database. Se il colore manca o non
   è valido, ricade sulla palette bruna di default. */
function costruisciPaletteCavallo(colorStrGrezzo) {
  const hex = normalizzaColoreHex(colorStrGrezzo);
  if (!hex) return PALETTE_CAVALLO_DEFAULT;
  return {
    chiaro: sfumaColoreHex(hex, 20),
    medio:  hex,
    scuro:  sfumaColoreHex(hex, -32),
    colloA: sfumaColoreHex(hex, -6),
    colloB: sfumaColoreHex(hex, 10),
    testaA: sfumaColoreHex(hex, 10),
    testaB: sfumaColoreHex(hex, -32)
  };
}

/* Restituisce l'elenco dei colori (2-3, senza duplicati) di una contrada,
   usato per la fascetta sul capo del cavallo */
function coloriFasciaContrada(nomeCon) {
  let def = COLORI_CONTRADE[nomeCon];
  if (!def) {
    const k = Object.keys(COLORI_CONTRADE).find(k => nomeCon && nomeCon.toLowerCase().includes(k.toLowerCase()));
    def = k ? COLORI_CONTRADE[k] : null;
  }
  if (!def) return null;
  let cols = [];
  if (def.tipo === 'cerchi')        cols = [def.sfondo, ...def.cerchi.map(c => c.col)];
  else if (def.tipo === 'quadrantie') cols = [def.q1, def.q2, def.centro ? def.centro.col : null];
  else if (def.tipo === 'istrice')  cols = [def.sfondo, ...def.raggi];
  cols = cols.filter(Boolean).filter((c, i, a) => a.indexOf(c) === i);
  return cols.slice(0, 3);
}

function disegnaCavalloPalio(ctx, x, y, r, nomeCon, angolo, fase, palette, opz) {
  const pal = palette || PALETTE_CAVALLO_DEFAULT;
  // opz (facoltativo) = { scosso:true, vivacita, sfas }: cavallo SCOSSO, cioè senza
  // fantino. Niente fantino né mani; la redine (un'unica linea) scavalca il collo con un'ansa
  // lenta che ondeggia; la testa si scuote di più (vivacita = 1 normale).
  const scosso = !!(opz && opz.scosso);
  const viv = scosso ? ((opz.vivacita) || 1) : 1;
  // opz.vittoria (facoltativo) = { w }: il fantino festeggia col nerbo alzato (vedi statoVittoria)
  const vittoria = (!scosso && opz && opz.vittoria) ? opz.vittoria : null;
  // opz.sorpasso (facoltativo) = { w }: il fantino frusta a destra il rivale che sorpassa (vedi statoSorpasso)
  const sorpasso = (!scosso && !vittoria && opz && opz.sorpasso) ? opz.sorpasso : null;
  // opz.afferra (facoltativo) = { w }: il fantino strattona per la giubba, con la sinistra, il rivale che sorpassa a sinistra (vedi statoAfferra)
  const afferra = (!scosso && !vittoria && !sorpasso && opz && opz.afferra) ? opz.afferra : null;
  const corpoL = r * 3.90;  // lunghezza corpo centrale (più allungato, come nella foto di riferimento)
  const corpoW = r * 1.95;  // larghezza corpo centrale (snello; il fantino resta a coprirne la larghezza)
  const colloL = r * 1.15;  // collo leggermente allungato
  const testaL = r * 1.45;  // testa più allungata (muso più definito)
  const codaL  = r * 0.85;  // coda ancora più corta

  // Falcata: due gruppi di zampe in fase opposta (anteriori/posteriori)
  const fA = fase;
  const fP = fase + Math.PI;
  // Leggero "sobbalzo" della falcata (variazione di scala longitudinale,
  // poiché la vista è dall'alto e non possiamo mostrare il salto verticale)
  const sobbalzo = Math.sin(fase * 2) * 0.05;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angolo);

  // ── Ombra portata a terra (dà rilievo, corpo "sollevato" sulle zampe) ──
  ctx.beginPath();
  ctx.ellipse(r*0.15, r*0.28, corpoL*0.50, corpoW*0.48, 0, 0, Math.PI*2);
  ctx.fillStyle = 'rgba(0,0,0,.30)';
  ctx.fill();

  // ── Zampe: sottili e affusolate, a due segmenti (attacco → ginocchio/garretto
  // → zoccolo), che si muovono SOLO nel senso di marcia (avanti-indietro), vicine
  // al corpo come in un cavallo visto dall'alto in galoppo (niente aperture
  // laterali). Fase del ciclo φ:
  //   s = sin φ → posizione dello zoccolo lungo il cavallo (+ avanti, − indietro)
  //   cos φ > 0 → zampa che si porta in avanti (sollevata, piegata: lo zoccolo
  //               "segue" il ginocchio e si accorcia la proiezione)
  //   cos φ < 0 → zampa a terra che spinge indietro (quasi dritta)
  // Anteriori: piantate davanti, sporgono ai lati del collo. Posteriori: spinta
  // più lunga verso la coda. ──
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const disegnaZampa = (baseX, baseY, faseZampa, anteriore) => {
    const segno = Math.sign(baseY);
    const s  = Math.sin(faseZampa);
    const ds = Math.cos(faseZampa);                 // >0 mentre la zampa va avanti
    const sollevata = Math.max(0, ds);              // 0 … 1: quanto è piegata/sollevata
    const portata = anteriore ? r*1.20 : r*1.30;    // escursione massima dello zoccolo
    const bias = anteriore ? r*0.30 : -r*0.22;      // l'escursione è spostata avanti/indietro
    const zoccoloX = baseX + bias + portata*s*(1 - 0.20*sollevata);
    const ginocchioX = baseX + bias*0.6 + portata*s*0.55 + r*0.48*ds*(anteriore ? 1 : -0.7);
    const zoccoloY = baseY - segno*r*0.04;                       // leggermente verso l'asse
    const ginocchioY = baseY + segno*r*0.03;

    const wBase  = r*(anteriore ? 0.50 : 0.56);     // spalla/anca
    const wMed   = r*0.30;                          // ginocchio/garretto
    const wPunta = r*0.19;                          // nodello

    ctx.beginPath();
    ctx.moveTo(baseX, baseY - wBase*0.5);
    ctx.quadraticCurveTo(ginocchioX, ginocchioY - wMed*0.5, zoccoloX, zoccoloY - wPunta*0.5);
    ctx.lineTo(zoccoloX, zoccoloY + wPunta*0.5);
    ctx.quadraticCurveTo(ginocchioX, ginocchioY + wMed*0.5, baseX, baseY + wBase*0.5);
    ctx.closePath();
    // Zampe dello stesso colore del mantello; gli zoccoli restano neri
    ctx.fillStyle = pal.medio;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.38)'; ctx.lineWidth = Math.max(0.4, r*0.03); ctx.stroke();

    // Zoccolo: capsula scura orientata come la parte bassa della zampa
    const ang = Math.atan2(zoccoloY - ginocchioY, zoccoloX - ginocchioX);
    ctx.beginPath();
    ctx.ellipse(zoccoloX, zoccoloY, r*0.22, r*0.15, ang, 0, Math.PI*2);
    ctx.fillStyle = '#120a05';
    ctx.fill();
  };
  // Posteriori (vicino alla coda), poi anteriori (vicino al collo)
  // Attacchi: anca a ~-0.32 L e spalla a ~+0.30 L, ben dentro la larghezza del
  // corpo (±0.21 W le posteriori, ±0.23 W le anteriori): le zampe non escono mai
  // di lato, spuntano solo oltre le estremità (davanti ai lati del collo, dietro verso la coda)
  disegnaZampa(-corpoL*0.32,  corpoW*0.21, fP,        false);
  disegnaZampa(-corpoL*0.32, -corpoW*0.21, fP + 0.45, false);
  disegnaZampa( corpoL*0.30,  corpoW*0.23, fA,        true);
  disegnaZampa( corpoL*0.30, -corpoW*0.23, fA + 0.45, true);

  // ── Coda: corta e folta, oscilla lateralmente seguendo il movimento del corpo ──
  const codaOsc = Math.sin(fase * 0.55) * r * 0.45;
  ctx.beginPath();
  ctx.moveTo(-corpoL*0.48, 0);
  ctx.quadraticCurveTo(-corpoL*0.48 - codaL*0.55, codaOsc*0.55, -corpoL*0.48 - codaL, codaOsc);
  ctx.strokeStyle = '#1e130a';
  ctx.lineWidth = Math.max(2.0, r*0.62);
  ctx.stroke();
  // Ciuffo finale della coda (folto)
  ctx.beginPath();
  ctx.arc(-corpoL*0.48 - codaL, codaOsc, r*0.32, 0, Math.PI*2);
  ctx.fillStyle = '#1e130a';
  ctx.fill();

  // ── Corpo centrale: leggera "respirazione" muscolare ──
  // Sagoma a "superellisse" con semiasse x/y diversi: la parte anteriore resta
  // ellittica (si raccorda al collo), la parte posteriore (groppa) è più piena,
  // larga e smussata, con curva arrotondata invece della punta dell'ellisse.
  const flexCorpo = 1 + sobbalzo;
  const semiL = corpoL*0.5*flexCorpo, semiW = corpoW*0.5;
  const nAnt = 2.0;      // fronte: ellisse normale
  const nPost = 3.0;     // groppa: più "piena" e smussata (più alto = più squadrata)
  ctx.beginPath();
  const nPunti = 72;
  for (let i = 0; i <= nPunti; i++) {
    const t = -Math.PI/2 + (i/nPunti)*Math.PI*2;   // da -90° a 270°
    const c = Math.cos(t), sn = Math.sin(t);
    const n = c >= 0 ? nAnt : nPost;
    const px = semiL * Math.sign(c) * Math.pow(Math.abs(c), 2/n);
    const py = semiW * Math.sign(sn) * Math.pow(Math.abs(sn), 2/n);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  const gradCorpo = ctx.createLinearGradient(0, -corpoW*0.5, 0, corpoW*0.5);
  gradCorpo.addColorStop(0,   pal.chiaro);
  gradCorpo.addColorStop(0.5, pal.medio);
  gradCorpo.addColorStop(1,   pal.scuro);
  ctx.fillStyle = gradCorpo;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.40)'; ctx.lineWidth = 0.7; ctx.stroke();

  // ── Collo: si protende in avanti con una leggera ondulazione ──
  // Base del collo spostata più dentro il corpo per una giunzione morbida e continua
  const oscCollo = Math.sin(fase * 0.55 + Math.PI/4) * r * 0.30 * (scosso ? 1.6*viv : 1);
  const colloBaseX = corpoL*0.35;   // collo spostato più avanti
  const colloPuntaX = colloBaseX + colloL;
  const colloPuntaY = oscCollo * 0.45;

  // Raccordo morbido collo-corpo: la forma del collo non cambia, ma alla base
  // colore e contorno sfumano da trasparente a pieno (si vede il corpo sotto),
  // e il lato di chiusura alla base non viene più contornato: niente "stacco".
  const hexRgba = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  };
  const colloX0 = colloBaseX - r*0.3;
  const colloSfuma = (r*0.3 + colloL*0.45) / (colloPuntaX - colloX0);  // tratto di dissolvenza
  const tracciaCollo = () => {
    ctx.beginPath();
    ctx.moveTo(colloX0, -corpoW*0.30);
    ctx.quadraticCurveTo(colloBaseX + colloL*0.5, -r*0.15 + oscCollo, colloPuntaX, colloPuntaY - r*0.55);
    ctx.lineTo(colloPuntaX, colloPuntaY + r*0.55);
    ctx.quadraticCurveTo(colloBaseX + colloL*0.5, r*0.15 + oscCollo, colloX0, corpoW*0.30);
    ctx.closePath();
  };
  tracciaCollo();
  const gradCollo = ctx.createLinearGradient(colloX0, 0, colloPuntaX, 0);
  gradCollo.addColorStop(0, hexRgba(pal.colloA, 0));
  gradCollo.addColorStop(colloSfuma, pal.colloA);
  gradCollo.addColorStop(1, pal.colloB);
  ctx.fillStyle = gradCollo;
  ctx.fill();
  // contorno solo sui due lati lunghi (non sul lato di base), sfumato alla base
  const gradContorno = ctx.createLinearGradient(colloX0, 0, colloPuntaX, 0);
  gradContorno.addColorStop(0, 'rgba(0,0,0,0)');
  gradContorno.addColorStop(colloSfuma, 'rgba(0,0,0,.40)');
  gradContorno.addColorStop(1, 'rgba(0,0,0,.40)');
  ctx.strokeStyle = gradContorno; ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(colloX0, -corpoW*0.30);
  ctx.quadraticCurveTo(colloBaseX + colloL*0.5, -r*0.15 + oscCollo, colloPuntaX, colloPuntaY - r*0.55);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(colloX0, corpoW*0.30);
  ctx.quadraticCurveTo(colloBaseX + colloL*0.5, r*0.15 + oscCollo, colloPuntaX, colloPuntaY + r*0.55);
  ctx.stroke();

  // Criniera: banda continua e uniforme che corre centrata sulla linea
  // dorsale del collo (non più spostata lateralmente su un solo lato),
  // simmetrica rispetto all'asse del collo, con bordo morbido e
  // oscillazione leggera e regolare
  // La criniera parte appena oltre lo zucchino del fantino e arriva fino alla testa
  const nCrin = 14;
  const crinX0 = r*1.25;  // inizio criniera: oltre lo zucchino del fantino (non più fin sotto di lui)
  const centroCrin = [];
  const bordoSupCrin = [];
  const bordoInfCrin = [];
  for (let i = 0; i <= nCrin; i++) {
    const u = i / nCrin;
    const cx = crinX0 + (colloPuntaX - crinX0) * u;
    const t = Math.max(0, (cx - colloBaseX) / (colloPuntaX - colloBaseX)); // 0 sul corpo, 0→1 lungo il collo
    const cy = oscCollo * t * 0.8; // centrata sull'asse del collo
    const sventola = Math.sin(fase * 1.2 + u * 2.4) * r * 0.08; // ondulazione più regolare
    const spessore = r * 0.34 * (1 - t * 0.30) * (0.45 + 0.55*Math.min(1, u*5)); // si assottiglia verso la testa e si smorza all'inizio
    centroCrin.push({ x: cx, y: cy });
    bordoSupCrin.push({ x: cx + sventola*0.25, y: cy - spessore + sventola });
    bordoInfCrin.push({ x: cx + sventola*0.25, y: cy + spessore + sventola });
  }
  ctx.beginPath();
  ctx.moveTo(bordoSupCrin[0].x, bordoSupCrin[0].y);
  for (let i = 1; i < bordoSupCrin.length; i++) {
    const p0 = bordoSupCrin[i-1], p1 = bordoSupCrin[i];
    ctx.quadraticCurveTo(p0.x, p0.y, (p0.x+p1.x)/2, (p0.y+p1.y)/2);
  }
  ctx.lineTo(bordoSupCrin[bordoSupCrin.length-1].x, bordoSupCrin[bordoSupCrin.length-1].y);
  ctx.lineTo(bordoInfCrin[bordoInfCrin.length-1].x, bordoInfCrin[bordoInfCrin.length-1].y);
  for (let i = bordoInfCrin.length - 2; i >= 0; i--) {
    const p0 = bordoInfCrin[i+1], p1 = bordoInfCrin[i];
    ctx.quadraticCurveTo(p0.x, p0.y, (p0.x+p1.x)/2, (p0.y+p1.y)/2);
  }
  ctx.lineTo(bordoInfCrin[0].x, bordoInfCrin[0].y);
  ctx.closePath();
  const gradCrin = ctx.createLinearGradient(crinX0, 0, colloPuntaX, 0);
  gradCrin.addColorStop(0, '#241509');
  gradCrin.addColorStop(1, '#160d06');
  ctx.fillStyle = gradCrin;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.30)'; ctx.lineWidth = 0.6; ctx.stroke();

  // ── Testa: forma quasi trapezoidale vista dall'alto ──
  // Larga e "cicciotta" all'altezza di nuca/guance/occhi, poi si assottiglia
  // verso il muso, che termina con un fronte piatto (lo spazio tra le due
  // narici resta alla stessa altezza delle narici, non rientra). Sovrapposta
  // al collo per un attacco morbido.
  const testaBaseX = colloPuntaX - testaL*0.30;
  const testaBaseY = colloPuntaY;
  const testaPuntaX = testaBaseX + testaL;
  const bx = testaBaseX, by = testaBaseY, L = testaL;
  const muX = bx + L*1.05;           // fronte piatto del muso (livello delle narici)
  const muHW = r*0.27;               // semi-larghezza del muso
  const muR = r*0.09;                // raggio degli angoli del muso
  const narRx = r*0.12, narRy = r*0.11;
  const narY = r*0.15;               // distanza delle narici dall'asse

  const tracciaTesta = () => {
    ctx.beginPath();
    ctx.moveTo(bx, by - r*0.46);
    // nuca → guancia piena (punto più largo, zona occhi)
    ctx.bezierCurveTo(bx + L*0.10, by - r*0.56, bx + L*0.24, by - r*0.60, bx + L*0.36, by - r*0.54);
    // guancia → restringimento verso il muso
    ctx.bezierCurveTo(bx + L*0.52, by - r*0.46, bx + L*0.66, by - r*0.33, bx + L*0.82, by - muHW);
    // muso con fronte piatto e angoli arrotondati
    ctx.lineTo(muX - muR, by - muHW);
    ctx.quadraticCurveTo(muX, by - muHW, muX, by - muHW + muR);
    ctx.lineTo(muX, by + muHW - muR);
    ctx.quadraticCurveTo(muX, by + muHW, muX - muR, by + muHW);
    ctx.lineTo(bx + L*0.82, by + muHW);
    ctx.bezierCurveTo(bx + L*0.66, by + r*0.33, bx + L*0.52, by + r*0.46, bx + L*0.36, by + r*0.54);
    ctx.bezierCurveTo(bx + L*0.24, by + r*0.60, bx + L*0.10, by + r*0.56, bx, by + r*0.46);
    ctx.quadraticCurveTo(bx - r*0.08, by, bx, by - r*0.46); // nuca leggermente arrotondata
    ctx.closePath();
  };
  tracciaTesta();
  const gradTesta = ctx.createLinearGradient(bx, 0, muX, 0);
  gradTesta.addColorStop(0, pal.testaA);
  gradTesta.addColorStop(1, pal.testaB);
  ctx.fillStyle = gradTesta;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.40)'; ctx.lineWidth = 0.7; ctx.stroke();

  // Geometria della fascetta (condivisa con la capezza, che passa subito sotto il cerchio)
  const fX0 = testaBaseX - testaL*0.24;  // inizio: sulla criniera, dietro le orecchie
  const fL  = testaL*0.52;               // lunghezza della striscia
  const fHW = r*0.15;                    // semi-larghezza della striscia
  const cerX = fX0 + fL;                 // centro del cerchio finale (lato muso)
  const cerR = r*0.18;                   // raggio del cerchio finale

  // ── Capezza: 4 strisce nel colore della contrada, che seguono la testa ──
  //  • una trasversale da guancia a guancia, che passa per il centro del cerchio della fascetta
  //    (la fascetta è disegnata dopo, quindi il cerchio la copre: la striscia sta sotto)
  //  • una trasversale sul muso, appena prima della zona delle narici
  //  • due laterali che seguono il bordo del viso e collegano le due trasversali
  // Tutto è espresso rispetto alla testa (bx, by): segue quindi il movimento del muso.
  const colCapezza = coloreCapezzaContrada(nomeCon);
  const wS = Math.max(0.8, r*0.075);                 // spessore delle strisce
  const capX1 = cerX;                                // passa per il centro del cerchio (la fascetta sta sopra)
  const capX2 = muX - narRx*2.05 - wS*1.0;           // appena prima delle narici
  // Semi-larghezza della testa (dall'asse al bordo) alla posizione xAbs, risolvendo
  // le curve del contorno (nuca→guancia e guancia→muso)
  const bordoHW = (xAbs) => {
    const Q = (xAbs < bx + L*0.36)
      ? [[bx, by - r*0.46], [bx + L*0.10, by - r*0.56], [bx + L*0.24, by - r*0.60], [bx + L*0.36, by - r*0.54]]
      : [[bx + L*0.36, by - r*0.54], [bx + L*0.52, by - r*0.46], [bx + L*0.66, by - r*0.33], [bx + L*0.82, by - muHW]];
    const bez = (t, k) => { const u = 1 - t;
      return u*u*u*Q[0][k] + 3*u*u*t*Q[1][k] + 3*u*t*t*Q[2][k] + t*t*t*Q[3][k]; };
    let t0 = 0, t1 = 1;
    for (let i = 0; i < 24; i++) { const tm = (t0 + t1)/2; if (bez(tm, 0) < xAbs) t0 = tm; else t1 = tm; }
    return by - bez((t0 + t1)/2, 1);
  };

  // Occhi: due semicerchi scuri (uguali per tutti i cavalli, a prescindere dal
  // mantello) DENTRO la testa, con il lato piatto sulla linea interna della
  // striscia laterale della capezza. Si disegnano PRIMA delle strisce: un cerchio
  // centrato su quella linea, tagliato con la sagoma della testa; la metà esterna
  // finisce sotto la striscia laterale e resta visibile solo il semicerchio interno.
  const occhioX = bx + L*0.46;
  const occhioRad = r*0.115;
  const occhioCY = bordoHW(occhioX) - wS;           // linea interna della capezza
  ctx.save();
  tracciaTesta();
  ctx.clip();
  [1, -1].forEach(lato => {
    const cy = by + lato*occhioCY;
    const gradOcchio = ctx.createRadialGradient(
      occhioX - occhioRad*0.2, cy - lato*occhioRad*0.45, occhioRad*0.05,
      occhioX, cy - lato*occhioRad*0.2, occhioRad*1.05);
    gradOcchio.addColorStop(0, '#3a2a22');
    gradOcchio.addColorStop(1, '#070403');
    ctx.beginPath();
    ctx.arc(occhioX, cy, occhioRad, 0, Math.PI*2);
    ctx.fillStyle = gradOcchio;
    ctx.fill();
    // piccolo riflesso di luce
    ctx.beginPath();
    ctx.arc(occhioX - occhioRad*0.28, cy - lato*occhioRad*0.5, occhioRad*0.16, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,.35)';
    ctx.fill();
  });
  ctx.restore();

  const disegnaCinghie = (extra, colore) => {
    ctx.save();
    tracciaTesta(); ctx.clip();                      // le strisce restano dentro il viso
    ctx.fillStyle = colore;
    [capX1, capX2].forEach(cx => ctx.fillRect(cx - wS/2 - extra, by - r, wS + 2*extra, r*2));
    ctx.save();
    ctx.beginPath(); ctx.rect(capX1 - wS/2 - extra, by - r, (capX2 - capX1) + wS + 2*extra, r*2); ctx.clip();
    tracciaTesta();                                  // laterali = bordo del viso (metà interna del tratto)
    ctx.strokeStyle = colore; ctx.lineWidth = (wS + extra)*2; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.restore();
    ctx.restore();
  };
  disegnaCinghie(wS*0.35, 'rgba(0,0,0,.35)');        // leggero contorno scuro
  disegnaCinghie(0, colCapezza);

  // ── Redini: semiovale come prima. Partono dalle due intersezioni (trasversale sul
  // muso + laterali), corrono sulle strisce laterali della capezza (stesso colore,
  // quindi si fondono con esse), passano per le MANI del fantino
  // (posizioniManiFantino) e proseguono tra mano e mano sul collo del cavallo,
  // chiudendosi ad arco verso il fantino. Seguono il movimento delle braccia. ──
  if (scosso) {
    // Cavallo scosso: le redini sono UNA SOLA linea continua, come nel cavallo col
    // fantino (stessa partenza dalle due intersezioni della capezza e stesse strisce
    // laterali), ma senza mani: dai due lati del collo la redine scavalca il collo
    // con un'ansa lenta che pende all'indietro verso il garrese e ondeggia da un lato
    // all'altro (sinistra-destra) col ritmo della falcata.
    const hwE = bordoHW(capX1) - wS*0.55;                // centro della striscia laterale in capX1
    const xAtt = capX2, hwAtt = muHW - wS*0.5;
    const sfas = (opz && opz.sfas) || 0;
    const xc = r*1.75 + Math.sin(fase*1.1 + sfas)*r*0.12;       // dove la redine scende sui fianchi del collo
    const hwC = r*0.50;                                          // semi-larghezza del collo in quel punto
    const aL = { x: xc, y: by - hwC }, aR = { x: xc, y: by + hwC };
    const lasco = Math.sin(fase*0.55 + 0.8)*r*0.06;
    const arco  = r*0.70*(1 + 0.20*Math.sin(fase*1.7 + sfas))*viv;   // quanto l'ansa pende all'indietro
    const oscill = Math.sin(fase*1.3 + sfas)*r*0.35*viv;             // ondeggia da un lato all'altro
    ctx.beginPath();
    ctx.moveTo(xAtt, by - hwAtt);
    ctx.lineTo(capX1, by - hwE);
    ctx.quadraticCurveTo((capX1 + aL.x)/2, (by - hwE + aL.y)/2 - lasco, aL.x, aL.y);              // sul lato sinistro del collo
    ctx.bezierCurveTo(aL.x - arco*1.3, aL.y + oscill, aR.x - arco*1.3, aR.y + oscill, aR.x, aR.y); // ansa sopra il collo
    ctx.quadraticCurveTo((capX1 + aR.x)/2, (by + hwE + aR.y)/2 + lasco, capX1, by + hwE);          // sul lato destro del collo
    ctx.lineTo(xAtt, by + hwAtt);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = Math.max(1, r*0.07) + 1.0; ctx.stroke();
    ctx.strokeStyle = colCapezza;        ctx.lineWidth = Math.max(0.8, r*0.07);       ctx.stroke();
  } else {
    const hwE = bordoHW(capX1) - wS*0.55;                // centro della striscia laterale in capX1
    const xAtt = capX2, hwAtt = muHW - wS*0.5;
    const mani = posizioniManiFantino(r, fase);
    const stAff = afferra ? statoAfferra(r, fase, nomeCon, afferra.w == null ? 1 : afferra.w) : null;
    const wN = afferra ? 0 : vittoria ? Math.max(statoNerbo(fase, nomeCon).w, vittoria.w == null ? 1 : vittoria.w)
             : sorpasso ? Math.max(statoNerbo(fase, nomeCon).w, statoSorpasso(r, fase, nomeCon, sorpasso.w == null ? 1 : sorpasso.w).e)
             : statoNerbo(fase, nomeCon).w;                       // durante le nerbate la mano destra lascia la redine:
    // (afferra: la sinistra lascia le redini, che restano raccolte nella sola mano destra)
    const mL = stAff ? { x: mani.sx.x + (mani.dx.x + r*0.05 - mani.sx.x)*stAff.lascia,
                         y: mani.sx.y + (mani.dx.y - r*0.14 - mani.sx.y)*stAff.lascia }
                     : mani.sx;                          // le redini restano raccolte nella sola mano sinistra
    const mR = { x: mani.dx.x + (mani.sx.x + r*0.05 - mani.dx.x)*wN,
                 y: mani.dx.y + (mani.sx.y + r*0.14 - mani.dx.y)*wN };
    const lasco = Math.sin(fase*0.55 + 0.8)*r*0.06;      // la redine non è mai perfettamente tesa
    const arco  = r*0.30*(1 + 0.15*Math.sin(fase*1.3));  // quanto l'arco tra le mani rientra verso il fantino
    ctx.beginPath();
    ctx.moveTo(xAtt, by - hwAtt);                        // intersezione trasversale-naso / laterale sinistra
    ctx.lineTo(capX1, by - hwE);                         // lungo la striscia laterale
    ctx.quadraticCurveTo((capX1 + mL.x)/2, (by - hwE + mL.y)/2 - lasco, mL.x, mL.y);     // fino alla mano sinistra
    ctx.bezierCurveTo(mL.x - arco*1.3, mL.y*1.15, mR.x - arco*1.3, mR.y*1.15, mR.x, mR.y); // arco tra le due mani
    ctx.quadraticCurveTo((capX1 + mR.x)/2, (by + hwE + mR.y)/2 + lasco, capX1, by + hwE); // dalla mano destra alla striscia laterale
    ctx.lineTo(xAtt, by + hwAtt);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = Math.max(1, r*0.07) + 1.0; ctx.stroke();
    ctx.strokeStyle = colCapezza;        ctx.lineWidth = Math.max(0.8, r*0.07);       ctx.stroke();
  }

  // Narici: due protuberanze ovali sul fronte del muso, a filo del bordo
  // (il fronte resta piatto anche tra le due narici)
  [1, -1].forEach(lato => {
    const cx = muX - narRx*1.05, cy = by + lato*narY;
    ctx.beginPath();
    ctx.ellipse(cx, cy, narRx, narRy, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,.14)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.30)'; ctx.lineWidth = Math.max(0.5, r*0.035); ctx.stroke();
  });

  // Fascetta sul capo coi colori della contrada: striscia sottile che corre
  // lungo la fronte, al centro della testa tra le due orecchie, partendo da un
  // po' di criniera. Dal lato del muso termina con un piccolo cerchio (rosetta)
  // coi colori della contrada: fascetta e cerchio sono un unico elemento, con
  // un solo contorno esterno (nessuna linea nel punto di giunzione).
  const schemaFascia = schemaFasciaContrada(nomeCon);
  if (schemaFascia) {
    const fR  = fHW*0.9;
    const lwF  = Math.max(0.5, r*0.04);    // spessore contorno
    const tracciaStriscia = () => {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(fX0, testaBaseY - fHW, fL, fHW*2, fR);
      else ctx.rect(fX0, testaBaseY - fHW, fL, fHW*2);
    };
    // 1) contorno unico: si traccia (doppio spessore) il perimetro di striscia e
    //    cerchio, poi i riempimenti coprono la metà interna, giunzione compresa
    ctx.strokeStyle = 'rgba(0,0,0,.45)';
    ctx.lineWidth = lwF*2;
    tracciaStriscia(); ctx.stroke();
    ctx.beginPath(); ctx.arc(cerX, testaBaseY, cerR, 0, Math.PI*2); ctx.stroke();
    // 2) strisce coi colori della contrada: linee parallele all'asse del cavallo
    //    (muso → posteriore), affiancate da un lato all'altro della fascetta
    ctx.save();
    tracciaStriscia();
    ctx.clip();
    const lenV = fL - cerR*0.8;                 // parte non coperta dal cerchio
    const pesoTot = schemaFascia.segmenti.reduce((t, sg) => t + sg[1], 0);
    let ys = testaBaseY - fHW;
    schemaFascia.segmenti.forEach((sg, i) => {
      const ultimo = (i === schemaFascia.segmenti.length - 1);
      const h = ultimo ? (testaBaseY + fHW - ys) : (fHW*2 * sg[1] / pesoTot);
      ctx.fillStyle = sg[0];
      ctx.fillRect(fX0, ys, fL, h + (ultimo ? 0 : 0.4));
      ys += h;
    });
    // striscia obliqua (es. Tartuca: base gialla con diagonale blu)
    if (schemaFascia.obliqua) {
      const wO = lenV*0.30, shift = fHW*1.6;
      const aO = fX0 + lenV*0.5 - wO/2 - shift/2;
      ctx.beginPath();
      ctx.moveTo(aO, testaBaseY - fHW);
      ctx.lineTo(aO + wO, testaBaseY - fHW);
      ctx.lineTo(aO + wO + shift, testaBaseY + fHW);
      ctx.lineTo(aO + shift, testaBaseY + fHW);
      ctx.closePath();
      ctx.fillStyle = schemaFascia.obliqua;
      ctx.fill();
    }
    ctx.restore();
    // 3) cerchio finale coi colori della contrada (senza bordo proprio)
    disegnaPallinoPalio(ctx, cerX, testaBaseY, cerR, nomeCon, true);
  }

  // Orecchie: forma a "petalo" morbida e simmetrica, base solida e punta
  // arrotondata (non più spigolosa/a triangolo), con leggera ombreggiatura
  // interna che dà volume; ben piantate sulla nuca, in leggero movimento
  const orecchioMov = Math.sin(fase * 1.6) * 0.07;
  const orBaseX = testaBaseX + testaL*0.07;
  [1, -1].forEach(lato => {
    const baseY = testaBaseY + lato*r*0.28;
    const tipX  = orBaseX + testaL*0.06;
    const tipY  = testaBaseY + lato*(r*0.90 + orecchioMov*r);
    const outX  = orBaseX - testaL*0.05;   // controllo bordo esterno (dorso dell'orecchio)
    const outY  = testaBaseY + lato*r*0.64;
    const inX   = orBaseX + testaL*0.13;   // controllo bordo interno (pancia dell'orecchio)
    const inY   = testaBaseY + lato*r*0.48;

    ctx.beginPath();
    ctx.moveTo(orBaseX - testaL*0.02, baseY);
    ctx.quadraticCurveTo(outX, outY, tipX, tipY);
    ctx.quadraticCurveTo(inX, inY, orBaseX + testaL*0.09, baseY);
    ctx.closePath();
    const gradOr = ctx.createLinearGradient(orBaseX, testaBaseY, tipX, tipY);
    gradOr.addColorStop(0, '#4a2c14');
    gradOr.addColorStop(1, '#241509');
    ctx.fillStyle = gradOr;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = Math.max(0.4, r*0.03); ctx.stroke();

    // Interno orecchio: forma più piccola e sfumata, per dare profondità
    ctx.beginPath();
    ctx.moveTo(orBaseX + testaL*0.01, baseY - lato*r*0.02);
    ctx.quadraticCurveTo(orBaseX + testaL*0.005, testaBaseY + lato*r*0.52,
                          orBaseX + testaL*0.04, testaBaseY + lato*(r*0.70 + orecchioMov*r));
    ctx.quadraticCurveTo(orBaseX + testaL*0.085, testaBaseY + lato*r*0.52,
                          orBaseX + testaL*0.065, baseY - lato*r*0.02);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,0,0,.30)';
    ctx.fill();
  });

  // ── Il fantino (visto dall'alto), sopra il corpo: disegnato nello stesso sistema
  // di riferimento del cavallo, quindi ruota con lui e segue la fase del galoppo ──
  if (!scosso) disegnaFantinoPalio(ctx, r, nomeCon, fase, vittoria, sorpasso, afferra);

  ctx.restore();
}

/* ═══════════════════════════════════════════════
   CAVALLO SCOSSO — 17 animazioni, una per contrada
   Il cavallo corre al galoppo SENZA fantino (come nel Palio quando il fantino
   cade: il cavallo scosso, con la sola capezza e le redini penzoloni, può
   comunque vincere). Ogni contrada ha la propria animazione: stessa funzione di
   disegno del cavallo col fantino (disegnaCavalloPalio), ma con
     • fascetta sul capo e colore di capezza/redini della contrada,
     • galoppo sfasato (i 17 cavalli non battono mai il passo insieme),
     • "vivacità" propria: quanto scuote la testa e fa frustare le redini.
   Uso, dentro il ciclo di animazione (fase = fase continua del galoppo):
     ANIMAZIONI_CAVALLO_SCOSSO['Tartuca'].disegna(ctx, x, y, r, angolo, fase, palette);
   oppure, cercando per nome:
     disegnaCavalloScosso(ctx, x, y, r, 'Tartuca', angolo, fase, palette);
═══════════════════════════════════════════════ */
const ANIMAZIONI_CAVALLO_SCOSSO = {};
Object.keys(COLORI_CONTRADE).forEach((nome, i) => {
  const sfasamento = i * 0.9;                              // rad: galoppo non sincrono
  const vivacita   = 0.85 + ((i * 7) % 5) * 0.075;         // 0.85 … 1.15
  ANIMAZIONI_CAVALLO_SCOSSO[nome] = {
    nomeCon: nome, sfasamento, vivacita,
    disegna(ctx, x, y, r, angolo, fase, palette) {
      disegnaCavalloPalio(ctx, x, y, r, nome, angolo, fase + sfasamento, palette,
                          { scosso: true, vivacita, sfas: i * 1.3 });
    }
  };
});

function disegnaCavalloScosso(ctx, x, y, r, nomeCon, angolo, fase, palette) {
  let an = ANIMAZIONI_CAVALLO_SCOSSO[nomeCon];
  if (!an && nomeCon) {
    const k = Object.keys(ANIMAZIONI_CAVALLO_SCOSSO).find(k => nomeCon.toLowerCase().includes(k.toLowerCase()));
    an = k ? ANIMAZIONI_CAVALLO_SCOSSO[k] : null;
  }
  if (an) return an.disegna(ctx, x, y, r, angolo, fase, palette);
  disegnaCavalloPalio(ctx, x, y, r, nomeCon, angolo, fase, palette, { scosso: true });   // contrada non in tabella
}

/* Un cavallo "vivo" al canapo: non è mai fermo, oscilla di poco a destra e a
   sinistra e avanti e indietro rispetto alla propria posizione assegnata (con le
   zampe che scalpitano sul posto), ma l'angolo di marcia resta sempre lo stesso
   (testa rivolta verso il centro della pista): non si gira mai, e non supera
   mai il limite della barriera (c.limiteX). Riusa esattamente
   disegnaCavalloPalio, la stessa funzione della corsa vera, quindi anche lo
   fantino sopra il cavallo (disegnaFantinoPalio) è identico. */
function disegnaCavalloAlCanapo(ctx, c, t, r, paletteMap){
  const along = { x: Math.cos(c.angolo), y: Math.sin(c.angolo) };
  const perp  = { x: -Math.sin(c.angolo), y: Math.cos(c.angolo) };
  const lat  = Math.sin(t*c.fLat*Math.PI*2  + c.pLat)  * r*0.42; // destra-sinistra
  const lung = Math.sin(t*c.fLong*Math.PI*2 + c.pLong) * r*0.58; // avanti-indietro
  let x = c.x + along.x*lung + perp.x*lat;
  let y = c.y + along.y*lung + perp.y*lat;
  if (typeof c.limiteX === 'number' && x > c.limiteX) x = c.limiteX; // mai oltre la barriera
  const fase = t*2.4 + c.pGal; // zampe che scalpitano sul posto
  const palette = (c.nomeCon && paletteMap && paletteMap[c.nomeCon]) || null;
  disegnaCavalloPalio(ctx, x, y, r, c.nomeCon, c.angolo, fase, palette);
}

/* ═══════════════════════════════════════════════════════════
   CADUTA DEL FANTINO — 17 animazioni, una per contrada
   Riusa
   disegnaCavalloPalio (cavallo, anche in versione "scosso") e
   disegnaFantinoPalio (fantino visto dall'alto) e COLORI_CONTRADE.

   Sequenza di ogni animazione (t = secondi dall'inizio della caduta):
     t < 0            galoppo normale, cavallo COL fantino (disegnaCavalloPalio)
     0 … tSlip        "scivolo": il fantino perde l'equilibrio e si sbilancia di lato
                      (cavallo già scosso: le redini gli sfuggono di mano)
     … + tFly         "volo": fantino sbalzato via, ruota su se stesso, ombra staccata
     dopo l'atterraggio  "rotola": polvere, striscia sul terreno, rimbalzi, rotolata
     poi              "fermo": il fantino resta a terra; il cavallo prosegue SCOSSO
                      (più agitato nel primo secondo-due: scuote la testa, redini che frustano)

   Ogni contrada ha la PROPRIA caduta (CADUTA_FANTINO_CONTRADE): lato, direzione
   dello sbalzo (davanti / di fianco / dietro), forza, numero di giri in aria,
   rotolate a terra, attrito, rimbalzi, serpeggiamento.

   USO (dentro il ciclo di animazione; x,y,angolo,fase = quelli del cavallo, che
   continua a correre sulla pista come sempre — sei tu a muoverlo):
     // quando il fantino cade (una volta sola):
     const caduta = creaCadutaFantino('Tartuca', velocitaCavalloPxAlSecondo);
     const tInizio = tempoAttuale;
     // a ogni frame, al posto di disegnaCavalloPalio:
     const st = disegnaCadutaFantino(ctx, x, y, r, 'Tartuca', angolo, fase, palette,
                                     caduta, tempoAttuale - tInizio);
     // st = { stato:'galoppo'|'scivolo'|'volo'|'rotola'|'fermo', x, y, fermo }
     //   (x,y = posizione del fantino a terra, utile per ostacoli/ordine d'arrivo)
   oppure, per nome:
     ANIMAZIONI_CADUTA_FANTINO['Tartuca'].crea(v0);
     ANIMAZIONI_CADUTA_FANTINO['Tartuca'].disegna(ctx, x, y, r, angolo, fase, palette, caduta, t);

   Nota: per t < 0 (o caduta assente) la funzione disegna il cavallo col fantino,
   quindi puoi chiamarla SEMPRE al posto di disegnaCavalloPalio.
   Un oggetto "caduta" serve per UNA caduta: per ripeterla creane uno nuovo.
   ═══════════════════════════════════════════════════════════ */

/* Parametri di ogni caduta
   lato    +1 = cade a destra del cavallo (y locale positivo), -1 = a sinistra
   tSlip   durata dello sbilanciamento sul cavallo (s)
   ox, oy  dove arriva il fantino (in raggi r) quando si stacca: ox avanti(+)/indietro(−), oy verso il lato
   tilt    inclinazione (rad) raggiunta durante lo sbilanciamento
   dir     direzione dello sbalzo rispetto alla marcia: 0 = avanti, π/2 = di fianco, π = indietro
   vEj     velocità di sbalzo, come frazione della velocità del cavallo
   giri    giri completi su se stesso in aria
   tFly    durata del volo (s)
   rotola  giri completi a terra dopo l'atterraggio
   k2      attrito a terra (alto = si ferma subito)
   rimb    intensità dei rimbalzi all'impatto
   ond     serpeggiamento laterale mentre striscia (in r)                          */
const CADUTA_FANTINO_CONTRADE = {
  'Aquila':       { descr:'Scivolata laterale',                 lato: 1, tSlip:.40, ox:-.10, oy:1.00, tilt:.50, dir:1.45, vEj:.25, giri:.50, tFly:.45, rotola:.50, k2:3.2, rimb:1.0, ond:0   },
  'Bruco':        { descr:'Capitombolo in avanti sul collo',    lato:-1, tSlip:.35, ox: .95, oy:.25,  tilt:.30, dir:.60,  vEj:.55, giri:1.50, tFly:.55, rotola:1.00, k2:2.6, rimb:1.5, ond:0   },
  'Chiocciola':   { descr:'Sbalzato all\'indietro sulla groppa', lato: 1, tSlip:.30, ox:-1.25, oy:.20, tilt:.40, dir:2.90, vEj:.45, giri:1.00, tFly:.50, rotola:.75, k2:3.0, rimb:1.0, ond:0   },
  'Civetta':      { descr:'Caduta di fianco con avvitamento',   lato:-1, tSlip:.38, ox: .00, oy:1.05, tilt:.70, dir:1.20, vEj:.50, giri:2.00, tFly:.60, rotola:.25, k2:3.6, rimb:1.0, ond:0   },
  'Drago':        { descr:'Volo lungo e rotolata',              lato: 1, tSlip:.30, ox: .20, oy:.90,  tilt:.60, dir:.80,  vEj:.90, giri:1.50, tFly:.70, rotola:2.00, k2:2.0, rimb:2.0, ond:0   },
  'Giraffa':      { descr:'Scivolata lenta di lato',            lato:-1, tSlip:.60, ox:-.20, oy:1.10, tilt:.35, dir:1.55, vEj:.15, giri:.25, tFly:.35, rotola:.25, k2:4.5, rimb:.5,  ond:0   },
  'Istrice':      { descr:'Caduta all\'indietro con rimbalzo',  lato: 1, tSlip:.32, ox:-1.00, oy:.35, tilt:.45, dir:2.50, vEj:.60, giri:.75, tFly:.50, rotola:.50, k2:2.8, rimb:3.0, ond:0   },
  'Leocorno':     { descr:'Sbalzo in avanti a candela',         lato:-1, tSlip:.28, ox: 1.05, oy:.15, tilt:.25, dir:.50,  vEj:.75, giri:2.50, tFly:.65, rotola:1.50, k2:2.4, rimb:1.5, ond:0   },
  'Lupa':         { descr:'Caduta secca di fianco',             lato: 1, tSlip:.25, ox: .00, oy:1.05, tilt:.80, dir:1.57, vEj:.35, giri:.50, tFly:.30, rotola:0,   k2:6.0, rimb:.5,  ond:0   },
  'Nicchio':      { descr:'Scivola all\'indietro dopo l\'impennata', lato:-1, tSlip:.45, ox:-1.10, oy:.45, tilt:.55, dir:2.20, vEj:.40, giri:1.25, tFly:.50, rotola:1.00, k2:3.0, rimb:1.0, ond:0 },
  'Oca':          { descr:'Rotolata lunga',                     lato: 1, tSlip:.34, ox: .10, oy:.95,  tilt:.60, dir:1.00, vEj:.60, giri:1.00, tFly:.50, rotola:3.00, k2:1.6, rimb:1.0, ond:0   },
  'Onda':         { descr:'Scivolata serpeggiante',             lato:-1, tSlip:.40, ox:-.15, oy:1.00, tilt:.50, dir:1.35, vEj:.55, giri:.75, tFly:.45, rotola:.75, k2:1.8, rimb:1.0, ond:.55 },
  'Pantera':      { descr:'Salto felino con triplo avvitamento',lato: 1, tSlip:.26, ox: .40, oy:.80,  tilt:.30, dir:1.30, vEj:1.00, giri:3.00, tFly:.80, rotola:.50, k2:3.0, rimb:2.0, ond:0  },
  'Selva':        { descr:'Impatto e rimbalzi',                 lato:-1, tSlip:.36, ox:-.30, oy:1.00, tilt:.55, dir:1.80, vEj:.55, giri:1.00, tFly:.55, rotola:.50, k2:2.6, rimb:4.0, ond:0   },
  'Tartuca':      { descr:'Caduta lenta e pesante',             lato: 1, tSlip:.70, ox:-.10, oy:1.00, tilt:.30, dir:1.50, vEj:.20, giri:.25, tFly:.30, rotola:.25, k2:5.0, rimb:.5,  ond:0   },
  'Torre':        { descr:'Caduta all\'indietro, supino',       lato: 1, tSlip:.40, ox:-1.30, oy:.10, tilt:.20, dir:3.14, vEj:.50, giri:.50, tFly:.55, rotola:0,   k2:3.4, rimb:1.5, ond:0   },
  'Valdimontone': { descr:'Doppia capriola in avanti',          lato: 1, tSlip:.30, ox: .95, oy:.30,  tilt:.30, dir:.35,  vEj:.80, giri:2.00, tFly:.65, rotola:1.00, k2:2.4, rimb:1.5, ond:0   },
};
const CADUTA_FANTINO_DEFAULT = CADUTA_FANTINO_CONTRADE['Aquila'];

const _smCad = (t) => { t = Math.max(0, Math.min(1, t)); return t*t*(3 - 2*t); };

function parametriCadutaFantino(nomeCon) {
  let p = CADUTA_FANTINO_CONTRADE[nomeCon];
  if (!p && nomeCon) {
    const k = Object.keys(CADUTA_FANTINO_CONTRADE).find(k => nomeCon.toLowerCase().includes(k.toLowerCase()));
    p = k ? CADUTA_FANTINO_CONTRADE[k] : null;
  }
  return p || CADUTA_FANTINO_DEFAULT;
}
function indiceContradaCaduta(nomeCon) {
  const ks = Object.keys(COLORI_CONTRADE);
  let i = ks.indexOf(nomeCon);
  if (i < 0 && nomeCon) i = ks.findIndex(k => nomeCon.toLowerCase().includes(k.toLowerCase()));
  return Math.max(0, i);
}

/* Crea lo stato di UNA caduta. v0 = velocità del cavallo in px/s al momento della caduta */
function creaCadutaFantino(nomeCon, v0) {
  return { nomeCon, v0: v0 || 0, sep: null };
}

/* Disegna cavallo + fantino per l'istante t (secondi dall'inizio della caduta).
   Ritorna { stato, x, y, fermo } con la posizione del fantino. */
function disegnaCadutaFantino(ctx, x, y, r, nomeCon, angolo, fase, palette, caduta, t) {
  // Prima della caduta: cavallo normale, col fantino in sella
  if (!caduta || t == null || t < 0) {
    disegnaCavalloPalio(ctx, x, y, r, nomeCon, angolo, fase, palette);
    return { stato:'galoppo', x, y, fermo:false };
  }

  const p   = parametriCadutaFantino(nomeCon);
  const idx = indiceContradaCaduta(nomeCon);
  const lato = p.lato;
  const rot0 = lato * p.tilt;
  const K1 = 0.7;                                        // attrito in aria (basso)

  // Il cavallo, ora scosso, si agita di più subito dopo aver perso il fantino
  const viv = (0.85 + ((idx*7) % 5)*0.075) * (1 + 0.6*Math.exp(-t/1.2));
  const opzCavallo = { scosso:true, vivacita:viv, sfas: idx*1.3 };

  let stato, P, rot, sc = 1, faseJ, ombraAlt = 0, aTerra = false, tauTerra = 0, pl = null;

  if (t < p.tSlip) {
    // ── Scivolo: il fantino, ancora sul cavallo, si sbilancia di lato ──
    const s  = _smCad(t / p.tSlip);
    const ox = p.ox*r*s, oy = lato*p.oy*r*s;
    const cA = Math.cos(angolo), sA = Math.sin(angolo);
    P = { x: x + cA*ox - sA*oy, y: y + sA*ox + cA*oy };
    rot = angolo + rot0*s;
    faseJ = fase;
    stato = 'scivolo';
  } else {
    // Al distacco si "fotografano" posizione, direzione e velocità: da qui in poi
    // il moto del fantino è analitico e non dipende più dal cavallo
    if (!caduta.sep) {
      const ox = p.ox*r, oy = lato*p.oy*r;
      const cA = Math.cos(angolo), sA = Math.sin(angolo);
      const fx = cA, fy = sA, sx = -sA*lato, sy = cA*lato;       // avanti e lato di caduta
      const c = Math.cos(p.dir), s = Math.sin(p.dir);
      caduta.sep = {
        x: x + cA*ox - sA*oy, y: y + sA*ox + cA*oy, h: angolo, fase0: fase,
        Vx: fx*caduta.v0 + (fx*c + sx*s)*p.vEj*caduta.v0,
        Vy: fy*caduta.v0 + (fy*c + sy*s)*p.vEj*caduta.v0
      };
    }
    const sp = caduta.sep;
    const tau = t - p.tSlip;
    const rotBase = sp.h + rot0;

    if (tau < p.tFly) {
      // ── Volo: sbalzato via, ruota in aria, più grande (più "in alto") a metà volo ──
      const u = tau / p.tFly, d = (1 - Math.exp(-K1*tau))/K1;
      P = { x: sp.x + sp.Vx*d, y: sp.y + sp.Vy*d };
      rot = rotBase + lato*Math.PI*2*p.giri*u;
      ombraAlt = Math.sin(Math.PI*u);
      sc = 1 + 0.22*ombraAlt;
      faseJ = sp.fase0 + 14*tau;                          // braccia e gambe che si agitano
      stato = 'volo';
    } else {
      // ── Atterraggio, strisciata e rotolata ──
      const dL = (1 - Math.exp(-K1*p.tFly))/K1, eL = Math.exp(-K1*p.tFly);
      pl = { x: sp.x + sp.Vx*dL, y: sp.y + sp.Vy*dL };
      const vLx = sp.Vx*eL, vLy = sp.Vy*eL;
      const sg = tau - p.tFly, f = 1 - Math.exp(-p.k2*sg), e = f / p.k2;
      P = { x: pl.x + vLx*e, y: pl.y + vLy*e };
      if (p.ond) {                                        // serpeggia lateralmente
        const vm = Math.hypot(vLx, vLy) || 1;
        const w = p.ond*r*Math.sin(10*sg)*Math.exp(-1.5*sg)*(1 - Math.exp(-6*sg));
        P.x += (-vLy/vm)*w; P.y += (vLx/vm)*w;
      }
      rot = rotBase + lato*Math.PI*2*p.giri + lato*Math.PI*2*p.rotola*f;
      sc = 1 + p.rimb*0.10*Math.exp(-5*sg)*Math.abs(Math.sin(9*sg));   // rimbalzi all'impatto
      faseJ = sp.fase0 + 14*p.tFly + 1.5*(1 - Math.exp(-4*sg));        // si "affloscia" e si ferma
      aTerra = true; tauTerra = sg;
      stato = sg > 4/p.k2 ? 'fermo' : 'rotola';
    }
  }

  // ── Elementi di contorno (polvere, striscia, ombre) ──
  const disegnaOmbra = (alt) => {
    ctx.save();
    ctx.translate(P.x + r*0.30*alt, P.y + r*0.30*alt);
    ctx.rotate(rot);
    ctx.beginPath(); ctx.ellipse(0, 0, r*1.25, r*0.95, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,' + (0.30 - 0.14*alt).toFixed(3) + ')';
    ctx.fill();
    ctx.restore();
  };
  const disegnaTerra = () => {
    if (!pl) return;
    ctx.save();                                           // striscia lasciata sul terreno
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(pl.x, pl.y); ctx.lineTo(P.x, P.y);
    ctx.strokeStyle = 'rgba(70,48,24,.16)'; ctx.lineWidth = r*0.6; ctx.stroke();
    ctx.restore();
    if (tauTerra < 0.8) {                                 // nuvola di polvere all'impatto
      const k = tauTerra/0.8;
      for (let i = 0; i < 8; i++) {
        const a = i*2.4 + 0.7, vel = r*(0.8 + (i % 3)*0.5);
        const q = 1 - Math.exp(-4*tauTerra);
        ctx.beginPath();
        ctx.arc(pl.x + Math.cos(a)*vel*q, pl.y + Math.sin(a)*vel*q, r*(0.25 + 0.55*k), 0, Math.PI*2);
        ctx.fillStyle = 'rgba(196,170,124,' + (0.38*(1 - k)).toFixed(3) + ')';
        ctx.fill();
      }
    }
  };
  const disegnaFantino = () => {
    ctx.save();
    ctx.translate(P.x, P.y);
    ctx.rotate(rot);
    ctx.scale(sc, sc);
    disegnaFantinoPalio(ctx, r, nomeCon, faseJ);
    ctx.restore();
  };
  const disegnaCavallo = () =>
    disegnaCavalloPalio(ctx, x, y, r, nomeCon, angolo, fase, palette, opzCavallo);

  if (aTerra) {
    // A terra il fantino sta SOTTO il cavallo (che gli passa accanto o sopra)
    disegnaOmbra(0); disegnaTerra(); disegnaFantino(); disegnaCavallo();
  } else {
    // In sella o in volo il fantino sta SOPRA il cavallo
    if (stato === 'volo') disegnaOmbra(ombraAlt);
    disegnaCavallo(); disegnaFantino();
  }

  return { stato, x: P.x, y: P.y, fermo: stato === 'fermo' };
}

/* ═══════════════════════════════════════════════
   17 ANIMAZIONI, UNA PER CONTRADA — stesso schema di ANIMAZIONI_CAVALLO_SCOSSO
═══════════════════════════════════════════════ */
const ANIMAZIONI_CADUTA_FANTINO = {};
Object.keys(COLORI_CONTRADE).forEach((nome) => {
  const p = parametriCadutaFantino(nome);
  ANIMAZIONI_CADUTA_FANTINO[nome] = {
    nomeCon: nome,
    descrizione: p.descr,
    durataCaduta: p.tSlip + p.tFly + 4/p.k2,              // secondi fino a quando il fantino è fermo
    crea(v0) { return creaCadutaFantino(nome, v0); },
    disegna(ctx, x, y, r, angolo, fase, palette, caduta, t) {
      return disegnaCadutaFantino(ctx, x, y, r, nome, angolo, fase, palette, caduta, t);
    }
  };
});


/* ═══════════════════════════════════════════════════════════
   VITTORIA — 17 animazioni, una per contrada
   Il cavallo vincitore galoppa (o trotta in giro) col fantino in sella che
   festeggia: la mano sinistra tiene le redini, la destra si alza sopra la
   spalla (vista dall'alto: più grande e più vicina) e agita in aria il nerbo
   alzato. Ogni contrada ha il PROPRIO modo di festeggiare (VITTORIA_CONTRADE):
     stile    'cerchio'   il nerbo gira in tondo sopra la testa
              'lati'      ampio sventolio da un lato all'altro
              'otto'      sventolio con la mano che disegna un otto
              'frusta'    colpi secchi e rapidi da un lato all'altro
              'ventaglio' sventolio lento e ampio, con la mano che sale e scende
     freq     velocità dello sventolio (cicli per falcata)
     amp      ampiezza dell'angolo (rad) per gli stili a oscillazione
     verso    +1 / −1 senso di rotazione (o lato di partenza)
     centro   direzione media del nerbo (rad; π/2 = dritto verso l'esterno)
     cerc     raggio (in r) del movimento della mano
     lung     lunghezza apparente del nerbo (in r)
     sfas     sfasamento (rad), perché i 17 fantini non festeggino mai in coro
   USO (al posto di disegnaCavalloPalio, nel ciclo di animazione):
     ANIMAZIONI_VITTORIA_FANTINO['Tartuca'].disegna(ctx, x, y, r, angolo, fase, palette, w);
   oppure, per nome:
     disegnaCavalloVittoria(ctx, x, y, r, 'Tartuca', angolo, fase, palette, w);
   w (facoltativo, 0…1, default 1) = quanto il braccio è alzato: portalo da 0 a 1
   in un paio di secondi per far alzare il nerbo gradualmente al traguardo.
   ═══════════════════════════════════════════════════════════ */
const VITTORIA_CONTRADE = {
  'Aquila':       { descr:'Nerbo che gira sopra la testa',        stile:'cerchio',   freq:1.9, amp:0,   verso: 1, centro:1.25, cerc:.20, lung:2.0, sfas:0.0 },
  'Bruco':        { descr:'Sventolio ampio da lato a lato',       stile:'lati',      freq:1.6, amp:.95, verso:-1, centro:1.20, cerc:.18, lung:2.0, sfas:0.8 },
  'Chiocciola':   { descr:'Otto in aria, lento e solenne',        stile:'otto',      freq:1.3, amp:.80, verso: 1, centro:1.30, cerc:.16, lung:2.0, sfas:1.6 },
  'Civetta':      { descr:'Colpi secchi di nerbo',                stile:'frusta',    freq:2.6, amp:.85, verso:-1, centro:1.10, cerc:.14, lung:1.9, sfas:2.4 },
  'Drago':        { descr:'Grandi cerchi veloci',                 stile:'cerchio',   freq:2.4, amp:0,   verso:-1, centro:1.25, cerc:.26, lung:2.2, sfas:3.2 },
  'Giraffa':      { descr:'Ventaglio lento con mano che sale',    stile:'ventaglio', freq:1.1, amp:1.00,verso: 1, centro:1.30, cerc:.22, lung:2.1, sfas:4.0 },
  'Istrice':      { descr:'Otto rapido e nervoso',                stile:'otto',      freq:2.2, amp:.70, verso:-1, centro:1.15, cerc:.15, lung:1.9, sfas:4.8 },
  'Leocorno':     { descr:'Cerchi lenti e regali',                stile:'cerchio',   freq:1.4, amp:0,   verso: 1, centro:1.30, cerc:.24, lung:2.1, sfas:5.6 },
  'Lupa':         { descr:'Sventolio vigoroso',                   stile:'lati',      freq:2.1, amp:1.05,verso: 1, centro:1.25, cerc:.20, lung:2.0, sfas:0.5 },
  'Nicchio':      { descr:'Colpi larghi e ritmati',               stile:'frusta',    freq:1.8, amp:1.00,verso: 1, centro:1.20, cerc:.17, lung:2.0, sfas:1.3 },
  'Oca':          { descr:'Ventaglio ampio e festoso',            stile:'ventaglio', freq:1.7, amp:.90, verso:-1, centro:1.25, cerc:.20, lung:2.0, sfas:2.1 },
  'Onda':         { descr:'Sventolio ondeggiante',                stile:'lati',      freq:1.2, amp:.80, verso:-1, centro:1.35, cerc:.22, lung:2.1, sfas:2.9 },
  'Pantera':      { descr:'Cerchi rapidissimi',                   stile:'cerchio',   freq:3.0, amp:0,   verso: 1, centro:1.20, cerc:.18, lung:1.9, sfas:3.7 },
  'Selva':        { descr:'Otto ampio',                           stile:'otto',      freq:1.6, amp:.95, verso: 1, centro:1.25, cerc:.19, lung:2.0, sfas:4.5 },
  'Tartuca':      { descr:'Sventolio lento e orgoglioso',         stile:'ventaglio', freq:1.0, amp:.85, verso: 1, centro:1.30, cerc:.18, lung:2.1, sfas:5.3 },
  'Torre':        { descr:'Colpi alti e decisi',                  stile:'frusta',    freq:2.0, amp:.90, verso:-1, centro:1.15, cerc:.16, lung:2.1, sfas:0.3 },
  'Valdimontone': { descr:'Cerchi grandi a due tempi',            stile:'cerchio',   freq:2.0, amp:0,   verso:-1, centro:1.30, cerc:.28, lung:2.2, sfas:1.1 },
};
const VITTORIA_DEFAULT = VITTORIA_CONTRADE['Aquila'];

function parametriVittoria(nomeCon) {
  let p = VITTORIA_CONTRADE[nomeCon];
  if (!p && nomeCon) {
    const k = Object.keys(VITTORIA_CONTRADE).find(k => nomeCon.toLowerCase().includes(k.toLowerCase()));
    p = k ? VITTORIA_CONTRADE[k] : null;
  }
  return p || VITTORIA_DEFAULT;
}

/* Stato del festeggiamento (coordinate locali del cavallo, come le mani del fantino):
   ritorna { e, mano:{x,y}, dir:{x,y}, L }  e = quanto il braccio è alzato (0…1),
   mano = posizione della mano destra alzata, dir = direzione (unitaria) del nerbo,
   L = lunghezza apparente del nerbo (più lungo del normale: è più vicino alla vista) */
function statoVittoria(r, fase, nomeCon, w) {
  const p = parametriVittoria(nomeCon);
  const e = Math.max(0, Math.min(1, w == null ? 1 : w));
  const ee = e*e*(3 - 2*e);
  const wave = fase*p.freq + p.sfas;
  const v = p.verso;
  // la mano, alzata sopra la spalla destra, descrive un piccolo movimento
  let hx = r*0.62 + r*p.cerc*Math.cos(wave*v + 1.0);
  let hy = r*1.50 + r*p.cerc*0.75*Math.sin(wave*v + 1.0);
  let ang, L = r*p.lung;
  switch (p.stile) {
    case 'cerchio':
      ang = v*wave;
      L *= 0.86 + 0.14*Math.cos(wave*2);
      break;
    case 'otto':
      ang = p.centro + p.amp*Math.sin(wave);
      hx += r*0.16*Math.sin(wave*2); hy += r*0.12*Math.cos(wave);
      L *= 0.82 + 0.18*Math.cos(wave*2 + 0.5);
      break;
    case 'frusta':
      ang = p.centro + p.amp*Math.tanh(2.4*Math.sin(wave))*v;
      L *= 0.92 + 0.08*Math.cos(wave*2);
      break;
    case 'ventaglio':
      ang = p.centro + p.amp*Math.sin(wave)*v;
      hy += r*0.20*Math.sin(wave*0.5 + 0.7);                // la mano sale e scende
      L *= 0.90 + 0.10*Math.sin(wave*0.5 + 0.7);
      break;
    default: // 'lati'
      ang = p.centro + p.amp*Math.sin(wave)*v;
  }
  hy += r*0.04*Math.sin(fase*2 + 0.9);                      // sobbalzo della falcata
  return { e: ee, mano: { x: hx, y: hy }, dir: { x: Math.cos(ang), y: Math.sin(ang) }, L };
}

/* Cavallo vincitore + fantino che festeggia (w = 0…1, default 1) */
const ANIMAZIONI_VITTORIA_FANTINO = {};
Object.keys(COLORI_CONTRADE).forEach((nome, i) => {
  const p = parametriVittoria(nome);
  const sfasamento = i * 0.9;                              // rad: galoppo non sincrono
  ANIMAZIONI_VITTORIA_FANTINO[nome] = {
    nomeCon: nome,
    descrizione: p.descr,
    stile: p.stile,
    disegna(ctx, x, y, r, angolo, fase, palette, w) {
      disegnaCavalloPalio(ctx, x, y, r, nome, angolo, fase + sfasamento, palette,
                          { vittoria: { w: w == null ? 1 : w } });
    }
  };
});

function disegnaCavalloVittoria(ctx, x, y, r, nomeCon, angolo, fase, palette, w) {
  let an = ANIMAZIONI_VITTORIA_FANTINO[nomeCon];
  if (!an && nomeCon) {
    const k = Object.keys(ANIMAZIONI_VITTORIA_FANTINO).find(k => nomeCon.toLowerCase().includes(k.toLowerCase()));
    an = k ? ANIMAZIONI_VITTORIA_FANTINO[k] : null;
  }
  if (an) return an.disegna(ctx, x, y, r, angolo, fase, palette, w);
  disegnaCavalloPalio(ctx, x, y, r, nomeCon, angolo, fase, palette, { vittoria: { w: w == null ? 1 : w } });   // contrada non in tabella
}


/* ═══════════════════════════════════════════════════════════
   CADUTA DEL CAVALLO COL FANTINO — 17 animazioni, una per contrada
   A differenza della "caduta del fantino" (sezione 6), qui cade ANCHE il cavallo:
   inciampa, crolla sulle zampe, scivola e/o si ribalta sul dorso (visto dall'alto,
   il ribaltamento è reso con lo schiacciamento della sagoma sull'asse longitudinale),
   mentre il fantino, sbilanciato, viene sbalzato via (volo, rotolata, polvere).
   Riusa disegnaCavalloPalio (cavallo, in versione "scosso" dopo l'inizio della
   caduta) e disegnaFantinoPalio (fantino visto dall'alto).

   Sequenza (t = secondi dall'inizio dell'inciampo):
     t < 0                 galoppo normale, cavallo COL fantino
     0 … tInc              "inciampo": le anteriori cedono, il cavallo sbanda ma corre ancora
     tInc … tInc/2+tCad    "caduta": il cavallo ruota, scivola e (a seconda della contrada)
                           si ribalta una o più volte; nuvola di polvere e striscia sul terreno
     dopo                  il cavallo resta a terra, immobile; il fantino (sbalzato a tSep)
                           vola, rotola e si ferma per conto suo

   Ogni contrada ha la PROPRIA caduta (CADUTA_CAVALLO_CONTRADE):
     lato   +1 = cade a destra del cavallo, −1 = a sinistra
     tInc   durata dell'inciampo (s)          tCad  durata del tracollo (s)
     spin   rotazione del corpo (rad)         roll  ribaltamenti completi sul dorso
     kH     attrito del cavallo a terra       lat   scarto laterale (in r)
     ond    serpeggiamento mentre scivola (in r)
     tSep   istante in cui il fantino si stacca;  ox, oy = dove si stacca (in r)
     dir    direzione dello sbalzo (0 avanti, π/2 di fianco, π indietro);  vEj = forza
     giri   giri in aria del fantino;  tFly = durata del volo;  k2 = attrito del fantino

   USO (al posto di disegnaCavalloPalio, dentro il ciclo di animazione).
   x, y, angolo = posizione/direzione che il cavallo AVREBBE se continuasse a galoppare
   a velocità costante v0 (sei tu a muoverlo come sempre: la caduta parte da lì):
     const caduta = creaCadutaCavallo('Tartuca', velocitaPxAlSecondo);
     const st = disegnaCadutaCavallo(ctx, x, y, r, 'Tartuca', angolo, fase, palette,
                                     caduta, tempoAttuale - tInizio);
     // st = { stato:'galoppo'|'inciampo'|'caduta'|'a terra'|'fermo', x, y (cavallo),
     //        fx, fy (fantino), fermo }
   oppure, per nome:
     ANIMAZIONI_CADUTA_CAVALLO['Tartuca'].crea(v0);
     ANIMAZIONI_CADUTA_CAVALLO['Tartuca'].disegna(ctx, x, y, r, angolo, fase, palette, caduta, t);

   Per t < 0 (o caduta assente) disegna il cavallo col fantino, quindi puoi chiamarla
   SEMPRE al posto di disegnaCavalloPalio. Un oggetto "caduta" serve per UNA caduta.
   ═══════════════════════════════════════════════════════════ */
const CADUTA_CAVALLO_CONTRADE = {
  'Aquila':       { descr:'Inciampa e scivola di lato',    lato: 1, tInc:.45, tCad: .90, spin:.55, roll:0,   kH:2.6, lat:1.2, ond:0,  tSep:.60, ox:-.10, oy:1.10, dir:1.40, vEj:.30, giri:.75, tFly:.45, k2:3.0 },
  'Bruco':        { descr:'Crolla sulle anteriori',        lato:-1, tInc:.35, tCad: .80, spin:.15, roll:0, kH:3.0, lat:.3,  ond:0,  tSep:.50, ox: 1.00, oy: .25, dir: .50, vEj:.60, giri:1.5, tFly:.55, k2:2.6 },
  'Chiocciola':   { descr:'Si ribalta sul dorso',          lato: 1, tInc:.50, tCad:1.30, spin:1.0, roll:1.0, kH:2.0, lat:.9,  ond:0,  tSep:.70, ox:-1.00, oy: .30, dir:2.70, vEj:.40, giri:1.0, tFly:.50, k2:3.0 },
  'Civetta':      { descr:'Sbanda e cade di fianco',       lato:-1, tInc:.40, tCad:1.00, spin:1.3, roll:0, kH:2.4, lat:1.4, ond:0,  tSep:.60, ox: .00, oy:1.10, dir:1.20, vEj:.50, giri:1.75,tFly:.55, k2:3.4 },
  'Drago':        { descr:'Capitombolo lungo',             lato: 1, tInc:.35, tCad:1.50, spin:.80, roll:1.5, kH:1.4, lat:.8,  ond:0,  tSep:.55, ox: .40, oy: .90, dir: .80, vEj:.90, giri:1.5, tFly:.70, k2:2.0 },
  'Giraffa':      { descr:'Cede lenta sulle zampe',        lato:-1, tInc:.80, tCad:1.20, spin:.35, roll:0,   kH:3.5, lat:1.0, ond:0,  tSep:1.00,ox:-.20, oy:1.10, dir:1.55, vEj:.15, giri:.25, tFly:.35, k2:4.5 },
  'Istrice':      { descr:'Impuntata e ribaltamento',      lato: 1, tInc:.30, tCad:1.10, spin:.60, roll:.5,  kH:2.2, lat:.4,  ond:0,  tSep:.50, ox: 1.00, oy: .35, dir: .70, vEj:.80, giri:1.25,tFly:.55, k2:2.8 },
  'Leocorno':     { descr:'Doppio ribaltamento',           lato:-1, tInc:.35, tCad:1.60, spin:1.2, roll:2.0, kH:1.6, lat:1.0, ond:0,  tSep:.55, ox: .90, oy: .20, dir: .50, vEj:.75, giri:2.5, tFly:.65, k2:2.4 },
  'Lupa':         { descr:'Scivolata secca di fianco',     lato: 1, tInc:.25, tCad: .60, spin:.90, roll:0,   kH:4.5, lat:1.5, ond:0,  tSep:.40, ox: .00, oy:1.05, dir:1.57, vEj:.35, giri:.50, tFly:.30, k2:6.0 },
  'Nicchio':      { descr:'Sbanda e si abbatte',           lato:-1, tInc:.50, tCad:1.00, spin:1.6, roll:0, kH:2.4, lat:1.2, ond:0,  tSep:.70, ox:-.80, oy: .50, dir:2.20, vEj:.40, giri:1.25,tFly:.50, k2:3.0 },
  'Oca':          { descr:'Rotolata lunga',                lato: 1, tInc:.40, tCad:1.80, spin:.70, roll:2.5, kH:1.2, lat:.9,  ond:0,  tSep:.60, ox: .10, oy: .95, dir:1.00, vEj:.60, giri:1.0, tFly:.50, k2:1.6 },
  'Onda':         { descr:'Cade serpeggiando',             lato:-1, tInc:.50, tCad:1.40, spin:.90, roll:.5,  kH:1.6, lat:1.1, ond:.60,tSep:.65, ox:-.15, oy:1.00, dir:1.35, vEj:.55, giri:.75, tFly:.45, k2:1.8 },
  'Pantera':      { descr:'Balzo, cade e rotola',          lato: 1, tInc:.30, tCad:1.20, spin:.50, roll:1.0, kH:2.0, lat:.7,  ond:0,  tSep:.50, ox: .40, oy: .80, dir:1.30, vEj:1.00,giri:3.0, tFly:.80, k2:3.0 },
  'Selva':        { descr:'Cade con rimbalzi',             lato:-1, tInc:.45, tCad:1.00, spin:.80, roll:.5,  kH:2.6, lat:1.0, ond:0,  tSep:.65, ox:-.30, oy:1.00, dir:1.80, vEj:.55, giri:1.0, tFly:.55, k2:2.6 },
  'Tartuca':      { descr:'Cade lenta e pesante',          lato: 1, tInc:.80, tCad:1.50, spin:.45, roll:0,   kH:4.0, lat:1.1, ond:0,  tSep:1.10,ox:-.10, oy:1.00, dir:1.50, vEj:.20, giri:.25, tFly:.30, k2:5.0 },
  'Torre':        { descr:'Cade e scivola dritta',         lato: 1, tInc:.40, tCad: .90, spin:.15, roll:0,   kH:1.8, lat:.3,  ond:0,  tSep:.60, ox:-1.20, oy: .10, dir:3.14, vEj:.50, giri:.50, tFly:.55, k2:3.4 },
  'Valdimontone': { descr:'Capriola e ribaltamento',       lato: 1, tInc:.30, tCad:1.40, spin:.60, roll:1.0, kH:1.8, lat:.6,  ond:0,  tSep:.50, ox: .95, oy: .30, dir: .35, vEj:.80, giri:2.0, tFly:.65, k2:2.4 },
};
const CADUTA_CAVALLO_DEFAULT = CADUTA_CAVALLO_CONTRADE['Aquila'];

function parametriCadutaCavallo(nomeCon) {
  let p = CADUTA_CAVALLO_CONTRADE[nomeCon];
  if (!p && nomeCon) {
    const k = Object.keys(CADUTA_CAVALLO_CONTRADE).find(k => nomeCon.toLowerCase().includes(k.toLowerCase()));
    p = k ? CADUTA_CAVALLO_CONTRADE[k] : null;
  }
  return p || CADUTA_CAVALLO_DEFAULT;
}

/* Crea lo stato di UNA caduta. v0 = velocità del cavallo in px/s al momento dell'inciampo */
function creaCadutaCavallo(nomeCon, v0) {
  return { nomeCon, v0: v0 || 0, fase0: null };
}

/* Stato (analitico) del cavallo al tempo t: posizione, rotazione, schiacciamenti.
   (x0,y0) = punto in cui il cavallo si trovava a t = 0, angolo = direzione di marcia */
function _statoCavalloCaduta(p, r, x0, y0, angolo, v0, t) {
  const cA = Math.cos(angolo), sA = Math.sin(angolo), lato = p.lato;
  const tt = Math.max(0, t);
  // distanza: velocità piena durante l'inciampo, poi frenata esponenziale
  const D = tt <= p.tInc ? v0*tt : v0*p.tInc + v0*(1 - Math.exp(-p.kH*(tt - p.tInc)))/p.kH;
  const uC = Math.max(0, Math.min(1, (tt - 0.5*p.tInc)/p.tCad));      // avanzamento del tracollo 0…1
  const s = _smCad(uC);
  let lat = lato*p.lat*r*s;
  if (p.ond) lat += p.ond*r*Math.sin(9*tt)*_smCad(tt/p.tInc)*Math.exp(-1.2*Math.max(0, tt - p.tInc - p.tCad));
  const R = Math.PI*2*p.roll*s;                                          // angolo di ribaltamento sul dorso
  const cR = Math.cos(R);                                                // mai ridotto a una linea:
  let sy = (cR < 0 ? -1 : 1)*(0.42 + 0.58*Math.abs(cR));                 // al passaggio di taglio resta ~42%
  sy *= 1 - 0.10*s;                                                      // a terra è un po' più "schiacciato"
  return {
    x: x0 + cA*D - sA*lat, y: y0 + sA*D + cA*lat,
    rot: angolo + lato*p.spin*s,
    sx: 1 - 0.06*Math.sin(Math.PI*Math.min(1, tt/p.tInc)),               // "affondo" delle anteriori
    sy,
    sc: 1 + 0.10*Math.sin(Math.PI*uC)*(p.roll > 0 ? 1 : 0.4),            // sobbalzo (più "vicino" alla vista)
    uC
  };
}

/* Disegna cavallo + fantino per l'istante t (secondi dall'inizio dell'inciampo).
   Ritorna { stato, x, y, fx, fy, fermo }. */
function disegnaCadutaCavallo(ctx, x, y, r, nomeCon, angolo, fase, palette, caduta, t) {
  if (!caduta || t == null || t < 0) {
    disegnaCavalloPalio(ctx, x, y, r, nomeCon, angolo, fase, palette);
    return { stato:'galoppo', x, y, fx:x, fy:y, fermo:false };
  }
  const p = parametriCadutaCavallo(nomeCon);
  const idx = indiceContradaCaduta(nomeCon);
  const lato = p.lato, v0 = caduta.v0;
  if (caduta.fase0 == null) caduta.fase0 = fase;
  const cA = Math.cos(angolo), sA = Math.sin(angolo);
  const x0 = x - cA*v0*t, y0 = y - sA*v0*t;                              // punto di partenza dell'inciampo
  const stato = (tt) => _statoCavalloCaduta(p, r, x0, y0, angolo, v0, tt);
  const H = stato(t);
  const faseC = caduta.fase0 + 8*(1 - Math.exp(-1.5*t))/1.5;            // le zampe si agitano e si fermano
  const viv = (0.85 + ((idx*7) % 5)*0.075) * (1 + 0.8*Math.exp(-t/1.0));
  const durCavallo = 0.5*p.tInc + p.tCad + 3/p.kH;
  const durFantino = p.tSep + p.tFly + 4/p.k2;

  // ── Fantino ──
  let J, rotJ, scJ = 1, faseJ = faseC, fase_j = 'sella', ombraAlt = 0, plJ = null, tauJ = 0;
  if (t < p.tSep) {
    // ancora sul cavallo: si sbilancia di lato seguendo il cavallo che cade
    const s = _smCad(t/p.tSep), cH = Math.cos(H.rot), sH = Math.sin(H.rot);
    const ox = p.ox*r*s, oy = lato*p.oy*r*s;
    J = { x: H.x + cH*ox - sH*oy, y: H.y + sH*ox + cH*oy };
    rotJ = H.rot + lato*0.4*s;
  } else {
    // al distacco si "fotografano" posizione e velocità: poi il moto è analitico
    const S1 = stato(p.tSep), S0 = stato(p.tSep - 0.02);
    const cH = Math.cos(S1.rot), sH = Math.sin(S1.rot);
    const ox = p.ox*r, oy = lato*p.oy*r;
    const J0 = { x: S1.x + cH*ox - sH*oy, y: S1.y + sH*ox + cH*oy };
    const ve = p.vEj*v0, c = Math.cos(p.dir), s = Math.sin(p.dir);
    const VX = (S1.x - S0.x)/0.02 + ve*(cA*c - sA*lato*s);
    const VY = (S1.y - S0.y)/0.02 + ve*(sA*c + cA*lato*s);
    const rotSep = S1.rot + lato*0.4;
    const tau = t - p.tSep, K1 = 0.7;
    if (tau < p.tFly) {
      const u = tau/p.tFly, d = (1 - Math.exp(-K1*tau))/K1;
      J = { x: J0.x + VX*d, y: J0.y + VY*d };
      rotJ = rotSep + lato*Math.PI*2*p.giri*u;
      ombraAlt = Math.sin(Math.PI*u);
      scJ = 1 + 0.22*ombraAlt;
      faseJ = caduta.fase0 + 14*tau;
      fase_j = 'volo';
    } else {
      const dL = (1 - Math.exp(-K1*p.tFly))/K1, eL = Math.exp(-K1*p.tFly);
      plJ = { x: J0.x + VX*dL, y: J0.y + VY*dL };
      const sg = tau - p.tFly, f = 1 - Math.exp(-p.k2*sg), e = f/p.k2;
      J = { x: plJ.x + VX*eL*e, y: plJ.y + VY*eL*e };
      rotJ = rotSep + lato*Math.PI*2*p.giri + lato*Math.PI*2*(p.giri*0.4)*f;
      scJ = 1 + 0.25*0.10*Math.exp(-5*sg)*Math.abs(Math.sin(9*sg))*4;
      faseJ = caduta.fase0 + 14*p.tFly + 1.5*(1 - Math.exp(-4*sg));
      fase_j = 'terra'; tauJ = sg;
    }
  }

  // ── Terreno: striscia lasciata dal cavallo e nuvole di polvere ──
  const polvere = (cx, cy, tt, dur, sc) => {
    if (tt < 0 || tt > dur) return;
    const k = tt/dur, q = 1 - Math.exp(-4*tt);
    for (let i = 0; i < 8; i++) {
      const a = i*2.4 + 0.7 + idx, vel = r*sc*(0.8 + (i % 3)*0.5);
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a)*vel*q, cy + Math.sin(a)*vel*q, r*(0.25 + 0.55*k)*sc, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(196,170,124,' + (0.38*(1 - k)).toFixed(3) + ')';
      ctx.fill();
    }
  };
  if (t > p.tInc) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    const N = 14;
    for (let i = 0; i <= N; i++) {
      const S = stato(p.tInc + (t - p.tInc)*i/N);
      if (i === 0) ctx.moveTo(S.x, S.y); else ctx.lineTo(S.x, S.y);
    }
    ctx.strokeStyle = 'rgba(70,48,24,.16)'; ctx.lineWidth = r*0.9; ctx.stroke();
    ctx.restore();
    const Ht = stato(p.tInc);
    polvere(Ht.x, Ht.y, t - p.tInc, 0.9, 1.3);                          // al primo contatto col terreno
    const t2 = p.tInc + 0.6*p.tCad, H2 = stato(t2);
    polvere(H2.x, H2.y, t - t2, 0.8, 1.0);                               // durante la rotolata
  }
  if (plJ) polvere(plJ.x, plJ.y, tauJ, 0.8, 1.0);                        // atterraggio del fantino

  // ── Elementi di disegno ──
  const disegnaOmbraJ = (alt) => {
    ctx.save();
    ctx.translate(J.x + r*0.30*alt, J.y + r*0.30*alt); ctx.rotate(rotJ);
    ctx.beginPath(); ctx.ellipse(0, 0, r*1.25, r*0.95, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,' + (0.30 - 0.14*alt).toFixed(3) + ')';
    ctx.fill();
    ctx.restore();
  };
  const disegnaFantino = () => {
    ctx.save();
    ctx.translate(J.x, J.y); ctx.rotate(rotJ); ctx.scale(scJ, scJ);
    disegnaFantinoPalio(ctx, r, nomeCon, faseJ);
    ctx.restore();
  };
  const disegnaCavallo = () => {
    ctx.save();
    ctx.translate(H.x, H.y); ctx.rotate(H.rot); ctx.scale(H.sx*H.sc, H.sy*H.sc);
    disegnaCavalloPalio(ctx, 0, 0, r, nomeCon, 0, faseC, palette,
                        { scosso:true, vivacita:viv, sfas: idx*1.3 });
    ctx.restore();
  };

  if (fase_j === 'terra') {                  // il fantino a terra sta SOTTO il cavallo
    disegnaOmbraJ(0); disegnaFantino(); disegnaCavallo();
  } else if (fase_j === 'volo') {            // in volo sta SOPRA il cavallo
    disegnaCavallo(); disegnaOmbraJ(ombraAlt); disegnaFantino();
  } else {                                   // ancora in sella
    disegnaCavallo(); disegnaFantino();
  }

  const fermo = t > Math.max(durCavallo, durFantino);
  const st = t < p.tInc ? 'inciampo' : (t < 0.5*p.tInc + p.tCad ? 'caduta' : (fermo ? 'fermo' : 'a terra'));
  return { stato: st, x: H.x, y: H.y, fx: J.x, fy: J.y, fermo };
}

/* ═══════════════════════════════════════════════
   17 ANIMAZIONI, UNA PER CONTRADA — stesso schema di ANIMAZIONI_CADUTA_FANTINO
═══════════════════════════════════════════════ */
const ANIMAZIONI_CADUTA_CAVALLO = {};
Object.keys(COLORI_CONTRADE).forEach((nome) => {
  const p = parametriCadutaCavallo(nome);
  ANIMAZIONI_CADUTA_CAVALLO[nome] = {
    nomeCon: nome,
    descrizione: p.descr,
    durataCaduta: Math.max(0.5*p.tInc + p.tCad + 3/p.kH, p.tSep + p.tFly + 4/p.k2),   // secondi fino alla fine
    crea(v0) { return creaCadutaCavallo(nome, v0); },
    disegna(ctx, x, y, r, angolo, fase, palette, caduta, t) {
      return disegnaCadutaCavallo(ctx, x, y, r, nome, angolo, fase, palette, caduta, t);
    }
  };
});


/* ═══════════════════════════════════════════════════════════
   NERBATA AL FANTINO CHE SORPASSA A DESTRA — 17 animazioni, una per contrada
   Il cavallo galoppa col suo fantino; un rivale tenta di superarlo sul lato DESTRO
   (il rivale NON viene disegnato). Il fantino stacca la mano destra dalle redini
   (restano nella sinistra), la porta in fuori a destra e frusta col nerbo verso
   l'esterno: braccio armato (nerbo indietro-fuori) → colpo (nerbo avanti-fuori,
   con scia e "codino" della frusta) → ritorno, e di nuovo. Il busto si sporge
   appena a destra. Le nerbate si ripetono di continuo.

   Ogni contrada ha il PROPRIO modo di nerbare (SORPASSO_CONTRADE):
     stile    'secco'    colpo breve e rapido, poi pausa col braccio armato
              'ampio'    gesto largo e continuo, a pendolo
              'doppio'   due colpi ravvicinati per ogni ciclo (il secondo più corto)
              'alto'     colpo dall'alto: mano più in fuori e nerbo più lungo
              'sferzata' scatto violentissimo con lunga scia e codino ben visibile
     freq     nerbate per falcata (cicli per ogni giro di galoppo)
     amp      ampiezza dell'arco del nerbo (rad)
     centro   direzione media del nerbo (rad; 0 = avanti, π/2 = dritto a destra, π = indietro)
     lung     lunghezza apparente del nerbo (in r)
     hx0,hy0  posizione della mano a braccio armato (in r, coord. locali del cavallo)
     hx1,hy1  posizione della mano a colpo a segno
     sfas     sfasamento (rad), perché i 17 fantini non nerbino mai in coro

   USO (al posto di disegnaCavalloPalio, nel ciclo di animazione):
     ANIMAZIONI_SORPASSO_NERBO['Tartuca'].disegna(ctx, x, y, r, angolo, fase, palette, w);
   oppure, per nome:
     disegnaCavalloSorpasso(ctx, x, y, r, 'Tartuca', angolo, fase, palette, w);
   w (facoltativo, 0…1, default 1) = quanto il fantino è "dentro" l'azione: portalo da 0
   a 1 in circa un secondo per far partire gradualmente le nerbate.
   ═══════════════════════════════════════════════════════════ */
const SORPASSO_CONTRADE = {
  'Aquila':       { descr:'Colpo secco, poi braccio armato',   stile:'secco',    freq:1.0, amp:.75, centro:1.45, lung:2.0, hx0:.55, hy0:1.40, hx1:1.15, hy1:1.80, sfas:0.0 },
  'Bruco':        { descr:'Gesto largo a pendolo',             stile:'ampio',    freq:0.9, amp:.90, centro:1.40, lung:2.0, hx0:.50, hy0:1.45, hx1:1.10, hy1:1.85, sfas:0.8 },
  'Chiocciola':   { descr:'Doppio colpo ravvicinato',          stile:'doppio',   freq:0.8, amp:.70, centro:1.50, lung:1.9, hx0:.60, hy0:1.40, hx1:1.10, hy1:1.75, sfas:1.6 },
  'Civetta':      { descr:'Sferzata violenta con lunga scia',  stile:'sferzata', freq:1.1, amp:.85, centro:1.40, lung:2.1, hx0:.50, hy0:1.40, hx1:1.20, hy1:1.85, sfas:2.4 },
  'Drago':        { descr:'Colpo dall\u2019alto, braccio teso',     stile:'alto',     freq:1.0, amp:.80, centro:1.55, lung:2.2, hx0:.55, hy0:1.55, hx1:1.15, hy1:2.00, sfas:3.2 },
  'Giraffa':      { descr:'Pendolo lento e ampio',             stile:'ampio',    freq:0.7, amp:1.00,centro:1.45, lung:2.1, hx0:.45, hy0:1.45, hx1:1.15, hy1:1.90, sfas:4.0 },
  'Istrice':      { descr:'Colpi doppi nervosi',               stile:'doppio',   freq:1.0, amp:.65, centro:1.45, lung:1.9, hx0:.60, hy0:1.40, hx1:1.05, hy1:1.75, sfas:4.8 },
  'Leocorno':     { descr:'Colpo secco e preciso',             stile:'secco',    freq:0.8, amp:.70, centro:1.50, lung:2.0, hx0:.60, hy0:1.45, hx1:1.15, hy1:1.80, sfas:5.6 },
  'Lupa':         { descr:'Sferzate a raffica',                stile:'sferzata', freq:1.3, amp:.80, centro:1.35, lung:2.0, hx0:.50, hy0:1.40, hx1:1.15, hy1:1.80, sfas:0.5 },
  'Nicchio':      { descr:'Colpo alto e deciso',               stile:'alto',     freq:0.9, amp:.85, centro:1.50, lung:2.1, hx0:.55, hy0:1.55, hx1:1.20, hy1:1.95, sfas:1.3 },
  'Oca':          { descr:'Gesto largo e continuo',            stile:'ampio',    freq:1.0, amp:.85, centro:1.40, lung:2.0, hx0:.50, hy0:1.45, hx1:1.10, hy1:1.85, sfas:2.1 },
  'Onda':         { descr:'Doppio colpo, il secondo più corto',stile:'doppio',   freq:0.9, amp:.75, centro:1.45, lung:2.0, hx0:.55, hy0:1.40, hx1:1.10, hy1:1.80, sfas:2.9 },
  'Pantera':      { descr:'Sferzata fulminea',                 stile:'sferzata', freq:1.2, amp:.90, centro:1.40, lung:2.0, hx0:.50, hy0:1.40, hx1:1.20, hy1:1.85, sfas:3.7 },
  'Selva':        { descr:'Colpo secco e ripetuto',            stile:'secco',    freq:1.2, amp:.70, centro:1.45, lung:1.9, hx0:.55, hy0:1.40, hx1:1.10, hy1:1.75, sfas:4.5 },
  'Tartuca':      { descr:'Colpo dall\u2019alto, lento e pesante',  stile:'alto',     freq:0.7, amp:.80, centro:1.55, lung:2.2, hx0:.55, hy0:1.55, hx1:1.15, hy1:2.00, sfas:5.3 },
  'Torre':        { descr:'Pendolo vigoroso',                  stile:'ampio',    freq:1.1, amp:.95, centro:1.40, lung:2.1, hx0:.50, hy0:1.45, hx1:1.15, hy1:1.90, sfas:0.3 },
  'Valdimontone': { descr:'Doppio colpo di grande ampiezza',   stile:'doppio',   freq:0.8, amp:.85, centro:1.50, lung:2.1, hx0:.55, hy0:1.40, hx1:1.15, hy1:1.85, sfas:1.1 },
};
const SORPASSO_DEFAULT = SORPASSO_CONTRADE['Aquila'];

function parametriSorpasso(nomeCon) {
  let p = SORPASSO_CONTRADE[nomeCon];
  if (!p && nomeCon) {
    const k = Object.keys(SORPASSO_CONTRADE).find(k => nomeCon.toLowerCase().includes(k.toLowerCase()));
    p = k ? SORPASSO_CONTRADE[k] : null;
  }
  return p || SORPASSO_DEFAULT;
}

/* Profilo del colpo: p = posizione nel ciclo (0…1) → s = +1 (braccio armato) … −1 (colpo a segno) */
function _profiloSorpasso(stile, p) {
  const sm = (t) => { t = Math.max(0, Math.min(1, t)); return t*t*(3 - 2*t); };
  p = ((p % 1) + 1) % 1;
  const secco = (q, a, b, c) => {                      // armato fino ad a, colpo fino a b, ritorno fino a c
    if (q < a) return 1;
    if (q < b) { const u = (q - a)/(b - a); return 1 - 2*u*u; }
    if (q < c) return -1 + 2*sm((q - b)/(c - b));
    return 1;
  };
  switch (stile) {
    case 'ampio':    return Math.cos(p*Math.PI*2);
    case 'doppio':   return p < 0.5 ? secco(p*2, 0.30, 0.50, 0.85)
                                    : 1 - 1.5*(1 - secco(p*2 - 1, 0.20, 0.42, 0.80));   // secondo colpo più corto
    case 'sferzata': return secco(p, 0.45, 0.53, 0.80);
    default:         return secco(p, 0.35, 0.50, 0.78);  // 'secco' e 'alto'
  }
}

/* Stato della nerbata a destra (coordinate locali del cavallo, come le mani del fantino):
   ritorna { e, mano:{x,y}, dir:{x,y}, L, k, vel, scia }
     e    = quanto il fantino è dentro l'azione (0…1, smussato)
     mano = posizione della mano destra (staccata dalle redini, in fuori a destra)
     dir  = direzione (unitaria) del nerbo;  L = lunghezza del nerbo
     k    = 0 (braccio armato) … 1 (colpo a segno)
     vel  = velocità del colpo in corso (0…1), per scia e codino
     scia = ampiezza (rad) dell'arco di scia */
function statoSorpasso(r, fase, nomeCon, w) {
  const p = parametriSorpasso(nomeCon);
  const e = Math.max(0, Math.min(1, w == null ? 1 : w));
  const ee = e*e*(3 - 2*e);
  const wave = (fase*p.freq + p.sfas)/(Math.PI*2);       // cicli di nerbata
  const s  = _profiloSorpasso(p.stile, wave);
  const s0 = _profiloSorpasso(p.stile, wave - 0.04);
  const k = (1 - s)/2;
  const vel = Math.max(0, Math.min(1, (s0 - s)/0.45));  // solo mentre il nerbo va in avanti
  const ang = p.centro + p.amp*s;
  const L = r*p.lung*(1 + 0.08*k);
  const mano = {
    x: r*(p.hx0 + (p.hx1 - p.hx0)*k),
    y: r*(p.hy0 + (p.hy1 - p.hy0)*k) + r*0.04*Math.sin(fase*2 + 0.9)    // sobbalzo della falcata
  };
  const scia = p.amp*(p.stile === 'sferzata' ? 1.5 : 1.0);
  return { e: ee, mano, dir: { x: Math.cos(ang), y: Math.sin(ang) }, L, k, vel, scia };
}

/* Cavallo + fantino che nerba a destra (w = 0…1, default 1) */
const ANIMAZIONI_SORPASSO_NERBO = {};
Object.keys(COLORI_CONTRADE).forEach((nome, i) => {
  const p = parametriSorpasso(nome);
  const sfasamento = i * 0.9;                              // rad: galoppo non sincrono
  ANIMAZIONI_SORPASSO_NERBO[nome] = {
    nomeCon: nome,
    descrizione: p.descr,
    stile: p.stile,
    disegna(ctx, x, y, r, angolo, fase, palette, w) {
      disegnaCavalloPalio(ctx, x, y, r, nome, angolo, fase + sfasamento, palette,
                          { sorpasso: { w: w == null ? 1 : w } });
    }
  };
});

function disegnaCavalloSorpasso(ctx, x, y, r, nomeCon, angolo, fase, palette, w) {
  let an = ANIMAZIONI_SORPASSO_NERBO[nomeCon];
  if (!an && nomeCon) {
    const k = Object.keys(ANIMAZIONI_SORPASSO_NERBO).find(k => nomeCon.toLowerCase().includes(k.toLowerCase()));
    an = k ? ANIMAZIONI_SORPASSO_NERBO[k] : null;
  }
  if (an) return an.disegna(ctx, x, y, r, angolo, fase, palette, w);
  disegnaCavalloPalio(ctx, x, y, r, nomeCon, angolo, fase, palette, { sorpasso: { w: w == null ? 1 : w } });   // contrada non in tabella
}


/* ═══════════════════════════════════════════════════════════
   10. FANTINO CHE AFFERRA PER LA GIUBBA IL RIVALE CHE SORPASSA A SINISTRA
   Il cavallo galoppa col suo fantino; un rivale tenta di superarlo sul lato SINISTRO
   (il rivale NON viene disegnato). Il fantino stacca la mano SINISTRA dalle redini
   (restano raccolte nella destra, il nerbo resta a riposo), la porta in fuori a sinistra,
   chiude il pugno sulla giubba del rivale e la tira verso di sé (strattone); poi lascia
   la presa, riporta la mano sulle redini e riparte. Durante la presa il busto si piega
   appena a sinistra e, se AFFERRA_MOSTRA_STOFFA è true, si vede un piccolo lembo di stoffa
   stretto nel pugno (mettilo a false per vedere la sola mano).
   Convenzioni: lato sinistro del cavallo = y NEGATIVO (in alto sullo schermo se il
   cavallo va verso destra).

   Ogni contrada ha il PROPRIO modo di tirare (AFFERRA_CONTRADE):
     stile    'secco'    strappo breve e rapidissimo, poi pausa
              'strappo'  strattone deciso, di media durata
              'lento'    presa lunga, trazione lenta e continua
              'doppio'   due strattoni ravvicinati (con piccolo cedimento in mezzo)
              'scossone' tiene la giubba e la scuote avanti-indietro mentre tira
     freq     cicli di presa per falcata
     hx0,hy0  posizione della mano a braccio teso, al momento della presa (in r)
     hx1,hy1  posizione della mano a strattone completato (in r)
     sfas     sfasamento (rad), perché i 17 fantini non tirino mai in coro

   USO (al posto di disegnaCavalloPalio, nel ciclo di animazione):
     ANIMAZIONI_AFFERRA_GIUBBA['Tartuca'].disegna(ctx, x, y, r, angolo, fase, palette, w);
   oppure, per nome:
     disegnaCavalloAfferra(ctx, x, y, r, 'Tartuca', angolo, fase, palette, w);
   w (facoltativo, 0…1, default 1) = quanto il fantino è "dentro" l'azione: portalo da 0
   a 1 in circa un secondo per far partire gradualmente la presa.
   ═══════════════════════════════════════════════════════════ */
const AFFERRA_MOSTRA_STOFFA = true;        // lembo di giubba stretto nel pugno (il rivale non è mai disegnato)
const COLORE_STOFFA_RIVALE  = '#E6DFCE';

const AFFERRA_CONTRADE = {
  'Aquila':       { descr:'Strattone secco e deciso',          stile:'secco',    freq:0.60, hx0:1.10, hy0:-1.95, hx1:0.10, hy1:-1.30, sfas:0.0 },
  'Bruco':        { descr:'Trazione lenta e continua',         stile:'lento',    freq:0.50, hx0:1.05, hy0:-1.90, hx1:0.00, hy1:-1.25, sfas:0.8 },
  'Chiocciola':   { descr:'Doppio strattone ravvicinato',      stile:'doppio',   freq:0.55, hx0:1.15, hy0:-1.90, hx1:0.15, hy1:-1.30, sfas:1.6 },
  'Civetta':      { descr:'Tiene e scuote nervosamente',       stile:'scossone', freq:0.55, hx0:1.10, hy0:-2.00, hx1:0.20, hy1:-1.35, sfas:2.4 },
  'Drago':        { descr:'Presa lunga e tiro potente',        stile:'lento',    freq:0.50, hx0:1.20, hy0:-2.05, hx1:-0.10,hy1:-1.25, sfas:3.2 },
  'Giraffa':      { descr:'Braccio teso, tira con calma',      stile:'lento',    freq:0.45, hx0:1.25, hy0:-2.10, hx1:0.20, hy1:-1.40, sfas:4.0 },
  'Istrice':      { descr:'Doppio strattone nervoso',          stile:'doppio',   freq:0.65, hx0:1.05, hy0:-1.85, hx1:0.15, hy1:-1.25, sfas:4.8 },
  'Leocorno':     { descr:'Strappo secco e preciso',           stile:'secco',    freq:0.55, hx0:1.15, hy0:-1.95, hx1:0.05, hy1:-1.30, sfas:5.6 },
  'Lupa':         { descr:'Scossoni a raffica',                stile:'scossone', freq:0.70, hx0:1.05, hy0:-1.90, hx1:0.25, hy1:-1.35, sfas:0.5 },
  'Nicchio':      { descr:'Strappo deciso',                    stile:'strappo',  freq:0.55, hx0:1.15, hy0:-2.00, hx1:0.05, hy1:-1.30, sfas:1.3 },
  'Oca':          { descr:'Strappo ampio e profondo',          stile:'strappo',  freq:0.50, hx0:1.25, hy0:-2.05, hx1:-0.05,hy1:-1.25, sfas:2.1 },
  'Onda':         { descr:'Doppio strattone, il secondo più forte', stile:'doppio', freq:0.55, hx0:1.10, hy0:-1.95, hx1:0.10, hy1:-1.30, sfas:2.9 },
  'Pantera':      { descr:'Strappo fulmineo',                  stile:'secco',    freq:0.70, hx0:1.10, hy0:-1.90, hx1:0.15, hy1:-1.30, sfas:3.7 },
  'Selva':        { descr:'Presa e scossone',                  stile:'scossone', freq:0.60, hx0:1.10, hy0:-1.95, hx1:0.20, hy1:-1.35, sfas:4.5 },
  'Tartuca':      { descr:'Trazione lenta e pesante',          stile:'lento',    freq:0.45, hx0:1.15, hy0:-2.00, hx1:-0.05,hy1:-1.25, sfas:5.3 },
  'Torre':        { descr:'Strappo vigoroso',                  stile:'strappo',  freq:0.60, hx0:1.20, hy0:-2.00, hx1:0.00, hy1:-1.25, sfas:0.3 },
  'Valdimontone': { descr:'Doppio strattone potente',          stile:'doppio',   freq:0.50, hx0:1.20, hy0:-2.05, hx1:0.00, hy1:-1.25, sfas:1.1 },
};
const AFFERRA_DEFAULT = AFFERRA_CONTRADE['Aquila'];

function parametriAfferra(nomeCon) {
  let p = AFFERRA_CONTRADE[nomeCon];
  if (!p && nomeCon) {
    const k = Object.keys(AFFERRA_CONTRADE).find(k => nomeCon.toLowerCase().includes(k.toLowerCase()));
    p = k ? AFFERRA_CONTRADE[k] : null;
  }
  return p || AFFERRA_DEFAULT;
}

/* Tempi di ogni stile (frazioni di ciclo): a = fine uscita del braccio, b = fine chiusura del pugno
   (inizio trazione), c = fine trazione, d = fine apertura della mano; poi la mano rientra sulle redini */
const _AFF_TEMPI = {
  secco:    { a:.20, b:.27, c:.42, d:.50 },
  strappo:  { a:.25, b:.32, c:.62, d:.70 },
  lento:    { a:.25, b:.33, c:.78, d:.85 },
  doppio:   { a:.22, b:.29, c:.68, d:.76 },
  scossone: { a:.25, b:.32, c:.70, d:.78 },
};

/* Profilo di un ciclo: p (0…1) → { ext, pull, g }
     ext  = 0 (mano sulle redini) … 1 (mano fuori, a sinistra)
     pull = 0 (braccio teso, al momento della presa) … 1 (strattone completato)
     g    = 0 (mano aperta) … 1 (pugno chiuso sulla giubba) */
function _profiloAfferra(stile, p) {
  const sm = (t) => { t = Math.max(0, Math.min(1, t)); return t*t*(3 - 2*t); };
  p = ((p % 1) + 1) % 1;
  const T = _AFF_TEMPI[stile] || _AFF_TEMPI.strappo;
  const forma = (u) => {                                   // andamento della trazione, u = 0…1
    switch (stile) {
      case 'secco':    return 1 - Math.pow(1 - u, 3);      // parte fortissimo, poi si smorza
      case 'doppio':   return u < 0.40 ? 0.60*sm(u/0.40)                         // primo strattone
                            : u < 0.55 ? 0.60 - 0.15*sm((u - 0.40)/0.15)         // piccolo cedimento
                            : 0.45 + 0.55*sm((u - 0.55)/0.45);                   // secondo strattone
      case 'scossone': return Math.max(0, Math.min(1, 0.9*sm(u) + 0.1*u + 0.10*Math.sin(u*Math.PI*7)*Math.sin(Math.PI*u)));
      default:         return sm(u);                       // 'strappo' e 'lento'
    }
  };
  if (p < T.a) return { ext: sm(p/T.a), pull: 0, g: 0 };
  if (p < T.b) return { ext: 1, pull: 0, g: sm((p - T.a)/(T.b - T.a)) };
  if (p < T.c) return { ext: 1, pull: forma((p - T.b)/(T.c - T.b)), g: 1 };
  if (p < T.d) return { ext: 1, pull: 1, g: 1 - sm((p - T.c)/(T.d - T.c)) };
  return { ext: 1 - sm((p - T.d)/(1 - T.d)), pull: 1, g: 0 };
}

/* Stato della presa a sinistra (coordinate locali del cavallo, come le mani del fantino):
   ritorna { e, lascia, mano:{x,y}, g, tira, lean, dir:{x,y} }
     e      = quanto il fantino è dentro l'azione (0…1, smussato)
     lascia = quanto la sinistra ha lasciato le redini (0…1): le redini passano alla destra
     mano   = posizione della mano sinistra
     g      = pugno chiuso (0…1);  tira = tensione dello strappo (0…1), per il lembo di stoffa
     lean   = quanto il busto si piega a sinistra (0…1)
     dir    = direzione (unitaria) verso il rivale, da cui pende il lembo di giubba */
function statoAfferra(r, fase, nomeCon, w) {
  const p = parametriAfferra(nomeCon);
  const e = Math.max(0, Math.min(1, w == null ? 1 : w));
  const ee = e*e*(3 - 2*e);
  const wave = (fase*p.freq + p.sfas)/(Math.PI*2);          // cicli di presa
  const f  = _profiloAfferra(p.stile, wave);
  const f0 = _profiloAfferra(p.stile, wave - 0.03);
  const vel = Math.max(0, Math.min(1, (f.pull - f0.pull)/0.05));
  const rip = posizioniManiFantino(r, fase).sx;              // dove sta la mano sulle redini
  const reach = { x: r*p.hx0, y: r*p.hy0 }, pulled = { x: r*p.hx1, y: r*p.hy1 };
  const T = { x: reach.x + (pulled.x - reach.x)*f.pull, y: reach.y + (pulled.y - reach.y)*f.pull };
  const k = f.ext*ee;
  const mano = {
    x: rip.x + (T.x - rip.x)*k,
    y: rip.y + (T.y - rip.y)*k + r*0.04*Math.sin(fase*2 + 0.9)*k      // sobbalzo della falcata
  };
  const n = Math.hypot(0.30, 1);
  return { e: ee, lascia: k, mano, g: f.g*ee, tira: f.g*ee*(0.35 + 0.65*vel), lean: f.g*f.pull*ee,
           dir: { x: 0.30/n, y: -1/n } };
}

/* Cavallo + fantino che afferra per la giubba il rivale a sinistra (w = 0…1, default 1) */
const ANIMAZIONI_AFFERRA_GIUBBA = {};
Object.keys(COLORI_CONTRADE).forEach((nome, i) => {
  const p = parametriAfferra(nome);
  const sfasamento = i * 0.9;                              // rad: galoppo non sincrono
  ANIMAZIONI_AFFERRA_GIUBBA[nome] = {
    nomeCon: nome,
    descrizione: p.descr,
    stile: p.stile,
    disegna(ctx, x, y, r, angolo, fase, palette, w) {
      disegnaCavalloPalio(ctx, x, y, r, nome, angolo, fase + sfasamento, palette,
                          { afferra: { w: w == null ? 1 : w } });
    }
  };
});

function disegnaCavalloAfferra(ctx, x, y, r, nomeCon, angolo, fase, palette, w) {
  let an = ANIMAZIONI_AFFERRA_GIUBBA[nomeCon];
  if (!an && nomeCon) {
    const k = Object.keys(ANIMAZIONI_AFFERRA_GIUBBA).find(k => nomeCon.toLowerCase().includes(k.toLowerCase()));
    an = k ? ANIMAZIONI_AFFERRA_GIUBBA[k] : null;
  }
  if (an) return an.disegna(ctx, x, y, r, angolo, fase, palette, w);
  disegnaCavalloPalio(ctx, x, y, r, nomeCon, angolo, fase, palette, { afferra: { w: w == null ? 1 : w } });   // contrada non in tabella
}
