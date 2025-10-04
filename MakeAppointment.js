// MakeAppointment.js
(function(){
  const API_BASE_URL = window.API_BASE_URL || 'https://ehgzly-production.up.railway.app/api';
  const qs = s => document.querySelector(s);

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

  function mask(t){ if(!t) return ''; return t.length>16 ? t.slice(0,8)+'...'+t.slice(-6) : t; }
  function showMsg(msg, isError){ const el = qs('#form-msg'); if(!el) return; el.style.display = msg ? 'block' : 'none'; el.textContent = msg || ''; el.style.color = isError ? '#c00' : '#070'; }
  function showDiag(txt){ const el = qs('#form-diagnostics'); if(!el) return; el.style.display = txt ? 'block' : 'none'; el.innerText = txt || ''; }

  // read doctor id from URL
  function getDoctorId(){ const params = new URLSearchParams(window.location.search); return params.get('id') || localStorage.getItem('selectedDoctorId') || null; }

  async function fetchDoctor(doctorId){
    if(!doctorId) return null;
    try{
      const res = await fetch((window.API_BASE_URL||API_BASE_URL) + '/doctors/' + encodeURIComponent(doctorId));
      if(!res.ok) return null;
      const j = await res.json(); return j && j.data ? j.data : null;
    }catch(e){ return null; }
  }

  function validateTime(t){ return /^([01]\d|2[0-3]):([0-5]\d)$/.test(t); }

  document.addEventListener('DOMContentLoaded', async ()=>{
    const docId = getDoctorId();
    const summaryEl = qs('#doctor-summary');
    if(!docId){ summaryEl.innerHTML = '<div style="color:#c00">لم يتم تحديد معرّف الطبيب في الرابط.</div>'; }
    else{
      // try to show doctor's name/fee
      const d = await fetchDoctor(docId);
      if(d){ summaryEl.innerHTML = `<strong>الطبيب:</strong> ${d.name||d.fullName||d.nameEn||'---'} &nbsp; <span style="color:#666">رسوم الكشف: ${d.examinationPrice||''} ج.م</span>`; }
      else{ summaryEl.innerHTML = `<strong>الطبيب:</strong> (بيانات غير متاحة)`; }
    }

    // cancel button
    qs('#cancel-btn').addEventListener('click', ()=>{ history.back(); });

    // handle submit
    qs('#appt-form').addEventListener('submit', async (ev)=>{
      ev.preventDefault(); showMsg(''); showDiag('');
      const token = getToken(); if(!token){ showMsg('لم يتم العثور على جلسة صالحة. الرجاء تسجيل الدخول كمريض.', true); showDiag('token: missing'); return; }

      const date = qs('#fld-date').value;
      const time = qs('#fld-time').value;
      const notes = qs('#fld-notes').value.trim();
      const phone = qs('#fld-phone').value.trim();

      if(!date){ showMsg('الرجاء اختيار التاريخ.', true); return; }
      if(!time || !validateTime(time)){ showMsg('الرجاء إدخال وقت صالح بصيغة HH:MM.', true); return; }
      if(!phone){ showMsg('الرجاء إدخال رقم هاتف للتواصل.', true); return; }

      const payload = { doctorId: docId, date, time, notes, phone };
      try{
        showMsg('جارٍ إرسال الطلب...');
        console.log('POST', API_BASE_URL + '/appointment', payload);
        const res = await fetch(API_BASE_URL + '/appointment', {
          method: 'POST',
          headers: { 'Content-Type':'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify(payload)
        });
        const txt = await res.text();
        let json = null; try{ json = txt ? JSON.parse(txt) : null }catch(e){}
        if(!res.ok){ showMsg('فشل الحجز: ' + (json && json.message ? json.message : (res.status+' '+res.statusText)), true); showDiag('response: '+txt); return; }
        showMsg('تم حجز الموعد بنجاح.', false);
        // optional: redirect to appointments page
        setTimeout(()=>{ window.location.href = 'appointments.html'; }, 1200);
      }catch(err){ showMsg('خطأ في الاتصال: '+err.message, true); showDiag(err.stack || err.message); }
    });
  });

})();
