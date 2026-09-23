# Bolt.new Code Copier & Downloader

A lightweight Google Chrome extension (Manifest V3) designed to quickly copy and download code files directly from the [Bolt.new](https://bolt.new) interface.

---

## ⚡ Features

- **One-Click Code Copying**: Adds a "Copy Code" button directly to the Bolt.new code viewer header, copying the full file content to your clipboard.
- **Direct File Downloads**: Adds a "Download" button to save the open file directly to your system with its original filename and relative directory path.
- **Custom Subfolder Support**: Configure a base project subfolder inside your browser's default `Downloads` directory using the extension popup.
- **Automatic Overwrite**: Avoids file clutter (such as `filename (1).ext`) by automatically overwriting existing downloads for the same file path.
- **Dynamic DOM Handling**: Uses a `MutationObserver` to ensure action buttons persist seamlessly across file switches and streaming updates.

---

## 📁 Repository Structure

```text
├── background.js     # Service worker handling downloads via chrome.downloads API
├── content.js        # Content script detecting code blocks and injecting UI buttons
├── manifest.json     # Manifest V3 extension configuration and permissions
├── popup.html        # Extension settings popup UI
├── popup.js          # Logic for setting the base download subfolder in local storage
├── test.html         # Local test fixture for simulating code block layout
├── package.json      # Project descriptor
└── .gitignore        # Git ignore rules
```

---

## 🚀 Installation

1. **Clone or Download this Repository**:
   ```bash
   git clone https://github.com/LoNE-W0LvES/bolt-code-downloader.git
   ```
   *(or download the code as a ZIP and extract it)*

2. **Open Extensions in Chrome**:
   - In Google Chrome, navigate to `chrome://extensions/` in the address bar.

3. **Enable Developer Mode**:
   - Toggle the **Developer mode** switch in the top-right corner.

4. **Load Unpacked Extension**:
   - Click the **"Load unpacked"** button in the top-left corner.
   - Select this project folder (`copy`).

---

## 💡 How to Use

1. **Set Base Directory (Optional)**:
   - Click the extension icon in your Chrome toolbar.
   - Enter your preferred subfolder name (e.g., `MyBoltProject`).
   - Click **Save Settings**. Files will now save to `Downloads/MyBoltProject/<file_path>`.

2. **Navigate to Bolt.new**:
   - Open any project on [Bolt.new](https://bolt.new).
   - When a code file is active in the editor / preview pane, you will see two buttons injected into the header:
     - 🟦 **Copy Code**: Copies the entire file's content to your clipboard.
     - 🟪 **Download**: Downloads the active file directly to your designated folder.

---

## ⚙️ How It Works Under the Hood

- **Content Script (`content.js`)**: Observes DOM mutations to target the file header and code container elements in Bolt's layout. It extracts the filename from the header span and code text from `<pre><code>` elements.
- **Background Worker (`background.js`)**: Receives the filename and code content via `chrome.runtime.sendMessage`, resolves the final destination path using `chrome.storage.local`, builds a text Blob, and triggers `chrome.downloads.download`.

---

## 📄 License

MIT
