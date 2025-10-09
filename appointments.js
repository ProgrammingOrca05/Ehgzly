// appointments.js - minimal script requested for appointments page
(function(){
  const toggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  if(!toggle || !navList) return;
  toggle.addEventListener('click', ()=>navList.classList.toggle('active'));
  navList.addEventListener('click', (e)=>{ if(e.target.matches('.nav-link')) navList.classList.remove('active'); });
  document.addEventListener('click', (e)=>{ if(window.innerWidth<=768 && !e.target.closest('.main-nav') && navList.classList.contains('active')) navList.classList.remove('active'); });
})();

// render greeting and signout in the hero card (for appointments page)
(function(){
  try{
    const area = document.querySelector('.user-greeting');
    if(!area) return;
    const raw = sessionStorage.getItem('ehgzly_user');
    const type = sessionStorage.getItem('ehgzly_user_type');
    if(!raw) return;
    const user = JSON.parse(raw);
    const name = user && user.name ? user.name : '';
    const title = (type === 'doctor') ? `مرحبا دكتور ${name}` : `مرحبا سيد ${name}`;
    area.innerHTML = `<div><span class="greet-text">${title}</span><br/><a href="#" class="signout-btn" id="signout-btn">تسجيل خروج</a></div>`;
  document.getElementById('signout-btn').addEventListener('click', function(e){ e.preventDefault(); if(typeof performLogout === 'function'){ performLogout(); } else { localStorage.clear(); sessionStorage.clear(); document.cookie.split(";").forEach(c => document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")); window.location.reload(); } });
  }catch(e){/* ignore */}
})();

// --- Appointments fetching and rendering (patient view) ---
(function(){
  const API_BASE_URL = window.API_BASE_URL || 'https://ehgzly-production.up.railway.app/api';
  const root = document.getElementById('appointments-root');
  if(!root) return;

  function readCookie(name){ const m = document.cookie.match(new RegExp('(?:^|; )'+name+'=([^;]*)')); return m ? decodeURIComponent(m[1]) : null; }
  function getToken(){
    try{
      const cookieToken = readCookie('ehgzly_token') || readCookie('token') || readCookie('jwt');
      const ls = localStorage.getItem('ehgzly_token') || localStorage.getItem('token') || localStorage.getItem('jwt');
      const ss = sessionStorage.getItem('ehgzly_token') || sessionStorage.getItem('token');
      let ssUserToken = null; try{ const raw = sessionStorage.getItem('ehgzly_user'); if(raw){ const u = JSON.parse(raw); ssUserToken = u && (u.token||u.jwt) ? (u.token||u.jwt) : null; } }catch(e){}
      return cookieToken || ls || ss || ssUserToken || null;
    }catch(err){ return null; }
  }

  async function tryFetch(route, token){
    console.log('appointments tryFetch', API_BASE_URL+route, 'token?', !!token);
    const res = await fetch(API_BASE_URL + route, { method: 'GET', headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + token }});
    if(!res.ok) return { ok:false, status: res.status, text: await res.text() };
    try{ const j = await res.json(); const data = j && j.data ? j.data : j; return { ok:true, data }; }catch(e){ return { ok:false, status: res.status, text:'invalid json' }; }
  }

  function showAuthPrompt(msg){ root.innerHTML = `<div class="panel" style="padding:18px;background:#fff7f0;border-radius:8px;border:1px solid #ffd7c6"><h3>مطلوب تسجيل الدخول</h3><p>${msg}</p><p><a href="EnterAsPatient.html">تسجيل كمريض / تسجيل دخول</a></p></div>`; }

  function renderEmpty(){ root.innerHTML = `<div class="panel" style="padding:18px;background:#fff;border-radius:8px;border:1px solid #eee">لا توجد مواعيد.</div>`; }

  function renderList(items){
    if(!items || !items.length) return renderEmpty();
    const html = items.map(it=>{
        // Date-only display (from it.date)
        const dateOnly = it.date ? formatDateOnly(it.date) : '';
    // Prefer explicit it.time from API; parse and format into 12-hour form; fallback to time extracted from it.date if missing
    const timeFromApiRaw = (it.time && String(it.time).trim()) ? String(it.time).trim() : '';
    const timeFromApi = timeFromApiRaw ? formatTimeFromApi(timeFromApiRaw) : '';
    const timeOnly = timeFromApi || (it.date ? formatTimeOnlyFromIso(it.date) : '');
      const docName = (it.doctor && (it.doctor.name||it.doctor.fullName)) ? (it.doctor.name||it.doctor.fullName) : (it.doctor && it.doctor.nameEn ? it.doctor.nameEn : 'دكتور');
      const patName = (it.patient && (it.patient.name||it.patient.fullName)) ? (it.patient.name||it.patient.fullName) : (it.patient && it.patient.nameEn ? it.patient.nameEn : 'مريض');
      const status = (it.status || '').toString().toLowerCase();
      const statusClass = status === 'scheduled' ? 'scheduled' : (status === 'completed' ? 'completed' : (status === 'cancelled' ? 'cancelled' : ''));
      const aid = it._id || it.id || '';
      const isClickable = status === 'scheduled';
      const cardHtml = `
        <div class="appt-card ${statusClass}">
            <div class="appt-date">${dateOnly}</div>
            <div class="appt-time">${timeOnly}</div>
          <div class="appt-meta">دكتور: ${docName}</div>
          <div class="appt-meta">مريض: ${patName}</div>
        </div>`;
      if(isClickable && aid) {
        return `<a class="appt-link" href="appointmentDetails.html?id=${encodeURIComponent(aid)}" style="text-decoration:none;display:block">${cardHtml}</a>`;
      }
      // non-clickable for completed/cancelled
      return cardHtml;
    }).join('');
    root.innerHTML = html;
  }
    function formatDateOnly(dateInput){
      try{
        const d = dateInput ? new Date(dateInput) : null;
        if(!d || Number.isNaN(d.getTime())) return '';
        return d.toLocaleDateString('ar-EG',{year:'numeric',month:'short',day:'numeric'});
      }catch(e){ return ''; }
    }

    function formatTimeOnlyFromIso(dateInput){
      try{
        const d = dateInput ? new Date(dateInput) : null;
        if(!d || Number.isNaN(d.getTime())) return '';
        return d.toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit', hour12: true});
      }catch(e){ return ''; }
    }

    // Parse common API time formats (e.g. "14:30" or "2:30 PM") and return localized 12-hour string
    function formatTimeFromApi(timeStr){
      try{
        if(!timeStr) return '';
        const s = String(timeStr).trim();
        // simple HH:MM (24-hour)
        const m = s.match(/^(\d{1,2}):(\d{2})$/);
        if(m){
          const hh = Number(m[1]); const mm = Number(m[2]);
          const d = new Date(); d.setHours(hh); d.setMinutes(mm); d.setSeconds(0); d.setMilliseconds(0);
          return d.toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit', hour12: true});
        }
        // HH:MM AM/PM
        const m2 = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/);
        if(m2){
          let hh = Number(m2[1]); const mm = Number(m2[2]); const ampm = m2[3].toLowerCase();
          if(ampm === 'pm' && hh < 12) hh += 12;
          if(ampm === 'am' && hh === 12) hh = 0;
          const d = new Date(); d.setHours(hh); d.setMinutes(mm); d.setSeconds(0); d.setMilliseconds(0);
          return d.toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit', hour12: true});
        }
        // try parsing as time-only with Date
        const tryIso = new Date('1970-01-01T' + s);
        if(!Number.isNaN(tryIso.getTime())){
          return tryIso.toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit', hour12: true});
        }
        // otherwise return original string as fallback
        return s;
      }catch(e){ return String(timeStr); }
    }

  // bootstrap
  (async function(){
    root.innerHTML = `<div class="panel" style="padding:12px;background:#fff;border-radius:8px;border:1px solid #eee">جارٍ جلب المواعيد…</div>`;
    const token = getToken();
    if(!token){ showAuthPrompt('رجاء تسجيل الدخول لعرض الحجوزات'); return; }
    try{
      const res = await tryFetch('/appointment', token);
      if(!res.ok){ if(res.status===401||res.status===403){ showAuthPrompt('رجاء تسجيل الدخول لعرض الحجوزات'); } else { root.innerHTML = `<div class="panel" style="padding:12px;background:#fff;border-radius:8px;border:1px solid #eee">خطأ في جلب المواعيد: ${res.status || ''}</div>`; } return; }
      // sort appointments by date (earliest first)
      const items = Array.isArray(res.data) ? res.data.slice() : (res.data && Array.isArray(res.data.items) ? res.data.items.slice() : []);
      items.sort((a,b)=>{
        const da = parseAppointmentDate(a);
        const db = parseAppointmentDate(b);
        if(!da && !db) return 0;
        if(!da) return 1;
        if(!db) return -1;
        // descending: newer (larger) dates first
        return db - da;
      });
      renderList(items||[]);
    }catch(err){ root.innerHTML = `<div class="panel" style="padding:12px;background:#fff;border-radius:8px;border:1px solid #eee">خطأ في الاتصال: ${err.message}</div>`; }
  })();

  // parse an appointment's date into a JS Date (robust to strings, objects, nested fields)
  function parseAppointmentDate(appt){
    if(!appt) return null;
    // common fields: appt.date (ISO string), appt.datetime, appt.time combined with appt.date
    try{
      // If appt.date is a full ISO or timestamp
      if(appt.date){ const d = new Date(appt.date); if(!Number.isNaN(d.getTime())) return d; }
      // try appt.datetime
      if(appt.datetime){ const d = new Date(appt.datetime); if(!Number.isNaN(d.getTime())) return d; }
      // sometimes API returns nested object like { date: { year:..., month:..., day:..., time: 'HH:MM' } }
      if(typeof appt.date === 'object' && appt.date !== null){
        const obj = appt.date;
        const year = obj.year || obj.y || obj.Y;
        const month = obj.month || obj.m;
        const day = obj.day || obj.d;
        const time = obj.time || obj.timeOfDay || '';
        if(year && month && day){
          const mm = Number(month) - 1; const dd = Number(day);
          const hhmm = parseTimeToHhMm(time);
          const d = new Date(year, mm, dd, hhmm.hh, hhmm.mm);
          if(!Number.isNaN(d.getTime())) return d;
        }
      }
      // fallback: try to parse a combination of date + time fields
      if(appt.date && appt.time){ const d = new Date(String(appt.date) + ' ' + String(appt.time)); if(!Number.isNaN(d.getTime())) return d; }
      // last resort: search any string fields for an ISO-like substring
      for(const k of Object.keys(appt)){
        const v = appt[k];
        if(typeof v === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v)){
          const d = new Date(v.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?/)[0]); if(!Number.isNaN(d.getTime())) return d;
        }
      }
    }catch(e){}
    return null;
  }

  function parseTimeToHhMm(timeStr){
    let hh = 0, mm = 0;
    try{
      if(!timeStr) return {hh:0,mm:0};
      const s = String(timeStr).trim();
      const m = s.match(/(\d{1,2}):(\d{2})/);
      if(m){ hh = Number(m[1])||0; mm = Number(m[2])||0; return {hh,mm}; }
      const m2 = s.match(/(\d{1,2})\s*(AM|PM|am|pm)/);
      if(m2){ hh = Number(m2[1])||0; if(/pm/i.test(m2[2]) && hh<12) hh+=12; return {hh,mm}; }
      const m3 = s.match(/(\d{1,2})/);
      if(m3) { hh = Number(m3[1])||0; return {hh,mm}; }
    }catch(e){}
    return {hh:0,mm:0};
  }

})();
