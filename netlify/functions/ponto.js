// Gateway específico do Sistema de Ponto DK.
// Encaminha somente GET/POST para uma URL fixa do Apps Script definida no ambiente.
// O cliente nunca escolhe o destino.

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

exports.handler = async (event) => {
  if (!APPS_SCRIPT_URL) {
    console.error("[ponto-function] APPS_SCRIPT_URL não configurada.");
    return resposta(500, { ok: false, erro: "Gateway mal configurado." });
  }

  try {
    if (event.httpMethod === "GET") return await encaminharGet(event);
    if (event.httpMethod === "POST") return await encaminharPost(event);
    return resposta(405, { ok: false, erro: "Método não suportado." });
  } catch (erro) {
    console.error("[ponto-function] erro inesperado:", erro && erro.message);
    return resposta(502, { ok: false, erro: "Gateway indisponível." });
  }
};

async function encaminharGet(event) {
  const params = new URLSearchParams(event.queryStringParameters || {});
  const url = `${APPS_SCRIPT_URL}?${params.toString()}`;
  const resp = await fetchComTimeout(url, { method: "GET" });
  return await repassarResposta(resp);
}

async function encaminharPost(event) {
  const corpo = event.body || "{}";
  const resp = await fetchComTimeout(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: corpo
  });
  return await repassarResposta(resp);
}

async function fetchComTimeout(url, opcoes, timeoutMs = 20000) {
  const controlador = new AbortController();
  const timeoutId = setTimeout(() => controlador.abort(), timeoutMs);
  try {
    return await fetch(url, { ...opcoes, signal: controlador.signal, redirect: "follow" });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function repassarResposta(resp) {
  const texto = await resp.text();
  let corpoJson;
  try {
    corpoJson = JSON.parse(texto);
  } catch (_) {
    console.error("[ponto-function] Apps Script não retornou JSON válido.");
    return resposta(502, { ok: false, erro: "Backend retornou resposta inválida." });
  }
  return resposta(resp.status, corpoJson);
}

function resposta(statusCode, objeto) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(objeto)
  };
}
