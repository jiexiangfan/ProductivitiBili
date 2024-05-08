// popup.js

// all section in popup.html
const sectionsToHandle = [
  "bilibiliHome",
  "bilibiliComments",
  "bilibiliSidebar",
  "bilibiliUpNext",
  "bilibiliSubscription",
  "bilibiliTrending",
  "bilibiliDanmuku",
];

// When the popup is opened, load the settings from storage and set up event listeners
document.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  setupEventListeners();
});

// Load the settings from storage. If no settings are found, use the default settings
function loadSettings() {
  chrome.storage.sync.get(["bilibiliSettings"], (result) => {
    const settings = result.bilibiliSettings || {};
    sectionsToHandle.forEach((section) => {
      const selectedOption = settings[section] || "show";
      setRadioButtonState(section, selectedOption);
    });
  });
}

// Set the radio button state based on the selected option
function setRadioButtonState(section, selectedOption) {
  const radioButton = document.querySelector(
    `input[name="${section}"][value="${selectedOption}"]`
  );
  if (radioButton) {
    radioButton.checked = true;
  }
}

// Set up event listeners for radio buttons to save and apply settings
function setupEventListeners() {
  sectionsToHandle.forEach((section) => {
    const radios = document.querySelectorAll(`input[name="${section}"]`);
    radios.forEach((radio) => {
      radio.addEventListener("change", () => saveAndApplySettings());
    });
  });
}

// Save the selected options and apply the settings to the current tab
function saveAndApplySettings() {
  const settings = sectionsToHandle.reduce((acc, section) => {
    const selectedOption = document.querySelector(
      `input[name="${section}"]:checked`
    ).value;
    acc[section] = selectedOption;
    return acc;
  }, {});

  chrome.storage.sync.set({ bilibiliSettings: settings }, () => {
    console.log("Settings saved");
    sendSettingsToContentScript(settings);
  });
}

// Send the settings to the content script to apply the changes
function sendSettingsToContentScript(settings) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      console.log("Sending settings to content script:", settings);
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "applySettings",
          settings,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError);
          } else {
            console.log("Response from content script:", response);
          }
        }
      );
    } else {
      console.error("No active tab found.");
    }
  });
}
