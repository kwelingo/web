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
/* ---- Prepayment Slip — Teaching Session Summary (teacher payment detail, printable) ---- */
function openTeachingSummary(o){
  o=o||{}; const rows=o.rows||[]; const base=location.href.replace(/[^/]*$/,'');
  const fee=rows.reduce((a,r)=>a+(Number(r.amount)||0),0), bonus=Number(o.bonus)||0, total=o.total!=null?Number(o.total):fee+bonus;
  const TB={Regular:['#EEF4FF','#1F6FEB'],Recovery:['#FFF4E5','#E07A00'],Reschedule:['#F3EEFF','#7C5CE6'],Rescheduled:['#F3EEFF','#7C5CE6']};
  const SB={Completed:['#E7F6EE','#1E7E34','✔'],Canceled:['#FDECEC','#D8352A','✕'],Cancelled:['#FDECEC','#D8352A','✕'],Scheduled:['#EEF4FF','#1F6FEB','•'],Rescheduled:['#F3EEFF','#7C5CE6','↻']};
  const pill=(m,t,ic)=>`<span style="display:inline-block;padding:3px 9px;border-radius:99px;background:${m[0]};color:${m[1]};font-weight:700;font-size:10.5px;white-space:nowrap">${ic?ic+' ':''}${esc(t)}</span>`;
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Prepayment Slip — ${esc(o.name||'')} — ${esc(o.period||'')}</title>
<style>@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Plus Jakarta Sans',sans-serif;background:#EEF3FA;color:#13235B;padding:60px 18px 30px}
.pg{width:820px;max-width:100%;margin:0 auto;background:#fff;position:relative;overflow:hidden;padding:44px 46px 30px;box-shadow:0 14px 50px rgba(19,35,91,.14)}
.c1{position:absolute;right:0;top:0;width:0;height:0;border-top:120px solid #22B2DC;border-left:200px solid transparent;opacity:.95}.c2{position:absolute;right:0;top:0;width:0;height:0;border-top:70px solid #F99400;border-left:70px solid transparent}
.c3{position:absolute;left:0;bottom:0;width:0;height:0;border-bottom:90px solid #F99400;border-right:170px solid transparent}.c4{position:absolute;right:0;bottom:0;width:0;height:0;border-bottom:130px solid #22B2DC;border-left:150px solid transparent}
.top{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;position:relative;z-index:2}.logo{height:56px}
.ttl{text-align:right;margin-top:64px}.ttl h1{font-size:28px;letter-spacing:1px;font-weight:800;color:#13235B}.ttl small{display:block;font-size:11px;letter-spacing:3px;color:#22B2DC;font-weight:800;margin-top:2px}
.no{display:inline-block;margin-top:8px;background:#F99400;color:#fff;font-weight:800;font-size:11.5px;padding:5px 14px;border-radius:99px}
.info{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:26px 0 20px;position:relative;z-index:2}.info .r{border-left:1.5px solid #E2E8F2;padding-left:22px}
.nm{font-size:22px;font-weight:800}.mut{color:#6B7A99;font-size:12px}.kv{display:flex;gap:10px;align-items:flex-start;margin-bottom:9px}.kv i{font-style:normal;width:22px;color:#1F6FEB}.kv b{display:block;font-size:13.5px}
table{width:100%;border-collapse:separate;border-spacing:0;font-size:11.5px;position:relative;z-index:2;border:1px solid #E2E8F2;border-radius:12px;overflow:hidden}
th{background:#E8F4FB;text-align:left;padding:10px 9px;font-size:11px;color:#13235B}td{padding:9px;border-top:1px solid #EEF2F8}td.a,th.a{text-align:right;font-weight:700}
.tot{display:flex;justify-content:space-between;align-items:center;margin-top:14px;gap:14px;position:relative;z-index:2}.tbox{background:linear-gradient(90deg,#1F9BD7,#22B2DC);color:#fff;border-radius:12px;padding:12px 20px;display:flex;gap:40px;align-items:center;min-width:330px;justify-content:space-between}.tbox b{font-size:22px}
.sub{font-size:12.5px;display:flex;justify-content:space-between;min-width:330px;padding:3px 4px}
.foot2{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:22px;position:relative;z-index:2}.foot2 .r{border-left:1.5px solid #E2E8F2;padding-left:22px}.foot2 h4{font-size:13.5px;margin-bottom:10px}.foot2 ul{padding-left:16px;font-size:11.5px;color:#4A5675;line-height:1.7}
.thx{background:#EEF7FC;border-radius:12px;padding:12px 16px;margin-top:20px;font-size:12px;color:#33507A;position:relative;z-index:2}.thx b{color:#13235B}
.ft{display:flex;gap:26px;justify-content:flex-start;font-size:11px;color:#4A5675;margin-top:18px;border-top:1px solid #E2E8F2;padding-top:12px;position:relative;z-index:2}
.pbar{position:fixed;top:0;left:0;right:0;background:#1F6FEB;color:#fff;padding:10px;text-align:center;font-size:13px;z-index:99}.pbar button{background:#fff;color:#1F6FEB;border:none;padding:7px 18px;border-radius:8px;font-weight:700;cursor:pointer;margin-left:10px}
@media print{.pbar{display:none}body{background:#fff;padding:0}.pg{box-shadow:none;width:100%}@page{size:A4;margin:0}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body>
<div class="pbar">💾 Save as PDF: click the button → choose <b>Save as PDF</b> <button onclick="window.print()">⬇️ Download / Print</button></div>
<div class="pg"><div class="c1"></div><div class="c2"></div><div class="c3"></div><div class="c4"></div>
<div class="top"><img class="logo" src="${base}assets/logo-h.png" onerror="this.src='${base}assets/logo.png'" alt="Kwelingo Academy"><div class="ttl"><h1>PREPAYMENT SLIP</h1><small>TEACHING SESSION SUMMARY</small><span class="no">${esc(o.slipNo||'')}</span></div></div>
<div class="info"><div><div class="nm">${esc(o.name||'Teacher')}</div><div class="mut" style="margin-top:6px">👤 Teacher${o.programs?' · '+esc(o.programs):''}</div>${o.status?`<div class="mut" style="margin-top:6px">Status: <b style="color:#13235B">${esc(o.status)}</b></div>`:''}</div>
  <div class="r"><div class="kv"><i>📅</i><div><span class="mut">Payment Period</span><b>${esc(o.range||'')}</b></div></div><div class="kv"><i>📄</i><div><span class="mut">Period</span><b>${esc(o.period||'')}</b></div></div>${o.paidOn?`<div class="kv"><i>✅</i><div><span class="mut">Paid On</span><b>${esc(o.paidOn)}</b></div></div>`:''}</div></div>
<table><thead><tr><th>No.</th><th>Date</th><th>Class</th><th>Class Type</th><th>Status</th><th class="a">Amount</th></tr></thead><tbody>
${rows.map((r,i)=>`<tr><td>${i+1}</td><td style="white-space:nowrap">${esc(r.date)}</td><td>${esc(r.cls)}</td><td>${pill(TB[r.type]||TB.Regular,r.type==='Rescheduled'?'Reschedule':r.type||'Regular')}</td><td>${pill(SB[r.status]||SB.Scheduled,r.status,(SB[r.status]||SB.Scheduled)[2])}</td><td class="a">${fmtRp(r.amount)}</td></tr>`).join('')||'<tr><td colspan="6" style="text-align:center;color:#7A88A6;padding:18px">No sessions in this period.</td></tr>'}
</tbody></table>
<div class="tot"><div style="font-size:13px">Total Sessions: <b>${rows.length}</b>${rows.some(r=>/cancel/i.test(r.status))?` <span class="mut">(${rows.filter(r=>!/cancel/i.test(r.status)).length} paid)</span>`:''}</div>
  <div>${bonus?`<div class="sub"><span>Teaching Fee</span><b>${fmtRp(fee)}</b></div><div class="sub"><span>Commission / Bonus${o.bonusNote?' ('+esc(o.bonusNote)+')':''}</span><b>${fmtRp(bonus)}</b></div>`:''}<div class="tbox"><span>Total Amount</span><b>${fmtRp(total)}</b></div></div></div>
<div class="foot2"><div><h4>🏦 Teacher Bank Account</h4><div class="kv"><i>🏛️</i><div><span class="mut">Bank</span><b>${esc((o.bank||{}).bank||'-')}</b></div></div><div class="kv"><i>💳</i><div><span class="mut">Account Number</span><b>${esc((o.bank||{}).account||'-')}</b></div></div><div class="kv"><i>👤</i><div><span class="mut">Beneficiary</span><b>${esc((o.bank||{}).holder||o.name||'-')}</b></div></div></div>
  <div class="r"><h4>📝 Payment Notes</h4><ul><li>This payment covers the teaching sessions shown in the table above.</li><li>Only completed sessions are included in the total amount.</li><li>Payment is transferred to the bank account listed on the left.</li><li>Kindly confirm once the transfer is received.</li></ul></div></div>
<div class="thx">ℹ️ <b>Thank you for being part of the Kwelingo Academy family!</b><br>Your dedication helps our students grow and achieve their language goals.</div>
<div class="ft"><span>🌐 www.kwelingo.com</span><span>📷 @kwelingo</span><span>📍 Cemara Asri, Medan</span></div></div></body></html>`;
  const w=window.open('','_blank'); if(!w){ toast('Please allow pop-ups to open the slip','err'); return; } w.document.write(html); w.document.close();
}
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
  o=o||{}; const rows=o.rows||[];
  const logo=location.href.replace(/[^/]*$/,'')+'assets/logo-h.png';
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Monthly Learning Report — ${esc(o.student||'')} — ${esc(monthLabel(o.month))}</title>
<style>
 @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
 *{box-sizing:border-box;margin:0;padding:0} body{font-family:'Plus Jakarta Sans',sans-serif;color:#1E2A4A;background:#F4F7FC;padding:24px}
 .page{max-width:900px;margin:auto;background:#fff;border-radius:18px;padding:28px 30px;box-shadow:0 10px 40px rgba(19,35,91,.10)}
 .hd{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:20px}
 .hd img{height:58px} .ttl{background:#EEF4FF;border-radius:16px;padding:16px 26px;text-align:right}
 .ttl h1{font-size:26px;color:#13235B;font-weight:800;line-height:1.1} .ttl h2{font-size:20px;color:#13235B;font-weight:800}
 .info{background:#F5F8FD;border-radius:14px;padding:14px 18px;display:grid;grid-template-columns:110px 1fr;gap:6px 12px;font-size:13.5px;margin-bottom:18px;max-width:440px}
 .info .k{color:#6B7A99}.info .v{font-weight:800;color:#13235B}
 table{width:100%;border-collapse:separate;border-spacing:0;font-size:12.5px;border:1px solid #E6ECF5;border-radius:14px;overflow:hidden}
 th{padding:12px 10px;text-align:left;font-size:12px;color:#13235B} td{padding:12px 10px;vertical-align:top;border-top:1px solid #E6ECF5;line-height:1.45}
 th.d,td.d{width:84px;text-align:center} th.t{background:#EEF4FF} th.s{background:#E7F6EE} th.i{background:#FDECEC} th.g{background:#FFF5E2} th.d{background:#EEF4FF}
 td.d b{display:block;font-size:16px;color:#13235B} td.d small{color:#6B7A99}
 .empty{padding:30px;text-align:center;color:#6B7A99}
 .bar{max-width:900px;margin:0 auto 14px;text-align:right} .bar button{background:#1F6FEB;color:#fff;border:none;border-radius:10px;padding:10px 18px;font-weight:700;cursor:pointer;font-family:inherit}
 @media print{body{background:#fff;padding:0}.page{box-shadow:none;border-radius:0}.bar{display:none}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="bar"><button onclick="window.print()">⬇️ Download / Save as PDF</button></div>
<div class="page">
 <div class="hd"><img src="${logo}" alt="Kwelingo Academy"><div class="ttl"><h1>Monthly Learning Report</h1><h2>${esc(monthLabel(o.month))}</h2></div></div>
 <div class="info"><span class="k">Student Name</span><span class="v">${esc(o.student||'-')}</span><span class="k">Program</span><span class="v">${esc(o.program||'-')}</span><span class="k">Level</span><span class="v">${esc(o.level||'-')}</span><span class="k">Teacher</span><span class="v">${esc(o.teacher||'-')}</span></div>
 <table><thead><tr><th class="d"># Date</th><th class="t">Topic</th><th class="s">⭐ Strengths<br><small>(Teacher's Comment)</small></th><th class="i">🎯 Areas to Improve<br><small>(Teacher's Comment)</small></th><th class="g">💡 Improvement Strategies<br><small>(Teacher's Comment)</small></th></tr></thead>
 <tbody>${rows.length?rows.map((r,i)=>`<tr><td class="d"><b>${i+1}</b><small>${esc(shortDate(r.date))}</small></td><td>${esc(r.topic||'-')}</td><td>${esc(r.strengths||'-')}</td><td>${esc(r.improve||'-')}</td><td>${esc(r.strategy||'-')}</td></tr>`).join(''):'<tr><td colspan="5" class="empty">No development notes for this month yet.</td></tr>'}</tbody></table>
</div></body></html>`;
  const w=window.open('','_blank'); if(!w){ toast('Please allow pop-ups to open the report','err'); return; }
  w.document.open(); w.document.write(html); w.document.close();
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

/* Printable student invoice (rev7) */
function openInvoice(o){
  o=o||{}; const logo=location.href.replace(/[^/]*$/,'')+'assets/logo-h.png';
  const paid=isPaid(o.status);
  const rows=(o.items||[]).map(it=>`<tr><td>${esc(it.d)}</td><td style="text-align:center">${esc(it.q||'')}</td><td style="text-align:right">${it.p!=null?rupiah(it.p):''}</td><td style="text-align:right"><b>${rupiah(it.t)}</b></td></tr>`).join('');
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${esc(o.no||'Invoice')} — ${esc(o.student||'')}</title><style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0} body{font-family:'Plus Jakarta Sans',sans-serif;color:#1E2A4A;background:#EEF3FA;padding:60px 20px 20px}
  .pg{max-width:800px;margin:0 auto;background:#fff;border-radius:14px;padding:40px 44px;box-shadow:0 10px 40px rgba(19,35,91,.12)}
  .hd{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #E6ECF5;padding-bottom:20px;margin-bottom:22px}
  .hd img{height:54px} h1{font-size:30px;color:#13235B;text-align:right} .no{color:#6B7A99;text-align:right;font-size:13px}
  .st{display:inline-block;margin-top:8px;padding:4px 12px;border-radius:99px;font-size:12px;font-weight:800;background:${paid?'#E7F6EC':'#FFF4DE'};color:${paid?'#1E7E34':'#B26A00'}}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:22px;font-size:13px} .grid b{display:block;color:#13235B;font-size:14px;margin-bottom:4px} .lbl{color:#6B7A99;font-size:11px;font-weight:700;letter-spacing:1px;margin-bottom:6px}
  table{width:100%;border-collapse:collapse;font-size:13px} th{background:#F1F6FF;color:#13235B;text-align:left;padding:10px 12px;font-size:12px} td{padding:11px 12px;border-bottom:1px solid #E6ECF5}
  .tot{display:flex;justify-content:flex-end;margin-top:16px}.tot div{background:#1F6FEB;color:#fff;border-radius:12px;padding:14px 22px;font-size:14px}.tot b{font-size:22px;display:block}
  .pay{margin-top:24px;background:#F5F8FD;border-radius:12px;padding:16px 18px;font-size:13px;line-height:1.7}
  .pbar{position:fixed;top:0;left:0;right:0;background:#1F6FEB;color:#fff;padding:10px;text-align:center;font-size:13px}
  .pbar button{background:#fff;color:#1F6FEB;border:none;padding:7px 18px;border-radius:8px;font-weight:700;cursor:pointer;margin-left:10px}
  @media print{.pbar{display:none}body{background:#fff;padding:0}.pg{box-shadow:none}}
  </style></head><body><div class="pbar">💾 Save as PDF: <button onclick="window.print()">⬇️ Download / Print</button></div>
  <div class="pg"><div class="hd"><img src="${logo}" alt="Kwelingo Academy"><div><h1>INVOICE</h1><div class="no">${esc(o.no||'')}</div><div style="text-align:right"><span class="st">${paid?'PAID':'UNPAID'}</span></div></div></div>
  <div class="grid"><div><div class="lbl">BILL TO</div><b>${esc(o.parent||'Parent / Guardian')}</b>Student: ${esc(o.student||'')}<br>Program: ${esc(o.program||'-')}${o.level?' – '+esc(o.level):''}</div>
    <div style="text-align:right"><div class="lbl">DETAILS</div>Invoice date: <b style="display:inline">${esc(o.issue||'-')}</b><br>Due date: <b style="display:inline">${esc(o.due||'-')}</b><br>Period: ${esc(o.period||'-')}${paid&&o.paidOn?`<br>Paid on: ${esc(o.paidOn)}`:''}</div></div>
  <table><thead><tr><th>Description</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Amount</th></tr></thead><tbody>${rows}</tbody></table>
  <div class="tot"><div>Total Amount<b>${rupiah(o.total)}</b></div></div>
  <div class="pay"><b>Payment</b><br>${o.bank?esc(o.bank):'Please transfer to the Kwelingo Academy account shown in your Parent Hub'}<br>Please upload the transfer proof in the Parent Hub after paying. Thank you! 🙏</div>
  ${o.note?`<div style="margin-top:14px;font-size:12.5px;color:#6B7A99">Note: ${esc(o.note)}</div>`:''}</div></body></html>`;
  const w=window.open('','_blank'); if(!w){ toast('Please allow pop-ups to open the invoice','err'); return; } w.document.write(html); w.document.close();
}
