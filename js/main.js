// ═══════════════════════════════════════════════════
//   SAIRAJ GROUP OF INDUSTRIES — MAIN JS v3 (Production)
//   - URL hash routing (#/compound-wall)
//   - SEO: dynamic title + meta description per page
//   - Back/Forward browser button support
//   - Lazy image loading
//   - WhatsApp popup (session-once, not every visit)
//   - Scroll reveal with IntersectionObserver
// ═══════════════════════════════════════════════════

'use strict';

// ─── PAGE META (title + description per page for SEO) ───
const PAGE_META = {
  'home':           { title: 'Sairaj Group of Industries — RCC & Precast Concrete Manufacturer, Chhatrapati Sambhajinagar', desc: 'Premium manufacturer of RCC compound walls, precast boundary walls, benches, tree guards, poles and cemented grills in Chhatrapati Sambhajinagar, Maharashtra. GST registered. Call +91 90499-50192.' },
  'about':          { title: 'About Us — Sairaj Group of Industries, Chhatrapati Sambhajinagar Maharashtra', desc: 'Sairaj Group of Industries is a GST-registered manufacturer of RCC and precast concrete products based in Chhatrapati Sambhajinagar, Maharashtra. GSTIN: 03ECWTB0259JIZI.' },
  'products':       { title: 'Products — RCC & Precast Concrete | Sairaj Group of Industries', desc: 'View our full range: RCC compound walls, precast boundary walls, benches, tree guards, RCC poles, and cemented grills. Direct manufacturer, Chhatrapati Sambhajinagar Maharashtra.' },
  'compound-wall':  { title: 'RCC Compound Wall — 50+ Styles | Sairaj Group of Industries Chhatrapati Sambhajinagar', desc: 'Premium RCC compound walls with 50+ design styles. Plain, textured, lattice, carved, coloured. HT wire reinforced. Manufacturer in Chhatrapati Sambhajinagar Maharashtra.' },
  'boundary-wall':  { title: 'Precast Boundary Wall — Fast Install | Sairaj Group of Industries', desc: 'Standard precast boundary walls for residential, industrial and farm perimeters. Rapid installation with pre-engineered column system. Chhatrapati Sambhajinagar, Maharashtra.' },
  'benches':        { title: 'RCC Benches — Precast Concrete Park Benches | Sairaj Group of Industries', desc: 'Durable precast RCC benches for parks, gardens, bus stands, and public spaces. Weather-resistant, vandal-proof. Manufacturer in Chhatrapati Sambhajinagar Maharashtra.' },
  'tree-guards':    { title: 'RCC Tree Guards — Precast Concrete | Sairaj Group of Industries Chhatrapati Sambhajinagar', desc: 'Precast RCC tree guards for highway plantations, urban greening, and municipal projects. Bulk supply available. Chhatrapati Sambhajinagar, Maharashtra.' },
  'rcc-poles':      { title: 'RCC Poles — Reinforced Concrete Poles | Sairaj Group of Industries', desc: 'Reinforced concrete utility poles for street lighting and electricity distribution. Manufactured to IS standards. Sairaj Group, Chhatrapati Sambhajinagar Maharashtra.' },
  'cemented-grill': { title: 'Cemented Grill & Railway Majestic Fans | Sairaj Group of Industries', desc: 'Decorative precast RCC cemented grills and railway majestic fans for compound tops, ventilation panels, and architectural facades. Chhatrapati Sambhajinagar Maharashtra.' },
  'gallery':        { title: 'Gallery — Factory & Products | Sairaj Group of Industries Chhatrapati Sambhajinagar', desc: 'View photos of our manufacturing facility and installed RCC precast products across Maharashtra. Sairaj Group of Industries, Chhatrapati Sambhajinagar.' },
  'manufacturing':  { title: 'Manufacturing Process — Precast RCC | Sairaj Group of Industries', desc: 'Step-by-step precast RCC manufacturing process — from raw material to finished product. Precision steel moulds, HT wire reinforcement, Chhatrapati Sambhajinagar Maharashtra.' },
  'projects':       { title: 'Projects & Applications — Sairaj Group of Industries Chhatrapati Sambhajinagar', desc: 'Residential, industrial, agricultural, institutional and municipal precast RCC projects by Sairaj Group of Industries, Chhatrapati Sambhajinagar Maharashtra.' },
  'certifications': { title: 'Quality & Certifications — Sairaj Group of Industries Chhatrapati Sambhajinagar', desc: 'GST registered (GSTIN: 03ECWTB0259JIZI). IS code compliant. Controlled mix design. Sairaj Group of Industries, Chhatrapati Sambhajinagar Maharashtra.' },
  'contact':        { title: 'Contact Us — Sairaj Group of Industries Chhatrapati Sambhajinagar | +91 90499-50192', desc: 'Contact Sairaj Group of Industries: +91 90499-50192, +91 95451-92509. Factory: 94/9, N11, Sudarshan Nagar, HUDCO, Chhatrapati Sambhajinagar, Maharashtra – 431003, India.' },
};

