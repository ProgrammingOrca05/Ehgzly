// controlPanel.js - minimal script requested for control panel page
/* controlPanel.js
   - Reads JWT from cookie/localStorage
   - Tries to fetch /doctors/me or /patient/me with Authorization: Bearer <token>
   - Renders a profile view (pfp if available) and basic fields
   - On auth failure shows links to login/signup
*/
(function(){
  const API_BASE_URL = window.API_BASE_URL || 'https://ehgzly-production.up.railway.app/api';

  const qs = s => document.querySelector(s);
  function readCookie(name){ const m = document.cookie.match(new RegExp('(?:^|; )'+name+'=([^;]*)')); return m ? decodeURIComponent(m[1]) : null; }

  // try many common places for the token and log diagnostics
  function getToken(){
    try{
      const cookieToken = readCookie('ehgzly_token') || readCookie('token') || readCookie('jwt');
      const lsEhgz = localStorage.getItem('ehgzly_token');
      const lsToken = localStorage.getItem('token');
      const lsJwt = localStorage.getItem('jwt');
      const ssEhgz = sessionStorage.getItem('ehgzly_token');
      const ssToken = sessionStorage.getItem('token');
      // sometimes login stores token inside ehgzly_user object
      let ssUserToken = null;
      try{ const raw = sessionStorage.getItem('ehgzly_user'); if(raw){ const u = JSON.parse(raw); ssUserToken = u && (u.token || u.jwt) ? (u.token || u.jwt) : null; } }catch(e){}

      console.log('getToken diagnostics:', {
        cookieToken: !!cookieToken,
        lsEhgz: !!lsEhgz,
        lsToken: !!lsToken,
        lsJwt: !!lsJwt,
        ssEhgz: !!ssEhgz,
        ssToken: !!ssToken,
        ssUserToken: !!ssUserToken,
      });

      return cookieToken || lsEhgz || lsToken || lsJwt || ssEhgz || ssToken || ssUserToken || null;
    }catch(err){ console.warn('getToken error', err); return null; }
  }
  function mask(t){ if(!t) return ''; return t.length>16 ? t.slice(0,8)+'...'+t.slice(-6) : t; }

  function escapeHtml(s){ if(s===null||s===undefined) return ''; return String(s).replace(/[&<>\"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }
  function isImageUrl(s){ return !!s && /^(https?:)?\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(s); }
  function initials(n){ if(!n) return '؟'; return n.split(' ').map(p=>p.trim()[0]||'').slice(0,2).join('').toUpperCase(); }

  function authPrompt(msg, debug){
    const root = qs('#control-root'); if(!root) return;
    const tokenPreview = mask(getToken());
  const dbg = debug ? `<details><summary>معلومات التشخيص</summary><pre>cookiePresent(ehgzly_token): ${!!readCookie('ehgzly_token')}\nlocalStorage(ehgzly_token): ${!!(localStorage && localStorage.getItem && localStorage.getItem('ehgzly_token'))}\nlocalStorage(token): ${!!(localStorage && localStorage.getItem && localStorage.getItem('token'))}\nsessionStorage(ehgzly_user): ${!!sessionStorage.getItem('ehgzly_user')}\nmaskedToken: ${tokenPreview}</pre></details>` : '';
    root.innerHTML = `
      <div class="panel auth-prompt">
        <h3>غير مسجل</h3>
        <p>${escapeHtml(msg)}</p>
        <div class="actions">
          <a class="btn" href="EnterAsPatient.html">تسجيل كمريض / تسجيل دخول</a>
          <a class="btn" href="EnterAsDoctor.html">تسجيل كطبيب / تسجيل دخول</a>
        </div>
        ${dbg}
      </div>`;
  }

  function renderProfile(user, type){
    const root = qs('#control-root'); if(!root) return;
    const pfp = user.image || user.photo || user.avatar || null;
    const name = user.name || user.fullName || '';
    const email = user.email || '';
    const left = isImageUrl(pfp) ? `<img src="${escapeHtml(pfp)}" alt="${escapeHtml(name)}">` : (pfp ? `<div class="pfp-fallback">${escapeHtml(pfp)}</div>` : `<div class="pfp-empty">${initials(name)}</div>`);
    const doctorExtra = type === 'doctor' ? `<p><strong>التخصص:</strong> ${escapeHtml(user.specialization||'')}</p><p><strong>ساعات العمل:</strong> ${escapeHtml(user.workHrs||'')}</p><p><strong>عن:</strong> ${escapeHtml(user.about||'')}</p>` : '';
    const patientExtra = type === 'patient' ? `<p><strong>العمر:</strong> ${escapeHtml(user.age||'')}</p><p><strong>الجنس:</strong> ${escapeHtml(user.gender||'')}</p>` : '';
    root.innerHTML = `
      <div class="panel profile-card">
        <div class="profile-grid">
          <div class="profile-pic">${left}</div>
          <div class="profile-info">
            <h2>${escapeHtml(name)}</h2>
            <p><strong>البريد الإلكتروني:</strong> ${escapeHtml(email)}</p>
            ${doctorExtra}
            ${patientExtra}
            <div class="profile-actions" style="margin-top:12px">
              <button class="btn" id="edit-btn">تحديث حسابك</button>
              <button class="btn btn-danger" id="delete-btn">حذف الحساب</button>
            </div>
          </div>
        </div>
      </div>`;

    // attach handlers
    setTimeout(()=>{
      const editBtn = qs('#edit-btn');
      const delBtn = qs('#delete-btn');
      if(editBtn) editBtn.addEventListener('click', ()=> showEditForm(user, type));
      if(delBtn) delBtn.addEventListener('click', ()=> confirmDelete(user, type));
    }, 10);
  }

  // show inline modal form for editing
  function showEditForm(user, type){
    const root = qs('#control-root'); if(!root) return;
    const name = escapeHtml(user.name || '');
    const ssn = escapeHtml(user.ssn || '');
    const email = escapeHtml(user.email || '');
    let formHtml = '';
    if(type === 'doctor'){
      formHtml = `
        <div class="panel">
          <h3>تحديث بيانات الدكتور</h3>
          <div class="edit-form">
            <label>الاسم:<input id="fld-name" value="${name}" /></label>
            <label>الرقم القومي (ssn):<input id="fld-ssn" value="${ssn}" /></label>
            <label>التخصص:<input id="fld-specialization" value="${escapeHtml(user.specialization||'')}" /></label>
            <label>نبذه:<textarea id="fld-about">${escapeHtml(user.about||'')}</textarea></label>
            <label>ساعات العمل:<select id="fld-workHrs"><option value="8am-12pm">8am-12pm</option><option value="12pm-4pm">12pm-4pm</option><option value="4pm-8pm">4pm-8pm</option></select></label>
            <label>سعر الكشف:<input id="fld-price" type="number" value="${escapeHtml(user.examinationPrice||user.examinationPrice===0?user.examinationPrice:'')||200}" /></label>
            <div style="margin-top:10px"><button class="btn" id="save-btn">حفظ</button> <button class="btn btn-ghost" id="cancel-btn">إلغاء</button></div>
            <div id="edit-msg" class="form-error" style="display:none;margin-top:8px"></div>
          </div>
        </div>`;
    }else{
      formHtml = `
        <div class="panel">
          <h3>تحديث بيانات المريض</h3>
          <div class="edit-form">
            <label>الاسم:<input id="fld-name" value="${name}" /></label>
            <label>الرقم القومي (ssn):<input id="fld-ssn" value="${ssn}" /></label>
            <label>العمر:<input id="fld-age" type="number" value="${escapeHtml(user.age||'')}" /></label>
            <label>الجنس:<select id="fld-gender"><option value="male">ذكر</option><option value="female">أنثى</option><option value="other">أخر</option></select></label>
            <div style="margin-top:10px"><button class="btn" id="save-btn">حفظ</button> <button class="btn btn-ghost" id="cancel-btn">إلغاء</button></div>
            <div id="edit-msg" class="form-error" style="display:none;margin-top:8px"></div>
          </div>
        </div>`;
    }
    root.innerHTML = formHtml;
    // set select values
    if(type === 'doctor'){
      const sel = qs('#fld-workHrs'); if(sel) sel.value = user.workHrs || '12pm-4pm';
      const price = qs('#fld-price'); if(price) price.value = user.examinationPrice || '';
    }else{
      const g = qs('#fld-gender'); if(g) g.value = user.gender || '';
    }

    qs('#cancel-btn').addEventListener('click', (e)=>{ e.preventDefault(); renderProfile(user, type); });
    qs('#save-btn').addEventListener('click', async (e)=>{
      e.preventDefault();
      await submitUpdate(user, type);
    });
  }

  async function submitUpdate(user, type){
    const token = getToken(); if(!token){ authPrompt('لم يتم العثور على جلسة صالحة. الرجاء تسجيل الدخول أو التسجيل.', true); return; }
    const root = qs('#control-root'); const msgEl = qs('#edit-msg'); if(msgEl) msgEl.style.display='none';
    let payload = {};
    try{
      payload.name = qs('#fld-name').value.trim();
      payload.ssn = qs('#fld-ssn').value.trim();
      if(type === 'doctor'){
        payload.specialization = qs('#fld-specialization').value.trim();
        payload.about = qs('#fld-about').value.trim();
        payload.workHrs = qs('#fld-workHrs').value;
        payload.examinationPrice = Number(qs('#fld-price').value) || 0;
      }else{
        payload.age = Number(qs('#fld-age').value) || null;
        payload.gender = qs('#fld-gender').value;
      }
    }catch(err){ if(msgEl){ msgEl.textContent = 'خطأ في الحقول.'; msgEl.style.display='block'; } return; }

    const route = (type === 'doctor') ? '/doctors/me' : '/patient/me';
    try{
      const res = await fetch(`${API_BASE_URL}${route}`,{
        method: 'PATCH',
        headers: { 'Content-Type':'application/json', 'Authorization':'Bearer '+ token },
        body: JSON.stringify(payload)
      });
      const txt = await res.text();
      if(!res.ok){ if(msgEl){ msgEl.textContent = `خطأ: ${res.status} ${res.statusText} - ${txt}`; msgEl.style.display='block'; } return; }
      // success -> update sessionStorage and re-render profile
      const json = txt ? JSON.parse(txt) : null;
      const data = json && json.data ? json.data : json || payload;
      sessionStorage.setItem('ehgzly_user', JSON.stringify(data));
      renderProfile(data, type);
    }catch(err){ if(msgEl){ msgEl.textContent = 'خطأ في الاتصال: '+err.message; msgEl.style.display='block'; } }
  }

  async function confirmDelete(user, type){
    const ok = window.confirm('هل أنت متأكد أنك تريد حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.');
    if(!ok) return;
    const token = getToken(); if(!token){ authPrompt('لم يتم العثور على جلسة صالحة. الرجاء تسجيل الدخول أو التسجيل.', true); return; }
    const route = (type === 'doctor') ? '/doctors/me' : '/patient/me';
    try{
      const res = await fetch(`${API_BASE_URL}${route}`,{ method:'DELETE', headers:{ 'Authorization':'Bearer '+token }});
      if(!res.ok){ const txt = await res.text(); alert('حدث خطأ أثناء الحذف: '+res.status+' '+res.statusText+' - '+txt); return; }
      // deleted -> clear session and redirect home
      sessionStorage.removeItem('ehgzly_user'); sessionStorage.removeItem('ehgzly_user_type'); document.cookie = 'ehgzly_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      alert('تم حذف الحساب بنجاح. سيتم إعادة التوجيه إلى الصفحة الرئيسية.');
      window.location.href = 'home.html';
    }catch(err){ alert('خطأ في الاتصال: '+err.message); }
  }

  async function tryFetch(route, token) {
    console.log("➡️ Sending request to:", `${API_BASE_URL}${route}`);
    console.log("➡️ With token:", token);

    const res = await fetch(`${API_BASE_URL}${route}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });

    console.log("⬅️ Response status:", res.status);

    if (!res.ok) {
      return { ok: false, status: res.status, text: await res.text() };
    }
    try {
      const j = await res.json();
      const data = j && j.data ? j.data : j;
      return { ok: true, data };
    } catch (e) {
      return { ok: false, status: res.status, text: 'invalid json' };
    }
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    const root = qs('#control-root'); if(!root) return;
    root.innerHTML = `<div class="panel"><p>جارٍ جلب بيانات الملف الشخصي…</p></div>`;
    const token = getToken();
    if(!token){
      console.log(token,"❌ No token found"); 
      authPrompt('لم يتم العثور على جلسة صالحة. الرجاء تسجيل الدخول أو التسجيل.', true); return; }

    // try doctor
    try{
      const d1 = await tryFetch('/doctors/me', token);
      if(d1.ok){ sessionStorage.setItem('ehgzly_user', JSON.stringify(d1.data)); sessionStorage.setItem('ehgzly_user_type','doctor'); renderProfile(d1.data,'doctor'); return; }
      if(d1.status === 401 || d1.status === 403){ authPrompt('جلسة منتهية أو غير صالحة. الرجاء تسجيل الدخول مرة أخرى.', true); return; }
      // try patient
      const d2 = await tryFetch('/patient/me', token);
      if(d2.ok){ sessionStorage.setItem('ehgzly_user', JSON.stringify(d2.data)); sessionStorage.setItem('ehgzly_user_type','patient'); renderProfile(d2.data,'patient'); return; }
      if(d2.status === 401 || d2.status === 403){ authPrompt('جلسة منتهية أو غير صالحة. الرجاء تسجيل الدخول مرة أخرى.', true); return; }
      // neither succeeded
      authPrompt('تعذر جلب الملف الشخصي. الرجاء المحاولة لاحقًا.', true);
    }catch(err){ root.innerHTML = `<div class="panel"><p>خطأ في الاتصال: ${escapeHtml(err.message)}</p></div>`; }
  });

  // Add event listener for the navbar toggle button
  (function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    if (navToggle && navList) {
      navToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
      });
    }
  })();

})();
