chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "addZwnj",
    title: "Add ZWNJ",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "addZwnj") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: addZwnjAtCursor
    });
  }
});

function addZwnjAtCursor() {
  const zwnj = '\u200C';
  const activeElement = document.activeElement;

  if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
    const start = activeElement.selectionStart;
    const end = activeElement.selectionEnd;
    const value = activeElement.value;
    activeElement.value = value.slice(0, start) + zwnj + value.slice(end);
    activeElement.setSelectionRange(start + 1, start + 1);
  } else if (activeElement.isContentEditable) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(zwnj));
    range.collapse(false);

    // Move the cursor after the inserted ZWNJ
    const newRange = document.createRange();
    newRange.setStart(range.endContainer, range.endOffset);
    newRange.setEnd(range.endContainer, range.endOffset);
    selection.removeAllRanges();
    selection.addRange(newRange);
  } else {
    // Handle Google Sheets and other iframe-based editors
    injectScriptForGoogleSheets(zwnj);
  }
}

function injectScriptForGoogleSheets(zwnj) {
  const script = document.createElement('script');
  script.textContent = `(${addZwnjToGoogleSheets.toString()})("${zwnj}");`;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
}

function addZwnjToGoogleSheets(zwnj) {
  const activeCell = document.querySelector('.cell-input');
  if (activeCell) {
    const start = activeCell.selectionStart;
    const end = activeCell.selectionEnd;
    const value = activeCell.value;
    activeCell.value = value.slice(0, start) + zwnj + value.slice(end);
    activeCell.setSelectionRange(start + 1, start + 1);
  } else {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(zwnj));
    range.collapse(false);

    // Move the cursor after the inserted ZWNJ
    const newRange = document.createRange();
    newRange.setStart(range.endContainer, range.endOffset);
    newRange.setEnd(range.endContainer, range.endOffset);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
}
