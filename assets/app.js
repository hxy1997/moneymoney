const state = {
  reports: [],
  filtered: [],
  selectedId: null,
  market: 'All',
  year: 'All',
  sort: 'newest',
  query: '',
  fuse: null,
  observer: null
};

const els = {};

document.addEventListener('DOMContentLoaded', init);

async function init() {
  cacheElements();
  bindEvents();
  await loadReports();
}

function cacheElements() {
  els.searchInput = document.getElementById('searchInput');
  els.yearFilter = document.getElementById('yearFilter');
  els.sortSelect = document.getElementById('sortSelect');
  els.marketButtons = Array.from(document.querySelectorAll('[data-market]'));
  els.reportList = document.getElementById('reportList');
  els.reportPlaceholder = document.getElementById('reportPlaceholder');
  els.reportView = document.getElementById('reportView');
  els.reportHeader = document.getElementById('reportHeader');
  els.metricsRow = document.getElementById('metricsRow');
  els.valuationStrip = document.getElementById('valuationStrip');
  els.sectionNav = document.getElementById('sectionNav');
  els.mobileTocToggle = document.getElementById('mobileTocToggle');
  els.mobileTocBackdrop = document.getElementById('mobileTocBackdrop');
  els.mobileTocPanel = document.getElementById('mobileTocPanel');
  els.mobileTocClose = document.getElementById('mobileTocClose');
  els.mobileTocList = document.getElementById('mobileTocList');
  els.reportBody = document.getElementById('reportBody');
}

function bindEvents() {
  els.searchInput.addEventListener('input', (event) => {
    state.query = event.target.value.trim();
    applyFilters();
  });

  els.yearFilter.addEventListener('change', (event) => {
    state.year = event.target.value;
    applyFilters();
  });

  els.sortSelect.addEventListener('change', (event) => {
    state.sort = event.target.value;
    applyFilters();
  });

  els.marketButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.market = button.dataset.market;
      els.marketButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });
      applyFilters();
    });
  });

  window.addEventListener('hashchange', () => {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (id && id !== state.selectedId) {
      selectReport(id);
    }
  });

  els.mobileTocToggle.addEventListener('click', openMobileToc);
  els.mobileTocClose.addEventListener('click', closeMobileToc);
  els.mobileTocBackdrop.addEventListener('click', closeMobileToc);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileToc();
  });
}

async function loadReports() {
  try {
    const response = await fetch('reports.json');
    if (!response.ok) throw new Error(`Unable to load report index: ${response.status}`);
    const reports = await response.json();
    state.reports = reports.map((report) => ({
      ...report,
      id: `${report.market}-${report.ticker}-${report.date}`,
      year: report.date.slice(0, 4)
    }));
    state.fuse = createFuse(state.reports);
    populateYears();
    applyFilters();
    selectInitialReport();
  } catch (error) {
    els.reportList.innerHTML = renderEmptyState('Report index unavailable', error.message);
  }
}

function createFuse(reports) {
  if (!window.Fuse) return null;
  return new Fuse(reports, {
    threshold: 0.32,
    ignoreLocation: true,
    keys: ['ticker', 'company', 'title', 'market', 'industry', 'action', 'summary']
  });
}

function populateYears() {
  const years = Array.from(new Set(state.reports.map((report) => report.year))).sort().reverse();
  els.yearFilter.innerHTML = '<option value="All">All years</option>' +
    years.map((year) => `<option value="${escapeHtml(year)}">${escapeHtml(year)}</option>`).join('');
}

function selectInitialReport() {
  const hashId = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  const initial = state.filtered.find((report) => report.id === hashId) || state.filtered[0];
  if (initial) selectReport(initial.id, { updateHash: Boolean(hashId) });
}

function applyFilters() {
  let result = [...state.reports];

  if (state.query) {
    result = state.fuse
      ? state.fuse.search(state.query).map((entry) => entry.item)
      : result.filter((report) => searchableText(report).includes(state.query.toLowerCase()));
  }

  if (state.market !== 'All') {
    result = result.filter((report) => report.market === state.market);
  }

  if (state.year !== 'All') {
    result = result.filter((report) => report.year === state.year);
  }

  result.sort(sortReports);
  state.filtered = result;
  renderReportList();

  if (state.selectedId && !state.filtered.some((report) => report.id === state.selectedId)) {
    clearSelection();
  }
}

function searchableText(report) {
  return [
    report.ticker,
    report.company,
    report.title,
    report.market,
    report.industry,
    report.action,
    report.summary
  ].join(' ').toLowerCase();
}

function sortReports(a, b) {
  if (state.sort === 'score-desc') return b.score - a.score;
  if (state.sort === 'company-asc') return a.company.localeCompare(b.company, 'en');
  return new Date(b.date) - new Date(a.date);
}

