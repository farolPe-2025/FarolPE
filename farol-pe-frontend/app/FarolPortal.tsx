"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChartNoAxesCombined,
  ChevronRight,
  Compass,
  Download,
  FileText,
  HandCoins,
  House,
  Info,
  LayoutGrid,
  Leaf,
  Menu,
  Search,
  Users,
  X,
  BarChart3,
} from "lucide-react";
import {
  mainLinks,
  panels,
  searchItems,
  summaryKpis,
  summaryTable,
  type Panel,
} from "./portal-data";

type Navigate = (href: string) => void;

const PANEL_REVEAL_MINIMUM_MS = 2_800;
const PANEL_REVEAL_SETTLE_MS = 700;
const PANORAMA_REVEAL_MINIMUM_MS = 900;
const FRAME_LOAD_TIMEOUT_MS = 30_000;

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

type PublicationKind = "technical-note" | "news" | "report" | "bulletin";
type PublicationRange = "all" | "30" | "90" | "365";

function FarolName({ className = "" }: { className?: string }) {
  return (
    <span className={`farol-name ${className}`.trim()}>
      <span className="farol-name-word">Farol</span>
      <span className="farol-name-state">PE</span>
    </span>
  );
}

const activityBars = [
  ["Atividade", "+5,1%", 34, "blue"],
  ["Indústria", "+14,9%", 100, "green"],
  ["Varejo", "+11,0%", 74, "gold"],
  ["Serviços", "-0,3%", 2, "slate"],
  ["Turismo", "-2,6%", 17, "orange"],
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

const publicationKindOptions = [
  { value: "all", label: "Todos" },
  { value: "technical-note", label: "Notas Técnicas" },
  { value: "news", label: "Notícias de PE" },
  { value: "report", label: "Relatórios Analíticos" },
  { value: "bulletin", label: "Boletins Econômicos" },
] as const;

const dataRequestUrls: Partial<Record<(typeof sidebarPanelGroups)[number]["id"], string>> = {
  economic: "https://forms.gle/Ky4y4akU6UJJ3GTv7",
  agriculture: "https://forms.gle/eeio4YLBs8V47fKE7",
  sectoral: "https://forms.gle/7G81FS6xyxwVhHjj6",
};

const publicationRangeOptions = [
  { value: "all", label: "Todo o período" },
  { value: "30", label: "Últimos 30 dias" },
  { value: "90", label: "Últimos 3 meses" },
  { value: "365", label: "Últimos 12 meses" },
] as const;

const publicationTypeLabels: Record<PublicationKind, string> = {
  "technical-note": "Nota Técnica",
  news: "Notícia de PE",
  report: "Relatório Analítico",
  bulletin: "Boletim Econômico",
};

const publicationItems = [
  {
    id: "nota-tecnica-dinamica-empresarial-junho-2026",
    kind: "technical-note" as const,
    title: "Dinâmica empresarial de Pernambuco em junho de 2026",
    summary:
      "Em junho de 2026, Pernambuco registrou a abertura de 12.226 empresas – o 10º maior volume do país e o 3º do Nordeste. Desde 2009, é o maior resultado para um mês de junho, 11,6% acima de junho de 2025 (10.958 aberturas).",
    source: "SDEC-PE",
    publishedAt: "2026-06-30",
    displayDate: "jun. 2026",
    image: "/SDEC_FAROLPE_SÍMBOLO_SITE_v2.png",
    imageAlt: "Símbolo do FarolPE",
    href: "https://drive.google.com/file/d/1SEgyO4ynuPrVY3zeXbGKrafxkQS5Rr3/view?usp=sharing",
  },
  {
    id: "relatorio-analitico-piscicultura-pernambuco",
    kind: "report" as const,
    title: "Relatório Analítico Setorial: Piscicultura de Pernambuco",
    summary:
      "A piscicultura da tilápia é uma das principais atividades do agronegócio no Sertão de Pernambuco. A atividade apresenta elevada relevância econômica, social e ambiental, contribuindo para a geração de emprego, renda e segurança alimentar, além de impulsionar a diversificação da economia regional.",
    source: "SDEC-PE",
    publishedAt: "2026-06-30",
    displayDate: "2026",
    image: "/SDEC_FAROLPE_SÍMBOLO_SITE_v2.png",
    imageAlt: "Símbolo do FarolPE",
    href: "https://drive.google.com/file/d/15JXPhjlnoo4Lqm_AMG9MKz52RDeZL2Uu/view?usp=sharing",
  },
];

const sidebarPanelGroups = [
  {
    id: "economic",
    label: "Dinâmica Econômica",
    summary:
      "Acompanhe os principais indicadores conjunturais que mostram o ritmo da economia pernambucana.",
    icon: ChartNoAxesCombined,
    tone: "economic",
    slugs: ["atividade-economica", "industria", "comercio", "servicos", "turismo"],
  },
  {
    id: "sectoral",
    label: "Estrutura Setorial",
    summary:
      "Explore a composição e o desempenho dos principais setores da economia.",
    icon: Building2,
    tone: "sectoral",
    slugs: ["estrutura-industrial", "panorama-comercio", "panorama-servicos"],
  },
  {
    id: "income",
    label: "Produção e Renda",
    summary:
      "Acompanhe indicadores que revelam a geração de riqueza, renda e atividade econômica em Pernambuco.",
    icon: HandCoins,
    tone: "income",
    slugs: [
      "produto-interno-bruto",
      "valor-adicionado-bruto",
      "arrecadacao",
      "rendimentos",
      "pix",
    ],
  },
  {
    id: "agriculture",
    label: "Agropecuária",
    summary:
      "Explore a produção agrícola, pecuária e aquícola, acompanhando sua evolução e importância para o estado.",
    icon: Leaf,
    tone: "agriculture",
    slugs: ["agricultura"],
    nestedLabel: "Pecuária",
    nestedSlugs: ["aquicultura", "origem-animal", "rebanhos"],
  },
  {
    id: "employment",
    label: "Emprego",
    summary:
      "Monitore a evolução do emprego, da ocupação, dos rendimentos e das condições do mercado de trabalho.",
    icon: Users,
    tone: "employment",
    slugs: [
      "estoque-de-emprego",
      "fluxo-de-emprego",
      "outros-indicadores-de-emprego",
    ],
  },
] as const;

const panoramaTopics = [
  { key: "__all", label: "Panorama geral" },
  { key: "dest", label: "Destaques" },
  { key: "cmp", label: "Dinâmica Econômica" },
  { key: "trab", label: "Mercado de Trabalho" },
  { key: "emp", label: "Dinâmica Empresarial" },
  { key: "cext", label: "Comércio Exterior" },
  { key: "sint", label: "Quadro-síntese" },
  { key: "prox", label: "Calendário de Dados" },
] as const;

type PanoramaTopicKey = (typeof panoramaTopics)[number]["key"];

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-lockup ${compact ? "is-compact" : ""}`}>
      <img
        className="brand-logo"
        src={
          compact
            ? "/SDEC_FAROLPE_VERTICAL_VARIAÇÃO.png"
            : "/SDEC_FAROLPE_HORIZONTAL_VARIAÇÃO.png"
        }
        alt="FarolPE — Observatório Socioeconômico de Pernambuco"
      />
    </div>
  );
}

function SdecLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`sdec-lockup ${compact ? "is-compact" : ""}`}>
      <span className="sdec-logo-crop">
        <img
          src="/sdec-gov-branco.png"
          alt="Secretaria de Desenvolvimento Econômico — Governo de Pernambuco"
        />
      </span>
    </span>
  );
}

function SearchIcon() {
  return <Search className="search-glyph" aria-hidden="true" />;
}

function PageHero({
  className = "",
  eyebrow,
  title,
  description,
  action,
}: {
  className?: string;
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className={`page-hero ${className}`.trim()}>
      <div className="page-hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="page-hero-description">{description}</p>}
      </div>
      {action && <div className="page-hero-action">{action}</div>}
    </header>
  );
}

type FramePhase = "loading" | "settling" | "ready" | "timeout";

function DeferredFrame({
  id,
  src,
  title,
  loaderTitle,
  loaderDescription,
  minimumMs = PANEL_REVEAL_MINIMUM_MS,
  settleMs = PANEL_REVEAL_SETTLE_MS,
  onFrameLoad,
}: {
  id?: string;
  src: string;
  title: string;
  loaderTitle: string;
  loaderDescription: string;
  minimumMs?: number;
  settleMs?: number;
  onFrameLoad?: (event: SyntheticEvent<HTMLIFrameElement>) => void;
}) {
  const clientReady = useSyncExternalStore(
    subscribeToHydration,
    getClientHydrationSnapshot,
    getServerHydrationSnapshot,
  );
  const [attempt, setAttempt] = useState(0);
  const [phase, setPhase] = useState<FramePhase>("loading");
  const startedAtRef = useRef(0);
  const revealTimerRef = useRef<number | null>(null);
  const timeoutTimerRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!clientReady) return;

    startedAtRef.current = performance.now();
    timeoutTimerRef.current = window.setTimeout(() => {
      setPhase("timeout");
    }, FRAME_LOAD_TIMEOUT_MS);

    return () => {
      if (revealTimerRef.current !== null) {
        window.clearTimeout(revealTimerRef.current);
      }
      if (timeoutTimerRef.current !== null) {
        window.clearTimeout(timeoutTimerRef.current);
      }
    };
  }, [attempt, clientReady, src]);

  const handleLoad = (event: SyntheticEvent<HTMLIFrameElement>) => {
    if (timeoutTimerRef.current !== null) {
      window.clearTimeout(timeoutTimerRef.current);
    }
    if (revealTimerRef.current !== null) {
      window.clearTimeout(revealTimerRef.current);
    }

    const elapsed = performance.now() - startedAtRef.current;
    const revealDelay = Math.max(settleMs, minimumMs - elapsed);
    setPhase("settling");
    revealTimerRef.current = window.setTimeout(() => {
      setPhase("ready");
    }, revealDelay);
    onFrameLoad?.(event);
  };

  const handleRetry = () => {
    setPhase("loading");
    setAttempt((value) => value + 1);
  };

  const ready = phase === "ready";
  const busy = phase === "loading" || phase === "settling";

  return (
    <div
      className="iframe-wrap"
      aria-busy={busy}
      data-frame-state={phase}
    >
      {!ready && (
        <div
          className="panel-loading"
          role={phase === "timeout" ? "alert" : "status"}
          aria-live="polite"
        >
          {phase === "timeout" ? (
            <div className="panel-loading-timeout">
              <strong>O painel está demorando para responder</strong>
              <small>Verifique sua conexão e tente carregar novamente.</small>
              <button
                className="button panel-retry-button"
                type="button"
                onClick={handleRetry}
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <>
              <span className="lighthouse-loader-icon" aria-hidden="true">
                <img
                  className="lighthouse-loader-base"
                  src="/SDEC_FAROLPE_SÍMBOLO_SITE_v2.png"
                  alt=""
                />
                <img
                  className="lighthouse-loader-yellow"
                  src="/SDEC_FAROLPE_SÍMBOLO_SITE_v2.png"
                  alt=""
                />
              </span>
              <strong>
                {phase === "settling" ? "Finalizando a visualização" : loaderTitle}
              </strong>
              <small>{loaderDescription}</small>
            </>
          )}
        </div>
      )}
      {clientReady && (
        <iframe
          key={`${src}-${attempt}`}
          id={id}
          src={src}
          title={title}
          loading="eager"
          allowFullScreen
          onLoad={handleLoad}
          className={ready ? "is-loaded" : ""}
          tabIndex={ready ? 0 : -1}
          aria-hidden={!ready}
        />
      )}
    </div>
  );
}

function AnimatedMetric({ value, delay = 0 }: { value: string; delay?: number }) {
  const elementRef = useRef<HTMLElement>(null);
  const metric = useMemo(() => {
    const normalized = value.replace(/\./g, "").replace(",", ".");
    const target = Number(normalized.match(/-?\d+(?:\.\d+)?/)?.[0] ?? 0);
    const decimals = value.match(/,(\d+)/)?.[1].length ?? 0;

    return {
      target,
      decimals,
      showPlus: value.trim().startsWith("+"),
      showPercent: value.includes("%"),
    };
  }, [value]);

  const formatValue = useCallback((current: number) => {
    const formatted = current.toLocaleString("pt-BR", {
      minimumFractionDigits: metric.decimals,
      maximumFractionDigits: metric.decimals,
    });

    return `${metric.showPlus && current >= 0 ? "+" : ""}${formatted}${
      metric.showPercent ? "%" : ""
    }`;
  }, [metric]);

  const [displayValue, setDisplayValue] = useState(() => formatValue(0));

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionTimer = window.setTimeout(() => {
        setDisplayValue(value);
      }, 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }

    let animationFrame = 0;
    let startTimer = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        startTimer = window.setTimeout(() => {
          const startedAt = performance.now();
          const duration = 1250;

          const animate = (now: number) => {
            const progress = Math.min((now - startedAt) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(formatValue(metric.target * easedProgress));

            if (progress < 1) {
              animationFrame = window.requestAnimationFrame(animate);
            } else {
              setDisplayValue(value);
            }
          };

          animationFrame = window.requestAnimationFrame(animate);
        }, delay);
      },
      { threshold: 0.45 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      window.clearTimeout(startTimer);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [delay, formatValue, metric, value]);

  return (
    <strong ref={elementRef} aria-label={value}>
      {displayValue}
    </strong>
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
            <X aria-hidden="true" />
          </button>
        </div>
        <label className="search-field">
          <SearchIcon />
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
          <button className="brand-button" onClick={() => navigate("/")} aria-label="FarolPE — início">
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
            <SearchIcon />
          </button>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <h1>
              Ver com clareza.
              <strong>Decidir com segurança.</strong>
              Construir o futuro de Pernambuco.
            </h1>
            <p className="hero-lead">
              Mudaram as embarcações. Mudaram as rotas. A necessidade de
              orientação permanece. O <FarolName className="is-on-dark" />
              {" "}transforma dados em direção para compreender Pernambuco.
            </p>
           <div className="hero-actions">
              <button
                className="button button-primary"
                onClick={() => navigate("/paineis/atividade-economica")}
              >
                <BarChart3 className="action-icon" aria-hidden="true" />
                <span>Navegue pelos dados</span>
              </button>

              <button
                className="button button-ghost"
                onClick={() => navigate("/resumo")}
              >
                <Compass className="action-icon" aria-hidden="true" />
                <span>Conheça o panorama do estado</span>
              </button>
            </div>
          </div>

          <div className="home-more-strip">
            <button
              onClick={() =>
                document.getElementById("home-analysis")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
            >
              <span aria-hidden="true">↓</span> Veja mais
            </button>
          </div>
        </section>
      </main>

      <section id="home-analysis" className="home-analysis" aria-labelledby="home-analysis-title">
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
              <AnimatedMetric value={item.value} delay={index * 90} />
              <small>{item.note}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="home-why" aria-labelledby="home-why-title">
        <div className="home-why-heading reveal-on-scroll">
          <p>Conhecimento que orienta</p>
          <h2 id="home-why-title">
            Por que <FarolName />?
          </h2>
          <span className="home-why-symbol" aria-hidden="true">
            <img
              src="/SDEC_FAROLPE_SÍMBOLO_SITE-removebg-preview.png"
              alt=""
            />
          </span>
        </div>
        <div className="home-why-copy reveal-on-scroll">
          <p>
            Desde a Antiguidade, os faróis representam muito mais do que
            estruturas construídas à beira-mar. São símbolos de orientação,
            segurança e confiança. Em meio à imensidão dos oceanos, sua luz
            nunca conduziu embarcações diretamente, mas ofereceu aos navegantes
            a informação necessária para que escolhessem, com segurança, o
            melhor caminho até seu destino. O farol não substituía a decisão do
            comandante; iluminava o percurso para que ela fosse tomada com
            maior precisão.
          </p>
          <p>
            Hoje, os mares deram lugar a um ambiente igualmente dinâmico e
            desafiador: a economia, a sociedade e os mercados. Gestores
            públicos, investidores, empresários, pesquisadores e cidadãos
            também enfrentam incertezas e precisam tomar decisões em um cenário
            de constantes transformações. Nesse contexto, surge o <FarolName />.
          </p>
          <p>
            Por meio da análise de informações, do monitoramento contínuo e da
            produção de conhecimento qualificado, o <FarolName /> revela
            tendências, identifica oportunidades, antecipa desafios e oferece
            subsídios para decisões fundamentadas em evidências. Cada indicador
            analisado representa um ponto de luz que, integrado a diversos
            outros, forma um amplo panorama da realidade socioeconômica do
            Estado.
          </p>
          <p>
            Dessa forma, o compromisso do <FarolName /> é fortalecer a
            governança, ampliar a transparência, estimular o ambiente de
            negócios e contribuir para um desenvolvimento sustentável, baseado
            em informação confiável e visão de longo prazo.
          </p>
        </div>
      </section>

      <footer className="home-footer">
        <SdecLogo />
        <span>Conhecimento que guia</span>
      </footer>
    </div>
  );
}

function Sidebar({
  path,
  navigate,
  open,
  collapsed,
  onClose,
  onSearch,
  onToggleCollapse,
}: {
  path: string;
  navigate: Navigate;
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onSearch: () => void;
  onToggleCollapse: () => void;
}) {
  const isPanoramaContext = path === "/resumo";
  const isPanelsContext =
    path.startsWith("/paineis/") || path.startsWith("/indicadores/");
  const activePanelSlug =
    path.match(/^\/(?:paineis|indicadores)\/([^/]+)/)?.[1] ?? "";
  const activeGroup =
    sidebarPanelGroups.find(
      (group) =>
        group.slugs.includes(activePanelSlug as never) ||
        ("nestedSlugs" in group &&
          group.nestedSlugs.includes(activePanelSlug as never)),
    )?.id ?? null;
  const defaultLivestockOpen = ["aquicultura", "origem-animal", "rebanhos"].includes(
    activePanelSlug,
  );
  const [groupPreference, setGroupPreference] = useState<{
    path: string;
    group: string | null;
  }>({ path, group: activeGroup });
  const [livestockPreference, setLivestockPreference] = useState<{
    path: string;
    open: boolean;
  }>({ path, open: defaultLivestockOpen });
  const openGroup =
    groupPreference.path === path ? groupPreference.group : activeGroup;
  const livestockOpen =
    livestockPreference.path === path
      ? livestockPreference.open
      : defaultLivestockOpen;
  const [activePanoramaTopic, setActivePanoramaTopic] =
    useState<PanoramaTopicKey>("__all");

  useEffect(() => {
    const syncPanoramaTopic = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const frame = document.getElementById(
        "panorama-frame",
      ) as HTMLIFrameElement | null;
      if (!frame?.contentWindow || event.source !== frame.contentWindow) return;

      const message = event.data as
        | { type?: string; section?: PanoramaTopicKey }
        | undefined;
      if (message?.type !== "farol-panorama-section") return;
      if (!panoramaTopics.some((topic) => topic.key === message.section)) return;

      const requestedTopic = window.sessionStorage.getItem(
        "farol-panorama-topic",
      ) as PanoramaTopicKey | null;

      if (
        requestedTopic &&
        requestedTopic !== message.section &&
        panoramaTopics.some((topic) => topic.key === requestedTopic)
      ) {
        frame?.contentWindow?.postMessage(
          { type: "farol-panorama-select", section: requestedTopic },
          window.location.origin,
        );
        return;
      }

      setActivePanoramaTopic(message.section as PanoramaTopicKey);
    };

    window.addEventListener("message", syncPanoramaTopic);
    return () => window.removeEventListener("message", syncPanoramaTopic);
  }, []);

  const go = (href: string) => {
    navigate(href);
    onClose();
  };

  const showPanorama = () => {
    window.sessionStorage.setItem("farol-panorama-topic", "__all");
    setActivePanoramaTopic("__all");

    if (!isPanoramaContext) {
      navigate("/resumo");
      return;
    }

    const frame = document.getElementById(
      "panorama-frame",
    ) as HTMLIFrameElement | null;
    frame?.contentWindow?.postMessage(
      { type: "farol-panorama-select", section: "__all" },
      window.location.origin,
    );
  };

  const showPanels = () => {
    if (!isPanelsContext) navigate("/paineis/atividade-economica");
  };

  const selectPanoramaTopic = (topic: PanoramaTopicKey) => {
    window.sessionStorage.setItem("farol-panorama-topic", topic);
    setActivePanoramaTopic(topic);

    const frame = document.getElementById(
      "panorama-frame",
    ) as HTMLIFrameElement | null;
    frame?.contentWindow?.postMessage(
      { type: "farol-panorama-select", section: topic },
      window.location.origin,
    );
    onClose();
  };

  const panelButton = (panel: Panel, nested = false) => (
    <div className="sidebar-panel-row" key={panel.slug}>
      <button
        className={`sidebar-link ${nested ? "is-nested" : ""} ${
          path === `/paineis/${panel.slug}` || path === `/indicadores/${panel.slug}`
            ? "is-active"
            : ""
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
          <Info aria-hidden="true" />
        </button>
      )}
    </div>
  );

  const panelButtonBySlug = (slug: string, nested = false) => {
    const panel = panels.find((item) => item.slug === slug);
    return panel ? panelButton(panel, nested) : null;
  };

  return (
    <>
      <button
        className={`drawer-scrim ${open ? "is-open" : ""}`}
        onClick={onClose}
        aria-label="Fechar menu"
      />
      <aside className={`sidebar ${open ? "is-open" : ""} ${collapsed ? "is-collapsed" : ""}`}>
        <div className="sidebar-brand">
          <button className="brand-button" onClick={() => go("/")}>
            <Brand compact />
          </button>
        </div>

        <div className="sidebar-tools">
          <button
            className={`sidebar-search ${collapsed ? "is-collapsed" : ""}`}
            onClick={() => {
              onClose();
              onSearch();
            }}
            aria-label="Pesquisar no FarolPE"
            title="Pesquisar no FarolPE"
          >
            <SearchIcon />
            <span>Buscar indicadores e temas</span>
            <kbd>/</kbd>
          </button>

          <div className="sidebar-actions">
            <button
              className="sidebar-collapse-toggle"
              onClick={onToggleCollapse}
              aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
              title={collapsed ? "Expandir menu" : "Recolher menu"}
            >
              <svg
                className="sidebar-collapse-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              className="drawer-close"
              onClick={onClose}
              aria-label="Fechar menu"
            >
              <X aria-hidden="true" />
            </button>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Navegação principal">
          <div className="sidebar-primary-tabs" aria-label="Áreas do FarolPE">
            <button
              className={path === "/" ? "is-active" : ""}
              onClick={() => go("/")}
              title="Início"
              aria-current={path === "/" ? "page" : undefined}
            >
              <span className="primary-icon icon-home" aria-hidden="true">
                <House />
              </span>
              <span>Início</span>
            </button>
            <button
              className={isPanoramaContext ? "is-active" : ""}
              onClick={showPanorama}
              title="Panorama"
              aria-current={isPanoramaContext ? "page" : undefined}
            >
              <span className="primary-icon icon-panorama" aria-hidden="true">
                <Compass />
              </span>
              <span>Panorama</span>
            </button>
            <button
              className={isPanelsContext ? "is-active" : ""}
              onClick={showPanels}
              title="Painéis"
              aria-current={isPanelsContext ? "page" : undefined}
            >
              <span className="primary-icon icon-panels" aria-hidden="true">
                <LayoutGrid />
              </span>
              <span>Painéis</span>
            </button>
          </div>

          {collapsed && (
            <aside
              className="collapsed-panels-flyout"
              aria-label="Acesso rápido aos painéis"
            >
              <strong className="collapsed-panels-flyout-title">Painéis do FarolPE</strong>
              {sidebarPanelGroups.map((group) => {
                const GroupIcon = group.icon;
                const groupSlugs = [
                  ...group.slugs,
                  ...("nestedSlugs" in group ? group.nestedSlugs : []),
                ];
                const isFlyoutGroupOpen = openGroup === group.id;
                const flyoutGroupId = `collapsed-panels-${group.id}`;

                return (
                  <section className="collapsed-panels-group" key={group.id}>
                    <button
                      className="collapsed-panels-group-toggle"
                      onClick={() =>
                        setGroupPreference({
                          path,
                          group: isFlyoutGroupOpen ? null : group.id,
                        })
                      }
                      aria-expanded={isFlyoutGroupOpen}
                      aria-controls={flyoutGroupId}
                    >
                      <GroupIcon aria-hidden="true" />
                      <span>{group.label}</span>
                      <ChevronRight className="collapsed-panels-chevron" aria-hidden="true" />
                    </button>
                    {isFlyoutGroupOpen && (
                      <div className="collapsed-panels-items" id={flyoutGroupId}>
                        {groupSlugs.map((slug) => {
                          const panel = panels.find((item) => item.slug === slug);
                          if (!panel) return null;

                          return (
                            <button
                              key={panel.slug}
                              className={
                                path === `/paineis/${panel.slug}` ? "is-active" : ""
                              }
                              onClick={() => go(`/paineis/${panel.slug}`)}
                            >
                              {panel.shortTitle}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
            </aside>
          )}

          {isPanoramaContext && (
            <section
              className="sidebar-context sidebar-panorama-context"
              aria-labelledby="sidebar-panorama-title"
            >
              <div className="sidebar-context-heading">
                <span id="sidebar-panorama-title">Tópicos do panorama</span>
              </div>
              <div className="panorama-topic-list">
                {panoramaTopics.map((topic) => (
                  <button
                    key={topic.key}
                    className={
                      activePanoramaTopic === topic.key ? "is-active" : ""
                    }
                    onClick={() => selectPanoramaTopic(topic.key)}
                    aria-current={
                      activePanoramaTopic === topic.key ? "true" : undefined
                    }
                  >
                    <span>{topic.label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {isPanelsContext && (
            <section
              className="sidebar-context sidebar-panels-context"
              aria-labelledby="sidebar-panels-title"
            >
              <div className="sidebar-context-heading">
                <span id="sidebar-panels-title">Painéis do FarolPE</span>
              </div>
              <div className="sidebar-panel-groups">
                {sidebarPanelGroups.map((group) => {
                  const isOpen = openGroup === group.id;
                  const childrenId = `sidebar-group-${group.id}`;
                  const GroupIcon = group.icon;
                  const panelCount =
                    group.slugs.length +
                    ("nestedSlugs" in group ? group.nestedSlugs.length : 0);
                  const containsActivePanel = activeGroup === group.id;

                  return (
                    <div
                      className={`nav-group ${isOpen ? "is-open" : ""}`.trim()}
                      key={group.id}
                    >
                      <button
                        className={`group-toggle ${
                          containsActivePanel ? "contains-active" : ""
                        }`.trim()}
                        onClick={() =>
                          setGroupPreference({
                            path,
                            group: openGroup === group.id ? null : group.id,
                          })
                        }
                        aria-expanded={isOpen}
                        aria-controls={childrenId}
                      >
                        <span className="group-title-line">
                          <i
                            className={`group-icon tone-${group.tone}`}
                            aria-hidden="true"
                          >
                            <GroupIcon />
                          </i>
                          <strong>{group.label}</strong>
                        </span>
                        <span className="group-toggle-state">
                          <small
                            className="group-count"
                            aria-label={`${panelCount} painéis`}
                          >
                            {panelCount}
                          </small>
                          <ChevronRight
                            className="nav-chevron"
                            aria-hidden="true"
                          />
                        </span>
                        {isOpen && (
                          <span className="group-summary">{group.summary}</span>
                        )}
                      </button>
                      {isOpen && (
                        <div className="group-children" id={childrenId}>
                          {group.slugs.map((slug) => panelButtonBySlug(slug))}
                          {"nestedSlugs" in group && (
                            <>
                              <button
                                className="subgroup-toggle"
                                onClick={() =>
                                  setLivestockPreference({
                                    path,
                                    open: !livestockOpen,
                                  })
                                }
                                aria-expanded={livestockOpen}
                                aria-controls={`sidebar-group-${group.id}-livestock`}
                              >
                                <span>{group.nestedLabel}</span>
                                <ChevronRight className="nav-chevron" aria-hidden="true" />
                              </button>
                              {livestockOpen && (
                                <div
                                  className="subgroup-children"
                                  id={`sidebar-group-${group.id}-livestock`}
                                >
                                  {group.nestedSlugs.map((slug) =>
                                    panelButtonBySlug(slug, true),
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <div className="sidebar-services">
            <div className="sidebar-context-heading">
              <span>Serviços</span>
            </div>
            <button
              className={
                path === "/dicionario-de-dados"
                  ? "sidebar-main is-active"
                  : "sidebar-main"
              }
              onClick={() => go("/dicionario-de-dados")}
              title="Download dos Dados"
              data-tooltip="Download dos Dados"
              aria-current={
                path === "/dicionario-de-dados" ? "page" : undefined
              }
            >
              <span className="nav-symbol tone-download" aria-hidden="true">
                <Download />
              </span>
              Download dos Dados
            </button>
            <button
              className={
                path === "/publicacoes"
                  ? "sidebar-main is-active"
                  : "sidebar-main"
              }
              onClick={() => go("/publicacoes")}
              title="Publicações"
              data-tooltip="Publicações"
              aria-current={path === "/publicacoes" ? "page" : undefined}
            >
              <span className="nav-symbol tone-publications" aria-hidden="true">
                <FileText />
              </span>
              Publicações
            </button>
            <button
              className={
                path === "/sobre" ? "sidebar-main is-active" : "sidebar-main"
              }
              onClick={() => go("/sobre")}
              title="Sobre"
              data-tooltip="Sobre"
              aria-current={path === "/sobre" ? "page" : undefined}
            >
              <span className="nav-symbol tone-about" aria-hidden="true">
                <Info />
              </span>
              Sobre
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <SdecLogo compact />
          {collapsed && (
            <button
              className="sidebar-symbol-home"
              onClick={() => go("/")}
              aria-label="Voltar para a página inicial"
              title="Início"
            >
              <img
                className="sidebar-symbol-logo"
                src="/SDEC_FAROLPE_SÍMBOLO_SITE-removebg-preview.png"
                alt=""
              />
            </button>
          )}
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    <div className={`portal-shell ${sidebarCollapsed ? "is-sidebar-collapsed" : ""}`}>
      <Sidebar
        path={path}
        navigate={navigate}
        open={drawerOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setDrawerOpen(false)}
        onSearch={onSearch}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
      />
      <div className="portal-main">
        <header className="mobile-topbar">
          <button onClick={() => setDrawerOpen(true)} aria-label="Abrir menu">
            <Menu aria-hidden="true" />
          </button>
          <button
            className="brand-button"
            onClick={() => navigate("/")}
            aria-label="FarolPE — início"
          >
            <Brand />
          </button>
          <button onClick={onSearch} aria-label="Pesquisar">
            <SearchIcon />
          </button>
        </header>
        <div id="main-content">{children}</div>
      </div>
    </div>
  );
}

function PanelPage({ panel, navigate }: { panel: Panel; navigate: Navigate }) {
  if (panel.embedUrl) {
    return (
      <main className="panel-page is-embedded" aria-label={panel.title}>
        <section className="panel-stage">
          <DeferredFrame
            key={panel.embedUrl}
            src={panel.embedUrl}
            title={panel.title}
            loaderTitle="Carregando o painel"
            loaderDescription="Conectando à fonte de dados oficial…"
          />
        </section>
      </main>
    );
  }

  return (
    <main className="panel-page">
      <PageHero
        className="panel-page-hero"
        eyebrow={`Painéis · ${panel.category}`}
        title={panel.title}
        description={panel.description}
        action={
          panel.info ? (
            <button className="button button-outline" onClick={() => navigate(`/indicadores/${panel.slug}`)}>
              <span className="info-circle">i</span> Sobre o indicador
            </button>
          ) : undefined
        }
      />

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
      <PageHero
        className="info-hero"
        eyebrow={panel.info.eyebrow}
        title={panel.info.title}
        description={
          <>
            Entenda a origem, o cálculo e a melhor forma de interpretar este
            indicador.
          </>
        }
        action={
          <button
            className="button button-outline"
            onClick={() => navigate(`/paineis/${panel.slug}`)}
          >
            ← Voltar ao painel
          </button>
        }
      />
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

function EconomicPanoramaPage() {
  return (
    <main className="panel-page is-embedded is-panorama" aria-label="Panorama Econômico de Pernambuco">
      <section className="panel-stage">
        <DeferredFrame
          id="panorama-frame"
          src="/painel-conjuntura-2026-08-10 (5).html"
          title="Painel de Conjuntura Econômica de Pernambuco"
          loaderTitle="Carregando o panorama econômico"
          loaderDescription="Preparando os indicadores de Pernambuco…"
          minimumMs={PANORAMA_REVEAL_MINIMUM_MS}
          settleMs={250}
          onFrameLoad={(event) => {
              const storedTopic = window.sessionStorage.getItem(
                "farol-panorama-topic",
              ) as PanoramaTopicKey | null;
              const requestedTopic = panoramaTopics.some(
                (topic) => topic.key === storedTopic,
              )
                ? storedTopic
                : "__all";

              event.currentTarget.contentWindow?.postMessage(
                {
                  type: "farol-panorama-select",
                  section: requestedTopic,
                },
                window.location.origin,
              );
          }}
        />
      </section>
    </main>
  );
}

function SummaryPage() {
  return (
    <main className="summary-page">
      <header className="summary-hero">
        <div>
          <p className="eyebrow">Panorama Econômico de PE · Julho / 2026</p>
          <h1>
            Boletim econômico
            <br />
            de Pernambuco
          </h1>
          <p>
            Atividade, indústria, comércio e serviços atualizados com os dados
            de maio de 2026. Os demais temas permanecem sinalizados até a
            próxima atualização.
          </p>
        </div>
        <aside>
          <span>Leitura central</span>
          <strong>
            Atividade, indústria e varejo seguem fortes; serviços apresentam
            acomodação na margem.
          </strong>
        </aside>
      </header>

      <div className="summary-body">
        <section className="summary-kpis" aria-label="Principais indicadores">
          {summaryKpis.map((item) => (
            <article key={item.label} className={`tone-${item.tone}`}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small className={item.note === "Pendente de atualização" ? "summary-kpi-pending" : ""}>{item.note}</small>
            </article>
          ))}
        </section>

        <section className="summary-section">
          <div className="summary-heading">
            <p>Atividade econômica</p>
            <h2>Motores do crescimento estadual</h2>
            <span>
              Pernambuco combina atividade acima da média nacional, forte
              expansão industrial e liderança do varejo, enquanto serviços e
              turismo recuaram em maio.
            </span>
          </div>
          <div className="summary-grid">
            <BarChart title="Variação por setor" items={activityBars} />
            <div className="insight-grid">
              {[
                ["IBCR", "+5,1%", "Acumulado do ano; 2º do Brasil e 1º do Nordeste."],
                ["Indústria", "+14,9%", "Acumulado do ano; 2º maior avanço do Brasil."],
                ["Serviços", "-0,3%", "Acumulado do ano; queda de 0,6% na margem."],
                ["Turismo", "-2,6%", "Recuo em maio frente a abril."],
              ].map(([label, value, note]) => (
                <article key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <p>{note}</p>
                </article>
              ))}
            </div>
          </div>
          <p className="summary-inline-status">
            Indicadores estruturais da indústria
            <span className="summary-status is-pending">Pendente de atualização</span>
          </p>
          <div className="mini-stats">
            <article className="is-navy"><span>VBPI industrial</span><strong>R$ 143,3 bi</strong></article>
            <article className="is-green"><span>Empresas industriais</span><strong>5.397</strong></article>
            <article className="is-slate"><span>Produtividade média</span><strong>R$ 673 mil</strong></article>
          </div>
        </section>

        <section className="summary-section">
          <div className="summary-heading">
            <p>Dinâmica empresarial e meios de pagamento <span className="summary-status is-pending">Pendente de atualização</span></p>
            <h2>Abertura de empresas e Pix</h2>
          </div>
          <div className="summary-grid even">
            <BarChart title="Abertura e formalização" items={businessBars} />
            <BarChart title="Pix no Nordeste (R$ bi)" items={pixBars} />
          </div>
        </section>

        <section className="summary-section">
          <div className="summary-heading">
            <p>Comércio exterior <span className="summary-status is-pending">Pendente de atualização</span></p>
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
            <p>Mercado de trabalho <span className="summary-status is-pending">Pendente de atualização</span></p>
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
            <p>Indicadores sociais <span className="summary-status is-pending">Pendente de atualização</span></p>
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
            <h2>Indicadores do boletim de julho de 2026</h2>
          </div>
          <div className="summary-table-wrap">
            <table>
              <caption className="sr-only">
                Síntese dos indicadores econômicos do boletim de julho de 2026
              </caption>
              <thead>
                <tr>
                  <th scope="col">Indicador</th><th scope="col">Resultado</th><th scope="col">Brasil</th><th scope="col">NE</th><th scope="col">Fonte</th><th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {summaryTable.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => (
                      <td
                        key={`${cell}-${index}`}
                        className={[
                          index === 0 ? "is-strong" : "",
                        ].filter(Boolean).join(" ")}
                      >
                        {index === 5 ? (
                          <span className={`summary-table-status ${cell === "Atualizado" ? "is-updated" : "is-pending"}`}>
                            {cell}
                          </span>
                        ) : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="swot">
          <article className="is-green"><span>Forças</span><p>Indústria, varejo e atividade econômica.</p></article>
          <article className="is-gold"><span>Atenção</span><p>Acomodação dos serviços e retração do turismo em maio.</p></article>
          <article className="is-red"><span>Pendente</span><p>Empresas, Pix, emprego, comércio exterior e inadimplência aguardam atualização.</p></article>
        </section>

        <footer className="summary-footnote">
          <span>Painel baseado no Boletim Econômico de Pernambuco — Julho/2026 · Atividade, indústria, comércio e serviços atualizados até maio/2026.</span>
          <b>Secretaria de Desenvolvimento Econômico de Pernambuco</b>
        </footer>
      </div>
    </main>
  );
}

function AboutPage({ navigate }: { navigate: Navigate }) {
  const cards: Array<{ title: string; text: ReactNode }> = [
    {
      title: "Conhecimento que guia",
      text: (
        <>
          Desde a Antiguidade, os faróis orientam quem navega em busca de novos
          horizontes. Hoje, o <FarolName /> leva esse mesmo princípio para a
          economia pernambucana: transformar dados em conhecimento para orientar
          decisões, reduzir incertezas e apoiar o desenvolvimento do estado.
        </>
      ),
    },
    {
      title: "O que é",
      text: (
        <>
          O <FarolName /> reúne os principais indicadores oficiais sobre a
          economia e a sociedade pernambucanas, organizados por tema e
          atualizados conforme a periodicidade de cada fonte.
        </>
      ),
    },
    {
      title: "Para que serve",
      text: (
        <>
          O <FarolName /> transforma dados em informação acessível para apoiar
          gestores públicos, pesquisadores, empresas, investidores, imprensa e
          cidadãos na compreensão da realidade socioeconômica de Pernambuco e
          na tomada de decisões baseadas em evidências.
        </>
      ),
    },
    {
      title: "Como explorar",
      text:
        "Navegue pelos painéis temáticos para consultar séries históricas, comparar estados, regiões e municípios e visualizar os dados por meio de gráficos, mapas e tabelas interativas.",
    },
    {
      title: "Fontes dos dados",
      text:
        "Os indicadores são provenientes de órgãos oficiais, como IBGE, Banco Central, Ministério do Trabalho e Emprego, Receita Federal, ANAC, ANTAQ, Comex Stat e demais instituições produtoras de estatísticas.",
    },
    {
      title: "Realização",
      text: (
        <>
          Uma iniciativa da{" "}
          <a
            href="https://www.sdec.pe.gov.br/"
          >
            Secretaria de Desenvolvimento Econômico de Pernambuco (SDEC-PE)
          </a>
          , desenvolvida desde junho de 2026 para ampliar a transparência,
          fortalecer a inteligência de dados e apoiar o desenvolvimento
          econômico e social do estado.
        </>
      ),
    },
  ];
  const team = [
  {
    role: "Secretária de Desenvolvimento Econômico",
    members: ["Danielle Jar Souto"],
  },
  {
    role: "Secretário Executivo de Gestão",
    members: ["Marcelo Guimarães do Rego"],
  },
  {
    role: "Secretário Executivo de Atração de Investimentos e Estudos Econômicos",
    members: ["Pedro Leonardo Lacerda"],
  },
  {
    role: "Coordenação",
    members: ["Caio Coutinho"],
  },
  {
    role: "Estudos Econômicos",
    members: [
      "Pedro Melo",
      "Eduardo Aguiar",
    ],
  },
  {
    role: "Comunicação",
    members: [
      "Valdecarlos Alves",
      "Allan Torres",
      "Jota Gomes",
      "Raul Batista",
    ],
  },
  {
    role: "Apoio",
    members: [
      "Marcus Ferraz",
      "Paulo Oliveira",
      "João Marcelo Menezes",
      "Aldicéia Rodrigues",
      "Luiz Riio",
      "Thiago Paz",
      "Vanessa Silva",
      "Rosa Suruá",
    ],
  },
  ];
  return (
    <main className="about-page">
      <PageHero
        className="about-hero"
        eyebrow={<FarolName />}
        title="Dados que ajudam Pernambuco a enxergar mais longe."
        action={
          <button
            className="button button-primary"
            onClick={() => navigate("/paineis/atividade-economica")}
          >
            Conhecer os painéis →
          </button>
        }
      />
      <section className="about-content-layout">
        <div className="about-narrative">
          <p className="eyebrow dark">Sobre a plataforma</p>
          {cards.map((card) => (
            <section key={card.title}>
              <h2>{card.title}</h2>
              <p>{card.text}</p>
            </section>
          ))}
        </div>

        <aside className="about-credits-panel" aria-labelledby="about-credits-title">
          <p>Colaboração e realização</p>
          <h2 id="about-credits-title">
            Quem construiu o <FarolName />
          </h2>
          <span>
            Projeto desenvolvido de forma colaborativa, unindo conhecimento
            técnico, análise de dados e construção digital.
          </span>
                <ul className="credits-groups">
            {team.map((group) => (
              <li className="credits-group" key={group.role}>
                <span className="credits-role">{group.role}</span>

                <div className="credits-members">
                  {group.members.map((name) => (
                    <strong key={name}>{name}</strong>
                  ))}
                </div>
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
      <PageHero
        className="dictionary-hero"
        eyebrow="Download dos Dados"
        title="Acesse os dados"
        description="Escolha o tema de seu interesse, informe os dados da sua instituição e acesse a base correspondente."
      />

      <section className="dictionary-list" aria-label="Temas com bases de dados">
        {sidebarPanelGroups.map((group) => {
          const Icon = group.icon;
          const requestUrl = dataRequestUrls[group.id];

          return (
            <article className={`dictionary-card tone-${group.tone}`} key={group.id}>
              <span className="dictionary-card-icon" aria-hidden="true">
                <Icon />
              </span>
              <h2>{group.label}</h2>
              <p>{group.summary}</p>
              {requestUrl ? (
                <a
                  href={requestUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Acessar os dados de ${group.label}`}
                >
                  Acessar dados <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <span className="dictionary-card-pending">Disponível em breve</span>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}

function PublicationsPage() {
  const [kind, setKind] = useState<"all" | PublicationKind>("all");
  const [range, setRange] = useState<PublicationRange>("all");
  const [now] = useState(Date.now);
  const filteredPublications = useMemo(() => {
    return publicationItems.filter((item) => {
      if (kind !== "all" && item.kind !== kind) return false;
      if (range === "all") return true;

      const publishedAt = new Date(`${item.publishedAt}T12:00:00-03:00`).getTime();
      const ageInDays = (now - publishedAt) / 86_400_000;
      return ageInDays >= 0 && ageInDays <= Number(range);
    });
  }, [kind, now, range]);

  return (
    <main className="publications-page">
      <PageHero
        className="publications-hero"
        eyebrow="Publicações"
        title="Informação para acompanhar Pernambuco."
        description={
          <>
            Consulte notas técnicas, notícias de Pernambuco, relatórios analíticos
            e boletins econômicos em uma linha do tempo organizada pelo <FarolName />.
          </>
        }
      />

      <section className="publications-content" aria-labelledby="publications-results-title">
        <div className="publications-filters">
          <fieldset>
            <legend>Tipo de publicação</legend>
            <div className="publication-kind-options">
              {publicationKindOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={kind === option.value ? "is-active" : ""}
                  onClick={() => setKind(option.value)}
                  aria-pressed={kind === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="publication-range-filter">
            <span>Janela de tempo</span>
            <select
              value={range}
              onChange={(event) => setRange(event.target.value as PublicationRange)}
            >
              {publicationRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="publications-results-heading">
          <div>
            <p>Acervo</p>
            <h2 id="publications-results-title">Conteúdos publicados</h2>
          </div>
          <span aria-live="polite">
            {filteredPublications.length}{" "}
            {filteredPublications.length === 1 ? "resultado" : "resultados"}
          </span>
        </div>

        {filteredPublications.length > 0 ? (
          <div className="publication-grid">
            {filteredPublications.map((item) => (
              <article className="publication-card" key={item.id}>
                <div className="publication-card-image">
                  <img src={item.image} alt={item.imageAlt} />
                </div>
                <div className="publication-card-copy">
                  <div className="publication-card-meta">
                    <span>{publicationTypeLabels[item.kind]}</span>
                    <time dateTime={item.publishedAt}>{item.displayDate}</time>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <footer>
                    <strong>{item.source}</strong>
                    <a href={item.href} target="_blank" rel="noreferrer">
                      Acessar publicação <span aria-hidden="true">↗</span>
                    </a>
                  </footer>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="publications-empty" role="status">
            <strong>Nenhum conteúdo nesta seleção.</strong>
            <p>Altere o tipo de publicação ou amplie a janela de tempo.</p>
          </div>
        )}
      </section>
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
  const pathname = usePathname() || "/";
  const [searchOpen, setSearchOpen] = useState(false);

  const navigate: Navigate = (href) => {
    if (href !== pathname) window.history.pushState(null, "", href);
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
  if (pathname === "/resumo") content = <EconomicPanoramaPage />;
  else if (pathname === "/sobre") content = <AboutPage navigate={navigate} />;
  else if (pathname === "/dicionario-de-dados") content = <DataDictionaryPage />;
  else if (pathname === "/publicacoes") content = <PublicationsPage />;
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
