const STORAGE_KEY = 'url_kit_history';

function getHistory() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveHistory(historyArray) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(historyArray));
}

function addHistoryItem(url, type) {
  const history = getHistory();

  const newItem = {
    id: Date.now().toString(),
    url: url,
    type: type,
    createdAt: new Date().toLocaleString()
  };

  // Add new item to front of array and cap to max 10 items
  const updatedHistory = [newItem, ...history].slice(0, 10);
  saveHistory(updatedHistory);
  renderHistoryUI();
}

function deleteHistoryItem(id) {
  const history = getHistory();
  const filtered = history.filter(item => item.id !== id);
  saveHistory(filtered);
  renderHistoryUI();
}

function clearAllHistory() {
  localStorage.removeItem(STORAGE_KEY);
  renderHistoryUI();
}

function renderHistoryUI() {
  const historyList = document.getElementById('history-list');
  const history = getHistory();

  historyList.innerHTML = '';

  if (history.length === 0) {
    historyList.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">No recent activity saved.</p>';
    return;
  }

  history.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'history-item';

    itemEl.innerHTML = `
      <div class="history-info">
        <span class="history-type">${escapeHTML(item.type)}</span>
        <span class="history-url" title="${escapeHTML(item.url)}">${escapeHTML(item.url)}</span>
        <span class="history-date">${escapeHTML(item.createdAt)}</span>
      </div>
      <div class="history-actions">
        <button class="btn btn-secondary btn-small copy-hist-btn" data-url="${escapeHTML(item.url)}">Copy</button>
        <button class="btn btn-danger btn-small delete-hist-btn" data-id="${item.id}">Delete</button>
      </div>
    `;

    historyList.appendChild(itemEl);
  });

  // Attach Event Listeners for Dynamic Buttons
  document.querySelectorAll('.copy-hist-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const targetUrl = this.getAttribute('data-url');
      navigator.clipboard.writeText(targetUrl).then(() => {
        const originalText = this.textContent;
        this.textContent = 'Copied!';
        setTimeout(() => this.textContent = originalText, 1500);
      });
    });
  });

  document.querySelectorAll('.delete-hist-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      deleteHistoryItem(id);
    });
  });
}

function initHistorySystem() {
  const clearBtn = document.getElementById('clear-history-btn');
  clearBtn.addEventListener('click', function () {
    if (confirm('Are you sure you want to clear all history?')) {
      clearAllHistory();
    }
  });

  // Initial load render from LocalStorage
  renderHistoryUI();
}

// Security Helper to prevent HTML Injection
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}