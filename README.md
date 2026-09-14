# KWE Lingo — Website

Upload **seluruh isi folder ini** ke GitHub (root repo).

## Struktur
```
index.html          Landing page
portal.html         Pemilih portal (Login)
admin.html          Portal Admin
teacher.html        Portal Tentor
master-admin.html   Portal Master Admin (owner)
parent.html         Portal Orang Tua
assets/
  style.css
  app.js            (URL backend Apps Script /exec ada di baris atas)
  logo.png
  logo-full.png
```

## Backend
- Database: **Google Sheets** ("WEBSITE") via **Google Apps Script**.
- File `Code.gs` **tidak** ditaruh di sini — paste ke project Apps Script Sheet tersebut, lalu Deploy sebagai Web App (Execute as: Me, Access: Anyone).
- Kalau URL `/exec` berubah, update `SCRIPT_URL` di `assets/app.js` (baris paling atas).

## Login
- PIN default Master Admin & Admin: **1234** (ganti lewat menu Ganti Password).
- Tentor & Orang Tua: username + PIN dari Master Admin.

## Catatan
- File SOP (`assets/sop-state-of-declaration.pdf`, `assets/sop-media-content.pdf`) di landing page bersifat opsional — taruh kalau sudah ada.
