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

  // Parse workHrs string into { min: 'HH:MM', max: 'HH:MM' } in 24-hour time
  function parseWorkHrs(workHrs){
    try{
      if(!workHrs) return null;
  // normalize Arabic AM/PM markers
  let s = String(workHrs).replace(/\u0635/g,'AM').replace(/\u0645/g,'PM'); // ص -> AM, م -> PM
  // replace Arabic direction mark and collapse multiple spaces
  s = s.replace(/\u200f/g,' ').replace(/\s+/g, ' ').trim();
      // common separators '-', '–'
      const parts = s.split(/[-–]/).map(p=>p.trim()).filter(Boolean);
      if(parts.length < 2) return null;
      const p0 = parts[0]; const p1 = parts[1];
      const t0 = to24HourTime(p0);
      const t1 = to24HourTime(p1);
      if(!t0 || !t1) return null;
      return { min: t0, max: t1 };
    }catch(e){ return null; }
  }

  // Convert human time like '9:00 AM' or '9:00' or '9:00 ص' or '17:00' to 'HH:MM' 24-hour
  function to24HourTime(ts){
    try{
      if(!ts) return null;
      let s = String(ts).trim();
      // replace Arabic AM/PM
      s = s.replace(/\u0635/g,'AM').replace(/\u0645/g,'PM');
      // remove extra words
      s = s.replace(/\s+/g,' ').trim();
      // match H[:MM] optionally with AM/PM (handles '8am', '8:30am', '17:00')
      let m = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?$/);
      if(m){
        let hh = Number(m[1]); const mm = m[2] ? String(Number(m[2])).padStart(2,'0') : '00'; const ampm = m[3] ? m[3].toLowerCase() : null;
        if(ampm){ if(ampm === 'pm' && hh < 12) hh += 12; if(ampm === 'am' && hh === 12) hh = 0; }
        return `${String(hh).padStart(2,'0')}:${mm}`;
      }
      // try Date parse (1970-01-01T...) fallback
      const d = new Date('1970-01-01T' + s);
      if(!Number.isNaN(d.getTime())) return d.toTimeString().slice(0,5);
      return null;
    }catch(e){ return null; }
  }

  function formatTimeForDisplay(hhmm){ if(!hhmm) return ''; try{ const [hh,mm] = hhmm.split(':'); const d = new Date(); d.setHours(Number(hh)); d.setMinutes(Number(mm)); return d.toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit', hour12: true}); }catch(e){ return hhmm; } }

  document.addEventListener('DOMContentLoaded', async ()=>{
    const docId = getDoctorId();
    const summaryEl = qs('#doctor-summary');
    if(!docId){
      summaryEl.innerHTML = '<div style="color:#c00">لم يتم تحديد معرّف الطبيب في الرابط.</div>';
      return;
    }
    // fetch doctor once and reuse
    const d = await fetchDoctor(docId);
    if(d){
      summaryEl.innerHTML = `<strong>الطبيب:</strong> ${d.name||d.fullName||d.nameEn||'---'} &nbsp; <span style="color:#666">رسوم الكشف: ${d.examinationPrice||''} ج.م</span>`;
    } else {
      summaryEl.innerHTML = `<strong>الطبيب:</strong> (بيانات غير متاحة)`;
    }

    // Set min date to today to prevent past date selection
    try{
      const dateInput = qs('#fld-date');
      if(dateInput){
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth()+1).padStart(2,'0');
        const dd = String(today.getDate()).padStart(2,'0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
      }
    }catch(e){}

    // If we fetched doctor data, attempt to configure time input limits based on workHrs
    try{
      const timeInput = qs('#fld-time');
      let hrs = d && d.workHrs ? d.workHrs : '12pm-4pm'; // default
      const rng = parseWorkHrs(hrs) || parseWorkHrs('12pm-4pm');
      if(rng && timeInput){
        if(rng.min) timeInput.min = rng.min;
        if(rng.max) timeInput.max = rng.max;
        // clamp current value if present
        if(timeInput.value){
          if(timeInput.value < timeInput.min) timeInput.value = timeInput.min;
          if(timeInput.value > timeInput.max) timeInput.value = timeInput.max;
        }
        if(summaryEl) summaryEl.innerHTML += `<div style="margin-top:6px;color:#666;font-size:13px">ساعات العمل: ${hrs} (متاح من ${formatTimeForDisplay(rng.min)} إلى ${formatTimeForDisplay(rng.max)})</div>`;
      }
    }catch(e){ console.warn('workHrs parse error', e); }

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

      // validate date not in past
      try{
        if(date){
          const selected = new Date(date + 'T00:00:00');
          const today = new Date();
          today.setHours(0,0,0,0);
          if(selected < today){ showMsg('الرجاء اختيار تاريخ مساوي أو بعد تاريخ اليوم.', true); return; }
        }
      }catch(e){}

      // validate time against doctor's work hours (if min/max set on input)
      try{
        const timeInput = qs('#fld-time');
        if(timeInput && timeInput.min && timeInput.max && time){
          if(time < timeInput.min || time > timeInput.max){
            showMsg('الرجاء اختيار وقت داخل ساعات عمل الطبيب.', true); return;
          }
        }
      }catch(e){}

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
