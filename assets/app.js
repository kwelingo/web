/* ============================================================
   Kwelingo — Shared front-end helpers
   ============================================================ */

/* ---- CONFIG ------------------------------------------------
   After deploying Code.gs as a Web App, paste the /exec URL here.
   While SCRIPT_URL is empty, the portals run in DEMO MODE using
   the sample data below so you can preview the design.
------------------------------------------------------------- */
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw-Pxd3hsP5kEFFJIcnymRn1d8g8M76Bna-kV1x22WHCQVBbCJdQy1GK6F5Gh_95YAz/exec'; // Kwelingo — Google Sheets (Apps Script) backend

/* ---- SUPABASE (backend UTAMA Kwelingo) --------------------
   Database + Storage. Jalankan supabase-schema.sql dulu di
   Supabase → SQL Editor sebelum dipakai.
   Kalau USE_SUPABASE true, SCRIPT_URL di atas diabaikan.
------------------------------------------------------------- */
const SUPABASE_URL = 'https://eaxihqustnbkzzjaanrt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVheGlocXVzdG5ia3p6amFhbnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNTcxNTcsImV4cCI6MjEwNjgzMzE1N30.Ap1L_4Kt04uFKw2bFlkMeTaOPvSZp0KHq2uCDXBbVh4';
const USE_SUPABASE = !!(SUPABASE_URL && SUPABASE_KEY);

const DEMO_MODE   = !USE_SUPABASE && !SCRIPT_URL;
const uid = () => (self.crypto&&crypto.randomUUID) ? crypto.randomUUID().replace(/-/g,'').slice(0,14)
                 : (Date.now().toString(36)+Math.random().toString(36).slice(2,8)).slice(0,14);

/* ---- Star logo (inline SVG) -------------------------------- */
const STAR_SVG = `
<svg class="ls-star" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M32 4l7.6 15.9L57 22.2 44.5 34.4 47.7 52 32 43.4 16.3 52l3.2-17.6L7 22.2l17.4-2.3z"
        fill="#FFD700" stroke="#F0A500" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="25" cy="30" r="2.4" fill="#2A2A6A"/>
  <circle cx="39" cy="30" r="2.4" fill="#2A2A6A"/>
  <path d="M26 36c2.2 2.4 9.8 2.4 12 0" stroke="#2A2A6A" stroke-width="2.2" stroke-linecap="round"/>
</svg>`;

function logoBlock(name, sub){
  return `<div class="ls-logo"><img src="assets/logo-h.png" class="ls-logo-img" alt="Kwelingo Academy" onerror="this.onerror=null;this.src='assets/logo.png'">${sub?`<span class="ls-sub">${sub}</span>`:''}</div>`;
}

/* ---- Formatting -------------------------------------------- */
const genPin  = () => String(Math.floor(1000+Math.random()*9000));
// username = first name (title stripped) + "kwe"  e.g. "Charlene Tannata"→"charlenekwe", "Ms. Nita"→"nitakwe"
const genUsername = (name) => {
  let n = String(name||'').trim().replace(/^(ms|mr|mrs|miss|mister)\.?\s+/i,'');
  const first = (n.split(/\s+/)[0]||'').toLowerCase().replace(/[^a-z0-9]/g,'');
  return first ? first+'kwe' : '';
};
const fmtRp   = n => 'Rp ' + (Number(n)||0).toLocaleString('id-ID');
const fmtNum  = n => (Number(n)||0).toLocaleString('id-ID');
const pad2    = n => String(n).padStart(2,'0');
function todayStr(){ const d=new Date(); return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; }
function prettyDate(iso){
  if(!iso) return '-';
  const d=new Date(iso+ (iso.length===10?'T00:00:00':''));
  if(isNaN(d)) return iso;
  const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const mon=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()} ${mon[d.getMonth()]} ${d.getFullYear()}`;
}
function dayName(iso){
  const d=new Date(iso+'T00:00:00'); if(isNaN(d)) return '';
  return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
}
function longToday(){
  const d=new Date();
  const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const mon=['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${days[d.getDay()]}, ${d.getDate()} ${mon[d.getMonth()]} ${d.getFullYear()}`;
}
function timeRange(s,e){ if(!s) return '-'; return e? `${s} - ${e}` : `${s} - …`; }
function durMin(s,e){
  if(!s||!e) return null;
  const [sh,sm]=s.split(':').map(Number),[eh,em]=e.split(':').map(Number);
  return (eh*60+em)-(sh*60+sm);
}

/* ---- Toast ------------------------------------------------- */
function toast(msg,type){
  let t=document.getElementById('__toast');
  if(!t){t=document.createElement('div');t.id='__toast';t.className='toast';document.body.appendChild(t);}
  t.className='toast '+(type||'');t.textContent=msg;
  requestAnimationFrame(()=>t.classList.add('show'));
  clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),2600);
}

/* ---- Text & media helpers ---------------------------------- */
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
// Render multi-line text (preserve Enter / line breaks) in a table cell
function multiline(s){ return (s && String(s).trim()) ? `<span style="white-space:pre-line">${esc(s)}</span>` : '<span class="muted">-</span>'; }
// Render a documentation photo cell: real thumbnail if it's an image, else dash
function docCell(u){ return (u && (String(u).startsWith('data:')||String(u).startsWith('http'))) ? `<img src="${u}" class="thumb docthumb" style="cursor:zoom-in" alt="foto">` : '<span class="muted">-</span>'; }
// Click any .docthumb to view it larger
document.addEventListener('click',e=>{ if(e.target && e.target.classList && e.target.classList.contains('docthumb')) viewImg(e.target.src); });
function viewImg(src){
  if(!src) return;
  let o=document.getElementById('__imgview');
  if(!o){o=document.createElement('div');o.id='__imgview';
    o.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.82);display:flex;align-items:center;justify-content:center;z-index:9999;cursor:zoom-out;padding:24px';
    o.onclick=()=>o.remove();document.body.appendChild(o);}
  o.innerHTML=`<img src="${src}" style="max-width:95%;max-height:95%;border-radius:10px;box-shadow:0 8px 40px rgba(0,0,0,.5)">`;
}
// Downscale a chosen image to a small JPEG data-URL that fits in a sheet cell (<45k chars)
function resizeImageToDataURL(file){
  return new Promise((resolve,reject)=>{
    const img=new Image(), url=URL.createObjectURL(file);
    img.onload=()=>{
      URL.revokeObjectURL(url);
      const draw=(maxDim,q)=>{
        let w=img.width,h=img.height;
        if(w>h && w>maxDim){h=Math.round(h*maxDim/w);w=maxDim;}
        else if(h>=w && h>maxDim){w=Math.round(w*maxDim/h);h=maxDim;}
        const cv=document.createElement('canvas');cv.width=w;cv.height=h;
        cv.getContext('2d').drawImage(img,0,0,w,h);
        return cv.toDataURL('image/jpeg',q);
      };
      let maxDim=440,q=0.6,out=draw(maxDim,q);
      for(let i=0;i<5 && out.length>45000;i++){ maxDim=Math.round(maxDim*0.8); q=Math.max(0.35,q-0.08); out=draw(maxDim,q); }
      resolve(out);
    };
    img.onerror=reject; img.src=url;
  });
}

/* ---- Modal helpers ----------------------------------------- */
function openModal(id){document.getElementById(id).classList.add('open')}
function closeModal(id){document.getElementById(id).classList.remove('open')}

/* ============================================================
   Outline icon set (Lucide, ISC) — one line style for the whole site & portal menus.
   kwLi('book-open') → <svg>. kwIconize(root) swaps emoji in .nav .ic / .ph-ic / [data-li] for outline icons.
   ============================================================ */
const KW_LI={"settings":"<path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>","calendar":"<path d=\"M8 2v4\"/><path d=\"M16 2v4\"/><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\"/><path d=\"M3 10h18\"/>","megaphone":"<path d=\"m3 11 18-5v12L3 14v-3z\"/><path d=\"M11.6 16.8a3 3 0 1 1-5.8-1.6\"/>","award":"<path d=\"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526\"/><circle cx=\"12\" cy=\"8\" r=\"6\"/>","credit-card":"<rect width=\"20\" height=\"14\" x=\"2\" y=\"5\" rx=\"2\"/><line x1=\"2\" x2=\"22\" y1=\"10\" y2=\"10\"/>","log-out":"<path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\"/><polyline points=\"16 17 21 12 16 7\"/><line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\"/>","message-circle":"<path d=\"M7.9 20A9 9 0 1 0 4 16.1L2 22Z\"/>","notebook-pen":"<path d=\"M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4\"/><path d=\"M2 6h4\"/><path d=\"M2 10h4\"/><path d=\"M2 14h4\"/><path d=\"M2 18h4\"/><path d=\"M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z\"/>","file-text":"<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/><path d=\"M10 9H8\"/><path d=\"M16 13H8\"/><path d=\"M16 17H8\"/>","mail":"<rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\"/><path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\"/>","house":"<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\"/><path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/>","library":"<path d=\"m16 6 4 14\"/><path d=\"M12 6v14\"/><path d=\"M8 8v12\"/><path d=\"M4 4v16\"/>","circle-check":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m9 12 2 2 4-4\"/>","refresh-cw":"<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"/><path d=\"M21 3v5h-5\"/><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"/><path d=\"M8 16H3v5\"/>","book-open":"<path d=\"M12 7v14\"/><path d=\"M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z\"/>","chart-column":"<path d=\"M3 3v16a2 2 0 0 0 2 2h16\"/><path d=\"M18 17V9\"/><path d=\"M13 17V5\"/><path d=\"M8 17v-3\"/>","folder":"<path d=\"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\"/>","notebook":"<path d=\"M2 6h4\"/><path d=\"M2 10h4\"/><path d=\"M2 14h4\"/><path d=\"M2 18h4\"/><rect width=\"16\" height=\"20\" x=\"4\" y=\"2\" rx=\"2\"/><path d=\"M16 2v20\"/>","users-round":"<path d=\"M18 21a8 8 0 0 0-16 0\"/><circle cx=\"10\" cy=\"8\" r=\"5\"/><path d=\"M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3\"/>","folder-kanban":"<path d=\"M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z\"/><path d=\"M8 10v4\"/><path d=\"M12 10v2\"/><path d=\"M16 10v6\"/>","book":"<path d=\"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20\"/>","receipt-text":"<path d=\"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z\"/><path d=\"M14 8H8\"/><path d=\"M16 12H8\"/><path d=\"M13 16H8\"/>","graduation-cap":"<path d=\"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z\"/><path d=\"M22 10v6\"/><path d=\"M6 12.5V16a6 3 0 0 0 12 0v-3.5\"/>","presentation":"<path d=\"M2 3h20\"/><path d=\"M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3\"/><path d=\"m7 21 5-5 5 5\"/>","tree-palm":"<path d=\"M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4\"/><path d=\"M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3\"/><path d=\"M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35\"/><path d=\"M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14\"/>","shield-check":"<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/><path d=\"m9 12 2 2 4-4\"/>","newspaper":"<path d=\"M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2\"/><path d=\"M18 14h-8\"/><path d=\"M15 18h-5\"/><path d=\"M10 6h8v4h-8V6Z\"/>","school":"<path d=\"M14 22v-4a2 2 0 1 0-4 0v4\"/><path d=\"m18 10 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10\"/><path d=\"M18 5v17\"/><path d=\"m4 6 7.106-3.553a2 2 0 0 1 1.788 0L20 6\"/><path d=\"M6 5v17\"/><circle cx=\"12\" cy=\"9\" r=\"2\"/>","inbox":"<polyline points=\"22 12 16 12 14 15 10 15 8 12 2 12\"/><path d=\"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\"/>","hand":"<path d=\"M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2\"/><path d=\"M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2\"/><path d=\"M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8\"/><path d=\"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15\"/>","users":"<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\"/><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"/>","square-check":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"/><path d=\"m9 12 2 2 4-4\"/>","plane":"<path d=\"M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z\"/>","folder-open":"<path d=\"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2\"/>","trophy":"<path d=\"M6 9H4.5a2.5 2.5 0 0 1 0-5H6\"/><path d=\"M18 9h1.5a2.5 2.5 0 0 0 0-5H18\"/><path d=\"M4 22h16\"/><path d=\"M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22\"/><path d=\"M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22\"/><path d=\"M18 2H6v7a6 6 0 0 0 12 0V2Z\"/>","smile":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M8 14s1.5 2 4 2 4-2 4-2\"/><line x1=\"9\" x2=\"9.01\" y1=\"9\" y2=\"9\"/><line x1=\"15\" x2=\"15.01\" y1=\"9\" y2=\"9\"/>","sprout":"<path d=\"M7 20h10\"/><path d=\"M10 20c5.5-2.5.8-6.4 3-10\"/><path d=\"M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z\"/><path d=\"M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z\"/>","trending-up":"<polyline points=\"22 7 13.5 15.5 8.5 10.5 2 17\"/><polyline points=\"16 7 22 7 22 13\"/>","undo-2":"<path d=\"M9 14 4 9l5-5\"/><path d=\"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11\"/>","globe":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\"/><path d=\"M2 12h20\"/>","target":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><circle cx=\"12\" cy=\"12\" r=\"6\"/><circle cx=\"12\" cy=\"12\" r=\"2\"/>","clipboard-list":"<rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\"/><path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"/><path d=\"M12 11h4\"/><path d=\"M12 16h4\"/><path d=\"M8 11h.01\"/><path d=\"M8 16h.01\"/>","user":"<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/>","monitor":"<rect width=\"20\" height=\"14\" x=\"2\" y=\"3\" rx=\"2\"/><line x1=\"8\" x2=\"16\" y1=\"21\" y2=\"21\"/><line x1=\"12\" x2=\"12\" y1=\"17\" y2=\"21\"/>","map-pin":"<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\"/><circle cx=\"12\" cy=\"10\" r=\"3\"/>","calendar-days":"<path d=\"M8 2v4\"/><path d=\"M16 2v4\"/><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\"/><path d=\"M3 10h18\"/><path d=\"M8 14h.01\"/><path d=\"M12 14h.01\"/><path d=\"M16 14h.01\"/><path d=\"M8 18h.01\"/><path d=\"M12 18h.01\"/><path d=\"M16 18h.01\"/>","star":"<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\"/>","laptop":"<path d=\"M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16\"/>","earth":"<path d=\"M21.54 15H17a2 2 0 0 0-2 2v4.54\"/><path d=\"M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17\"/><path d=\"M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05\"/><circle cx=\"12\" cy=\"12\" r=\"10\"/>","search":"<circle cx=\"11\" cy=\"11\" r=\"8\"/><path d=\"m21 21-4.3-4.3\"/>","link":"<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"/><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"/>","apple":"<path d=\"M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z\"/><path d=\"M10 2c1 .5 2 2 2 5\"/>","sparkles":"<path d=\"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z\"/><path d=\"M20 3v4\"/><path d=\"M22 5h-4\"/><path d=\"M4 17v2\"/><path d=\"M5 18H3\"/>","brain":"<path d=\"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z\"/><path d=\"M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z\"/><path d=\"M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4\"/><path d=\"M17.599 6.5a3 3 0 0 0 .399-1.375\"/><path d=\"M6.003 5.125A3 3 0 0 0 6.401 6.5\"/><path d=\"M3.477 10.896a4 4 0 0 1 .585-.396\"/><path d=\"M19.938 10.5a4 4 0 0 1 .585.396\"/><path d=\"M6 18a4 4 0 0 1-1.967-.516\"/><path d=\"M19.967 17.484A4 4 0 0 1 18 18\"/>","dices":"<rect width=\"12\" height=\"12\" x=\"2\" y=\"10\" rx=\"2\" ry=\"2\"/><path d=\"m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6\"/><path d=\"M6 18h.01\"/><path d=\"M10 14h.01\"/><path d=\"M15 6h.01\"/><path d=\"M18 9h.01\"/>","compass":"<path d=\"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z\"/><circle cx=\"12\" cy=\"12\" r=\"10\"/>","landmark":"<line x1=\"3\" x2=\"21\" y1=\"22\" y2=\"22\"/><line x1=\"6\" x2=\"6\" y1=\"18\" y2=\"11\"/><line x1=\"10\" x2=\"10\" y1=\"18\" y2=\"11\"/><line x1=\"14\" x2=\"14\" y1=\"18\" y2=\"11\"/><line x1=\"18\" x2=\"18\" y1=\"18\" y2=\"11\"/><polygon points=\"12 2 20 7 4 7\"/>","briefcase":"<path d=\"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\"/><rect width=\"20\" height=\"14\" x=\"2\" y=\"6\" rx=\"2\"/>","leaf":"<path d=\"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\"/><path d=\"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\"/>","message-square-quote":"<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"/><path d=\"M8 12a2 2 0 0 0 2-2V8H8\"/><path d=\"M14 12a2 2 0 0 0 2-2V8h-2\"/>","circle-help":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\"/><path d=\"M12 17h.01\"/>","coffee":"<path d=\"M10 2v2\"/><path d=\"M14 2v2\"/><path d=\"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1\"/><path d=\"M6 2v2\"/>","languages":"<path d=\"m5 8 6 6\"/><path d=\"m4 14 6-6 2-3\"/><path d=\"M2 5h12\"/><path d=\"M7 2h1\"/><path d=\"m22 22-5-10-5 10\"/><path d=\"M14 18h6\"/>","pen-line":"<path d=\"M12 20h9\"/><path d=\"M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z\"/>","camera":"<path d=\"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z\"/><circle cx=\"12\" cy=\"13\" r=\"3\"/>","upload":"<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"17 8 12 3 7 8\"/><line x1=\"12\" x2=\"12\" y1=\"3\" y2=\"15\"/>","lightbulb":"<path d=\"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5\"/><path d=\"M9 18h6\"/><path d=\"M10 22h4\"/>","bell":"<path d=\"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9\"/><path d=\"M10.3 21a1.94 1.94 0 0 0 3.4 0\"/>","database":"<ellipse cx=\"12\" cy=\"5\" rx=\"9\" ry=\"3\"/><path d=\"M3 5V19A9 3 0 0 0 21 19V5\"/><path d=\"M3 12A9 3 0 0 0 21 12\"/>","heart":"<path d=\"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z\"/>","arrow-right":"<path d=\"M5 12h14\"/><path d=\"m12 5 7 7-7 7\"/>","chevron-right":"<path d=\"m9 18 6-6-6-6\"/>","info":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M12 16v-4\"/><path d=\"M12 8h.01\"/>","clock":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><polyline points=\"12 6 12 12 16 14\"/>","wallet":"<path d=\"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1\"/><path d=\"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4\"/>","bookmark":"<path d=\"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z\"/>","list-checks":"<path d=\"m3 17 2 2 4-4\"/><path d=\"m3 7 2 2 4-4\"/><path d=\"M13 6h8\"/><path d=\"M13 12h8\"/><path d=\"M13 18h8\"/>","message-square-text":"<path d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\"/><path d=\"M13 8H7\"/><path d=\"M17 12H7\"/>","pencil":"<path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\"/><path d=\"m15 5 4 4\"/>","send":"<path d=\"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z\"/><path d=\"m21.854 2.147-10.94 10.939\"/>","circle-user":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><circle cx=\"12\" cy=\"10\" r=\"3\"/><path d=\"M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662\"/>","notebook-tabs":"<path d=\"M2 6h4\"/><path d=\"M2 10h4\"/><path d=\"M2 14h4\"/><path d=\"M2 18h4\"/><rect width=\"16\" height=\"20\" x=\"4\" y=\"2\" rx=\"2\"/><path d=\"M15 2v20\"/><path d=\"M15 7h5\"/><path d=\"M15 12h5\"/><path d=\"M15 17h5\"/>","speech":"<path d=\"M8.8 20v-4.1l1.9.2a2.3 2.3 0 0 0 2.164-2.1V8.3A5.37 5.37 0 0 0 2 8.25c0 2.8.656 3.054 1 4.55a5.77 5.77 0 0 1 .029 2.758L2 20\"/><path d=\"M19.8 17.8a7.5 7.5 0 0 0 .003-10.603\"/><path d=\"M17 15a3.5 3.5 0 0 0-.025-4.975\"/>","mic":"<path d=\"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z\"/><path d=\"M19 10v2a7 7 0 0 1-14 0v-2\"/><line x1=\"12\" x2=\"12\" y1=\"19\" y2=\"22\"/>","video":"<path d=\"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5\"/><rect x=\"2\" y=\"6\" width=\"14\" height=\"12\" rx=\"2\"/>","image":"<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\"/><circle cx=\"9\" cy=\"9\" r=\"2\"/><path d=\"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21\"/>","download":"<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"/><polyline points=\"7 10 12 15 17 10\"/><line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\"/>","list":"<path d=\"M3 12h.01\"/><path d=\"M3 18h.01\"/><path d=\"M3 6h.01\"/><path d=\"M8 12h13\"/><path d=\"M8 18h13\"/><path d=\"M8 6h13\"/>","mouse-pointer-click":"<path d=\"M14 4.1 12 6\"/><path d=\"m5.1 8-2.9-.8\"/><path d=\"m6 12-1.9 2\"/><path d=\"M7.2 2.2 8 5.1\"/><path d=\"M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z\"/>","layout-dashboard":"<rect width=\"7\" height=\"9\" x=\"3\" y=\"3\" rx=\"1\"/><rect width=\"7\" height=\"5\" x=\"14\" y=\"3\" rx=\"1\"/><rect width=\"7\" height=\"9\" x=\"14\" y=\"12\" rx=\"1\"/><rect width=\"7\" height=\"5\" x=\"3\" y=\"16\" rx=\"1\"/>","clipboard-check":"<rect width=\"8\" height=\"4\" x=\"8\" y=\"2\" rx=\"1\" ry=\"1\"/><path d=\"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2\"/><path d=\"m9 14 2 2 4-4\"/>","user-check":"<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><polyline points=\"16 11 18 13 22 9\"/>","user-plus":"<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><line x1=\"19\" x2=\"19\" y1=\"8\" y2=\"14\"/><line x1=\"22\" x2=\"16\" y1=\"11\" y2=\"11\"/>","history":"<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"/><path d=\"M3 3v5h5\"/><path d=\"M12 7v5l4 2\"/>","file-check":"<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/><path d=\"m9 15 2 2 4-4\"/>","calendar-check":"<path d=\"M8 2v4\"/><path d=\"M16 2v4\"/><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\"/><path d=\"M3 10h18\"/><path d=\"m9 16 2 2 4-4\"/>","calendar-clock":"<path d=\"M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5\"/><path d=\"M16 2v4\"/><path d=\"M8 2v4\"/><path d=\"M3 10h5\"/><path d=\"M17.5 17.5 16 16.3V14\"/><circle cx=\"16\" cy=\"16\" r=\"6\"/>","badge-check":"<path d=\"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z\"/><path d=\"m9 12 2 2 4-4\"/>","book-marked":"<path d=\"M10 2v8l3-3 3 3V2\"/><path d=\"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20\"/>","pen-tool":"<path d=\"M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z\"/><path d=\"m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18\"/><path d=\"m2.3 2.3 7.286 7.286\"/><circle cx=\"11\" cy=\"11\" r=\"2\"/>","rocket":"<path d=\"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z\"/><path d=\"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z\"/><path d=\"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0\"/><path d=\"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5\"/>","gift":"<rect x=\"3\" y=\"8\" width=\"18\" height=\"4\" rx=\"1\"/><path d=\"M12 8v13\"/><path d=\"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7\"/><path d=\"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5\"/>","sun":"<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2\"/><path d=\"M12 20v2\"/><path d=\"m4.93 4.93 1.41 1.41\"/><path d=\"m17.66 17.66 1.41 1.41\"/><path d=\"M2 12h2\"/><path d=\"M20 12h2\"/><path d=\"m6.34 17.66-1.41 1.41\"/><path d=\"m19.07 4.93-1.41 1.41\"/>","moon":"<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\"/>","circle-x":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m15 9-6 6\"/><path d=\"m9 9 6 6\"/>","plus":"<path d=\"M5 12h14\"/><path d=\"M12 5v14\"/>","hourglass":"<path d=\"M5 22h14\"/><path d=\"M5 2h14\"/><path d=\"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22\"/><path d=\"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2\"/>","ban":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"m4.9 4.9 14.2 14.2\"/>","zap":"<path d=\"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z\"/>","baby":"<path d=\"M9 12h.01\"/><path d=\"M15 12h.01\"/><path d=\"M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5\"/><path d=\"M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1\"/>","circle-alert":"<circle cx=\"12\" cy=\"12\" r=\"10\"/><line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"12\"/><line x1=\"12\" x2=\"12.01\" y1=\"16\" y2=\"16\"/>","triangle-alert":"<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\"/><path d=\"M12 9v4\"/><path d=\"M12 17h.01\"/>","user-round-check":"<path d=\"M2 21a8 8 0 0 1 13.292-6\"/><circle cx=\"10\" cy=\"8\" r=\"5\"/><path d=\"m16 19 2 2 4-4\"/>","bell-ring":"<path d=\"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9\"/><path d=\"M10.3 21a1.94 1.94 0 0 0 3.4 0\"/><path d=\"M4 2C2.8 3.7 2 5.7 2 8\"/><path d=\"M22 8c0-2.3-.8-4.3-2-6\"/>","printer":"<path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"/><path d=\"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6\"/><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\" rx=\"1\"/>","star-half":"<path d=\"M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2\"/>"};
const KW_EMOJI_LI={"⚙️":"settings","⚙":"settings","📅":"calendar","📆":"calendar","📣":"megaphone","📢":"megaphone","🏅":"award","💳":"credit-card","🚪":"log-out","💬":"message-circle","📝":"notebook-pen","📄":"file-text","✉️":"mail","✉":"mail","🏠":"house","🏡":"house","📚":"library","✅":"circle-check","🔄":"refresh-cw","📖":"book-open","📊":"chart-column","📁":"folder","📔":"notebook","👨‍👩‍👧":"users-round","👨‍👩‍👧‍👦":"users-round","👪":"users-round","🗂️":"folder-kanban","🗂":"folder-kanban","📘":"book","🧾":"receipt-text","🧑‍🎓":"graduation-cap","🎓":"graduation-cap","👩‍🏫":"presentation","🧑‍🏫":"presentation","👨‍🏫":"presentation","🌴":"tree-palm","🛡️":"shield-check","🛡":"shield-check","📰":"newspaper","🏫":"school","📨":"inbox","🙋":"hand","👥":"users","☑️":"square-check","✈️":"plane","✈":"plane","📂":"folder-open","🏆":"trophy","👧":"smile","🧒":"smile","🌱":"sprout","📈":"trending-up","↩️":"undo-2","🌐":"globe","🎯":"target","📋":"clipboard-list","👤":"user","🖥️":"monitor","📍":"map-pin","🗓️":"calendar-days","⭐":"star","💻":"laptop","🌍":"earth","🌏":"earth","🔎":"search","🔍":"search","🔗":"link","🍎":"apple","✨":"sparkles","🧠":"brain","🎲":"dices","🧭":"compass","🏛️":"landmark","💼":"briefcase","🌿":"leaf","💭":"message-square-quote","🤔":"circle-help","☕":"coffee","🏮":"languages","🀄":"languages","🇨🇳":"languages","✍️":"pen-line","📷":"camera","📤":"upload","💡":"lightbulb","🔔":"bell","🗄️":"database","❤️":"heart","🕒":"clock","⏰":"clock","💰":"wallet","🔖":"bookmark","🎤":"mic","🎬":"video","🖼️":"image","⬇️":"download","🗣️":"speech","🚀":"rocket","🎁":"gift","👋":"hand","📌":"map-pin","📦":"folder","🏦":"landmark","✏️":"pencil","📃":"file-text","📑":"notebook-tabs","🧩":"dices","🎉":"sparkles","＋":"user-plus","+":"plus","⏳":"hourglass","⌛":"hourglass","🚫":"ban","⚡":"zap","⚠️":"triangle-alert","❗":"circle-alert","🖨️":"printer","🔥":"zap","🥇":"trophy","📱":"laptop","🆕":"sparkles","👍":"star","🕐":"clock"};
function kwLi(name,size,color,sw){ const n=KW_LI[name]?name:(KW_LI[KW_EMOJI_LI[name]]?KW_EMOJI_LI[name]:'sparkles');
  return `<svg class="li" width="${size||20}" height="${size||20}" viewBox="0 0 24 24" fill="none" stroke="${color||'currentColor'}" stroke-width="${sw||2}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${KW_LI[n]}</svg>`; }
