"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  dataRequestUrl,
  mainLinks,
  panels,
  searchItems,
  summaryKpis,
  summaryTable,
  type Panel,
} from "./portal-data";

type Navigate = (href: string) => void;

const activityBars = [
  ["Atividade", "+5,91%", 30, "blue"],
  ["Indústria", "+19,7%", 100, "green"],
  ["Varejo", "+9,4%", 48, "gold"],
  ["Serviços", "+2,4%", 12, "slate"],
  ["Turismo", "+6,9%", 35, "orange"],
] as const;

const businessBars = [
  ["Abert. acumuladas", "73.461", 100, "blue"],
  ["Abert. em maio", "13.414", 18, "blue"],
  ["Saldo acumulado", "30.816", 42, "green"],
  ["Saldo em maio", "4.819", 7, "green"],
] as const;

const pixBars = [
  ["Bahia", "507,6", 100, "slate"],
  ["Pernambuco", "333,9", 66, "blue"],
  ["Ceará", "317,8", 63, "slate"],
  ["Maranhão", "201,4", 40, "slate"],
  ["Paraíba", "147,5", 29, "slate"],
] as const;

const jobsBars = [
  ["Serviços", "3.354", 100, "blue"],
  ["Indústria", "1.513", 45, "green"],
  ["Construção", "806", 24, "gold"],
  ["Comércio", "267", 8, "slate"],
  ["Agropecuária", "-46", 2, "red"],
] as const;

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-lockup ${compact ? "is-compact" : ""}`}>
      <span className="brand-beacon" aria-hidden="true">
        <img src="/lighthouse-icon.svg" alt="" />
      </span>
      <span>
        <b>
          FAROL <em>PE</em>
        </b>
        {!compact && <small>Observatório Socioeconômico</small>}
      </span>
    </div>
  );
}

function SearchDialog({
  open,
  onClose,
  navigate,
}: {
  open: boolean;
  onClose: () => void;
  navigate: Navigate;
}) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    return normalized
      ? searchItems.filter((item) =>
          item.label.toLocaleLowerCase("pt-BR").includes(normalized),
        )
      : searchItems;
  }, [query]);

  if (!open) return null;

  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <section
        className="search-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="search-head">
          <div>
            <span>Busca rápida</span>
            <h2 id="search-title">O que você quer encontrar?</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar busca">
            ×
          </button>
        </div>
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busque pelo nome exibido no menu"
          />
          <kbd>ESC</kbd>
        </label>
        <div className="search-results">
          {results.length ? (
            results.map((item) => (
              <button
                key={`${item.href}-${item.label}`}
                onClick={() => {
                  navigate(item.href);
                  onClose();
                }}
              >
                <span>{item.label}</span>
                <b>Ir para →</b>
              </button>
            ))
          ) : (
            <p>Nenhum resultado encontrado. Tente outro termo.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function Home({ navigate, onSearch }: { navigate: Navigate; onSearch: () => void }) {
  const [homeMenuOpen, setHomeMenuOpen] = useState(false);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal-on-scroll"));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -48px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">
      <main id="main-content" className="reference-home">
        <button
          className={`home-nav-scrim ${homeMenuOpen ? "is-open" : ""}`}
          onClick={() => setHomeMenuOpen(false)}
          aria-label="Fechar menu"
        />
        <header className="home-header">
          <button className="brand-button" onClick={() => navigate("/")} aria-label="Farol PE — início">
            <Brand />
          </button>
          <nav className={homeMenuOpen ? "is-open" : ""} aria-label="Navegação principal">
            {mainLinks.map((item) => (
              <button
                key={item.href}
                className={item.href === "/" ? "is-active" : ""}
                onClick={() => {
                  setHomeMenuOpen(false);
                  navigate(item.href);
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button
            className={`home-menu-toggle ${homeMenuOpen ? "is-open" : ""}`}
            onClick={() => setHomeMenuOpen((value) => !value)}
            aria-label={homeMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={homeMenuOpen}
          >
            <i /><i /><i />
          </button>
          <button
            className="search-trigger"
            onClick={() => {
              setHomeMenuOpen(false);
              onSearch();
            }}
            aria-label="Pesquisar no portal"
          >
            <span>Pesquisar</span>
            <b>⌕</b>
          </button>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <h1>
              Conhecer hoje.
              <strong>Decidir melhor.</strong>
              Transformar amanhã.
            </h1>
            <span className="pe-color-rule" aria-hidden="true"><i /><i /><i /></span>
            <p className="hero-lead">
              Inteligência de dados e análises para orientar políticas,
              investimentos e o desenvolvimento de Pernambuco.
            </p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={() => navigate("/paineis/agricultura")}>
                Explorar painéis <span>→</span>
              </button>
              <button className="button button-ghost" onClick={() => navigate("/resumo")}>
                Ver panorama
              </button>
            </div>
          </div>

          <div className="hero-data-art" aria-hidden="true">
            <span /><span /><span /><span /><span /><span /><span />
            <i /><i />
          </div>

          <section className="manifesto">
            <div className="manifesto-mark" aria-hidden="true">
              <img src="/lighthouse-icon.svg" alt="" />
            </div>
            <p>
              Farol que ilumina dados.
              <br />
              Referência que orienta o <strong>futuro.</strong>
            </p>
            <span>
              Uma plataforma independente, transparente e colaborativa, a serviço
              do desenvolvimento de Pernambuco.
            </span>
          </section>
        </section>
      </main>

      <section className="home-analysis" aria-labelledby="home-analysis-title">
        <div className="analysis-heading reveal-on-scroll">
          <div>
            <p>Leitura rápida</p>
            <h2 id="home-analysis-title">Pernambuco em quatro sinais</h2>
            <span className="analysis-intro">
              Indicadores selecionados para uma leitura objetiva do cenário econômico.
            </span>
          </div>
          <button onClick={() => navigate("/resumo")}>Ver análise completa <span>→</span></button>
        </div>
        <div className="analysis-grid">
          {summaryKpis.map((item, index) => (
            <article
              key={item.label}
              className={`tone-${item.tone} reveal-on-scroll`}
              style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
            >
              <i className="metric-halo" aria-hidden="true" />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.note}</small>
            </article>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <span>Dados · Conhecimento · Estratégia · Desenvolvimento</span>
      </footer>
    </div>
  );
}

function Sidebar({
  path,
  navigate,
  open,
  onClose,
  onSearch,
}: {
  path: string;
  navigate: Navigate;
  open: boolean;
  onClose: () => void;
  onSearch: () => void;
}) {
  const [economicOpen, setEconomicOpen] = useState(true);
  const [agroOpen, setAgroOpen] = useState(true);
  const [livestockOpen, setLivestockOpen] = useState(true);

  const go = (href: string) => {
    navigate(href);
    onClose();
  };

  const panelButton = (panel: Panel, nested = false) => (
    <div className="sidebar-panel-row" key={panel.slug}>
      <button
        className={`sidebar-link ${nested ? "is-nested" : ""} ${
          path === `/paineis/${panel.slug}` ? "is-active" : ""
        }`}
        onClick={() => go(`/paineis/${panel.slug}`)}
      >
        <span>{panel.shortTitle}</span>
      </button>
      {panel.info && (
        <button
          className="sidebar-info-link"
          onClick={() => go(`/indicadores/${panel.slug}`)}
          aria-label={`Sobre o indicador ${panel.shortTitle}`}
          title={`Sobre ${panel.shortTitle}`}
        >
          i
        </button>
      )}
    </div>
  );

  return (
    <>
      <button
        className={`drawer-scrim ${open ? "is-open" : ""}`}
        onClick={onClose}
        aria-label="Fechar menu"
      />
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <div className="pe-stripe" />
        <div className="sidebar-brand">
          <button className="brand-button" onClick={() => go("/")}>
            <Brand />
          </button>
          <button className="drawer-close" onClick={onClose} aria-label="Fechar menu">
            ×
          </button>
        </div>

        <button className="sidebar-search" onClick={onSearch}>
          <span>⌕</span>
          Buscar no Farol PE
          <kbd>/</kbd>
        </button>

        <nav className="sidebar-nav" aria-label="Navegação dos painéis">
          <button className={path === "/" ? "sidebar-main is-active" : "sidebar-main"} onClick={() => go("/")}>
            <span className="nav-symbol">⌂</span> Início
          </button>
          <button className={path === "/resumo" ? "sidebar-main is-active" : "sidebar-main"} onClick={() => go("/resumo")}>
            <span className="nav-symbol">▥</span> Resumo
          </button>
          <button
            className={path === "/dicionario-de-dados" ? "sidebar-main is-active" : "sidebar-main"}
            onClick={() => go("/dicionario-de-dados")}
          >
            <span className="nav-symbol">Aa</span> Dicionário de dados
          </button>

          <p className="sidebar-label">Painéis</p>

          <div className="nav-group">
            <button
              className="group-toggle"
              onClick={() => setEconomicOpen((value) => !value)}
              aria-expanded={economicOpen}
            >
              <span>
                <i className="group-icon">↗</i> Dinâmica Econômica
              </span>
              <b>{economicOpen ? "−" : "+"}</b>
            </button>
            {economicOpen && (
              <div className="group-children">
                {panels
                  .filter((panel) => panel.category === "Dinâmica Econômica")
                  .map((panel) => panelButton(panel))}
              </div>
            )}
          </div>

          <div className="nav-group">
            <button
              className="group-toggle"
              onClick={() => setAgroOpen((value) => !value)}
              aria-expanded={agroOpen}
            >
              <span>
                <i className="group-icon">◇</i> Agropecuária
              </span>
              <b>{agroOpen ? "−" : "+"}</b>
            </button>
            {agroOpen && (
              <div className="group-children">
                {panels
                  .filter((panel) => panel.category === "Agropecuária")
                  .map((panel) => panelButton(panel))}
                <button
                  className="subgroup-toggle"
                  onClick={() => setLivestockOpen((value) => !value)}
                  aria-expanded={livestockOpen}
                >
                  <span>Pecuária</span>
                  <b>{livestockOpen ? "⌄" : "›"}</b>
                </button>
                {livestockOpen && (
                  <div className="subgroup-children">
                    {panels
                      .filter((panel) => panel.category === "Agropecuária · Pecuária")
                      .map((panel) => panelButton(panel, true))}
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        <div className="sidebar-footer">
          <img src="/sdec-logo.png" alt="Secretaria de Desenvolvimento Econômico" />
        </div>
      </aside>
    </>
  );
}

function AppShell({
  path,
  navigate,
  onSearch,
  children,
}: {
  path: string;
  navigate: Navigate;
  onSearch: () => void;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("drawer-open", drawerOpen);
    return () => document.body.classList.remove("drawer-open");
  }, [drawerOpen]);

  return (
    <div className="portal-shell">
      <Sidebar
        path={path}
        navigate={navigate}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSearch={onSearch}
      />
      <div className="portal-main">
        <header className="mobile-topbar">
          <button onClick={() => setDrawerOpen(true)} aria-label="Abrir menu">
            ☰
          </button>
          <button className="brand-button" onClick={() => navigate("/")}>
            <Brand compact />
          </button>
          <button onClick={onSearch} aria-label="Pesquisar">
            ⌕
          </button>
        </header>
        <div id="main-content">{children}</div>
      </div>
    </div>
  );
}

function PanelPage({ panel, navigate }: { panel: Panel; navigate: Navigate }) {
  const [loaded, setLoaded] = useState(false);

  if (panel.embedUrl) {
    return (
      <main className="panel-page is-embedded" aria-label={panel.title}>
        <section className="panel-stage">
          <div className="iframe-wrap">
            {!loaded && (
              <div className="panel-loading" role="status">
                <span className="loader-beam" />
                <strong>Carregando o painel</strong>
                <small>Conectando à fonte de dados oficial…</small>
              </div>
            )}
            <iframe
              key={panel.slug}
              src={panel.embedUrl}
              title={panel.title}
              loading="lazy"
              allowFullScreen
              onLoad={() => setLoaded(true)}
              className={loaded ? "is-loaded" : ""}
            />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="panel-page">
      <header className="content-header">
        <div>
          <p className="breadcrumb">
            Painéis <span>›</span> {panel.category}
          </p>
          <h1>{panel.title}</h1>
          <p>{panel.description}</p>
        </div>
        <div className="content-actions">
          {panel.info && (
            <button className="button button-outline" onClick={() => navigate(`/indicadores/${panel.slug}`)}>
              <span className="info-circle">i</span> Sobre o indicador
            </button>
          )}
        </div>
      </header>

      <section className="panel-stage">
        <div className="panel-toolbar">
          <div>
            <span className="live-pill">
              <i /> Painel incorporado
            </span>
            <span>{panel.source}</span>
          </div>
          <small>Use os filtros internos para explorar os dados</small>
        </div>

        <div className="empty-panel">
          <span className="empty-beacon" aria-hidden="true">
            <i />
          </span>
          <p className="eyebrow dark">{panel.eyebrow}</p>
          <h2>Painel em preparação</h2>
          <p>
            A página e o conteúdo metodológico já estão prontos. Falta apenas
            conectar o endereço de publicação deste painel.
          </p>
          {panel.info && (
            <button className="button button-primary" onClick={() => navigate(`/indicadores/${panel.slug}`)}>
              Consultar metodologia →
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

function InfoPage({ panel, navigate }: { panel: Panel; navigate: Navigate }) {
  if (!panel.info) return null;

  return (
    <main className="info-page">
      <header className="info-hero">
        <div>
          <p className="eyebrow">{panel.info.eyebrow}</p>
          <h1>{panel.info.title}</h1>
          <p>
            Entenda a origem, o cálculo e a melhor forma de interpretar este
            indicador.
          </p>
        </div>
        <button className="button button-light" onClick={() => navigate(`/paineis/${panel.slug}`)}>
          ← Voltar ao painel
        </button>
      </header>
      <section className="info-grid">
        {panel.info.cards.map((card, index) => (
          <article key={card.title} className={card.placeholder ? "is-placeholder" : ""}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{card.title}</h2>
            {card.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        ))}
      </section>
      <footer className="source-note">
        <span>Fonte metodológica</span>
        <b>Instituto Brasileiro de Geografia e Estatística — IBGE</b>
      </footer>
    </main>
  );
}

function BarChart({
  title,
  items,
  note,
}: {
  title: string;
  items: ReadonlyArray<readonly [string, string, number, string]>;
  note?: string;
}) {
  return (
    <article className="chart-card">
      <div className="chart-title">
        <h3>{title}</h3>
        {note && <span>{note}</span>}
      </div>
      <div className="bar-list">
        {items.map(([label, value, width, tone]) => (
          <div className="bar-row" key={label}>
            <span>{label}</span>
            <div className="bar-track">
              <i className={`bar-fill tone-${tone}`} style={{ width: `${width}%` }} />
            </div>
            <b>{value}</b>
          </div>
        ))}
      </div>
    </article>
  );
}

function SummaryPage() {
  return (
    <main className="summary-page">
      <header className="summary-hero">
        <div>
          <p className="eyebrow">Boletim Econômico de PE · Julho / 2026</p>
          <h1>
            Panorama econômico
            <br />
            de Pernambuco
          </h1>
          <p>
            Atividade, indústria, comércio, serviços, empresas, comércio
            exterior, emprego e inadimplência — dados oficiais divulgados até
            junho de 2026.
          </p>
        </div>
        <aside>
          <span>Leitura central</span>
          <strong>
            Expansão robusta, com riscos concentrados no setor externo e no
            endividamento.
          </strong>
        </aside>
      </header>

      <div className="summary-body">
        <section className="summary-kpis" aria-label="Principais indicadores">
          {summaryKpis.map((item) => (
            <article key={item.label} className={`tone-${item.tone}`}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.note}</small>
            </article>
          ))}
        </section>

        <section className="summary-section">
          <div className="summary-heading">
            <p>Atividade econômica</p>
            <h2>Motores do crescimento estadual</h2>
            <span>
              Pernambuco combina atividade acima da média nacional, forte
              expansão industrial, liderança do varejo e recuperação dos
              serviços e do turismo.
            </span>
          </div>
          <div className="summary-grid">
            <BarChart title="Variação por setor" items={activityBars} />
            <div className="insight-grid">
              {[
                ["IBCR", "+5,91%", "2º maior crescimento entre as UFs acompanhadas."],
                ["Indústria", "+19,7%", "Petróleo e biocombustíveis em destaque."],
                ["Serviços", "+2,4%", "Crescimento mensal, o dobro do Brasil."],
                ["Turismo", "+6,9%", "Impulsionado pelos feriados de abril."],
              ].map(([label, value, note]) => (
                <article key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <p>{note}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="mini-stats">
            <article className="is-navy"><span>VBPI industrial</span><strong>R$ 143,3 bi</strong></article>
            <article className="is-green"><span>Empresas industriais</span><strong>5.397</strong></article>
            <article className="is-slate"><span>Produtividade média</span><strong>R$ 673 mil</strong></article>
          </div>
        </section>

        <section className="summary-section">
          <div className="summary-heading">
            <p>Dinâmica empresarial e meios de pagamento</p>
            <h2>Abertura de empresas e Pix</h2>
          </div>
          <div className="summary-grid even">
            <BarChart title="Abertura e formalização" items={businessBars} />
            <BarChart title="Pix no Nordeste (R$ bi)" items={pixBars} />
          </div>
        </section>

        <section className="summary-section">
          <div className="summary-heading">
            <p>Comércio exterior</p>
            <h2>Balança comercial sob pressão</h2>
          </div>
          <div className="summary-grid">
            <article className="chart-card">
              <div className="chart-title">
                <h3>Exportações x importações</h3>
                <span>US$ milhões</span>
              </div>
              <div className="trade-block">
                <p>Junho</p>
                <div><span>Exportações</span><i className="is-export" /><b>148,3</b></div>
                <div><span>Importações</span><i className="is-import" /><b>681,6</b></div>
              </div>
              <div className="trade-block">
                <p>Acumulado jan–jun</p>
                <div><span>Exportações</span><i className="is-export long" /><b>1.020</b></div>
                <div><span>Importações</span><i className="is-import" /><b>3.630</b></div>
              </div>
            </article>
            <div className="callout-stack">
              <article className="callout is-red"><span>Déficit em junho</span><strong>US$ 533,3 milhões</strong></article>
              <article className="callout is-neutral"><span>Principais destinos</span><strong>Argentina, Omã, Chile e Estados Unidos.</strong></article>
              <article className="callout is-green"><span>Superávit municipal</span><strong>Petrolina: mais de US$ 63,8 milhões.</strong></article>
            </div>
          </div>
        </section>

        <section className="summary-section">
          <div className="summary-heading">
            <p>Mercado de trabalho</p>
            <h2>Saldo por setor</h2>
          </div>
          <div className="summary-grid">
            <BarChart title="Saldo de vínculos formais por setor" items={jobsBars} />
            <article className="employment-card">
              <span>Maio de 2026</span>
              <strong>5.894</strong>
              <p>novos vínculos formais</p>
              <dl>
                <div><dt>Admissões</dt><dd>57.870</dd></div>
                <div><dt>Desligamentos</dt><dd>51.976</dd></div>
                <div><dt>Estoque</dt><dd>1.528.368</dd></div>
                <div><dt>Saldo ajustado</dt><dd>5.189</dd></div>
              </dl>
              <small>Atenção à desaceleração: o saldo ajustado caiu de 6.888 para 5.189.</small>
            </article>
          </div>
        </section>

        <section className="summary-section">
          <div className="summary-heading">
            <p>Indicadores sociais</p>
            <h2>Inadimplência das famílias</h2>
          </div>
          <div className="summary-grid">
            <article className="chart-card donut-card">
              <div className="donut">
                <span><strong>50,36%</strong>inadimplentes</span>
              </div>
              <div className="donut-legend">
                <p><i className="red-dot" /> Inadimplentes — 50,36%</p>
                <p><i /> Adimplentes — 49,64%</p>
                <small>3.652.032 pessoas na condição de inadimplência.</small>
              </div>
            </article>
            <div className="social-stats">
              <article><span>Mulheres</span><strong>53,6%</strong></article>
              <article><span>Faixa 41–60 anos</span><strong>35,9%</strong></article>
              <p>
                <b>Composição das dívidas</b>
                Bancos/cartões 33,1% · financeiras 25,1% · contas básicas 11,5%
                · serviços 10,5% · varejo 10,4%.
              </p>
            </div>
          </div>
        </section>

        <section className="summary-section">
          <div className="summary-heading">
            <p>Quadro-síntese</p>
            <h2>Indicadores divulgados em junho de 2026</h2>
          </div>
          <div className="summary-table-wrap">
            <table>
              <caption className="sr-only">
                Síntese dos indicadores econômicos divulgados em junho de 2026
              </caption>
              <thead>
                <tr>
                  <th scope="col">Indicador</th><th scope="col">Resultado</th><th scope="col">Brasil</th><th scope="col">NE</th><th scope="col">Fonte</th>
                </tr>
              </thead>
              <tbody>
                {summaryTable.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => <td key={cell} className={index === 0 ? "is-strong" : ""}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="swot">
          <article className="is-green"><span>Forças</span><p>Indústria, varejo, atividade, turismo, empresas e emprego.</p></article>
          <article className="is-gold"><span>Atenção</span><p>Desaceleração marginal do emprego.</p></article>
          <article className="is-red"><span>Riscos</span><p>Déficit comercial, juros elevados e inadimplência.</p></article>
        </section>

        <footer className="summary-footnote">
          <span>Painel baseado no Boletim Econômico de Pernambuco — Julho/2026 · Dados divulgados até junho/2026.</span>
          <b>Secretaria de Desenvolvimento Econômico de Pernambuco</b>
        </footer>
      </div>
    </main>
  );
}

function AboutPage({ navigate }: { navigate: Navigate }) {
  const cards = [
    ["O que é", "O Farol PE reúne os principais indicadores oficiais sobre a economia e a sociedade pernambucanas, atualizados na periodicidade de cada pesquisa e organizados por tema."],
    ["Para que serve", "A plataforma oferece a gestores públicos, pesquisadores, imprensa e à sociedade uma leitura confiável e atualizada do desempenho de Pernambuco."],
    ["Como explorar", "Os painéis permitem consultar séries históricas, comparar estados, regiões e municípios e visualizar os dados em gráficos, mapas e tabelas."],
    ["Realização", "Uma iniciativa da Secretaria de Desenvolvimento Econômico do Estado de Pernambuco — SDEC-PE."],
  ];

  return (
    <main className="about-page">
      <header className="about-hero">
        <div className="about-photo">
          <img src="/farol.jpg" alt="Farol no litoral pernambucano" />
        </div>
        <div>
          <p className="eyebrow">Farol PE</p>
          <h1>Dados que ajudam Pernambuco a enxergar mais longe.</h1>
          <p>
            O Farol PE é uma plataforma pública de inteligência socioeconômica
            criada para reunir, organizar e apresentar informações estratégicas
            sobre Pernambuco. O projeto aproxima dados oficiais da sociedade e
            transforma evidências em apoio para decisões mais claras.
          </p>
          <button className="button button-light" onClick={() => navigate("/paineis/agricultura")}>
            Conhecer os painéis →
          </button>
        </div>
      </header>
      <section className="about-content-layout">
        <div className="about-narrative">
          <p className="eyebrow dark">Sobre a plataforma</p>
          {cards.map(([title, text]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </section>
          ))}
        </div>

        <aside className="about-credits-panel" aria-labelledby="about-credits-title">
          <p>Colaboração e realização</p>
          <h2 id="about-credits-title">Quem construiu o Farol PE</h2>
          <span>
            Projeto desenvolvido de forma colaborativa, unindo conhecimento
            técnico, análise de dados e construção digital.
          </span>
          <ul>
            {[
              "Pedro Albuquerque",
              "Eduardo Silva",
              "Caio Coutinho",
              "Marcus Ferraz",
            ].map((name, index) => (
              <li key={name}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <strong>{name}</strong>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}

function DataDictionaryPage() {
  return (
    <main className="dictionary-page">
      <header className="dictionary-hero">
        <p className="eyebrow">Dicionário de dados</p>
        <h1>Dados disponíveis nos painéis.</h1>
        <p>
          Consulte um resumo de cada painel e acesse o canal oficial para
          solicitar os dados.
        </p>
      </header>

      <section className="dictionary-list" aria-label="Painéis disponíveis">
        {panels.map((panel) => (
          <article className="dictionary-card" key={panel.slug}>
            <h2>{panel.shortTitle}</h2>
            <p>{panel.description}</p>
            <a
              href={dataRequestUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Solicitar dados do painel ${panel.shortTitle}`}
            >
              Solicitar dados <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}

