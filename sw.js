// Service Worker do sistema de Ponto Digital
// Guarda a página em cache pra ela abrir mesmo sem internet.
// NÃO cacheia chamadas ao gateway (/.netlify/functions/*) nem, por segurança, ao Apps
// Script direto — essas sempre vão pra rede, nunca pelo cache.

const CACHE_NAME = "ponto-cache-v2";
const ARQUIVOS_PARA_CACHEAR = ["./", "./index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARQUIVOS_PARA_CACHEAR))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(nomes.filter((nome) => nome !== CACHE_NAME).map((nome) => caches.delete(nome)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Chamadas ao gateway do sistema de ponto (mesma origem) NUNCA passam pelo cache —
  // precisam sempre ir pra rede, senão a fila offline/sincronização quebra.
  if (url.pathname.startsWith("/.netlify/functions/")) {
    return;
  }

  // Segurança adicional: se algum código antigo ainda chamar o Apps Script direto, também não cacheia.
  if (url.hostname.includes("script.google.com") || url.hostname.includes("script.googleusercontent.com")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((resposta) => {
        const copia = resposta.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
        return resposta;
      })
      .catch(() => caches.match(event.request).then((r) => r || caches.match("./index.html")))
  );
});
