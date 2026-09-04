// nav.js — inject shared navigation and footer into every page

(function () {
  const pages = [
    { href: 'index.html', label: 'About' },
    { href: 'research.html', label: 'Research' },
    { href: 'teaching.html', label: 'Teaching' },
    { href: 'outreach.html', label: 'Outreach' },
  ];

  const current = window.location.pathname.split('/').pop() || 'index.html';

  const navLinks = pages.map(p =>
    `<li><a href="${p.href}" class="${current === p.href || (current === '' && p.href === 'index.html') ? 'active' : ''}">${p.label}</a></li>`
  ).join('');

  const navHTML = `
<nav>
  <div class="nav-inner">
    <a href="index.html" class="nav-brand">
      Niels Linnemann
      <span>Philosopher of Physics</span>
    </a>
    <button class="nav-toggle" aria-label="Menu" onclick="this.nextElementSibling.classList.toggle('open')">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links">${navLinks}</ul>
  </div>
</nav>`;

  const footerHTML = `
<footer>
  <p>Niels Linnemann · University of Geneva ·
     <a href="mailto:niels.linnemann@unige.ch">niels.linnemann@unige.ch</a></p>
  <p style="margin-top:.4rem">
    <a href="imprint.html">Imprint</a> &nbsp;·&nbsp;
    <a href="privacy.html">Privacy Policy</a>
  </p>
</footer>`;

  document.getElementById('nav-placeholder').outerHTML = navHTML;
  document.getElementById('footer-placeholder').outerHTML = footerHTML;
})();
