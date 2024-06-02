chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addZwnj",
    title: "Add ZWNJ",
    contexts: ["editable"],
    targetUrlPatterns: ["*://shoonya.ai4bharat.org/*"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "addZwnj") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: addZwnjToInput
    });
  }
});

function addZwnjToInput() {
  const inputField = document.activeElement;
  if (inputField.isContentEditable || inputField.tagName === "INPUT" || inputField.tagName === "TEXTAREA") {
    const cursorPosition = inputField.selectionStart;
    const textBeforeCursor = inputField.value.substring(0, cursorPosition);
    const textAfterCursor = inputField.value.substring(cursorPosition);
    inputField.value = textBeforeCursor + "\u200C" + textAfterCursor;
    inputField.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
  }
}
