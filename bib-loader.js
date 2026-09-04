// bib-loader.js — parse publications.bib and render as expandable cards

(function () {

  /* ── BibTeX parser ─────────────────────────────────────────────── */
  function parseBib(text) {
    const entries = [];
    text = text.replace(/%.*/g, '');
    const entryRe = /@(\w+)\s*\{\s*([^,]+),\s*([\s\S]*?)\}\s*(?=@|$)/g;
    let m;
    while ((m = entryRe.exec(text)) !== null) {
      const type = m[1].toLowerCase();
      const key  = m[2].trim();
      const body = m[3];
      const fields = {};
      const fieldRe = /(\w+)\s*=\s*[{"]([\s\S]*?)[}"]\s*(?=[,\n]|$)/g;
      let f;
      while ((f = fieldRe.exec(body)) !== null) {
        fields[f[1].toLowerCase()] = f[2].trim().replace(/\s+/g, ' ');
      }
      entries.push({ type, key, ...fields });
    }
    return entries;
  }

  function formatAuthors(raw) {
    if (!raw) return '';
    // Bold "Linnemann" wherever it appears
    return raw.split(' and ').map(a => {
      const parts = a.trim().split(',');
      const name = parts.length === 2
        ? `${parts[1].trim()} ${parts[0].trim()}`
        : a.trim();
      return name.includes('Linnemann')
        ? `<strong>${name}</strong>`
        : name;
    }).join(', ');
  }

  function typeLabel(e) {
    if (e.pubtype) return e.pubtype;
    const map = { book: 'Book', article: 'Journal Article', incollection: 'Book Chapter', misc: 'Other' };
    return map[e.type] || e.type;
  }

  function pubNumberValue(pubnum) {
    if (!pubnum) return [99, -1];
    const [group, item] = pubnum.split('.').map(n => parseInt(n, 10));
    return [Number.isFinite(group) ? group : 99, Number.isFinite(item) ? item : -1];
  }

  function compareBySourceNumber(a, b) {
    const [ag, ai] = pubNumberValue(a.pubnum);
    const [bg, bi] = pubNumberValue(b.pubnum);
    if (ag !== bg) return ag - bg;
    if (ai !== bi) return bi - ai;
    return (parseInt(b.year) || 0) - (parseInt(a.year) || 0);
  }

  /* ── Icon SVGs ─────────────────────────────────────────────────── */
  const ICON_PAPER = `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2h8l2 2v10H3z"/><path d="M10 2v3h3"/><path d="M6 7h5M6 10h3"/></svg>`;
  const ICON_PREPRINT = `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/></svg>`;
  const ICON_EXT = `<svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3H3v10h10V9"/><path d="M10 2h4v4"/><path d="M13 2l-7 7"/></svg>`;

  /* ── Render ────────────────────────────────────────────────────── */
  function renderPubs(entries) {
    const container = document.getElementById('pub-list');
    if (!container) return;

    entries.sort(compareBySourceNumber);
    container.innerHTML = '';

    entries.forEach((e, idx) => {
      const label    = typeLabel(e);
      const venue    = e.journal || e.booktitle || e.series || e.publisher || '';
      const note     = e.note ? ` <span class="pub-note">${e.note}</span>` : '';
      const hasLinks = e.paperurl || e.preprint;
      const id       = `pub-${idx}`;

      const li = document.createElement('li');
      li.className = 'pub-card fade-up';
      li.dataset.type = label;

      li.innerHTML = `
        <div class="pub-card-main" onclick="document.getElementById('${id}').classList.toggle('open'); this.closest('.pub-card').classList.toggle('expanded')" role="button" tabindex="0" aria-expanded="false">
          <div class="pub-card-year">${e.pubnum || e.year || '—'}</div>
          <div class="pub-card-body">
            <div class="pub-card-title">${e.title}</div>
            <div class="pub-card-authors">${formatAuthors(e.author)}</div>
            ${venue ? `<div class="pub-card-venue">${venue}${note}</div>` : ''}
            <div class="pub-card-meta">
              <span class="pub-type-tag">${label}</span>
              ${hasLinks ? `<span class="pub-card-hint">Links ↓</span>` : ''}
            </div>
          </div>
          ${hasLinks ? `<div class="pub-card-chevron">⌄</div>` : ''}
        </div>

        <div class="pub-card-links" id="${id}">
          <div class="pub-links-inner">
            ${e.paperurl ? `<a class="pub-link-card" href="${e.paperurl}" target="_blank" rel="noopener">${ICON_PAPER} Published paper ${ICON_EXT}</a>` : ''}
            ${e.preprint ? `<a class="pub-link-card pub-link-preprint" href="${e.preprint}" target="_blank" rel="noopener">${ICON_PREPRINT} Preprint ${ICON_EXT}</a>` : ''}
          </div>
        </div>`;

      container.appendChild(li);
    });

    // keyboard support
    container.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const main = e.target.closest('.pub-card-main');
        if (main) { e.preventDefault(); main.click(); }
      }
    });
  }

  /* ── Filters ───────────────────────────────────────────────────── */
  function initFilters(entries) {
    const bar = document.getElementById('pub-filters');
    if (!bar) return;
    const types = ['All', ...new Set(entries.map(typeLabel))];
    bar.innerHTML = types.map(t =>
      `<button class="pub-filter${t === 'All' ? ' active' : ''}" data-type="${t}">${t}</button>`
    ).join('');

    bar.addEventListener('click', ev => {
      const btn = ev.target.closest('.pub-filter');
      if (!btn) return;
      bar.querySelectorAll('.pub-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const chosen = btn.dataset.type;
      document.querySelectorAll('.pub-card').forEach(li => {
        li.style.display = (chosen === 'All' || li.dataset.type === chosen) ? '' : 'none';
      });
    });
  }

  /* ── Load ──────────────────────────────────────────────────────── */
  fetch('publications.bib')
    .then(r => r.text())
    .then(text => {
      const entries = parseBib(text);
      renderPubs(entries);
      initFilters(entries);
    })
    .catch(() => {
      const el = document.getElementById('pub-list');
      if (el) el.innerHTML = '<li style="color:var(--ink-soft);padding:1rem 0;font-family:var(--font-ui)">Could not load publications.bib — make sure the file is in the same folder.</li>';
    });
})();