function renderReportList() {
  if (!state.filtered.length) {
    els.reportList.innerHTML = renderEmptyState('No matching reports', 'Adjust search, market, or year filters.');
    return;
  }

  els.reportList.innerHTML = state.filtered.map((report) => {
    const selected = report.id === state.selectedId;
    return `
      <button class="report-item${selected ? ' selected' : ''}" type="button" data-report-id="${escapeHtml(report.id)}" aria-pressed="${selected}">
        <div class="report-item-header">
          <div class="report-item-title">${escapeHtml(report.company)} ${escapeHtml(report.title)}</div>
          <span class="report-item-badge market-${report.market.toLowerCase()}">${escapeHtml(report.market)}</span>
        </div>
        <div class="report-item-meta">
          <span class="report-item-date">${escapeHtml(report.date)}</span>
          <span>${escapeHtml(report.industry)}</span>
        </div>
        <div class="report-item-footer">
          <span class="report-item-score">Score ${formatScore(report.score)}</span>
          <span class="report-item-action ${actionClass(report.action)}">${escapeHtml(report.action)}</span>
        </div>
      </button>
    `;
  }).join('');

  els.reportList.querySelectorAll('[data-report-id]').forEach((button) => {
    button.addEventListener('click', () => selectReport(button.dataset.reportId));
  });
}

function renderEmptyState(title, text) {
  return `
    <div class="empty-state">
      <div class="empty-state-title">${escapeHtml(title)}</div>
      <p class="empty-state-text">${escapeHtml(text)}</p>
    </div>
  `;
}

function clearSelection() {
  state.selectedId = null;
  closeMobileToc();
  els.reportPlaceholder.style.display = 'flex';
  els.reportView.classList.remove('active');
  renderReportList();
}

async function selectReport(id, options = {}) {
  const report = state.reports.find((item) => item.id === id);
  if (!report) return;

  state.selectedId = id;
  if (!options.updateHash) {
    history.replaceState(null, '', `#${encodeURIComponent(id)}`);
  }

  renderReportList();
  els.reportPlaceholder.style.display = 'none';
  els.reportView.classList.add('active');
  renderReportChrome(report);
  renderLoading();

  try {
    const response = await fetch(report.path);
    if (!response.ok) throw new Error(`Unable to load Markdown: ${response.status}`);
    const markdown = await response.text();
    renderMarkdown(markdown);
  } catch (error) {
    renderError(error.message);
  }
}

function renderReportChrome(report) {
  els.reportHeader.innerHTML = `
    <h1 class="report-title">${escapeHtml(report.title)}</h1>
    <div class="report-company">
      ${escapeHtml(report.company)}
      <span class="report-company-ticker">${escapeHtml(report.ticker)}</span>
      <span class="report-company-market">${escapeHtml(report.market)}</span>
    </div>
    <div class="report-company-industry">${escapeHtml(report.industry)} · ${escapeHtml(report.date)}</div>
  `;

  els.metricsRow.innerHTML = `
    ${renderMetric('Score', formatScore(report.score), 'score')}
    ${renderMetric('Action', report.action, actionClass(report.action))}
    ${renderMetric('Current', report.currentValue.label)}
    ${renderMetric('Safety', report.safetyValue.label)}
    ${renderMetric('Intrinsic', report.intrinsicValue.label)}
  `;

  els.valuationStrip.innerHTML = renderValuationStrip(report);
}

function renderMetric(label, value, className = '') {
  return `
    <div class="metric">
      <div class="metric-label">${escapeHtml(label)}</div>
      <div class="metric-value ${escapeHtml(className)}">${escapeHtml(String(value))}</div>
    </div>
  `;
}

