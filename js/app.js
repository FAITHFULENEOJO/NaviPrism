document.addEventListener('DOMContentLoaded', function () {
  // Initialize Local Storage History UI
  initHistorySystem();

  // Initialize UTM Builder with History Callback
  initUTMBuilder(function (generatedUrl, type) {
    addHistoryItem(generatedUrl, type);
  });

  // Initialize QR Generator with History Callback
  initQRGenerator(function (url, type) {
    addHistoryItem(url, type);
  });
});