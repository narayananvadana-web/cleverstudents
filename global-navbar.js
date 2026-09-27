/* ================================
   GLOBAL NAVBAR SCRIPT - v3.2 (WORKING FIX - Mobile Links Now Navigate)
   - FIXED: Event propagation handled correctly
   - FIXED: Direct links navigate immediately
   - FIXED: Dropdown toggles work on tap
   - Fixed z-index/overlap bug
   - Added nested sub-menus support
   - Auto-injects responsive navbar at top of <body>
   ================================ */

// ============================================
// MENU DATA - EDIT THIS SECTION FREELY!
// Support for nested sub-menus via subLinks
// ============================================
const menuData = [
  {
    title: "Academics",
    links: [
      { name: "1st to 10th Class", url: "/panels/Class-1-To-10th-student-vercel.html" },
      { name: "11th to Degree", url: "/panels/11-degree.html" }
    ]
  },
  {
    title: "Practice & Games",
    links: [
      { 
        name: "Brain Games", 
        url: "#",
        subLinks: [
          { name: "Math Puzzles", url: "/games/math-puzzles.html" },
          { name: "Memory Match", url: "/games/memory-match.html" }
        ] 
      },
      { name: "Self-Assessment Exam 1", url: "/exams/exam-1.html" },
      { name: "Self-Assessment Exam 2", url: "/exams/exam-2.html" }
    ]
  },
  {
    title: "IIT Academy",
    links: [
      { name: "IIT Foundation (1st to 10th)", url: "/iit/foundation.html" },
      { name: "IIT JEE (11th to 12th)", url: "/iit/jee.html" }
    ]
  },
  {
    title: "Development Skills",
    links: [
      { name: "IQ Knowledge Development", url: "/skills/iq.html" },
      { name: "Logic Skills", url: "/skills/logic.html" },
      { name: "General Skill Development", url: "/skills/general.html" }
    ]
  }
];

// ============================================
// NAVBAR HTML & CSS INJECTION
// ============================================