function kwEmojiLi(e,size,color){ const k=String(e||'').trim(); const n=KW_EMOJI_LI[k]||KW_EMOJI_LI[k.replace(/\uFE0F/g,'')]||(KW_LI[k]?k:''); return n?kwLi(n,size,color):''; }
function kwIconize(root){ root=root||document;
  root.querySelectorAll('.nav a .ic, .page-head .ph-ic, .sidebar-help > span:first-child, .set-ic, .stat .icon, .ricon, #saQuick button > span:first-child, .tile .gi, .botnav-item .bi, [data-li]').forEach(el=>{
    if(el.querySelector('svg')) return; const t=(el.textContent||'').trim(); if(!t) return;
    const svg=el.dataset&&el.dataset.li?kwLi(el.dataset.li):kwEmojiLi(t); if(svg) el.innerHTML=svg; });
}

/* ---- Mobile sidebar ---------------------------------------- */
function toggleSidebar(){
  document.querySelector('.sidebar')?.classList.toggle('open');
  document.querySelector('.backdrop')?.classList.toggle('open');
}
function closeDrawer(){
  document.querySelector('.sidebar')?.classList.remove('open');
  document.querySelector('.backdrop')?.classList.remove('open');
}

/* ---- Mobile app shell: bottom nav + quick-grid (portal murid/ortu/guru) ---- */
function _navMeta(a){
  const ic=(a.querySelector('.ic')||{}).innerHTML||'•';
  const clone=a.cloneNode(true); clone.querySelectorAll('.ic,.nav-dot').forEach(x=>x.remove());
  return {ic, label:clone.textContent.trim(), view:a.dataset.view};
}
function _shellGo(a,view){ a.click(); closeDrawer(); _syncShell(view); }
function _syncShell(view){ document.querySelectorAll('.botnav-item[data-view],.appgrid .tile[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view)); }
function refreshShellDots(){
  document.querySelectorAll('.sidebar .nav a[data-view]').forEach(a=>{
    const dot=a.querySelector('.nav-dot');
    const v=(dot && dot.style.display!=='none' && (dot.textContent||'').trim())?dot.textContent.trim():'';
    document.querySelectorAll('.shell-badge[data-v="'+a.dataset.view+'"]').forEach(b=>{ b.textContent=v; });
  });
}
function initAppShell(){
  try{ kwIconize(document); }catch(e){}
  const links=[...document.querySelectorAll('.sidebar .nav a[data-view]')];
  if(!links.length || document.querySelector('.botnav')) return;
  // Bottom nav: 4 item teratas + tombol Menu
  const bn=document.createElement('nav'); bn.className='botnav';
  links.slice(0,4).forEach(a=>{
    const m=_navMeta(a);
    const btn=document.createElement('button'); btn.className='botnav-item'+(a.classList.contains('active')?' active':''); btn.dataset.view=m.view;
    btn.innerHTML=`<span class="bi">${m.ic}</span><span class="bl">${esc(m.label)}</span><span class="bdot shell-badge" data-v="${esc(m.view)}"></span>`;
    btn.onclick=()=>_shellGo(a,m.view);
    bn.appendChild(btn);
  });
  const menu=document.createElement('button'); menu.className='botnav-item';
  menu.innerHTML=`<span class="bi">${kwLi('list',20)}</span><span class="bl">Menu</span>`;
  menu.onclick=()=>toggleSidebar();
  bn.appendChild(menu);
  document.body.appendChild(bn);
  document.body.classList.add('has-botnav');
  // Quick-grid di Beranda
  const dash=document.getElementById('view-dashboard');
  if(dash && !dash.querySelector('.appgrid')){
    const wrap=document.createElement('div'); wrap.className='appgrid-wrap';
    const title=document.createElement('div'); title.className='appgrid-title'; title.textContent='Menu';
    const grid=document.createElement('div'); grid.className='appgrid';
    links.forEach(a=>{
      const m=_navMeta(a);
      const t=document.createElement('button'); t.className='tile'; t.dataset.view=m.view;
      t.innerHTML=`<span class="gi">${m.ic}</span><span class="gl">${esc(m.label)}</span><span class="gdot shell-badge" data-v="${esc(m.view)}"></span>`;
      t.onclick=()=>_shellGo(a,m.view);
      grid.appendChild(t);
    });
    wrap.appendChild(title); wrap.appendChild(grid);
    const head=dash.querySelector('.page-head');
    if(head && head.nextSibling) dash.insertBefore(wrap, head.nextSibling);
    else dash.insertBefore(wrap, dash.firstChild);
  }
  // Sinkron badge angka (Tugas, Permintaan, dll) dari sidebar
  const navEl=document.querySelector('.sidebar .nav');
  if(navEl && window.MutationObserver){
    try{ new MutationObserver(refreshShellDots).observe(navEl,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['style']}); }catch(e){}
  }
  refreshShellDots();
  setInterval(refreshShellDots, 3000);
}

/* ============================================================
   SCRIPT_API — Apps Script backend (cadangan) / DEMO
   ============================================================ */
const SCRIPT_API = {
  async _post(payload){
    if(DEMO_MODE) return DEMO.handle(payload);
    const isWrite=/^(add|update|delete|save|change)/.test(payload.action||'');
    if(isWrite && SCRIPT_API._busy) throw new Error('Still saving the previous request — please wait a moment, do not double-click.');
    if(isWrite) SCRIPT_API._busy=true;
    const tries = isWrite ? 1 : 3;   // baca (get/login) di-retry kalau server ngadat sesaat
    try{
      for(let i=0;i<tries;i++){
        let text;
        try{
          const r=await fetch(SCRIPT_URL,{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload)});
          text=await r.text();
        }catch(netErr){
          if(i<tries-1){ await new Promise(res=>setTimeout(res,600*(i+1))); continue; }
          throw new Error('Connection to the server failed. Please refresh the page.');
        }
        let j=null; try{ j=JSON.parse(text); }catch(_){ j=null; }
        if(j===null){   // dapat HTML/non-JSON (server ngadat sesaat)
          if(i<tries-1){ await new Promise(res=>setTimeout(res,600*(i+1))); continue; }
          throw new Error(isWrite
            ? 'The server did not respond correctly for a moment. Your data was MOST LIKELY saved — refresh & check before saving again.'
            : 'The server is busy and failed to load data. Please refresh the page.');
        }
        if(j.status==='error') throw new Error(j.message);   // error asli dari server → jangan diulang
        return j.data;
      }
    } finally { if(isWrite) SCRIPT_API._busy=false; }
  },
  _busy:false,
  verifyPin   : (role,pin)         => SCRIPT_API._post({action:'verifyPin',role,pin}),
  changePin   : (role,oldPin,newPin)=> SCRIPT_API._post({action:'changePin',role,oldPin,newPin}),
  getStudents : (o={}) => SCRIPT_API._post({action:'getStudents',...o}),
  studentLogin: (login,pin) => SCRIPT_API._post({action:'studentLogin',login,pin}),
  parentLogin: (login,pin) => SCRIPT_API._post({action:'parentLogin',login,pin}),
  blogLogin: (login,pin) => SCRIPT_API._post({action:'blogLogin',login,pin}),
  getStudent  : (id)   => SCRIPT_API._post({action:'getStudents',id}),
  addStudent  : (d)    => SCRIPT_API._post({action:'addStudent',...d}),
  updateStudent:(d)    => SCRIPT_API._post({action:'updateStudent',...d}),
  deleteStudent:(id)   => SCRIPT_API._post({action:'deleteStudent',id}),

  getTutors   : ()     => SCRIPT_API._post({action:'getTutors'}),
  addTutor    : (d)    => SCRIPT_API._post({action:'addTutor',...d}),
  updateTutor : (d)    => SCRIPT_API._post({action:'updateTutor',...d}),
  deleteTutor : (id)   => SCRIPT_API._post({action:'deleteTutor',id}),
  tutorLogin  : (login,pin) => SCRIPT_API._post({action:'tutorLogin',login,pin}),

  getClasses  : (o={}) => SCRIPT_API._post({action:'getClasses',...o}),
  addClass    : (d)    => SCRIPT_API._post({action:'addClass',...d}),
  updateClass : (d)    => SCRIPT_API._post({action:'updateClass',...d}),
  deleteClass : (id)   => SCRIPT_API._post({action:'deleteClass',id}),

  getAttendance : (o={}) => SCRIPT_API._post({action:'getAttendance',...o}),
  saveAttendance: (d)    => SCRIPT_API._post({action:'saveAttendance',...d}),

  getDeposit  : (sid)  => SCRIPT_API._post({action:'getDeposit',student_id:sid}),

  getPayments : (o={}) => SCRIPT_API._post({action:'getPayments',...o}),
  savePayment : (d)    => SCRIPT_API._post({action:'savePayment',...d}),
  deletePayment:(id)   => SCRIPT_API._post({action:'deletePayment',id}),
  getTutorBonus:(o={}) => SCRIPT_API._post({action:'getTutorBonus',...o}),
  saveTutorBonus:(d)   => SCRIPT_API._post({action:'saveTutorBonus',...d}),

  uploadFile  : (base64,filename) => SCRIPT_API._post({action:'uploadFile',base64,filename}),
  list   : (table,filters={},order) => SCRIPT_API._post({action:'list',table,filters,order}),
  upsert : (table,d) => SCRIPT_API._post({action:'upsert',table,d}),
  remove : (table,id) => SCRIPT_API._post({action:'remove',table,id}),

  // Teaching Resources (modul PDF — owner upload, guru view-only)
  getResources : ()  => SCRIPT_API._post({action:'getResources'}),
  addResource  : (d) => SCRIPT_API._post({action:'addResource',...d}),
  deleteResource:(id)=> SCRIPT_API._post({action:'deleteResource',id}),
  // Bukti terima fee / payroll guru
  getPayroll   : (o={}) => SCRIPT_API._post({action:'getPayroll',...o}),
  savePayroll  : (d) => SCRIPT_API._post({action:'savePayroll',...d}),
  deletePayroll:(id)=> SCRIPT_API._post({action:'deletePayroll',id}),
  getParents:()=> SCRIPT_API._post({action:'getParents'}),
  saveParent:(d)=> SCRIPT_API._post({action:'saveParent',...d}),
  deleteParent:(id)=> SCRIPT_API._post({action:'deleteParent',id}),
  getClassGroups:()=> SCRIPT_API._post({action:'getClassGroups'}),
  saveClassGroup:(d)=> SCRIPT_API._post({action:'saveClassGroup',...d}),
  deleteClassGroup:(id)=> SCRIPT_API._post({action:'deleteClassGroup',id}),
  // Student portal: pengumuman, quiz, leaderboard, diskusi
  getAnnouncements:() => SCRIPT_API._post({action:'getAnnouncements'}),
  addAnnouncement:(d) => SCRIPT_API._post({action:'addAnnouncement',...d}),
  deleteAnnouncement:(id)=> SCRIPT_API._post({action:'deleteAnnouncement',id}),
  getQuizzes   :() => SCRIPT_API._post({action:'getQuizzes'}),
  addQuiz      :(d) => SCRIPT_API._post({action:'addQuiz',...d}),
  deleteQuiz   :(id)=> SCRIPT_API._post({action:'deleteQuiz',id}),
  getQuizResults:(o={})=> SCRIPT_API._post({action:'getQuizResults',...o}),
  saveQuizResult:(d)=> SCRIPT_API._post({action:'saveQuizResult',...d}),
  getLeaderboard:() => SCRIPT_API._post({action:'getLeaderboard'}),
  getDiscussion:(o={})=> SCRIPT_API._post({action:'getDiscussion',...o}),
  addDiscussion:(d)=> SCRIPT_API._post({action:'addDiscussion',...d}),
  // Feedback & belajar: rating, diary, tasks
  getRatings:(o={})=> SCRIPT_API._post({action:'getRatings',...o}),
  addRating:(d)=> SCRIPT_API._post({action:'addRating',...d}),
  getDiary:(o={})=> SCRIPT_API._post({action:'getDiary',...o}),
  addDiary:(d)=> SCRIPT_API._post({action:'addDiary',...d}),
  getTasks:(o={})=> SCRIPT_API._post({action:'getTasks',...o}),
  addTask:(d)=> SCRIPT_API._post({action:'addTask',...d}),
  updateTask:(d)=> SCRIPT_API._post({action:'updateTask',...d}),
  deleteTask:(id)=> SCRIPT_API._post({action:'deleteTask',id}),
  getChat:(o={})=> SCRIPT_API._post({action:'getChat',...o}),
  addChat:(d)=> SCRIPT_API._post({action:'addChat',...d}),
  getTBoard:()=> SCRIPT_API._post({action:'getTBoard'}),
  addTBoard:(d)=> SCRIPT_API._post({action:'addTBoard',...d}),
  deleteTBoard:(id)=> SCRIPT_API._post({action:'deleteTBoard',id}),
  getTBoardReads:(o={})=> SCRIPT_API._post({action:'getTBoardReads',...o}),
  markTBoardRead:(d)=> SCRIPT_API._post({action:'markTBoardRead',...d}),
  getSetting:(key)=> SCRIPT_API._post({action:'getSetting',key}),
  setSetting:(key,value)=> SCRIPT_API._post({action:'setSetting',key,value}),
};

/* ============================================================
   SB_API — Supabase (PostgREST) backend UTAMA
   ============================================================ */