function renderValuationStrip(report) {
  const points = [
    { key: 'safety', role: 'Safety', valueLabel: report.safetyValue.label, numeric: report.safetyValue.numeric },
    { key: 'current', role: 'Current', valueLabel: report.currentValue.label, numeric: report.currentValue.numeric },
    { key: 'intrinsic', role: 'Intrinsic', valueLabel: report.intrinsicValue.label, numeric: report.intrinsicValue.numeric }
  ];
  const values = points.map((point) => point.numeric);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const pointMarkup = points.map((point) => {
    const position = 12 + ((point.numeric - min) / range) * 76;
    return `
      <div class="valuation-strip-point ${point.key}" style="left: ${position}%">
        <span class="valuation-strip-label">${escapeHtml(point.role)}</span>
        <span class="valuation-strip-value">${escapeHtml(point.valueLabel)}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="valuation-strip-title">Valuation range</div>
    <div class="valuation-strip-chart">
      <div class="valuation-strip-line" aria-hidden="true"></div>
      ${pointMarkup}
    </div>
    <div class="valuation-strip-legend" aria-label="Valuation labels">
      <span class="valuation-strip-legend-item"><span class="valuation-strip-legend-dot safety"></span> Safety value</span>
      <span class="valuation-strip-legend-item"><span class="valuation-strip-legend-dot current"></span> Current value</span>
      <span class="valuation-strip-legend-item"><span class="valuation-strip-legend-dot intrinsic"></span> Intrinsic value</span>
    </div>
  `;
}

function renderLoading() {
  els.sectionNav.innerHTML = '';
  els.mobileTocList.innerHTML = '';
  els.mobileTocToggle.hidden = true;
  closeMobileToc();
  els.reportBody.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner" aria-hidden="true"></div>
      <div class="loading-text">Loading report</div>
    </div>
  `;
}

function renderError(message) {
  els.reportBody.innerHTML = `
    <div class="error-state">
      <div class="error-state-title">Report unavailable</div>
      <p class="error-state-text">${escapeHtml(message)}</p>
    </div>
  `;
}

function renderMarkdown(markdown) {
  if (!window.marked) {
    renderError('Markdown renderer did not load.');
    return;
  }

  window.marked.setOptions({
    gfm: true,
    breaks: false
  });

  els.reportBody.innerHTML = window.marked.parse(markdown);
  prepareReportBody();
  buildSectionNav();
}

function prepareReportBody() {
  els.reportBody.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (/^https?:\/\//i.test(href)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });

  els.reportBody.querySelectorAll('h2').forEach((heading, index) => {
    heading.id = heading.id || `section-${index}-${slugify(heading.textContent || 'section')}`;
  });
}

function buildSectionNav() {
  const headings = Array.from(els.reportBody.querySelectorAll('h2'));
  const linkMarkup = headings.map((heading, index) => `
    <button class="section-nav-link${index === 0 ? ' active' : ''}" type="button" data-target="${escapeHtml(heading.id)}">
      ${escapeHtml(shortenHeading(heading.textContent || `Section ${index + 1}`))}
    </button>
  `).join('');
  const mobileLinkMarkup = headings.map((heading, index) => `
    <button class="mobile-toc-link${index === 0 ? ' active' : ''}" type="button" data-target="${escapeHtml(heading.id)}">
      ${escapeHtml(shortenHeading(heading.textContent || `Section ${index + 1}`))}
    </button>
  `).join('');

  els.sectionNav.innerHTML = linkMarkup;
  els.mobileTocList.innerHTML = mobileLinkMarkup;
  els.mobileTocToggle.hidden = headings.length === 0;

  [...els.sectionNav.querySelectorAll('[data-target]'), ...els.mobileTocList.querySelectorAll('[data-target]')].forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.target);
      if (target) target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      closeMobileToc();
    });
  });

  setupSectionObserver(headings);
}

function setupSectionObserver(headings) {
  if (state.observer) state.observer.disconnect();
  if (!('IntersectionObserver' in window) || !headings.length) return;

  state.observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;

    [...els.sectionNav.querySelectorAll('.section-nav-link'), ...els.mobileTocList.querySelectorAll('.mobile-toc-link')].forEach((link) => {
      link.classList.toggle('active', link.dataset.target === visible.target.id);
    });
  }, {
    root: null,
    rootMargin: '-130px 0px -65% 0px',
    threshold: [0.1, 0.25, 0.5]
  });

  headings.forEach((heading) => state.observer.observe(heading));
}

function openMobileToc() {
  if (els.mobileTocToggle.hidden) return;
  els.mobileTocBackdrop.hidden = false;
  els.mobileTocPanel.hidden = false;
  requestAnimationFrame(() => {
    els.mobileTocBackdrop.classList.add('open');
    els.mobileTocPanel.classList.add('open');
    els.mobileTocToggle.setAttribute('aria-expanded', 'true');
  });
}

function closeMobileToc() {
  els.mobileTocBackdrop.classList.remove('open');
  els.mobileTocPanel.classList.remove('open');
  els.mobileTocToggle.setAttribute('aria-expanded', 'false');
  window.setTimeout(() => {
    if (!els.mobileTocPanel.classList.contains('open')) {
      els.mobileTocBackdrop.hidden = true;
      els.mobileTocPanel.hidden = true;
    }
  }, prefersReducedMotion() ? 0 : 180);
}

function shortenHeading(text) {
  return text.replace(/^[一二三四五六七八九十]+、/, '').trim();
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'section';
}

function actionClass(action) {
  if (action === '持有') return 'action-hold';
  if (action === '中性') return 'action-neutral';
  if (action === '买入') return 'action-buy';
  if (action === '卖出' || action === '减持') return 'action-sell';
  return '';
}

function formatScore(score) {
  return Number(score).toFixed(score % 1 === 0 ? 0 : 2).replace(/0$/, '').replace(/\.$/, '');
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
