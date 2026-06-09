// ═══════════════════════════════════════════════════
//   AP GROUP OF INDUSTRIES — MAIN JS v3 (Production)
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
  'home':           { title: 'AP Group of Industries — RCC & Precast Concrete Manufacturer, Patiala', desc: 'Premium manufacturer of RCC compound walls, precast boundary walls, benches, tree guards, poles and cemented grills in Patiala, Punjab. GST registered. Call +91 98783-00280.' },
  'about':          { title: 'About Us — AP Group of Industries, Patiala Punjab', desc: 'AP Group of Industries is a GST-registered manufacturer of RCC and precast concrete products based in Patiala, Punjab. GSTIN: 03ECWTB0259JIZI.' },
  'products':       { title: 'Products — RCC & Precast Concrete | AP Group of Industries', desc: 'View our full range: RCC compound walls, precast boundary walls, benches, tree guards, RCC poles, and cemented grills. Direct manufacturer, Patiala Punjab.' },
  'compound-wall':  { title: 'RCC Compound Wall — 50+ Styles | AP Group of Industries Patiala', desc: 'Premium RCC compound walls with 50+ design styles. Plain, textured, lattice, carved, coloured. HT wire reinforced. Manufacturer in Patiala Punjab.' },
  'boundary-wall':  { title: 'Precast Boundary Wall — Fast Install | AP Group of Industries', desc: 'Standard precast boundary walls for residential, industrial and farm perimeters. Rapid installation with pre-engineered column system. Patiala, Punjab.' },
  'benches':        { title: 'RCC Benches — Precast Concrete Park Benches | AP Group of Industries', desc: 'Durable precast RCC benches for parks, gardens, bus stands, and public spaces. Weather-resistant, vandal-proof. Manufacturer in Patiala Punjab.' },
  'tree-guards':    { title: 'RCC Tree Guards — Precast Concrete | AP Group of Industries Patiala', desc: 'Precast RCC tree guards for highway plantations, urban greening, and municipal projects. Bulk supply available. Patiala, Punjab.' },
  'rcc-poles':      { title: 'RCC Poles — Reinforced Concrete Poles | AP Group of Industries', desc: 'Reinforced concrete utility poles for street lighting and electricity distribution. Manufactured to IS standards. AP Group, Patiala Punjab.' },
  'cemented-grill': { title: 'Cemented Grill & Railway Majestic Fans | AP Group of Industries', desc: 'Decorative precast RCC cemented grills and railway majestic fans for compound tops, ventilation panels, and architectural facades. Patiala Punjab.' },
  'gallery':        { title: 'Gallery — Factory & Products | AP Group of Industries Patiala', desc: 'View photos of our manufacturing facility and installed RCC precast products across Punjab. AP Group of Industries, Patiala.' },
  'manufacturing':  { title: 'Manufacturing Process — Precast RCC | AP Group of Industries', desc: 'Step-by-step precast RCC manufacturing process — from raw material to finished product. Precision steel moulds, HT wire reinforcement, Patiala Punjab.' },
  'projects':       { title: 'Projects & Applications — AP Group of Industries Patiala', desc: 'Residential, industrial, agricultural, institutional and municipal precast RCC projects by AP Group of Industries, Patiala Punjab.' },
  'certifications': { title: 'Quality & Certifications — AP Group of Industries Patiala', desc: 'GST registered (GSTIN: 03ECWTB0259JIZI). IS code compliant. Controlled mix design. AP Group of Industries, Patiala Punjab.' },
  'contact':        { title: 'Contact Us — AP Group of Industries Patiala | +91 98783-00280', desc: 'Contact AP Group of Industries: +91 98783-00280, +91 82830-75531. Factory: #420 Ranjit Nagar, Hasanpur Parohtan, Patiala 147001 Punjab.' },
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
const WP_NUM1 = '919878300280';
const WP_NUM2 = '918283075531';
const WP_MSG  = encodeURIComponent('Hello AP Group of Industries! I would like to enquire about your RCC & Precast Concrete products. Please share details.');

function wpEnquire(num) {
  window.open('https://wa.me/' + num + '?text=' + WP_MSG, '_blank', 'noopener,noreferrer');
}

// ─── PRODUCT ENQUIRY (WhatsApp with product name) ───
function enquireProduct(productName, extraSpecs) {
  let msg = 'Hello AP Group of Industries!\n\n';
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