(function() {
  "use strict";

  // Inject CSS Styles
  function injectStyles() {
    if (document.getElementById('global-navbar-styles')) return;

    const styles = `
      /* Global Navbar Styles */
      #global-navbar {
        background: var(--srf);
        border-bottom: 1px solid var(--brd);
        padding: 0;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        z-index: 999999;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
      }

      body.light-mode #global-navbar {
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      }

      body {
        padding-top: 60px !important;
      }

      .navbar-inner {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        padding: 0 15px;
        height: 60px;
        gap: 0;
        position: relative;
        z-index: 999999;
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
        cursor: pointer;
        position: relative;
        z-index: 999999;
        pointer-events: auto;
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
        position: relative;
        z-index: 999999;
      }

      .navbar-item {
        position: relative;
        z-index: 999999;
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
        background: transparent;
        position: relative;
        z-index: 999999;
        pointer-events: auto;
        user-select: none;
        -webkit-user-select: none;
      }

      .navbar-link:hover {
        background: rgba(59, 130, 246, 0.15);
        border-color: #3b82f6;
        color: #60a5fa;
        pointer-events: auto;
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
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
        z-index: 999999;
        animation: slideDown 0.2s ease;
        pointer-events: auto;
      }

      body.light-mode .navbar-dropdown-menu {
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
      }

      .navbar-item:hover > .navbar-dropdown-menu {
        display: block;
        pointer-events: auto;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-8px);
          pointer-events: none;
        }
        to {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
      }

      .navbar-dropdown-menu li {
        list-style: none;
        margin: 0;
        padding: 0;
        position: relative;
        z-index: 999999;
      }

      .navbar-dropdown-menu li:first-child a {
        border-radius: 8px 8px 0 0;
      }

      .navbar-dropdown-menu li:last-child > a {
        border-radius: 0 0 8px 8px;
      }

      .navbar-dropdown-menu a {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 12px 20px;
        color: var(--txt);
        text-decoration: none;
        font-weight: 600;
        font-size: 0.85rem;
        transition: all 0.15s ease;
        border-left: 3px solid transparent;
        cursor: pointer;
        position: relative;
        z-index: 999999;
        pointer-events: auto;
        user-select: none;
        -webkit-user-select: none;
        background: transparent;
        border: none;
      }

      .navbar-dropdown-menu a:hover {
        background: rgba(59, 130, 246, 0.2);
        border-left-color: #3b82f6;
        padding-left: 22px;
        color: #60a5fa;
        pointer-events: auto;
      }

      /* NESTED SUB-MENU STYLES */
      .navbar-submenu {
        display: none;
        position: absolute;
        top: 0;
        left: 100%;
        background: var(--srf);
        border: 1px solid var(--brd);
        border-radius: 8px;
        margin-left: 8px;
        min-width: 220px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
        z-index: 999999;
        animation: slideRight 0.2s ease;
        pointer-events: auto;
      }

      body.light-mode .navbar-submenu {
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
      }

      @keyframes slideRight {
        from {
          opacity: 0;
          transform: translateX(-8px);
          pointer-events: none;
        }
        to {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
        }
      }

      .navbar-dropdown-menu li:hover > .navbar-submenu {
        display: block;
        pointer-events: auto;
      }

      .navbar-submenu li {
        list-style: none;
        margin: 0;
        padding: 0;
        position: relative;
        z-index: 999999;
      }

      .navbar-submenu li:first-child a {
        border-radius: 8px 8px 0 0;
      }

      .navbar-submenu li:last-child a {
        border-radius: 0 0 8px 8px;
      }

      .navbar-submenu a {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        color: var(--txt);
        text-decoration: none;
        font-weight: 500;
        font-size: 0.8rem;
        transition: all 0.15s ease;
        border-left: 3px solid transparent;
        cursor: pointer;
        position: relative;
        z-index: 999999;
        pointer-events: auto;
        user-select: none;
        -webkit-user-select: none;
        background: transparent;
        border: none;
      }

      .navbar-submenu a:hover {
        background: rgba(59, 130, 246, 0.2);
        border-left-color: #3b82f6;
        padding-left: 18px;
        color: #60a5fa;
        pointer-events: auto;
      }

      /* Indicator for items with sub-menus */
      .has-submenu::after {
        content: "›";
        font-size: 1.2rem;
        margin-left: auto;
        color: var(--mut);
        transition: all 0.2s ease;
      }

      .navbar-dropdown-menu li:hover .has-submenu::after {
        color: #60a5fa;
        transform: translateX(3px);
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
        z-index: 999999;
        pointer-events: auto;
      }

      .navbar-toggle:hover {
        background: rgba(59, 130, 246, 0.15);
        color: #60a5fa;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        body {
          padding-top: 60px !important;
        }

        #global-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 999999;
        }

        .navbar-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
          z-index: 999999;
          pointer-events: auto;
        }

        .navbar-menu {
          display: none;
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          background: var(--srf);
          border-bottom: 1px solid var(--brd);
          flex-direction: column;
          gap: 0;
          padding: 0;
          border-radius: 0;
          z-index: 999998;
          max-height: calc(100vh - 60px);
          overflow-y: auto;
          pointer-events: auto;
        }

        .navbar-menu.active {
          display: flex;
          pointer-events: auto;
        }

        .navbar-inner {
          flex-wrap: nowrap;
          height: 60px;
          z-index: 999999;
        }

        .navbar-link {
          width: 100%;
          border-radius: 0;
          padding: 14px 20px;
          border: none;
          z-index: 999999;
          pointer-events: auto;
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
          z-index: 999998;
          pointer-events: auto;
        }

        .navbar-item.active .navbar-dropdown-menu {
          display: flex;
          flex-direction: column;
          pointer-events: auto;
        }

        .navbar-dropdown-menu a {
          padding-left: 40px;
          width: 100%;
          border-radius: 0;
          border-left: none;
          padding-top: 10px;
          padding-bottom: 10px;
          z-index: 999998;
          pointer-events: auto;
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
          z-index: 999999;
        }

        .navbar-item {
          width: 100%;
          margin: 0;
          z-index: 999998;
        }

        .navbar-item > .navbar-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          z-index: 999999;
          pointer-events: auto;
        }

        .dropdown-toggle-icon {
          display: inline-block;
          margin-left: auto;
          transition: transform 0.2s ease;
          z-index: 999999;
          pointer-events: auto;
        }

        .navbar-item.active .dropdown-toggle-icon {
          transform: rotate(180deg);
        }

        /* Mobile submenu handling */
        .navbar-submenu {
          position: static;
          display: none;
          border: none;
          box-shadow: none;
          margin: 0;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 0;
          min-width: 100%;
          z-index: 999997;
          pointer-events: auto;
        }

        .navbar-item.active .navbar-item.active .navbar-submenu {
          display: flex;
          flex-direction: column;
          pointer-events: auto;
        }

        .navbar-submenu a {
          padding-left: 50px;
          width: 100%;
          border-radius: 0;
          border-left: none;
          padding-top: 8px;
          padding-bottom: 8px;
          z-index: 999997;
          pointer-events: auto;
        }

        .navbar-submenu a:hover {
          padding-left: 50px;
          border-left: none;
        }

        .has-submenu::after {
          content: "›";
          font-size: 1rem;
          margin-left: auto;
          color: var(--mut);
          transition: all 0.2s ease;
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

        .navbar-submenu a {
          padding-left: 46px;
          padding-top: 8px;
          padding-bottom: 8px;
          font-size: 0.75rem;
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

    menuData.forEach((dropdown) => {
      html += `
          <li class="navbar-item">
            <a class="navbar-link navbar-category-link" href="javascript:void(0);">
              ${dropdown.title}
            </a>
            <ul class="navbar-dropdown-menu">`;

      dropdown.links.forEach((link) => {
        const hasSubLinks = link.subLinks && link.subLinks.length > 0;
        const subMenuClass = hasSubLinks ? 'has-submenu navbar-has-submenu' : '';
        
        html += `
              <li class="navbar-item">
                <a class="navbar-link ${subMenuClass}" href="${link.url}">
                  ${link.name}
                </a>`;

        if (hasSubLinks) {
          html += `
                <ul class="navbar-submenu">`;
          
          link.subLinks.forEach((subLink) => {
            html += `
                  <li class="navbar-item">
                    <a href="${subLink.url}">
                      ${subLink.name}
                    </a>
                  </li>`;
          });

          html += `
                </ul>`;
        }

        html += `
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

    // Hamburger menu toggle
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('#global-navbar')) {
        menu.classList.remove('active');
        document.querySelectorAll('.navbar-item.active').forEach((el) => {
          el.classList.remove('active');
        });
      }
    });

    // ============================================
    // Handle CATEGORY LINKS (Academics, Practice & Games, etc)
    // These should toggle dropdowns on mobile
    // ============================================
    document.querySelectorAll('.navbar-category-link').forEach((link) => {
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          
          const item = this.closest('.navbar-item');
          const isActive = item.classList.contains('active');

          // Close all other open dropdowns
          const parentMenu = item.parentElement;
          parentMenu.querySelectorAll('.navbar-item.active').forEach((el) => {
            if (el !== item) {
              el.classList.remove('active');
            }
          });

          // Toggle this dropdown
          item.classList.toggle('active', !isActive);
        }
      });
    });

    // ============================================
    // Handle DROPDOWN ITEM CLICKS (1st to 10th Class, etc)
    // If has submenu = toggle it. If no submenu = NAVIGATE IMMEDIATELY
    // ============================================
    document.querySelectorAll('.navbar-dropdown-menu li > a').forEach((link) => {
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          const parentItem = this.closest('li');
          const hasSubmenu = this.classList.contains('navbar-has-submenu');
          
          if (hasSubmenu) {
            // Has submenu = toggle it
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = parentItem.classList.contains('active');

            // Close other open submenus
            parentItem.parentElement.querySelectorAll('.navbar-item.active').forEach((el) => {
              if (el !== parentItem) {
                el.classList.remove('active');
              }
            });

            parentItem.classList.toggle('active', !isActive);
          } else {
            // NO submenu = this is a direct link, let it navigate!
            // Stop propagation to prevent parent handlers
            e.stopPropagation();
            
            // Close the menu after a short delay to allow navigation
            setTimeout(() => {
              menu.classList.remove('active');
              document.querySelectorAll('.navbar-item.active').forEach((el) => {
                el.classList.remove('active');
              });
            }, 50);
            
            // Allow default navigation to happen
            return true;
          }
        }
      });
    });

    // ============================================
    // Handle NESTED SUBMENU LINKS
    // These are always direct navigation links
    // ============================================
    document.querySelectorAll('.navbar-submenu li > a').forEach((link) => {
      link.addEventListener('click', function (e) {
        e.stopPropagation();
        
        if (window.innerWidth <= 768) {
          // Close menu on mobile after link click
          setTimeout(() => {
            menu.classList.remove('active');
            document.querySelectorAll('.navbar-item.active').forEach((el) => {
              el.classList.remove('active');
            });
          }, 50);
        }
      });
    });
  }

  // Main Injection Function
  function injectNavbar() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectNavbar);
      return;
    }

    if (document.getElementById('global-navbar')) return;

    injectStyles();

    const body = document.body;
    if (!body) {
      console.error('Body element not found');
      return;
    }

    const navbarHTML = buildNavbarHTML();
    body.insertAdjacentHTML('afterbegin', navbarHTML);

    attachMobileMenuHandlers();
  }

  // Auto-inject on script load
  injectNavbar();

  // Public API
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
