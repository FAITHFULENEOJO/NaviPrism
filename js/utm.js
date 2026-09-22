function initUTMBuilder(onSuccessCallback) {
  const form = document.getElementById('utm-form');
  const urlInput = document.getElementById('utm-url');
  const sourceInput = document.getElementById('utm-source');
  const mediumInput = document.getElementById('utm-medium');
  const nameInput = document.getElementById('utm-name');
  const termInput = document.getElementById('utm-term');
  const contentInput = document.getElementById('utm-content');
  const resetBtn = document.getElementById('utm-reset-btn');
  
  const resultContainer = document.getElementById('utm-result-container');
  const resultInput = document.getElementById('utm-result-input');
  const copyBtn = document.getElementById('utm-copy-btn');
  const copyFeedback = document.getElementById('utm-copy-feedback');

  // Form submission handler
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearUTMErrors();

    const rawUrl = urlInput.value.trim();
    const source = sourceInput.value.trim();
    const medium = mediumInput.value.trim();
    const name = nameInput.value.trim();
    const term = termInput.value.trim();
    const content = contentInput.value.trim();

    let isValid = true;

    // Validate URL syntax
    let parsedUrl;
if (/\s/.test(rawUrl)) {
  showUTMError('utm-url-error', 'URLs cannot contain spaces.');
  isValid = false;
} else {
  try {
    parsedUrl = new URL(rawUrl);
  } catch (_) {
    showUTMError('utm-url-error', 'Please enter a valid URL (e.g., https://example.com)');
    isValid = false;
  }
}

    // Validate required text fields
    if (!source) {
      showUTMError('utm-source-error', 'Campaign source is required');
      isValid = false;
    }
    if (!medium) {
      showUTMError('utm-medium-error', 'Campaign medium is required');
      isValid = false;
    }
    if (!name) {
      showUTMError('utm-name-error', 'Campaign name is required');
      isValid = false;
    }

    if (!isValid) return;

    // Construct URL parameters using URLSearchParams API
    const params = parsedUrl.searchParams;
    params.set('utm_source', source);
    params.set('utm_medium', medium);
    params.set('utm_campaign', name);

    if (term) params.set('utm_term', term);
    if (content) params.set('utm_content', content);

    const generatedURL = parsedUrl.toString();

    // Display Result
    resultInput.value = generatedURL;
    resultContainer.hidden = false;

    // Trigger History Save Callback
    if (typeof onSuccessCallback === 'function') {
      onSuccessCallback(generatedURL, 'UTM');
    }
  });

  // Copy functionality via Clipboard API
  copyBtn.addEventListener('click', function () {
    if (!resultInput.value) return;
    
    navigator.clipboard.writeText(resultInput.value).then(() => {
      copyFeedback.hidden = false;
      setTimeout(() => copyFeedback.hidden = true, 2000);
    });
  });

  // Clear Form
  resetBtn.addEventListener('click', function () {
    form.reset();
    clearUTMErrors();
    resultContainer.container.hidden = true;
    resultInput.value = '';
  });
}

function showUTMError(elementId, message) {
  document.getElementById(elementId).textContent = message;
}

function clearUTMErrors() {
  document.querySelectorAll('#utm-section .error-msg').forEach(el => el.textContent = '');
}