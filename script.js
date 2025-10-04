// Arabic-only labels and mappings
const LABELS = {
    siteTitle: 'احجزلي - الموقع الأول لحجز كشوفات بشكل أونلاين متكامل',
    siteTagline: 'الموقع الأول لحجز كشوفات بشكل أونلاين متكامل',
    searchPlaceholder: 'اكتب اسم الدكتور أو التخصص',
    searchBtn: 'بحث',
    chooseSpecialty: 'اختر التخصص',
    chooseGovernorate: 'اختر المحافظة',
    chooseInsurance: 'اختر التأمين',
    availableDoctors: 'الأطباء المتاحون',
    viewProfile: 'عرض البروفيل',
    experience: 'سنوات الخبرة',
    consultationFee: 'رسوم الاستشارة',
    about: 'عن احجزلي',
    aboutText: 'نقدم لكم أفضل الخدمات الصحية عبر الإنترنت لتسهيل الوصول إلى الرعاية الطبية عبر حجز إلكتروني متكامل.',
    contact: 'اتصل بنا',
    copyright: '© 2024 احجزلي. جميع الحقوق محفوظة.',
    years: 'سنوات',
    currency: 'جنيه'
};

const specialtyNames = {
    'general-medicine': 'طب عام',
    'cardiology': 'أمراض القلب',
    'pediatrics': 'طب الأطفال',
    'dermatology': 'الأمراض الجلدية',
    'orthopedics': 'جراحة العظام',
    'gynecology': 'نساء وتوليد'
};

const governorateNames = {
    cairo: 'القاهرة',
    giza: 'الجيزة',
    alexandria: 'الإسكندرية',
    sharqia: 'الشرقية'
};

