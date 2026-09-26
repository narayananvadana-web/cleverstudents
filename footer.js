// గ్లోబల్ ఫూటర్ కోడ్ (ఇది 100+ ప్యానెల్స్ లో ఆటోమేటిక్ గా అప్లై అవుతుంది)
document.addEventListener("DOMContentLoaded", function() {
  var footerHTML = `
    <div style="background: rgba(0,0,0,0.3); padding: 20px 15px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 40px; font-size: 0.85rem; color: #94a3b8; font-family: 'Nunito', sans-serif;">
      <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; margin-bottom: 10px;">
        <a href="/about.html" style="color: #cbd5e1; text-decoration: none; font-weight: 700;">About Us</a> |
        <a href="/contact.html" style="color: #cbd5e1; text-decoration: none; font-weight: 700;">Contact Us</a> |
        <a href="/privacy.html" style="color: #cbd5e1; text-decoration: none; font-weight: 700;">Privacy Policy</a> |
        <a href="/disclaimer.html" style="color: #cbd5e1; text-decoration: none; font-weight: 700;">Disclaimer</a> |
        <a href="/terms.html" style="color: #cbd5e1; text-decoration: none; font-weight: 700;">Terms & Conditions</a>
      </div>
      <div>&copy; ${new Date().getFullYear()} CleverStudents. All rights reserved.</div>
    </div>
  `;

  // ఇది పేజీ చివరన ఆటోమేటిక్ గా యాడ్ చేస్తుంది
  var div = document.createElement('div');
  div.innerHTML = footerHTML;
  document.body.appendChild(div);
});
