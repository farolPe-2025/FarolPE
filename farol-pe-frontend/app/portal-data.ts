export type PanelInfo = {
  eyebrow: string;
  title: string;
  cards: Array<{
    title: string;
    paragraphs: string[];
    placeholder?: boolean;
  }>;
};

export type Panel = {
  slug: string;
  legacyId: string;
  title: string;
  shortTitle: string;
  category: string;
  eyebrow: string;
  description: string;
  source: string;
  embedUrl?: string;
  info?: PanelInfo;
};

export const panels: Panel[] = [
  {
    slug: "industria",
    legacyId: "bi-PIM",
    title: "Produção industrial",
    shortTitle: "Indústria",
    category: "Dinâmica Econômica",
    eyebrow: "PIM-PF · IBGE",
    description:
      "Acompanhe a evolução da produção industrial de Pernambuco e sua posição no cenário regional e nacional.",
    source: "Power BI",
    embedUrl:
      "https://app.powerbi.com/view?r=eyJrIjoiY2YzZDY2OTMtMDViZS00MmMzLThiYWYtNmVmODYwODg3ODY5IiwidCI6ImEzMDA5OGM1LWQ1NDMtNDc2Zi04NTM4LTE3YjhlYmE0MzM4MSJ9",
  },
  {
    slug: "atividade-economica",
    legacyId: "bi-IBCR",
    title: "Atividade econômica",
    shortTitle: "Atividade Econômica",
    category: "Dinâmica Econômica",
    eyebrow: "IBCR · Banco Central",
    description:
      "Visualize o ritmo da atividade econômica pernambucana e compare o desempenho do estado ao Nordeste e ao Brasil.",
    source: "Power BI",
    embedUrl:
      "https://app.powerbi.com/view?r=eyJrIjoiYTA5ODc2MDYtOGNiZi00ZmM0LTgwZDgtYTAyZjFjYTE5YjU4IiwidCI6ImEzMDA5OGM1LWQ1NDMtNDc2Zi04NTM4LTE3YjhlYmE0MzM4MSJ9",
  },
  {
    slug: "agricultura",
    legacyId: "bi-pam-municipio",
    title: "Produção agrícola de Pernambuco",
    shortTitle: "Agricultura",
    category: "Agropecuária",
    eyebrow: "PAM · IBGE",
    description:
      "Explore área plantada, produção, rendimento e valor das lavouras nos municípios pernambucanos.",
    source: "Microsoft Fabric",
    embedUrl:
      "https://app.fabric.microsoft.com/view?r=eyJrIjoiMWUxY2I2YTEtNmZkMC00Mzk4LWE4MTQtMDg4NGRlYWVmZjhlIiwidCI6ImEzMDA5OGM1LWQ1NDMtNDc2Zi04NTM4LTE3YjhlYmE0MzM4MSJ9",
    info: {
      eyebrow: "Sobre o indicador · PAM",
      title: "Produção Agrícola de Pernambuco",
      cards: [
        {
          title: "O que é",
          paragraphs: [
            "Divulgada anualmente pelo Instituto Brasileiro de Geografia e Estatística (IBGE), com um ano de defasagem, a Produção Agrícola Municipal (PAM) é o principal retrato da agricultura brasileira.",
            "A pesquisa investiga, por município, cada lavoura temporária e permanente, a área plantada, a área colhida, a quantidade produzida, o rendimento médio e o valor da produção.",
          ],
        },
        {
          title: "Como é calculado",
          paragraphs: [
            "O levantamento é realizado anualmente pelo IBGE junto a informantes qualificados em cada município. Uma cultura só é divulgada quando ocupa pelo menos um hectare e registra uma tonelada de produção.",
            "O valor da produção resulta da quantidade produzida multiplicada pelo preço médio recebido pelo produtor. Para comparações no tempo, o Farol PE apresenta também valores corrigidos pelo IPCA, a preços constantes do ano de referência informado no painel.",
          ],
        },
        {
          title: "O que significam as variações",
          paragraphs: [
            "Por ser anual, a PAM não possui variação mensal nem índice de base fixa. A análise compara níveis de área, quantidade, rendimento e valor entre anos-safra, municípios e regiões de desenvolvimento.",
            "Uma alta no valor pode refletir aumento de produção, elevação de preços ou ambos. Por isso, quantidade e rendimento devem ser observados junto ao valor monetário.",
          ],
        },
        {
          title: "Síntese da leitura mais recente",
          paragraphs: [
            "Espaço reservado para o destaque do último ano disponível: principais culturas, municípios líderes e variações relevantes.",
          ],
          placeholder: true,
        },
      ],
    },
  },
  {
    slug: "aquicultura",
    legacyId: "bi-ppm-aquicultura",
    title: "Aquicultura em Pernambuco",
    shortTitle: "Aquicultura",
    category: "Agropecuária · Pecuária",
    eyebrow: "PPM · IBGE",
    description:
      "Consulte quantidade e valor da produção de peixes, camarões, moluscos e outros produtos aquícolas.",
    source: "Microsoft Fabric",
    embedUrl:
      "https://app.fabric.microsoft.com/view?r=eyJrIjoiNjFjNjQzNmQtYTZjYS00ZjI3LThhZGEtMWNkYjk3Y2Q3MTg4IiwidCI6ImEzMDA5OGM1LWQ1NDMtNDc2Zi04NTM4LTE3YjhlYmE0MzM4MSJ9",
    info: {
      eyebrow: "Sobre o indicador · PPM",
      title: "Aquicultura em Pernambuco",
      cards: [
        {
          title: "O que é",
          paragraphs: [
            "A aquicultura integra a Pesquisa da Pecuária Municipal (PPM), divulgada anualmente pelo IBGE. Ela acompanha, por município, a produção de organismos aquáticos criados em cativeiro, como peixes, camarões, moluscos e outros produtos aquícolas.",
            "O painel apresenta a quantidade produzida e o valor da produção das espécies disponíveis para Pernambuco.",
          ],
        },
        {
          title: "Como é calculado",
          paragraphs: [
            "As informações são apuradas anualmente pelo IBGE junto a fontes qualificadas nos municípios. A quantidade corresponde à produção obtida durante o ano, conforme a unidade específica de cada produto.",
            "O valor da produção é estimado pela quantidade produzida multiplicada pelo preço médio recebido pelo produtor. Valores de anos diferentes devem ser comparados a preços constantes para separar o efeito da inflação.",
          ],
        },
        {
          title: "O que significam as variações",
          paragraphs: [
            "Como a pesquisa é anual, as comparações são feitas entre anos, municípios e regiões de desenvolvimento. Uma variação positiva indica crescimento da quantidade, do preço recebido ou dos dois componentes.",
            "Na leitura do valor produzido, observe também a espécie selecionada e sua unidade de medida, pois os produtos aquícolas possuem escalas distintas.",
          ],
        },
        {
          title: "Síntese da leitura mais recente",
          paragraphs: [
            "Espaço reservado para o destaque do último ano disponível: espécies com maior produção, municípios líderes e mudanças relevantes.",
          ],
          placeholder: true,
        },
      ],
    },
  },
  {
    slug: "origem-animal",
    legacyId: "bi-ppm-origem-animal",
    title: "Produção de origem animal",
    shortTitle: "Origem animal",
    category: "Agropecuária · Pecuária",
    eyebrow: "PPM · IBGE",
    description:
      "Indicadores municipais de leite, ovos, mel e outros produtos de origem animal.",
    source: "Integração em preparação",
    info: {
      eyebrow: "Sobre o indicador · PPM",
      title: "Produção de Origem Animal em Pernambuco",
      cards: [
        {
          title: "O que é",
          paragraphs: [
            "É o conjunto de produtos de origem animal acompanhado anualmente pela Pesquisa da Pecuária Municipal, como leite, ovos, mel e lã, apresentado por município.",
          ],
        },
        {
          title: "Como é calculado",
          paragraphs: [
            "O IBGE apura a quantidade produzida durante o ano e o respectivo valor da produção. Cada produto utiliza sua unidade própria, e o valor resulta da quantidade associada ao preço médio recebido pelo produtor.",
          ],
        },
        {
          title: "O que significam as variações",
          paragraphs: [
            "As variações mostram mudanças anuais na quantidade ou no valor. Para interpretar o valor, é importante distinguir crescimento real da produção de simples alteração nos preços.",
          ],
        },
        {
          title: "Síntese da leitura mais recente",
          paragraphs: [
            "Espaço reservado para os destaques do último ano disponível.",
          ],
          placeholder: true,
        },
      ],
    },
  },
  {
    slug: "rebanhos",
    legacyId: "bi-ppm-rebanhos",
    title: "Rebanhos de Pernambuco",
    shortTitle: "Rebanhos",
    category: "Agropecuária · Pecuária",
    eyebrow: "PPM · IBGE",
    description:
      "Acompanhe o efetivo municipal de bovinos, suínos, caprinos, ovinos, aves e outros rebanhos.",
    source: "Integração em preparação",
    info: {
      eyebrow: "Sobre o indicador · PPM",
      title: "Rebanhos de Pernambuco",
      cards: [
        {
          title: "O que é",
          paragraphs: [
            "A Pesquisa da Pecuária Municipal acompanha anualmente o efetivo dos principais rebanhos, como bovinos, suínos, caprinos, ovinos e aves, em cada município.",
          ],
        },
        {
          title: "Como é calculado",
          paragraphs: [
            "O efetivo corresponde ao número de animais existente na data de referência da pesquisa. As informações são obtidas pelo IBGE junto a fontes qualificadas em cada município.",
          ],
        },
        {
          title: "O que significam as variações",
          paragraphs: [
            "As variações representam aumento ou redução do número de cabeças entre anos. Elas podem refletir ciclos produtivos, condições climáticas, custos, demanda e alterações na atividade pecuária local.",
          ],
        },
        {
          title: "Síntese da leitura mais recente",
          paragraphs: [
            "Espaço reservado para os principais rebanhos, municípios líderes e mudanças do último ano disponível.",
          ],
          placeholder: true,
        },
      ],
    },
  },
];