const SB_COLS = {
  students:['id','nama','username','school','address','dob','grade','gender','student_wa','parent_name','wa_ortu','tutor_id','schedule','class_group','program','level','class_type','class_id','start_date','learning_mode','course_due','status','fee_per_meeting','fee_tentor','meeting_minutes','deposit_meetings','add_fee','add_fee_note','pin','active','link_id','notes','email','parent_relation'],
  tutors:['id','nama','username','subject','level','address','dob','wa','pin','category','age_group','employment_type','joining_date','teaching_location','program','bank_name','bank_holder','bank_account','status','photo_url','gender','email','bio','notes'],
  parents:['id','parent_id','nama','wa','linked_students','status','relation','username','pin','email'],
  class_groups:['id','class_id','name','program','tutor_id','student_ids','schedule','start_date','total_sessions','min_cert','status','level','room','mode','days','start_time','end_time','end_date','admin_notes','max_students'],
  lesson_plans:['id','tutor_id','group_id','date','unit','topic','objectives','reading','listening','speaking','writing','practice','production','extended','status','admin_note','submitted_at'],
  dev_notes:['id','student_id','tutor_id','group_id','date','topic','strengths','improve','strategy','encourage'],
  class_applications:['id','group_id','tutor_id','status','note','responded_at'],
  classes:['id','date','student_id','tutor_id','start_time','end_time','duration','type','topic','note','material_url','doc_url','stu_in','stu_out','tut_in','tut_out','lesson_plan','status','req_by','req_note','attend','resched_date','resched_time','resched_note','rec_audio','rec_video','attend_note','group_id','room','session_type','req_kind','req_status','req_at','admin_note','orig_date','orig_time','fee','req_reason'],
  deposit:['student_id','paid_meetings','minutes_total','minutes_used','fee_per_meeting','last_paid','status'],
  payments:['id','student_id','month','pay_date','meetings','price_per_meet','duration','deposit_total','carry_in','extra_minutes','add_fee1','add_fee2','add_fee2_note','next_meetings','next_deposit','grand_total','status','proof_url','invoice_no','issue_date','due_date','program','level','note','reminder_at','paid_at','method'],
  resources:['id','title','subject','level','file_url','note','program','unit','kind','category','size','status','updated_at'],
  payroll:['id','tutor_id','month','amount','transfer_date','proof_url','note','status','sessions','generated_at','confirmed_at','processing_at','sent_at'],
  announcements:['id','title','body','date','class_group','author','audience','program','level','group_id','status','publish_at','attach_url','attach_name'],
  teacher_requests:['id','tutor_id','kind','group_id','class_date','start_time','new_date','new_time','start_date','end_date','leave_type','reason','note','attach_url','status','admin_note','decided_at','decided_by'],
  programs:['id','name','code','category','audience','levels','duration','sessions','min_cert','price','status','description','objectives','curriculum','color'],
  certificates:['id','student_id','group_id','program','level','attendance','cert_no','mode','file_url','status','issued_at','completion_date','note','issued_by'],
  quizzes:['id','title','subject','level','questions','time_limit','due_date','program','group_id','unit','tutor_id','status','quiz_type','description','open_date','open_time','due_time','rules','passing_score','total_points','last_used'],
  quiz_results:['id','quiz_id','student_id','student_name','score','total','taken_at','answers'],
  discussion:['id','student_id','name','message'],
  ratings:['id','class_id','student_id','tutor_id','stars','comment','scores','liked','improve'],
  diary:['id','student_id','tutor_id','author','message','group_id','class_date','learned','struggle','resolve','teacher_comment','comment_at','draft'],
  tasks:['id','student_id','tutor_id','title','detail','type','due_date','status','done_at','submit_url','submit_text','submit_at','points','feedback','graded_at','group_id','batch_id','unit','attach_url','due_time','visible','project_type','instructions','rubric','scores','allow_late'],
  chat:['id','room','sender_id','sender_name','role','message'],
  tboard:['id','title','body','date','author','program','attach_url','attach_name'],
  tboard_read:['id','board_id','reader_id','reader_name','read_at'],
  blog_posts:['id','title','slug','section','category','cover_url','excerpt','content','author_id','author_name','status','review_note','submitted_at','reviewed_at','published_at','updated_at','tags'],
  blog_writers:['id','nama','username','pin','email','bio','photo_url','status','role'],
};
const sbPick=(o,cols)=>{const r={};cols.forEach(k=>{ if(o[k]!==undefined && o[k]!==null) r[k]=o[k]; });return r;};
const SB = {
  base: (SUPABASE_URL||'').replace(/\/$/,'')+'/rest/v1/',
  _busy:false,
  async req(path,{method='GET',body=null,prefer=null,isWrite=false}={}){
    if(isWrite && SB._busy) throw new Error('Still saving the previous request — please wait a moment, do not double-click.');
    if(isWrite) SB._busy=true;
    const headers={apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY};
    if(body) headers['Content-Type']='application/json';
    if(prefer) headers['Prefer']=prefer;
    const tries=isWrite?1:3;
    try{
      for(let i=0;i<tries;i++){
        let res,text;
        try{
          res=await fetch(SB.base+path,{method,headers,body:body?JSON.stringify(body):undefined});
          text=await res.text();
        }catch(netErr){
          if(i<tries-1){ await new Promise(r=>setTimeout(r,500*(i+1))); continue; }
          throw new Error('Connection to the server failed. Please refresh the page.');
        }
        if(!res.ok){
          if(!isWrite && res.status>=500 && i<tries-1){ await new Promise(r=>setTimeout(r,500*(i+1))); continue; }
          // tabel lama tanpa kolom created_at → ulangi tanpa urutan supaya data tetap tampil
          if(method==='GET' && /created_at/.test(text||'') && /[?&]order=created_at/.test(path)){
            console.warn('[Kwelingo] column created_at missing — re-run supabase-schema.sql. Retrying without order:',path);
            return SB.req(path.replace(/&?order=created_at\.(asc|desc)/,'').replace('?&','?'),{method});
          }
          let msg=text; try{ msg=JSON.parse(text).message||JSON.parse(text).hint||text; }catch(_){}
          throw new Error('Database: '+(msg||('HTTP '+res.status)));
        }
        if(!text) return [];
        try{ return JSON.parse(text); }catch(_){ return []; }
      }
    } finally { if(isWrite) SB._busy=false; }
  },
  enc:v=>encodeURIComponent(String(v==null?'':v)),
};
async function sbLogin(table,login,pin){
  const v=SB.enc(String(login||'').trim());
  const rows=await SB.req(`${table}?or=(username.ilike.${v},nama.ilike.${v},id.eq.${v})&select=*`);
  if(!rows.length) throw new Error(table==='students'?'Student not found':'Teacher not found');
  const hit=rows.find(x=>String(x.pin)===String(pin));
  if(!hit) throw new Error('Incorrect PIN');
  return hit;
}
function sbClassQuery(o){
  const f=[];
  if(o.id)         f.push('id=eq.'+SB.enc(o.id));
  if(o.date)       f.push('date=eq.'+SB.enc(o.date));
  if(o.month)      f.push('date=like.'+SB.enc(o.month)+'*');
  if(o.student_id) f.push('student_id=eq.'+SB.enc(o.student_id));
  if(o.tutor_id)   f.push('tutor_id=eq.'+SB.enc(o.tutor_id));
  return 'classes?select=*&order=date.desc'+(f.length?'&'+f.join('&'):'');
}
const SB_API = {
  _busy:false,
  // ---- PIN portal ----
  async verifyPin(role,pin){
    const key=role==='master'?'MASTER_PIN':'ADMIN_PIN';
    const rows=await SB.req(`app_settings?key=eq.${key}&select=value`);
    const cur=rows[0]?rows[0].value:'1234';
    return {ok:String(pin)===String(cur)};
  },
  async changePin(role,oldPin,newPin){
    const key=role==='master'?'MASTER_PIN':'ADMIN_PIN';
    const rows=await SB.req(`app_settings?key=eq.${key}&select=value`);
    const cur=rows[0]?rows[0].value:'1234';
    if(String(oldPin)!==String(cur)) return {ok:false,message:'Old password is incorrect.'};
    if(!/^\d{4,10}$/.test(String(newPin||''))) return {ok:false,message:'New password must be 4–10 digits.'};
    await SB.req('app_settings',{method:'POST',body:{key,value:String(newPin)},prefer:'resolution=merge-duplicates,return=minimal',isWrite:true});
    return {ok:true};
  },
  // ---- Settings umum (mis. URL SOP guru) ----
  async getSetting(key){ const rows=await SB.req('app_settings?key=eq.'+SB.enc(key)+'&select=value'); return rows[0]?rows[0].value:''; },
  async setSetting(key,value){ await SB.req('app_settings',{method:'POST',body:{key,value:String(value==null?'':value)},prefer:'resolution=merge-duplicates,return=minimal',isWrite:true}); return {ok:true}; },
  // ---- Students ----
  getStudents:(o={})=> SB.req('students?select=*'+(o.id?'&id=eq.'+SB.enc(o.id):'')+'&order=created_at.asc'),
  getStudent :(id)=> SB.req('students?select=*&id=eq.'+SB.enc(id)),
  studentLogin:(login,pin)=> sbLogin('students',login,pin),
  async blogLogin(login,pin){ const v=SB.enc(String(login||'').trim()); const rows=await SB.req(`blog_writers?username=ilike.${v}&select=*`);
    if(!rows.length) throw new Error('Writer account not found'); const hit=rows.find(x=>String(x.pin)===String(pin)); if(!hit) throw new Error('Incorrect PIN');
    if(String(hit.status||'Active')!=='Active') throw new Error('This account is not active — please contact the admin'); return hit; },
  async parentLogin(login,pin){ const v=SB.enc(String(login||'').trim()); const rows=await SB.req(`parents?or=(username.ilike.${v},parent_id.ilike.${v})&select=*`);
    if(!rows.length) throw new Error('Parent account not found'); const hit=rows.find(x=>String(x.pin)===String(pin)); if(!hit) throw new Error('Incorrect PIN');
    if(String(hit.status||'Active')!=='Active') throw new Error('This account is not active — please contact the admin'); return hit; },
  async addStudent(d){
    const id=uid(), pin=d.pin||genPin();
    const link=(String(d.nama||'siswa')).toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')+'-'+id.slice(0,5);
    const row=sbPick({...d,id,pin,username:(d.username||'').toLowerCase().trim(),active:d.active||'aktif',link_id:link},SB_COLS.students);
    await SB.req('students',{method:'POST',body:row,prefer:'return=minimal',isWrite:true});
    return {id,pin,link_id:link};
  },
  async updateStudent(d){
    const row=sbPick(d,SB_COLS.students.filter(c=>c!=='id'));
    await SB.req('students?id=eq.'+SB.enc(d.id),{method:'PATCH',body:row,prefer:'return=minimal',isWrite:true});
    return {updated:d.id};
  },
  async deleteStudent(id){ await SB.req('students?id=eq.'+SB.enc(id),{method:'DELETE',prefer:'return=minimal',isWrite:true}); return {deleted:id}; },
  // ---- Tutors ----
  getTutors:()=> SB.req('tutors?select=*&order=created_at.asc'),
  tutorLogin:(login,pin)=> sbLogin('tutors',login,pin),
  async addTutor(d){
    const id=uid(), pin=d.pin||genPin();
    const row=sbPick({...d,id,pin,username:(d.username||'').toLowerCase().trim()},SB_COLS.tutors);
    await SB.req('tutors',{method:'POST',body:row,prefer:'return=minimal',isWrite:true});
    return {id,pin};
  },
  async updateTutor(d){
    const row=sbPick(d,SB_COLS.tutors.filter(c=>c!=='id'));
    await SB.req('tutors?id=eq.'+SB.enc(d.id),{method:'PATCH',body:row,prefer:'return=minimal',isWrite:true});
    return {updated:d.id};
  },
  async deleteTutor(id){ await SB.req('tutors?id=eq.'+SB.enc(id),{method:'DELETE',prefer:'return=minimal',isWrite:true}); return {deleted:id}; },
  // ---- Classes ----
  getClasses:(o={})=> SB.req(sbClassQuery(o)),
  async addClass(d){
    const id=uid();
    const row=sbPick({...d,id},SB_COLS.classes);
    await SB.req('classes',{method:'POST',body:row,prefer:'return=minimal',isWrite:true});
    return {id};
  },
  async updateClass(d){
    const row=sbPick(d,SB_COLS.classes.filter(c=>c!=='id'));
    await SB.req('classes?id=eq.'+SB.enc(d.id),{method:'PATCH',body:row,prefer:'return=minimal',isWrite:true});
    return {updated:d.id};
  },
  async deleteClass(id){ await SB.req('classes?id=eq.'+SB.enc(id),{method:'DELETE',prefer:'return=minimal',isWrite:true}); return {deleted:id}; },
  getAttendance:(o={})=> SB.req(sbClassQuery(o)),
  saveAttendance(d){ return SB_API.updateClass(d); },
  // ---- Deposit ----
  async getDeposit(sid){ const r=await SB.req('deposit?select=*&student_id=eq.'+SB.enc(sid)); return r[0]||null; },
  // ---- Payments ----
  getPayments:(o={})=> SB.req('payments?select=*'+(o.student_id?'&student_id=eq.'+SB.enc(o.student_id):'')+(o.month?'&month=eq.'+SB.enc(o.month):'')+'&order=month.desc'),
  async savePayment(d){
    const id=d.id||uid();
    const row=sbPick({...d,id},SB_COLS.payments);
    await SB.req('payments',{method:'POST',body:row,prefer:'resolution=merge-duplicates,return=minimal',isWrite:true});
    return {id};
  },
  async deletePayment(id){ await SB.req('payments?id=eq.'+SB.enc(id),{method:'DELETE',prefer:'return=minimal',isWrite:true}); return {deleted:id}; },
  // ---- Komisi/Bonus Guru ----
  getTutorBonus:(o={})=> SB.req('tutor_bonus?select=*'+(o.tutor_id?'&tutor_id=eq.'+SB.enc(o.tutor_id):'')+(o.month?'&month=eq.'+SB.enc(o.month):'')),
  async saveTutorBonus(d){
    const id=(d.tutor_id||'')+'_'+(d.month||'');
    const row={id,tutor_id:d.tutor_id||'',month:d.month||'',amount:String(d.amount||0),note:d.note||''};
    await SB.req('tutor_bonus',{method:'POST',body:row,prefer:'resolution=merge-duplicates,return=minimal',isWrite:true});
    return {id};
  },
  // ---- Teaching Resources (modul — owner upload, guru view-only) ----
  getResources:()=> SB.req('resources?select=*&order=created_at.desc'),
  async addResource(d){
    const id=d.id||uid();
    const row=sbPick({...d,id},SB_COLS.resources);
    await SB.req('resources',{method:'POST',body:row,prefer:'return=minimal',isWrite:true});
    return {id};
  },
  async deleteResource(id){ await SB.req('resources?id=eq.'+SB.enc(id),{method:'DELETE',prefer:'return=minimal',isWrite:true}); return {deleted:id}; },
  // ---- Payroll / bukti terima fee guru ----
  getPayroll:(o={})=> SB.req('payroll?select=*'+(o.tutor_id?'&tutor_id=eq.'+SB.enc(o.tutor_id):'')+(o.month?'&month=eq.'+SB.enc(o.month):'')+'&order=created_at.desc'),
  async savePayroll(d){
    const id=d.id||uid();
    const row=sbPick({...d,id},SB_COLS.payroll);
    await SB.req('payroll',{method:'POST',body:row,prefer:'resolution=merge-duplicates,return=minimal',isWrite:true});
    return {id};
  },
  async deletePayroll(id){ await SB.req('payroll?id=eq.'+SB.enc(id),{method:'DELETE',prefer:'return=minimal',isWrite:true}); return {deleted:id}; },
  // ---- Parents ----
  getParents:()=> SB.req('parents?select=*&order=nama.asc'),
  async saveParent(d){ const id=d.id||uid(); const row=sbPick({...d,id},SB_COLS.parents); await SB.req('parents',{method:'POST',body:row,prefer:'resolution=merge-duplicates,return=minimal',isWrite:true}); return {id}; },
  async deleteParent(id){ await SB.req('parents?id=eq.'+SB.enc(id),{method:'DELETE',prefer:'return=minimal',isWrite:true}); return {deleted:id}; },
  // ---- Class groups (cohorts) ----
  getClassGroups:()=> SB.req('class_groups?select=*&order=created_at.desc'),
  async saveClassGroup(d){ const id=d.id||uid(); const row=sbPick({...d,id},SB_COLS.class_groups); await SB.req('class_groups',{method:'POST',body:row,prefer:'resolution=merge-duplicates,return=minimal',isWrite:true}); return {id}; },
  async deleteClassGroup(id){ await SB.req('class_groups?id=eq.'+SB.enc(id),{method:'DELETE',prefer:'return=minimal',isWrite:true}); return {deleted:id}; },
  // ---- Pengumuman ----
  getAnnouncements:()=> SB.req('announcements?select=*&order=created_at.desc'),
  async addAnnouncement(d){
    const id=d.id||uid();
    const row=sbPick({...d,id,date:d.date||todayStr()},SB_COLS.announcements);
    await SB.req('announcements',{method:'POST',body:row,prefer:'return=minimal',isWrite:true});
    return {id};
  },
  async deleteAnnouncement(id){ await SB.req('announcements?id=eq.'+SB.enc(id),{method:'DELETE',prefer:'return=minimal',isWrite:true}); return {deleted:id}; },
  // ---- Quiz ----
  getQuizzes:()=> SB.req('quizzes?select=*&order=created_at.desc'),
  async addQuiz(d){
    const id=d.id||uid();
    const q=(typeof d.questions==='string')?d.questions:JSON.stringify(d.questions||[]);
    const row=sbPick({...d,id,questions:q},SB_COLS.quizzes);
    await SB.req('quizzes',{method:'POST',body:row,prefer:'return=minimal',isWrite:true});
    return {id};
  },
  async deleteQuiz(id){ await SB.req('quizzes?id=eq.'+SB.enc(id),{method:'DELETE',prefer:'return=minimal',isWrite:true}); return {deleted:id}; },
  getQuizResults:(o={})=> SB.req('quiz_results?select=*'+(o.student_id?'&student_id=eq.'+SB.enc(o.student_id):'')+(o.quiz_id?'&quiz_id=eq.'+SB.enc(o.quiz_id):'')+'&order=created_at.desc'),
  async saveQuizResult(d){
    const id=d.id||uid();
    const row=sbPick({...d,id,taken_at:d.taken_at||new Date().toISOString()},SB_COLS.quiz_results);
    await SB.req('quiz_results',{method:'POST',body:row,prefer:'return=minimal',isWrite:true});
    return {id};
  },
  async getLeaderboard(){
    const res=await SB.req('quiz_results?select=student_id,student_name,score');
    const agg={};
    (res||[]).forEach(r=>{
      const sid=String(r.student_id||''); if(!sid) return;
      if(!agg[sid]) agg[sid]={student_id:sid,name:r.student_name||'',points:0,quizzes:0};
      agg[sid].points+=Number(r.score)||0;
      agg[sid].quizzes+=1;
      if(r.student_name) agg[sid].name=r.student_name;
    });
    return Object.keys(agg).map(k=>agg[k]).sort((a,b)=>b.points-a.points);
  },
  // ---- Diskusi siswa ----
  getDiscussion:(o={})=> SB.req('discussion?select=*'+(o.student_id?'&student_id=eq.'+SB.enc(o.student_id):'')+'&order=created_at.asc'),
  async addDiscussion(d){
    const id=d.id||uid();
    const row=sbPick({...d,id},SB_COLS.discussion);
    await SB.req('discussion',{method:'POST',body:row,prefer:'return=minimal',isWrite:true});
    return {id};
  },
  // ---- Rating kelas & guru ----
  getRatings:(o={})=> SB.req('ratings?select=*'+(o.tutor_id?'&tutor_id=eq.'+SB.enc(o.tutor_id):'')+(o.student_id?'&student_id=eq.'+SB.enc(o.student_id):'')+(o.class_id?'&class_id=eq.'+SB.enc(o.class_id):'')+'&order=created_at.desc'),
  async addRating(d){
    const id=d.id||uid();
    const row=sbPick({...d,id},SB_COLS.ratings);
    await SB.req('ratings',{method:'POST',body:row,prefer:'resolution=merge-duplicates,return=minimal',isWrite:true});
    return {id};
  },
  // ---- My Diary (murid ↔ guru) ----
  getDiary:(o={})=> SB.req('diary?select=*'+(o.student_id?'&student_id=eq.'+SB.enc(o.student_id):'')+(o.tutor_id?'&tutor_id=eq.'+SB.enc(o.tutor_id):'')+'&order=created_at.asc'),
  async addDiary(d){
    const id=d.id||uid();
    const row=sbPick({...d,id},SB_COLS.diary);
    await SB.req('diary',{method:'POST',body:row,prefer:'return=minimal',isWrite:true});
    return {id};
  },
  // ---- Task / tugas ----
  getTasks:(o={})=> SB.req('tasks?select=*'+(o.student_id?'&student_id=eq.'+SB.enc(o.student_id):'')+(o.tutor_id?'&tutor_id=eq.'+SB.enc(o.tutor_id):'')+'&order=created_at.desc'),
  async addTask(d){
    const id=d.id||uid();
    const row=sbPick({...d,id,status:d.status||'assigned'},SB_COLS.tasks);
    await SB.req('tasks',{method:'POST',body:row,prefer:'return=minimal',isWrite:true});
    return {id};
  },
  async updateTask(d){
    const row=sbPick(d,SB_COLS.tasks.filter(c=>c!=='id'));
    await SB.req('tasks?id=eq.'+SB.enc(d.id),{method:'PATCH',body:row,prefer:'return=minimal',isWrite:true});
    return {updated:d.id};
  },
  async deleteTask(id){ await SB.req('tasks?id=eq.'+SB.enc(id),{method:'DELETE',prefer:'return=minimal',isWrite:true}); return {deleted:id}; },
  // ---- Chat (Diskusi Kelas & Diskusi Guru) — room-based ----
  getChat:(o={})=> SB.req('chat?select=*'+(o.room?'&room=eq.'+SB.enc(o.room):'')+'&order=created_at.asc'),
  async addChat(d){
    const id=d.id||uid();
    const row=sbPick({...d,id},SB_COLS.chat);
    await SB.req('chat',{method:'POST',body:row,prefer:'return=minimal',isWrite:true});
    return {id};
  },
  // ---- Teacher Bulletin Board ----
  getTBoard:()=> SB.req('tboard?select=*&order=created_at.desc'),
  async addTBoard(d){
    const id=d.id||uid();
    const row=sbPick({...d,id,date:d.date||todayStr()},SB_COLS.tboard);
    await SB.req('tboard',{method:'POST',body:row,prefer:'return=minimal',isWrite:true});
    return {id};
  },
  async deleteTBoard(id){ await SB.req('tboard?id=eq.'+SB.enc(id),{method:'DELETE',prefer:'return=minimal',isWrite:true}); return {deleted:id}; },
  getTBoardReads:(o={})=> SB.req('tboard_read?select=*'+(o.board_id?'&board_id=eq.'+SB.enc(o.board_id):'')+(o.reader_id?'&reader_id=eq.'+SB.enc(o.reader_id):'')),
  async markTBoardRead(d){
    const id=(d.board_id||'')+'_'+(d.reader_id||'');
    const row={id,board_id:d.board_id||'',reader_id:d.reader_id||'',reader_name:d.reader_name||'',read_at:d.read_at||new Date().toISOString()};
    await SB.req('tboard_read',{method:'POST',body:row,prefer:'resolution=merge-duplicates,return=minimal',isWrite:true});
    return {id};
  },
  // ---- Uploads → Supabase Storage (bucket 'materials'), simpan URL saja ----
  async uploadFile(base64,filename){
    const blob=dataURLtoBlob(base64);
    const safe=String(filename||'file').replace(/[^\w.\-]+/g,'_').slice(-80);
    const path=`${Date.now()}_${Math.random().toString(36).slice(2,7)}_${safe}`;
    const bucket='materials';
    const res=await fetch(`${(SUPABASE_URL||'').replace(/\/$/,'')}/storage/v1/object/${bucket}/${path}`,{
      method:'POST',
      headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY,'Content-Type':blob.type||'application/octet-stream','x-upsert':'true'},
      body:blob
    });
    if(!res.ok){
      const t=await res.text().catch(()=> '');
      if(res.status===400||res.status===404||/bucket/i.test(t))
        throw new Error("The 'materials' bucket does not exist in Supabase yet. Run supabase-storage.sql first.");
      throw new Error('Upload failed: '+(t||('HTTP '+res.status)));
    }
    const url=`${(SUPABASE_URL||'').replace(/\/$/,'')}/storage/v1/object/public/${bucket}/${path}`;
    return {url,view:url,name:filename};
  },
  // ---- Generic CRUD (rev4+ modules): list / upsert / remove ----
  list(table,filters={},order='created_at.desc'){
    let q=table+'?select=*';
    Object.entries(filters||{}).forEach(([k,v])=>{ if(v!==undefined&&v!==null&&v!=='') q+='&'+k+'=eq.'+SB.enc(v); });
    if(order) q+='&order='+order;
    return SB.req(q);
  },
  async upsert(table,d){
    const id=d.id||uid();
    const row=sbPick({...d,id},SB_COLS[table]||Object.keys(d));
    await SB.req(table,{method:'POST',body:row,prefer:'resolution=merge-duplicates,return=minimal',isWrite:true});
    return {id};
  },
  async remove(table,id){ await SB.req(table+'?id=eq.'+SB.enc(id),{method:'DELETE',prefer:'return=minimal',isWrite:true}); return {deleted:id}; },
};
// data URL (base64) → Blob untuk upload ke Storage
function dataURLtoBlob(dataurl){
  const parts=String(dataurl||'').split(',');
  const mime=(parts[0].match(/:(.*?);/)||[])[1]||'application/octet-stream';
  const bin=atob(parts[1]||''); const arr=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) arr[i]=bin.charCodeAt(i);
  return new Blob([arr],{type:mime});
}

/* Pilih backend aktif */
const API = USE_SUPABASE ? SB_API : SCRIPT_API;

// Read a File as a base64 data-URL
function fileToBase64(file){ return new Promise((res,rej)=>{const r=new FileReader();r.onload=e=>res(e.target.result);r.onerror=rej;r.readAsDataURL(file);}); }
// Render one or more material links (stored joined by '|')
function matLinks(u){
  if(!u) return '<span class="muted">-</span>';
  return String(u).split('|').filter(Boolean).map((x,i)=>{
    const name=(x.split('/').pop().split('?')[0]||('File '+(i+1))).slice(0,26);
    const real = x.startsWith('http')||x.startsWith('data:');
    if(!real) return `<span class="muted" title="Old file not uploaded yet — ask the teacher to re-upload">📄 ${name}</span>`;
    const isData=x.startsWith('data:');
    const isImg=/\.(jpe?g|png)(\?|$)/i.test(x)||x.startsWith('data:image');
    const isPdf=/\.pdf(\?|$)/i.test(x)||/^data:application\/pdf/i.test(x);
    const isYT=/youtu\.?be/i.test(x), isDrive=/drive\.google/i.test(x);
    let icon='🔗',label='Link',dl='';
    if(isImg){icon='🖼️';label=isData?'Gambar':name;}
    else if(isPdf){icon='📄';label=isData?'PDF':name;dl='download';}
    else if(isYT){icon='▶️';label='YouTube';}
    else if(isDrive){icon='📁';label='Google Drive';}
    else if(isData){icon='📄';label='File';dl='download';}
    // data: URL harus di-download (Chrome memblokir buka data: di tab baru)
    const dlAttr = isData ? `download="materi-${i+1}${isPdf?'.pdf':(isImg?'.jpg':'')}"` : (dl?'download':'');
    const tgt = isData ? '' : 'target="_blank"';
    return `<a class="btn btn-outline btn-sm" href="${x}" ${tgt} style="margin:2px" ${dlAttr}>${icon} ${label}</a>`;
  }).join(' ');
}

/* ============================================================
   CLASS LIFECYCLE — status, attendance %, certificate (shared)
   ============================================================ */
/* Status kelas: 'requested' (diajukan murid/ortu) · 'scheduled' (disetujui/aktif)
   · 'declined' (ditolak) · 'reschedule' (minta ganti jadwal, nunggu ACC) · 'done' (selesai).
   Kelas lama tanpa status dianggap 'scheduled'. */
const CLASS_STATUS = {
  requested:{label:'Awaiting Approval',cls:'badge-pending',ic:'🕒'},
  scheduled:{label:'Scheduled',cls:'badge-active',ic:'📅'},
  reschedule:{label:'Reschedule Requested',cls:'badge-pending',ic:'🔄'},
  declined:{label:'Declined',cls:'badge-off',ic:'✖️'},
  done:{label:'Done',cls:'badge-paid',ic:'✅'},
  cancelled:{label:'Cancelled',cls:'badge-off',ic:'🚫'},
};
function classStatus(c){ return (c&&c.status) ? c.status : 'scheduled'; }
function statusBadge(c){
  const s=CLASS_STATUS[classStatus(c)]||CLASS_STATUS.scheduled;
  return `<span class="badge ${s.cls}">${s.ic} ${s.label.toUpperCase()}</span>`;
}
// kelas yang dihitung sebagai sesi nyata (bukan ajuan/ditolak/pending reschedule)
function isSession(c){ const s=classStatus(c); return s==='scheduled'||s==='done'; }

/* Attendance absensi: '', 'hadir', 'izin', 'alpa' (alpha). */
const ATTEND_META = {
  hadir:{label:'Present',cls:'badge-paid',ic:'✅'},
  telat:{label:'Late',cls:'badge-purple',ic:'🕒'},
  sakit:{label:'Sick',cls:'badge-pending',ic:'🤒'},
  izin:{label:'Excused',cls:'badge-active',ic:'📝'},
  alpa:{label:'Absent',cls:'badge-off',ic:'❌'},
};
function attendBadge(v){
  const a=ATTEND_META[v];
  if(a) return `<span class="badge ${a.cls}">${a.ic} ${a.label.toUpperCase()}</span>`;
  return '<span class="badge badge-pending">🕒 SCHEDULED</span>';
}
// Badge yang konsisten dengan perhitungan %: sesi lampau yang belum ditandai dianggap hadir.
function attendBadgeFor(c){
  if(c.attend) return attendBadge(c.attend);
  if(isSession(c) && c.date && c.date<todayStr())
    return '<span class="badge badge-paid" title="Not marked by teacher — counted as present">✅ PRESENT</span>';
  return '<span class="badge badge-pending">🕒 SCHEDULED</span>';
}
/* Hitung statistik kehadiran dari array kelas (1 murid).
   pct = hadir / (sesi yang sudah di-mark hadir/izin/alpa) × 100.
   Sesi lampau tanpa mark dianggap hadir (kompatibel data lama). */
function attendanceStats(classes){
  const ses=(classes||[]).filter(isSession);
  let hadir=0,izin=0,alpa=0,belum=0,telat=0,sakit=0;
  const today=todayStr();
  ses.forEach(c=>{
    const a=c.attend;
    if(a==='hadir')hadir++;
    else if(a==='telat'){hadir++;telat++;}       // late still counts as attended
    else if(a==='sakit'){izin++;sakit++;}        // sick = not attended (eligible for recovery)
    else if(a==='izin')izin++;
    else if(a==='alpa')alpa++;
    else if(c.date && c.date<today) hadir++;    // sesi lampau belum di-mark → anggap hadir
    else belum++;                               // hari ini / akan datang → belum dihitung
  });
  const counted=hadir+izin+alpa;
  const pct=counted?Math.round(hadir/counted*100):0;
  return {total:ses.length,hadir,izin,alpa,belum,counted,pct,telat,sakit};
}
const CERT_MIN=80;   // ambang kehadiran & penyelesaian tugas untuk Certificate of Completion
// Penyelesaian Extended Practice (tugas). Tanpa tugas → dianggap 100% (tidak menghalangi).
function taskCompletion(tasks){
  const t=(tasks||[]); const total=t.length;
  const done=t.filter(x=>((x&&x.status)||'assigned')!=='assigned').length;
  const pct=total?Math.round(done/total*100):100;
  return {total,done,pct};
}
// Syarat sertifikat: kehadiran ≥80% DAN (kalau ada tugas) penyelesaian tugas ≥80%.
function certEligible(stats,tstats){
  if(!(stats && stats.counted>0 && stats.pct>=CERT_MIN)) return false;
  if(tstats && tstats.total>0 && tstats.pct<CERT_MIN) return false;
  return true;
}

/* Certificate of Completion — buka tab baru berisi e-cert siap di-print/Save as PDF */
/* ---- Registration page config (editable in Super Admin → Settings → Registration Page; saved in app_settings 'reg_config') ----
   fees = price per PACKAGE of 8 sessions: [online private (60 min), online semi-private (90 min), onsite semi-private (90 min)]; null = not offered */
const REG_DEFAULT={
  wa:'6281945144145',
  bank:{name:'Bank Central Asia (BCA)',holder:'Kwe Sutrisno',number:'0520-2434-11'},
  minutes:[60,90,90],
  programs:[
    {id:'be',lang:'English',active:true,name:'Boost English',ic:'🏆',pill:'A1 – C2 (6 Levels)',levels:'A1 – C2',desc:'A structured, international-curriculum program to build your overall English skills.',who:'Kids (8–12), Teens (13–18)\n& Adults (18+)',dur:'3 – 6 months / level',fees:{local:[null,550000,650000],intl:[null,1250000,null]}},
    {id:'sa',lang:'English',active:true,name:'Speak Active',ic:'💬',pill:'Speaking Program',levels:'',desc:'Build your speaking confidence through real and current topics.',who:'Teens & Adults',dur:'Private — online (60 min)\nSemi-private (90 min)',fees:{local:[1200000,500000,null],intl:[1600000,1100000,null]}},
    {id:'ie',lang:'English',active:true,name:'IELTS / TOEFL Prep',ic:'🎯',pill:'Test Preparation',levels:'',desc:'Focused preparation with strategies, practice, and feedback.',who:'Teens (16–18)\n& Adults (18+)',dur:'4 – 6 months\n(Semi-private, 90 min)',fees:{local:[null,800000,1000000],intl:[null,null,null]}},
    {id:'bm',lang:'Mandarin',active:true,name:'Boost Mandarin',ic:'🏮',pill:'HSK 1 – 6',levels:'HSK 1 – 6',desc:'Learn Mandarin step by step — speaking, listening, characters and culture.',who:'Kids, Teens & Adults',dur:'4 – 6 months / level',fees:{local:[null,550000,650000],intl:[null,1250000,null]}},
    {id:'hsk',lang:'Mandarin',active:true,name:'HSK Preparation',ic:'📝',pill:'Test Preparation',levels:'',desc:'Targeted practice and mock tests for the HSK exam.',who:'Teens & Adults',dur:'4 – 12 months / level\n(Semi-private, 90 min)',fees:{local:[null,650000,750000],intl:[null,1350000,null]}},
  ],
};
async function loadRegConfig(){
  const base=JSON.parse(JSON.stringify(REG_DEFAULT));
  try{ const v=await API.getSetting('reg_config'); if(v){ const c=JSON.parse(v); return {...base,...c,bank:{...base.bank,...(c.bank||{})},programs:Array.isArray(c.programs)&&c.programs.length?c.programs:base.programs}; } }catch(e){}
  return base;
}

