setInterval(() => {
  chrome.storage.local.set({ startTrack: Math.random() });
}, 3000)
