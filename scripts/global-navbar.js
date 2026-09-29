/* ================================
   GLOBAL NAVBAR SCRIPT - v4.0 (ULTIMATE FIX)
   - FIXED: Delayed Loading / Click Dead Zones Bug removed
   - FIXED: Event Delegation used for guaranteed clickability
   - FIXED: Stable positioning and optimized z-index
   ================================ */

const menuData = [
  {
    title: "Academics",
    links: [
      { name: "1st to 10th Class", url: "/panels/Class-1-To-10th-student-vercel.html" },
      { name: "11th to Degree", url: "#" }
    ]
  },
  {
    title: "Practice & Games",
    links: [
      { 
        name: "Brain Games", url: "https://www.cleverstudents.in/panels/PRO-Brain-Games.html",
        subLinks: [
          { name: "Math Puzzles", url: "#" },
          { name: "Memory Match", url: "#" }
        ] 
      },
      { name: "Comming Soon", url: "#" }
    ]
  },
  {
    title: "IIT Academy",
    links: [
      { name: "IIT Foundation (1st to 10th)", url: "#" },
      { name: "IIT JEE (11th to 12th)", url: "#" }
    ]
  },
  {
    title: "Development Skills",
    links: [
      { name: "IQ Knowledge Development", url: "https://www.cleverstudents.in/panels/Idea-Lab-Student.html" },
      { name: "Logic Skills", url: "#" },
      { name: "General Skill Development", url: "#" }
    ]
  },
     {
    title: "All Competations",
    links: [
      { name: "APPSC", url: "https://www.cleverstudents.in/panels/APSPSC-Student.html" },
      { name: "SSC", url: "https://www.cleverstudents.in/panels/SSC-Mastery-Student.html" },
      { name: "RRB", url: "https://www.cleverstudents.in/panels/APSPSC-Student.html" }
    ]
  }
];

