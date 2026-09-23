function getElementByXPath(xpath) {
  try {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  } catch (e) {
    console.error('Error evaluating XPath:', xpath, e);
    return null;
  }
}

function showStatus(btn, text, color, delay = 2000) {
  const originalText = btn.innerText;
  const originalColor = btn.style.backgroundColor;
  btn.innerText = text;
  btn.style.backgroundColor = color;
  setTimeout(() => {
    btn.innerText = originalText;
    btn.style.backgroundColor = originalColor;
  }, delay);
}

function addButtons() {
  const targetXPath = '/html/body/div[2]/div/div[2]/main/main/div/div/div[2]/div/div/div[2]/div/div[1]';
  const nameXPath = '/html/body/div[2]/div/div[2]/main/main/div/div/div[2]/div/div/div[2]/div/div[1]/span';
  const codeXPaths = [
    '/html/body/div[2]/div/div[2]/main/main/div/div/div[2]/div/div/div[2]/div/div[2]/pre/code',
    '/html/body/div[2]/div/div[2]/main/main/div/div/div[2]/div/div/div[2]/div/div[2]/pre'
  ];

  const targetElement = getElementByXPath(targetXPath);
  if (!targetElement || targetElement.querySelector('.gemini-btn-container')) return;

  const container = document.createElement('div');
  container.className = 'gemini-btn-container';
  container.style.display = 'inline-flex';
  container.style.gap = '8px';
  container.style.marginLeft = '12px';

  // --- Copy Button ---
  const copyBtn = document.createElement('button');
  copyBtn.innerText = 'Copy Code';
  styleButton(copyBtn, '#3b82f6');

  copyBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const codeText = getCodeText(codeXPaths);
    if (!codeText) {
      showStatus(copyBtn, 'No Code!', '#ef4444');
      return;
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(codeText)
        .then(() => showStatus(copyBtn, 'Copied!', '#10b981'))
        .catch(() => fallbackCopy(codeText, copyBtn));
    } else {
      fallbackCopy(codeText, copyBtn);
    }
  });

  // --- Download Button ---
  const downBtn = document.createElement('button');
  downBtn.innerText = 'Download';
  styleButton(downBtn, '#8b5cf6');

  downBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const codeText = getCodeText(codeXPaths);
    const nameElement = getElementByXPath(nameXPath);
    const fileName = nameElement ? nameElement.innerText.trim() : 'code.txt';

    if (!codeText) {
      showStatus(downBtn, 'No Code!', '#ef4444');
      return;
    }

    downBtn.innerText = 'Saving...';

    try {
      chrome.runtime.sendMessage({
        type: 'DOWNLOAD_FILE',
        path: fileName,
        content: codeText
      }, (response) => {
        if (chrome.runtime.lastError) {
          handleRuntimeError(chrome.runtime.lastError.message, downBtn);
        } else if (response && response.status === 'success') {
          showStatus(downBtn, 'Saved!', '#10b981');
        } else {
          showStatus(downBtn, 'Failed!', '#ef4444');
          console.error('Download failed:', response ? response.message : 'Unknown error');
        }
      });
    } catch (err) {
      handleRuntimeError(err.message, downBtn);
    }
  });

  function handleRuntimeError(msg, btn) {
    if (msg.includes('context invalidated')) {
      showStatus(btn, 'Reload Page!', '#f59e0b', 5000);
    } else {
      showStatus(btn, 'Error!', '#ef4444');
    }
    console.error('Download error:', msg);
  }

  container.appendChild(copyBtn);
  container.appendChild(downBtn);
  targetElement.appendChild(container);
}

function getCodeText(xpaths) {
  for (const xpath of xpaths) {
    const el = getElementByXPath(xpath);
    if (el) {
      let text = el.innerText || el.textContent || "";
      if (!text.trim()) {
        const nested = el.querySelector('code, pre');
        if (nested) text = nested.innerText || nested.textContent || "";
      }
      if (text.trim()) return text.trim();
    }
  }
  return null;
}

function styleButton(btn, color) {
  btn.style.padding = '5px 12px';
  btn.style.fontSize = '12px';
  btn.style.fontWeight = 'bold';
  btn.style.cursor = 'pointer';
  btn.style.backgroundColor = color;
  btn.style.color = 'white';
  btn.style.border = 'none';
  btn.style.borderRadius = '4px';
  btn.style.transition = 'all 0.2s';
  btn.onmouseover = () => btn.style.filter = 'brightness(0.9)';
  btn.onmouseout = () => btn.style.filter = 'brightness(1)';
}

function fallbackCopy(text, btn) {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (ok) showStatus(btn, 'Copied!', '#10b981');
    else throw 1;
  } catch (err) {
    showStatus(btn, 'Error!', '#ef4444');
  }
}

const observer = new MutationObserver(() => addButtons());
observer.observe(document.body, { childList: true, subtree: true });
addButtons();