const VALID_PAGES = Object.keys(PAGE_META);
const PRODUCT_PAGES = ['compound-wall','boundary-wall','benches','tree-guards','rcc-poles','cemented-grill','balusters','other-products'];

// ─── ROUTING ───
function getPageFromHash() {
  const hash = window.location.hash.replace('#/', '').replace('#', '').trim();
  return VALID_PAGES.includes(hash) ? hash : 'home';
}

function showPage(id, pushState = true) {
  if (!VALID_PAGES.includes(id)) id = 'home';

  // Update all page visibility
  VALID_PAGES.forEach(p => {
    const el  = document.getElementById('page-' + p);
    const nav = document.getElementById('nav-'  + p);
    if (el)  el.classList.remove('active');
    if (nav) nav.classList.remove('active');
  });

  const target = document.getElementById('page-' + id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Nav highlight
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');
  if (PRODUCT_PAGES.includes(id)) {
    const navProd = document.getElementById('nav-products');
    if (navProd) navProd.classList.add('active');
  }

  // Update URL hash (no page reload)
  if (pushState) {
    const newHash = id === 'home' ? '#/' : '#/' + id;
    if (window.location.hash !== newHash) {
      history.pushState({ page: id }, '', newHash);
    }
  }

  // Update <title> and meta description
  const meta = PAGE_META[id] || PAGE_META['home'];
  document.title = meta.title;
  let metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', meta.desc);

  // Update canonical link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    const base = canonical.getAttribute('data-base') || canonical.href.split('#')[0];
    canonical.setAttribute('data-base', base);
    canonical.href = id === 'home' ? base : base + '#/' + id;
  }

  triggerReveal();
  closeMobile();
}

// Browser back/forward support
window.addEventListener('popstate', () => {
  showPage(getPageFromHash(), false);
});

// ─── MOBILE NAV ───
function toggleMobile() {
  const nav = document.getElementById('mobileNav');
  const open = nav.classList.toggle('open');
  document.body.style.overflow = open ? 'hidden' : '';
}
function closeMobile() {
  document.getElementById('mobileNav').classList.remove('open');
  document.body.style.overflow = '';
}
// Close mobile nav on outside click
document.addEventListener('click', (e) => {
  const nav = document.getElementById('mobileNav');
  const burger = document.querySelector('.nav-hamburger');
  if (nav && nav.classList.contains('open') && !nav.contains(e.target) && !burger.contains(e.target)) {
    closeMobile();
  }
});

// ─── WHATSAPP POPUP ───
function openWpPopup() {
  document.getElementById('wpPopup').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeWpPopup() {
  document.getElementById('wpPopup').classList.remove('open');
  document.body.style.overflow = '';
}

// ─── WHATSAPP NUMBERS ───
const WP_NUM1 = '919049950192';
const WP_NUM2 = '919545192509';
const WP_MSG  = encodeURIComponent('Hello Sairaj Group of Industries! I would like to enquire about your RCC & Precast Concrete products. Please share details.');

function wpEnquire(num) {
  window.open('https://wa.me/' + num + '?text=' + WP_MSG, '_blank', 'noopener,noreferrer');
}

// ─── PRODUCT ENQUIRY (WhatsApp with product name) ───
function enquireProduct(productName, extraSpecs) {
  let msg = 'Hello Sairaj Group of Industries!\n\n';
  msg += 'I am interested in: *' + productName + '*\n\n';
  if (extraSpecs) msg += 'Details:\n' + extraSpecs + '\n\n';
  msg += 'Please share:\n';
  msg += '• Current price / rate\n';
  msg += '• Available sizes & designs\n';
  msg += '• Delivery timeline to my location\n';
  msg += '• Bulk order discount (if applicable)\n\n';
  msg += 'Thank you!';
  window.open('https://wa.me/' + WP_NUM1 + '?text=' + encodeURIComponent(msg), '_blank', 'noopener,noreferrer');
}

// ─── GALLERY THUMB SWITCH (detail pages) ───
function switchProdImg(thumb, src) {
  const gallery = thumb.closest('.prod-sale-gallery');
  if (!gallery) return;
  const main = gallery.querySelector('.prod-sale-main');
  if (main) main.src = src;
  gallery.querySelectorAll('.prod-sale-thumbs img').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

// ─── LAZY IMAGE LOADING ───
function initLazyImages() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    images.forEach(img => imgObserver.observe(img));
  } else {
    // Fallback: load all immediately
    images.forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
  }
}

// ─── SCROLL REVEAL ───
function triggerReveal() {
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 60) el.classList.add('visible');
    });
  }, 80);
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {

  // Close popup on backdrop click
  const popup = document.getElementById('wpPopup');
  if (popup) {
    popup.addEventListener('click', function(e) {
      if (e.target === this) closeWpPopup();
    });
  }

  // Close popup on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeWpPopup();
  });

  // Show popup once per session (not every single page load)
  if (!sessionStorage.getItem('wp_popup_shown')) {
    setTimeout(() => {
      openWpPopup();
      sessionStorage.setItem('wp_popup_shown', '1');
    }, 4500);
  }

  // Load correct page from URL hash on first load
  const startPage = getPageFromHash();
  showPage(startPage, false);

  // Scroll reveal observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Lazy images
  initLazyImages();

  // Smooth nav scroll highlight on desktop
  triggerReveal();
});

