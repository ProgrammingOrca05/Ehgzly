// appointmentDetails.js
(function(){
  const API_BASE_URL = window.API_BASE_URL || 'https://ehgzly-production.up.railway.app/api';
  const root = document.getElementById('details-root');
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

  function getIdFromUrl(){ const p = new URLSearchParams(window.location.search); return p.get('id'); }

  async function fetchAppointment(id, token){
    const res = await fetch(API_BASE_URL + '/appointment/' + encodeURIComponent(id), { method:'GET', headers: { 'Content-Type':'application/json', 'Authorization':'Bearer '+token } });
    if(!res.ok) { const text = await res.text(); throw new Error(text || (res.status+' '+res.statusText)); }
    const j = await res.json(); return j && j.data ? j.data : j;
  }

  function render(appt){
    const dateStr = appt.date ? (new Date(appt.date)).toLocaleString('ar-EG',{year:'numeric',month:'long',day:'numeric'}) : '';
    const time = appt.time || '';
    const status = appt.status || '';
    const notes = appt.notes || '';
    const phone = appt.phone || '';
    const doc = appt.doctor || {};
    const pat = appt.patient || {};

    // determine user role to show appropriate actions
    const userType = sessionStorage.getItem('ehgzly_user_type') || null;
    const isDoctor = userType === 'doctor';
    const isPatient = userType === 'patient';

    root.innerHTML = `
      <div class="detail-grid">
        <div class="detail-left">
          <h2>تفاصيل الحجز</h2>
          <div class="detail-row"><strong>التاريخ:</strong> ${dateStr}</div>
          <div class="detail-row"><strong>الوقت:</strong> ${time}</div>
          <div class="detail-row"><strong>الحالة:</strong> ${status}</div>
          <div class="detail-row"><strong>ملاحظات:</strong><div class="meta">${notes || '—'}</div></div>
          <div class="detail-row"><strong>هاتف المريض:</strong> ${phone || '—'}</div>
          <div class="detail-row" id="action-row" style="margin-top:12px">
            ${status.toLowerCase() === 'scheduled' ? `
              ${isDoctor ? '<button id="complete-btn" class="btn" style="background: #34c759">تأكيد التنفيذ</button>' : ''}
              ${ (isDoctor || isPatient) ? '<button id="cancel-btn" class="btn btn-danger" style="margin-left:8px">إلغاء الموعد</button>' : ''}
            ` : ''}
          </div>
        </div>
        <aside>
          <div class="panel">
            <h3>معلومات الطبيب</h3>
            <p><strong>الاسم:</strong> ${doc.name||doc.fullName||'—'}</p>
            <p><strong>التخصص:</strong> ${doc.specialization||'—'}</p>
            <p><strong>البريد:</strong> ${doc.email||'—'}</p>
            <p><strong>سعر الكشف:</strong> ${doc.examinationPrice||'—'}</p>
          </div>
          <div class="panel">
            <h3>معلومات المريض</h3>
            <p><strong>الاسم:</strong> ${pat.name||pat.fullName||'—'}</p>
            <p><strong>البريد:</strong> ${pat.email||'—'}</p>
            <p><strong>الجنس:</strong> ${pat.gender||'—'}</p>
          </div>
        </aside>
      </div>`;

    // attach handlers
    setTimeout(()=>{
      const aid = appt._id || appt.id || null;
      const token = getToken();
      const completeBtn = document.getElementById('complete-btn');
      const cancelBtn = document.getElementById('cancel-btn');
      if(completeBtn){ completeBtn.addEventListener('click', async function(){
        if(!confirm('هل أنت متأكد أنك تريد تعليم هذا الموعد كمكتمل؟')) return;
        try{
          const res = await fetch(API_BASE_URL + '/appointment/' + encodeURIComponent(aid) + '/complete', { method:'PATCH', headers:{ 'Authorization':'Bearer '+token }});
          if(!res.ok){ const t = await res.text(); alert('فشل: '+t); return; }
          alert('تم تأكيد الموعد. سيتم إعادة التوجيه إلى صفحة المواعيد.');
          window.location.href = 'appointments.html';
        }catch(err){ alert('خطأ في الاتصال: '+err.message); }
      }); }
      if(cancelBtn){ cancelBtn.addEventListener('click', async function(){
        if(!confirm('هل أنت متأكد أنك تريد إلغاء هذا الموعد؟')) return;
        try{
          const res = await fetch(API_BASE_URL + '/appointment/' + encodeURIComponent(aid) + '/cancel', { method:'PATCH', headers:{ 'Authorization':'Bearer '+token }});
          if(!res.ok){ const t = await res.text(); alert('فشل: '+t); return; }
          alert('تم إلغاء الموعد. سيتم إعادة التوجيه إلى صفحة المواعيد.');
          window.location.href = 'appointments.html';
        }catch(err){ alert('خطأ في الاتصال: '+err.message); }
      }); }
    }, 10);
  }

  (async function(){
    const id = getIdFromUrl();
    if(!id){ root.innerHTML = '<div class="panel">معرّف الحجز غير موجود في عنوان الرابط.</div>'; return; }
    root.innerHTML = '<div class="panel">جارٍ جلب تفاصيل الحجز…</div>';
    const token = getToken();
    if(!token){ root.innerHTML = `<div class="panel">رجاء تسجيل الدخول لعرض تفاصيل الحجز. <a href="EnterAsPatient.html">تسجيل كمريض</a></div>`; return; }
    try{
      const appt = await fetchAppointment(id, token);
      render(appt);
    }catch(err){ root.innerHTML = `<div class="panel">خطأ: ${err.message}</div>`; }
  })();

})();
