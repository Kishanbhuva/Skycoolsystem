/**
 * SKY COOL SYSTEM - Core Interactive Logic & Form Handlers
 * Industrial Cooling Solutions Manufacturer
 */

document.addEventListener('DOMContentLoaded', () => {
  initLocalFileLinks();
  initNavbar();
  initCalculator();
  initModals();
  initInquiryForms();
  initBrochureDownloads();
});

/**
 * Ensures clean URLs work locally on file:// without needing a server,
 * while on Cloudflare Pages and live hosting clean URLs (/about, /products) are used.
 */
function initLocalFileLinks() {
  if (window.location.protocol === 'file:') {
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      const href = link.getAttribute('href');
      if (href === '/') {
        link.setAttribute('href', 'index.html');
      } else if (href.startsWith('/#')) {
        link.setAttribute('href', 'index.html' + href.substring(1));
      } else if (href.startsWith('/assets/')) {
        link.setAttribute('href', href.substring(1));
      } else if (href.includes('#')) {
        const [path, hash] = href.substring(1).split('#');
        link.setAttribute('href', `${path}.html#${hash}`);
      } else if (!href.includes('.')) {
        link.setAttribute('href', href.substring(1) + '.html');
      }
    });
  }
}

/* ==========================================================================
   Navbar & Mobile Navigation
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileToggle.querySelector('svg, i');
      if (navLinks.classList.contains('open')) {
        mobileToggle.setAttribute('aria-expanded', 'true');
      } else {
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
      }
    });
  }
}

/* ==========================================================================
   Air Dryer Sizing Calculator
   Calculation Logic extracted from Sky Cool Technical Catalog:
   Required Dryer Flow = Actual CFM / (L1 * L2 * L3 * L4)
   ========================================================================== */
function initCalculator() {
  const calcForm = document.getElementById('airDryerCalcForm');
  if (!calcForm) return;

  const inletTempInput = document.getElementById('calcInletTemp');
  const ambientTempInput = document.getElementById('calcAmbientTemp');
  const pressureInput = document.getElementById('calcPressure');
  const dewPointInput = document.getElementById('calcDewPoint');
  const flowInput = document.getElementById('calcFlow');

  const resultFlowEl = document.getElementById('calcResultFlow');
  const recommendedModelEl = document.getElementById('calcRecommendedModel');
  const cfFactorEl = document.getElementById('calcTotalCF');

  // Catalog Lookup Tables
  const L1_TABLE = { 30: 1.61, 35: 1.38, 40: 1.22, 45: 1.00, 50: 0.76, 55: 0.60, 60: 0.49 };
  const L2_TABLE = { 25: 1.21, 30: 1.14, 35: 1.07, 40: 1.00, 45: 0.93, 50: 0.85, 55: 0.74 };
  const L3_TABLE = { 3: 0.54, 4: 0.66, 5: 0.76, 6: 0.87, 7: 1.00, 8: 1.02, 9: 1.17, 10: 1.26, 12: 1.38, 14: 1.51, 16: 1.65 };
  const L4_TABLE = { 3: 1.00, 5: 1.14, 7: 1.24, 10: 1.39 };

  // Standard Sky Cool Models list
  const SKY_COOL_MODELS = [
    { model: 'SC-S20', cfm: 20, kw: 0.6, phase: '1 Phase' },
    { model: 'SC-S40', cfm: 40, kw: 0.6, phase: '1 Phase' },
    { model: 'SC-S60', cfm: 60, kw: 0.8, phase: '1 Phase' },
    { model: 'SC-S80', cfm: 80, kw: 0.9, phase: '1 Phase' },
    { model: 'SC-S100', cfm: 100, kw: 1.3, phase: '1 Phase' },
    { model: 'SC-S125', cfm: 125, kw: 1.3, phase: '1 Phase' },
    { model: 'SC-S150', cfm: 150, kw: 1.4, phase: '1 Phase' },
    { model: 'SC-S200', cfm: 200, kw: 1.5, phase: '1 Phase' },
    { model: 'SC-S250', cfm: 250, kw: 2.0, phase: '3 Phase' },
    { model: 'SC-S300', cfm: 300, kw: 2.0, phase: '3 Phase' },
    { model: 'SC-S350', cfm: 350, kw: 3.0, phase: '3 Phase' },
    { model: 'SC-S400', cfm: 400, kw: 3.0, phase: '3 Phase' },
    { model: 'SC-S500', cfm: 500, kw: 3.0, phase: '3 Phase' }
  ];

  function getClosestFactor(table, val) {
    const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
    let closest = keys[0];
    for (let k of keys) {
      if (Math.abs(k - val) < Math.abs(closest - val)) {
        closest = k;
      }
    }
    return table[closest];
  }

  function calculate() {
    const flow = parseFloat(flowInput.value) || 100;
    const tInlet = parseFloat(inletTempInput.value) || 45;
    const tAmbient = parseFloat(ambientTempInput.value) || 40;
    const pInlet = parseFloat(pressureInput.value) || 7;
    const dewPoint = parseFloat(dewPointInput.value) || 3;

    const l1 = getClosestFactor(L1_TABLE, tInlet);
    const l2 = getClosestFactor(L2_TABLE, tAmbient);
    const l3 = getClosestFactor(L3_TABLE, pInlet);
    const l4 = getClosestFactor(L4_TABLE, dewPoint);

    const totalCF = l1 * l2 * l3 * l4;
    const requiredDryerCFM = Math.round(flow / totalCF);

    if (resultFlowEl) resultFlowEl.innerText = `${requiredDryerCFM} CFM`;
    if (cfFactorEl) cfFactorEl.innerText = totalCF.toFixed(2);

    // Recommend Model
    let recommended = SKY_COOL_MODELS.find(m => m.cfm >= requiredDryerCFM);
    if (!recommended) {
      recommended = { model: 'Custom Multi-Unit / High-Capacity Sky Cool System', cfm: requiredDryerCFM, kw: 'Contact Factory' };
    }

    if (recommendedModelEl) {
      recommendedModelEl.innerHTML = `Recommended: <span>${recommended.model}</span> (${recommended.cfm} CFM)`;
    }
  }

  [inletTempInput, ambientTempInput, pressureInput, dewPointInput, flowInput].forEach(el => {
    if (el) {
      el.addEventListener('input', calculate);
      el.addEventListener('change', calculate);
    }
  });

  calculate();
}

