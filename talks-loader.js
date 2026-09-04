// talks-loader.js — fetch talks.json and render the talks list

(function () {
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function render(talks) {
    const container = document.getElementById('talks-list');
    if (!container) return;
    container.innerHTML = '';
    const sortedTalks = [...talks].sort((a, b) => talkTime(b.date) - talkTime(a.date));
    sortedTalks.forEach(t => {
      const li = document.createElement('li');
      li.className = 'talk-item fade-up';
      const typeLabel = t.type === 'public' ? 'Public talk' : 'Academic talk';
      li.innerHTML = `
        <div class="talk-date">${escapeHtml(t.date)}</div>
        <div>
          <div class="talk-type">${escapeHtml(typeLabel)}</div>
          <div class="talk-title">${escapeHtml(t.title)}</div>
          <div class="talk-event">${escapeHtml(t.event)}</div>
          ${t.location ? `<div class="talk-location">${escapeHtml(t.location)}</div>` : ''}
          ${t.videoUrl ? `<a class="talk-video-link" href="${escapeHtml(t.videoUrl)}" target="_blank" rel="noopener">Video</a>` : ''}
        </div>`;
      container.appendChild(li);
    });
  }

  function talkTime(date) {
    const raw = String(date ?? '');
    const year = Number((raw.match(/\d{4}/) || [0])[0]);
    const beforeYear = raw.split(/\d{4}/)[0];
    const months = beforeYear.match(/\d{1,2}/g) || [];
    const month = months.length ? Math.max(...months.map(Number)) : 1;
    return year * 100 + month;
  }

  fetch('talks.json')
    .then(r => r.json())
    .then(render)
    .catch(() => {
      const el = document.getElementById('talks-list');
      if (el) el.innerHTML = '<li style="color:var(--ink-faint);padding:1rem 0">Could not load talks.json.</li>';
    });
})();