// ─── PRODUCT ENQUIRY FORM HANDLER ───
window.handleProductEnquiry = function(e) {
  e.preventDefault();

  const nameEl = document.getElementById('enq-name');
  const addrEl = document.getElementById('enq-address');
  const phoneEl = document.getElementById('enq-phone');
  const reqEl = document.getElementById('enq-requirement');

  const errName = document.getElementById('err-name');
  const errAddr = document.getElementById('err-address');
  const errPhone = document.getElementById('err-phone');
  const errReq = document.getElementById('err-requirement');

  let isValid = true;

  // Validate Name
  const name = nameEl.value.trim();
  if (!name) {
    nameEl.classList.add('input-error');
    errName.classList.add('show');
    isValid = false;
  } else {
    nameEl.classList.remove('input-error');
    errName.classList.remove('show');
  }

  // Validate Address
  const address = addrEl.value.trim();
  if (!address) {
    addrEl.classList.add('input-error');
    errAddr.classList.add('show');
    isValid = false;
  } else {
    addrEl.classList.remove('input-error');
    errAddr.classList.remove('show');
  }

  // Validate Phone (digits only, at least 10 digits)
  const phoneRaw = phoneEl.value.trim();
  const phoneDigits = phoneRaw.replace(/\D/g, '');
  if (!phoneDigits || phoneDigits.length < 10) {
    phoneEl.classList.add('input-error');
    errPhone.classList.add('show');
    isValid = false;
  } else {
    phoneEl.classList.remove('input-error');
    errPhone.classList.remove('show');
  }

  // Validate Requirement
  const requirement = reqEl.value.trim();
  if (!requirement) {
    reqEl.classList.add('input-error');
    errReq.classList.add('show');
    isValid = false;
  } else {
    reqEl.classList.remove('input-error');
    errReq.classList.remove('show');
  }

  if (!isValid) return;

  // Save to localStorage
  try {
    const list = JSON.parse(localStorage.getItem('sairaj_enquiries') || '[]');
    list.unshift({
      id: Date.now(),
      name,
      address,
      phone: phoneDigits,
      requirement,
      created_at: new Date().toISOString()
    });
    localStorage.setItem('sairaj_enquiries', JSON.stringify(list));
  } catch (err) {
    console.error('Error saving enquiry to localStorage:', err);
  }

  // Hide form, show confirmation status
  const formEl = document.getElementById('productEnquiryForm');
  const statusEl = document.getElementById('enquiryStatus');

  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  const cleanPhone = phoneDigits.length > 10 ? phoneDigits.slice(-10) : phoneDigits;
  const wpText = 'Hello Sairaj Group of Industries!\n\n' +
    '*Product Enquiry Form Submission*\n' +
    '• *Name:* ' + name + '\n' +
    '• *Address:* ' + address + '\n' +
    '• *Phone:* ' + cleanPhone + '\n' +
    '• *Requirement:* ' + requirement + '\n\n' +
    'Please share quotation and availability.';
  const wpLink = 'https://wa.me/919049950192?text=' + encodeURIComponent(wpText);

  formEl.style.display = 'none';
  statusEl.style.display = 'block';
  statusEl.innerHTML = `
    <div class="enq-success-box">
      <div class="esb-badge">✓ Enquiry Recorded</div>
      <h4>Thank You, ${escapeHtml(name)}!</h4>
      <p>Your product enquiry has been recorded with the following details:</p>
      <div class="esb-details">
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Address:</strong> ${escapeHtml(address)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(cleanPhone)}</p>
        <p><strong>Requirement:</strong> ${escapeHtml(requirement)}</p>
      </div>
      <div class="esb-notice">
        ℹ️ <strong>System Note:</strong> A backend submission destination (such as an email API or database integration) is still needed for automated email delivery to company staff.
      </div>
      <div class="esb-actions">
        <a href="${wpLink}" target="_blank" rel="noopener noreferrer" class="btn-wp-dispatch">
          💬 Send this Enquiry via WhatsApp →
        </a>
        <button type="button" class="btn-secondary" onclick="resetProductEnquiryForm()">
          Submit Another Enquiry
        </button>
      </div>
    </div>
  `;
};

window.resetProductEnquiryForm = function() {
  const formEl = document.getElementById('productEnquiryForm');
  const statusEl = document.getElementById('enquiryStatus');
  if (formEl) {
    formEl.reset();
    formEl.style.display = 'block';
    ['enq-name', 'enq-address', 'enq-phone', 'enq-requirement'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('input-error');
    });
    ['err-name', 'err-address', 'err-phone', 'err-requirement'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('show');
    });
  }
  if (statusEl) {
    statusEl.style.display = 'none';
    statusEl.innerHTML = '';
  }
};