// بيانات الأطباء (fallback local data)
let doctors = [
    {
        id: 1,
        name: 'د. أحمد محمود',
        nameEn: 'Dr. Ahmed Mahmoud',
    specialization: 'general-medicine',
        rating: 4.2,
        image: '👨‍⚕️',
        description: 'طبيب عام بخبرة تزيد عن 10 سنوات في تشخيص وعلاج الأمراض الشائعة.',
        descriptionEn: 'General practitioner with over 10 years of experience in diagnosing and treating common diseases.',
        experience: 10,
        education: 'كلية الطب - جامعة القاهرة',
        educationEn: 'Faculty of Medicine - Cairo University',
        languages: ['العربية', 'الإنجليزية'],
        examinationPrice: 200,
        phone: '+201000000001',
        email: 'dr.ahmed@doctorcall.com',
        availability: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'],
        availabilityEn: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
        workHrs: '9:00 ص - 5:00 م'
    },
    {
        id: 2,
        name: 'د. منى السيد',
        nameEn: 'Dr. Mona El Sayed',
    specialization: 'cardiology',
        rating: 4.8,
        image: '👩‍⚕️',
        description: 'استشارية أمراض القلب بمستشفى القصر العيني، متخصصة في قسطرة القلب والفحوصات الدقيقة.',
        descriptionEn: 'Cardiology consultant at Kasr Al Ainy Hospital, specializing in cardiac catheterization and precise examinations.',
        experience: 15,
        education: 'كلية الطب - جامعة عين شمس',
        educationEn: 'Faculty of Medicine - Ain Shams University',
        languages: ['العربية', 'الإنجليزية', 'الفرنسية'],
    examinationPrice: 350,
        phone: '+201000000002',
        email: 'dr.mona@doctorcall.com',
        availability: ['السبت', 'الاثنين', 'الأربعاء'],
        availabilityEn: ['Saturday', 'Monday', 'Wednesday'],
        workHrs: '10:00 ص - 4:00 م'
    },
    {
        id: 3,
        name: 'د. خالد عبد الرحمن',
        nameEn: 'Dr. Khaled Abdel Rahman',
    specialization: 'pediatrics',
        rating: 4.5,
        image: '👨‍⚕️',
        description: 'طبيب أطفال متخصص في أمراض حديثي الولادة والتحصينات.',
        descriptionEn: 'Pediatrician specializing in neonatal diseases and immunizations.',
        experience: 8,
        education: 'كلية الطب - جامعة الإسكندرية',
        educationEn: 'Faculty of Medicine - Alexandria University',
        languages: ['العربية', 'الإنجليزية'],
    examinationPrice: 250,
        phone: '+201000000003',
        email: 'dr.khaled@doctorcall.com',
        availability: ['الأحد', 'الثلاثاء', 'الخميس'],
        availabilityEn: ['Sunday', 'Tuesday', 'Thursday'],
        workHrs: '11:00 ص - 7:00 م'
    },
    {
        id: 4,
        name: 'د. سارة محمد',
        nameEn: 'Dr. Sara Mohamed',
    specialization: 'dermatology',
        rating: 4.7,
        image: '👩‍⚕️',
        description: 'استشارية الأمراض الجلدية والتجميل، متخصصة في علاج حب الشباب والأمراض الجلدية المزمنة.',
        descriptionEn: 'Dermatology and cosmetic consultant, specializing in acne treatment and chronic skin diseases.',
        experience: 12,
        education: 'كلية الطب - جامعة القاهرة',
        educationEn: 'Faculty of Medicine - Cairo University',
        languages: ['العربية', 'الإنجليزية', 'الألمانية'],
    examinationPrice: 300,
        phone: '+201000000004',
        email: 'dr.sara@doctorcall.com',
        availability: ['السبت', 'الأحد', 'الاثنين', 'الأربعاء'],
        availabilityEn: ['Saturday', 'Sunday', 'Monday', 'Wednesday'],
        workHrs: '9:00 ص - 3:00 م'
    },
    {
        id: 5,
        name: 'د. عمرو حسن',
        nameEn: 'Dr. Amr Hassan',
    specialization: 'orthopedics',
        rating: 4.6,
        image: '👨‍⚕️',
        description: 'استشاري جراحة العظام والمفاصل، متخصص في جراحات العمود الفقري والمناظير.',
        descriptionEn: 'Orthopedic and joint surgery consultant, specializing in spinal surgeries and endoscopies.',
        experience: 14,
        education: 'كلية الطب - جامعة عين شمس',
        educationEn: 'Faculty of Medicine - Ain Shams University',
        languages: ['العربية', 'الإنجليزية'],
    examinationPrice: 400,
        phone: '+201000000005',
        email: 'dr.amr@doctorcall.com',
        availability: ['الأحد', 'الثلاثاء', 'الخميس'],
        availabilityEn: ['Sunday', 'Tuesday', 'Thursday'],
        workHrs: '8:00 ص - 2:00 م'
    },
    {
        id: 6,
        name: 'د. ياسمين فؤاد',
        nameEn: 'Dr. Yasmine Fouad',
    specialization: 'gynecology',
        rating: 4.9,
        image: '👩‍⚕️',
        description: 'استشارية النساء والتوليد، متخصصة في متابعة الحمل والولادة الطبيعية والقيصرية.',
        descriptionEn: 'Gynecology and obstetrics consultant, specializing in pregnancy follow-up and natural and cesarean deliveries.',
        experience: 11,
        education: 'كلية الطب - جامعة القاهرة',
        educationEn: 'Faculty of Medicine - Cairo University',
        languages: ['العربية', 'الإنجليزية', 'الإسبانية'],
    examinationPrice: 320,
        phone: '+201000000006',
        email: 'dr.yasmine@doctorcall.com',
        availability: ['السبت', 'الاثنين', 'الأربعاء', 'الجمعة'],
        availabilityEn: ['Saturday', 'Monday', 'Wednesday', 'Friday'],
        workHrs: '10:00 ص - 6:00 م'
    }
];

