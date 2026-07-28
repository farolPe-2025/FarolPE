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

test("aplica a centralização padrão a qualquer painel incorporado", async () => {
  for (const path of [
    "/paineis/industria",
    "/paineis/atividade-economica",
    "/paineis/servicos",
    "/paineis/turismo",
    "/paineis/agricultura",
    "/paineis/aquicultura",
    "/paineis/origem-animal",
    "/paineis/rebanhos",
  ]) {
    const response = await render(path);
    const html = await response.text();
    assert.match(html, /panel-page is-embedded/);
    assert.doesNotMatch(html, /is-powerbi|is-fabric/);
  }

  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  assert.match(
    stylesheet,
    /@media \(min-width: 861px\)[\s\S]*?\.panel-page\.is-embedded \.panel-stage[\s\S]*?place-items: center/,
  );
  assert.match(
    stylesheet,
    /\.panel-page\.is-embedded \.iframe-wrap[\s\S]*?width: min\(100%, 1680px\)/,
  );
  assert.match(
    stylesheet,
    /@media \(min-width: 1360px\)[\s\S]*?\.panel-page\.is-embedded \.panel-stage[\s\S]*?padding: 0/,
  );
  assert.match(
    stylesheet,
    /@media \(min-width: 1360px\)[\s\S]*?\.panel-page\.is-embedded \.iframe-wrap[\s\S]*?width: 100%[\s\S]*?height: 100%/,
  );
});

test("mantém a busca antiga na lateral e espelha somente a lupa", async () => {
  const response = await render("/paineis/atividade-economica");
  const html = await response.text();
  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(html, /class="sidebar-search"/);
  assert.match(html, /Buscar no Farol PE/);
  assert.match(html, /<kbd>\/<\/kbd>/);
  assert.match(
    stylesheet,
    /\.sidebar-search \.search-glyph\s*\{[\s\S]*?transform: scaleX\(-1\)/,
  );
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

test("entrega o catálogo simplificado para acesso aos dados", async () => {
  const response = await render("/dicionario-de-dados");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Solicite as bases dos painéis/);
  assert.match(html, /Acessar dados/);
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

test("organiza a navegação dos painéis e sinaliza conteúdos em preparação", async () => {
  const response = await render("/paineis/estoque-de-emprego");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Dinâmica Econômica/);
  assert.match(html, /Panoramas Setoriais/);
  assert.match(html, /Produção e Renda/);
  assert.match(html, /Agropecuária/);
  assert.match(html, /Emprego/);
  assert.match(html, /Estoque de Emprego/);
  assert.match(html, /Fluxo de Emprego/);
  assert.match(html, /Outros indicadores/);
  assert.match(html, /Painel em preparação/);

  const navigationOrder = [
    "Início",
    "Panorama",
    "Painéis",
    "Download dos Dados",
    "Publicações",
    "Sobre",
  ].map((label) => html.indexOf(label));

  assert.ok(
    navigationOrder.every((position, index) =>
      index === 0 ? position >= 0 : position > navigationOrder[index - 1],
    ),
  );
});

test("não exibe a fonte metodológica no rodapé dos informativos", async () => {
  const response = await render("/indicadores/agricultura");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.doesNotMatch(html, /Fonte metodológica/);
});
