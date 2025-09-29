// بيانات التطبيق
let currentLang = 'ar';

// بيانات الترجمة
const translations = {
    'ar': {
        'site-title': 'مكالمة دكتور - استشارات طبية',
        'site-tagline': 'استشارة طبية عبر مكالمة مع دكتور متخصص',
        'search-placeholder': 'اكتب اسم الدكتور أو التخصص',
        'search-btn': 'بحث',
        'choose-specialty': 'اختر التخصص',
        'choose-governorate': 'اختر المحافظة',
        'choose-insurance': 'اختر التأمين',
        'available-doctors': 'الأطباء المتاحون',
        'view-profile': 'عرض البروفيل',
        'experience': 'سنوات الخبرة',
        'consultation-fee': 'رسوم الاستشارة',
        'about': 'عن مكالمة دكتور',
        'about-text': 'نقدم لكم أفضل الخدمات الصحية عبر الإنترنت لتسهيل الوصول إلى الرعاية الطبية.',
        'contact': 'اتصل بنا',
        'copyright': '© 2024 مكالمة دكتور. جميع الحقوق محفوظة.',
        
        // التخصصات
        'general-medicine': 'طب عام',
        'cardiology': 'أمراض القلب',
        'pediatrics': 'طب الأطفال',
        'dermatology': 'الأمراض الجلدية',
        'orthopedics': 'جراحة العظام',
        'gynecology': 'نساء وتوليد',
        
        // المحافظات
        'cairo': 'القاهرة',
        'giza': 'الجيزة',
        'alexandria': 'الإسكندرية',
        'sharqia': 'الشرقية'
    },
    'en': {
        'site-title': 'Doctor Call - Medical Consultations',
        'site-tagline': 'Medical consultation via call with a specialist doctor',
        'search-placeholder': 'Type doctor name or specialty',
        'search-btn': 'Search',
        'choose-specialty': 'Choose Specialty',
        'choose-governorate': 'Choose Governorate',
        'choose-insurance': 'Choose Insurance',
        'available-doctors': 'Available Doctors',
        'view-profile': 'View Profile',
        'experience': 'Years of Experience',
        'consultation-fee': 'Consultation Fee',
        'about': 'About Doctor Call',
        'about-text': 'We provide the best online healthcare services to facilitate access to medical care.',
        'contact': 'Contact Us',
        'copyright': '© 2024 Doctor Call. All rights reserved.',
        
        // التخصصات
        'general-medicine': 'General Medicine',
        'cardiology': 'Cardiology',
        'pediatrics': 'Pediatrics',
        'dermatology': 'Dermatology',
        'orthopedics': 'Orthopedics',
        'gynecology': 'Gynecology',
        
        // المحافظات
        'cairo': 'Cairo',
        'giza': 'Giza',
        'alexandria': 'Alexandria',
        'sharqia': 'Sharqia'
    }
};