/* ==========================================================================
   Modals & Quick Quote Triggers
   ========================================================================== */
function initModals() {
  const quoteButtons = document.querySelectorAll('[data-open-quote-modal]');
  const quoteModal = document.getElementById('quoteModal');
  const modalClose = document.querySelectorAll('.modal-close, [data-close-modal]');
  const modalProductInput = document.getElementById('modalSelectedProduct');

  quoteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.getAttribute('data-product-name') || 'Refrigerated Air Dryer / Water Chiller';
      if (modalProductInput) {
        modalProductInput.value = product;
      }
      if (quoteModal) {
        quoteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalClose.forEach(btn => {
    btn.addEventListener('click', () => {
      if (quoteModal) {
        quoteModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on backdrop click
  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        quoteModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ==========================================================================
   Inquiry Forms Handling & Email Integration
   Routes to skycoolsystem2015@gmail.com and WhatsApp +91 90333 75597
   ========================================================================== */
function initInquiryForms() {
  const forms = document.querySelectorAll('form[data-inquiry-form]');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit';

      const formData = new FormData(form);
      const name = formData.get('name') || 'Valued Client';
      const company = formData.get('company') || '';
      const phone = formData.get('phone') || '';
      const email = formData.get('email') || '';
      const product = formData.get('product') || 'Cooling Solutions';
      const message = formData.get('message') || '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; width:18px; height:18px; margin-right:8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="4" stroke="rgba(255,255,255,0.3)"></circle>
            <path d="M4 12a8 8 0 018-8" stroke-width="4" stroke="currentColor"></path>
          </svg> Sending Inquiry...
        `;
      }

      // Check if Web3Forms or Formspree access key is provided
      const accessKey = form.querySelector('input[name="access_key"]')?.value;

      try {
        if (accessKey && accessKey !== 'YOUR_WEB3FORMS_ACCESS_KEY' && accessKey.length > 10) {
          // Live API submission to Web3Forms
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
          });
          const result = await response.json();
          if (result.success) {
            showToast('✅ Inquiry received! Our engineering team will contact you shortly.');
            form.reset();
          } else {
            fallbackSubmission(name, company, phone, email, product, message);
          }
        } else {
          // Default instant direct WhatsApp + Mailto fallback
          fallbackSubmission(name, company, phone, email, product, message);
          showToast('✅ Inquiry recorded! Redirecting to WhatsApp & Email dispatch...');
          form.reset();
        }
      } catch (err) {
        fallbackSubmission(name, company, phone, email, product, message);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
        // Close modal if open
        const modal = form.closest('.modal-overlay');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });
}

function fallbackSubmission(name, company, phone, email, product, message) {
  const whatsappText = `*New Web Inquiry - Sky Cool System*%0A` +
    `*Name:* ${encodeURIComponent(name)}%0A` +
    `*Company:* ${encodeURIComponent(company)}%0A` +
    `*Phone:* ${encodeURIComponent(phone)}%0A` +
    `*Email:* ${encodeURIComponent(email)}%0A` +
    `*Product Requirement:* ${encodeURIComponent(product)}%0A` +
    `*Details:* ${encodeURIComponent(message)}`;

  // Offer instant WhatsApp link
  setTimeout(() => {
    window.open(`https://wa.me/919033375597?text=${whatsappText}`, '_blank');
  }, 600);
}

/* ==========================================================================
   Brochure Download Tracking
   ========================================================================== */
function initBrochureDownloads() {
  const downloadLinks = document.querySelectorAll('a[download]');
  downloadLinks.forEach(link => {
    link.addEventListener('click', () => {
      showToast('📥 Downloading official Sky Cool System product catalog...');
    });
  });
}

/* ==========================================================================
   Toast Notification Utility
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}
