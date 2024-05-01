// Background script aka service worker for the extension

chrome.runtime.onInstalled.addListener(() => {
  console.log(
    "Hi there! I'm the background script. Feel free to contribute to this open source project if you found this message."
  );
});
