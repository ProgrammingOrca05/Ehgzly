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
      const dateStr = it.date ? (new Date(it.date)).toLocaleString('ar-EG',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) : '';
      const docName = (it.doctor && (it.doctor.name||it.doctor.fullName)) ? (it.doctor.name||it.doctor.fullName) : (it.doctor && it.doctor.nameEn ? it.doctor.nameEn : 'دكتور');
      const patName = (it.patient && (it.patient.name||it.patient.fullName)) ? (it.patient.name||it.patient.fullName) : (it.patient && it.patient.nameEn ? it.patient.nameEn : 'مريض');
      const status = (it.status || '').toString().toLowerCase();
      const statusClass = status === 'scheduled' ? 'scheduled' : (status === 'completed' ? 'completed' : (status === 'cancelled' ? 'cancelled' : ''));
      const aid = it._id || it.id || '';
      const isClickable = status === 'scheduled';
      const cardHtml = `
        <div class="appt-card ${statusClass}">
          <div class="appt-date">${dateStr}</div>
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

  // bootstrap
  (async function(){
    root.innerHTML = `<div class="panel" style="padding:12px;background:#fff;border-radius:8px;border:1px solid #eee">جارٍ جلب المواعيد…</div>`;
    const token = getToken();
    if(!token){ showAuthPrompt('رجاء تسجيل الدخول لعرض الحجوزات'); return; }
    try{
      const res = await tryFetch('/appointment', token);
      if(!res.ok){ if(res.status===401||res.status===403){ showAuthPrompt('رجاء تسجيل الدخول لعرض الحجوزات'); } else { root.innerHTML = `<div class="panel" style="padding:12px;background:#fff;border-radius:8px;border:1px solid #eee">خطأ في جلب المواعيد: ${res.status || ''}</div>`; } return; }
      renderList(res.data || []);
    }catch(err){ root.innerHTML = `<div class="panel" style="padding:12px;background:#fff;border-radius:8px;border:1px solid #eee">خطأ في الاتصال: ${err.message}</div>`; }
  })();

})();
