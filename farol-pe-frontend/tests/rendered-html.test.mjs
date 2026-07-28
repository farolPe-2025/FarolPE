import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: {
        accept: "text/html",
        host: "localhost",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renderiza a home institucional do FarolPE", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="pt-BR">/i);
  assert.match(html, /FarolPE/i);
  assert.match(html, /Ver com clareza\./);
  assert.match(html, /Decidir com segurança\./);
  assert.match(html, /Visualizar dados/);
  assert.match(html, /Painéis dos Dados/);
  assert.doesNotMatch(html, /Notícias|\/noticias/i);
  assert.doesNotMatch(html, /<iframe\b/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("renderiza rotas internas por URL", async () => {
  for (const path of [
    "/resumo",
    "/sobre",
    "/publicacoes",
    "/dicionario-de-dados",
    "/paineis/agricultura",
    "/indicadores/agricultura",
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200, `esperava 200 em ${path}`);
    const html = await response.text();
    assert.match(html, /FarolPE/i);
  }
});

test("carrega somente o iframe da rota ativa", async () => {
  const response = await render("/paineis/agricultura");
  const html = await response.text();
  const iframes = html.match(/<iframe\b/gi) ?? [];

  assert.equal(iframes.length, 1);
  assert.match(html, /MWUxY2I2YTEtNmZkMC00Mzk4/);
  assert.doesNotMatch(html, /Y2YzZDY2OTMtMDViZS00MmMz/);
});

test("mantém na busca os mesmos nomes exibidos no menu", async () => {
  const source = await readFile(
    new URL("../app/portal-data.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /label:\s*panel\.shortTitle/);
  assert.doesNotMatch(source, /label:\s*panel\.title/);
  assert.doesNotMatch(source, /label:\s*`Sobre\s/);
  assert.doesNotMatch(source, /Notícias|\/noticias/i);
});

test("entrega o catálogo simplificado para solicitação de dados", async () => {
  const response = await render("/dicionario-de-dados");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Solicite as bases dos painéis/);
  assert.match(html, /Solicitar dados/);
  assert.match(
    html,
    /https:\/\/docs\.google\.com\/forms\/d\/e\/1FAIpQLSdaDaMbjhz70ubK79YQeoOjySp8668p5XoihS6gw_ElNBQV9g\/viewform/,
  );

  for (const panelName of [
    "Indústria",
    "Atividade Econômica",
    "Agricultura",
    "Aquicultura",
    "Origem animal",
    "Rebanhos",
  ]) {
    assert.match(html, new RegExp(panelName));
  }

  assert.doesNotMatch(html, /Buscar termo no dicionário|termos disponíveis/);
});