(function() {
  "use strict";

  function injectStyles() {
    if (document.getElementById('global-navbar-styles')) return;

    const styles = `
      #global-navbar {
        background: var(--srf, #161b27);
        border-bottom: 1px solid var(--brd, rgba(255,255,255,0.1));
        padding: 0;
        position: fixed;
        top: 0; left: 0; right: 0;
        width: 100%;
        z-index: 999999;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
      }
      body.light-mode #global-navbar {
        background: #fff;
        border-bottom: 1px solid rgba(0,0,0,0.1);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      }
      body { padding-top: 60px !important; }

      .navbar-inner {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        padding: 0 15px;
        height: 60px;
      }
      .navbar-brand {
        font-family: 'Fredoka One', cursive, sans-serif;
        font-size: 1.3rem;
        background: linear-gradient(135deg, #f59e0b, #ef4444);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 900;
        margin-right: 40px;
        white-space: nowrap;
      }
      .navbar-menu {
        display: flex;
        list-style: none;
        margin: 0; padding: 0;
        flex: 1;
        gap: 5px;
      }
      .navbar-item { position: relative; }
      
      .navbar-link {
        display: flex;
        align-items: center;
        padding: 12px 18px;
        color: var(--txt, #e2e8f0);
        text-decoration: none;
        font-weight: 700;
        font-size: 0.95rem;
        border-radius: 6px;
        transition: 0.2s;
        cursor: pointer;
      }
      body.light-mode .navbar-link { color: #0f172a; }
      
      .navbar-link:hover {
        background: rgba(59, 130, 246, 0.15);
        color: #3b82f6;
      }

      /* Dropdown Menus */
      .navbar-dropdown-menu {
        position: absolute;
        top: 100%; left: 0;
        background: var(--srf, #161b27);
        border: 1px solid var(--brd, rgba(255,255,255,0.1));
        border-radius: 8px;
        min-width: 240px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        opacity: 0;
        visibility: hidden;
        transform: translateY(10px);
        transition: all 0.2s ease;
        padding: 5px 0;
      }
      body.light-mode .navbar-dropdown-menu { background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
      
      .navbar-item:hover > .navbar-dropdown-menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
      
      .navbar-dropdown-menu a {
        display: block;
        padding: 12px 20px;
        color: var(--txt, #e2e8f0);
        text-decoration: none;
        font-weight: 600;
        font-size: 0.9rem;
        transition: 0.2s;
      }
      body.light-mode .navbar-dropdown-menu a { color: #0f172a; }
      
      .navbar-dropdown-menu a:hover {
        background: rgba(59, 130, 246, 0.1);
        padding-left: 26px;
        color: #3b82f6;
      }

      /* Mobile Toggle */
      .navbar-toggle {
        display: none;
        background: none; border: none;
        color: var(--txt, #fff);
        font-size: 1.8rem;
        cursor: pointer;
        margin-left: auto;
      }
      body.light-mode .navbar-toggle { color: #000; }

      /* Mobile Responsiveness */
      @media (max-width: 768px) {
        .navbar-toggle { display: block; }
        .navbar-menu {
          position: fixed;
          top: 60px; left: 0; right: 0;
          background: var(--srf, #161b27);
          flex-direction: column;
          border-bottom: 1px solid var(--brd, rgba(255,255,255,0.1));
          max-height: calc(100vh - 60px);
          overflow-y: auto;
          display: none;
          box-shadow: 0 10px 20px rgba(0,0,0,0.5);
        }
        body.light-mode .navbar-menu { background: #fff; }
        .navbar-menu.active { display: flex; }
        
        .navbar-item { width: 100%; }
        .navbar-link { padding: 15px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        body.light-mode .navbar-link { border-bottom: 1px solid rgba(0,0,0,0.05); }
        
        .navbar-dropdown-menu {
          position: static;
          visibility: visible;
          opacity: 1;
          transform: none;
          box-shadow: none;
          border: none;
          background: rgba(0,0,0,0.2);
          display: none;
        }
        body.light-mode .navbar-dropdown-menu { background: rgba(0,0,0,0.03); }
        
        .navbar-item.mobile-open > .navbar-dropdown-menu { display: block; }
        .navbar-dropdown-menu a { padding-left: 35px; }
      }
    `;
    const styleEl = document.createElement('style');
    styleEl.id = 'global-navbar-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
  }

  function buildHTML() {
    let html = `<div id="global-navbar">
      <div class="navbar-inner">
        <div class="navbar-brand">⭐ CleverStudents</div>
        <button class="navbar-toggle" id="navbar-toggle">☰</button>
        <ul class="navbar-menu" id="navbar-menu">`;

    menuData.forEach((dropdown) => {
      html += `
        <li class="navbar-item">
          <a class="navbar-link toggle-btn" href="javascript:void(0);">${dropdown.title}</a>
          <ul class="navbar-dropdown-menu">`;
      dropdown.links.forEach((link) => {
        html += `<li><a href="${link.url}">${link.name}</a></li>`;
      });
      html += `</ul></li>`;
    });
    html += `</ul></div></div>`;
    return html;
  }

  // Guaranteed Event Binding (Event Delegation)
  function attachSafeHandlers() {
    // Mobile menu open/close
    document.addEventListener('click', function(e) {
      const toggleBtn = e.target.closest('#navbar-toggle');
      const menu = document.getElementById('navbar-menu');
      
      if (toggleBtn && menu) {
        menu.classList.toggle('active');
        return;
      }

      // Handle mobile dropdown opening
      const navToggle = e.target.closest('.toggle-btn');
      if (navToggle && window.innerWidth <= 768) {
        e.preventDefault();
        const parentLi = navToggle.closest('.navbar-item');
        // Close others
        document.querySelectorAll('.navbar-item.mobile-open').forEach(el => {
          if (el !== parentLi) el.classList.remove('mobile-open');
        });
        // Toggle clicked
        parentLi.classList.toggle('mobile-open');
      }
    });
  }

  // Force immediate injection without waiting for slow scripts
  function init() {
    if (document.getElementById('global-navbar')) return;
    injectStyles();
    document.body.insertAdjacentHTML('afterbegin', buildHTML());
    attachSafeHandlers();
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
