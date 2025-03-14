self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("app-cache").then(cache => {
            return Promise.all([
                fetch("/").then(res => cache.put("/", res)),
                fetch("/static/css/main.css").then(res => cache.put("/static/css/main.css", res)),
                fetch("/static/js/main.js").then(res => cache.put("/static/js/main.js", res)),
                fetch("/static/manifest.json").then(res => cache.put("/static/manifest.json", res)),
                fetch("/static/icons/icon-192x192.png").then(res => cache.put("/static/icons/icon-192x192.png", res)),
                fetch("/static/icons/icon-512x512.png").then(res => cache.put("/static/icons/icon-512x512.png", res))
            ]);
        }).catch(error => console.error("Cache error:", error))
    );
});
