// bilibili.js

// Define the sections and their respective CSS selectors
const sections = {
  bilibiliHome: [
    ".bili-feed4-layout",
    ".header-channel-fixed",
    ".bili-footer",
    ".international-footer",
  ],
  bilibiliSidebar: [
    "#reco_list",
    "#right-bottom-banner",
    "#live_recommand_report",
  ],
  bilibiliUpNext: [
    ".bpx-player-ending-content",
    ".bpx-player-ending-related",
    ".bilibili-player-ending-panel-box-videos",
  ],
  bilibiliComments: ["#comment", ".bili-footer", "international-footer"],
  bilibiliSubscription: [
    ".bili-dyn-home--member",
    ".bili-footer",
    ".international-footer",
  ],
  bilibiliTrending: [
    ".popular-container",
    ".popular-video-container",
    ".bili-footer",
    ".international-footer",
  ],
  bilibiliDanmuku: [".bpx-player-row-dm-wrap"],
};

// Define the styles for each option
const sectionStyles = {
  hide: {
    display: "none !important",
  },
  blur: {
    display: "block",
    filter: "blur(5px)",
  },
  show: {
    display: "block",
    filter: "none",
  },
};

// Apply existing settings to the current tab
chrome.storage.sync.get(["bili_userSettings"], function (result) {
  const settings = result.bili_userSettings || {};
  applySettings(settings);
});

// Listen for messages from the popup to apply settings
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "applySettings") {
    const settings = request.settings;
    applySettings(settings);
  }
});

// Apply the settings to the sections based on the selected options
function applySettings(settings) {
  Object.entries(sections).forEach(([section, selectors]) => {
    selectors.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        handleSectionVisibility(element, settings[section]);
      }
    });
  });
}

// Handle the visibility of the section based on the selected option
function handleSectionVisibility(element, setting) {
  const styles = sectionStyles[setting] || {};
  Object.entries(styles).forEach(([property, value]) => {
    element.style[property] = value;
  });
}
