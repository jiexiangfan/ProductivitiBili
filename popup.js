document.addEventListener("DOMContentLoaded", function () {
  var recommendedRadios = document.querySelectorAll(
    'input[name="recommended"]'
  );
  var commentsRadios = document.querySelectorAll('input[name="comments"]');
  var danmakuRadios = document.querySelectorAll('input[name="danmaku"]');

  // Load the saved settings
  chrome.storage.sync.get(["settings"], function (result) {
    var settings = result.settings || {};

    // Set the initial radio button states based on the saved settings
    var sections = ["recommended", "comments", "danmaku"];
    sections.forEach(function (section) {
      var selectedOption = settings[section] || "show";
      document.querySelector(
        'input[name="' + section + '"][value="' + selectedOption + '"]'
      ).checked = true;
    });
  });

  // Listen for changes on the radio buttons, save the settings, and send a message to the content script
  recommendedRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      saveAndApplySettings();
    });
  });

  commentsRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      saveAndApplySettings();
    });
  });

  danmakuRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      saveAndApplySettings();
    });
  });

  function saveAndApplySettings() {
    var settings = {
      recommended: document.querySelector('input[name="recommended"]:checked')
        .value,
      comments: document.querySelector('input[name="comments"]:checked').value,
      danmaku: document.querySelector('input[name="danmaku"]:checked').value,
    };

    // Save the settings
    chrome.storage.sync.set({ settings: settings }, function () {
      console.log("Settings saved");
    });

    // Send a message to the content script to apply the updated settings
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "applySettings",
        settings: settings,
      });
    });
  }
});
