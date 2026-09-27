/* ================================
   GLOBAL NAVBAR SCRIPT - v1.0
   Auto-injects responsive navbar at top of <body>
   EASILY EDITABLE: Modify menuData array to add/edit/delete dropdowns
   ================================ */

// ============================================
// MENU DATA - EDIT THIS SECTION FREELY!
// ============================================
const menuData = [
  {
    name: "Academics",
    icon: "📚",
    links: [
      { text: "1st to 10th Class", href: "#" },
      { text: "11th to Degree", href: "#" }
    ]
  },
  {
    name: "Practice & Games",
    icon: "🎮",
    links: [
      { text: "Brain Games", href: "#" },
      { text: "Self-Assessment Exam 1", href: "#" },
      { text: "Self-Assessment Exam 2", href: "#" }
    ]
  },
  {
    name: "IIT Academy",
    icon: "🏆",
    links: [
      { text: "IIT Foundation (1st to 10th)", href: "#" },
      { text: "IIT JEE (11th to 12th)", href: "#" }
    ]
  },
  {
    name: "Development Skills",
    icon: "💡",
    links: [
      { text: "IQ Knowledge Development", href: "#" },
      { text: "Logic Skills", href: "#" },
      { text: "General Skill Development", href: "#" }
    ]
  }
];

// ============================================
// NAVBAR HTML & CSS INJECTION
// ============================================