// بيانات الأطباء (fallback local data)
let doctors = [
    {
        id: 1,
        name: 'د. أحمد محمود',
        nameEn: 'Dr. Ahmed Mahmoud',
        specialty: 'general-medicine',
        location: 'cairo',
        locationText: 'مصر الجديدة',
        locationTextEn: 'New Cairo',
        rating: 4.2,
        image: '👨‍⚕️',
        description: 'طبيب عام بخبرة تزيد عن 10 سنوات في تشخيص وعلاج الأمراض الشائعة.',
        descriptionEn: 'General practitioner with over 10 years of experience in diagnosing and treating common diseases.',
        experience: 10,
        education: 'كلية الطب - جامعة القاهرة',
        educationEn: 'Faculty of Medicine - Cairo University',
        languages: ['العربية', 'الإنجليزية'],
        consultationFee: 200,
        phone: '+201000000001',
        email: 'dr.ahmed@doctorcall.com',
        availability: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء'],
        availabilityEn: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
        workingHours: '9:00 ص - 5:00 م'
    },
    {
        id: 2,
        name: 'د. منى السيد',
        nameEn: 'Dr. Mona El Sayed',
        specialty: 'cardiology',
        location: 'giza',
        locationText: 'الدقي',
        locationTextEn: 'Dokki',
        rating: 4.8,
        image: '👩‍⚕️',
        description: 'استشارية أمراض القلب بمستشفى القصر العيني، متخصصة في قسطرة القلب والفحوصات الدقيقة.',
        descriptionEn: 'Cardiology consultant at Kasr Al Ainy Hospital, specializing in cardiac catheterization and precise examinations.',
        experience: 15,
        education: 'كلية الطب - جامعة عين شمس',
        educationEn: 'Faculty of Medicine - Ain Shams University',
        languages: ['العربية', 'الإنجليزية', 'الفرنسية'],
        consultationFee: 350,
        phone: '+201000000002',
        email: 'dr.mona@doctorcall.com',
        availability: ['السبت', 'الاثنين', 'الأربعاء'],
        availabilityEn: ['Saturday', 'Monday', 'Wednesday'],
        workingHours: '10:00 ص - 4:00 م'
    },
    {
        id: 3,
        name: 'د. خالد عبد الرحمن',
        nameEn: 'Dr. Khaled Abdel Rahman',
        specialty: 'pediatrics',
        location: 'alexandria',
        locationText: 'سموحة',
        locationTextEn: 'Smouha',
        rating: 4.5,
        image: '👨‍⚕️',
        description: 'طبيب أطفال متخصص في أمراض حديثي الولادة والتحصينات.',
        descriptionEn: 'Pediatrician specializing in neonatal diseases and immunizations.',
        experience: 8,
        education: 'كلية الطب - جامعة الإسكندرية',
        educationEn: 'Faculty of Medicine - Alexandria University',
        languages: ['العربية', 'الإنجليزية'],
        consultationFee: 250,
        phone: '+201000000003',
        email: 'dr.khaled@doctorcall.com',
        availability: ['الأحد', 'الثلاثاء', 'الخميس'],
        availabilityEn: ['Sunday', 'Tuesday', 'Thursday'],
        workingHours: '11:00 ص - 7:00 م'
    },
    {
        id: 4,
        name: 'د. سارة محمد',
        nameEn: 'Dr. Sara Mohamed',
        specialty: 'dermatology',
        location: 'cairo',
        locationText: 'مدينة نصر',
        locationTextEn: 'Nasr City',
        rating: 4.7,
        image: '👩‍⚕️',
        description: 'استشارية الأمراض الجلدية والتجميل، متخصصة في علاج حب الشباب والأمراض الجلدية المزمنة.',
        descriptionEn: 'Dermatology and cosmetic consultant, specializing in acne treatment and chronic skin diseases.',
        experience: 12,
        education: 'كلية الطب - جامعة القاهرة',
        educationEn: 'Faculty of Medicine - Cairo University',
        languages: ['العربية', 'الإنجليزية', 'الألمانية'],
        consultationFee: 300,
        phone: '+201000000004',
        email: 'dr.sara@doctorcall.com',
        availability: ['السبت', 'الأحد', 'الاثنين', 'الأربعاء'],
        availabilityEn: ['Saturday', 'Sunday', 'Monday', 'Wednesday'],
        workingHours: '9:00 ص - 3:00 م'
    },
    {
        id: 5,
        name: 'د. عمرو حسن',
        nameEn: 'Dr. Amr Hassan',
        specialty: 'orthopedics',
        location: 'giza',
        locationText: 'المهندسين',
        locationTextEn: 'Mohandessin',
        rating: 4.6,
        image: '👨‍⚕️',
        description: 'استشاري جراحة العظام والمفاصل، متخصص في جراحات العمود الفقري والمناظير.',
        descriptionEn: 'Orthopedic and joint surgery consultant, specializing in spinal surgeries and endoscopies.',
        experience: 14,
        education: 'كلية الطب - جامعة عين شمس',
        educationEn: 'Faculty of Medicine - Ain Shams University',
        languages: ['العربية', 'الإنجليزية'],
        consultationFee: 400,
        phone: '+201000000005',
        email: 'dr.amr@doctorcall.com',
        availability: ['الأحد', 'الثلاثاء', 'الخميس'],
        availabilityEn: ['Sunday', 'Tuesday', 'Thursday'],
        workingHours: '8:00 ص - 2:00 م'
    },
    {
        id: 6,
        name: 'د. ياسمين فؤاد',
        nameEn: 'Dr. Yasmine Fouad',
        specialty: 'gynecology',
        location: 'cairo',
        locationText: 'الزمالك',
        locationTextEn: 'Zamalek',
        rating: 4.9,
        image: '👩‍⚕️',
        description: 'استشارية النساء والتوليد، متخصصة في متابعة الحمل والولادة الطبيعية والقيصرية.',
        descriptionEn: 'Gynecology and obstetrics consultant, specializing in pregnancy follow-up and natural and cesarean deliveries.',
        experience: 11,
        education: 'كلية الطب - جامعة القاهرة',
        educationEn: 'Faculty of Medicine - Cairo University',
        languages: ['العربية', 'الإنجليزية', 'الإسبانية'],
        consultationFee: 320,
        phone: '+201000000006',
        email: 'dr.yasmine@doctorcall.com',
        availability: ['السبت', 'الاثنين', 'الأربعاء', 'الجمعة'],
        availabilityEn: ['Saturday', 'Monday', 'Wednesday', 'Friday'],
        workingHours: '10:00 ص - 6:00 م'
    }
];

