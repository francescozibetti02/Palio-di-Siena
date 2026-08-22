/* ═══════════════════════════════════════════════
   DATABASE CAVALLI — Palio di Siena
   Statistiche da 1 a 5 (pallini):
   - velocita: velocità massima in rettilineo
   - accelerazione: scatto in partenza e nei sorpassi
   - tenuta_curva: capacità di mantenere velocità in curva senza rischiare la caduta
   - resistenza: quanto a lungo il cavallo mantiene la velocità senza calare
   - nervosismo: quanto il cavallo è "caldo" e instabile (valore alto è negativo)
   - colore: colore del mantello (usato nella simulazione grafica della Carriera)
═══════════════════════════════════════════════ */
const CAVALLI_DB = [
  { nome:'Anda e Bola',          velocita:5, accelerazione:5, tenuta_curva:5, resistenza:4, nervosismo:1, colore:'#4a2c14' }, // baio scuro
  { nome:'Diodoro',              velocita:5, accelerazione:5, tenuta_curva:5, resistenza:4, nervosismo:2, colore:'#6b4226' }, // baio
  { nome:'Benitos',              velocita:5, accelerazione:4, tenuta_curva:4, resistenza:4, nervosismo:1, colore:'#a0522d' }, // sauro

  { nome:"Viso D'angelo",        velocita:5, accelerazione:5, tenuta_curva:5, resistenza:3, nervosismo:3, colore:'#c9c9c2' }, // grigio chiaro
  { nome:'Zio Frac',             velocita:5, accelerazione:3, tenuta_curva:5, resistenza:4, nervosismo:2, colore:'#241a12' }, // morello
  { nome:'Dollaro',              velocita:5, accelerazione:3, tenuta_curva:5, resistenza:4, nervosismo:2, colore:'#8a5a2e' }, // baio dorato
  { nome:'Zenis',                velocita:4, accelerazione:4, tenuta_curva:5, resistenza:3, nervosismo:3, colore:'#b5651d' }, // sauro chiaro
  { nome:'Volpino',              velocita:4, accelerazione:4, tenuta_curva:3, resistenza:4, nervosismo:2, colore:'#9c5a2e' }, // baio rossiccio
  { nome:'Diamante Grigio',      velocita:4, accelerazione:5, tenuta_curva:3, resistenza:3, nervosismo:3, colore:'#a8a8a0' }, // grigio
  { nome:'Zentiles',             velocita:4, accelerazione:3, tenuta_curva:4, resistenza:3, nervosismo:3, colore:'#513018' }, // baio scuro

  { nome:'Sir Mark',             velocita:4, accelerazione:3, tenuta_curva:3, resistenza:4, nervosismo:2, colore:'#2a2016' }, // morello
  { nome:'Dorotea Dimmonia',     velocita:4, accelerazione:2, tenuta_curva:3, resistenza:3, nervosismo:2, colore:'#7b3f1d' }, // sauro scuro
  { nome:'Dedalo King',          velocita:4, accelerazione:2, tenuta_curva:2, resistenza:3, nervosismo:3, colore:'#6e4527' }, // baio
  { nome:'Bombolone',            velocita:3, accelerazione:3, tenuta_curva:3, resistenza:4, nervosismo:3, colore:'#8f6239' }, // baio chiaro
  { nome:'Dolcecomelanutella',   velocita:3, accelerazione:3, tenuta_curva:3, resistenza:4, nervosismo:3, colore:'#6b3a1a' }, // sauro nocciola
  { nome:'Ebano',                velocita:3, accelerazione:3, tenuta_curva:3, resistenza:4, nervosismo:2, colore:'#1a140f' }, // nero ebano
  { nome:'Esterina',             velocita:3, accelerazione:3, tenuta_curva:3, resistenza:3, nervosismo:3, colore:'#6b4226' }, // baio
  { nome:'Faraone de Nule',      velocita:3, accelerazione:2, tenuta_curva:3, resistenza:3, nervosismo:3, colore:'#4a2c14' }, // baio scuro
  { nome:'Diosu de Campeda',     velocita:3, accelerazione:2, tenuta_curva:3, resistenza:3, nervosismo:3, colore:'#a0522d' }, // sauro
  { nome:'Ghost Boy',            velocita:3, accelerazione:3, tenuta_curva:2, resistenza:3, nervosismo:2, colore:'#d8d4c8' }, // grigio quasi bianco
  { nome:'Eccolo',               velocita:3, accelerazione:3, tenuta_curva:2, resistenza:3, nervosismo:3, colore:'#6b4226' }, // baio
  { nome:'Cobalto',              velocita:3, accelerazione:2, tenuta_curva:3, resistenza:2, nervosismo:4, colore:'#2b2f38' }, // morello bluastro
  { nome:'Zinias',               velocita:3, accelerazione:2, tenuta_curva:2, resistenza:3, nervosismo:3, colore:'#8a4a22' }, // sauro
  { nome:'Oceano',               velocita:3, accelerazione:2, tenuta_curva:2, resistenza:3, nervosismo:3, colore:'#57626b' }, // grigio-blu
  { nome:'Gioia Pura',           velocita:3, accelerazione:2, tenuta_curva:2, resistenza:3, nervosismo:4, colore:'#8a5a34' }, // baio chiaro
  { nome:'Fabula',               velocita:2, accelerazione:3, tenuta_curva:3, resistenza:2, nervosismo:3, colore:'#b5734a' }, // sauro chiaro
  { nome:'Duce',                 velocita:3, accelerazione:2, tenuta_curva:2, resistenza:3, nervosismo:3, colore:'#26201a' }, // morello
  { nome:'King Rio',             velocita:3, accelerazione:2, tenuta_curva:2, resistenza:2, nervosismo:3, colore:'#6b4226' }, // baio
  { nome:'Comancio',             velocita:2, accelerazione:2, tenuta_curva:2, resistenza:3, nervosismo:3, colore:'#6e6a62' }, // grigio scuro
  { nome:'Elly',                 velocita:3, accelerazione:2, tenuta_curva:2, resistenza:2, nervosismo:3, colore:'#96502a' }, // sauro
  { nome:'Benito Baio',          velocita:2, accelerazione:2, tenuta_curva:2, resistenza:3, nervosismo:4, colore:'#6b4226' }, // baio
  { nome:'Erminio Baio',         velocita:2, accelerazione:2, tenuta_curva:2, resistenza:2, nervosismo:3, colore:'#573820' }, // baio scuro
  { nome:'Grande Amore',         velocita:1, accelerazione:2, tenuta_curva:2, resistenza:2, nervosismo:3, colore:'#a8683a' }, // sauro chiaro
  { nome:'Unamore',              velocita:2, accelerazione:2, tenuta_curva:1, resistenza:2, nervosismo:4, colore:'#6b4226' }, // baio
  { nome:'Brivido sauro',        velocita:2, accelerazione:2, tenuta_curva:1, resistenza:2, nervosismo:4, colore:'#a0522d' }, // sauro
  { nome:'Moresco',              velocita:2, accelerazione:2, tenuta_curva:1, resistenza:1, nervosismo:4, colore:'#211a13' }, // morello
  { nome:'Ellenico',             velocita:2, accelerazione:2, tenuta_curva:1, resistenza:1, nervosismo:4, colore:'#6b4226' }, // baio
  { nome:'Superchioma',          velocita:2, accelerazione:1, tenuta_curva:2, resistenza:1, nervosismo:5, colore:'#b5651d' }, // sauro dorato
  { nome:'Veranu',               velocita:2, accelerazione:1, tenuta_curva:1, resistenza:1, nervosismo:4, colore:'#4a2c14' }, // baio scuro

  { nome:'Entu de Pedra Ulpu',   velocita:3, accelerazione:3, tenuta_curva:3, resistenza:3, nervosismo:3, colore:'#6b4226' }, // baio
  { nome:'Donrodrigo',           velocita:3, accelerazione:2, tenuta_curva:2, resistenza:3, nervosismo:3, colore:'#3a2a1a' }, // morello scuro
  { nome:'Eberardo',             velocita:2, accelerazione:2, tenuta_curva:2, resistenza:2, nervosismo:3, colore:'#8a5a2e' }, // baio dorato
  { nome:'Canarinu',             velocita:2, accelerazione:2, tenuta_curva:2, resistenza:2, nervosismo:2, colore:'#c9a94a' }  // sauro chiaro/dorato ("canarino")
];
