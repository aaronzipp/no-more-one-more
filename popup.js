document.addEventListener('DOMContentLoaded', function() {
  const countdownInput = document.getElementById('countdown');
  const saveButton = document.getElementById('save');
  const statusDiv = document.getElementById('status');

  // Load saved countdown value
  chrome.storage.sync.get(['countdownSeconds'], function(result) {
    if (result.countdownSeconds) {
      countdownInput.value = result.countdownSeconds;
    }
  });

  saveButton.addEventListener('click', function() {
    const countdownValue = parseInt(countdownInput.value);

    if (countdownValue < 1 || countdownValue > 300) {
      showStatus('Please enter a value between 1 and 300 seconds', 'error');
      return;
    }

    chrome.storage.sync.set({
      countdownSeconds: countdownValue
    }, function() {
      if (chrome.runtime.lastError) {
        showStatus('Error saving settings: ' + chrome.runtime.lastError.message, 'error');
      } else {
        showStatus('Settings saved successfully!', 'success');
      }
    });
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;
    statusDiv.style.display = 'block';

    setTimeout(function() {
      statusDiv.style.display = 'none';
    }, 3000);
  }
});