export const mainLinks = [
  { href: "/", label: "Início" },
  { href: "/resumo", label: "Resumo" },
  { href: "/paineis/agricultura", label: "Painéis" },
  { href: "/publicacoes", label: "Publicações" },
  { href: "/dicionario-de-dados", label: "Dicionário de dados" },
  { href: "/sobre", label: "Sobre" },
];

export const dataRequestUrl =
  "https://www.lai.pe.gov.br/sdec/servico-de-informacao-ao-cidadao/";

export const summaryKpis = [
  {
    label: "Atividade econômica",
    value: "+5,91%",
    note: "2º Brasil · 1º Nordeste",
    tone: "blue",
  },
  {
    label: "Produção industrial",
    value: "+19,7%",
    note: "Janeiro–abril",
    tone: "green",
  },
  {
    label: "Comércio varejista",
    value: "+9,4%",
    note: "Maior crescimento do país",
    tone: "gold",
  },
  {
    label: "Emprego formal",
    value: "5.894",
    note: "Saldo em maio",
    tone: "red",
  },
];

export const summaryTable = [
  ["Atividade econômica", "+5,91%", "2º", "1º", "IBCR · BCB"],
  ["Produção industrial", "+19,7%", "2º*", "2º", "PIM-PF · IBGE"],
  ["Varejo ampliado", "+9,4%", "1º", "1º", "PMC · IBGE"],
  ["Serviços", "+2,4%", "6º", "2º", "PMS · IBGE"],
  ["Aberturas de empresas", "73.461", "9º", "2º", "Mapa de Empresas"],
  ["Saldo de empregos", "5.894", "6º", "2º", "Novo Caged"],
  ["Balança comercial", "-US$ 533,3 mi", "24º", "9º", "SECEX"],
  ["Inadimplência", "50,36%", "8º", "3º", "Serasa"],
  ["Pix", "R$ 333,9 bi", "10º", "2º", "BCB"],
];

export const searchItems = [
  ...mainLinks,
  ...panels.map((panel) => ({
    href: `/paineis/${panel.slug}`,
    label: panel.shortTitle,
  })),
];