// دالة تطبيق اللغة
function applyLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    currentLang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.title = t['site-title'];

    // تحديث النصوص
    document.querySelector('.logo p').textContent = t['site-tagline'];
    document.getElementById('doctor-search').placeholder = t['search-placeholder'];
    document.getElementById('search-btn').textContent = t['search-btn'];
    document.querySelector('.doctors-section h3').textContent = t['available-doctors'];
    document.querySelector('.footer-section h4').textContent = t['about'];
    document.querySelector('.footer-section p').textContent = t['about-text'];
    document.querySelectorAll('.footer-section h4')[1].textContent = t['contact'];
    document.querySelector('.footer-bottom p').textContent = t['copyright'];

    // تحديث القوائم المنسدلة
    updateSelectOptions('specialty', t['choose-specialty'], [
        { value: 'general-medicine', text: t['general-medicine'] },
        { value: 'cardiology', text: t['cardiology'] },
        { value: 'pediatrics', text: t['pediatrics'] },
        { value: 'dermatology', text: t['dermatology'] },
        { value: 'orthopedics', text: t['orthopedics'] },
        { value: 'gynecology', text: t['gynecology'] }
    ]);

    updateSelectOptions('governorate', t['choose-governorate'], [
        { value: 'cairo', text: t['cairo'] },
        { value: 'giza', text: t['giza'] },
        { value: 'alexandria', text: t['alexandria'] },
        { value: 'sharqia', text: t['sharqia'] }
    ]);

    updateSelectOptions('insurance', t['choose-insurance'], [
        { value: 'health', text: 'التأمين الصحي' },
        { value: 'private', text: 'تأمين خاص' },
        { value: 'cash', text: 'نقدي' }
    ]);

    // إعادة عرض الأطباء
    displayDoctors();
}

