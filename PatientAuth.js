// PatientAuth.js - handles signup/login for patients
(function () {
  const apiBase = window.API_BASE_URL || 'https://ehgzly-production.up.railway.app/api';
  function el(html) { const div = document.createElement('div'); div.innerHTML = html.trim(); return div.firstChild; }

  function setActive(tabId) {
    document.getElementById('tab-login').classList.remove('active');
    document.getElementById('tab-signup').classList.remove('active');
    document.getElementById(tabId).classList.add('active');
  }

  // 🔥 FIXED: Helper function to store token properly
  function storeToken(token) {
    try {
      // 1. Cookie with proper settings (1 hour = 3600 seconds)
      document.cookie = `ehgzly_token=${token}; path=/; max-age=3600; SameSite=Lax`;
      
      // 2. localStorage as backup
      localStorage.setItem('ehgzly_token', token);
      
      // 3. sessionStorage as secondary backup
      sessionStorage.setItem('ehgzly_token', token);
      
      console.log("✅ Token stored successfully in cookie, localStorage, and sessionStorage");
      console.log("🔑 Token preview:", token.substring(0, 20) + "...");
    } catch (err) {
      console.error("❌ Error storing token:", err);
    }
  }

  function renderLogin() {
    setActive('tab-login');
    const area = document.getElementById('auth-area'); area.innerHTML = '';
    const form = el(`
      <form id="login-form" class="auth-form">
        <div class="auth-row"><label for="login-email">الايميل:</label><input id="login-email" type="email" required /></div>
        <div class="auth-row"><label for="login-pass">كلمة المرور:</label><input id="login-pass" type="password" required /></div>
        <div class="form-error" id="login-error" style="display:none"></div>
        <div class="auth-actions">
          <button type="submit" class="btn-primary">دخول</button>
          <button type="button" class="btn-ghost" id="to-signup">انشاء حساب</button>
        </div>
      </form>
    `);
    area.appendChild(form);
    document.getElementById('to-signup').addEventListener('click', renderSignup);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-pass').value;
      const errEl = document.getElementById('login-error'); errEl.style.display = 'none';
      
      try {
        console.log("🔄 Attempting patient login...");
        const res = await fetch(`${apiBase}/patient/login`, {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const json = await res.json();
        console.log("📥 Login response:", { status: res.status, data: json });
        
        if (!res.ok || json.status !== 'success') {
          errEl.textContent = json && json.message ? json.message : 'خطأ أثناء تسجيل الدخول'; 
          errEl.style.display = 'block'; 
          return;
        }
        
        // 🔥 FIXED: Store token properly
        if (json.token) {
          storeToken(json.token);
        } else {
          console.warn("⚠️ No token received from server");
        }
        
        // Store user info in sessionStorage
        if (json.data) { 
          // 🔥 FIXED: Also store token inside user object for backup
          const userData = { ...json.data, token: json.token };
          sessionStorage.setItem('ehgzly_user', JSON.stringify(userData)); 
          sessionStorage.setItem('ehgzly_user_type', 'patient'); 
          console.log("✅ User data stored in sessionStorage");
        }
        
        console.log("🔄 Redirecting to home.html...");
        window.location.href = 'home.html';
      } catch (err) { 
        console.error("❌ Login error:", err);
        errEl.textContent = err.message || 'خطأ بالشبكة'; 
        errEl.style.display = 'block'; 
      }
    });
  }

  function renderSignup() {
    setActive('tab-signup');
    const area = document.getElementById('auth-area'); area.innerHTML = '';
    const form = el(`
      <form id="signup-form" class="auth-form">
        <div class="auth-row"><label for="name">الاسم:</label><input id="name" required /></div>
        <div class="auth-row"><label for="ssn">الرقم القومي (ssn):</label><input id="ssn" required /></div>
        <div class="auth-row"><label for="email">الايميل:</label><input id="email" type="email" required /></div>
        <div class="auth-row"><label for="password">كلمة المرور:</label><input id="password" type="password" required /></div>
        <div class="auth-row"><label for="age">العمر:</label><input id="age" type="number" min="0" required /></div>
        <div class="auth-row"><label for="gender">الجنس:</label>
          <select id="gender">
            <option value="male">ذكر</option>
            <option value="female">انثى</option>
            <option value="other">اخري</option>
          </select>
        </div>
        <div class="form-error" id="signup-error" style="display:none"></div>
        <div class="auth-actions">
          <button type="submit" class="btn-primary">انشاء حساب</button>
          <button type="button" class="btn-ghost" id="to-login">العودة لتسجيل الدخول</button>
        </div>
      </form>
    `);
    area.appendChild(form);
    document.getElementById('to-login').addEventListener('click', renderLogin);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: document.getElementById('name').value.trim(),
        ssn: document.getElementById('ssn').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        age: Number(document.getElementById('age').value) || null,
        gender: document.getElementById('gender').value
      };
      const errEl = document.getElementById('signup-error'); errEl.style.display = 'none';
      try {
        const res = await fetch(`${apiBase}/patient/signup`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (!res.ok || json.status !== 'success') {
          errEl.textContent = json && json.message ? json.message : 'خطأ أثناء إنشاء الحساب'; errEl.style.display = 'block'; return;
        }
        // on success switch to login and prefill email
        renderLogin();
        setTimeout(() => { document.getElementById('login-email').value = payload.email; }, 100);
      } catch (err) { errEl.textContent = err.message || 'خطأ بالشبكة'; errEl.style.display = 'block'; }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderLogin();
    document.getElementById('tab-login').addEventListener('click', renderLogin);
    document.getElementById('tab-signup').addEventListener('click', renderSignup);
  });
})();