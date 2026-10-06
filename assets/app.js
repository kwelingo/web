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
  return `<div class="ls-logo"><img src="assets/logo.png" class="ls-logo-img" alt="Kwelingo">${sub?`<span class="ls-sub">${sub}</span>`:''}</div>`;
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
  const mon=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return `${d.getDate()} ${mon[d.getMonth()]} ${d.getFullYear()}`;
}
function dayName(iso){
  const d=new Date(iso+'T00:00:00'); if(isNaN(d)) return '';
  return ['Min','Sen','Sel','Rab','Kam','Jum','Sab'][d.getDay()];
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
  const ic=(a.querySelector('.ic')||{}).textContent||'•';
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
  menu.innerHTML=`<span class="bi">☰</span><span class="bl">Menu</span>`;
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
    if(isWrite && SCRIPT_API._busy) throw new Error('Masih menyimpan permintaan sebelumnya — tunggu sebentar, jangan klik dua kali.');
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
          throw new Error('Koneksi ke server gagal. Coba refresh halaman.');
        }
        let j=null; try{ j=JSON.parse(text); }catch(_){ j=null; }
        if(j===null){   // dapat HTML/non-JSON (server ngadat sesaat)
          if(i<tries-1){ await new Promise(res=>setTimeout(res,600*(i+1))); continue; }
          throw new Error(isWrite
            ? 'Server sesaat tidak merespons dengan benar. Data KEMUNGKINAN sudah tersimpan — refresh & cek dulu sebelum menyimpan ulang.'
            : 'Server sedang sibuk, gagal memuat data. Silakan refresh halaman.');
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

  // Teaching Resources (modul PDF — owner upload, guru view-only)
  getResources : ()  => SCRIPT_API._post({action:'getResources'}),
  addResource  : (d) => SCRIPT_API._post({action:'addResource',...d}),
  deleteResource:(id)=> SCRIPT_API._post({action:'deleteResource',id}),
  // Bukti terima fee / payroll guru
  getPayroll   : (o={}) => SCRIPT_API._post({action:'getPayroll',...o}),
  savePayroll  : (d) => SCRIPT_API._post({action:'savePayroll',...d}),
  deletePayroll:(id)=> SCRIPT_API._post({action:'deletePayroll',id}),
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
  students:['id','nama','username','school','address','dob','grade','parent_name','wa_ortu','tutor_id','schedule','class_group','fee_per_meeting','fee_tentor','meeting_minutes','deposit_meetings','add_fee','add_fee_note','pin','active','link_id'],
  tutors:['id','nama','username','subject','level','address','dob','wa','pin'],
  classes:['id','date','student_id','tutor_id','start_time','end_time','duration','type','topic','note','material_url','doc_url','stu_in','stu_out','tut_in','tut_out','lesson_plan','status','req_by','req_note','attend','resched_date','resched_time','resched_note','rec_audio','rec_video'],
  deposit:['student_id','paid_meetings','minutes_total','minutes_used','fee_per_meeting','last_paid','status'],
  payments:['id','student_id','month','pay_date','meetings','price_per_meet','duration','deposit_total','carry_in','extra_minutes','add_fee1','add_fee2','add_fee2_note','next_meetings','next_deposit','grand_total','status','proof_url'],
  resources:['id','title','subject','level','file_url','note'],
  payroll:['id','tutor_id','month','amount','transfer_date','proof_url','note','status'],
  announcements:['id','title','body','date','class_group','author'],
  quizzes:['id','title','subject','level','questions'],
  quiz_results:['id','quiz_id','student_id','student_name','score','total','taken_at'],
  discussion:['id','student_id','name','message'],
  ratings:['id','class_id','student_id','tutor_id','stars','comment','scores','liked','improve'],
  diary:['id','student_id','tutor_id','author','message'],
  tasks:['id','student_id','tutor_id','title','detail','type','due_date','status','done_at','submit_url','submit_text','submit_at','points','feedback','graded_at'],
  chat:['id','room','sender_id','sender_name','role','message'],
  tboard:['id','title','body','date','author'],
  tboard_read:['id','board_id','reader_id','reader_name','read_at'],
};
const sbPick=(o,cols)=>{const r={};cols.forEach(k=>{ if(o[k]!==undefined && o[k]!==null) r[k]=o[k]; });return r;};
const SB = {
  base: (SUPABASE_URL||'').replace(/\/$/,'')+'/rest/v1/',
  _busy:false,
  async req(path,{method='GET',body=null,prefer=null,isWrite=false}={}){
    if(isWrite && SB._busy) throw new Error('Masih menyimpan permintaan sebelumnya — tunggu sebentar, jangan klik dua kali.');
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
          throw new Error('Koneksi ke server gagal. Coba refresh halaman.');
        }
        if(!res.ok){
          if(!isWrite && res.status>=500 && i<tries-1){ await new Promise(r=>setTimeout(r,500*(i+1))); continue; }
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
  if(!rows.length) throw new Error(table==='students'?'Murid tidak ditemukan':'Guru tidak ditemukan');
  const hit=rows.find(x=>String(x.pin)===String(pin));
  if(!hit) throw new Error('PIN salah');
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
    if(String(oldPin)!==String(cur)) return {ok:false,message:'Password lama salah.'};
    if(!/^\d{4,10}$/.test(String(newPin||''))) return {ok:false,message:'Password baru harus 4–10 digit angka.'};
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
        throw new Error("Bucket 'materials' belum ada di Supabase. Jalankan supabase-storage.sql dulu.");
      throw new Error('Upload gagal: '+(t||('HTTP '+res.status)));
    }
    const url=`${(SUPABASE_URL||'').replace(/\/$/,'')}/storage/v1/object/public/${bucket}/${path}`;
    return {url,view:url,name:filename};
  },
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
    if(!real) return `<span class="muted" title="File lama belum ter-upload — minta guru upload ulang">📄 ${name}</span>`;
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
  requested:{label:'Menunggu ACC',cls:'badge-pending',ic:'🕒'},
  scheduled:{label:'Terjadwal',cls:'badge-active',ic:'📅'},
  reschedule:{label:'Minta Reschedule',cls:'badge-pending',ic:'🔄'},
  declined:{label:'Ditolak',cls:'badge-off',ic:'✖️'},
  done:{label:'Selesai',cls:'badge-paid',ic:'✅'},
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
  hadir:{label:'Hadir',cls:'badge-paid',ic:'✅'},
  izin:{label:'Izin',cls:'badge-pending',ic:'📝'},
  alpa:{label:'Alpa',cls:'badge-off',ic:'❌'},
};
function attendBadge(v){
  const a=ATTEND_META[v];
  if(a) return `<span class="badge ${a.cls}">${a.ic} ${a.label.toUpperCase()}</span>`;
  return '<span class="badge badge-pending">🕒 TERJADWAL</span>';
}
// Badge yang konsisten dengan perhitungan %: sesi lampau yang belum ditandai dianggap hadir.
function attendBadgeFor(c){
  if(c.attend) return attendBadge(c.attend);
  if(isSession(c) && c.date && c.date<todayStr())
    return '<span class="badge badge-paid" title="Belum ditandai guru — dihitung hadir">✅ HADIR</span>';
  return '<span class="badge badge-pending">🕒 TERJADWAL</span>';
}
/* Hitung statistik kehadiran dari array kelas (1 murid).
   pct = hadir / (sesi yang sudah di-mark hadir/izin/alpa) × 100.
   Sesi lampau tanpa mark dianggap hadir (kompatibel data lama). */
