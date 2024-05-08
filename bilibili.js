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
    ".pop-live-small-mode",
    "#danmukuBox",
    ".video-card-ad-small",
  ],
  bilibiliUpNext: [
    ".bpx-player-ending-content",
    ".bpx-player-ending-related",
    ".bilibili-player-ending-panel-box-videos",
  ],
  bilibiliComments: [
    "#comment",
    ".bili-footer",
    ".international-footer",
    "#activity_vote",
    ".inside-wrp",
  ],
  bilibiliSubscription: [
    ".bili-dyn-list-tabs",
    ".bili-dyn-list",
    ".bili-footer",
    ".international-footer",
    ".bili-dyn-topic-box",
    ".bili-dyn-up-list",
  ],
  bilibiliTrending: [
    ".popular-container",
    ".popular-video-container",
    ".bili-footer",
    ".international-footer",
    // ".channel-link", // these 3 are the buttons in the header of hompage
    // ".channel-link__right",
    // ".channel-entry-more__link",
  ],
  bilibiliDanmuku: [".bpx-player-row-dm-wrap"],
};

// Apply existing settings to the current tab
chrome.storage.sync.get(["bilibiliSettings"], function (result) {
  const settings = result.bilibiliSettings || {};
  applySettings(settings);
});

// Listen for messages from the popup to apply settings
console.log("Content script loaded, waiting for settings...");
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("Received message:", request);
  if (request.action === "applySettings") {
    const settings = request.settings;
    applySettings(settings);
    sendResponse({ status: "Settings applied" });
  }
  return true; // Will keep the message channel open for sendResponse
});

// Apply the settings to the sections based on the selected options
function applySettings(settings) {
  let css = "";
  Object.entries(sections).forEach(([section, selectors]) => {
    console.log("Applying settings for section:", section);
    const setting = settings[section] || "show"; // Default to 'show' if no setting is provided
    selectors.forEach((selector) => {
      css += generateCSS(selector, setting);
    });
  });
  injectStyles(css);
}

// Generate CSS for a given selector and setting
function generateCSS(selector, setting) {
  const styleMap = {
    hide: `display: none !important;`,
    blur: `filter: blur(5px) !important; display: initial !important;`,
    show: `filter: none !important; display: initial !important;`, // Ensure visibility is enforced
  };
  return `${selector} { ${styleMap[setting] || ""} }\n`;
}

// Inject styles into the document
function injectStyles(css) {
  // Remove existing styles to avoid duplication
  let styleElement = document.getElementById("custom-bilibili-styles");
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.id = "custom-bilibili-styles";
    document.head.appendChild(styleElement);
  }
  styleElement.textContent = css;
}
