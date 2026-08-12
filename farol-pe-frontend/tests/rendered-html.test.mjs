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
    new URL("../public/painel-conjuntura-2026-08-11.html", import.meta.url),
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
  assert.equal((panorama.match(/class="tblscroll trab-table-scroll"/g) ?? []).length, 2);
  assert.match(
    panorama,
    /\.trab-table-scroll table\.mini\{width:100%; min-width:640px; table-layout:fixed;\}/,
  );
  assert.match(
    panorama,
    /\.trab-table-scroll table\.mini th:first-child,[\s\S]*?position:sticky; left:0;/,
  );
  assert.match(
    panorama,
    /initialScrollers=document\.querySelectorAll\('\.colchart,\.tblwrap,\.tblscroll'\)/,
  );
  assert.match(
    panorama,
    /Cabeçalho do Panorama[\s\S]*?\.siteheader\{[\s\S]*?min-height:350px;[\s\S]*?background:#F5F9FB;/,
  );
  assert.match(
    panorama,
    /\.site-eyebrow::before\{[\s\S]*?background:#F7A600;/,
  );
  assert.match(
    panorama,
    /\.site-h1\{[\s\S]*?color:#000;[\s\S]*?font-size:clamp\(42px,4vw,56px\);[\s\S]*?white-space:nowrap;/,
  );
  assert.match(
    panorama,
    /\.dcard::after\{z-index:0; background:var\(--blue-100\);\}/,
  );
  assert.match(
    panorama,
    /Crescimento mensal<span>mai\/2026 sobre abr\/2026<\/span>/,
  );
  assert.match(
    panorama,
    /Crescimento interanual<span>mai\/2026 sobre mai\/2025<\/span>/,
  );
  assert.match(
    panorama,
    /Crescimento acumulado no ano<span>jan a mai\/2026 sobre jan a mai\/2025<\/span>/,
  );
  assert.match(
    panorama,
    /Crescimento acumulado em 12 meses<span>jun\/25 a mai\/26 sobre jun\/24 a mai\/25<\/span>/,
  );
  assert.equal(
    (panorama.match(/Indústria geral \(PIM-PF\)\*/g) ?? []).length,
    4,
  );
  assert.equal(
    (panorama.match(/\* Dados referentes a jun\/2026\./g) ?? []).length,
    4,
  );
  assert.match(panorama, /@media \(max-width:720px\)[\s\S]*?\.site-h1\{[^}]*white-space:normal;/);
});

test("renderiza a home institucional do FarolPE", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const source = await readFile(
    new URL("../app/FarolPortal.tsx", import.meta.url),
    "utf8",
  );
  assert.match(html, /<html lang="pt-BR">/i);
  assert.match(html, /SDEC_FAROLPE_ICONE_SITE\.png/);
  assert.match(html, /FarolPE/i);
  assert.match(html, /Ver com clareza\./);
  assert.match(html, /Decidir com segurança\./);
  assert.match(html, /Navegue pelos dados/);
  assert.match(html, /Painéis dos Dados/);
  assert.doesNotMatch(html, /\/noticias/i);
  assert.doesNotMatch(html, /<iframe\b/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
  assert.match(html, /class="home-more-strip"[\s\S]*?Veja mais/);
  assert.match(
    source,
    /getElementById\("home-analysis"\)[\s\S]*?scrollIntoView/,
  );
  assert.match(html, /<section id="home-analysis" class="home-analysis"/);
  assert.match(
    stylesheet,
    /\.reference-home \{[^}]*min-height: 100dvh;[^}]*url\("\/farol-home\.jpg"\)/,
  );
  assert.match(
    stylesheet,
    /\.home-more-strip \{\s*bottom: clamp\(56px, 7vh, 84px\);\s*border: 0;\s*background: transparent;\s*pointer-events: none;/,
  );
  assert.match(
    stylesheet,
    /\.home-more-strip button \{[^}]*color: #fff;[^}]*pointer-events: auto;/,
  );
  assert.match(
    stylesheet,
    /\.home-page > \.home-footer \.sdec-lockup \{[\s\S]*?align-self: center;[\s\S]*?align-items: center;/,
  );
  assert.match(
    stylesheet,
    /\.home-page > \.home-footer \.sdec-logo-crop \{\s*margin-block: auto;/,
  );
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

test("protege o carregamento do iframe até a hidratação", async () => {
  const response = await render("/paineis/agricultura");
  const html = await response.text();
  const iframes = html.match(/<iframe\b/gi) ?? [];

  assert.equal(iframes.length, 0);
  assert.match(html, /class="iframe-wrap"/);
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /data-frame-state="loading"/);
  assert.match(html, /class="lighthouse-loader-icon"/);
  assert.doesNotMatch(html, /app\.powerbi\.com|app\.fabric\.microsoft\.com/);
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
  assert.match(
    stylesheet,
    /\.panel-page\.is-embedded \.iframe-wrap::after \{[\s\S]*?height: 76px;[\s\S]*?background: #f5f9fb;[\s\S]*?pointer-events: none;/,
  );
  assert.match(
    stylesheet,
    /@media \(max-width: 860px\)[\s\S]*?\.panel-page\.is-embedded \.iframe-wrap::after \{ height: 76px; \}/,
  );
  assert.match(
    stylesheet,
    /\.panel-page\.is-embedded[\s\S]*?\.iframe-wrap:not\(\[data-frame-state="ready"\]\)::after \{[\s\S]*?background: #f5f9fb;/,
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

  assert.match(html, /class="sidebar-search\s*"/);
  assert.match(
    source,
    /className="sidebar-brand"[\s\S]*?className="sidebar-tools"[\s\S]*?className=\{`sidebar-search[\s\S]*?className="sidebar-actions"/,
  );
  assert.match(html, /Buscar indicadores e temas/);
  assert.match(html, /<kbd>\/<\/kbd>/);
  assert.match(source, /return <Search className="search-glyph"/);
  assert.match(
    stylesheet,
    /\.sidebar:not\(\.is-collapsed\) \.sidebar-brand \{[\s\S]*?justify-content: center;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar:not\(\.is-collapsed\) \.sidebar-tools \{[\s\S]*?z-index: 5;[\s\S]*?display: grid;[\s\S]*?margin: 20px 20px 15px;[\s\S]*?grid-template-columns: minmax\(0, 1fr\) auto;[\s\S]*?gap: 10px;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar:not\(\.is-collapsed\) \.sidebar-search \{[\s\S]*?min-width: 0;[\s\S]*?flex: 1;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar:not\(\.is-collapsed\) \.sidebar-collapse-toggle \{[\s\S]*?z-index: 3;[\s\S]*?pointer-events: auto;/,
  );
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
      "Acompanhe os principais indicadores conjunturais que mostram o ritmo da economia pernambucana.",
    ],
    [
      "/paineis/estrutura-industrial",
      "Explore a composição e o desempenho dos principais setores da economia.",
    ],
    [
      "/paineis/produto-interno-bruto",
      "Acompanhe indicadores que revelam a geração de riqueza, renda e atividade econômica em Pernambuco.",
    ],
    [
      "/paineis/agricultura",
      "Explore a produção agrícola, pecuária e aquícola, acompanhando sua evolução e importância para o estado.",
    ],
    [
      "/paineis/estoque-de-emprego",
      "Monitore a evolução do emprego, da ocupação, dos rendimentos e das condições do mercado de trabalho.",
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

test("organiza o acesso aos dados pelos mesmos temas dos painéis", async () => {
  const response = await render("/dicionario-de-dados");
  const html = await response.text();
  const catalog = html.match(/<section class="dictionary-list"[\s\S]*?<\/section>/)?.[0] ?? "";
  const catalogText = catalog
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")");

  assert.equal(response.status, 200);
  assert.match(html, /Acesse os dados/);
  assert.match(html, /Escolha o tema de seu interesse/);
  assert.match(html, /Acessar dados/);
  assert.match(html, /https:\/\/forms\.gle\/Ky4y4akU6UJJ3GTv7/);
  assert.match(html, /https:\/\/forms\.gle\/eeio4YLBs8V47fKE7/);
  assert.match(html, /https:\/\/forms\.gle\/7G81FS6xyxwVhHjj6/);
  assert.equal(catalog.match(/<article class="dictionary-card[^\"]*"/g)?.length, 5);

  for (const theme of [
    "Dinâmica Econômica",
    "Estrutura Setorial",
    "Produção e Renda",
    "Agropecuária",
    "Emprego",
  ]) {
    assert.ok(catalogText.includes(theme), `catálogo deveria conter ${theme}`);
  }

  assert.equal(catalog.match(/Disponível em breve/g)?.length, 2);

  assert.doesNotMatch(html, /Buscar termo no dicionário|termos disponíveis/);
});

test("estrutura publicações oficiais com filtros", async () => {
  const response = await render("/publicacoes");
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Tipo de publicação/);
  assert.match(html, /Notas Técnicas/);
  assert.match(html, /Notícias de PE/);
  assert.match(html, /Relatórios Analíticos/);
  assert.match(html, /Boletins Econômicos/);
  assert.match(html, /Janela de tempo/);
  assert.match(html, /Últimos 30 dias/);
  assert.match(html, /Dinâmica empresarial de Pernambuco em junho de 2026/);
  assert.match(html, /12\.226 empresas/);
  assert.match(html, /Relatório Analítico Setorial: Piscicultura de Pernambuco/);
  assert.match(html, /piscicultura da tilápia/);
  assert.match(html, /Acessar publicação/);
  assert.match(html, /1SEgyO4ynuPrVY3zeXbGKrafxkQS5Rr3/);
  assert.match(html, /15JXPhjlnoo4Lqm_AMG9MKz52RDeZL2Uu/);
  assert.doesNotMatch(html, /Exemplo|clipping|Diario de Pernambuco/i);
  assert.equal(html.match(/class="publication-card"/g)?.length, 2);
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
    /\.sidebar-link\.is-active::before \{[\s\S]*?left: -13px;[\s\S]*?background: var\(--brand-yellow\);/,
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

test("mantém o ritmo vertical uniforme e aproxima os serviços da navegação", async () => {
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
    /\.sidebar:not\(\.is-collapsed\) \.sidebar-services \{\s*margin-top: auto;\s*border-top: 0;/,
  );
  assert.match(
    stylesheet,
    /Ritmo vertical comum[\s\S]*?\.sidebar:not\(\.is-collapsed\) \.sidebar-brand \{[\s\S]*?flex: 0 0 auto;[\s\S]*?min-height: 0;[\s\S]*?padding: 24px 22px 16px;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar:not\(\.is-collapsed\) \.sidebar-brand \.brand-lockup\.is-compact \{[\s\S]*?height: 150px;[\s\S]*?overflow: hidden;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar:not\(\.is-collapsed\) \.sidebar-brand \.brand-lockup\.is-compact \.brand-logo \{[\s\S]*?top: -35px;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar:not\(\.is-collapsed\) \.sidebar-tools \{[\s\S]*?flex: 0 0 auto;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar-services \.sidebar-main \{[\s\S]*?min-height: 46px;[\s\S]*?font-size: 12px;/,
  );
  assert.match(stylesheet, /\.sidebar-footer \{[\s\S]*?margin-top: 0;/);
});

test("amplia o menu lateral no desktop e preserva sua rolagem", async () => {
  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const source = await readFile(
    new URL("../app/FarolPortal.tsx", import.meta.url),
    "utf8",
  );

  assert.match(
    stylesheet,
    /@media \(min-width: 861px\) \{\s*:root \{\s*--sidebar-width: 325px;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar:not\(\.is-collapsed\) \{[\s\S]*?overflow-y: auto;[\s\S]*?scrollbar-gutter: stable;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar:not\(\.is-collapsed\) \.sidebar-search > span:not\(\.search-glyph\) \{\s*font-size: 14px;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar:not\(\.is-collapsed\) \.sidebar-primary-tabs > button \{[\s\S]*?min-height: 90px;[\s\S]*?font-size: 13px;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar:not\(\.is-collapsed\) \.panorama-topic-list button \{[\s\S]*?min-height: 53px;[\s\S]*?font-size: 13\.5px;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar:not\(\.is-collapsed\) \.sidebar-panel-groups \.group-toggle \{[\s\S]*?min-height: 63px;[\s\S]*?font-size: 13\.5px;/,
  );
  assert.match(
    stylesheet,
    /@media \(min-width: 861px\) and \(max-width: 1366px\) \{\s*:root \{\s*--sidebar-width: 305px;[\s\S]*?min-height: 125px;[\s\S]*?min-height: 85px;/,
  );
  assert.match(
    stylesheet,
    /@media \(min-width: 861px\) and \(max-width: 1080px\) \{\s*:root \{\s*--sidebar-width: 285px;/,
  );
  assert.match(
    stylesheet,
    /O recolhimento fica independente[\s\S]*?\.sidebar:not\(\.is-collapsed\) \.sidebar-collapse-toggle \{[\s\S]*?position: fixed;[\s\S]*?top: 18px;[\s\S]*?left: calc\(var\(--sidebar-width\) - 61px\);/,
  );
  assert.match(
    stylesheet,
    /\.sidebar\.is-collapsed \.sidebar-services \{[\s\S]*?display: flex;[\s\S]*?margin-top: auto;[\s\S]*?border-top: 0;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar\.is-collapsed \.sidebar-services \.sidebar-main \{[\s\S]*?width: 100%;[\s\S]*?min-height: 48px;[\s\S]*?border-radius: 10px;[\s\S]*?background: transparent;[\s\S]*?font-size: 0;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar\.is-collapsed \.sidebar-services \.sidebar-main:hover,\s*\.sidebar\.is-collapsed \.sidebar-services \.sidebar-main:focus-visible \{[\s\S]*?background: linear-gradient\(180deg, rgba\(255, 255, 255, \.055\), transparent\);[\s\S]*?transform: none;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar\.is-collapsed\s+\.sidebar-services\s+\.sidebar-main:is\(:hover, :focus-visible\)\s+\.nav-symbol \{[\s\S]*?background: transparent;[\s\S]*?filter: drop-shadow\(0 0 7px rgba\(255, 255, 255, \.28\)\);/,
  );
  assert.match(
    stylesheet,
    /\.sidebar\.is-collapsed \.sidebar-services \.sidebar-main\.is-active \{[\s\S]*?background: transparent;[\s\S]*?box-shadow: inset 0 -2px 0 var\(--brand-yellow\);/,
  );
  assert.match(
    stylesheet,
    /\.sidebar\.is-collapsed \.sidebar-services \.sidebar-main::after \{[\s\S]*?content: attr\(data-tooltip\);[\s\S]*?opacity: 0;/,
  );
  assert.match(source, /data-tooltip="Download dos Dados"/);
  assert.match(source, /data-tooltip="Publicações"/);
  assert.match(source, /data-tooltip="Sobre"/);
  assert.match(source, /data-tooltip="Início"/);
  assert.match(source, /data-tooltip="Panorama"/);
  assert.match(source, /data-tooltip="Painéis"/);
  assert.match(source, /data-tooltip="Pesquisar"/);
  assert.match(
    stylesheet,
    /Tooltips do menu recolhido[\s\S]*?\.sidebar\.is-collapsed \[data-tooltip\]:not\(\.sidebar-main\)::before \{[\s\S]*?background: #06142f;[\s\S]*?content: attr\(data-tooltip\);/,
  );
  assert.match(source, /className="collapsed-panels-flyout"/);
  assert.match(source, /className="collapsed-panorama-flyout"/);
  assert.match(source, /aria-label="Acesso r.pido aos t.picos do panorama"/);
  assert.match(source, /className="collapsed-panorama-items"/);
  assert.match(
    source,
    /const releaseFlyoutPointerFocus[\s\S]*?event\.preventDefault\(\);[\s\S]*?activeElement instanceof HTMLElement[\s\S]*?activeElement\.blur\(\);/,
  );
  assert.equal(
    [...source.matchAll(/onMouseDown=\{releaseFlyoutPointerFocus\}/g)].length,
    3,
  );
  assert.match(
    source,
    /if \(!isPanoramaContext\) \{\s*navigate\("\/resumo"\);\s*onClose\(\);\s*return;/,
  );
  assert.match(source, /aria-label="Acesso rápido aos painéis"/);
  assert.match(source, /className="collapsed-panels-group-toggle"/);
  assert.match(source, /<span>Painéis do <\/span><FarolName \/>/);
  assert.match(source, /aria-expanded=\{isFlyoutGroupOpen\}/);
  assert.match(source, /group: isFlyoutGroupOpen \? null : group\.id/);
  assert.match(source, /className="collapsed-panels-items"/);
  assert.match(
    stylesheet,
    /\.sidebar\.is-collapsed:has\(\.sidebar-primary-tabs > button:nth-child\(3\):hover\)[\s\S]*?\.collapsed-panels-flyout[\s\S]*?opacity: 1;[\s\S]*?pointer-events: auto;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar\.is-collapsed:has\(\.sidebar-primary-tabs > button:nth-child\(2\):hover\) \.collapsed-panorama-flyout[\s\S]*?opacity: 1;[\s\S]*?pointer-events: auto;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar\.is-collapsed \.sidebar-primary-tabs > button:is\(:nth-child\(2\), :nth-child\(3\)\)::before \{\s*display: none;/,
  );
  assert.match(
    stylesheet,
    /\.collapsed-panels-flyout \{[\s\S]*?visibility: hidden;[\s\S]*?pointer-events: auto;[\s\S]*?opacity \.14s ease \.18s,[\s\S]*?visibility 0s linear \.32s;/,
  );
  assert.match(
    stylesheet,
    /\.collapsed-panels-flyout:focus-within \{[\s\S]*?visibility: visible;[\s\S]*?transition-delay: 0s;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar\.is-collapsed \.sidebar-primary-tabs \{\s*border-bottom: 0;/,
  );
  assert.match(
    stylesheet,
    /\.collapsed-panels-flyout-title \.farol-name-word \{\s*color: var\(--brand-blue\);[\s\S]*?\.collapsed-panels-flyout-title \.farol-name-state \{\s*color: var\(--brand-yellow\);/,
  );
  assert.doesNotMatch(
    stylesheet,
    /\.collapsed-panels-flyout-title > span:first-child \{[\s\S]*?text-transform: uppercase;/,
  );
  assert.match(
    source,
    /className="sidebar-symbol-home"[\s\S]*?onClick=\{\(\) => go\("\/"\)\}[\s\S]*?Voltar para a página inicial/,
  );
  assert.match(stylesheet, /\.portal-shell\.is-sidebar-collapsed \{\s*--sidebar-width: 92px;/);
  assert.match(
    stylesheet,
    /@media \(max-width: 860px\)[\s\S]*?\.sidebar \{\s*width: min\(350px, 91vw\);/,
  );
});

test("troca a lateral entre tópicos do panorama e catálogo de painéis", async () => {
  const panoramaResponse = await render("/resumo");
  const panoramaHtml = await panoramaResponse.text();
  const panelsResponse = await render("/paineis/atividade-economica");
  const panelsHtml = await panelsResponse.text();
  const panoramaDocument = await readFile(
    new URL("../public/painel-conjuntura-2026-08-11.html", import.meta.url),
    "utf8",
  );

  assert.match(panoramaHtml, /Tópicos do panorama/);
  assert.match(panoramaHtml, /class="panorama-topic-list"/);
  assert.match(panoramaHtml, /Panorama geral/);
  assert.match(panoramaHtml, /Calendário de Dados/);
  assert.match(panoramaHtml, /data-frame-state="loading"/);
  assert.doesNotMatch(panoramaHtml, /class="topic-index"|<small>8<\/small>|<i aria-hidden="true">›<\/i>/);
  assert.doesNotMatch(panoramaHtml, /class="sidebar-panel-groups"/);

  assert.match(panelsHtml, /Painéis do Farol/);
  assert.match(panelsHtml, /class="sidebar-panel-groups"/);
  assert.doesNotMatch(panelsHtml, /class="panorama-topic-list"/);

  assert.match(panoramaDocument, /farol-panorama-select/);
  assert.match(panoramaDocument, /farol-panorama-section/);
  assert.match(
    panoramaDocument,
    /html\.is-embedded \.sitenav\{\s*display:none;\s*\}/,
  );
});

test("conclui a página Sobre com cabeçalho textual e equipe ampliada", async () => {
  const response = await render("/sobre");
  const html = await response.text();

  assert.doesNotMatch(html, /Farol%20de%20Olinda2\.jpg|about-photo/);
  assert.match(html, /Pedro Leonardo Lacerda/);
  assert.match(html, /Secretário Executivo de Atração de Investimentos e Estudos Econômicos/);
  assert.match(html, /Danielle Jar/);
  assert.match(html, /Secretária de Desenvolvimento Econômico/);
  assert.doesNotMatch(html, /O FarolPE é uma plataforma pública de inteligência socioeconômica/);
});

test("adiciona o link oficial da SDEC e diferencia cargos de nomes", async () => {
  const response = await render("/sobre");
  const html = await response.text();
  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(
    html,
    /href="https:\/\/www\.sdec\.pe\.gov\.br\/"[^>]*>Secretaria de Desenvolvimento Econômico de Pernambuco \(SDEC-PE\)<\/a>/,
  );
  assert.match(
    stylesheet,
    /\.about-credits-panel \.credits-role \{[\s\S]*?color: var\(--brand-blue\);/,
  );
  assert.match(
    stylesheet,
    /\.about-credits-panel \.credits-members strong \{[\s\S]*?color: #000;/,
  );
  assert.match(
    stylesheet,
    /\.about-narrative > \.eyebrow,\s*\.about-credits-panel > p \{[\s\S]*?padding: 0;[\s\S]*?background: transparent;[\s\S]*?color: var\(--brand-yellow\);/,
  );
  assert.match(
    stylesheet,
    /\.home-why-heading > p \{[\s\S]*?padding: 0;[\s\S]*?background: transparent;[\s\S]*?color: var\(--brand-yellow\);/,
  );
});

test("explica por que o nome FarolPE logo após os quatro sinais", async () => {
  const response = await render("/");
  const html = await response.text();

  assert.match(html, /class="home-why"/);
  assert.match(html, /id="home-why-title"/);
  assert.match(html, /Desde a Antiguidade, os faróis representam muito mais/);
  assert.match(html, /O farol não substituía a decisão do comandante/);
  assert.match(html, /fortalecer a governança, ampliar a transparência/);
  assert.ok(
    html.indexOf('class="home-analysis"') < html.indexOf('class="home-why"'),
  );
});

test("usa a marca bicolor e a paleta oficial", async () => {
  const homeResponse = await render("/");
  const homeHtml = await homeResponse.text();
  const aboutResponse = await render("/sobre");
  const aboutHtml = await aboutResponse.text();
  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  for (const html of [homeHtml, aboutHtml]) {
    assert.match(html, /class="farol-name-word"[^>]*>Farol<\/span>/);
    assert.match(html, /class="farol-name-state"[^>]*>PE<\/span>/);
    assert.doesNotMatch(html, /class="farol-name-(?:word|state)"[^>]*aria-hidden/);
  }

  assert.match(stylesheet, /--brand-blue: #00466e;/);
  assert.match(stylesheet, /--brand-yellow: #f7a600;/);
  assert.match(
    stylesheet,
    /\.farol-name-word \{[\s\S]*?color: var\(--brand-blue\);/,
  );
  assert.match(
    stylesheet,
    /\.farol-name-state \{[\s\S]*?color: var\(--brand-yellow\);/,
  );
  assert.match(
    stylesheet,
    /\.hero-lead \.farol-name\.is-on-dark \{[\s\S]*?padding: 0;[\s\S]*?background: transparent;[\s\S]*?box-shadow: none;/,
  );
  assert.match(
    stylesheet,
    /\.hero-lead \.farol-name\.is-on-dark \.farol-name-word \{\s*color: #fff;/,
  );
});

test("carrega e aplica Inter no portal e no panorama incorporado", async () => {
  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const panorama = await readFile(
    new URL("../public/painel-conjuntura-2026-08-11.html", import.meta.url),
    "utf8",
  );
  const font = await readFile(
    new URL("../public/fonts/InterVariable.woff2", import.meta.url),
  );

  assert.ok(font.byteLength > 300_000);
  assert.match(stylesheet, /@font-face \{[\s\S]*?InterVariable\.woff2/);
  assert.match(stylesheet, /body \*[\s\S]*?font-family: var\(--font-inter\) !important;/);
  assert.match(panorama, /@font-face\{font-family:'Inter'/);
  assert.match(panorama, /--mono:var\(--font\);/);
});

test("padroniza cabeçalhos internos e mantém o Sobre neutro no mobile", async () => {
  for (const [path, className] of [
    ["/sobre", "about-hero"],
    ["/publicacoes", "publications-hero"],
    ["/dicionario-de-dados", "dictionary-hero"],
    ["/indicadores/agricultura", "info-hero"],
    ["/paineis/estoque-de-emprego", "panel-page-hero"],
  ]) {
    const response = await render(path);
    const html = await response.text();
    assert.match(html, new RegExp(`class="page-hero ${className}"`));
  }

  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(
    stylesheet,
    /radial-gradient\(circle at top left, rgba\(247, 166, 0, 0\.12\)/,
  );
  assert.match(
    stylesheet,
    /\.page-hero h1,[\s\S]*?color: #000;/,
  );
  assert.match(
    stylesheet,
    /\.page-hero,\s*\.info-hero\.page-hero,\s*\.about-hero\.page-hero,\s*\.dictionary-hero\.page-hero,\s*\.publications-hero\.page-hero \{[\s\S]*?border-bottom: 0;/,
  );
  assert.match(
    stylesheet,
    /\.page-hero::after,\s*\.info-hero\.page-hero::after,\s*\.dictionary-hero\.page-hero::after \{\s*display: none;\s*content: none;/,
  );
  assert.doesNotMatch(
    stylesheet,
    /border-bottom: 3px solid var\(--brand-blue\);/,
  );
  assert.doesNotMatch(stylesheet, /\.page-hero::after,[^{]*\{[^}]*width:\s*96px/);
  assert.match(
    stylesheet,
    /@media \(max-width: 560px\)[\s\S]*?\.about-content-layout \{[\s\S]*?padding: 34px 16px 52px;/,
  );
});

test("usa logo horizontal e azul oficial no topo móvel", async () => {
  const response = await render("/sobre");
  const html = await response.text();
  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(
    html,
    /class="mobile-topbar"[\s\S]*?SDEC_FAROLPE_HORIZONTAL_VARIAÇÃO\.png/,
  );
  assert.match(
    stylesheet,
    /@media \(max-width: 860px\)[\s\S]*?\.mobile-topbar \{[\s\S]*?background: var\(--brand-blue\);/,
  );
  assert.match(
    stylesheet,
    /\.mobile-topbar \.brand-button \{[\s\S]*?align-self: stretch;[\s\S]*?align-items: center;/,
  );
  assert.match(
    stylesheet,
    /\.mobile-topbar \.brand-lockup \{[\s\S]*?transform: translateY\(4px\);/,
  );
});

test("mantém o tema aberto no azul oficial e o mesmo brilho ao painel e panorama ativos", async () => {
  const response = await render("/paineis/atividade-economica");
  const html = await response.text();
  const panoramaResponse = await render("/resumo");
  const panoramaHtml = await panoramaResponse.text();
  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(html, /class="nav-group is-open"/);
  assert.equal((html.match(/class="nav-group is-open"/g) ?? []).length, 1);
  assert.match(
    html,
    /class="nav-group is-open"[\s\S]*?class="group-toggle contains-active"[\s\S]*?aria-expanded="true"/,
  );
  assert.match(
    stylesheet,
    /\.sidebar-primary-tabs > button\.is-active,[\s\S]*?background: transparent;/,
  );
  assert.match(
    stylesheet,
    /\.sidebar-panel-groups \.nav-group\.is-open \{\s*background: transparent;\s*box-shadow: none;/,
  );
  assert.doesNotMatch(
    stylesheet,
    /\.sidebar-panel-groups \.nav-group\.is-open \{[^}]*var\(--brand-blue-dark\)/,
  );
  assert.match(
    stylesheet,
    /\.panorama-topic-list button\.is-active,\s*\.sidebar-panel-row:has\(\.sidebar-link\.is-active\) \{[\s\S]*?rgba\(255, 255, 255, \.17\)[\s\S]*?backdrop-filter: blur\(6px\)/,
  );
  assert.match(
    panoramaHtml,
    /class="panorama-topic-list"[\s\S]*?class="is-active"[\s\S]*?aria-current="true"[\s\S]*?Panorama geral/,
  );
  assert.match(
    stylesheet,
    /\.panorama-topic-list button\.is-active::before \{[\s\S]*?z-index: 2;/,
  );
  assert.match(
    stylesheet,
    /\.panorama-topic-list button\.is-active::after \{[\s\S]*?height: 1px;[\s\S]*?rgba\(255, 255, 255, \.58\)/,
  );
  assert.match(
    stylesheet,
    /\.sidebar-panel-row \.sidebar-link\.is-active \{[\s\S]*?background: transparent;/,
  );
  assert.doesNotMatch(
    stylesheet,
    /\.sidebar-link\.is-active[^\{]*\{[^\}]*background:\s*var\(--brand-blue-dark\)/,
  );
});

test("anima o farol durante o carregamento protegido do BI", async () => {
  const source = await readFile(
    new URL("../app/FarolPortal.tsx", import.meta.url),
    "utf8",
  );
  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const symbol = await readFile(
    new URL("../public/SDEC_FAROLPE_SÍMBOLO_SITE_v2.png", import.meta.url),
  );

  assert.match(source, /PANEL_REVEAL_MINIMUM_MS = 3_800/);
  assert.match(source, /PANEL_REVEAL_SETTLE_MS = 2_700/);
  assert.match(source, /POWER_BI_RENDER_FALLBACK_MS = 2_000/);
  assert.match(source, /POWER_BI_CACHED_FALLBACK_MS = 350/);
  assert.match(source, /POWER_BI_CACHED_MINIMUM_MS = 500/);
  assert.match(source, /FRAME_LOAD_TIMEOUT_MS = 30_000/);
  assert.match(source, /useSyncExternalStore/);
  assert.match(source, /useLayoutEffect/);
  assert.match(source, /getServerHydrationSnapshot = \(\) => false/);
  assert.match(source, /aria-busy=\{busy\}/);
  assert.match(source, /loading="eager"/);
  assert.match(source, /Tentar novamente/);
  assert.match(source, /getPowerBiEventName\(event\.data\) !== "rendered"/);
  assert.match(source, /event\.source !== iframeRef\.current\?\.contentWindow/);
  assert.match(source, /window\.sessionStorage\.getItem\(`\$\{FRAME_READY_CACHE_PREFIX\}\$\{src\}`\)/);
  assert.match(source, /window\.sessionStorage\.setItem\(`\$\{FRAME_READY_CACHE_PREFIX\}\$\{src\}`, "1"\)/);
  assert.match(source, /cached \? POWER_BI_CACHED_FALLBACK_MS : POWER_BI_RENDER_FALLBACK_MS/);
  assert.match(source, /className="lighthouse-loader-base"/);
  assert.match(source, /className="lighthouse-loader-yellow"/);
  const deferredFrameSource = source.match(
    /function DeferredFrame[\s\S]*?function AnimatedMetric/,
  )?.[0] ?? "";
  assert.equal(
    (deferredFrameSource.match(/SDEC_FAROLPE_SÍMBOLO_SITE_v2\.png/g) ?? []).length,
    2,
  );
  assert.ok(symbol.length > 10_000);
  assert.match(
    stylesheet,
    /\.panel-loading \{\s*z-index: 3;[\s\S]*?background: #f5f9fb;[\s\S]*?color: var\(--brand-blue\);/,
  );
  assert.match(stylesheet, /@keyframes lighthouseYellowBlink/);
  assert.match(
    stylesheet,
    /\.lighthouse-loader-yellow \{[\s\S]*?clip-path: circle\(16% at 50% 50%\);[\s\S]*?animation: lighthouseYellowBlink/,
  );
  assert.match(
    stylesheet,
    /\.iframe-wrap iframe \{[\s\S]*?visibility: hidden;[\s\S]*?pointer-events: none;/,
  );
  assert.match(
    stylesheet,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.lighthouse-loader-yellow \{[\s\S]*?animation: none !important;/,
  );
});

test("sincroniza os quatro sinais da home com fundo azul e cards brancos", async () => {
  const dataSource = await readFile(
    new URL("../app/portal-data.ts", import.meta.url),
    "utf8",
  );
  const panorama = await readFile(
    new URL("../public/painel-conjuntura-2026-08-11.html", import.meta.url),
    "utf8",
  );
  const stylesheet = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const summaryKpis = dataSource.match(/export const summaryKpis = \[[\s\S]*?\n\];/)?.[0] ?? "";

  for (const value of ["+5,1%", "+10,9%", "+11,0%", "+6.162"]) {
    assert.ok(summaryKpis.includes(`value: "${value}"`));
    assert.ok(panorama.includes(value));
  }

  assert.match(panorama, /Panorama econômico de Pernambuco/i);
  assert.match(panorama, /Atualizado em 11 de agosto de 2026/);
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