function attendanceStats(classes){
  const ses=(classes||[]).filter(isSession);
  let hadir=0,izin=0,alpa=0,belum=0;
  const today=todayStr();
  ses.forEach(c=>{
    const a=c.attend;
    if(a==='hadir')hadir++;
    else if(a==='izin')izin++;
    else if(a==='alpa')alpa++;
    else if(c.date && c.date<today) hadir++;    // sesi lampau belum di-mark → anggap hadir
    else belum++;                               // hari ini / akan datang → belum dihitung
  });
  const counted=hadir+izin+alpa;
  const pct=counted?Math.round(hadir/counted*100):0;
  return {total:ses.length,hadir,izin,alpa,belum,counted,pct};
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
function openCertificate(o){
  o=o||{};
  const nm=esc(o.name||'Student');
  const prog=esc(o.program||'Language Program');
  const pct=o.pct!=null?o.pct:'';
  const period=esc(o.period||'');
  const sessions=o.sessions!=null?o.sessions:'';
  const issuer=esc(o.issuer||'Kwelingo Academy');
  const dateStr=esc(o.date||longToday());
  const no=esc(o.no||('KWE/'+new Date().getFullYear()+'/'+Math.floor(1000+Math.random()*9000)));
  const logo=location.href.replace(/[^/]*$/,'')+'assets/logo.png';
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificate — ${nm}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Poppins:wght@400;500;600&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Poppins',sans-serif;background:#f3ece0;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:24px}
  .cert{width:1000px;max-width:100%;aspect-ratio:1.414/1;background:#FFF9F0;position:relative;padding:60px 64px;
    border:3px solid #E9A77C;border-radius:14px;box-shadow:0 14px 50px rgba(0,0,0,.14);overflow:hidden}
  .cert:before{content:"";position:absolute;inset:14px;border:1.5px solid #8EC9D9;border-radius:8px;pointer-events:none}
  .blob{position:absolute;border-radius:50%;opacity:.5}
  .b1{width:220px;height:220px;background:#F4D98B;top:-90px;right:-70px}
  .b2{width:180px;height:180px;background:#A8C9A0;bottom:-80px;left:-60px}
  .inner{position:relative;z-index:2;text-align:center}
  .brand{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:8px}
  .brand img{height:52px}
  .brand .bn{font-family:'Fredoka';font-size:26px;font-weight:700;color:#8EC9D9}
  .cap{letter-spacing:4px;font-size:12px;color:#B08968;margin:14px 0 4px}
  .title{font-family:'Fredoka';font-size:40px;font-weight:700;color:#4B4540;margin-bottom:18px}
  .pre{font-size:13px;color:#6b6258}
  .name{font-family:'Fredoka';font-size:38px;font-weight:700;color:#E9A77C;margin:10px 0 6px;border-bottom:2px dashed #e0cdb6;display:inline-block;padding:0 26px 8px}
  .desc{font-size:14px;color:#4B4540;max-width:640px;margin:16px auto 0;line-height:1.6}
  .desc b{color:#3E8A9E}
  .meta{display:flex;justify-content:center;gap:40px;margin-top:26px}
  .meta .m .v{font-family:'Fredoka';font-size:22px;font-weight:700;color:#7FB37A}
  .meta .m .l{font-size:11px;color:#8a8178;letter-spacing:1px}
  .foot{display:flex;justify-content:space-between;align-items:flex-end;margin-top:40px;padding:0 20px}
  .sig{text-align:center;min-width:200px}
  .sig .ln{border-top:1.5px solid #4B4540;margin-bottom:6px}
  .sig .r{font-size:11px;color:#8a8178}
  .sig b{color:#4B4540;font-size:13px}
  .seal{width:92px;height:92px;border-radius:50%;background:radial-gradient(circle,#F4D98B,#E9A77C);display:flex;align-items:center;justify-content:center;
    font-family:'Fredoka';font-weight:700;color:#fff;font-size:12px;text-align:center;line-height:1.1;box-shadow:0 4px 14px rgba(233,167,124,.5)}
  .no{position:absolute;bottom:22px;left:0;right:0;text-align:center;font-size:10.5px;color:#b3a898;z-index:2}
  .pbar{position:fixed;top:0;left:0;right:0;background:#3E8A9E;color:#fff;padding:10px;text-align:center;font-size:13px;z-index:99}
  .pbar button{background:#fff;color:#3E8A9E;border:none;padding:7px 18px;border-radius:8px;font-weight:700;cursor:pointer;margin-left:10px;font-family:'Poppins'}
  @media print{.pbar{display:none}body{background:#fff;padding:0}.cert{box-shadow:none;border-color:#E9A77C}@page{size:A4 landscape;margin:0}}
</style></head><body>
  <div class="pbar">💾 Simpan sebagai PDF lewat tombol ini → pilih <b>Save as PDF</b>
    <button onclick="window.print()">🖨️ Download / Print</button></div>
  <div class="cert">
    <div class="blob b1"></div><div class="blob b2"></div>
    <div class="inner">
      <div class="brand"><img src="${logo}" alt=""><span class="bn">${issuer}</span></div>
      <div class="cap">HOME FOR LANGUAGE LEARNERS</div>
      <div class="title">Certificate of Completion</div>
      <div class="pre">This certificate is proudly presented to</div>
      <div class="name">${nm}</div>
      <div class="desc">for successfully completing the <b>${prog}</b> program at ${issuer}
        with an attendance of <b>${pct}%</b>${period?` during <b>${period}</b>`:''}, demonstrating
        dedication, consistency, and a genuine love for learning languages.</div>
      <div class="meta">
        <div class="m"><div class="v">${pct}%</div><div class="l">ATTENDANCE</div></div>
        ${sessions!==''?`<div class="m"><div class="v">${sessions}</div><div class="l">SESSIONS</div></div>`:''}
      </div>
      <div class="foot">
        <div class="sig"><div class="ln"></div><b>${issuer}</b><div class="r">Academy Director</div></div>
        <div class="seal">KWE<br>HOME</div>
        <div class="sig"><div class="ln"></div><b>${dateStr}</b><div class="r">Date Issued</div></div>
      </div>
    </div>
    <div class="no">Certificate No. ${no}</div>
  </div>
</body></html>`;
  const w=window.open('','_blank');
  if(!w){ toast('Izinkan pop-up untuk membuka sertifikat','err'); return; }
  w.document.write(html); w.document.close();
}

/* ============================================================
   KEUANGAN — status tagihan & slip gaji guru (shared)
   ============================================================ */
/* Status pembayaran murid: LUNAS / TERVERIFIKASI (lunas) ·
   MENUNGGU VERIFIKASI (bukti dikirim ortu) · BELUM BAYAR (tagihan). */
const PAY_STATUS = {
  'LUNAS':{cls:'badge-paid',ic:'✅'},
  'TERVERIFIKASI':{cls:'badge-paid',ic:'✅'},
  'MENUNGGU VERIFIKASI':{cls:'badge-pending',ic:'🕒'},
  'BELUM BAYAR':{cls:'badge-off',ic:'📌'},
};
function payStatusBadge(s){ s=String(s||'LUNAS').toUpperCase(); const m=PAY_STATUS[s]||PAY_STATUS['LUNAS']; return `<span class="badge ${m.cls}">${m.ic} ${s}</span>`; }
function isPaid(s){ s=String(s||'').toUpperCase(); return s==='LUNAS'||s==='TERVERIFIKASI'; }

/* ===== Notifikasi: status pembayaran ortu & status gaji guru ===== */
const PAYROLL_PAID = ['DIBAYAR','DITERIMA','LUNAS','TRANSFER','SUDAH DIBAYAR','PAID','TERKIRIM'];
function payrollPaid(s){ return PAYROLL_PAID.includes(String(s||'').toUpperCase().trim()); }
function payrollStatusInfo(s){
  const raw=String(s||'DIPROSES').toUpperCase().trim();
  if(payrollPaid(raw)) return {paid:true,label:'Sudah dibayar',badge:'<span class="badge badge-paid">✅ SUDAH DIBAYAR</span>'};
  return {paid:false,label:'Belum / sedang diproses',badge:'<span class="badge badge-pending">🕒 '+(raw||'DIPROSES')+'</span>'};
}
function monthName(m){ try{ return new Date(String(m)+'-01').toLocaleDateString('id-ID',{month:'long',year:'numeric'}); }catch(e){ return m||''; } }
function rupiah(n){ return 'Rp '+(Number(n)||0).toLocaleString('id-ID'); }

/* Render daftar notifikasi ke sebuah container. items:[{level:'warn|ok|info',icon,title,sub}] */
function renderNotif(box, items){
  if(!box) return;
  if(!items || !items.length){ box.innerHTML=''; box.style.display='none'; return; }
  box.style.display='';
  const col={warn:'var(--orange)',ok:'var(--green2)',info:'var(--blue)'};
  box.innerHTML='<div class="card card-pad" style="margin-bottom:18px;padding:14px 16px;border-left:4px solid var(--orange)">'
    + '<div style="font-weight:700;color:var(--navy);margin-bottom:6px">🔔 Notifikasi <span style="background:var(--orange);color:#fff;border-radius:999px;font-size:11px;padding:1px 8px;margin-left:4px">'+items.length+'</span></div>'
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
    if(inf.paid) return {level:'ok',icon:'💰',title:`Gaji ${per} sudah dikirim`,sub:(r.transfer_date?('Ditransfer '+prettyDate(r.transfer_date)+(r.amount?' · ':'')):'')+(r.amount?rupiah(r.amount):'')+(r.note?(' · '+r.note):'')};
    return {level:'warn',icon:'⏳',title:`Gaji ${per} belum dikonfirmasi dikirim`,sub:'Status: '+(r.status||'sedang diproses')+'. Menunggu admin konfirmasi transfer.'};
  });
}

/* Notifikasi tagihan untuk ORANG TUA (dari tabel payments). */
async function parentPayNotifs(studentId){
  let rows=[]; try{ rows=await API.getPayments({student_id:studentId})||[]; }catch(e){ return []; }
  return rows.filter(p=>!isPaid(p.status)).sort((a,b)=>String(a.month||'').localeCompare(String(b.month||''))).map(p=>{
    const per=monthName(p.month); const amt=p.grand_total||p.amount||p.next_deposit;
    const st=String(p.status||'').toUpperCase().trim();
    if(st==='MENUNGGU VERIFIKASI') return {level:'info',icon:'🕒',title:`Pembayaran ${per} menunggu verifikasi`,sub:'Bukti sudah dikirim — menunggu admin memverifikasi.'};
    return {level:'warn',icon:'📌',title:`Tagihan ${per} belum dibayar`,sub:(amt?('Jumlah: '+rupiah(amt)+' · '):'')+'Silakan bayar lalu upload bukti di menu Pembayaran.'};
  });
}

/* Slip Pembayaran Fee Guru (bisa dipakai sebagai prepayment slip) — buka tab print/PDF */
function openPayrollSlip(o){
  o=o||{};
  const nm=esc(o.name||'Guru');
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
  if(!w){ toast('Izinkan pop-up untuk membuka slip','err'); return; }
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
  assigned:{label:'Ditugaskan',cls:'badge-pending',ic:'🕒'},
  submitted:{label:'Dikumpulkan',cls:'badge-active',ic:'📤'},
  graded:{label:'Dinilai',cls:'badge-paid',ic:'⭐'},
  done:{label:'Selesai',cls:'badge-paid',ic:'✅'},   // kompatibel data lama
};
function taskStatus(t){ const s=(t&&t.status)||'assigned'; return s==='done'?'submitted':s; }
function taskBadge(s){ const m=TASK_STATUS[s||'assigned']||TASK_STATUS.assigned; return `<span class="badge ${m.cls}">${m.ic} ${m.label.toUpperCase()}</span>`; }
// Jenis Extended Practice
const TASK_TYPES={
  assignment:'Assignment', writing:'Writing', lesson_review:'Lesson Review',
  final_project:'Final Project', peer_case:'Peer Case-Study', voice_video:'Voice/Video Recording',
};
function taskTypeLabel(t){ return TASK_TYPES[t]||'Tugas'; }
// Kategori rating kelas & guru (rubrik 1-5)
const RATING_CATS=[
  'Guru menjelaskan materi dengan jelas',
  'Materi kelas bermanfaat',
  'Pelajaran tersusun rapi',
  'Guru mendorong partisipasi murid',
  'Aktivitas kelas menarik',
  'Tugas sesuai & pas',
  'Suasana kelas nyaman',
  'Secara keseluruhan saya puas dengan kelas ini',
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
    const role=m.role?`<span style="color:var(--muted);font-weight:500;font-size:10px"> · ${esc(m.role)}</span>`:'';
    return `<div class="msg ${me?'me':''}"><div class="av">${(String(m.sender_name||'?')[0]||'?').toUpperCase()}</div>
      <div class="bub"><b>${esc(m.sender_name||'')}${role}</b>${esc(m.message||'')}<div class="t">${m.created_at?prettyDate(String(m.created_at).slice(0,10)):''}</div></div></div>`;
  }).join('') || '<div class="muted" style="text-align:center;padding:20px">Belum ada pesan. Mulai percakapan 👋</div>';
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
    {id:'t1',nama:'Mr. Yesaya',subject:'Math',   level:'Upper Secondary (SMA)',address:'Jl. Ngagel 3, Surabaya',dob:'1995-04-10',wa:'081200000001',pin:'2468'},
    {id:'t2',nama:'Ms. Dian',  subject:'Science',level:'Lower Secondary (SMP)',address:'Jl. Manyar 7, Surabaya',dob:'1996-11-02',wa:'081200000002',pin:'1357'},
    {id:'t3',nama:'Mr. Kevin', subject:'English',level:'Primary (SD)',         address:'Jl. Darmo 21, Surabaya',dob:'1994-07-19',wa:'081200000003',pin:'9753'},
  ],
  students:[
    {id:'s1',nama:'Anton Wijaya',school:'SMP Petra 1',address:'Jl. Kertajaya 12, Surabaya',dob:'2013-05-14',grade:'7',parent_name:'Ibu Rina Wijaya',wa_ortu:'081234567890',
     tutor_id:'t1',schedule:'Sen & Kam · 19.00',class_group:'English A · Sen&Kam 19.00',fee_per_meeting:150000,fee_tentor:90000,meeting_minutes:90,
     deposit_meetings:16,add_fee:300000,add_fee_note:'Biaya les olimpiade (Agustus)',pin:'1111',active:'aktif',link_id:'anton-s1'},
    {id:'s2',nama:'Budi Santoso',school:'SMP Cita Hati',address:'Jl. Diponegoro 45, Surabaya',dob:'2012-09-03',grade:'8',parent_name:'Bpk. Hadi',wa_ortu:'081234500011',
     tutor_id:'t2',schedule:'Sel · 16.00',class_group:'English A · Sen&Kam 19.00',fee_per_meeting:150000,fee_tentor:90000,meeting_minutes:90,
     deposit_meetings:8,pin:'2222',active:'aktif',link_id:'budi-s2'},
    {id:'s3',nama:'Clara Halim',school:'SD Gloria',address:'Jl. Mayjend Sungkono 8, Surabaya',dob:'2014-01-22',grade:'6',parent_name:'Ibu Mega',wa_ortu:'081234500022',
     tutor_id:'t3',schedule:'Rab & Jum · 15.30',fee_per_meeting:140000,fee_tentor:85000,meeting_minutes:90,
     deposit_meetings:12,pin:'3333',active:'aktif',link_id:'clara-s3'},
  ],
  classes:[
    {id:'c101',date:todayStr(),student_id:'s1',tutor_id:'t1',start_time:'19:00',end_time:'',duration:90,type:'onsite',topic:'',note:'',material_url:'',doc_url:'',
     stu_in:'',stu_out:'',tut_in:'',tut_out:''},
    {id:'c102',date:todayStr(),student_id:'s2',tutor_id:'t2',start_time:'16:00',end_time:'',duration:90,type:'online',topic:'',note:'',material_url:'',doc_url:'',
     stu_in:'',stu_out:'',tut_in:'',tut_out:''},
    // history for Anton
    {id:'c1',date:'2026-07-28',student_id:'s1',tutor_id:'t1',start_time:'19:00',end_time:'20:30',duration:90,type:'onsite',
     topic:'Linear Equation (Persamaan Linear)',note:'Anton cukup aktif dan memahami materi dengan baik.',material_url:'materi/linear-equation.pdf',doc_url:'doc1'},
    {id:'c2',date:'2026-07-21',student_id:'s1',tutor_id:'t1',start_time:'19:00',end_time:'20:30',duration:90,type:'onsite',status:'done',attend:'izin',
     topic:'Algebraic Fractions',note:'Perlu latihan lebih banyak soal cerita.',material_url:'materi/algebraic-fractions.pdf',doc_url:'doc2'},
    {id:'c3',date:'2026-07-14',student_id:'s1',tutor_id:'t1',start_time:'19:00',end_time:'21:00',duration:120,type:'onsite',
     topic:'Linear Inequalities',note:'Kelas ditambah 30 menit.',material_url:'materi/inequalities.pdf',doc_url:'doc3'},
    {id:'c4',date:'2026-07-07',student_id:'s1',tutor_id:'t1',start_time:'19:00',end_time:'20:30',duration:90,type:'onsite',
     topic:'Integers (Bilangan Bulat)',note:'Anton sudah mulai terbiasa.',material_url:'materi/integers.pdf',doc_url:'doc4'},
    {id:'c5',date:'2026-06-30',student_id:'s1',tutor_id:'t1',start_time:'19:00',end_time:'20:30',duration:90,type:'onsite',status:'done',attend:'hadir',
     topic:'Introduction to Algebra',note:'Good job!',material_url:'materi/intro-algebra.pdf',doc_url:'doc5',rec_video:'https://youtu.be/dQw4w9WgXcQ'},
    // --- demo permintaan kelas (status requested / reschedule) ---
    {id:'r1',date:'2026-09-20',student_id:'s2',tutor_id:'t2',start_time:'16:00',end_time:'',duration:90,type:'online',status:'requested',req_by:'ortu',
     req_note:'Minta tambahan sesi Science sebelum ujian.',topic:'',note:''},
    {id:'r2',date:'2026-09-18',student_id:'s3',tutor_id:'t3',start_time:'15:30',end_time:'',duration:90,type:'onsite',status:'reschedule',req_by:'murid',
     resched_date:'2026-09-19',resched_time:'16:30',resched_note:'Bentrok acara sekolah, mohon digeser.',topic:'',note:''},
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
    {id:'pr1',tutor_id:'t1',month:'2026-08',amount:2400000,transfer_date:'2026-09-03',proof_url:'',note:'Gaji + bonus Agustus',status:'DIBAYAR',created_at:'2026-09-03T09:00:00'},
    {id:'pr2',tutor_id:'t1',month:'2026-09',amount:2550000,transfer_date:'',proof_url:'',note:'',status:'DIPROSES',created_at:'2026-10-01T09:00:00'},
  ],
  ratings:[
    {id:'rt1',class_id:'c5',student_id:'s1',tutor_id:'t1',stars:5,scores:[5,5,5,4,5,5,5,5],liked:'Cara ngajarnya seru!',improve:'Mungkin lebih banyak latihan soal.',comment:'Penjelasannya jelas banget, makasih Mr. Yesaya!',created_at:'2026-06-30T20:40:00'},
  ],
  tboard:[
    {id:'tb1',title:'Rapat Koordinasi Bulanan',body:'Semua guru wajib hadir rapat koordinasi Sabtu 13 Sep pukul 10.00 via Zoom. Agenda: evaluasi kelas & jadwal baru.',date:'2026-09-08',author:'Owner',created_at:'2026-09-08T08:00:00'},
    {id:'tb2',title:'Template Laporan Baru',body:'Mulai bulan ini gunakan template LDS yang baru ya. Link ada di Teaching Resources.',date:'2026-09-01',author:'Admin',created_at:'2026-09-01T09:00:00'},
  ],
  tboard_read:[
    {id:'tb2_t1',board_id:'tb2',reader_id:'t1',reader_name:'Mr. Yesaya',read_at:'2026-09-02T07:30:00'},
  ],
  announcements:[
    {id:'an1',title:'Libur Nasional',body:'Kwelingo libur tanggal 17 Agustus. Kelas diliburkan.',date:'2026-08-10',class_group:'',author:'Owner',created_at:'2026-08-10T08:00:00'},
    {id:'an2',title:'Ganti Jadwal Minggu Ini',body:'Kelas English A hari Senin digeser ke Selasa jam 19.00 karena guru ada acara.',date:'2026-09-09',class_group:'English A · Sen&Kam 19.00',author:'Admin',created_at:'2026-09-09T10:00:00'},
  ],
  _settings:{TEACHER_SOP_URL:'https://drive.google.com/file/d/1example/preview'},
  diary:[
    {id:'dy1',student_id:'s1',tutor_id:'t1',author:'murid',message:'Pak, saya masih bingung bagian faktorisasi.',created_at:'2026-07-20T10:00:00'},
    {id:'dy2',student_id:'s1',tutor_id:'t1',author:'guru',message:'Tenang Anton, besok kita ulang pelan-pelan ya. Coba kerjakan WS hal. 12 dulu.',created_at:'2026-07-20T12:30:00'},
  ],
  tasks:[
    {id:'tk1',student_id:'s1',tutor_id:'t1',title:'Worksheet Algebra hal. 33–36',detail:'Kerjakan nomor ganjil, foto & upload hasilnya.',type:'assignment',due_date:'2026-07-30',status:'assigned',done_at:''},
    {id:'tk2',student_id:'s1',tutor_id:'t1',title:'Write a short travel review',detail:'Tulis review tempat wisata impianmu (min. 100 kata).',type:'writing',due_date:'2026-07-22',status:'graded',submit_text:'My dream destination is Japan...',submit_url:'https://drive.google.com/file/d/xxx',submit_at:'2026-07-21',points:'90',feedback:'Bagus! Perhatikan past tense ya.',graded_at:'2026-07-22'},
    {id:'tk3',student_id:'s1',tutor_id:'t1',title:'Final Project: Presentasi',detail:'Upload file presentasi akhir.',type:'final_project',due_date:'2026-08-05',status:'submitted',submit_url:'https://drive.google.com/file/d/yyy',submit_text:'',submit_at:'2026-08-01'},
  ],
  chat:[
    {id:'ch1',room:'kelas:English A · Sen&Kam 19.00',sender_id:'s2',sender_name:'Budi Santoso',role:'murid',message:'Teman-teman, PR yang nomor 5 jawabannya berapa?',created_at:'2026-09-10T09:00:00'},
    {id:'ch2',room:'kelas:English A · Sen&Kam 19.00',sender_id:'s1',sender_name:'Anton Wijaya',role:'murid',message:'Aku dapat 12, kamu?',created_at:'2026-09-10T09:05:00'},
    {id:'ch3',room:'guru',sender_id:'t1',sender_name:'Mr. Yesaya',role:'guru',message:'Selamat pagi, jangan lupa isi laporan kelas hari ini ya.',created_at:'2026-09-11T07:30:00'},
    {id:'ch4',room:'guru',sender_id:'admin',sender_name:'Admin',role:'admin',message:'Noted pak. Jadwal minggu depan sudah saya update.',created_at:'2026-09-11T07:45:00'},
  ],
  handle(p){
    return new Promise((res,rej)=>{
      setTimeout(()=>{ try{ res(this._route(p)); }catch(e){ rej(e); } },120); // tiny delay to feel real
    });
  },
  _route(p){
    const clone=x=>JSON.parse(JSON.stringify(x));
    switch(p.action){
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
        this.classes.push({id,doc_url:'',material_url:'',topic:'',note:'',...p});
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
      case 'savePayment':{ if(p.id){const e=this.payments.find(x=>x.id===p.id); if(e){Object.assign(e,p); return {updated:p.id};}} const id='pay'+Date.now(); this.payments.push({id,...p}); return {id}; }
      case 'deletePayment':{ this.payments=this.payments.filter(x=>x.id!==p.id); return {deleted:p.id}; }
      case 'getPayroll':{ this.payroll=this.payroll||[]; let r=clone(this.payroll); if(p.tutor_id) r=r.filter(x=>x.tutor_id===p.tutor_id); if(p.month) r=r.filter(x=>x.month===p.month); return r.sort((a,b)=>String(b.created_at||b.month).localeCompare(String(a.created_at||a.month))); }
      case 'savePayroll':{ this.payroll=this.payroll||[]; if(p.id){const e=this.payroll.find(x=>x.id===p.id); if(e){Object.assign(e,p); return {updated:p.id};}} const id=p.id||('pr'+Date.now()); this.payroll.push({id,created_at:new Date().toISOString(),...p}); return {id}; }
      case 'deletePayroll':{ this.payroll=(this.payroll||[]).filter(x=>x.id!==p.id); return {deleted:p.id}; }
      case 'uploadFile':{ return {url:p.base64,view:p.base64}; }
      case 'addStudent': { const id='s'+Date.now(); const pin=p.pin||genPin(); this.students.push({id,active:'aktif',pin,...p}); return {id,pin}; }
      case 'studentLogin':{ const key=String(p.login||'').toLowerCase().trim(); const s=this.students.find(x=>x.id===p.login||(x.username||'').toLowerCase().trim()===key||genUsername(x.nama)===key||x.nama.toLowerCase().trim()===key); if(!s)throw new Error('Murid tidak ditemukan'); if(String(s.pin)!==String(p.pin))throw new Error('PIN salah'); return clone(s); }
      case 'addTutor':   { const id='t'+Date.now(); const pin=p.pin||genPin(); this.tutors.push({id,pin,...p}); return {id,pin}; }
      case 'updateTutor':{ const t=this.tutors.find(x=>x.id===p.id); if(t) Object.assign(t,p); return {updated:p.id}; }
      case 'updateStudent':{ const s=this.students.find(x=>x.id===p.id); if(s) Object.assign(s,p); return {updated:p.id}; }
      case 'deleteTutor':{ this.tutors=this.tutors.filter(x=>x.id!==p.id); return {deleted:p.id}; }
      case 'deleteStudent':{ this.students=this.students.filter(x=>x.id!==p.id); return {deleted:p.id}; }
      case 'verifyPin':{ this._pins=this._pins||{master:'5758',admin:'17081945'}; return {ok:String(p.pin)===this._pins[p.role==='master'?'master':'admin']}; }
      case 'changePin':{ this._pins=this._pins||{master:'5758',admin:'17081945'}; const role=p.role==='master'?'master':'admin'; if(String(p.oldPin)!==this._pins[role]) return {ok:false,message:'Password lama salah'}; if(!/^\d{4,10}$/.test(String(p.newPin||''))) return {ok:false,message:'Password baru 4–10 digit angka'}; this._pins[role]=String(p.newPin); return {ok:true}; }
      case 'tutorLogin':{
        const key=String(p.login||'').toLowerCase().trim();
        const t=this.tutors.find(x=>x.id===p.login||(x.username||'').toLowerCase().trim()===key||genUsername(x.nama)===key||x.nama.toLowerCase().trim()===key);
        if(!t) throw new Error('Guru tidak ditemukan');
        if(String(t.pin)!==String(p.pin)) throw new Error('PIN salah');
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
      default: return null;
    }
  },
  tutorName(id){return (this.tutors.find(t=>t.id===id)||{}).nama||'-';},
  studentName(id){return (this.students.find(s=>s.id===id)||{}).nama||'-';},
};

/* Convenience lookups that work in demo & live (names embedded server-side in live) */
async function tutorMap(){const t=await API.getTutors();const m={};t.forEach(x=>m[x.id]=x);return m;}
async function studentMap(){const s=await API.getStudents();const m={};s.forEach(x=>m[x.id]=x);return m;}
