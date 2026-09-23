chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'DOWNLOAD_FILE') {
    handleDownload(message.path, message.content)
      .then(() => sendResponse({ status: 'success' }))
      .catch(err => sendResponse({ status: 'error', message: err.message }));
    return true; 
  }
});

async function handleDownload(filePath, content) {
  const settings = await chrome.storage.local.get(['subfolder']);
  const subfolder = settings.subfolder || "";
  
  // Combine subfolder with the dynamic path from the page
  const fullPath = subfolder 
    ? (subfolder.endsWith('/') ? subfolder : subfolder + '/') + filePath
    : filePath;

  const blob = new Blob([content], { type: 'text/plain' });
  const reader = new FileReader();
  
  const dataUrl = await new Promise((resolve) => {
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });

  return new Promise((resolve, reject) => {
    chrome.downloads.download({
      url: dataUrl,
      filename: fullPath,
      saveAs: false,
      conflictAction: 'overwrite'
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(downloadId);
      }
    });
  });
}
