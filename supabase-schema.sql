-- ============================================================
--  KWELINGO — Supabase schema  (project: eaxihqustnbkzzjaanrt)
--  Jalankan SEKALI di Supabase → SQL Editor → New query → Run.
--  Aman dijalankan ulang (pakai "if not exists" / upsert).
--
--  Semua kolom bertipe TEXT supaya tanggal/angka/PIN tidak
--  diubah otomatis — sama persis dengan versi Google Sheets.
-- ============================================================

-- ---------- 1. TABEL ----------------------------------------
create table if not exists public.students (
  id text primary key,
  nama text, username text, school text, address text, dob text, grade text,
  parent_name text, wa_ortu text, tutor_id text, schedule text,
  fee_per_meeting text, fee_tentor text, meeting_minutes text,
  deposit_meetings text, add_fee text, add_fee_note text,
  pin text, active text, link_id text, class_group text,
  created_at timestamptz default now()
);
alter table public.students add column if not exists class_group text;

create table if not exists public.tutors (
  id text primary key,
  nama text, username text, subject text, level text,
  address text, dob text, wa text, pin text,
  created_at timestamptz default now()
);

create table if not exists public.classes (
  id text primary key,
  date text, student_id text, tutor_id text,
  start_time text, end_time text, duration text, type text,
  topic text, note text, material_url text, doc_url text,
  stu_in text, stu_out text, tut_in text, tut_out text, lesson_plan text,
  status text, req_by text, req_note text, attend text,
  resched_date text, resched_time text, resched_note text,
  rec_audio text, rec_video text,
  created_at timestamptz default now()
);
-- Kalau tabel classes sudah terlanjur dibuat tanpa kolom di atas, baris ini menambahkannya:
alter table public.classes
  add column if not exists status text,
  add column if not exists req_by text,
  add column if not exists req_note text,
  add column if not exists attend text,
  add column if not exists resched_date text,
  add column if not exists resched_time text,
  add column if not exists resched_note text,
  add column if not exists rec_audio text,
  add column if not exists rec_video text;

create table if not exists public.deposit (
  student_id text primary key,
  paid_meetings text, minutes_total text, minutes_used text,
  fee_per_meeting text, last_paid text, status text,
  created_at timestamptz default now()
);

create table if not exists public.payments (
  id text primary key,
  student_id text, month text, pay_date text, meetings text,
  price_per_meet text, duration text, deposit_total text, carry_in text,
  extra_minutes text, add_fee1 text, add_fee2 text, add_fee2_note text,
  next_meetings text, next_deposit text, grand_total text, status text, proof_url text,
  created_at timestamptz default now()
);
-- Kalau tabel payments sudah ada tanpa kolom bukti bayar:
alter table public.payments add column if not exists proof_url text;

create table if not exists public.tutor_bonus (
  id text primary key,            -- "<tutor_id>_<month>"
  tutor_id text, month text, amount text, note text,
  created_at timestamptz default now()
);

create table if not exists public.resources (
  id text primary key,
  title text, subject text, level text, file_url text, note text,
  created_at timestamptz default now()
);

create table if not exists public.payroll (
  id text primary key,
  tutor_id text, month text, amount text, transfer_date text,
  proof_url text, note text, status text,
  created_at timestamptz default now()
);

create table if not exists public.announcements (
  id text primary key,
  title text, body text, date text, class_group text, author text,
  created_at timestamptz default now()
);
alter table public.announcements add column if not exists class_group text;
alter table public.announcements add column if not exists author text;

create table if not exists public.quizzes (
  id text primary key,
  title text, subject text, level text, questions text,   -- questions = JSON string
  created_at timestamptz default now()
);

create table if not exists public.quiz_results (
  id text primary key,
  quiz_id text, student_id text, student_name text,
  score text, total text, taken_at text,
  created_at timestamptz default now()
);

create table if not exists public.discussion (
  id text primary key,
  student_id text, name text, message text,
  created_at timestamptz default now()
);

create table if not exists public.ratings (
  id text primary key,
  class_id text, student_id text, tutor_id text, stars text, comment text,
  scores text, liked text, improve text,
  created_at timestamptz default now()
);
alter table public.ratings add column if not exists scores text;
alter table public.ratings add column if not exists liked text;
alter table public.ratings add column if not exists improve text;

create table if not exists public.diary (
  id text primary key,
  student_id text, tutor_id text, author text, message text,
  created_at timestamptz default now()
);