function PublicationsPage({ navigate }: { navigate: Navigate }) {
  return (
    <main className="coming-page">
      <div className="coming-copy">
        <p className="eyebrow dark">Publicações</p>
        <h1>Análises para ir além dos números.</h1>
        <p>
          Este espaço reunirá boletins, notas técnicas e estudos produzidos a
          partir dos indicadores do Farol PE.
        </p>
        <button className="button button-primary" onClick={() => navigate("/resumo")}>
          Enquanto isso, veja o panorama →
        </button>
      </div>
      <div className="coming-visual" aria-hidden="true">
        <span>EM BREVE</span>
        <div className="document-stack">
          <i /><i /><i />
        </div>
      </div>
    </main>
  );
}

function NotFoundPage({ navigate }: { navigate: Navigate }) {
  return (
    <main className="not-found">
      <span>404</span>
      <h1>Esta rota ainda não está no mapa.</h1>
      <p>O conteúdo pode ter mudado de endereço ou ainda estar em preparação.</p>
      <button className="button button-primary" onClick={() => navigate("/")}>
        Voltar ao início
      </button>
    </main>
  );
}

export default function FarolPortal() {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const [searchOpen, setSearchOpen] = useState(false);

  const navigate: Navigate = (href) => {
    router.push(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
      if (
        event.key === "/" &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const panel = pathname.startsWith("/paineis/")
    ? panels.find((item) => pathname === `/paineis/${item.slug}`)
    : undefined;
  const infoPanel = pathname.startsWith("/indicadores/")
    ? panels.find((item) => pathname === `/indicadores/${item.slug}`)
    : undefined;

  let content: React.ReactNode;
  if (pathname === "/resumo") content = <SummaryPage />;
  else if (pathname === "/sobre") content = <AboutPage navigate={navigate} />;
  else if (pathname === "/dicionario-de-dados") content = <DataDictionaryPage />;
  else if (pathname === "/publicacoes") content = <PublicationsPage navigate={navigate} />;
  else if (panel) content = <PanelPage key={panel.slug} panel={panel} navigate={navigate} />;
  else if (infoPanel?.info) content = <InfoPage panel={infoPanel} navigate={navigate} />;
  else content = <NotFoundPage navigate={navigate} />;

  return (
    <>
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo
      </a>
      {pathname === "/" ? (
        <Home navigate={navigate} onSearch={() => setSearchOpen(true)} />
      ) : (
        <AppShell path={pathname} navigate={navigate} onSearch={() => setSearchOpen(true)}>
          {content}
        </AppShell>
      )}
      {searchOpen && (
        <SearchDialog open onClose={() => setSearchOpen(false)} navigate={navigate} />
      )}
    </>
  );
}