// حاول جلب الأطباء من الـ API الخلفي، إن فشل استخدم البيانات المحلية
async function fetchDoctorsFromAPI() {
    try {
        const res = await fetch('http://localhost:1080/api/doctors');
        if (!res.ok) throw new Error('Network response was not ok');
        const json = await res.json();
        if (json && json.status === 'success' && Array.isArray(json.data)) {
            // تحويل البيانات من الـ API إلى شكل يستخدمه الواجهة (قدر الإمكان)
            doctors = json.data.map((d, idx) => ({
                id: d._id || d.id || idx + 1,
                name: d.name || d.nameAr || d.nameEn || 'دكتور',
                nameEn: d.nameEn || d.name || 'Doctor',
                specialty: (d.specialization && d.specialization.toLowerCase()) || d.specialty || 'general-medicine',
                location: d.location || 'cairo',
                locationText: d.locationText || '',
                locationTextEn: d.locationTextEn || '',
                rating: d.rating || 4.5,
                image: d.image || '👨‍⚕️',
                description: d.about || d.description || '',
                descriptionEn: d.descriptionEn || d.about || '',
                experience: d.experience || 5,
                education: d.education || '',
                educationEn: d.educationEn || '',
                languages: d.languages || ['العربية'],
                consultationFee: d.examinationPrice || d.consultationFee || 200,
                phone: d.phone || '',
                email: d.email || d.contact || '',
                availability: d.availability || [],
                availabilityEn: d.availabilityEn || [],
                workingHours: d.workHrs || d.wrkHrs || d.workingHours || ''
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
    const t = translations[currentLang];

    doctors.forEach(doctor => {
        const doctorCard = document.createElement('div');
        doctorCard.className = 'doctor-card';
        doctorCard.setAttribute('data-doctor-id', doctor.id);

        const name = currentLang === 'ar' ? doctor.name : doctor.nameEn;
        const specialty = t[doctor.specialty] || doctor.specialty;
        const governorate = t[doctor.location] || doctor.location;
        const locationText = currentLang === 'ar' ? doctor.locationText : doctor.locationTextEn;
        const location = `${governorate} - ${locationText}`;

        doctorCard.innerHTML = `
            <div class="doctor-image">
                ${doctor.image}
            </div>
            <div class="doctor-info">
                <h4>${name}</h4>
                <p class="specialty">${specialty}</p>
                <p class="location">${location}</p>
                <div class="rating">
                    <span class="stars">${'★'.repeat(Math.floor(doctor.rating))}${'☆'.repeat(5 - Math.floor(doctor.rating))}</span>
                    <span class="rating-text">(${doctor.rating})</span>
                </div>
                <div class="doctor-details">
                    <div class="detail-item">
                        <span>${t['experience']}: </span>
                        <span class="detail-value">${doctor.experience} ${currentLang === 'ar' ? 'سنوات' : 'years'}</span>
                    </div>
                    <div class="detail-item">
                        <span>${t['consultation-fee']}: </span>
                        <span class="detail-value">${doctor.consultationFee} ${currentLang === 'ar' ? 'جنيه' : 'EGP'}</span>
                    </div>
                </div>
                <button class="view-profile-btn">
                    ${t['view-profile']}
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
    window.open('doctor-profile.html?id=' + encodeURIComponent(doctorId), '_blank');
}

// دالة البحث
function performSearch() {
    const searchTerm = document.getElementById('doctor-search').value.toLowerCase();
    const specialty = document.getElementById('specialty').value;
    const governorate = document.getElementById('governorate').value;

    if (searchTerm || specialty || governorate) {
        alert(currentLang === 'ar' 
            ? `جاري البحث عن: ${searchTerm || 'جميع الأطباء'}`
            : `Searching for: ${searchTerm || 'all doctors'}`
        );
    }
}

// إعداد أزرار اللغة
function setupLanguageSwitcher() {
    document.getElementById('lang-ar').addEventListener('click', function() {
        applyLanguage('ar');
        updateLanguageButtons('ar');
    });

    document.getElementById('lang-en').addEventListener('click', function() {
        applyLanguage('en');
        updateLanguageButtons('en');
    });
}

function updateLanguageButtons(lang) {
    document.getElementById('lang-ar').classList.toggle('active', lang === 'ar');
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
}

// إعداد البحث
function setupSearch() {
    document.getElementById('search-btn').addEventListener('click', performSearch);
    document.getElementById('doctor-search').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
}

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    setupLanguageSwitcher();
    setupSearch();
    // حاول تحميل الأطباء من الـ backend ثم طبق اللغة وعرضهم
    fetchDoctorsFromAPI().then(() => applyLanguage(currentLang));
});