// دالة تطبيق اللغة
function initUI() {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    document.title = LABELS.siteTitle;
    document.querySelector('.logo p').textContent = LABELS.siteTagline;
    const searchEl = document.getElementById('doctor-search');
    if (searchEl) searchEl.placeholder = LABELS.searchPlaceholder;
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) searchBtn.textContent = LABELS.searchBtn;
    const doctorsH3 = document.querySelector('.doctors-section h3');
    if (doctorsH3) doctorsH3.textContent = LABELS.availableDoctors;
    // footer
    const footerSections = document.querySelectorAll('.footer-section');
    if (footerSections[0]) footerSections[0].querySelector('h4').textContent = LABELS.about;
    if (footerSections[0]) footerSections[0].querySelector('p').textContent = LABELS.aboutText;
    if (footerSections[1]) footerSections[1].querySelector('h4').textContent = LABELS.contact;
    const footerBottom = document.querySelector('.footer-bottom p');
    if (footerBottom) footerBottom.textContent = LABELS.copyright;

    updateSelectOptions('specialty', LABELS.chooseSpecialty, [
        { value: 'general-medicine', text: specialtyNames['general-medicine'] },
        { value: 'cardiology', text: specialtyNames['cardiology'] },
        { value: 'pediatrics', text: specialtyNames['pediatrics'] },
        { value: 'dermatology', text: specialtyNames['dermatology'] },
        { value: 'orthopedics', text: specialtyNames['orthopedics'] },
        { value: 'gynecology', text: specialtyNames['gynecology'] }
    ]);

    updateSelectOptions('governorate', LABELS.chooseGovernorate, [
        { value: 'cairo', text: governorateNames.cairo },
        { value: 'giza', text: governorateNames.giza },
        { value: 'alexandria', text: governorateNames.alexandria },
        { value: 'sharqia', text: governorateNames.sharqia }
    ]);

    updateSelectOptions('insurance', LABELS.chooseInsurance, [
        { value: 'health', text: 'التأمين الصحي' },
        { value: 'private', text: 'تأمين خاص' },
        { value: 'cash', text: 'نقدي' }
    ]);
}

// حاول جلب الأطباء من الـ API الخلفي، إن فشل استخدم البيانات المحلية
async function fetchDoctorsFromAPI() {
    try {
        // API base URL (use the deployed backend by default)
        const API_BASE_URL = window.API_BASE_URL || 'https://ehgzly-production.up.railway.app/api';
        const res = await fetch(`${API_BASE_URL}/doctors`);
        if (!res.ok) throw new Error('Network response was not ok');
        const json = await res.json();
        if (json && json.status === 'success' && Array.isArray(json.data)) {
            // تحويل البيانات من الـ API إلى شكل يستخدمه الواجهة (قدر الإمكان)
            doctors = json.data.map((d, idx) => ({
                _id: d._id || d.id || null,
                id: d._id || d.id || idx + 1,
                name: d.name || '',
                email: d.email || '',
                specialization: d.specialization || d.specialization || '',
                about: d.about || d.description || '',
                workHrs: d.workHrs || d.workHrs || '',
                examinationPrice: (typeof d.examinationPrice !== 'undefined' && d.examinationPrice !== null) ? d.examinationPrice : 200,
                // keep UI-friendly/legacy fields empty or derived if needed
                image: d.image || '👨‍⚕️',
                rating: (typeof d.rating !== 'undefined' && d.rating !== null) ? d.rating : 5,
                experience: (typeof d.experience !== 'undefined' && d.experience !== null) ? d.experience : 5,
                education: d.education || '',
                languages: (d.languages && d.languages.length) ? d.languages : ['عربي'],
                phone: d.phone || '',
                availability: d.availability || []
            }));
        }
    } catch (err) {
        // لا تفعل شيئًا هنا — سيتم استخدام بيانات الـ fallback المحلية
        console.warn('Could not fetch doctors from API, using local data. Error:', err.message);
    }
}

// دالة تحديث خيارات القوائم المنسدلة
function updateSelectOptions(selectId, defaultText, options) {
    const select = document.getElementById(selectId);
    if (!select) return;

    select.innerHTML = `<option value="">${defaultText}</option>`;
    options.forEach(option => {
        select.innerHTML += `<option value="${option.value}">${option.text}</option>`;
    });
}

