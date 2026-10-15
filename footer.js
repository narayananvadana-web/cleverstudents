var footerHTML = `
  <div class="notranslate" translate="no" style="background: rgba(0,0,0,0.3); padding: 20px 15px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 40px; font-size: 0.85rem; color: #94a3b8; font-family: 'Nunito', sans-serif; position: relative; z-index: 9999;">
    <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin-bottom: 10px;">
      <a href="/about.html" style="color: #cbd5e1; text-decoration: none; font-weight: 700;">About Us</a> |
      <a href="/contact.html" style="color: #cbd5e1; text-decoration: none; font-weight: 700;">Contact Us</a> |
      <a href="/privacy.html" style="color: #cbd5e1; text-decoration: none; font-weight: 700;">Privacy Policy</a> |
      <a href="/disclaimer.html" style="color: #cbd5e1; text-decoration: none; font-weight: 700;">Disclaimer</a> |
      <a href="/terms.html" style="color: #cbd5e1; text-decoration: none; font-weight: 700;">Terms & Conditions</a>
    </div>
    <div>&copy; 2026 CleverStudents. All rights reserved.</div>
  </div>
`;

function addFooter() {
  if (!document.getElementById('custom-footer') && document.body) {
    var div = document.createElement('div');
    div.id = 'custom-footer';
    div.innerHTML = footerHTML;
    document.body.appendChild(div);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addFooter);
} else {
  addFooter();
}

// =========================================================
// 1. GOOGLE ANALYTICS (GA4) - PURE JS LOADER (NO SYNTAX ERROR)
// =========================================================
(function initGoogleAnalytics() {
  var GA_ID = 'G-6T34Y64MT0';
  if (window.__cs_ga_loaded) return;
  window.__cs_ga_loaded = true;

  var gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);
})();

// =========================================================
// 2. FORCE LOCK LANGUAGE DROPDOWN LABELS ACROSS ALL PANELS
// =========================================================
(function lockLanguageDropdowns() {
  var FIXED_LANG_LABELS = {
    en: "🌐 English",
    te: "🔴 తెలుగు",
    hi: "🔴 हिन्दी",
    ta: "🔴 தமிழ்",
    ml: "🔴 മലയാളം",
    kn: "🔴 ಕನ್ನಡ"
  };

  function enforceLabels() {
    var selects = document.querySelectorAll('#lang-select, #customLangSelect, select.lang-select');
    selects.forEach(function(select) {
      select.classList.add('notranslate');
      select.setAttribute('translate', 'no');
      if (select.parentElement) {
        select.parentElement.classList.add('notranslate');
        select.parentElement.setAttribute('translate', 'no');
      }

      for (var i = 0; i < select.options.length; i++) {
        var opt = select.options[i];
        var expected = FIXED_LANG_LABELS[opt.value];
        if (expected) {
          opt.classList.add('notranslate');
          opt.setAttribute('translate', 'no');
          // Remove any <font> tags injected by Google Translate and restore exact text
          if (opt.innerHTML !== expected || opt.textContent !== expected) {
            opt.innerHTML = expected;
          }
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enforceLabels);
  } else {
    enforceLabels();
  }
  setInterval(enforceLabels, 300);
})();