/* ---- Certificate template (uploaded design + text positions, saved in app_settings 'cert_template') ---- */
let CERT_TPL=null;
const CERT_TPL_DEFAULT={enabled:'1',url:'',font:'script',color:'#13235B',nameY:47,nameSize:58,line1:'has successfully completed {program}{level_text}',line1Y:60,line1Size:18,dateText:'{date}',dateX:24,dateY:84,noText:'No. {no}',noX:76,noY:84,metaSize:13};
async function loadCertTemplate(){ try{ const v=await API.getSetting('cert_template'); CERT_TPL=v?{...CERT_TPL_DEFAULT,...JSON.parse(v)}:null; }catch(e){ CERT_TPL=null; } return CERT_TPL; }
function certFill(t,o){ return String(t||'').replace(/\{(\w+)\}/g,(m,k)=>{ const v={program:o.program||'',level:o.level||'',level_text:o.level?' – Level '+o.level:'',date:o.date||'',no:o.no||'',pct:o.pct!=null&&o.pct!==''?o.pct+'%':'',sessions:o.sessions||'',name:o.name||''}[k]; return v==null?m:esc(v); }); }
function certTplInner(T,o){
  const ff=T.font==='script'?"'Great Vibes',cursive":(T.font==='serif'?"'Playfair Display',Georgia,serif":"'Plus Jakarta Sans',sans-serif");
  const at=(x,y,sz,extra)=>`position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%);font-size:${sz}cqw;color:${esc(T.color)};${extra||''}`;
  return `<img src="${esc(T.url)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" alt="">
    <div style="${at(50,T.nameY,T.nameSize/10,'font-family:'+ff+';white-space:nowrap;font-weight:'+(T.font==='script'?400:800))}">${esc(o.name||'Student Name')}</div>
    ${T.line1?`<div style="${at(50,T.line1Y,T.line1Size/10,'width:80%;text-align:center;font-weight:600')}">${certFill(T.line1,o)}</div>`:''}
    ${T.dateText?`<div style="${at(T.dateX,T.dateY,T.metaSize/10,'white-space:nowrap;font-weight:700')}">${certFill(T.dateText,o)}</div>`:''}
    ${T.noText?`<div style="${at(T.noX,T.noY,T.metaSize/10,'white-space:nowrap;font-weight:600')}">${certFill(T.noText,o)}</div>`:''}`;
}
function openCertificate(o){
  o=o||{};
  const T=o.tpl||(o.tpl!==false&&CERT_TPL&&CERT_TPL.url&&CERT_TPL.enabled!=='0'?CERT_TPL:null);
  if(T){
    const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificate — ${esc(o.name||'')}</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Great+Vibes&family=Playfair+Display:wght@700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Plus Jakarta Sans',sans-serif;background:#EEF3FA;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:60px 24px 24px}
.cert{width:1000px;max-width:100%;aspect-ratio:1.414/1;background:#fff;position:relative;overflow:hidden;container-type:inline-size;box-shadow:0 14px 50px rgba(19,35,91,.16)}
.pbar{position:fixed;top:0;left:0;right:0;background:#1F6FEB;color:#fff;padding:10px;text-align:center;font-size:13px;z-index:99}.pbar button{background:#fff;color:#1F6FEB;border:none;padding:7px 18px;border-radius:8px;font-weight:700;cursor:pointer;margin-left:10px}
@media print{.pbar{display:none}body{background:#fff;padding:0;display:block}.cert{width:100%;box-shadow:none}@page{size:A4 landscape;margin:0}}</style></head><body>
<div class="pbar">💾 Save as PDF: click the button → choose <b>Save as PDF</b> <button onclick="window.print()">⬇️ Download / Print</button></div>
<div class="cert">${certTplInner(T,o)}</div></body></html>`;
    const w=window.open('','_blank'); if(!w){ toast('Please allow pop-ups to open the certificate','err'); return; }
    w.document.write(html); w.document.close(); if(o.print) setTimeout(()=>{ try{ w.focus(); w.print(); }catch(e){} },900); return;
  }
  const nm=esc(o.name||'Student');
  const prog=esc(o.program||'Language Program'), lvl=esc(o.level||'');
  const pct=o.pct!=null?o.pct:'';
  const sessions=o.sessions!=null?o.sessions:'';
  const dateStr=esc(o.date||longToday());
  const no=esc(o.no||('KWE/'+new Date().getFullYear()+'/'+Math.floor(1000+Math.random()*9000)));
  const base=location.href.replace(/[^/]*$/,'');
  const logo=base+'assets/logo-h.png', logo2=base+'assets/logo.png';
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificate — ${nm}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Great+Vibes&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:#EEF3FA;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:60px 24px 24px}
  .cert{width:1000px;max-width:100%;aspect-ratio:1.414/1;background:#fff;position:relative;padding:56px 70px;border-radius:10px;box-shadow:0 14px 50px rgba(19,35,91,.16);overflow:hidden}
  .w1{position:absolute;left:-120px;top:-140px;width:420px;height:420px;border-radius:50%;background:linear-gradient(135deg,#22B2DC,#1F6FEB);opacity:.9}
  .w2{position:absolute;left:-60px;top:-170px;width:380px;height:380px;border-radius:50%;background:#F99400;opacity:.85}
  .w3{position:absolute;right:-140px;bottom:-160px;width:440px;height:440px;border-radius:50%;background:linear-gradient(135deg,#F99400,#FFC24D);opacity:.9}
  .w4{position:absolute;right:-60px;bottom:-200px;width:380px;height:380px;border-radius:50%;background:#22B2DC;opacity:.85}
  .inner{position:relative;z-index:2;text-align:center}
  .logo{height:64px;margin-bottom:8px}
  .title{font-size:58px;font-weight:800;color:#13235B;letter-spacing:4px;line-height:1;margin-top:6px}
  .sub{font-size:15px;letter-spacing:6px;color:#13235B;font-weight:700;margin:6px 0 22px}
  .pre{font-size:14px;color:#55627F}
  .name{font-family:'Great Vibes',cursive;font-size:62px;color:#13235B;margin:4px 0 2px;border-bottom:2px solid #E2C88E;display:inline-block;padding:0 40px 2px;min-width:420px}
  .desc{font-size:15px;color:#3C4A6B;max-width:640px;margin:16px auto 0;line-height:1.6}
  .desc b{color:#13235B}
  .meta{font-size:12px;color:#7A88A6;margin-top:10px}
  .foot{display:flex;justify-content:space-between;align-items:flex-end;margin-top:34px;padding:0 30px}
  .sig{text-align:center;min-width:210px}
  .sig .s{font-family:'Great Vibes',cursive;font-size:30px;color:#13235B;height:38px}
  .sig .ln{border-top:1.5px solid #13235B;margin-bottom:6px}
  .sig b{color:#13235B;font-size:13px;display:block}.sig .r{font-size:11px;color:#7A88A6}
  .seal{width:104px;height:104px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFE08A,#F99400 70%);display:flex;align-items:center;justify-content:center;border:5px solid #FFD36B;box-shadow:0 6px 18px rgba(249,148,0,.45);font-weight:800;color:#fff;font-size:34px;position:relative}
  .seal:after{content:"";position:absolute;bottom:-34px;left:26px;width:0;height:0;border-left:24px solid transparent;border-right:24px solid transparent;border-top:40px solid #D8352A;z-index:-1}
  .no{position:absolute;bottom:18px;left:0;right:0;text-align:center;font-size:10.5px;color:#9AA6BF;z-index:2}
  .pbar{position:fixed;top:0;left:0;right:0;background:#1F6FEB;color:#fff;padding:10px;text-align:center;font-size:13px;z-index:99}
  .pbar button{background:#fff;color:#1F6FEB;border:none;padding:7px 18px;border-radius:8px;font-weight:700;cursor:pointer;margin-left:10px}
  @media print{.pbar{display:none}body{background:#fff;padding:0}.cert{box-shadow:none;border-radius:0}@page{size:A4 landscape;margin:0}}
</style></head><body>
  <div class="pbar">💾 Save as PDF: click the button → choose <b>Save as PDF</b> <button onclick="window.print()">⬇️ Download / Print</button></div>
  <div class="cert">
    <div class="w1"></div><div class="w2"></div><div class="w3"></div><div class="w4"></div>
    <div class="inner">
      <img class="logo" src="${logo}" onerror="this.src='${logo2}'" alt="Kwelingo Academy">
      <div class="title">CERTIFICATE</div>
      <div class="sub">OF COMPLETION</div>
      <div class="pre">This is to certify that</div>
      <div class="name">${nm}</div>
      <div class="desc">has successfully completed<br><b>${prog}${lvl?' – Level '+lvl:''}</b><br>at Kwelingo Academy.</div>
      ${pct!==''||sessions!==''?`<div class="meta">${pct!==''?`Attendance ${pct}%`:''}${pct!==''&&sessions!==''?' · ':''}${sessions!==''?`${sessions} sessions attended`:''}</div>`:''}
      <div class="foot">
        <div class="sig"><div class="s">Kwelingo</div><div class="ln"></div><b>Director</b><div class="r">Kwelingo Academy</div></div>
        <div class="seal">K</div>
        <div class="sig"><div class="s" style="font-family:'Plus Jakarta Sans';font-size:16px;font-weight:700;padding-top:14px">${dateStr}</div><div class="ln"></div><b>Date of Issue</b><div class="r">&nbsp;</div></div>
      </div>
    </div>
    <div class="no">Certificate No. ${no}</div>
  </div>
</body></html>`;
  const w=window.open('','_blank');
  if(!w){ toast('Please allow pop-ups to open the certificate','err'); return; }
  w.document.write(html); w.document.close(); if(o.print) setTimeout(()=>{ try{ w.focus(); w.print(); }catch(e){} },900);
}

/* ============================================================
   KEUANGAN — status tagihan & slip gaji guru (shared)
   ============================================================ */
/* Status pembayaran murid: LUNAS / TERVERIFIKASI (lunas) ·
   MENUNGGU VERIFIKASI (bukti dikirim ortu) · BELUM BAYAR (tagihan). */
const PAY_STATUS = {
  'LUNAS':{cls:'badge-paid',ic:'✅',label:'PAID'},
  'TERVERIFIKASI':{cls:'badge-paid',ic:'✅',label:'VERIFIED'},
  'MENUNGGU VERIFIKASI':{cls:'badge-pending',ic:'🕒',label:'AWAITING VERIFICATION'},
  'BELUM BAYAR':{cls:'badge-off',ic:'📌',label:'UNPAID'},
};
function payStatusBadge(s){ s=String(s||'LUNAS').toUpperCase(); const m=PAY_STATUS[s]||PAY_STATUS['LUNAS']; return `<span class="badge ${m.cls}">${m.ic} ${m.label||s}</span>`; }
function isPaid(s){ s=String(s||'').toUpperCase(); return s==='LUNAS'||s==='TERVERIFIKASI'; }

/* ===== Notifikasi: status pembayaran ortu & status gaji guru ===== */
const PAYROLL_PAID = ['DIBAYAR','DITERIMA','LUNAS','TRANSFER','SUDAH DIBAYAR','PAID','TERKIRIM'];
function payrollPaid(s){ return PAYROLL_PAID.includes(String(s||'').toUpperCase().trim()); }
/* Prepayment-slip workflow: GENERATED (by admin) → CONFIRMED (by teacher) → PROCESSING → DIBAYAR (sent) */
const PAYROLL_FLOW={
  GENERATED:{step:2,label:'Awaiting your confirmation',badge:'<span class="badge badge-pending">🕒 AWAITING CONFIRMATION</span>'},
  CONFIRMED:{step:3,label:'Confirmed by teacher',badge:'<span class="badge badge-active">✔️ CONFIRMED</span>'},
  PROCESSING:{step:3,label:'Payment processing',badge:'<span class="badge badge-purple">⏳ PROCESSING</span>'},
  DIPROSES:{step:3,label:'Payment processing',badge:'<span class="badge badge-purple">⏳ PROCESSING</span>'},
};
function payrollStatusInfo(s){
  const raw=String(s||'DIPROSES').toUpperCase().trim();
  if(payrollPaid(raw)) return {paid:true,step:4,label:'Paid',badge:'<span class="badge badge-paid">✅ PAID</span>'};
  const f=PAYROLL_FLOW[raw]; if(f) return {paid:false,...f};
  return {paid:false,step:2,label:'Pending',badge:'<span class="badge badge-pending">🕒 PENDING</span>'};
}
function monthName(m){ try{ return new Date(String(m)+'-01').toLocaleDateString('en-US',{month:'long',year:'numeric'}); }catch(e){ return m||''; } }
function rupiah(n){ return 'Rp '+(Number(n)||0).toLocaleString('id-ID'); }

/* Render daftar notifikasi ke sebuah container. items:[{level:'warn|ok|info',icon,title,sub}] */
function renderNotif(box, items){
  if(!box) return;
  if(!items || !items.length){ box.innerHTML=''; box.style.display='none'; return; }
  box.style.display='';
  const col={warn:'var(--orange)',ok:'var(--green2)',info:'var(--blue)'};
  box.innerHTML='<div class="card card-pad" style="margin-bottom:18px;padding:14px 16px;border-left:4px solid var(--orange)">'
    + '<div style="font-weight:700;color:var(--navy);margin-bottom:6px">🔔 Notifications <span style="background:var(--orange);color:#fff;border-radius:999px;font-size:11px;padding:1px 8px;margin-left:4px">'+items.length+'</span></div>'
    + items.map(n=>`<div style="display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-top:1px solid var(--line)">
        <span style="font-size:18px;line-height:1.3">${n.icon||'•'}</span>
        <div style="flex:1"><div style="font-weight:600;color:var(--ink);border-left:3px solid ${col[n.level]||col.info};padding-left:8px">${esc(n.title)}</div>
        ${n.sub?`<div style="font-size:12px;color:var(--muted);padding-left:11px;margin-top:2px">${esc(n.sub)}</div>`:''}</div></div>`).join('')
    + '</div>';
}

/* Notifikasi status gaji untuk GURU (dari tabel payroll). */
async function teacherPayNotifs(tutorId){
  let rows=[]; try{ rows=await API.getPayroll({tutor_id:tutorId})||[]; }catch(e){ return []; }
  rows=rows.slice().sort((a,b)=>String(b.month||'').localeCompare(String(a.month||'')));
  return rows.slice(0,3).map(r=>{
    const inf=payrollStatusInfo(r.status); const per=monthName(r.month);
    if(inf.paid) return {level:'ok',icon:'💰',title:`Salary for ${per} has been sent`,sub:(r.transfer_date?('Transferred '+prettyDate(r.transfer_date)+(r.amount?' · ':'')):'')+(r.amount?rupiah(r.amount):'')+(r.note?(' · '+r.note):'')};
    return {level:'warn',icon:'⏳',title:`Salary for ${per} not yet confirmed sent`,sub:'Status: '+inf.label+'. Awaiting admin transfer confirmation.'};
  });
}

/* Notifikasi tagihan untuk ORANG TUA (dari tabel payments). */
async function parentPayNotifs(studentId){
  let rows=[]; try{ rows=await API.getPayments({student_id:studentId})||[]; }catch(e){ return []; }
  return rows.filter(p=>!isPaid(p.status)).sort((a,b)=>String(a.month||'').localeCompare(String(b.month||''))).map(p=>{
    const per=monthName(p.month); const amt=p.grand_total||p.amount||p.next_deposit;
    const st=String(p.status||'').toUpperCase().trim();
    if(st==='MENUNGGU VERIFIKASI') return {level:'info',icon:'🕒',title:`Payment for ${per} awaiting verification`,sub:'Proof submitted — awaiting admin verification.'};
    return {level:'warn',icon:'📌',title:`Invoice for ${per} is unpaid`,sub:(amt?('Amount: '+rupiah(amt)+' · '):'')+'Please pay and upload proof in the Payment menu.'};
  });
}

/* Slip Pembayaran Fee Guru (bisa dipakai sebagai prepayment slip) — buka tab print/PDF */
function openPayrollSlip(o){
  o=o||{};
  const nm=esc(o.name||'Teacher');
  const period=esc(o.period||'');
  const sessions=o.sessions!=null?o.sessions:'-';
  const fee=Number(o.fee)||0, bonus=Number(o.bonus)||0, total=(o.total!=null?Number(o.total):fee+bonus);
  const note=esc(o.note||'');
  const transfer=esc(o.transfer_date||'');
  const status=esc((o.status||'PREPAYMENT').toUpperCase());
  const issuer=esc(o.issuer||'Kwelingo Academy');
  const no=esc(o.no||('KWE-PAY/'+new Date().getFullYear()+'/'+Math.floor(1000+Math.random()*9000)));
  const dateStr=esc(o.date||longToday());
  const logo=location.href.replace(/[^/]*$/,'')+'assets/logo.png';
  const rp=n=>'Rp '+(Number(n)||0).toLocaleString('id-ID');
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Slip Fee — ${nm}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Poppins:wght@400;500;600&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Poppins',sans-serif;background:#f3ece0;display:flex;align-items:flex-start;justify-content:center;min-height:100vh;padding:30px 18px}
  .slip{width:640px;max-width:100%;background:#FFF9F0;border:2px solid #8EC9D9;border-radius:14px;overflow:hidden;box-shadow:0 12px 44px rgba(0,0,0,.12)}
  .hd{background:linear-gradient(120deg,#8EC9D9,#5FA9BD);color:#fff;padding:20px 26px;display:flex;align-items:center;gap:14px}
  .hd img{height:46px;background:#fff;border-radius:10px;padding:4px}
  .hd .bn{font-family:'Fredoka';font-size:22px;font-weight:700;line-height:1.1}
  .hd .sb{font-size:11px;opacity:.9;letter-spacing:2px}
  .hd .tag{margin-left:auto;background:rgba(255,255,255,.22);padding:6px 12px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:1px}
  .bd{padding:24px 26px}
  .ttl{font-family:'Fredoka';font-size:20px;font-weight:700;color:#4B4540;margin-bottom:2px}
  .meta{display:flex;flex-wrap:wrap;gap:6px 30px;margin:14px 0 18px;font-size:13px;color:#4B4540}
  .meta b{color:#3E8A9E}
  table{width:100%;border-collapse:collapse;font-size:13.5px}
  td,th{padding:10px 12px;text-align:left;border-bottom:1px solid #ece1cf}
  th{background:#F7F1E6;color:#8a7a63;font-size:11px;letter-spacing:.5px}
  td.r,th.r{text-align:right}
  .tot{background:#EAF6FA}
  .tot td{font-family:'Fredoka';font-weight:700;font-size:16px;color:#3E8A9E;border:none}
  .note{margin-top:14px;font-size:12.5px;color:#6b6258;white-space:pre-line}
  .sign{display:flex;justify-content:space-between;margin-top:28px;font-size:12px;color:#8a8178}
  .sign .ln{border-top:1.5px solid #4B4540;width:170px;margin-bottom:6px;margin-top:40px}
  .sign b{color:#4B4540}
  .ft{text-align:center;font-size:10.5px;color:#b3a898;padding:12px}
  .pbar{position:fixed;top:0;left:0;right:0;background:#3E8A9E;color:#fff;padding:10px;text-align:center;font-size:13px;z-index:99}
  .pbar button{background:#fff;color:#3E8A9E;border:none;padding:7px 18px;border-radius:8px;font-weight:700;cursor:pointer;margin-left:10px;font-family:'Poppins'}
  @media print{.pbar{display:none}body{background:#fff;padding:0}.slip{box-shadow:none}@page{size:A4;margin:12mm}}
</style></head><body>
  <div class="pbar">💾 Simpan sebagai PDF → <b>Save as PDF</b> <button onclick="window.print()">🖨️ Download / Print</button></div>
  <div class="slip">
    <div class="hd"><img src="${logo}" alt=""><div><div class="bn">${issuer}</div><div class="sb">HOME FOR LANGUAGE LEARNERS</div></div><div class="tag">${status}</div></div>
    <div class="bd">
      <div class="ttl">Slip Pembayaran Fee Guru</div>
      <div class="meta">
        <div>Guru: <b>${nm}</b></div><div>Periode: <b>${period||'-'}</b></div>
        <div>Jumlah Sesi: <b>${sessions}</b></div>${transfer?`<div>Tgl Transfer: <b>${transfer}</b></div>`:''}
        <div>No: <b>${no}</b></div><div>Tgl Terbit: <b>${dateStr}</b></div>
      </div>
      <table>
        <thead><tr><th>Komponen</th><th class="r">Jumlah</th></tr></thead>
        <tbody>
          <tr><td>Fee Mengajar (${sessions} sesi)</td><td class="r">${rp(fee)}</td></tr>
          <tr><td>Komisi / Bonus</td><td class="r">${rp(bonus)}</td></tr>
          <tr class="tot"><td>TOTAL DITERIMA</td><td class="r">${rp(total)}</td></tr>
        </tbody>
      </table>
      ${note?`<div class="note">📝 ${note}</div>`:''}
      <div class="sign">
        <div><div class="ln"></div><b>${issuer}</b><div>Admin / Owner</div></div>
        <div><div class="ln"></div><b>${nm}</b><div>Penerima</div></div>
      </div>
    </div>
    <div class="ft">Slip ini sah sebagai bukti pembayaran fee / prepayment guru Kwelingo · ${no}</div>
  </div>
</body></html>`;
  const w=window.open('','_blank');
  if(!w){ toast('Please allow pop-ups to open the slip','err'); return; }
  w.document.write(html); w.document.close();
}

/* ============================================================
   FEEDBACK & BELAJAR — rating, diary, tasks (shared helpers)
   ============================================================ */
function starsHTML(n,max){
  n=Math.round(Number(n)||0); max=max||5; let s='';
  for(let i=1;i<=max;i++) s+=`<span style="color:${i<=n?'#F4C544':'#dcd3c4'}">★</span>`;
  return `<span style="font-size:15px;letter-spacing:1px">${s}</span>`;
}
function avgStars(list){ if(!list||!list.length) return 0; return list.reduce((a,r)=>a+(Number(r.stars)||0),0)/list.length; }
const TASK_STATUS={
  assigned:{label:'Assigned',cls:'badge-pending',ic:'🕒'},
  submitted:{label:'Submitted',cls:'badge-active',ic:'📤'},
  graded:{label:'Graded',cls:'badge-paid',ic:'⭐'},
  done:{label:'Done',cls:'badge-paid',ic:'✅'},   // kompatibel data lama
};
function taskStatus(t){ const s=(t&&t.status)||'assigned'; return s==='done'?'submitted':s; }
function taskBadge(s){ const m=TASK_STATUS[s||'assigned']||TASK_STATUS.assigned; return `<span class="badge ${m.cls}">${m.ic} ${m.label.toUpperCase()}</span>`; }
// Jenis Extended Practice
const TASK_TYPES={
  writing:'Writing', speaking:'Speaking', reading:'Reading', listening:'Listening', other:'Other',
  assignment:'Assignment', lesson_review:'Lesson Review',
  final_project:'Final Project', peer_case:'Peer Case-Study', voice_video:'Voice/Video Recording',
};
const TASK_TYPE_META={
  writing:{ic:'📝',cls:'badge-purple'}, speaking:{ic:'🎙️',cls:'badge-off'}, reading:{ic:'📖',cls:'badge-active'},
  listening:{ic:'🎧',cls:'badge-paid'}, other:{ic:'☰',cls:'badge-pending'}, voice_video:{ic:'🎙️',cls:'badge-off'},
  assignment:{ic:'📄',cls:'badge-grey'}, final_project:{ic:'🏁',cls:'badge-pending'}, lesson_review:{ic:'🔁',cls:'badge-grey'}, peer_case:{ic:'🤝',cls:'badge-grey'},
};
function taskTypeLabel(t){ return TASK_TYPES[t]||'Task'; }
function taskTypeBadge(t){ const m=TASK_TYPE_META[t]||{ic:'📄',cls:'badge-grey'}; return `<span class="badge ${m.cls}">${m.ic} ${esc(taskTypeLabel(t))}</span>`; }

/* ---- shared helpers for rev4–6 portals ---- */
// Direct-message room id (order-independent): dm:<a>|<b>
function dmRoom(a,b){ return 'dm:'+[String(a),String(b)].sort().join('|'); }
// Teacher fee for one student-session, prorated by duration (same rule as Super Admin)
function sessionFee(stu,c){
  const norm=Number((stu||{}).meeting_minutes)||90, per=Number((stu||{}).fee_tentor)||0, dur=Number((c||{}).duration)||norm;
  return Math.round(per/norm*dur);
}
function initials(name){ const p=String(name||'?').replace(/^(ms|mr|mrs|miss)\.?\s+/i,'').trim().split(/\s+/); return ((p[0]||'?')[0]+(p[1]?p[1][0]:'')).toUpperCase(); }
function monthLabel(m){ try{ return new Date(String(m)+'-01T00:00:00').toLocaleDateString('en-US',{month:'long',year:'numeric'}); }catch(e){ return m; } }
function shortDate(iso){ if(!iso) return '-'; const d=new Date(String(iso).slice(0,10)+'T00:00:00'); return isNaN(d)?iso:d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}); }

/* Monthly Learning Report (rev6 format) — printable / Save as PDF.
   o = {student, program, level, teacher, month:'YYYY-MM', rows:[{date,topic,strengths,improve,strategy}]} */
function openMonthlyReport(o){
  o=o||{}; const rows=o.rows||[], st=o.stats||null;
  const body=`<style>.mr th{font-size:11px}.mr th svg{vertical-align:-2px;margin-right:3px}.mr th.s{background:#2FA86B}.mr th.i{background:#E5605A}.mr th.g{background:#FF9300}.mr td{line-height:1.5;vertical-align:top}.mr td.d{text-align:center;width:70px}.mr td.d b{display:block;font-size:16px}.mr td.d small{color:#7A88A6}
  .mst{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:-4px 0 18px}.mst div{background:#F2F8FD;border-radius:12px;padding:10px 12px}.mst small{display:block;font-size:10.5px;color:#5B6B8C;font-weight:700}.mst b{font-size:18px}
  @media(max-width:700px){.mst{grid-template-columns:repeat(2,minmax(0,1fr))}}</style>
<div class="tl"><div><h1>MONTHLY REPORT</h1><div class="s">Learning Progress · ${esc(monthLabel(o.month))}</div></div><div style="text-align:right"><span class="no">${esc(monthLabel(o.month))}</span></div></div>
<div class="info"><div class="bill"><div class="lb">Student</div><div class="who">${kwDocIc('user')}<div><div class="nm">${esc(o.student||'-')}</div><div class="ln">Monthly learning progress report</div>${o.parent?`<div class="ln">Parent : <b>${esc(o.parent)}</b></div>`:''}</div></div></div>
  <div class="dl"><div class="dr">${kwDocIc('book')}<span>Program</span><span>:</span><b>${esc(o.program||'-')}</b></div><div class="dr">${kwDocIc('id')}<span>Level</span><span>:</span><b>${esc(o.level||'-')}</b></div><div class="dr">${kwDocIc('user')}<span>Teacher</span><span>:</span><b>${esc(o.teacher||'-')}</b></div><div class="dr">${kwDocIc('cal')}<span>Period</span><span>:</span><b>${esc(monthLabel(o.month))}</b></div></div></div>
${st?`<div class="mst"><div><small>SESSIONS</small><b>${st.sessions}</b></div><div><small>ATTENDED</small><b>${st.attended}</b></div><div><small>ATTENDANCE</small><b>${st.pct}</b></div><div><small>TEACHER NOTES</small><b>${rows.filter(r=>r.strengths||r.improve||r.strategy).length}</b></div></div>`:''}
<div class="tw"><table class="mr"><thead><tr><th class="c" style="width:70px"># Date</th><th>Topic</th><th class="s">${kwLi('star',13)} Strengths</th><th class="i">${kwLi('target',13)} Areas to Improve</th><th class="g">${kwLi('lightbulb',13)} Improvement Strategies</th></tr></thead>
<tbody>${rows.length?rows.map((r,i)=>`<tr><td class="d"><b>${i+1}</b><small>${esc(shortDate(r.date))}</small></td><td><b>${esc(r.topic||'-')}</b></td><td>${esc(r.strengths||'-')}</td><td>${esc(r.improve||'-')}</td><td>${esc(r.strategy||'-')}</td></tr>`).join(''):'<tr><td colspan="5" style="text-align:center;color:#7A88A6;padding:22px">No sessions or teacher notes for this month yet.</td></tr>'}</tbody></table></div>
<div class="note">${kwDocIc('info')}<span>Strengths, areas to improve and strategies are written by the teacher after each session. Questions? Chat with our admin anytime.</span></div>
<div class="thx"><h3 class="kw">Your journey matters!</h3><p>We celebrate your efforts, progress, and willingness to learn.<br>Keep exploring, practising, and growing with Kwelingo!</p></div>`;
  const w=o.win||window.open('','_blank'); if(!w){ toast('Please allow pop-ups to open the report','err'); return; }
  w.document.open(); w.document.write(kwDocShell({title:'Monthly Report — '+(o.student||'')+' — '+monthLabel(o.month),body})); w.document.close();
}
// Kategori rating kelas & guru (rubrik 1-5)
const RATING_CATS=[
  'The teacher explains the material clearly',
  'The class material is useful',
  'The lesson is well organized',
  'The teacher encourages student participation',
  'The class activities are engaging',
  'The assignments are appropriate',
  'The class atmosphere is comfortable',
  'Overall I am satisfied with this class',
];
function parseScores(r){ try{ return r&&r.scores?(typeof r.scores==='string'?JSON.parse(r.scores):r.scores):[]; }catch(e){ return []; } }

/* ============================================================
   KOMUNIKASI — chat (polling) & rekaman kelas (shared)
   ============================================================ */
// Render satu feed chat ke elemen el; meId = id pengguna sekarang (pesannya di kanan)
function renderChatFeed(el,list,meId){
  if(!el) return;
  el.innerHTML=(list||[]).map(m=>{
    const me=String(m.sender_id)===String(meId);
    const RL={guru:'teacher',murid:'student',ortu:'parent',admin:'admin'}; const role=m.role?`<span style="color:var(--muted);font-weight:500;font-size:10px"> · ${esc(RL[m.role]||m.role)}</span>`:'';
    return `<div class="msg ${me?'me':''}"><div class="av">${(String(m.sender_name||'?')[0]||'?').toUpperCase()}</div>
      <div class="bub"><b>${esc(m.sender_name||'')}${role}</b>${esc(m.message||'')}<div class="t">${m.created_at?prettyDate(String(m.created_at).slice(0,10)):''}</div></div></div>`;
  }).join('') || '<div class="muted" style="text-align:center;padding:20px">No messages yet. Start the conversation 👋</div>';
  el.scrollTop=el.scrollHeight;
}
// Polling chat: panggil start(room) untuk mulai, stop() saat pindah view
function makeChatPoller(renderFn,intervalMs){
  let timer=null, room=null, lastLen=-1;
  async function tick(force){
    if(!room) return;
    let list=[]; try{ list=await API.getChat({room})||[]; }catch(e){ return; }
    if(force || list.length!==lastLen){ lastLen=list.length; renderFn(list); }
  }
  return {
    start(r){ room=r; lastLen=-1; tick(true); clearInterval(timer); timer=setInterval(tick,intervalMs||4000); },
    stop(){ clearInterval(timer); timer=null; room=null; },
    refresh(){ tick(true); }
  };
}
// Perekam voice note → data URL (base64). Butuh izin mikrofon.
const VoiceRec={
  rec:null,chunks:[],stream:null,
  supported(){ return !!(navigator.mediaDevices && window.MediaRecorder); },
  async start(){
    this.stream=await navigator.mediaDevices.getUserMedia({audio:true});
    this.chunks=[]; this.rec=new MediaRecorder(this.stream);
    this.rec.ondataavailable=e=>{ if(e.data&&e.data.size) this.chunks.push(e.data); };
    this.rec.start();
  },
  stop(){
    return new Promise(res=>{
      if(!this.rec){ res(null); return; }
      this.rec.onstop=()=>{
        const blob=new Blob(this.chunks,{type:(this.chunks[0]&&this.chunks[0].type)||'audio/webm'});
        try{ (this.stream.getTracks()||[]).forEach(t=>t.stop()); }catch(e){}
        const r=new FileReader(); r.onload=()=>res(r.result); r.readAsDataURL(blob);
      };
      this.rec.stop();
    });
  }
};
function hasRec(c){ return !!(c && (c.rec_audio||c.rec_video)); }
// Sel rekaman (audio player + link video) untuk ditampilkan di tabel/laporan
function recCell(c){
  const parts=[];
  if(c.rec_audio) parts.push(`<audio controls preload="none" src="${c.rec_audio}" style="height:34px;max-width:200px;vertical-align:middle"></audio>`);
  if(c.rec_video){ const yt=/youtu|vimeo/i.test(c.rec_video); parts.push(`<a class="btn btn-outline btn-sm" href="${c.rec_video}" target="_blank">${yt?'▶️ Tonton Video':'🔗 Video'}</a>`); }
  return parts.length?parts.join(' '):'<span class="muted">-</span>';
}

/* ============================================================
   DEMO DATA  (mirrors the mockups; used until SCRIPT_URL is set)
   ============================================================ */
const DEMO = {
  tutors:[
    {id:'t1',nama:'Mr. Yesaya',subject:'Math',   level:'Upper Secondary (SMA)',address:'Jl. Ngagel 3, Surabaya',dob:'1995-04-10',wa:'081200000001',pin:'2468',category:'Local',age_group:'Teens',employment_type:'Full time',joining_date:'2024-01-15',teaching_location:'Hybrid',program:'Boost English',bank_name:'BCA',bank_holder:'Yesaya',bank_account:'0520111222',status:'Active'},
    {id:'t2',nama:'Ms. Dian',  subject:'Science',level:'Lower Secondary (SMP)',address:'Jl. Manyar 7, Surabaya',dob:'1996-11-02',wa:'081200000002',pin:'1357',category:'Local',age_group:'Teens',employment_type:'Part time',joining_date:'2024-06-01',teaching_location:'Online',program:'Speak Active',bank_name:'BCA',bank_holder:'Dian',bank_account:'0520333444',status:'Active'},
    {id:'t3',nama:'Mr. Kevin', subject:'English',level:'Primary (SD)',         address:'Jl. Darmo 21, Surabaya',dob:'1994-07-19',wa:'081200000003',pin:'9753',category:'International',age_group:'Kids',employment_type:'Part time',joining_date:'2025-02-10',teaching_location:'Onsite',program:'Boost English',bank_name:'BCA',bank_holder:'Kevin',bank_account:'0520555666',status:'Active'},
  ],
  students:[
    {id:'s1',nama:'Anton Wijaya',school:'SMP Petra 1',address:'Jl. Kertajaya 12, Surabaya',dob:'2013-05-14',grade:'7',gender:'Male',student_wa:'',parent_name:'Mrs. Rina Wijaya',wa_ortu:'081234567890',
     tutor_id:'t1',schedule:'Mon & Thu · 19.00',class_group:'English A · Mon&Thu 19.00',program:'Boost English',level:'A2',class_type:'Semi-Private',class_id:'CLS-0001',start_date:'2026-06-01',learning_mode:'Onsite',course_due:'2026-11-01',status:'Active',fee_per_meeting:150000,fee_tentor:90000,meeting_minutes:90,
     deposit_meetings:16,add_fee:300000,add_fee_note:'Olympiad class fee (August)',pin:'1111',active:'aktif',link_id:'anton-s1'},
    {id:'s2',nama:'Budi Santoso',school:'SMP Cita Hati',address:'Jl. Diponegoro 45, Surabaya',dob:'2012-09-03',grade:'8',gender:'Male',student_wa:'',parent_name:'Mr. Hadi',wa_ortu:'081234500011',
     tutor_id:'t2',schedule:'Tue · 16.00',class_group:'English A · Mon&Thu 19.00',program:'Boost English',level:'A2',class_type:'Semi-Private',class_id:'CLS-0001',start_date:'2026-06-01',learning_mode:'Online',course_due:'2026-11-01',status:'Active',fee_per_meeting:150000,fee_tentor:90000,meeting_minutes:90,
     deposit_meetings:8,pin:'2222',active:'aktif',link_id:'budi-s2'},
    {id:'s3',nama:'Clara Halim',school:'SD Gloria',address:'Jl. Mayjend Sungkono 8, Surabaya',dob:'2014-01-22',grade:'6',gender:'Female',student_wa:'',parent_name:'Mrs. Mega',wa_ortu:'081234500022',
     tutor_id:'t3',schedule:'Wed & Fri · 15.30',program:'Boost Mandarin',level:'HSK 1',class_type:'Private',class_id:'',start_date:'2026-07-01',learning_mode:'Onsite',course_due:'2026-11-15',status:'Active',fee_per_meeting:140000,fee_tentor:85000,meeting_minutes:90,
     deposit_meetings:12,pin:'3333',active:'aktif',link_id:'clara-s3'},
  ],
  classes:[
    {id:'c101',date:todayStr(),student_id:'s1',tutor_id:'t1',start_time:'19:00',end_time:'',duration:90,type:'onsite',topic:'',note:'',material_url:'',doc_url:'',
     stu_in:'',stu_out:'',tut_in:'',tut_out:''},
    {id:'c102',date:todayStr(),student_id:'s2',tutor_id:'t2',start_time:'16:00',end_time:'',duration:90,type:'online',topic:'',note:'',material_url:'',doc_url:'',
     stu_in:'',stu_out:'',tut_in:'',tut_out:''},
    // history for Anton
    {id:'c1',date:'2026-07-28',student_id:'s1',tutor_id:'t1',start_time:'19:00',end_time:'20:30',duration:90,type:'onsite',
     topic:'Linear Equation (Persamaan Linear)',note:'Anton is quite active and understands the material well.',material_url:'materi/linear-equation.pdf',doc_url:'doc1'},
    {id:'c2',date:'2026-07-21',student_id:'s1',tutor_id:'t1',start_time:'19:00',end_time:'20:30',duration:90,type:'onsite',status:'done',attend:'izin',
     topic:'Algebraic Fractions',note:'Needs more practice with word problems.',material_url:'materi/algebraic-fractions.pdf',doc_url:'doc2'},
    {id:'c3',date:'2026-07-14',student_id:'s1',tutor_id:'t1',start_time:'19:00',end_time:'21:00',duration:120,type:'onsite',
     topic:'Linear Inequalities',note:'Class extended by 30 minutes.',material_url:'materi/inequalities.pdf',doc_url:'doc3'},
    {id:'c4',date:'2026-07-07',student_id:'s1',tutor_id:'t1',start_time:'19:00',end_time:'20:30',duration:90,type:'onsite',
     topic:'Integers',note:'Anton is getting used to it.',material_url:'materi/integers.pdf',doc_url:'doc4'},
    {id:'c5',date:'2026-06-30',student_id:'s1',tutor_id:'t1',start_time:'19:00',end_time:'20:30',duration:90,type:'onsite',status:'done',attend:'hadir',
     topic:'Introduction to Algebra',note:'Good job!',material_url:'materi/intro-algebra.pdf',doc_url:'doc5',rec_video:'https://youtu.be/dQw4w9WgXcQ'},
    // --- demo permintaan kelas (status requested / reschedule) ---
    {id:'r1',date:'2026-09-20',student_id:'s2',tutor_id:'t2',start_time:'16:00',end_time:'',duration:90,type:'online',status:'requested',req_by:'ortu',
     req_note:'Requesting an extra Science session before the exam.',topic:'',note:''},
    {id:'r2',date:'2026-09-18',student_id:'s3',tutor_id:'t3',start_time:'15:30',end_time:'',duration:90,type:'onsite',status:'reschedule',req_by:'murid',
     resched_date:'2026-09-19',resched_time:'16:30',resched_note:'Clashes with a school event, please reschedule.',topic:'',note:''},
  ],
  deposits:{
    s1:{paid_meetings:16,minutes_total:1440,minutes_used:900,fee_per_meeting:150000,last_paid:'2026-07-20'},
    s2:{paid_meetings:8, minutes_total:720, minutes_used:360,fee_per_meeting:150000,last_paid:'2026-07-05'},
    s3:{paid_meetings:12,minutes_total:1080,minutes_used:540,fee_per_meeting:140000,last_paid:'2026-07-10'},
  },
  payments:[
    {id:'pay1',student_id:'s1',month:'2026-06',pay_date:'2026-06-01',meetings:8,price_per_meet:150000,duration:90,
     deposit_total:1200000,carry_in:0,extra_minutes:0,add_fee1:0,add_fee2:0,add_fee2_note:'',next_meetings:8,next_deposit:1200000,grand_total:1200000,status:'LUNAS'},
    {id:'pay2',student_id:'s1',month:'2026-09',pay_date:'2026-09-01',meetings:8,price_per_meet:150000,duration:90,
     deposit_total:1200000,carry_in:0,extra_minutes:0,add_fee1:0,add_fee2:0,add_fee2_note:'',next_meetings:8,next_deposit:1200000,grand_total:1200000,status:'BELUM BAYAR'},
  ],
  payroll:[
    {id:'pr1',tutor_id:'t1',month:'2026-08',amount:2400000,transfer_date:'2026-09-03',proof_url:'',note:'Salary + August bonus',status:'DIBAYAR',created_at:'2026-09-03T09:00:00'},
    {id:'pr2',tutor_id:'t1',month:'2026-09',amount:2550000,transfer_date:'2026-10-03',proof_url:'',note:'September teaching fee',status:'DIBAYAR',generated_at:'2026-09-30T10:00:00',confirmed_at:'2026-10-01T08:00:00',sent_at:'2026-10-03T09:00:00',created_at:'2026-10-01T09:00:00'},
    {id:'pr3',tutor_id:'t1',month:'2026-10',amount:0,transfer_date:'',proof_url:'',note:'',status:'GENERATED',generated_at:'2026-10-27T10:15:00',created_at:'2026-10-27T10:15:00'},
  ],
  parents:[
    {id:'pa1',parent_id:'PAR-0001',username:'rinawijaya',pin:'1234',nama:'Mrs. Rina Wijaya',wa:'081234567890',linked_students:'Anton Wijaya (s1), Budi Santoso (s2)',status:'Active',relation:'Mother'},
    {id:'pa2',parent_id:'PAR-0002',username:'hadi',pin:'2222',nama:'Mr. Hadi',wa:'081234500011',linked_students:'Budi Santoso (s2)',status:'Active',relation:'Father'},
  ],
  class_groups:[
    {id:'cg1',class_id:'CLS-0001',name:'Boost English (Teens) – A2',program:'Boost English',level:'A2',tutor_id:'t1',student_ids:'s1,s2',schedule:'Mon & Thu · 19.00',days:'Mon,Thu',start_time:'19:00',end_time:'20:30',room:'Room 2',mode:'Onsite',start_date:'2026-09-01',end_date:'2026-12-20',total_sessions:32,min_cert:26,status:'In progress',created_at:'2026-09-01T09:00:00'},
    {id:'cg2',class_id:'CLS-0002',name:'Boost English (Teens) – B1',program:'Boost English',level:'B1',tutor_id:'',student_ids:'',max_students:8,schedule:'Tue & Thu · 16.00',days:'Tue,Thu',start_time:'16:00',end_time:'17:30',room:'Room 1',mode:'Onsite',start_date:'2026-11-12',end_date:'2027-02-28',total_sessions:32,min_cert:26,status:'Open',admin_notes:'Looking for a teacher with experience teaching teens. The class will focus on communication and practical speaking skills.',created_at:'2026-10-24T09:00:00'},
    {id:'cg3',class_id:'CLS-0003',name:'Speak Active – Speaking Club',program:'Speak Active',level:'A2',tutor_id:'',student_ids:'',max_students:10,schedule:'Sat · 10.00',days:'Sat',start_time:'10:00',end_time:'11:30',room:'Room 1',mode:'Onsite',start_date:'2026-11-21',end_date:'2027-02-28',total_sessions:16,min_cert:13,status:'Open',admin_notes:'Fun, conversation-focused club for teens.',created_at:'2026-10-25T09:00:00'},
    {id:'cg4',class_id:'CLS-0004',name:'IELTS Preparation – B1',program:'IELTS Preparation',level:'B1',tutor_id:'t3',student_ids:'',max_students:6,schedule:'Tue & Thu · 19.00',days:'Tue,Thu',start_time:'19:00',end_time:'20:30',room:'Zoom',mode:'Online',start_date:'2026-11-08',end_date:'2027-02-28',total_sessions:32,min_cert:26,status:'Filled',admin_notes:'',created_at:'2026-10-20T09:00:00'},
  ],
  class_applications:[
    {id:'ca1',group_id:'cg1',tutor_id:'t1',status:'accepted',responded_at:'2026-08-25T10:00:00',created_at:'2026-08-25T10:00:00'},
  ],
  lesson_plans:[
    {id:'lp1',tutor_id:'t1',group_id:'cg1',date:'2026-10-19',unit:'Unit 1 – Everyday Life',topic:'Introducing Yourself and Others',objectives:'Use basic personal information to introduce themselves and others.\nAsk and answer simple questions about name, age, nationality and hobbies.',reading:'Short profile texts (student introductions)',listening:'Listen to a model conversation (introductions)',speaking:'Pair work: introduce themselves\nRole play: meeting a new classmate',writing:'Complete a short self-introduction paragraph',practice:'Matching activity (names and information)\nGuided conversation in pairs',production:'Mini presentation: introduce a classmate',extended:'Write a short paragraph introducing themselves (80–100 words).',status:'Submitted',submitted_at:'2026-10-18T20:00:00',created_at:'2026-10-18T20:00:00'},
    {id:'lp2',tutor_id:'t1',group_id:'cg1',date:'2026-10-22',unit:'Unit 1 – Everyday Life',topic:'Daily Routines',objectives:'Talk about daily routines using the present simple.\nUse time expressions (in the morning, at night).',reading:'',listening:'Short audio about a student\'s day',speaking:'Pair work: ask and answer about daily routines',writing:'5 sentences about your routine',practice:'Vocabulary matching: daily activities',production:'Create your own daily schedule',extended:'Record a 1-minute voice note about your day.',status:'Submitted',submitted_at:'2026-10-21T21:00:00',created_at:'2026-10-21T21:00:00'},
    {id:'lp3',tutor_id:'t1',group_id:'cg1',date:'2026-10-29',unit:'Unit 2 – Hobbies',topic:'Hobbies and Interests',objectives:'Talk about hobbies and give reasons.',status:'Draft',created_at:'2026-10-26T21:00:00'},
  ],
  dev_notes:[
    {id:'dn1',student_id:'s1',tutor_id:'t1',group_id:'cg1',date:'2026-10-19',topic:'Introducing Yourself and Others',strengths:'Confident in self-introduction; uses common greetings correctly.',improve:'Needs more variety in follow-up questions; pronunciation of the "th" sound.',strategy:'Practise asking at least 3 follow-up questions in each conversation; listen and repeat "th" words.',encourage:'Great start, Anton! You are already speaking with more confidence.',created_at:'2026-10-19T21:00:00'},
    {id:'dn2',student_id:'s1',tutor_id:'t1',group_id:'cg1',date:'2026-10-22',topic:'Daily Routines',strengths:'Uses correct present tense structure; good use of time expressions.',improve:'Needs to expand vocabulary for daily activities.',strategy:'Learn and use 5 new daily-activity words in sentences.',encourage:'Nice work! Your sentences are getting longer and clearer.',created_at:'2026-10-22T21:00:00'},
    {id:'dn3',student_id:'s2',tutor_id:'t1',group_id:'cg1',date:'2026-10-22',topic:'Daily Routines',strengths:'Good listening comprehension.',improve:'Third person -s.',strategy:'Make 5 sentences about a family member\'s routine.',encourage:'Keep it up, Budi!',created_at:'2026-10-22T21:10:00'},
  ],
  resources:[
    {id:'rs1',title:'Unit 1 – Teacher\'s Guide.pdf',note:'Overview, teaching notes and lesson flow.',program:'Boost English (Teens)',unit:'Unit 1 – Everyday Life',kind:'material',size:'2.1 MB',file_url:'#',created_at:'2026-09-01T09:00:00'},
    {id:'rs2',title:'Unit 1 – Student Book.pdf',note:'Student materials and activities.',program:'Boost English (Teens)',unit:'Unit 1 – Everyday Life',kind:'material',size:'5.4 MB',file_url:'#',created_at:'2026-09-01T09:01:00'},
    {id:'rs3',title:'Unit 1 – Worksheets.pdf',note:'Extra practice worksheets.',program:'Boost English (Teens)',unit:'Unit 1 – Everyday Life',kind:'material',size:'1.8 MB',file_url:'#',created_at:'2026-09-01T09:02:00'},
    {id:'rs4',title:'Unit 2 – Teacher\'s Guide.pdf',note:'Hobbies unit teaching notes.',program:'Boost English (Teens)',unit:'Unit 2 – Hobbies',kind:'material',size:'1.9 MB',file_url:'#',created_at:'2026-09-01T09:03:00'},
    {id:'rs5',title:'Speaking Club – Activity Pack.pdf',note:'Warm-ups and conversation games.',program:'Speak Active',unit:'Unit 1 – Getting to Know You',kind:'material',size:'1.2 MB',file_url:'#',created_at:'2026-09-01T09:04:00'},
    {id:'rs6',title:'HSK 1 – Vocabulary List.pdf',note:'Key vocabulary and phrases.',program:'Boost Mandarin',unit:'Unit 1 – Greetings',kind:'material',size:'0.9 MB',file_url:'#',created_at:'2026-09-01T09:05:00'},
    {id:'sop1',title:'Teacher Handbook.pdf',category:'General',kind:'sop',size:'1.2 MB',file_url:'#',created_at:'2026-10-15T09:00:00'},
    {id:'sop2',title:'Teaching Guidelines.pdf',category:'Teaching',kind:'sop',size:'1.5 MB',file_url:'#',created_at:'2026-10-15T09:01:00'},
    {id:'sop3',title:'Class Management SOP.pdf',category:'Class Management',kind:'sop',size:'1.1 MB',file_url:'#',created_at:'2026-10-15T09:02:00'},
    {id:'sop4',title:'Attendance Policy.pdf',category:'General',kind:'sop',size:'800 KB',file_url:'#',created_at:'2026-10-10T09:00:00'},
    {id:'sop5',title:'Rescheduling & Recovery Class SOP.pdf',category:'Class Management',kind:'sop',size:'900 KB',file_url:'#',created_at:'2026-10-10T09:01:00'},
    {id:'sop6',title:'Payment & Prepayment Guidelines.pdf',category:'Admin & Payment',kind:'sop',size:'1.3 MB',file_url:'#',created_at:'2026-10-10T09:02:00'},
  ],
  ratings:[
    {id:'rt1',class_id:'c5',student_id:'s1',tutor_id:'t1',stars:5,scores:[5,5,5,4,5,5,5,5],liked:'The teaching style is fun!',improve:'Maybe more practice exercises.',comment:'The explanations are super clear, thank you Mr. Yesaya!',created_at:'2026-06-30T20:40:00'},
  ],
  tboard:[
    {id:'tb1',program:'General',title:'Monthly Coordination Meeting',body:'All teachers must attend the coordination meeting on Saturday 13 Sep at 10.00 via Zoom. Agenda: class evaluation & new schedule.',date:'2026-09-08',author:'Owner',created_at:'2026-09-08T08:00:00'},
    {id:'tb2',program:'Boost English',title:'New Report Template',body:'Starting this month, please use the new LDS template. The link is in Teaching Resources.',date:'2026-09-01',author:'Admin',created_at:'2026-09-01T09:00:00'},
  ],
  tboard_read:[
    {id:'tb2_t1',board_id:'tb2',reader_id:'t1',reader_name:'Mr. Yesaya',read_at:'2026-09-02T07:30:00'},
  ],
  announcements:[
    {id:'an1',title:'National Holiday',body:'Kwelingo is closed on 17 August. Classes are cancelled.',date:'2026-08-10',class_group:'',author:'Owner',created_at:'2026-08-10T08:00:00'},
    {id:'an2',title:'Schedule Change This Week',body:'The English A class on Monday is moved to Tuesday at 19.00 because the teacher has an event.',date:'2026-09-09',class_group:'English A · Mon&Thu 19.00',author:'Admin',created_at:'2026-09-09T10:00:00'},
  ],
  _settings:{TEACHER_SOP_URL:'https://drive.google.com/file/d/1example/preview'},
  diary:[
    {id:'dy1',student_id:'s1',tutor_id:'t1',author:'murid',message:"Sir, I'm still confused about the factorization part.",created_at:'2026-07-20T10:00:00'},
    {id:'dy2',student_id:'s1',tutor_id:'t1',author:'guru',message:"No worries Anton, we'll go over it slowly tomorrow. Try doing WS page 12 first.",created_at:'2026-07-20T12:30:00'},
    {id:'dy3',student_id:'s1',tutor_id:'t1',group_id:'cg1',author:'murid',class_date:'2026-10-22',learned:'Today we learned how to talk about daily routines using the present simple.',struggle:'I sometimes forget the -s for he/she.',resolve:'I will write 5 sentences about my family every day and check them.',teacher_comment:'Great reflection, Anton! Try saying your sentences out loud too. 👍',comment_at:'2026-10-22T21:30:00',created_at:'2026-10-22T20:45:00'},
    {id:'dy4',student_id:'s2',tutor_id:'t1',group_id:'cg1',author:'murid',class_date:'2026-10-22',learned:'We practised describing our day and time expressions.',struggle:'Using "at", "in" and "on" with time.',resolve:'I will review the time-preposition table and make examples.',created_at:'2026-10-22T20:50:00'},
  ],
  tasks:[
    {id:'tk1',student_id:'s1',tutor_id:'t1',group_id:'cg1',batch_id:'b1',unit:'Unit 1 – Everyday Life',title:'Introduce Yourself (Voice Recording)',detail:'Record a 1–2 minute audio about yourself: name, family, hobbies.',type:'voice_video',due_date:'2026-10-30',status:'assigned',done_at:''},
    {id:'tk4',student_id:'s2',tutor_id:'t1',group_id:'cg1',batch_id:'b1',unit:'Unit 1 – Everyday Life',title:'Introduce Yourself (Voice Recording)',detail:'Record a 1–2 minute audio about yourself: name, family, hobbies.',type:'voice_video',due_date:'2026-10-30',status:'submitted',submit_url:'https://drive.google.com/file/d/zzz',submit_at:'2026-10-26'},
    {id:'tk5',student_id:'s2',tutor_id:'t1',group_id:'cg1',batch_id:'b2',unit:'Unit 1 – Everyday Life',title:'Write a short travel review',detail:'Write a review of your dream travel destination (min. 100 words).',type:'writing',due_date:'2026-10-22',status:'assigned'},
    {id:'tk2',student_id:'s1',tutor_id:'t1',group_id:'cg1',batch_id:'b2',unit:'Unit 1 – Everyday Life',title:'Write a short travel review',detail:'Write a review of your dream travel destination (min. 100 words).',type:'writing',due_date:'2026-07-22',status:'graded',submit_text:'My dream destination is Japan...',submit_url:'https://drive.google.com/file/d/xxx',submit_at:'2026-07-21',points:'90',feedback:'Great! Watch your past tense.',graded_at:'2026-07-22'},
    {id:'tk3',student_id:'s1',tutor_id:'t1',group_id:'cg1',batch_id:'b3',title:'Final Project: Presentation',detail:'Upload your final presentation file.',type:'final_project',due_date:'2026-08-05',status:'submitted',submit_url:'https://drive.google.com/file/d/yyy',submit_text:'',submit_at:'2026-08-01'},
  ],
  chat:[
    {id:'ch1',room:'kelas:English A · Mon&Thu 19.00',sender_id:'s2',sender_name:'Budi Santoso',role:'murid',message:"Hey everyone, what's the answer to homework number 5?",created_at:'2026-09-10T09:00:00'},
    {id:'ch2',room:'kelas:English A · Mon&Thu 19.00',sender_id:'s1',sender_name:'Anton Wijaya',role:'murid',message:'I got 12, what about you?',created_at:'2026-09-10T09:05:00'},
    {id:'ch3',room:'guru',sender_id:'t1',sender_name:'Mr. Yesaya',role:'guru',message:"Good morning, don't forget to fill in today's class report.",created_at:'2026-09-11T07:30:00'},
    {id:'ch4',room:'guru',sender_id:'admin',sender_name:'Admin',role:'admin',message:"Noted sir. I've updated next week's schedule.",created_at:'2026-09-11T07:45:00'},
    {id:'ch5',room:'prog:Boost English',sender_id:'t3',sender_name:'Mr. Kevin',role:'guru',message:"I've uploaded the new Unit 5 handouts to Teaching Resources.",created_at:'2026-10-26T09:15:00'},
    {id:'ch6',room:'prog:Speak Active',sender_id:'t2',sender_name:'Ms. Dian',role:'guru',message:'Great idea for the speaking club warm-up!',created_at:'2026-10-25T16:00:00'},
    {id:'ch7',room:'admin-team',sender_id:'admin',sender_name:'Admin',role:'admin',message:'Reminder: please update attendance within 24 hours.',created_at:'2026-10-24T09:00:00'},
    {id:'ch8',room:'dm:s1|t1',sender_id:'s1',sender_name:'Anton Wijaya',role:'murid',message:"Hi Mr. Yesaya, I won't be able to attend Thursday's class because of a school event. Can we reschedule?",created_at:'2026-10-26T16:12:00'},
    {id:'ch9',room:'dm:admin|t1',sender_id:'admin',sender_name:'Kwelingo Admin',role:'admin',message:'Your October prepayment slip is ready for review.',created_at:'2026-10-27T10:20:00'},
  ],
  handle(p){
    return new Promise((res,rej)=>{
      setTimeout(()=>{ try{ res(this._route(p)); }catch(e){ rej(e); } },120); // tiny delay to feel real
    });
  },
  _route(p){
    const clone=x=>JSON.parse(JSON.stringify(x));
    switch(p.action){
      // ---- generic CRUD (rev4+) ----
      case 'list':{
        const f=p.filters||{}; let r=clone(this[p.table]||[]);
        r=r.filter(x=>Object.entries(f).every(([k,v])=>v===undefined||v===null||v===''||String(x[k]??'')===String(v)));
        const [col,dir]=String(p.order||'created_at.desc').split('.');
        if(col) r.sort((x,y)=>String(x[col]??'').localeCompare(String(y[col]??''))*(dir==='desc'?-1:1));
        return r;
      }
      case 'upsert':{
        const t=p.table, d=p.d||{}; this[t]=this[t]||[];
        if(d.id){ const e=this[t].find(x=>x.id===d.id); if(e){ Object.keys(d).forEach(k=>{ if(d[k]!==undefined&&d[k]!==null) e[k]=d[k]; }); return {id:d.id}; } }
        const id=d.id||(t.slice(0,3)+Date.now().toString(36)+Math.floor(Math.random()*1e4));
        this[t].push({created_at:new Date().toISOString(),...d,id}); return {id};
      }
      case 'remove':{ this[p.table]=(this[p.table]||[]).filter(x=>x.id!==p.id); return {deleted:p.id}; }
      case 'getTutors': return clone(this.tutors);
      case 'getStudents':
        if(p.id) return clone(this.students.find(s=>s.id===p.id)||null);
        return clone(this.students);
      case 'getClasses':{
        let r=clone(this.classes);
        if(p.date)       r=r.filter(c=>c.date===p.date);
        if(p.student_id) r=r.filter(c=>c.student_id===p.student_id);
        if(p.tutor_id)   r=r.filter(c=>c.tutor_id===p.tutor_id);
        if(p.month)      r=r.filter(c=>c.date.startsWith(p.month));
        return r.sort((a,b)=>b.date>a.date?1:-1);
      }
      case 'addClass':{
        const id='c'+Date.now();
        this.classes.push({doc_url:'',material_url:'',topic:'',note:'',...p,id});
        return {id};
      }
      case 'updateClass':{
        const c=this.classes.find(x=>x.id===p.id); if(c) Object.assign(c,p); return {updated:p.id};
      }
      case 'deleteClass':{
        this.classes=this.classes.filter(x=>x.id!==p.id); return {deleted:p.id};
      }
      case 'getDeposit': return clone(this.deposits[p.student_id]||null);
      case 'getPayments':{ let r=clone(this.payments); if(p.student_id) r=r.filter(x=>x.student_id===p.student_id); if(p.month) r=r.filter(x=>x.month===p.month); return r.sort((a,b)=>String(b.month).localeCompare(String(a.month))); }
      case 'savePayment':{ if(p.id){const e=this.payments.find(x=>x.id===p.id); if(e){Object.assign(e,p); return {updated:p.id};}} const id='pay'+Date.now(); this.payments.push({...p,id}); return {id}; }
      case 'deletePayment':{ this.payments=this.payments.filter(x=>x.id!==p.id); return {deleted:p.id}; }
      case 'getPayroll':{ this.payroll=this.payroll||[]; let r=clone(this.payroll); if(p.tutor_id) r=r.filter(x=>x.tutor_id===p.tutor_id); if(p.month) r=r.filter(x=>x.month===p.month); return r.sort((a,b)=>String(b.created_at||b.month).localeCompare(String(a.created_at||a.month))); }
      case 'savePayroll':{ this.payroll=this.payroll||[]; if(p.id){const e=this.payroll.find(x=>x.id===p.id); if(e){Object.assign(e,p); return {updated:p.id};}} const id=p.id||('pr'+Date.now()); this.payroll.push({created_at:new Date().toISOString(),...p,id}); return {id}; }
      case 'deletePayroll':{ this.payroll=(this.payroll||[]).filter(x=>x.id!==p.id); return {deleted:p.id}; }
      case 'getParents':{ this.parents=this.parents||[]; return clone(this.parents).sort((a,b)=>String(a.nama||'').localeCompare(String(b.nama||''))); }
      case 'saveParent':{ this.parents=this.parents||[]; if(p.id){const e=this.parents.find(x=>x.id===p.id); if(e){Object.assign(e,p); return {updated:p.id};}} const id=p.id||('pa'+Date.now()); this.parents.push({...p,id}); return {id}; }
      case 'deleteParent':{ this.parents=(this.parents||[]).filter(x=>x.id!==p.id); return {deleted:p.id}; }
      case 'getClassGroups':{ this.class_groups=this.class_groups||[]; return clone(this.class_groups).sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||''))); }
      case 'saveClassGroup':{ this.class_groups=this.class_groups||[]; if(p.id){const e=this.class_groups.find(x=>x.id===p.id); if(e){Object.assign(e,p); return {updated:p.id};}} const id=p.id||('cg'+Date.now()); this.class_groups.push({created_at:new Date().toISOString(),...p,id}); return {id}; }
      case 'deleteClassGroup':{ this.class_groups=(this.class_groups||[]).filter(x=>x.id!==p.id); return {deleted:p.id}; }
      case 'uploadFile':{ return {url:p.base64,view:p.base64}; }
      case 'addStudent': { const id='s'+Date.now(); const pin=p.pin||genPin(); this.students.push({active:'aktif',pin,...p,id}); return {id,pin}; }
      case 'blogLogin':{ const key=String(p.login||'').toLowerCase().trim(); const x=(this.blog_writers||[]).find(a=>String(a.username||'').toLowerCase()===key); if(!x) throw new Error('Writer account not found'); if(String(x.pin)!==String(p.pin)) throw new Error('Incorrect PIN'); if(String(x.status||'Active')!=='Active') throw new Error('This account is not active — please contact the admin'); return clone(x); }
      case 'parentLogin':{ const key=String(p.login||'').toLowerCase().trim(); const x=(this.parents||[]).find(a=>String(a.username||'').toLowerCase()===key||String(a.parent_id||'').toLowerCase()===key); if(!x) throw new Error('Parent account not found'); if(String(x.pin)!==String(p.pin)) throw new Error('Incorrect PIN'); return clone(x); }
      case 'studentLogin':{ const key=String(p.login||'').toLowerCase().trim(); const s=this.students.find(x=>x.id===p.login||(x.username||'').toLowerCase().trim()===key||genUsername(x.nama)===key||x.nama.toLowerCase().trim()===key); if(!s)throw new Error('Student not found'); if(String(s.pin)!==String(p.pin))throw new Error('Incorrect PIN'); return clone(s); }
      case 'addTutor':   { const id='t'+Date.now(); const pin=p.pin||genPin(); this.tutors.push({pin,...p,id}); return {id,pin}; }
      case 'updateTutor':{ const t=this.tutors.find(x=>x.id===p.id); if(t) Object.assign(t,p); return {updated:p.id}; }
      case 'updateStudent':{ const s=this.students.find(x=>x.id===p.id); if(s) Object.assign(s,p); return {updated:p.id}; }
      case 'deleteTutor':{ this.tutors=this.tutors.filter(x=>x.id!==p.id); return {deleted:p.id}; }
      case 'deleteStudent':{ this.students=this.students.filter(x=>x.id!==p.id); return {deleted:p.id}; }
      case 'verifyPin':{ this._pins=this._pins||{master:'5758',admin:'17081945'}; return {ok:String(p.pin)===this._pins[p.role==='master'?'master':'admin']}; }
      case 'changePin':{ this._pins=this._pins||{master:'5758',admin:'17081945'}; const role=p.role==='master'?'master':'admin'; if(String(p.oldPin)!==this._pins[role]) return {ok:false,message:'Old password is incorrect'}; if(!/^\d{4,10}$/.test(String(p.newPin||''))) return {ok:false,message:'New password must be 4–10 digits'}; this._pins[role]=String(p.newPin); return {ok:true}; }
      case 'tutorLogin':{
        const key=String(p.login||'').toLowerCase().trim();
        const t=this.tutors.find(x=>x.id===p.login||(x.username||'').toLowerCase().trim()===key||genUsername(x.nama)===key||x.nama.toLowerCase().trim()===key);
        if(!t) throw new Error('Teacher not found');
        if(String(t.pin)!==String(p.pin)) throw new Error('Incorrect PIN');
        return clone(t);
      }
      case 'getAttendance': return clone(this.classes.filter(c=>!p.date||c.date===p.date));
      case 'getRatings':{ let r=clone(this.ratings); if(p.tutor_id)r=r.filter(x=>x.tutor_id===p.tutor_id); if(p.student_id)r=r.filter(x=>x.student_id===p.student_id); if(p.class_id)r=r.filter(x=>x.class_id===p.class_id); return r; }
      case 'addRating':{ const i=this.ratings.findIndex(x=>x.class_id===p.class_id&&x.student_id===p.student_id); if(i>=0){Object.assign(this.ratings[i],p);return {id:this.ratings[i].id};} const id='rt'+Date.now(); this.ratings.push({id,created_at:new Date().toISOString(),...p}); return {id}; }
      case 'getDiary':{ let r=clone(this.diary); if(p.student_id)r=r.filter(x=>String(x.student_id)===String(p.student_id)); if(p.tutor_id)r=r.filter(x=>String(x.tutor_id)===String(p.tutor_id)); return r.sort((a,b)=>String(a.created_at).localeCompare(String(b.created_at))); }
      case 'addDiary':{ const id='dy'+Date.now(); this.diary.push({id,created_at:new Date().toISOString(),...p}); return {id}; }
      case 'getTasks':{ let r=clone(this.tasks); if(p.student_id)r=r.filter(x=>String(x.student_id)===String(p.student_id)); if(p.tutor_id)r=r.filter(x=>String(x.tutor_id)===String(p.tutor_id)); return r; }
      case 'addTask':{ const id='tk'+Date.now(); this.tasks.push({id,status:'assigned',done_at:'',created_at:new Date().toISOString(),...p}); return {id}; }
      case 'updateTask':{ const t=this.tasks.find(x=>x.id===p.id); if(t)Object.assign(t,p); return {updated:p.id}; }
      case 'deleteTask':{ this.tasks=this.tasks.filter(x=>x.id!==p.id); return {deleted:p.id}; }
      case 'getChat':{ let r=clone(this.chat); if(p.room)r=r.filter(x=>x.room===p.room); return r.sort((a,b)=>String(a.created_at).localeCompare(String(b.created_at))); }
      case 'addChat':{ const id='ch'+Date.now(); this.chat.push({id,created_at:new Date().toISOString(),...p}); return {id}; }
      case 'getTBoard': return clone(this.tboard).sort((a,b)=>String(b.created_at||b.date).localeCompare(String(a.created_at||a.date)));
      case 'addTBoard':{ const id='tb'+Date.now(); this.tboard.push({id,date:p.date||todayStr(),created_at:new Date().toISOString(),...p}); return {id}; }
      case 'deleteTBoard':{ this.tboard=this.tboard.filter(x=>x.id!==p.id); this.tboard_read=this.tboard_read.filter(x=>x.board_id!==p.id); return {deleted:p.id}; }
      case 'getTBoardReads':{ let r=clone(this.tboard_read); if(p.board_id)r=r.filter(x=>x.board_id===p.board_id); if(p.reader_id)r=r.filter(x=>String(x.reader_id)===String(p.reader_id)); return r; }
      case 'markTBoardRead':{ const id=(p.board_id||'')+'_'+(p.reader_id||''); const e=this.tboard_read.find(x=>x.id===id); if(e){Object.assign(e,{read_at:p.read_at||new Date().toISOString()});return {id};} this.tboard_read.push({id,board_id:p.board_id,reader_id:p.reader_id,reader_name:p.reader_name||'',read_at:p.read_at||new Date().toISOString()}); return {id}; }
      case 'getAnnouncements': return clone(this.announcements).sort((a,b)=>String(b.created_at||b.date).localeCompare(String(a.created_at||a.date)));
      case 'addAnnouncement':{ const id='an'+Date.now(); this.announcements.push({id,date:p.date||todayStr(),created_at:new Date().toISOString(),...p}); return {id}; }
      case 'deleteAnnouncement':{ this.announcements=this.announcements.filter(x=>x.id!==p.id); return {deleted:p.id}; }
      case 'getSetting':{ return this._settings[p.key]!=null?this._settings[p.key]:''; }
      case 'setSetting':{ this._settings[p.key]=String(p.value==null?'':p.value); return {ok:true}; }
      case 'getResources': return clone(this.resources||[]).sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at)));
      case 'addResource':{ const id=p.id||('rs'+Date.now()); (this.resources=this.resources||[]).push({created_at:new Date().toISOString(),...p,id}); return {id}; }
      case 'deleteResource':{ this.resources=(this.resources||[]).filter(x=>x.id!==p.id); return {deleted:p.id}; }
      case 'getTutorBonus':{ let r=clone(this.tutor_bonus||[]); if(p.tutor_id) r=r.filter(x=>x.tutor_id===p.tutor_id); if(p.month) r=r.filter(x=>x.month===p.month); return r; }
      case 'saveTutorBonus':{ this.tutor_bonus=this.tutor_bonus||[]; const e=this.tutor_bonus.find(x=>x.tutor_id===p.tutor_id&&x.month===p.month); if(e){ Object.assign(e,p); return {updated:1}; } this.tutor_bonus.push({id:'tb'+Date.now(),...p}); return {id:1}; }
      case 'getQuizzes': return clone(this.quizzes||[]);
      case 'addQuiz':{ const id='qz'+Date.now(); (this.quizzes=this.quizzes||[]).push({id,created_at:new Date().toISOString(),...p}); return {id}; }
      case 'deleteQuiz':{ this.quizzes=(this.quizzes||[]).filter(x=>x.id!==p.id); return {deleted:p.id}; }
      case 'getQuizResults':{ let r=clone(this.quiz_results||[]); if(p.student_id) r=r.filter(x=>String(x.student_id)===String(p.student_id)); if(p.quiz_id) r=r.filter(x=>String(x.quiz_id)===String(p.quiz_id)); return r; }
      case 'saveQuizResult':{ const id='qr'+Date.now(); (this.quiz_results=this.quiz_results||[]).push({id,created_at:new Date().toISOString(),...p}); return {id}; }
      case 'getLeaderboard':{ const agg={}; (this.quiz_results||[]).forEach(r=>{ const k=r.student_id; agg[k]=agg[k]||{student_id:k,name:r.student_name||'',points:0,quizzes:0}; agg[k].points+=Number(r.score)||0; agg[k].quizzes++; }); return Object.values(agg).sort((a,b)=>b.points-a.points); }
      default: return null;
    }
  },
  tutorName(id){return (this.tutors.find(t=>t.id===id)||{}).nama||'-';},
  studentName(id){return (this.students.find(s=>s.id===id)||{}).nama||'-';},
};
/* Demo: recurring sessions for class group cg1 (Mon & Thu 19:00, Oct–Nov 2026) */
(function seedDemoSessions(){
  if(typeof DEMO==='undefined') return;
  const today=todayStr(), topics=['Introducing Yourself','Daily Routines','Hobbies and Interests','Making Plans','Food and Restaurants','Giving Directions','Past Experiences','Travel and Holidays','School Life','Health and Lifestyle','Shopping','Weather & Seasons','Describing People','Future Plans','Review & Quiz','Speaking Project'];
  const d=new Date('2026-10-01T00:00:00'), end=new Date('2026-11-30T00:00:00'); let k=0;
  while(d<=end){
    const dow=d.getDay();
    if(dow===1||dow===4){
      const ds=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const past=ds<today, topic=topics[k%topics.length]; k++;
      ['s1','s2'].forEach((sid,ix)=>{
        if(ds===today && sid==='s1') return;           // today's c101 already exists for s1
        let att=''; if(past){ att='hadir'; if(sid==='s2'&&k===3) att='sakit'; if(sid==='s1'&&k===5) att='telat'; if(sid==='s2'&&k===6) att='alpa'; }
        DEMO.classes.push({id:'g'+ds.replace(/-/g,'')+sid,date:ds,student_id:sid,tutor_id:'t1',group_id:'cg1',start_time:'19:00',end_time:past?'20:30':'',duration:90,type:'onsite',room:'Room 2',
          topic:past?topic:'',note:'',material_url:'',doc_url:'',status:past?'done':'scheduled',attend:att,session_type:'regular'});
      });
    }
    d.setDate(d.getDate()+1);
  }
})();

/* Rev5/Rev6 demo data: requests (reschedule/recovery), certificates, targeted announcements */
(function seedRev5(){
  if(typeof DEMO==='undefined') return;
  const t=todayStr(), add=(n)=>{const d=new Date(t+'T00:00:00'); d.setDate(d.getDate()+n); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  // pending reschedule on an upcoming cg1 session for s2
  const up=DEMO.classes.filter(c=>c.group_id==='cg1'&&c.student_id==='s2'&&c.date>t).sort((a,b)=>a.date.localeCompare(b.date));
  if(up[0]) Object.assign(up[0],{status:'reschedule',req_kind:'reschedule',req_status:'pending',req_by:'ortu',req_at:t+'T08:10:00',resched_date:add(9),resched_time:'19:00',resched_note:'Budi has a school exam that evening. Could we move it to the following week?',req_reason:'School exam'});
  // approved reschedule history
  const past=DEMO.classes.filter(c=>c.group_id==='cg1'&&c.student_id==='s1'&&c.date<t).sort((a,b)=>b.date.localeCompare(a.date));
  if(past[2]) Object.assign(past[2],{req_kind:'reschedule',req_status:'approved',req_by:'murid',req_at:past[2].date+'T07:00:00',orig_date:past[2].date,orig_time:'19:00',resched_note:'Family event',req_reason:'Family event',admin_note:'Approved – same time.'});
  // recovery request (pending) for s2
  DEMO.classes.push({id:'rec1',date:add(4),student_id:'s2',tutor_id:'t1',group_id:'cg1',start_time:'17:00',end_time:'18:30',duration:90,type:'onsite',room:'Room 2',status:'requested',session_type:'recovery',req_kind:'recovery',req_status:'pending',req_by:'murid',req_at:t+'T09:15:00',fee:50000,req_reason:'Missed class (sick)',req_note:'I was sick on Thursday. Can I join a recovery class?',topic:'',note:''});
  // completed cohort (for certificate demo)
  DEMO.class_groups.push({id:'cg5',class_id:'CLS-0005',name:'Boost English (Teens) – A1',program:'Boost English',level:'A1',tutor_id:'t1',student_ids:'s1,s2',schedule:'Tue & Fri · 16.00–17.30',days:'Tue,Fri',start_time:'16:00',end_time:'17:30',room:'Room 1',mode:'Onsite',start_date:'2026-03-03',end_date:'2026-06-30',total_sessions:32,min_cert:26,status:'Completed',created_at:'2026-02-20T09:00:00'});
  { const d=new Date('2026-03-03T00:00:00'); let n=0;
    while(n<32){ const w=d.getDay(); if(w===2||w===5){ n++; const ds=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      [['s1',[3,11,19,27]],['s2',[2,6,9,14,18,22,25,30]]].forEach(([sid,miss])=>DEMO.classes.push({id:'h'+ds.replace(/-/g,'')+sid,date:ds,student_id:sid,tutor_id:'t1',group_id:'cg5',start_time:'16:00',end_time:'17:30',duration:90,type:'onsite',room:'Room 1',status:'done',attend:miss.includes(n)?(n%2?'sakit':'alpa'):'hadir',session_type:'regular',topic:'A1 Unit '+Math.ceil(n/4),note:''})); }
      d.setDate(d.getDate()+1); } }
  DEMO.certificates=[
    {id:'ce1',student_id:'s3',group_id:'',program:'Boost Mandarin',level:'HSK 1',attendance:'28/32',cert_no:'KWE/2026/0412',mode:'auto',status:'Generated',issued_at:'2026-09-30',completion_date:'2026-09-30',issued_by:'Admin',created_at:'2026-09-30T10:00:00'},
  ];
  DEMO.announcements.forEach(a=>{ a.audience=a.audience||'All'; a.status=a.status||'Published'; });
  DEMO.announcements.push(
    {id:'an3',title:'Kwelingo Lounge – November',body:'Join us for our monthly English gathering on Saturday at 10.00. Snacks provided!',date:add(-2),audience:'Students',program:'',status:'Published',author:'Admin',created_at:add(-2)+'T09:00:00'},
    {id:'an4',title:'Parent Meeting',body:'We would like to invite all parents to a short progress meeting next Saturday at 13.00.',date:add(-5),audience:'Parents',program:'',status:'Published',author:'Admin',created_at:add(-5)+'T16:00:00'},
    {id:'an5',title:'Level Completion Reminder',body:'Boost English A2 students: please complete all Extended Practice before the end of the month.',date:add(-6),audience:'Students,Parents',program:'Boost English',level:'A2',status:'Published',author:'Admin',created_at:add(-6)+'T14:30:00'});
  DEMO.chat.push(
    {id:'ch20',room:'dm:admin|s1',sender_id:'s1',sender_name:'Anton Wijaya',role:'murid',message:'Hi Miss, can I get the recovery class schedule?',created_at:t+'T09:15:00'},
    {id:'ch21',room:'dm:admin|p:s2',sender_id:'p:s2',sender_name:'Parent of Budi Santoso',role:'ortu',message:'Good morning. May I ask about the reschedule request for Budi?',created_at:t+'T08:42:00'});
})();

/* Rev6 demo data: quizzes, student materials, a project */
(function seedRev6(){
  if(typeof DEMO==='undefined') return;
  const t=todayStr(), add=(n)=>{const d=new Date(t+'T00:00:00'); d.setDate(d.getDate()+n); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const Q=(q,o,a,ty)=>({q,options:o,answer:a,type:ty||'mc'});
  DEMO.quizzes=[
    {id:'qz1',title:'Daily Routines Quiz',subject:'English',level:'A2',program:'Boost English',group_id:'cg1',unit:'Unit 1 – Everyday Life',time_limit:10,due_date:add(2),created_at:add(-3)+'T09:00:00',
     questions:JSON.stringify([Q('She usually ___ breakfast at 7 a.m.',['eat','eats','eating','to eat'],1),Q('I ___ to school by bus.',['go','goes','going','gone'],0),Q('"Every morning" is a time expression.',['True','False'],0,'tf'),
       Q('He ___ (watch) TV in the evening.',[],'watches','fill'),Q('What time ___ you get up?',['do','does','is','are'],0),Q('My sister never ___ coffee.',['drink','drinks','drinking','drank'],1)])},
    {id:'qz2',title:'Vocabulary Check: Hobbies',subject:'English',level:'A2',program:'Boost English',group_id:'cg1',unit:'Unit 2 – Hobbies',time_limit:8,due_date:add(6),created_at:add(-1)+'T09:00:00',
     questions:JSON.stringify([Q('Which one is a hobby?',['Painting','Kitchen','Monday','Teacher'],0),Q('I enjoy ___ books.',['read','reading','reads','to reading'],1),Q('"Collecting stamps" is a hobby.',['True','False'],0,'tf'),Q('She is good ___ swimming.',['in','at','on','for'],1)])},
    {id:'qz3',title:'Introduction Quiz',subject:'English',level:'A2',program:'Boost English',group_id:'cg1',unit:'Unit 1 – Everyday Life',time_limit:5,due_date:add(-10),created_at:add(-20)+'T09:00:00',
     questions:JSON.stringify([Q('"Nice to meet you" is a ___.',['greeting','question','farewell','number'],0),Q('My name ___ Anton.',['am','is','are','be'],1),Q('Where ___ you from?',['is','are','am','be'],1)])},
  ];
  DEMO.quiz_results=[{id:'qr1',quiz_id:'qz3',student_id:'s1',student_name:'Anton Wijaya',score:3,total:3,taken_at:add(-12),created_at:add(-12)+'T19:00:00'},{id:'qr2',quiz_id:'qz3',student_id:'s2',student_name:'Budi Santoso',score:2,total:3,taken_at:add(-12),created_at:add(-12)+'T19:05:00'}];
  DEMO.resources.push(
    {id:'sm1',title:'Unit 1 – Lesson Notes.pdf',note:'Key phrases for introductions & daily routines.',program:'Boost English',unit:'Unit 1 – Everyday Life',kind:'student',size:'1.8 MB',file_url:'#',created_at:'2026-10-10T09:00:00'},
    {id:'sm2',title:'Unit 1 – Vocabulary List.pdf',note:'Daily activities vocabulary.',program:'Boost English',unit:'Unit 1 – Everyday Life',kind:'student',size:'1.3 MB',file_url:'#',created_at:'2026-10-10T09:01:00'},
    {id:'sm3',title:'Unit 1 – Grammar Summary.pdf',note:'Present simple – he/she/it + -s.',program:'Boost English',unit:'Unit 1 – Everyday Life',kind:'student',size:'1.1 MB',file_url:'#',created_at:'2026-10-10T09:02:00'},
    {id:'sm4',title:'Unit 2 – Worksheet.pdf',note:'Hobbies & free time.',program:'Boost English',unit:'Unit 2 – Hobbies',kind:'student',size:'2.1 MB',file_url:'#',created_at:'2026-10-24T09:00:00'});
  DEMO.tasks.push(
    {id:'tk6',student_id:'s1',tutor_id:'t1',group_id:'cg1',batch_id:'b6',unit:'Unit 2 – Hobbies',title:'My Dream Holiday',detail:'Create a short presentation about your dream holiday destination. You can write, record, or present it in a format you like. Share what you want to do, why you chose this place, and what you can do there.\n\nRequirements:\n• 5–8 slides or a 2–3 minute recording\n• Use at least 5 new words from Unit 2\n• Include one picture or map',type:'final_project',due_date:add(14),due_time:'23:59',status:'assigned',visible:'1',created_at:add(-2)+'T10:00:00'},
    {id:'tk7',student_id:'s1',tutor_id:'t1',group_id:'cg1',batch_id:'b7',unit:'Unit 2 – Hobbies',title:'Describe Your Favourite Hobby (Voice)',detail:'Record a 1-minute audio describing your favourite hobby. Say what it is, when you do it, and why you like it.',type:'speaking',due_date:add(3),due_time:'23:59',status:'assigned',visible:'1',created_at:add(-1)+'T10:00:00'},
    {id:'tk8',student_id:'s1',tutor_id:'t1',group_id:'cg1',batch_id:'b8',unit:'Unit 2 – Hobbies',title:'Read and Answer: Weekend Plans',detail:'Read the short text in the worksheet (page 4) and answer the 5 questions in full sentences.',type:'reading',due_date:add(5),due_time:'23:59',status:'assigned',visible:'1',created_at:add(-1)+'T11:00:00'});
  DEMO.chat.push({id:'ch22',room:'grp:cg1',sender_id:'s2',sender_name:'Budi Santoso',role:'murid',message:'Hi everyone 👋 Has anyone finished the Daily Routines quiz?',created_at:t+'T10:24:00'},
    {id:'ch23',room:'dm:s1|t1',sender_id:'t1',sender_name:'Mr. Yesaya',role:'guru',message:'Sure Anton, please send a reschedule request from your Student Hub and the admin team will confirm.',created_at:'2026-10-26T18:02:00'});
})();

/* Rev7 demo data: student invoices, SOP status */
(function seedRev7(){
  if(typeof DEMO==='undefined') return;
  const t=todayStr(), add=(n)=>{const d=new Date(t+'T00:00:00'); d.setDate(d.getDate()+n); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const m=t.slice(0,7), pm=add(-31).slice(0,7);
  const inv=(id,sid,mon,no,amt,st,iss,due,extra)=>Object.assign({id,student_id:sid,month:mon,invoice_no:no,meetings:8,price_per_meet:amt/8,duration:90,deposit_total:amt,grand_total:amt,status:st,issue_date:iss,due_date:due,program:'Boost English',level:'A2',created_at:iss+'T09:00:00'},extra||{});
  DEMO.payments.forEach((p,i)=>{ p.invoice_no=p.invoice_no||('INV-2026-'+String(1001+i)); p.issue_date=p.issue_date||(p.month+'-01'); p.due_date=p.due_date||(p.month+'-10'); p.program=p.program||'Boost English'; });
  DEMO.payments.push(
    inv('pay3','s1',pm,'INV-2026-1021',1200000,'LUNAS',pm+'-01',pm+'-10',{pay_date:pm+'-06',paid_at:pm+'-06',method:'Bank Transfer (BCA)'}),
    inv('pay4','s2',pm,'INV-2026-1022',1200000,'BELUM BAYAR',pm+'-01',pm+'-10'),
    inv('pay5','s1',m,'INV-2026-1031',1200000,'MENUNGGU VERIFIKASI',m+'-01',add(5),{proof_url:'https://example.com/transfer-proof.jpg',pay_date:t}),
    inv('pay6','s2',m,'INV-2026-1032',1200000,'BELUM BAYAR',m+'-01',add(2)),
    inv('pay7','s3',m,'INV-2026-1033',1120000,'BELUM BAYAR',m+'-01',add(9),{program:'Boost Mandarin',level:'HSK 1',price_per_meet:140000,deposit_total:1120000}));
  (DEMO.resources||[]).forEach(r=>{ if(r.kind==='sop') r.status=r.status||'Published'; });
  DEMO.resources.push({id:'sop7',title:'Code of Conduct for Teachers.pdf',category:'General',kind:'sop',size:'640 KB',file_url:'#',status:'Draft',note:'Draft — to be reviewed by owner.',created_at:'2026-10-20T09:00:00'});
})();

/* Rev8 demo data: teacher requests, programs */
(function seedRev8(){
  if(typeof DEMO==='undefined') return;
  const t=todayStr(), add=(n)=>{const d=new Date(t+'T00:00:00'); d.setDate(d.getDate()+n); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  DEMO.teacher_requests=[
    {id:'trq1',tutor_id:'t1',kind:'leave',leave_type:'Sick Leave',start_date:add(3),end_date:add(4),reason:'Fever — the doctor advised two days of rest.',status:'Pending',created_at:add(-1)+'T09:15:00'},
    {id:'trq2',tutor_id:'t2',kind:'leave',leave_type:'Personal',start_date:add(-12),end_date:add(-11),reason:'Family event.',status:'Approved',admin_note:'Covered by Mr. Kevin.',created_at:add(-20)+'T10:00:00',decided_at:add(-19)+'T08:00:00'},
    {id:'trq3',tutor_id:'t1',kind:'reschedule',group_id:'cg1',class_date:add(7),start_time:'19:00',new_date:add(8),new_time:'19:00',reason:'Attending a teacher training workshop.',status:'Pending',created_at:t+'T07:30:00'},
    {id:'trq4',tutor_id:'t1',kind:'reschedule',group_id:'cg1',class_date:add(-16),start_time:'19:00',new_date:add(-15),new_time:'18:30',reason:'Center event in Room 2.',status:'Approved',admin_note:'Moved to the next day, 18:30. Students informed.',created_at:add(-22)+'T11:00:00',decided_at:add(-21)+'T09:00:00',decided_by:'Operations Admin'},
    {id:'trq5',tutor_id:'t1',kind:'leave',leave_type:'Personal',start_date:add(-30),end_date:add(-29),reason:'Personal matter.',status:'Declined',admin_note:'No substitute teacher available on those dates — please pick other dates.',created_at:add(-36)+'T08:20:00',decided_at:add(-35)+'T10:00:00',decided_by:'Super Admin'},
  ];
  { const nx=(DEMO.classes||[]).filter(c=>String(c.tutor_id)==='t1'&&(c.group_id==='cg1'||['s1','s2'].includes(String(c.student_id)))&&c.date>t&&(!c.session_type||c.session_type==='regular')).sort((a,b)=>a.date.localeCompare(b.date))[1];
    if(nx){ const r=DEMO.teacher_requests.find(x=>x.id==='trq3'); r.class_date=nx.date; r.start_time=nx.start_time||'19:00'; r.new_date=add(Math.max(1,Math.round((new Date(nx.date)-new Date(t))/864e5)+1)); } }
  DEMO.programs=[
    {id:'pg1',name:'Boost English',code:'BE',category:'General English',audience:'Kids,Teens,Adults',levels:'A1,A2,B1,B2,C1,C2',duration:'4 months per level',sessions:32,min_cert:26,price:150000,status:'Active',color:'#1F6FEB',description:'A structured English program for kids, teens and adults following the CEFR framework, focused on real-life communication in a supportive environment.',objectives:'Build practical English communication skills from A1 to C2 — speaking, listening, reading and writing.',curriculum:'Unit 1 – Everyday Life\nUnit 2 – Hobbies\nUnit 3 – Travel\nUnit 4 – Food and Restaurants\nUnit 5 – School and Education\nUnit 6 – Health and Lifestyle'},
    {id:'pg2',name:'Speak Active',code:'SA',category:'Speaking Club',audience:'Teens,Adults',levels:'A2,B1,B2',duration:'3 months',sessions:24,min_cert:20,price:140000,status:'Active',color:'#22A06B',description:'Conversation-focused speaking club with games, debates and role-plays.',objectives:'Speak confidently and fluently in everyday situations.',curriculum:'Getting to Know You\nDaily Life Talk\nOpinions & Debates\nStorytelling'},
    {id:'pg3',name:'IELTS Preparation',code:'IELTS',category:'Test Preparation',audience:'Teens,Adults',levels:'Band 5.5,Band 6.5,Band 7+',duration:'12 weeks',sessions:24,min_cert:20,price:200000,status:'Active',color:'#7C5CE6',description:'Strategy-based preparation for all four IELTS skills with mock tests.',objectives:'Reach the target band score.',curriculum:'Listening strategies\nReading strategies\nWriting Task 1 & 2\nSpeaking Parts 1–3\nMock tests'},
    {id:'pg4',name:'Boost Mandarin',code:'MAND',category:'Foreign Language',audience:'Kids,Teens,Adults',levels:'HSK 1,HSK 2,HSK 3,HSK 4,HSK 5,HSK 6',duration:'4 months per level',sessions:32,min_cert:26,price:140000,status:'Active',color:'#F5A524',description:'Mandarin for beginners to advanced learners aligned with HSK.',objectives:'Communicate in Mandarin and pass HSK exams.',curriculum:'Greetings\nNumbers & Time\nFamily\nShopping\nTravel'},
    {id:'pg5',name:'HSK Preparation',code:'HSK',category:'Test Preparation',audience:'Teens,Adults',levels:'HSK 1–6',duration:'10 weeks',sessions:20,min_cert:16,price:180000,status:'Active',color:'#E5484D',description:'Focused preparation for HSK exams.',objectives:'Pass the target HSK level.',curriculum:'Vocabulary drills\nGrammar points\nReading & listening practice\nMock tests'},
    {id:'pg6',name:'Japanese',code:'JP',category:'Foreign Language',audience:'Teens,Adults',levels:'N5,N4,N3,N2,N1',duration:'4 months per level',sessions:32,min_cert:26,price:150000,status:'Draft',color:'#C2364A',description:'Japanese language program aligned with JLPT.',objectives:'Read hiragana, katakana and basic kanji; hold simple conversations.',curriculum:'Hiragana & Katakana\nGreetings\nDaily life'},
  ];
})();

/* Convenience lookups that work in demo & live (names embedded server-side in live) */
async function tutorMap(){const t=await API.getTutors();const m={};t.forEach(x=>m[x.id]=x);return m;}
async function studentMap(){const s=await API.getStudents();const m={};s.forEach(x=>m[x.id]=x);return m;}

/* Announcement targeting (rev5): which announcements a student/parent should see */
function annFor(list,role,stu,groups){
  const now=new Date(), want=role==='parent'?'Parents':'Students';
  const myGroups=(groups||[]).filter(g=>String(g.student_ids||'').split(',').map(x=>x.trim()).includes(String((stu||{}).id)));
  return (list||[]).filter(a=>{
    const aud=String(a.audience||'All').split(',').map(x=>x.trim());
    if(!(aud.includes('All')||aud.includes(want))) return false;
    if(a.publish_at && new Date(a.publish_at)>now) return false;
    if(a.program && stu && a.program!==stu.program && !myGroups.some(g=>g.program===a.program)) return false;
    if(a.level && stu){ const lv=String(a.level).split(/[,\s]+/).filter(Boolean); const mine=[stu.level,...myGroups.map(g=>g.level)].filter(Boolean); if(lv.length&&!lv.some(l=>mine.includes(l))) return false; }
    if(a.group_id && !myGroups.some(g=>String(g.id)===String(a.group_id))) return false;
    return true;
  });
}


/* ============================================================
   Brand icons (social / contact) + round flags — shared by index, blog, portal docs
   (paths: Simple Icons, CC0)
   ============================================================ */
const KW_ICON_PATHS={"wa": "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z", "gmail": "M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z", "ig": "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077", "threads": "M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z", "fb": "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"};
function kwIcon(name,size){ size=size||18;
  const C={wa:'#25D366',gmail:'#EA4335',threads:'#000000',fb:'#0866FF'};
  if(name==='ig') return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><defs><radialGradient id="kwIgG" cx="30%" cy="107%" r="150%"><stop offset="0" stop-color="#FDF497"/><stop offset=".05" stop-color="#FDF497"/><stop offset=".45" stop-color="#FD5949"/><stop offset=".6" stop-color="#D6249F"/><stop offset=".9" stop-color="#285AEB"/></radialGradient></defs><path fill="url(#kwIgG)" d="${KW_ICON_PATHS.ig}"/></svg>`;
  if(name==='web') return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#1495C4" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.6 2.7 3.9 5.9 3.9 9.5s-1.3 6.8-3.9 9.5c-2.6-2.7-3.9-5.9-3.9-9.5S9.4 5.2 12 2.5z"/></svg>`;
  if(name==='pin') return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path fill="#FF9300" d="M12 1.8a7.6 7.6 0 0 0-7.6 7.6c0 5.6 7.6 12.8 7.6 12.8s7.6-7.2 7.6-12.8A7.6 7.6 0 0 0 12 1.8z"/><circle cx="12" cy="9.4" r="2.9" fill="#fff"/></svg>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path fill="${C[name]||'#13235B'}" d="${KW_ICON_PATHS[name]||''}"/></svg>`;
}
const KW_FLAG={en:"<svg viewBox=\"15 0 30 30\" preserveAspectRatio=\"xMidYMid slice\" xmlns=\"http://www.w3.org/2000/svg\"><clipPath id=\"kwUkT\"><path d=\"M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z\"/></clipPath><path d=\"M0,0 v30 h60 v-30 z\" fill=\"#012169\"/><path d=\"M0,0 L60,30 M60,0 L0,30\" stroke=\"#fff\" stroke-width=\"6\"/><path d=\"M0,0 L60,30 M60,0 L0,30\" clip-path=\"url(#kwUkT)\" stroke=\"#C8102E\" stroke-width=\"4\"/><path d=\"M30,0 v30 M0,15 h60\" stroke=\"#fff\" stroke-width=\"10\"/><path d=\"M30,0 v30 M0,15 h60\" stroke=\"#C8102E\" stroke-width=\"6\"/></svg>",zh:"<svg viewBox=\"0 0 20 20\" preserveAspectRatio=\"xMidYMid slice\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"30\" height=\"20\" fill=\"#EE1C25\"/><polygon fill=\"#FFDE00\" points=\"5.00,2.00 5.67,4.07 7.85,4.07 6.09,5.35 6.76,7.43 5.00,6.15 3.24,7.43 3.91,5.35 2.15,4.07 4.33,4.07\"/><polygon fill=\"#FFDE00\" points=\"10.86,1.49 10.38,2.03 10.75,2.66 10.09,2.37 9.61,2.92 9.67,2.20 9.00,1.91 9.71,1.75 9.78,1.03 10.15,1.65\"/><polygon fill=\"#FFDE00\" points=\"12.99,3.86 12.34,4.18 12.44,4.90 11.93,4.38 11.28,4.70 11.62,4.05 11.12,3.53 11.83,3.66 12.17,3.01 12.27,3.73\"/><polygon fill=\"#FFDE00\" points=\"12.96,7.27 12.24,7.30 12.04,8.00 11.79,7.32 11.06,7.34 11.63,6.90 11.38,6.21 11.99,6.62 12.56,6.17 12.36,6.87\"/><polygon fill=\"#FFDE00\" points=\"10.78,9.62 10.10,9.37 9.65,9.94 9.68,9.21 9.00,8.95 9.70,8.76 9.74,8.04 10.13,8.64 10.84,8.45 10.38,9.02\"/></svg>"};

/* ============================================================
   Website instructor profiles (Super Admin → Website → Instructor Profiles)
   saved in app_settings 'web_teachers' → shown on index.html & registration.html
   ============================================================ */
const WEB_TEACHERS_DEFAULT=[
  {id:'wt1',name:'Ms. Sarah',role:'Boost English',type:'Local',programs:['be','ie'],color:'b',photo:'assets/teacher-sarah.jpg',show:true,
   bio:'Sarah has a background in English Language Education and over 5 years of teaching experience. She enjoys creating a supportive and engaging classroom where students build practical language skills for real-life situations.',
   facts:[['🎓','B.A. in English Language Education'],['👥','5+ years teaching teens and adults'],['📖','Focus on communicative and student-centered learning']]},
  {id:'wt2',name:'Mr. Adi',role:'Speak Active',type:'Local',programs:['sa','be'],color:'o',photo:'assets/teacher-adi.jpg',show:true,
   bio:'Adi is a communication-focused instructor with a background in International Relations. He helps learners turn their existing knowledge into confident, natural conversations through practical and interactive sessions.',
   facts:[['🎓','B.A. in International Relations'],['👥','4+ years teaching adults and professionals'],['💬','Specializes in conversation skills and real-life communication']]},
  {id:'wt3',name:'Ms. Lina',role:'Boost Mandarin',type:'Local',programs:['bm'],color:'b',photo:'assets/teacher-lina.jpg',show:true,
   bio:'Lina is a native Mandarin speaker who makes learning Chinese approachable and fun, guiding students from their very first characters to everyday conversation.',
   facts:[['🗣️','Native Mandarin speaker'],['📚','HSK-aligned teaching'],['🌱','Beginner-friendly classes']]},
  {id:'wt4',name:'Mr. Wang',role:'HSK Preparation',type:'International',programs:['hsk','bm'],color:'o',photo:'assets/teacher-wang.jpg',show:true,
   bio:'Wang specializes in structured HSK exam preparation, helping students reach their target level with clear strategies and steady, measurable progress.',
   facts:[['🎯','HSK exam specialist'],['🗂️','Structured preparation plans'],['📈','Target-level coaching']]},
];
async function loadWebTeachers(all){
  let list=JSON.parse(JSON.stringify(WEB_TEACHERS_DEFAULT));
  try{ const v=await API.getSetting('web_teachers'); if(v){ const c=JSON.parse(v); if(Array.isArray(c)) list=c; } }catch(e){}
  list=list.map(t=>({...t,programs:Array.isArray(t.programs)?t.programs:String(t.programs||'').split(',').map(x=>x.trim()).filter(Boolean),facts:Array.isArray(t.facts)?t.facts:[]}));
  return all?list:list.filter(t=>t.show!==false);
}

/* ============================================================
   Community Blog — two sections, each with its own sub-categories
   ============================================================ */
const BLOG_SECTIONS={
  'TeacherNotes':{key:'teachernotes',ic:'apple',tone:'b',who:'Teachers',tag:'Teaching tips & classroom ideas from our teachers',
    cats:['Lesson Planning','Teaching Strategies','Classroom Activities','Classroom Management','Learning & Assessment','Teacher Development & Reflection']},
  'Open Pages':{key:'openpages',ic:'book-open',tone:'o',who:'Students',tag:'Free-topic stories & perspectives from our students',
    cats:['Culture & Society','Travel & Experiences','Work & Career','Lifestyle & Well-being','Opinions & Perspectives','What If…?','Everyday Life']}
};
const BLOG_CAT_IC={'Lesson Planning':'calendar-days','Teaching Strategies':'lightbulb','Classroom Activities':'dices','Classroom Management':'compass','Learning & Assessment':'clipboard-check','Teacher Development & Reflection':'sprout',
  'Culture & Society':'landmark','Travel & Experiences':'plane','Work & Career':'briefcase','Lifestyle & Well-being':'leaf','Opinions & Perspectives':'message-square-quote','What If…?':'circle-help','Everyday Life':'coffee'};
// writer type → which sections they may write in
const BLOG_ROLE_SECTIONS={Teacher:['TeacherNotes','Open Pages'],Student:['Open Pages'],Staff:['TeacherNotes','Open Pages']};
function blogSectionOf(p){ if(p&&BLOG_SECTIONS[p.section]) return p.section; const c=(p||{}).category; return BLOG_SECTIONS['Open Pages'].cats.includes(c)?'Open Pages':'TeacherNotes'; }

/* ============================================================
   Printable documents (rev10): student invoice + teacher prepayment slip
   shared look — logo "Home for Language Learners", blue/orange corners,
   www.kwelingo.co.id · @kwelingo · Cemara Asri, Medan
   ============================================================ */
const KW_DOC_SITE='www.kwelingo.co.id', KW_DOC_IG='@kwelingo', KW_DOC_ADDR='Cemara Asri, Medan';
function kwDocIc(n){
  const P={cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    id:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="11" r="2.2"/><path d="M5.8 16.2c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4M14.5 10h4M14.5 13.5h3"/>',
    book:'<path d="M4 5.5C6.7 4.6 9.4 4.7 12 6.4v13.1c-2.6-1.7-5.3-1.8-8-.9zM20 5.5c-2.7-.9-5.4-.8-8 .9v13.1c2.6-1.7 5.3-1.8 8-.9z"/>',
    bank:'<path d="M3 9.5 12 4l9 5.5M5 10v8M9.7 10v8M14.3 10v8M19 10v8M3 20.5h18"/>',
    card:'<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6 15h4"/>',
    doc:'<path d="M7 3h7l5 5v12.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V3.5A.5.5 0 0 1 7 3z"/><path d="M14 3v5h5M9 12.5h6M9 16h6"/>',
    wallet:'<rect x="3" y="6" width="18" height="13.5" rx="2.5"/><path d="M3 9.5h18M16 14.2h2"/><path d="M6 6l9-3 1.5 3"/>',
    info:'<circle cx="12" cy="12" r="9.5" fill="#1CA3D6" stroke="#1CA3D6"/><path d="M12 10.5v6" stroke="#fff"/><circle cx="12" cy="7.4" r=".6" fill="#fff" stroke="#fff"/>',
    check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>'};
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1CA3D6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]||''}</svg>`;
}
function kwDocShell(o){
  const base=location.href.replace(/[^/]*([?#].*)?$/,'');
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${esc(o.title||'Kwelingo')}</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#EEF3FA;color:#13235B;padding:62px 16px 30px}
.pg{width:820px;max-width:100%;margin:0 auto;background:#fff;position:relative;overflow:hidden;padding:40px 46px 28px;box-shadow:0 14px 50px rgba(19,35,91,.14)}
.cor{position:absolute;pointer-events:none;z-index:0}.cor.tr{right:0;top:0;width:300px}.cor.br{right:0;bottom:0;width:260px}
.z{position:relative;z-index:2}
.hd{display:flex;justify-content:space-between;align-items:flex-start;gap:20px}.hd img{height:62px;display:block}
.tl{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;margin-top:22px}
.tl h1{font-size:36px;font-weight:800;letter-spacing:.5px;line-height:1;color:#13235B}.tl .s{font-size:12px;font-weight:800;letter-spacing:3px;color:#1CA3D6;margin-top:6px;text-transform:uppercase}
.no{display:inline-block;background:#FFF1DE;color:#E07B00;border:1px solid #FFD9A8;font-weight:800;font-size:13px;padding:6px 16px;border-radius:99px}
.st{display:inline-block;margin-top:8px;padding:4px 12px;border-radius:99px;font-size:11px;font-weight:800;letter-spacing:1px}
.st.ok{background:#E7F6EE;color:#1E7E34}.st.no2{background:#FDECEC;color:#D8352A}.st.pd{background:#FFF4DE;color:#B26A00}.st.in{background:#EEF4FF;color:#1F6FEB}
.info{display:grid;grid-template-columns:1.05fr 1fr;gap:22px;margin:24px 0 20px}
.bill{background:#F2F8FD;border:1px solid #E1EEF8;border-radius:16px;padding:16px 18px}.bill .lb{font-size:11px;font-weight:800;color:#5B6B8C;letter-spacing:.5px;margin-bottom:8px}
.bill .who{display:flex;gap:12px;align-items:flex-start}.bill .nm{font-size:19px;font-weight:800;line-height:1.2}.bill .ln{font-size:12.5px;color:#46557A;margin-top:5px}.bill .ln b{color:#13235B}
.dl{border-left:1.5px solid #E2E8F2;padding-left:22px;display:flex;flex-direction:column;justify-content:center;gap:11px}
.dr{display:grid;grid-template-columns:24px 112px 10px 1fr;align-items:center;font-size:12.5px;color:#46557A}.dr b{color:#13235B;font-size:13px}
table{width:100%;border-collapse:separate;border-spacing:0;font-size:12px;border:1px solid #DCEAF5;border-radius:12px;overflow:hidden}
th{background:#1CA3D6;color:#fff;text-align:left;padding:11px 10px;font-size:11.5px;font-weight:700}td{padding:10px;border-top:1px solid #EEF2F8;vertical-align:middle}
td.c,th.c{text-align:center}td.a,th.a{text-align:right}td.a{font-weight:800}td small{display:block;color:#7A88A6;font-size:10.5px;margin-top:2px}
.pill{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:99px;font-weight:700;font-size:10.5px;white-space:nowrap}
.tot{display:flex;justify-content:space-between;align-items:center;gap:14px;background:#F2F8FD;border-radius:14px;margin-top:14px;padding:0 0 0 18px}
.tot .l{font-size:13px;color:#46557A}.tot .l b{color:#13235B}
.tbox{background:linear-gradient(90deg,#FF9300,#F57C00);color:#fff;border-radius:14px;padding:13px 22px;display:flex;gap:26px;align-items:center}.tbox span{font-weight:700;font-size:14px;padding-right:22px;border-right:1.5px solid rgba(255,255,255,.5)}.tbox b{font-size:24px;font-weight:800;white-space:nowrap}.tbox span{white-space:nowrap}
.tbox.blue{background:linear-gradient(90deg,#1495C4,#26B5DF)}
.sub{display:flex;justify-content:flex-end;gap:30px;font-size:12.5px;color:#46557A;margin-top:10px;padding-right:6px}.sub b{color:#13235B}
.two{display:grid;grid-template-columns:1fr 1fr;gap:0;margin-top:20px;background:#F7FAFD;border:1px solid #E6EEF6;border-radius:16px;padding:18px 4px}
.two>div{padding:0 18px}.two>div+div{border-left:1.5px solid #E2E8F2}
.two h4{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:800;margin-bottom:10px}.two .ds{font-size:12px;color:#46557A;margin-bottom:10px}
.kv{display:flex;gap:10px;align-items:center;margin-bottom:10px}.kv small{display:block;font-size:10.5px;color:#7A88A6}.kv b{font-size:13.5px}
.steps{list-style:none}.steps li{display:flex;gap:10px;align-items:flex-start;font-size:12px;color:#33405F;margin-bottom:11px;line-height:1.5}.steps li i{font-style:normal;flex:0 0 22px;height:22px;border-radius:50%;background:#FF9300;color:#fff;font-weight:800;font-size:11.5px;display:flex;align-items:center;justify-content:center}
.bul{padding-left:16px;font-size:12px;color:#33405F;line-height:1.75}
.note{display:flex;gap:10px;align-items:center;background:#EAF6FC;border-radius:12px;padding:11px 14px;margin-top:16px;font-size:12px;color:#33507A}
.thx{text-align:center;margin:20px 0 4px}.thx h3{font-size:22px;font-weight:800;color:#13235B;letter-spacing:.3px}.thx h3 span{color:#FF9300}.thx h3.kw{font-family:'Fredoka',sans-serif;font-weight:700;font-size:28px;color:#26B5DF;letter-spacing:0}.thx p{font-size:12.5px;color:#46557A;margin-top:4px}
.ft{display:flex;gap:26px;flex-wrap:wrap;font-size:11.5px;color:#46557A;margin-top:16px;border-top:1px solid #E2E8F2;padding-top:12px;max-width:560px}.ft span{display:inline-flex;align-items:center;gap:6px}
.pbar{position:fixed;top:0;left:0;right:0;background:#1495C4;color:#fff;padding:10px;text-align:center;font-size:13px;z-index:99}.pbar button{background:#fff;color:#1495C4;border:none;padding:7px 18px;border-radius:8px;font-weight:700;cursor:pointer;margin-left:10px;font-family:inherit}
@media(max-width:700px){.pg{padding:28px 18px 22px}.info,.two{grid-template-columns:1fr}.dl{border-left:0;padding-left:0}.two>div+div{border-left:0;border-top:1.5px solid #E2E8F2;padding-top:14px;margin-top:6px}.tl{flex-direction:column;align-items:flex-start}.tl>div:last-child{text-align:left!important}.tl h1{font-size:28px}.tw{overflow-x:auto;margin:0 -4px;padding:0 4px}.tw table{min-width:620px}.hd img{height:48px}.cor.tr{width:180px}.cor.br{width:150px}table{font-size:11px}.tot{flex-direction:column;align-items:stretch;padding:12px}.tbox{justify-content:space-between}}
@media print{.pbar{display:none}body{background:#fff;padding:0}.pg{box-shadow:none;width:100%}@page{size:A4;margin:0}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>
<div class="pbar">💾 Save as PDF: click the button → choose <b>Save as PDF</b> <button onclick="window.print()">⬇️ Download / Print</button></div>
<div class="pg">
<svg class="cor tr" viewBox="0 0 300 150" preserveAspectRatio="xMaxYMin meet"><path d="M120 0H300V118C250 70 190 34 120 0z" fill="#26B5DF"/><path d="M228 0H300V64C276 40 254 20 228 0z" fill="#FF9300"/></svg>
<svg class="cor br" viewBox="0 0 260 130" preserveAspectRatio="xMaxYMax meet"><path d="M0 130C70 112 130 80 172 38 190 20 204 8 216 0V130z" fill="#FF9300"/><path d="M78 130C138 112 190 82 226 40 240 24 250 12 260 2V130z" fill="#26B5DF"/></svg>
<div class="z">
<div class="hd"><img src="${base}assets/logo-tagline.png" onerror="this.src='${base}assets/logo-h.png'" alt="Kwelingo — Home for Language Learners"></div>
${o.body}
<div class="ft"><span>${kwIcon('web',15)} ${KW_DOC_SITE}</span><span>${kwIcon('ig',15)} ${KW_DOC_IG}</span><span>${kwIcon('pin',15)} ${KW_DOC_ADDR}</span></div>
</div></div></body></html>`;
}

/* Student invoice */
function openInvoice(o){
  o=o||{};
  const w=window.open('','_blank'); if(!w){ toast('Please allow pop-ups to open the invoice','err'); return; }
  w.document.write('<p style="font-family:sans-serif;padding:40px;color:#567">Preparing invoice…</p>');
  (async()=>{
    let bank=REG_DEFAULT.bank; try{ bank=(await loadRegConfig()).bank||bank; }catch(e){}
    const st=String(o.status||'').toUpperCase(), paid=isPaid(o.status), wait=/MENUNGGU|VERIF/.test(st);
    const stCls=paid?'ok':wait?'in':'pd', stTxt=paid?'PAID':wait?'AWAITING VERIFICATION':'UNPAID';
    const items=o.items||[];
    const rows=items.map((it,i)=>`<tr><td class="c">${i+1}</td><td><b>${esc(it.d)}</b>${it.q?`<small>${esc(it.q)}</small>`:''}</td><td class="c">${esc(String(it.q||'').replace(/\D+/g,'')||'1')}</td><td class="a" style="font-weight:600">${it.p!=null?rupiah(it.p):'—'}</td><td class="a">${rupiah(it.t)}</td></tr>`).join('');
    const sess=items[0]&&String(items[0].q||'').match(/\d+/);
    const body=`<div class="tl"><div><h1>INVOICE</h1><div class="s">Student Payment</div></div><div style="text-align:right"><span class="no">${esc(o.no||'—')}</span><br><span class="st ${stCls}">${stTxt}</span></div></div>
<div class="info"><div class="bill"><div class="lb">Bill To</div><div class="who">${kwDocIc('user')}<div><div class="nm">${esc(o.student||'-')}</div>
  ${o.studentId?`<div class="ln">Student ID &nbsp;: <b>${esc(o.studentId)}</b></div>`:''}<div class="ln">Program &nbsp;&nbsp;&nbsp;&nbsp;: <b>${esc(o.program||'-')}${o.level?' – '+esc(o.level):''}</b></div>${o.parent?`<div class="ln">Parent &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <b>${esc(o.parent)}</b></div>`:''}</div></div></div>
  <div class="dl"><div class="dr">${kwDocIc('cal')}<span>Invoice Date</span><span>:</span><b>${esc(o.issue||'-')}</b></div><div class="dr">${kwDocIc('cal')}<span>Due Date</span><span>:</span><b>${esc(o.due||'-')}</b></div><div class="dr">${kwDocIc('doc')}<span>Period</span><span>:</span><b>${esc(o.period||'-')}</b></div>${paid&&o.paidOn&&o.paidOn!=='-'?`<div class="dr">${kwDocIc('check')}<span>Paid On</span><span>:</span><b>${esc(o.paidOn)}</b></div>`:''}</div></div>
<div class="tw"><table><thead><tr><th class="c" style="width:44px">No.</th><th>Description</th><th class="c" style="width:56px">Qty</th><th class="a" style="width:120px">Unit Price</th><th class="a" style="width:130px">Amount</th></tr></thead><tbody>${rows||'<tr><td colspan="5" style="text-align:center;color:#7A88A6;padding:16px">—</td></tr>'}</tbody></table></div>
<div class="tot"><div class="l">${paid?'✅ <b>Paid in full</b> — thank you!':'Please pay by <b>'+esc(o.due||'the due date')+'</b>'}</div><div class="tbox"><span>${paid?'Total Paid':'Total Amount Due'}</span><b>${rupiah(o.total)}</b></div></div>
<div class="two"><div><h4>${kwDocIc('wallet')} Payment Information</h4><div class="ds">Please make your payment to the Kwelingo Academy account below:</div>
  <div class="kv">${kwDocIc('bank')}<div><small>Bank</small><b>${esc(bank.name||'-')}</b></div></div><div class="kv">${kwDocIc('card')}<div><small>Account Number</small><b style="letter-spacing:.5px">${esc(bank.number||'-')}</b></div></div><div class="kv">${kwDocIc('user')}<div><small>Beneficiary (Account Name)</small><b>${esc(bank.holder||'-')}</b></div></div></div>
  <div><h4>${kwDocIc('doc')} Payment Instructions</h4><ul class="steps"><li><i>1</i>Transfer the total amount to the Kwelingo Academy bank account.</li><li><i>2</i>Upload your proof of payment in the Parent Hub or send it to our admin via WhatsApp.</li><li><i>3</i>Kindly ensure the payment is made by the due date above.</li></ul></div></div>
<div class="note">${kwDocIc('info')}<span><b>Note:</b> ${o.note?esc(o.note):`This invoice is for the ${esc(o.period||'')} learning period${sess?' ('+sess[0]+' sessions)':''}.`}</span></div>
<div class="thx"><h3>Thank you<span>!</span></h3><p>for being part of the Kwelingo Academy family.</p></div>`;
    w.document.open(); w.document.write(kwDocShell({title:(o.no||'Invoice')+' — '+(o.student||''),body})); w.document.close();
  })();
}

/* Prepayment Slip — Teaching Session Summary (teacher payment detail) */
function openTeachingSummary(o){
  o=o||{}; const rows=o.rows||[];
  const fee=rows.reduce((a,r)=>a+(Number(r.amount)||0),0), bonus=Number(o.bonus)||0, total=o.total!=null?Number(o.total):fee+bonus;
  const TB={Regular:['#EEF4FF','#1F6FEB',''],Recovery:['#FFF4E5','#E07A00','↺'],Reschedule:['#F3EEFF','#7C5CE6','⟳'],Rescheduled:['#F3EEFF','#7C5CE6','⟳']};
  const SB={Completed:['#E7F6EE','#1E7E34','✔'],Canceled:['#FDECEC','#D8352A','✕'],Cancelled:['#FDECEC','#D8352A','✕'],Scheduled:['#EEF4FF','#1F6FEB','•'],Rescheduled:['#F3EEFF','#7C5CE6','↻']};
  const pill=(m,t)=>`<span class="pill" style="background:${m[0]};color:${m[1]}">${m[2]?m[2]+' ':''}${esc(t)}</span>`;
  const st=String(o.status||'').toLowerCase(), stCls=/paid|sent|transfer/.test(st)?'ok':/confirm/.test(st)?'in':'pd';
  const qty=r=>/cancel/i.test(r.status)?0:1, paidN=rows.filter(r=>!/cancel/i.test(r.status)).length;
  const b=o.bank||{};
  const body=`<div class="tl"><div><h1>PREPAYMENT SLIP</h1><div class="s">Teaching Session Summary</div></div><div style="text-align:right"><span class="no">${esc(o.slipNo||'—')}</span>${o.status?`<br><span class="st ${stCls}">${esc(String(o.status).toUpperCase())}</span>`:''}</div></div>
<div class="info"><div class="bill"><div class="lb">Pay To</div><div class="who">${kwDocIc('user')}<div><div class="nm">${esc(o.name||'Teacher')}</div><div class="ln">Role &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <b>Teacher</b></div>${o.programs?`<div class="ln">Program &nbsp;: <b>${esc(o.programs)}</b></div>`:''}</div></div></div>
  <div class="dl"><div class="dr">${kwDocIc('cal')}<span>Payment Period</span><span>:</span><b>${esc(o.range||'-')}</b></div><div class="dr">${kwDocIc('doc')}<span>Period</span><span>:</span><b>${esc(o.period||'-')}</b></div>${o.paidOn?`<div class="dr">${kwDocIc('check')}<span>Paid On</span><span>:</span><b>${esc(o.paidOn)}</b></div>`:''}</div></div>
<div class="tw"><table><thead><tr><th class="c" style="width:40px">No.</th><th>Date</th><th>Class</th><th>Class Type</th><th>Status</th><th class="c">Qty</th><th class="a">Amount</th></tr></thead><tbody>
${rows.map((r,i)=>`<tr><td class="c">${i+1}</td><td style="white-space:nowrap">${esc(r.date)}</td><td>${esc(r.cls)}</td><td>${pill(TB[r.type]||TB.Regular,r.type==='Rescheduled'?'Reschedule':r.type||'Regular')}</td><td>${pill(SB[r.status]||SB.Scheduled,r.status||'Scheduled')}</td><td class="c">${qty(r)}</td><td class="a">${rupiah(r.amount)}</td></tr>`).join('')||'<tr><td colspan="7" style="text-align:center;color:#7A88A6;padding:18px">No sessions in this period.</td></tr>'}
</tbody></table></div>
${bonus?`<div class="sub"><span>Teaching Fee: <b>${rupiah(fee)}</b></span><span>Commission / Bonus${o.bonusNote?' ('+esc(o.bonusNote)+')':''}: <b>${rupiah(bonus)}</b></span></div>`:''}
<div class="tot"><div class="l">Total Sessions: <b>${rows.length}</b>${rows.length!==paidN?` <span style="color:#7A88A6">(${paidN} paid)</span>`:''}</div><div class="tbox blue"><span>Total Amount</span><b>${rupiah(total)}</b></div></div>
<div class="two"><div><h4>${kwDocIc('bank')} Teacher Bank Account</h4>
  <div class="kv">${kwDocIc('bank')}<div><small>Bank</small><b>${esc(b.bank||'-')}</b></div></div><div class="kv">${kwDocIc('card')}<div><small>Account Number</small><b style="letter-spacing:.5px">${esc(b.account||'-')}</b></div></div><div class="kv">${kwDocIc('user')}<div><small>Beneficiary</small><b>${esc(b.holder||o.name||'-')}</b></div></div></div>
  <div><h4>${kwDocIc('doc')} Payment Notes</h4><ul class="bul"><li>This payment covers the teaching sessions shown in the table above.</li><li>Only completed sessions are included in the total amount.</li><li>Payment is transferred to the bank account listed on the left.</li><li>Kindly confirm once the transfer is received.</li></ul></div></div>
<div class="note">${kwDocIc('info')}<span><b>Thank you for being part of the Kwelingo Academy family!</b><br>Your dedication helps our students grow and achieve their language goals.</span></div>`;
  const w=window.open('','_blank'); if(!w){ toast('Please allow pop-ups to open the slip','err'); return; }
  w.document.write(kwDocShell({title:'Prepayment Slip — '+(o.name||'')+' — '+(o.period||''),body})); w.document.close();
}


/* ============================================================
   TeacherNotes blog — shared helpers (blog.html, index.html, blog-admin.html, master-admin.html)
   ============================================================ */
const BLOG_CATS=[...BLOG_SECTIONS['TeacherNotes'].cats,...BLOG_SECTIONS['Open Pages'].cats];
function blogSlug(t){ return String(t||'post').toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g,'').trim().replace(/[\s_-]+/g,'-').slice(0,70)||'post'; }
// allow only safe formatting tags in article HTML
function blogSanitize(html){
  const ok={P:[],H2:[],H3:[],H4:[],B:[],STRONG:[],I:[],EM:[],U:[],UL:[],OL:[],LI:[],BLOCKQUOTE:[],A:['href'],IMG:['src','alt'],BR:[],HR:[],FIGURE:[],FIGCAPTION:[],SPAN:[],DIV:[]};
  const doc=new DOMParser().parseFromString('<div>'+String(html||'')+'</div>','text/html');
  const walk=node=>{ [...node.childNodes].forEach(n=>{
    if(n.nodeType===3) return; if(n.nodeType!==1){ n.remove(); return; }
    if(!ok[n.tagName]){ if(['SCRIPT','STYLE','IFRAME','OBJECT','EMBED','FORM','INPUT','BUTTON','TEXTAREA','SELECT'].includes(n.tagName)){ n.remove(); return; } walk(n); n.replaceWith(...n.childNodes); return; }
    [...n.attributes].forEach(a=>{ if(!ok[n.tagName].includes(a.name)) n.removeAttribute(a.name); });
    if(n.hasAttribute('href')&&!/^(https?:|mailto:|\/|#)/i.test(n.getAttribute('href'))) n.removeAttribute('href');
    if(n.hasAttribute('src')&&!/^(https?:|data:image\/)/i.test(n.getAttribute('src'))) n.remove();
    if(n.tagName==='A'){ n.setAttribute('target','_blank'); n.setAttribute('rel','noopener'); }
    walk(n); }); };
  const root=doc.body.firstChild; walk(root); return root.innerHTML;
}
function blogReadMins(html){ const w=String(html||'').replace(/<[^>]+>/g,' ').trim().split(/\s+/).filter(Boolean).length; return Math.max(1,Math.round(w/200)); }
async function blogPublished(){ let r=[]; try{ r=await API.list('blog_posts',{status:'Published'},'published_at.desc')||[]; }catch(e){} return r.sort((a,b)=>String(b.published_at||'').localeCompare(String(a.published_at||''))); }

/* demo data for the blog */
(function seedBlog(){
  if(typeof DEMO==='undefined') return;
  const t=todayStr(), add=n=>{const d=new Date(t+'T00:00:00'); d.setDate(d.getDate()+n); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  DEMO.blog_writers=[{id:'bw1',nama:'Nadia Putri',username:'nadiablog',pin:'1357',email:'nadia@kwelingo.com',bio:'English teacher & content writer at Kwelingo.',status:'Active',role:'Teacher',created_at:add(-40)+'T09:00:00'}];
  DEMO.blog_posts=[
    {id:'bp1',title:'5 Easy Habits to Practise English Every Day',slug:'5-easy-habits-to-practise-english-every-day',section:'TeacherNotes',category:'Teaching Strategies',cover_url:'',excerpt:'Small daily habits make a big difference. Here are five simple ways to keep your English growing — even on busy days.',content:'<p>Learning a language is a marathon, not a sprint. The good news? A few minutes a day is enough to keep growing.</p><h2>1. Think in English</h2><p>Describe what you are doing in your head: <em>“I’m making breakfast, then I’ll catch the bus.”</em></p><h2>2. Keep a mini diary</h2><p>Write three sentences every night about your day.</p><h2>3. Shadow a short video</h2><p>Pick a 1-minute clip and repeat after the speaker.</p><blockquote>Consistency beats intensity.</blockquote><h2>4. Label your home</h2><p>Sticky notes on objects help new words stick.</p><h2>5. Talk to someone</h2><p>Join a Speak Active session and use what you learned!</p>',author_id:'bw1',author_name:'Nadia Putri',status:'Published',published_at:add(-6)+'T10:00:00',created_at:add(-8)+'T10:00:00'},
    {id:'bp2',title:'HSK 1 vs HSK 2: Which Level Should You Start With?',slug:'hsk-1-vs-hsk-2',section:'TeacherNotes',category:'Learning & Assessment',cover_url:'',excerpt:'Not sure where to begin with the HSK? We compare the first two levels so you can choose the right starting point.',content:'<p>The HSK (汉语水平考试) is the standard Mandarin proficiency test. Levels 1 and 2 are where most learners begin.</p><h2>HSK 1</h2><ul><li>150 words</li><li>Basic greetings and numbers</li></ul><h2>HSK 2</h2><ul><li>300 words</li><li>Simple daily conversations</li></ul><p>Not sure? Book a discovery session and we will help you decide.</p>',author_id:'bw1',author_name:'Nadia Putri',status:'Published',published_at:add(-15)+'T09:00:00',created_at:add(-16)+'T09:00:00'},
    {id:'bp3',title:'How to Prepare for IELTS Speaking Part 2',slug:'ielts-speaking-part-2',section:'TeacherNotes',category:'Classroom Activities',cover_url:'',excerpt:'One minute to prepare, two minutes to speak. Here is a simple structure that works.',content:'<p>In Part 2 you get a cue card, one minute to prepare and up to two minutes to speak.</p><h2>A simple structure</h2><ol><li>Introduce the topic</li><li>Give details (who, what, when)</li><li>Explain why it matters to you</li></ol>',author_id:'bw1',author_name:'Nadia Putri',status:'Pending',submitted_at:add(-1)+'T15:00:00',created_at:add(-2)+'T15:00:00'},
    {id:'bp4',title:'My First Trip Abroad: Ordering Food in English',slug:'my-first-trip-abroad',section:'Open Pages',category:'Travel & Experiences',cover_url:'',excerpt:'I was so nervous to speak English in a real café. Here is what happened — and what I learned.',content:'<p>Last holiday my family went to Singapore. On the second day I decided to order breakfast by myself.</p><h2>The moment of truth</h2><p>My hands were cold, but I said: <em>“Can I have a kaya toast set, please?”</em> The waiter smiled and answered — and I understood everything!</p><blockquote>Mistakes are proof that you are trying.</blockquote><p>Now I am not afraid to speak anymore. What about you?</p>',author_id:'bw2',author_name:'Kevin Tan',status:'Published',published_at:add(-3)+'T08:00:00',created_at:add(-4)+'T08:00:00'},
    {id:'bp5',title:'What If Everyone Spoke the Same Language?',slug:'what-if-same-language',section:'Open Pages',category:'What If…?',cover_url:'',excerpt:'Would the world be easier — or more boring? A student imagines a world with only one language.',content:'<p>Imagine waking up tomorrow and everyone in the world speaks the same language.</p><h2>The good side</h2><ul><li>Travelling would be easy</li><li>No more translation apps</li></ul><h2>The other side</h2><p>But we would lose songs, jokes and words that only exist in one language. I think learning languages is like collecting keys to different houses.</p>',author_id:'bw2',author_name:'Kevin Tan',status:'Published',published_at:add(-10)+'T08:00:00',created_at:add(-11)+'T08:00:00'},
  ];
  DEMO.blog_writers.push({id:'bw2',nama:'Kevin Tan',username:'kevinblog',pin:'2468',email:'',bio:'Boost English student who loves travelling.',status:'Active',role:'Student',created_at:add(-20)+'T09:00:00'});
})();

/* outline icons for portal menus, page headers & dashboard stat cards (also for content rendered later) */
try{ if(typeof document!=='undefined'){ kwIconize(document);
  if(window.MutationObserver&&document.body){ let _kwT=null; new MutationObserver(()=>{ clearTimeout(_kwT); _kwT=setTimeout(()=>{ try{ kwIconize(document); }catch(e){} },60); }).observe(document.body,{childList:true,subtree:true}); } } }catch(e){}
