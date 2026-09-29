var footerHTML = `
  <div style="background: rgba(0,0,0,0.3); padding: 20px 15px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 40px; font-size: 0.85rem; color: #94a3b8; font-family: 'Nunito', sans-serif; position: relative; z-index: 9999;">
    <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin-bottom: 10px;">
      <a href="/about.html" style="color: #cbd5e1; text-decoration: none; font-weight: 700;">About Us</a> |
      <a href="/contact.html" style="color: #cbd5e1; text-decoration: none; font-weight: 700;">Contact Us</a> |
      <a href="/privacy.html" style="color: #cbd5e1; text-decoration: none; font-weight: 700;">Privacy Policy</a> |
      <a href="/disclaimer.html" style="color: #cbd5e1; text-decoration: none; font-weight: 700;">Disclaimer</a> |
      <a href="/terms.html" style="color: #cbd5e1; text-decoration: none; font-weight: 700;">Terms & Conditions</a>
    </div>
    <div>&copy; 2024 CleverStudents. All rights reserved.</div>
  </div>
`;

function addFooter() {
  if(!document.getElementById('custom-footer')) {
    var div = document.createElement('div');
    div.id = 'custom-footer';
    div.innerHTML = footerHTML;
    document.body.appendChild(div);
  }
}

// ఇది పేజీ ఎప్పుడు లోడ్ అయినా కచ్చితంగా ఫూటర్ ని కింద యాడ్ చేస్తుంది
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addFooter);
} else {
  addFooter();
}