create table if not exists public.tasks (
  id text primary key,
  student_id text, tutor_id text, title text, detail text, type text,
  due_date text, status text, done_at text,
  submit_url text, submit_text text, submit_at text,
  points text, feedback text, graded_at text,
  created_at timestamptz default now()
);
alter table public.tasks add column if not exists type text;
alter table public.tasks add column if not exists submit_url text;
alter table public.tasks add column if not exists submit_text text;
alter table public.tasks add column if not exists submit_at text;
alter table public.tasks add column if not exists points text;
alter table public.tasks add column if not exists feedback text;
alter table public.tasks add column if not exists graded_at text;

-- Teacher Bulletin Board + read receipts
create table if not exists public.tboard (
  id text primary key,
  title text, body text, date text, author text,
  created_at timestamptz default now()
);
create table if not exists public.tboard_read (
  id text primary key,            -- "<board_id>_<reader_id>"
  board_id text, reader_id text, reader_name text, read_at text,
  created_at timestamptz default now()
);

create table if not exists public.chat (
  id text primary key,
  room text, sender_id text, sender_name text, role text, message text,
  created_at timestamptz default now()
);
create index if not exists chat_room_idx on public.chat (room, created_at);

create table if not exists public.app_settings (
  key text primary key,
  value text
);

-- ---------- 1b. REV3 PHASE 2 — new columns & tables ---------
-- Student record expansion
alter table public.students add column if not exists gender text;
alter table public.students add column if not exists student_wa text;
alter table public.students add column if not exists program text;
alter table public.students add column if not exists level text;
alter table public.students add column if not exists class_type text;
alter table public.students add column if not exists class_id text;
alter table public.students add column if not exists start_date text;
alter table public.students add column if not exists learning_mode text;
alter table public.students add column if not exists course_due text;
alter table public.students add column if not exists status text;
-- Teacher record expansion (incl. Local/International)
alter table public.tutors add column if not exists category text;
alter table public.tutors add column if not exists age_group text;
alter table public.tutors add column if not exists employment_type text;
alter table public.tutors add column if not exists joining_date text;
alter table public.tutors add column if not exists teaching_location text;
alter table public.tutors add column if not exists program text;
alter table public.tutors add column if not exists bank_name text;
alter table public.tutors add column if not exists bank_holder text;
alter table public.tutors add column if not exists bank_account text;
alter table public.tutors add column if not exists status text;
alter table public.tutors add column if not exists photo_url text;
-- Parents
create table if not exists public.parents (
  id text primary key,
  parent_id text, nama text, wa text, linked_students text, status text,
  created_at timestamptz default now()
);
-- Class groups (cohorts)
create table if not exists public.class_groups (
  id text primary key,
  class_id text, name text, program text, tutor_id text, student_ids text,
  schedule text, start_date text, total_sessions text, min_cert text, status text,
  created_at timestamptz default now()
);

-- ---------- 1c. REV4 — Teacher's Room ---------------------
-- class sessions
alter table public.classes add column if not exists attend_note text;
alter table public.classes add column if not exists group_id text;
alter table public.classes add column if not exists room text;
alter table public.classes add column if not exists session_type text;
-- teaching resources & SOP files
alter table public.resources add column if not exists program text;
alter table public.resources add column if not exists unit text;
alter table public.resources add column if not exists kind text;
alter table public.resources add column if not exists category text;
alter table public.resources add column if not exists size text;
-- prepayment slip workflow
alter table public.payroll add column if not exists sessions text;
alter table public.payroll add column if not exists generated_at text;
alter table public.payroll add column if not exists confirmed_at text;
alter table public.payroll add column if not exists processing_at text;
alter table public.payroll add column if not exists sent_at text;
-- learning diary (3 prompts + private teacher comment)
alter table public.diary add column if not exists group_id text;
alter table public.diary add column if not exists class_date text;
alter table public.diary add column if not exists learned text;
alter table public.diary add column if not exists struggle text;
alter table public.diary add column if not exists resolve text;
alter table public.diary add column if not exists teacher_comment text;
alter table public.diary add column if not exists comment_at text;
alter table public.diary add column if not exists draft text;
-- extended practice (one batch per class)
alter table public.tasks add column if not exists group_id text;
alter table public.tasks add column if not exists batch_id text;
alter table public.tasks add column if not exists unit text;
alter table public.tasks add column if not exists attach_url text;
alter table public.tasks add column if not exists due_time text;
alter table public.tasks add column if not exists visible text;
-- bulletin board program tag
alter table public.tboard add column if not exists program text;
alter table public.tboard add column if not exists attach_url text;
alter table public.tboard add column if not exists attach_name text;
-- class groups: opening/schedule details
alter table public.class_groups add column if not exists level text;
alter table public.class_groups add column if not exists room text;
alter table public.class_groups add column if not exists mode text;
alter table public.class_groups add column if not exists days text;
alter table public.class_groups add column if not exists start_time text;
alter table public.class_groups add column if not exists end_time text;
alter table public.class_groups add column if not exists end_date text;
alter table public.class_groups add column if not exists admin_notes text;
alter table public.class_groups add column if not exists max_students text;
-- new tables
create table if not exists public.lesson_plans (
  id text primary key,
  tutor_id text, group_id text, date text, unit text, topic text, objectives text,
  reading text, listening text, speaking text, writing text, practice text,
  production text, extended text, status text, admin_note text, submitted_at text,
  created_at timestamptz default now()
);
create table if not exists public.dev_notes (
  id text primary key,
  student_id text, tutor_id text, group_id text, date text, topic text,
  strengths text, improve text, strategy text, encourage text,
  created_at timestamptz default now()
);
create table if not exists public.class_applications (
  id text primary key,
  group_id text, tutor_id text, status text, note text, responded_at text,
  created_at timestamptz default now()
);