(function() {
  "use strict";

  // Inject CSS Styles (uses your CSS variables for theme consistency)
  function injectStyles() {
    if (document.getElementById('global-navbar-styles')) return; // Prevent duplicate injection

    const styles = `
      /* Global Navbar Styles - Theme-aware */
      #global-navbar {
        background: var(--srf);
        border-bottom: 1px solid var(--brd);
        padding: 0;
        position: sticky;
        top: 0;
        z-index: 998;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      body.light-mode #global-navbar {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .navbar-inner {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        padding: 0 15px;
        height: 60px;
        gap: 0;
      }

      .navbar-brand {
        font-family: 'Fredoka One', cursive;
        font-size: 1.2rem;
        background: linear-gradient(135deg, #f59e0b, #ef4444);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 900;
        margin-right: 40px;
        white-space: nowrap;
        flex-shrink: 0;
      }

      .navbar-menu {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 5px;
        flex: 1;
        flex-wrap: wrap;
        align-items: center;
      }

      .navbar-item {
        position: relative;
      }

      .navbar-link {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 12px 20px;
        color: var(--txt);
        text-decoration: none;
        font-weight: 700;
        font-size: 0.9rem;
        cursor: pointer;
        border-radius: 6px;
        transition: all 0.2s ease;
        border: 1px solid transparent;
      }

      .navbar-link:hover {
        background: rgba(59, 130, 246, 0.15);
        border-color: #3b82f6;
        color: #60a5fa;
      }

      .navbar-dropdown-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        background: var(--srf);
        border: 1px solid var(--brd);
        border-radius: 8px;
        margin-top: 8px;
        min-width: 240px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        z-index: 999;
        animation: slideDown 0.2s ease;
      }

      body.light-mode .navbar-dropdown-menu {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      }

      .navbar-item:hover .navbar-dropdown-menu {
        display: block;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .navbar-dropdown-menu li {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .navbar-dropdown-menu li:first-child a {
        border-radius: 8px 8px 0 0;
      }

      .navbar-dropdown-menu li:last-child a {
        border-radius: 0 0 8px 8px;
      }

      .navbar-dropdown-menu a {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 20px;
        color: var(--txt);
        text-decoration: none;
        font-weight: 600;
        font-size: 0.85rem;
        transition: all 0.15s ease;
        border-left: 3px solid transparent;
      }

      .navbar-dropdown-menu a:hover {
        background: rgba(59, 130, 246, 0.2);
        border-left-color: #3b82f6;
        padding-left: 22px;
        color: #60a5fa;
      }

      /* Mobile Menu Toggle Button */
      .navbar-toggle {
        display: none;
        background: none;
        border: none;
        color: var(--txt);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 8px;
        border-radius: 6px;
        transition: all 0.2s ease;
        margin-left: auto;
        flex-shrink: 0;
      }

      .navbar-toggle:hover {
        background: rgba(59, 130, 246, 0.15);
        color: #60a5fa;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .navbar-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
        }

        .navbar-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--srf);
          border-bottom: 1px solid var(--brd);
          flex-direction: column;
          gap: 0;
          padding: 12px 0;
          border-radius: 0;
          z-index: 997;
        }

        .navbar-menu.active {
          display: flex;
        }

        .navbar-inner {
          flex-wrap: wrap;
          height: auto;
          min-height: 60px;
        }

        .navbar-link {
          width: 100%;
          border-radius: 0;
          padding: 14px 20px;
          border: none;
        }

        .navbar-dropdown-menu {
          position: static;
          display: none;
          border: none;
          box-shadow: none;
          margin: 0;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 0;
          min-width: 100%;
        }

        .navbar-item.active .navbar-dropdown-menu {
          display: flex;
          flex-direction: column;
        }

        .navbar-dropdown-menu a {
          padding-left: 40px;
          width: 100%;
          border-radius: 0;
          border-left: none;
          padding-top: 10px;
          padding-bottom: 10px;
        }

        .navbar-dropdown-menu a:hover {
          padding-left: 40px;
          border-left: none;
        }

        .navbar-item:hover .navbar-dropdown-menu {
          display: none;
        }

        .navbar-brand {
          margin-right: auto;
          margin-bottom: 0;
        }

        .navbar-item {
          width: 100%;
          margin: 0;
        }

        .navbar-item > .navbar-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .dropdown-toggle-icon {
          display: inline-block;
          margin-left: auto;
          transition: transform 0.2s ease;
        }

        .navbar-item.active .dropdown-toggle-icon {
          transform: rotate(180deg);
        }
      }

      @media (max-width: 480px) {
        .navbar-inner {
          padding: 0 10px;
        }

        .navbar-brand {
          font-size: 1rem;
          margin-right: auto;
        }

        .navbar-link {
          padding: 12px 14px;
          font-size: 0.8rem;
        }

        .navbar-dropdown-menu a {
          padding: 10px 20px;
          padding-left: 36px;
          font-size: 0.8rem;
        }
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.id = 'global-navbar-styles';
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }

  // Build Navbar HTML from menuData
  function buildNavbarHTML() {
    let html = `<div id="global-navbar">
      <div class="navbar-inner">
        <div class="navbar-brand">⭐ CleverStudents</div>
        <ul class="navbar-menu">`;

    // Loop through menuData to create dropdowns
    menuData.forEach((dropdown) => {
      html += `
          <li class="navbar-item">
            <a class="navbar-link" href="javascript:void(0);">
              ${dropdown.icon} ${dropdown.name}
            </a>
            <ul class="navbar-dropdown-menu">`;

      // Add links to dropdown
      dropdown.links.forEach((link) => {
        html += `
              <li>
                <a href="${link.href}" onclick="event.stopPropagation();">
                  ➤ ${link.text}
                </a>
              </li>`;
      });

      html += `
            </ul>
          </li>`;
    });

    html += `
        </ul>
        <button class="navbar-toggle" id="navbar-toggle">☰</button>
      </div>
    </div>`;

    return html;
  }

  // Attach Mobile Menu Toggle Handler
  function attachMobileMenuHandlers() {
    const toggle = document.getElementById('navbar-toggle');
    const menu = document.querySelector('.navbar-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', function () {
        menu.classList.remove('active');
      });
    });

    // Toggle dropdown on mobile
    document.querySelectorAll('.navbar-item .navbar-link').forEach((link) => {
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const item = this.closest('.navbar-item');
          const isActive = item.classList.contains('active');

          // Close all other dropdowns
          document.querySelectorAll('.navbar-item').forEach((el) => {
            if (el !== item) el.classList.remove('active');
          });

          // Toggle current dropdown
          item.classList.toggle('active', !isActive);
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('#global-navbar')) {
        menu.classList.remove('active');
        document.querySelectorAll('.navbar-item').forEach((el) => {
          el.classList.remove('active');
        });
      }
    });
  }

  // Main Injection Function
  function injectNavbar() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectNavbar);
      return;
    }

    // Prevent duplicate injection
    if (document.getElementById('global-navbar')) return;

    injectStyles();

    const body = document.body;
    if (!body) {
      console.error('Body element not found');
      return;
    }

    // Insert navbar at the very top of the body
    const navbarHTML = buildNavbarHTML();
    body.insertAdjacentHTML('afterbegin', navbarHTML);

    // Attach event handlers for mobile menu
    attachMobileMenuHandlers();
  }

  // Auto-inject on script load
  injectNavbar();

  // Expose public API for manual control (optional)
  window.GlobalNavbar = {
    refresh: injectNavbar,
    updateMenu: function (newMenuData) {
      window.menuData = newMenuData;
      const navbar = document.getElementById('global-navbar');
      if (navbar) navbar.remove();
      injectNavbar();
    }
  };
})();
