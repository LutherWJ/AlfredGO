// src/client/main.ts
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("/sw.js");
    } catch (err) {
      console.error(err);
    }
  });
}