-- ---------- 1d. REV5/REV6 — Operations Admin & Student Hub ----
alter table public.classes add column if not exists req_kind text;
alter table public.classes add column if not exists req_status text;
alter table public.classes add column if not exists req_at text;
alter table public.classes add column if not exists admin_note text;
alter table public.classes add column if not exists orig_date text;
alter table public.classes add column if not exists orig_time text;
alter table public.classes add column if not exists fee text;
alter table public.classes add column if not exists req_reason text;
alter table public.announcements add column if not exists audience text;
alter table public.announcements add column if not exists program text;
alter table public.announcements add column if not exists level text;
alter table public.announcements add column if not exists group_id text;
alter table public.announcements add column if not exists status text;
alter table public.announcements add column if not exists publish_at text;
alter table public.announcements add column if not exists attach_url text;
alter table public.announcements add column if not exists attach_name text;
alter table public.quizzes add column if not exists time_limit text;
alter table public.quizzes add column if not exists due_date text;
alter table public.quizzes add column if not exists program text;
alter table public.quizzes add column if not exists group_id text;
alter table public.quizzes add column if not exists unit text;
alter table public.quiz_results add column if not exists answers text;
-- rev9: Teacher Quizzes (wizard) & Projects (rubric grading)
alter table public.quizzes add column if not exists tutor_id text;
alter table public.quizzes add column if not exists status text;
alter table public.quizzes add column if not exists quiz_type text;
alter table public.quizzes add column if not exists description text;
alter table public.quizzes add column if not exists open_date text;
alter table public.quizzes add column if not exists open_time text;
alter table public.quizzes add column if not exists due_time text;
alter table public.quizzes add column if not exists rules text;
alter table public.quizzes add column if not exists passing_score text;
alter table public.quizzes add column if not exists total_points text;
alter table public.quizzes add column if not exists last_used text;
alter table public.tasks add column if not exists project_type text;
alter table public.tasks add column if not exists instructions text;
alter table public.tasks add column if not exists rubric text;
alter table public.tasks add column if not exists scores text;
alter table public.tasks add column if not exists allow_late text;
alter table public.payments add column if not exists invoice_no text;
alter table public.payments add column if not exists issue_date text;
alter table public.payments add column if not exists due_date text;
alter table public.payments add column if not exists program text;
alter table public.payments add column if not exists level text;
alter table public.payments add column if not exists note text;
alter table public.payments add column if not exists reminder_at text;
alter table public.payments add column if not exists paid_at text;
alter table public.payments add column if not exists method text;
alter table public.resources add column if not exists status text;
alter table public.resources add column if not exists updated_at text;
create table if not exists public.programs (
  id text primary key,
  name text, code text, category text, audience text, levels text, duration text,
  sessions text, min_cert text, price text, status text, description text,
  objectives text, curriculum text, color text,
  created_at timestamptz default now()
);
alter table public.students add column if not exists notes text;
alter table public.parents add column if not exists relation text;
alter table public.parents add column if not exists username text;
alter table public.parents add column if not exists pin text;
alter table public.parents add column if not exists email text;
alter table public.students add column if not exists email text;
alter table public.students add column if not exists parent_relation text;
alter table public.tutors add column if not exists gender text;
alter table public.tutors add column if not exists email text;
alter table public.tutors add column if not exists bio text;
alter table public.tutors add column if not exists notes text;
create table if not exists public.teacher_requests (
  id text primary key,
  tutor_id text, kind text, group_id text, class_date text, start_time text,
  new_date text, new_time text, start_date text, end_date text, leave_type text,
  reason text, note text, attach_url text, status text, admin_note text, decided_at text, decided_by text,
  created_at timestamptz default now()
);
create table if not exists public.certificates (
  id text primary key,
  student_id text, group_id text, program text, level text, attendance text,
  cert_no text, mode text, file_url text, status text, issued_at text,
  completion_date text, note text, issued_by text,
  created_at timestamptz default now()
);

