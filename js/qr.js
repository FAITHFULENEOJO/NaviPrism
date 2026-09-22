function initQRGenerator(onSuccessCallback) {
  const form = document.getElementById('qr-form');
  const urlInput = document.getElementById('qr-url');
  const resultContainer = document.getElementById('qr-result-container');
  const qrContainer = document.getElementById('qrcode');
  const downloadBtn = document.getElementById('qr-download-btn');
  const errorElement = document.getElementById('qr-url-error');

  let qrInstance = null;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorElement.textContent = '';

    const rawUrl = urlInput.value.trim();

    // Check for spaces
if (/\s/.test(rawUrl)) {
  errorElement.textContent = 'URLs cannot contain spaces.';
  return;
}

    // Validate URL
    try {
      new URL(rawUrl);
    } catch (_) {
      errorElement.textContent = 'Please enter a valid URL (e.g., https://example.com)';
      return;
    }

    // Clear previous QR code instance
    qrContainer.innerHTML = '';

    // Generate new QR Code using QRCode.js library
    qrInstance = new QRCode(qrContainer, {
      text: rawUrl,
      width: 180,
      height: 180,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });

    resultContainer.hidden = false;

    // Trigger History Save Callback
    if (typeof onSuccessCallback === 'function') {
      onSuccessCallback(rawUrl, 'QR Code');
    }
  });

  // Download QR Code image
  downloadBtn.addEventListener('click', function () {
    // QRCode.js creates a canvas element internally
    const canvas = qrContainer.querySelector('canvas');
    const img = qrContainer.querySelector('img');

    let imageSrc = '';
    if (canvas) {
      imageSrc = canvas.toDataURL('image/png');
    } else if (img) {
      imageSrc = img.src;
    }

    if (!imageSrc) return;

    // Create dynamic anchor to force browser download
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = 'url-kit-qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}