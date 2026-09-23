document.getElementById('save').addEventListener('click', () => {
  const subfolder = document.getElementById('subfolder').value.trim();
  chrome.storage.local.set({ subfolder: subfolder }, () => {
    document.getElementById('status').innerText = 'Saved! Path: Downloads/' + (subfolder ? subfolder + '/' : '');
    document.getElementById('status').style.color = 'green';
  });
});

chrome.storage.local.get(['subfolder'], (res) => {
  if (res.subfolder) {
    document.getElementById('subfolder').value = res.subfolder;
    document.getElementById('status').innerText = 'Path: Downloads/' + res.subfolder + '/';
  }
});