-- ---------- 2. PIN DEFAULT (semua 1234) ---------------------
insert into public.app_settings (key, value) values
  ('MASTER_PIN','1234'),
  ('ADMIN_PIN','1234')
on conflict (key) do nothing;  -- jangan reset PIN yang sudah diganti

-- ---------- 3. ROW LEVEL SECURITY ---------------------------
--  PENTING: anon key menempel di app.js (publik). Kebijakan di
--  bawah ini memberi akses baca+tulis penuh via anon key — SAMA
--  TERBUKANYA seperti versi Google Sheets sekarang. Lihat catatan
--  keamanan yang saya kirim di chat untuk opsi memperketat nanti.
-- ---------- TeacherNotes blog --------------------------------
create table if not exists public.blog_posts (
  id text primary key,
  title text, slug text, category text, cover_url text, excerpt text, content text,
  author_id text, author_name text, status text, review_note text,
  submitted_at text, reviewed_at text, published_at text, updated_at text, tags text,
  created_at timestamptz default now()
);
create table if not exists public.blog_writers (
  id text primary key,
  nama text, username text, pin text, email text, bio text, photo_url text, status text,
  created_at timestamptz default now()
);
-- rev10: Community Blog sections (TeacherNotes / Open Pages) + writer type (Teacher / Student / Staff)
alter table public.blog_posts   add column if not exists section text;
alter table public.blog_writers add column if not exists role text;

-- ---------- Safety: pastikan semua tabel punya kolom created_at -------
-- (tabel lama yang dibuat sebelum versi ini kadang belum punya kolom ini,
--  sehingga data tersimpan tapi tidak tampil di portal)
do $$
declare t text;
begin
  foreach t in array array[
    'students','tutors','classes','deposit','payments','tutor_bonus',
    'resources','payroll','announcements','quizzes','quiz_results',
    'discussion','ratings','diary','tasks','chat','tboard','tboard_read','app_settings',
    'parents','class_groups','lesson_plans','dev_notes','class_applications','certificates','teacher_requests','programs','blog_posts','blog_writers'
  ] loop
    execute format('alter table public.%I add column if not exists created_at timestamptz default now();', t);
  end loop;
end $$;

do $$
declare t text;
begin
  foreach t in array array[
    'students','tutors','classes','deposit','payments','tutor_bonus',
    'resources','payroll','announcements','quizzes','quiz_results',
    'discussion','ratings','diary','tasks','chat','tboard','tboard_read','app_settings',
    'parents','class_groups','lesson_plans','dev_notes','class_applications','certificates','teacher_requests','programs','blog_posts','blog_writers'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists kwe_all on public.%I;', t);
    execute format(
      'create policy kwe_all on public.%I for all to anon, authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- ---------- 4. STORAGE BUCKET 'materials' -------------------
insert into storage.buckets (id, name, public)
values ('materials','materials', true)
on conflict (id) do update set public = true;

drop policy if exists kwe_mat_read   on storage.objects;
drop policy if exists kwe_mat_insert on storage.objects;
drop policy if exists kwe_mat_update on storage.objects;
drop policy if exists kwe_mat_delete on storage.objects;

create policy kwe_mat_read   on storage.objects for select to anon, authenticated using (bucket_id = 'materials');
create policy kwe_mat_insert on storage.objects for insert to anon, authenticated with check (bucket_id = 'materials');
create policy kwe_mat_update on storage.objects for update to anon, authenticated using (bucket_id = 'materials') with check (bucket_id = 'materials');
create policy kwe_mat_delete on storage.objects for delete to anon, authenticated using (bucket_id = 'materials');

-- ---------- selesai -----------------------------------------
-- Cek cepat (hasil yang benar: tabel = 29, kolom_baru = 9):
select 'tabel' as jenis, count(*)::text as jumlah from information_schema.tables
  where table_schema='public'
    and table_name in ('students','tutors','classes','deposit','payments','tutor_bonus',
                       'resources','payroll','announcements','quizzes','quiz_results','discussion',
                       'ratings','diary','tasks','chat','tboard','tboard_read','app_settings',
                       'parents','class_groups','lesson_plans','dev_notes','class_applications',
                       'certificates','teacher_requests','programs','blog_posts','blog_writers')
union all
select 'kolom_baru', count(*)::text from information_schema.columns
  where table_schema='public' and (
        (table_name='quizzes'  and column_name in ('tutor_id','rules','passing_score'))
     or (table_name='tasks'    and column_name in ('rubric','scores'))
     or (table_name='parents'  and column_name in ('username','pin'))
     or (table_name='blog_posts'   and column_name = 'section')
     or (table_name='blog_writers' and column_name = 'role'));
