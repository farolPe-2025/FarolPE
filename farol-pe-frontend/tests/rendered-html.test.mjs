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

test("mantem o panorama contido e rolavel em telas pequenas", async () => {
  const panorama = await readFile(
    new URL("../public/painel-conjuntura-2026-08-03.html", import.meta.url),
    "utf8",
  );

  assert.match(
    panorama,
    /@media \(max-width:640px\)[\s\S]*?html,body\{width:100%; max-width:100%; overflow-x:hidden;\}/,
  );
  assert.match(
    panorama,
    /\.blocogrid>div\{width:100%; min-width:0; overflow:hidden;\}/,
  );
  assert.match(
    panorama,
    /\.blocogrid \.colchart\{[^}]*overflow-x:auto;[^}]*touch-action:pan-x pan-y;/,
  );
  assert.match(
    panorama,
    /\.blocogrid \.tblscroll\{[^}]*overflow-x:auto;[^}]*touch-action:pan-x pan-y;/,
  );
  assert.match(
    panorama,
    /initialScrollers=document\.querySelectorAll\('\.colchart,\.tblwrap,\.tblscroll'\)/,
  );
});

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
  assert.doesNotMatch(html, /\/noticias/i);
  assert.doesNotMatch(html, /<iframe\b/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("remove as faixas multicoloridas do menu e da home", async () => {
  const homeResponse = await render("/");
  const homeHtml = await homeResponse.text();
  const panelResponse = await render("/paineis/atividade-economica");
  const panelHtml = await panelResponse.text();
  const source = await readFile(
    new URL("../app/FarolPortal.tsx", import.meta.url),
    "utf8",
  );
  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(homeHtml, /pe-color-rule/);
  assert.doesNotMatch(panelHtml, /pe-stripe/);
  assert.doesNotMatch(source, /pe-color-rule|pe-stripe/);
  assert.doesNotMatch(stylesheet, /\.pe-color-rule|\.pe-stripe|sidebarStripeIn/);
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

test("mantém a busca acessível com ícone profissional", async () => {
  const response = await render("/paineis/atividade-economica");
  const html = await response.text();
  const source = await readFile(
    new URL("../app/FarolPortal.tsx", import.meta.url),
    "utf8",
  );
  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(html, /class="sidebar-search"/);
  assert.match(html, /Buscar indicadores e temas/);
  assert.match(html, /<kbd>\/<\/kbd>/);
  assert.match(source, /return <Search className="search-glyph"/);
  assert.doesNotMatch(
    stylesheet,
    /\.sidebar-search \.search-glyph\s*\{[\s\S]*?transform: scaleX\(-1\)/,
  );
});

test("usa ícones semânticos no menu lateral", async () => {
  const response = await render("/paineis/atividade-economica");
  const html = await response.text();
  const source = await readFile(
    new URL("../app/FarolPortal.tsx", import.meta.url),
    "utf8",
  );
  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  for (const icon of [
    "House",
    "Compass",
    "LayoutGrid",
    "ChartNoAxesCombined",
    "Building2",
    "HandCoins",
    "Leaf",
    "Users",
    "Download",
    "FileText",
    "Info",
  ]) {
    assert.match(source, new RegExp(`\\b${icon}\\b`));
  }

  assert.match(html, /lucide-chart-no-axes-combined/);
  assert.match(html, /lucide-building-2/);
  assert.doesNotMatch(source, /glyph:\s*["']|["'][↗▥◴◇◎⇩≡ⓘ☰×]["']/);
  assert.match(stylesheet, /\.primary-icon \{[\s\S]*?color: #fff;[\s\S]*?opacity: \.78;/);
  assert.match(
    stylesheet,
    /\.sidebar-primary-tabs button\.is-active \.primary-icon \{[\s\S]*?color: var\(--gold\);/,
  );
  assert.doesNotMatch(
    stylesheet,
    /\.sidebar-primary-tabs button:nth-child\([^)]*\) \.primary-icon/,
  );
});

test("resume cada categoria e informa sua quantidade de painéis", async () => {
  const categories = [
    [
      "/paineis/atividade-economica",
      "Acompanhe atividade, indústria, comércio, serviços e turismo em Pernambuco.",
    ],
    [
      "/paineis/estrutura-industrial",
      "Explore a composição e o desempenho dos principais setores da economia.",
    ],
    [
      "/paineis/produto-interno-bruto",
      "Consulte produção, renda, arrecadação e movimentações financeiras no estado.",
    ],
    [
      "/paineis/agricultura",
      "Acompanhe agricultura, aquicultura, produção animal e rebanhos de Pernambuco.",
    ],
    [
      "/paineis/estoque-de-emprego",
      "Veja estoque, fluxo e outros indicadores do mercado de trabalho formal.",
    ],
  ];

  for (const [path, summary] of categories) {
    const response = await render(path);
    const html = await response.text();
    assert.ok(html.includes(summary), `resumo esperado em ${path}`);
  }

  const response = await render("/paineis/atividade-economica");
  const html = await response.text();
  const counts = [...html.matchAll(/class="group-count" aria-label="(\d+) painéis"/g)]
    .map((match) => Number(match[1]));
  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.deepEqual(counts, [5, 3, 5, 4, 3]);
  assert.match(
    stylesheet,
    /\.sidebar-panel-groups \.group-icon,[\s\S]*?\.group-icon\.tone-employment \{[\s\S]*?color: #fff;/,
  );
  assert.match(
    stylesheet,
    /\.group-toggle \.group-summary \{[\s\S]*?font-size: 11px;[\s\S]*?line-height: 1\.5;/,
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
  assert.doesNotMatch(source, /\/noticias/i);
});

test("entrega somente os painéis publicados no catálogo de dados", async () => {
  const response = await render("/dicionario-de-dados");
  const html = await response.text();
  const catalog = html.match(/<section class="dictionary-list"[\s\S]*?<\/section>/)?.[0] ?? "";
  const catalogText = catalog
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")");

  assert.equal(response.status, 200);
  assert.match(html, /Solicite as bases dos painéis/);
  assert.match(html, /Acessar dados/);
  assert.match(html, /https:\/\/forms\.gle\/aMfCQQ8N4aU1pt4m6/);
  assert.equal(catalog.match(/class="dictionary-card"/g)?.length, 10);

  for (const panelName of [
    "Indústria (PIM-PF)",
    "Atividade Econômica (IBCR)",
    "Serviços (PMS)",
    "Turismo (PMS)",
    "Estrutura industrial (PIA-Empresa)",
    "Comércio (PMC)",
    "Agricultura (PAM)",
    "Aquicultura (PPM)",
    "Produção de origem animal (PPM)",
    "Rebanhos (PPM)",
  ]) {
    assert.ok(catalogText.includes(panelName), `catálogo deveria conter ${panelName}`);
  }

  for (const unavailablePanel of [
    "Movimentações Financeiras",
    "Produto Interno Bruto",
    "Valor Adicionado Bruto",
    "Estoque de Emprego",
    "Fluxo de Emprego",
  ]) {
    assert.ok(
      !catalogText.includes(unavailablePanel),
      `catálogo não deveria conter ${unavailablePanel}`,
    );
  }

  assert.doesNotMatch(html, /Buscar termo no dicionário|termos disponíveis/);
});

test("estrutura publicações com clipping e filtros", async () => {
  const response = await render("/publicacoes");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Tipo de publicação/);
  assert.match(html, /Notícias/);
  assert.match(html, /Relatórios analíticos/);
  assert.match(html, /Boletim econômico/);
  assert.match(html, /Janela de tempo/);
  assert.match(html, /Últimos 30 dias/);
  assert.match(html, /Exemplo de clipping/);
  assert.match(html, /Pernambuco lidera alta do comércio varejista/);
  assert.match(html, /Diario de Pernambuco/);
  assert.match(html, /17 jul\. 2026/);
  assert.equal(html.match(/class="publication-card"/g)?.length, 1);
});

test("organiza a navegação dos painéis e sinaliza conteúdos em preparação", async () => {
  const response = await render("/paineis/estoque-de-emprego");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Dinâmica Econômica/);
  assert.match(html, /Estrutura Setorial/);
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

test("faz o marcador amarelo acompanhar o título do painel ativo", async () => {
  const panelResponse = await render("/paineis/atividade-economica");
  const panelHtml = await panelResponse.text();
  const infoResponse = await render("/indicadores/atividade-economica");
  const infoHtml = await infoResponse.text();
  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  for (const html of [panelHtml, infoHtml]) {
    assert.match(
      html,
      /class="sidebar-link [^"]*is-active"[\s\S]*?<span>Atividade Econômica<\/span>/,
    );
  }

  assert.doesNotMatch(stylesheet, /\.sidebar-panel-groups::before/);
  assert.match(
    stylesheet,
    /\.sidebar-link\.is-active::before \{[\s\S]*?left: -13px;[\s\S]*?background: #f8c630;/,
  );
});

test("exibe somente a navegação contextual da área ativa", async () => {
  const response = await render("/sobre");
  const html = await response.text();
  const source = await readFile(
    new URL("../app/FarolPortal.tsx", import.meta.url),
    "utf8",
  );

  assert.match(html, /class="sidebar-services"/);
  assert.doesNotMatch(html, /sidebar-panel-groups|panorama-topic-list/);
  assert.match(source, /groupPreference\.path === path/);
  assert.doesNotMatch(source, /<Sidebar\s+key=\{path\}/);
  assert.doesNotMatch(source, /activeGroup \?\? "economic"/);
});

test("ancora serviços junto à logo e amplia seus itens", async () => {
  const response = await render("/sobre");
  const html = await response.text();
  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.ok(html.indexOf("sidebar-services") < html.indexOf("sidebar-footer"));
  assert.match(
    stylesheet,
    /\.sidebar-nav \{[\s\S]*?display: flex;[\s\S]*?flex: 1 0 auto;[\s\S]*?flex-direction: column;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar-services \{[\s\S]*?margin-top: auto;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar-services \.sidebar-main \{[\s\S]*?min-height: 46px;[\s\S]*?font-size: 12px;/,
  );
  assert.match(stylesheet, /\.sidebar-footer \{[\s\S]*?margin-top: 0;/);
});

test("troca a lateral entre tópicos do panorama e catálogo de painéis", async () => {
  const panoramaResponse = await render("/resumo");
  const panoramaHtml = await panoramaResponse.text();
  const panelsResponse = await render("/paineis/atividade-economica");
  const panelsHtml = await panelsResponse.text();
  const panoramaDocument = await readFile(
    new URL("../public/painel-conjuntura-2026-08-03.html", import.meta.url),
    "utf8",
  );

  assert.match(panoramaHtml, /Tópicos do panorama/);
  assert.match(panoramaHtml, /class="panorama-topic-list"/);
  assert.match(panoramaHtml, /Panorama geral/);
  assert.match(panoramaHtml, /Calendário de Dados/);
  assert.match(panoramaHtml, /id="panorama-frame"/);
  assert.doesNotMatch(panoramaHtml, /class="topic-index"|<small>8<\/small>|<i aria-hidden="true">›<\/i>/);
  assert.doesNotMatch(panoramaHtml, /class="sidebar-panel-groups"/);

  assert.match(panelsHtml, /Painéis do Farol/);
  assert.match(panelsHtml, /class="sidebar-panel-groups"/);
  assert.doesNotMatch(panelsHtml, /class="panorama-topic-list"/);

  assert.match(panoramaDocument, /farol-panorama-select/);
  assert.match(panoramaDocument, /farol-panorama-section/);
  assert.match(panoramaDocument, /html\.is-embedded \.sitenav\{display:none;\}/);
});

test("conclui a página Sobre com cabeçalho textual e equipe ampliada", async () => {
  const response = await render("/sobre");
  const html = await response.text();

  assert.doesNotMatch(html, /Farol%20de%20Olinda2\.jpg|about-photo/);
  assert.match(html, /Pedro Lacerda/);
  assert.match(html, /Secretário Executivo de Atração de Investimentos e Estudos Econômicos/);
  assert.match(html, /Danielle Jar/);
  assert.match(html, /Secretária de Desenvolvimento Econômico/);
  assert.doesNotMatch(html, /O FarolPE é uma plataforma pública de inteligência socioeconômica/);
});

test("sincroniza os quatro sinais da home com fundo azul e cards brancos", async () => {
  const dataSource = await readFile(
    new URL("../app/portal-data.ts", import.meta.url),
    "utf8",
  );
  const panorama = await readFile(
    new URL("../public/painel-conjuntura-2026-08-03.html", import.meta.url),
    "utf8",
  );
  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const summaryKpis = dataSource.match(/export const summaryKpis = \[[\s\S]*?\n\];/)?.[0] ?? "";

  for (const value of ["+5,1%", "+14,9%", "+11,0%", "+6.162"]) {
    assert.ok(summaryKpis.includes(`value: "${value}"`));
    assert.ok(panorama.includes(value));
  }

  assert.match(panorama, /Panorama econômico de Pernambuco/i);
  assert.match(
    stylesheet,
    /\.home-analysis \{\s*background:[\s\S]*?linear-gradient\(145deg, #071a38 0%, #0a2447 54%, #0d3158 100%\);\s*color: #fff;/,
  );
  assert.match(
    stylesheet,
    /\.home-analysis \.analysis-grid article \{[\s\S]*?background: #fff;/,
  );
});

test("não exibe a fonte metodológica no rodapé dos informativos", async () => {
  const response = await render("/indicadores/agricultura");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.doesNotMatch(html, /Fonte metodológica/);
});