// دالة عرض الأطباء
function displayDoctors() {
    const doctorsGrid = document.getElementById('doctors-grid');
    if (!doctorsGrid) return;

    doctorsGrid.innerHTML = '';
    // Arabic-only labels

    doctors.forEach(doctor => {
        const doctorCard = document.createElement('div');
        doctorCard.className = 'doctor-card';
        doctorCard.setAttribute('data-doctor-id', doctor.id);

    const name = doctor.name;
    const specialty = specialtyNames[doctor.specialization] || doctor.specialization || '';
    const rawRating = Number(doctor.rating);
    const ratingNum = Number.isFinite(rawRating) ? Math.min(5, Math.max(0, Math.round(rawRating))) : 5;

        doctorCard.innerHTML = `
            <div class="doctor-image">
                ${doctor.image}
            </div>
            <div class="doctor-info">
                <h4>${name}</h4>
                <p class="specialty">${specialty}</p>
                    <div class="rating">
                    <span class="stars">${'★'.repeat(ratingNum)}${'☆'.repeat(5 - ratingNum)}</span>
                    <span class="rating-text">(${ratingNum})</span>
                </div>
                <div class="doctor-details">
                    <div class="detail-item">
                        <span>${LABELS.experience}: </span>
                        <span class="detail-value">${(typeof doctor.experience !== 'undefined' && doctor.experience !== null) ? doctor.experience : 5} ${LABELS.years}</span>
                    </div>
                    <div class="detail-item">
                        <span>سعر الفحص: </span>
                        <span class="detail-value">${doctor.examinationPrice || 0} ${LABELS.currency}</span>
                    </div>
                </div>
                <button class="view-profile-btn">
                    ${LABELS.viewProfile}
                </button>
            </div>
        `;

        doctorsGrid.appendChild(doctorCard);
        // attach click handler safely to avoid injecting IDs into inline JS
        const viewBtn = doctorCard.querySelector('.view-profile-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => viewDoctorProfile(String(doctor.id)));
        }
    });
}

// دالة عرض بروفيل الطبيب
function viewDoctorProfile(doctorId) {
    // حفظ معرف الطبيب في localStorage
    localStorage.setItem('selectedDoctorId', doctorId);
    
    // فتح صفحة البروفيل في نافذة جديدة
    // open profile in the same tab instead of a new tab
    location.href = 'doctor-profile.html?id=' + encodeURIComponent(doctorId);
}

// دالة البحث
function performSearch() {
    const searchTerm = document.getElementById('doctor-search').value.toLowerCase();
    const specialty = document.getElementById('specialty').value;
    const governorate = document.getElementById('governorate').value;

    if (searchTerm || specialty || governorate) {
        alert(`جاري البحث عن: ${searchTerm || 'جميع الأطباء'}`);
    }
}

// إعداد أزرار اللغة
// No language switcher: Arabic only

// إعداد البحث
function setupSearch() {
    document.getElementById('search-btn').addEventListener('click', performSearch);
    document.getElementById('doctor-search').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
}

// تهيئة حالة الهيدر الخاصة بالمستخدم (عرض تحية للطبيب عند تسجيل الدخول)
function initHeaderAuth() {
    try {
        const headerControls = document.querySelector('.header-controls');
        if (!headerControls) return;

        const raw = sessionStorage.getItem('ehgzly_user');
        if (!raw) return; // not logged in

        const user = JSON.parse(raw);
        const name = (user && (user.name || user.username)) ? String(user.name || user.username) : '';
        const userType = sessionStorage.getItem('ehgzly_user_type') || 'patient';

        // بناء عنصر التحية
        headerControls.innerHTML = '';
        const greet = document.createElement('div');
        greet.className = (userType === 'doctor') ? 'doctor-greeting' : 'patient-greeting';
        greet.textContent = (userType === 'doctor') ? `مرحبا دكتور ${name}` : `مرحبا ${name}`;

        // إضافة زر خروج بسيط (اختياري)
        const logout = document.createElement('a');
        logout.href = '#';
        logout.className = (userType === 'doctor') ? 'doctor-logout' : 'patient-logout';
        logout.textContent = 'تسجيل خروج';
        logout.style.marginRight = '12px';
        logout.addEventListener('click', function(ev) {
            ev.preventDefault();
            if (typeof performLogout === 'function') return performLogout();
            // fallback: clear storages and expire cookies
            try{ localStorage.clear(); sessionStorage.clear(); }catch(e){}
            try{ document.cookie.split(";").forEach(c => document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")); }catch(e){}
            window.location.reload();
        });

        headerControls.appendChild(greet);
        headerControls.appendChild(logout);
    } catch (err) {
        console.warn('initHeaderAuth error:', err && err.message);
    }
}

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    initUI();
    setupSearch();
    initHeaderAuth();
    // حاول تحميل الأطباء من الـ backend ثم عرضهم
    fetchDoctorsFromAPI().then(() => displayDoctors());
});

// global logout helper (clears storages and all cookies)
function performLogout(){
    try{ localStorage.clear(); sessionStorage.clear(); }catch(e){}
    try{ document.cookie.split(";").forEach(c => document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")); }catch(e){}
    window.location.reload();
}