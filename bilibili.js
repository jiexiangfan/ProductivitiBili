// bilibili.js

// Logic file for BiliBili website
chrome.storage.sync.get(["settings"], function (result) {
  var settings = result.settings || {};
  applySettings(settings);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "applySettings") {
    var settings = request.settings;
    applySettings(settings);
  }
});

function applySettings(settings) {
  // Determine which sections to hide or blur based on the settings
  if (settings.recommended === "hide") {
    var recoList = document.querySelector("#reco_list");
    if (recoList) {
      recoList.style.display = "none";
    }
  } else {
    var recoList = document.querySelector("#reco_list");
    if (recoList) {
      recoList.style.display = "block";
      recoList.style.filter = "none";
    }
  }

  // You can add similar logic for comments and danmaku sections if needed
}
