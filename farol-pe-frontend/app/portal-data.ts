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

const ppmInfo: PanelInfo = {
  eyebrow: "Sobre o indicador · PPM",
  title: "Pesquisa da Pecuária Municipal (PPM)",
  cards: [
    {
      title: "O que é",
      paragraphs: [
        "Divulgada anualmente pelo Instituto Brasileiro de Geografia e Estatística (IBGE), com um ano de defasagem, a PPM investiga, por município, o efetivo dos rebanhos (bovino, suíno, caprino, ovino, aves etc.), a produção de origem animal (leite, ovos, mel, lã) e a produção da aquicultura, incluindo o valor da produção de cada uma.",
      ],
    },
    {
      title: "Como é calculado",
      paragraphs: [
        "O levantamento é anual e feito junto a informantes qualificados em cada município, sem amostragem domiciliar. O efetivo do rebanho é medido em número de cabeças na data de referência da pesquisa; a produção animal (leite, ovos, mel) e a aquicultura são medidas em quantidade produzida no ano e em valor da produção. Como os preços dos produtos variam de um ano para outro também por efeito da inflação, e não apenas por mudanças na quantidade produzida, comparar diretamente valores em reais de anos diferentes pode induzir a erro: um valor maior pode refletir apenas preços mais altos, não necessariamente mais produção. Por isso, a SDEC-PE deflaciona (converte a preços constantes) os valores nominais divulgados pelo IBGE, trazendo-os a preços de 2026. O deflator utilizado é o Índice Nacional de Preços ao Consumidor Amplo (IPCA), a referência oficial de inflação do Banco Central do Brasil, calculado e divulgado pelo IBGE; os dados de variação do IPCA são obtidos na série 'Preços - IPCA - variação (PRECOS_IPCAG)' do Ipeadata, banco de dados público mantido pelo Instituto de Pesquisa Econômica Aplicada (IPEA). O cálculo acumula a variação do IPCA entre o ano de referência de cada valor e 2026, obtendo um fator de correção que, multiplicado pelo valor nominal, resulta no valor a preços de 2026. Por se tratar de uma conversão feita pela própria SDEC-PE, os valores podem sofrer pequenos ajustes caso o IBGE revise algum mês do IPCA.",
      ],
    },
    {
      title: "Dados disponíveis",
      paragraphs: [
        "Os números centrais do painel são níveis (efetivo do rebanho, quantidade e valor produzidos) comparados entre anos e entre municípios ou regiões de desenvolvimento.",
      ],
    },
    {
      title: "Síntese da leitura mais recente",
      paragraphs: [
        "A edição mais recente da PPM (referente a 2024) mostrou recorde histórico dos rebanhos caprino e ovino no Brasil, com Pernambuco entre os três estados – ao lado de Bahia e Piauí – que juntos concentram 72,5% do rebanho caprino nacional, reforçando a vocação do Sertão e do Agreste pernambucanos para essa criação. O estado também se destacou na avicultura: o município de São Bento do Una figurou entre os maiores produtores de aves do país. Esses resultados reforçam o papel da pecuária como atividade estruturante para a economia do interior do estado, complementar à agricultura irrigada do Vale do São Francisco.",
      ],
    },
  ],
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
    info: {
      eyebrow: "Sobre o indicador · PIM-PF",
      title: "Pesquisa Industrial Mensal – Produção Física (PIM-PF)",
      cards: [
        {
          title: "O que é",
          paragraphs: [
            "Divulgada mensalmente pelo Instituto Brasileiro de Geografia e Estatística (IBGE), com dois meses de defasagem, a PIM-PF mede a evolução da produção física da indústria, ou seja, quanto a indústria efetivamente produziu em quantidade, e não em valor monetário. É o principal termômetro de curto prazo da atividade industrial, cobrindo a indústria geral e, dentro dela, a indústria de transformação (que exclui a extrativa mineral).",
          ],
        },
        {
          title: "Como é calculado",
          paragraphs: [
            "O IBGE pesquisa uma amostra de estabelecimentos industriais e constrói um número-índice (índice de quantum), com ano-base na média de 2022 (2022 = 100). Os dados são coletados por atividade – segundo a Classificação Nacional de Atividades Econômicas (CNAE) – e depois agregados para formar os índices setoriais e o índice geral do estado. O IBGE divulga a série com ajuste sazonal apenas para a indústria geral do estado, sem abrir esse tratamento para a indústria de transformação de Pernambuco especificamente – um recorte importante, já que a transformação responde por quase toda a produção industrial pernambucana e permite isolar o desempenho manufatureiro de outras atividades, como a extrativa. Para preencher essa lacuna e permitir a comparação com o mês imediatamente anterior nesse recorte, a SDEC-PE estima sua própria série dessazonalizada com o método X-13ARIMA-SEATS – desenvolvido pelo U.S. Census Bureau a partir do X-11 e incorporando o modelo TRAMO-SEATS do Banco da Espanha, hoje o padrão internacional de ajuste sazonal, adotado também pelo IBGE, pelo Banco Central do Brasil e pelo Eurostat. O método modela a série histórica, separa o padrão que se repete todo ano (como paradas de manutenção programadas) do movimento efetivo de produção, e remove apenas o primeiro. Por resultar de estimação estatística, e não de um número oficialmente publicado pelo IBGE, esse valor pode sofrer pequenas revisões à medida que novos meses são incorporados à série.",
          ],
        },
        {
          title: "Dados disponíveis",
          paragraphs: [
            "O painel traz como leituras: Índice (2022 = 100), o nível bruto da série; Índice com ajuste sazonal (2022 = 100), o mesmo nível, mas corrigido para remover efeitos que se repetem todo ano (como paradas de manutenção programadas e sazonalidade de safra); Crescimento acumulado no ano (%), que apresenta a variação acumulada no ano em relação ao mesmo período do ano anterior; Crescimento acumulado em 12 meses(%), que apresenta a variação acumulada em 12 meses em relação ao período anterior de 12 meses; Crescimento mensal com ajuste sazonal (%), que compara o mês com o imediatamente anterior já sem efeito de sazonalidade; e Crescimento em relação ao mesmo mês do ano anterior (%).",
          ],
        },
        {
          title: "Síntese da leitura mais recente",
          paragraphs: [
            "Segundo o Boletim Econômico de PE (junho/2026), a produção industrial de Pernambuco cresceu 19,7% no acumulado de janeiro a abril frente ao mesmo período de 2025 – o segundo maior resultado entre os 14 estados pesquisados (atrás apenas do Espírito Santo, com 25,3%) e mais de onze vezes o crescimento nacional (1,7%). Nos últimos 12 meses, a alta foi de 7,3%. O desempenho foi puxado principalmente pelo segmento de coque, derivados de petróleo e biocombustíveis, refletindo o dinamismo do Complexo Industrial Portuário de Suape e o retorno pleno da Refinaria Abreu e Lima (RNEST) após a manutenção programada de 2025. Na margem, houve recuo pontual de 3,6% em abril frente a março (série com ajuste sazonal), sem alterar a tendência de alta do ano.",
          ],
        },
      ],
    },
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
    info: {
      eyebrow: "Sobre o indicador · IBCR",
      title: "Índice de Atividade Econômica Regional do Banco Central (IBCR)",
      cards: [
        {
          title: "O que é",
          paragraphs: [
            "Divulgado mensalmente pelo Banco Central do Brasil (BCB), com dois meses de defasagem, o IBCR é a principal prévia mensal do Produto Interno Bruto (PIB) estadual divulgado pelo Instituto Brasileiro de Geografia e Estatística (IBGE). Funciona como um termômetro da atividade econômica de Pernambuco, antecipando, com base em informações setoriais disponíveis mês a mês – como a arrecadação de Imposto sobre Circulação de Mercadorias e Serviços (ICMS) –, a direção que o PIB trimestral do estado deve seguir.",
          ],
        },
        {
          title: "Como é calculado",
          paragraphs: [
            "O Banco Central combina indicadores de oferta dos setores agropecuário, industrial e de serviços, ponderados pelo peso de cada um na economia estadual, em um único número-índice. O índice tem como referência a média de 2022 (2022 = 100): um valor de 105,8, por exemplo, indica que o nível de atividade está 5,8% acima da média daquele ano-base. O IBCR nacional equivalente é o IBC-Br.",
          ],
        },
        {
          title: "Dados disponíveis",
          paragraphs: [
            "O painel traz como leituras: Índice (2022 = 100), o nível bruto da série; Índice com ajuste sazonal (2022 = 100), o mesmo nível, mas corrigido para remover efeitos que se repetem todo ano (como feriados e safras); Crescimento acumulado no ano (%), que apresenta a variação acumulada no ano em relação ao mesmo período do ano anterior; Crescimento acumulado em 12 meses (%), que apresenta a variação acumulada em 12 meses em relação ao período anterior de 12 meses; Crescimento mensal com ajuste sazonal (%), que compara o mês com o imediatamente anterior já sem efeito de sazonalidade; e Crescimento em relação ao mesmo mês do ano anterior (%). Juntas, essas leituras permitem distinguir uma variação pontual de uma mudança de tendência.",
          ],
        },
        {
          title: "Síntese da leitura mais recente",
          paragraphs: [
            "Na leitura mais recente do Boletim Econômico de PE (junho/2026), o IBCR referente a abril de 2026 alcançou 105,8 pontos, com crescimento acumulado no ano de 5,91% frente ao mesmo período de 2025 – a segunda maior expansão entre as 14 unidades da federação acompanhadas pelo Banco Central, atrás apenas do Rio de Janeiro (5,99%), e a maior do Nordeste, muito à frente de Maranhão (1,75%), Ceará (1,74%) e Bahia (0,50%). O crescimento interanual foi de 1,53% e, no trimestre fevereiro-abril, a expansão chegou a 5,45%. Na série com ajuste sazonal, houve recuo de 0,4% frente a março, um sinal pontual de acomodação na margem que não compromete a tendência de expansão observada no ano.",
          ],
        },
      ],
    },
  },
  {
    slug: "servicos",
    legacyId: "bi-servicos",
    title: "Serviços em Pernambuco",
    shortTitle: "Serviços",
    category: "Dinâmica Econômica",
    eyebrow: "Pesquisa Mensal de Serviços",
    description:
      "Acompanhe o desempenho do setor de serviços em Pernambuco e sua evolução ao longo do tempo.",
    source: "Power BI",
    embedUrl:
      "https://app.powerbi.com/view?r=eyJrIjoiNjhkOGJiOGEtZTlkNy00NmYwLThiODctZDc1ODZkMWQ1MWExIiwidCI6ImEzMDA5OGM1LWQ1NDMtNDc2Zi04NTM4LTE3YjhlYmE0MzM4MSJ9",
    info: {
      eyebrow: "Sobre o indicador · PMS",
      title: "Pesquisa Mensal de Serviços (PMS)",
      cards: [
        {
          title: "O que é",
          paragraphs: [
            "Divulgada mensalmente pelo Instituto Brasileiro de Geografia e Estatística (IBGE), com dois meses de defasagem, a PMS mede a evolução do volume e da receita dos serviços prestados a empresas e famílias – de hospedagem e alimentação a transporte, informação e serviços profissionais – mas não inclui os serviços públicos nem os financeiros. É a principal fonte para acompanhar setores como o turismo, tratado como uma atividade específica dentro da pesquisa.",
          ],
        },
        {
          title: "Como é calculado",
          paragraphs: [
            "O IBGE pesquisa uma amostra de empresas de serviços e constrói índices de volume (quantidade efetivamente prestada) e de receita nominal, com ano-base na média de 2022 (2022 = 100). O índice de turismo, em particular, cobre atividades como hospedagem, agências de viagens e transporte de passageiros.",
          ],
        },
        {
          title: "Dados disponíveis",
          paragraphs: [
            "O painel traz como leituras: Índice (2022 = 100), o nível bruto da série; Índice com ajuste sazonal (2022 = 100), o mesmo nível, mas corrigido para remover efeitos que se repetem todo ano (como feriados e férias); Crescimento acumulado no ano (%); Crescimento acumulado em 12 meses (%); Crescimento mensal com ajuste sazonal (%), que compara o mês com o imediatamente anterior já sem efeito de sazonalidade; e Crescimento em relação ao mesmo mês do ano anterior (%).",
          ],
        },
        {
          title: "Síntese da leitura mais recente",
          paragraphs: [
            "Segundo o Boletim Econômico de PE (junho/2026), o volume de serviços de Pernambuco avançou 2,4% em abril frente a março (série com ajuste sazonal) – o dobro do resultado nacional (1,2%) e entre os seis maiores do país –, recuperando-se da retração de março. Na comparação com abril de 2025 houve variação de -2,4%; o acumulado do ano ficou estável (-0,1%) e o indicador em 12 meses cresceu 0,1%. O turismo foi o principal motor dessa recuperação: o volume de atividades turísticas subiu 6,9% frente ao mês anterior (quarto maior crescimento entre os 17 estados pesquisados) e a receita nominal avançou 1,8%, impulsionados pela circulação de visitantes nos feriados de Semana Santa, Páscoa e Tiradentes.",
          ],
        },
      ],
    },
  },
  {
    slug: "turismo",
    legacyId: "bi-turismo",
    title: "Turismo em Pernambuco",
    shortTitle: "Turismo",
    category: "Dinâmica Econômica",
    eyebrow: "Atividades turísticas",
    description:
      "Explore os principais indicadores da atividade turística de Pernambuco e sua trajetória recente.",
    source: "Power BI",
    embedUrl:
      "https://app.powerbi.com/view?r=eyJrIjoiMThiM2ZmNTktYTRmYi00YTFiLTk2ZjYtMDcwNTU3ZjIyYTNmIiwidCI6ImEzMDA5OGM1LWQ1NDMtNDc2Zi04NTM4LTE3YjhlYmE0MzM4MSJ9",
    info: {
      eyebrow: "Sobre o indicador · PMS",
      title: "Pesquisa Mensal de Serviços - Turismo (PMS)",
      cards: [
        {
          title: "O que é",
          paragraphs: [
            "Divulgada mensalmente pelo Instituto Brasileiro de Geografia e Estatística (IBGE), com dois meses de defasagem, a PMS mede a evolução do volume e da receita dos serviços prestados a empresas e famílias – de hospedagem e alimentação a transporte, informação e serviços profissionais – mas não inclui os serviços públicos nem os financeiros. É a principal fonte para acompanhar setores como o turismo, tratado como uma atividade específica dentro da pesquisa.",
          ],
        },
        {
          title: "Como é calculado",
          paragraphs: [
            "O IBGE pesquisa uma amostra de empresas de serviços e constrói índices de volume (quantidade efetivamente prestada) e de receita nominal, com ano-base na média de 2022 (2022 = 100). O índice de turismo, em particular, cobre atividades como hospedagem, agências de viagens e transporte de passageiros.",
          ],
        },
        {
          title: "Dados disponíveis",
          paragraphs: [
            "O painel traz como leituras: Índice (2022 = 100), o nível bruto da série; Índice com ajuste sazonal (2022 = 100), o mesmo nível, mas corrigido para remover efeitos que se repetem todo ano (como feriados e férias); Crescimento acumulado no ano (%); Crescimento acumulado em 12 meses (%); Crescimento mensal com ajuste sazonal (%), que compara o mês com o imediatamente anterior já sem efeito de sazonalidade; e Crescimento em relação ao mesmo mês do ano anterior (%).",
          ],
        },
        {
          title: "Síntese da leitura mais recente",
          paragraphs: [
            "Segundo o Boletim Econômico de PE (junho/2026), o volume de serviços de Pernambuco avançou 2,4% em abril frente a março (série com ajuste sazonal) – o dobro do resultado nacional (1,2%) e entre os seis maiores do país –, recuperando-se da retração de março. Na comparação com abril de 2025 houve variação de -2,4%; o acumulado do ano ficou estável (-0,1%) e o indicador em 12 meses cresceu 0,1%. O turismo foi o principal motor dessa recuperação: o volume de atividades turísticas subiu 6,9% frente ao mês anterior (quarto maior crescimento entre os 17 estados pesquisados) e a receita nominal avançou 1,8%, impulsionados pela circulação de visitantes nos feriados de Semana Santa, Páscoa e Tiradentes.",
          ],
        },
      ],
    },
  },
  {
    slug: "estrutura-industrial",
    legacyId: "bi-PIA",
    title: "Estrutura industrial de Pernambuco",
    shortTitle: "Indústria (PIA)",
    category: "Panoramas Setoriais",
    eyebrow: "PIA-Empresa · IBGE",
    description:
      "Conheça a estrutura da indústria pernambucana, o número de empresas, os empregos e o valor da produção industrial.",
    source: "Link a definir",
    info: {
      eyebrow: "Sobre o indicador · PIA-Empresa",
      title: "Pesquisa Industrial Anual (PIA-Empresa)",
      cards: [
        {
          title: "O que é",
          paragraphs: [
            "Divulgada anualmente pelo Instituto Brasileiro de Geografia e Estatística (IBGE), com dois anos de defasagem, a PIA-Empresa retrata a estrutura do setor industrial: quantas empresas industriais existem, quantas pessoas empregam e quanto produzem em valor. É o raio-x anual e mais detalhado da indústria pernambucana, usado para entender a composição e o peso de cada segmento (automotivo, alimentício, químico etc.), complementando a leitura mensal de curto prazo da produção industrial do estado.",
          ],
        },
        {
          title: "Como é calculado",
          paragraphs: [
            "O IBGE levanta, junto às empresas industriais do país, informações contábeis e de pessoal ocupado referentes ao ano anterior. O principal resultado é o Valor Bruto da Produção Industrial (VBPI), complementado por número de empresas, empregos formais e produtividade média (VBPI em relação ao pessoal ocupado). Como o valor de produção varia de um ano para outro também por efeito da inflação, e não apenas por mudanças na quantidade produzida, comparar diretamente valores em reais de anos diferentes pode induzir a erro: um valor maior pode refletir apenas preços mais altos, não necessariamente mais produção. Por isso, a SDEC-PE deflaciona (converte a preços constantes) os valores nominais divulgados pelo IBGE, trazendo-os a preços de 2026 – a mesma base usada em todos os valores monetários do Observatório. O deflator utilizado é o Índice Nacional de Preços ao Consumidor Amplo (IPCA), a referência oficial de inflação do Banco Central do Brasil, calculado e divulgado pelo IBGE; os dados de variação do IPCA são obtidos na série 'Preços - IPCA - variação (PRECOS_IPCAG)' do Ipeadata, banco de dados público mantido pelo Instituto de Pesquisa Econômica Aplicada (IPEA). O cálculo acumula a variação do IPCA entre o ano de referência de cada valor e 2026, obtendo um fator de correção que, multiplicado pelo valor nominal, resulta no valor a preços de 2026. Por se tratar de uma conversão feita pela própria SDECPE – e não de um número publicado dessa forma pelo IBGE, que divulga os valores a preços correntes de cada ano –, os valores podem sofrer pequenos ajustes caso o IBGE revise algum mês do IPCA.",
          ],
        },
        {
          title: "Dados disponíveis",
          paragraphs: [
            "A PIA apresenta dados referentes ao valor da produção em reais, quantidade de empresas e quantidade de empregos do setor. Devido à mudança metodológica ocorrida neste ano, a PIA-Empresa 2024 não é comparável à de anos anteriores e, por isso, o IBGE rompeu a série histórica a partir do ano-base de 2024. A principal mudança foi no desenho amostral: o corte do estrato certo – empresas automaticamente incluídas na amostra, sem sorteio – subiu de 20 para 30 pessoas ocupadas, passando também a incluir empresas com receita bruta superior a R$ 100 milhões independentemente do porte; houve ainda alterações na estrutura de apresentação dos resultados. Por isso, o Observatório evita comparar a edição de 2024 com edições anteriores a esse ano, priorizando comparações entre estados dentro da própria edição.",
          ],
        },
        {
          title: "Síntese da leitura mais recente",
          paragraphs: [
            "A edição mais recente (referente a 2024), divulgada em junho de 2026, mostrou Valor Bruto da Produção Industrial de Pernambuco de aproximadamente R$ 143,3 bilhões – a segunda maior economia industrial do Nordeste, atrás da Bahia (R$ 249,4 bilhões), e cerca de 22% da produção industrial da região. O estado contava com 5.397 empresas industriais e 212.951 trabalhadores formais no setor, sendo o segundo maior empregador industrial do Nordeste. A indústria de transformação respondeu por 99,6% do VBPI – uma estrutura diversificada, liderada pela fabricação de veículos, reboques e carrocerias (R$ 35,8 bilhões, cerca de 25% do total), seguida por produtos alimentícios (R$ 29,5 bilhões) e indústria química (R$ 17,5 bilhões). A produtividade média chegou a R$ 673 mil por trabalhador, superior à da maior parte dos estados nordestinos.",
          ],
        },
      ],
    },
  },
  {
    slug: "comercio",
    legacyId: "bi-PMC",
    title: "Comércio em Pernambuco",
    shortTitle: "Comércio",
    category: "Dinâmica Econômica",
    eyebrow: "Pesquisa Mensal de Comércio · IBGE",
    description:
      "Acompanhe o volume de vendas e a receita do comércio varejista de Pernambuco, com comparações por segmento e território.",
    source: "Power BI",
    embedUrl:
      "https://app.powerbi.com/view?r=eyJrIjoiY2IzMDA5ZTYtN2Y3MS00YzA1LWExY2UtMzlmYWFmZGVlZjNlIiwidCI6ImEzMDA5OGM1LWQ1NDMtNDc2Zi04NTM4LTE3YjhlYmE0MzM4MSJ9",
    info: {
      eyebrow: "Sobre o indicador · PMC",
      title: "Pesquisa Mensal de Comércio (PMC)",
      cards: [
        {
          title: "O que é",
          paragraphs: [
            "Divulgada mensalmente pelo Instituto Brasileiro de Geografia e Estatística (IBGE), com dois meses de defasagem, a PMC mede a evolução do volume de vendas e da receita nominal do comércio varejista. O observatório acompanha o comércio varejista ampliado, que inclui, além do varejo restrito (supermercados, vestuário, móveis etc.), os segmentos de veículos e motos, peças e material de construção – mais sensíveis ao crédito e à renda.",
          ],
        },
        {
          title: "Como é calculado",
          paragraphs: [
            "O IBGE pesquisa uma amostra de empresas comerciais e constrói índices de volume de vendas, com anobase na média de 2022 (2022 = 100). O IBGE divulga o número-índice com ajuste sazonal apenas para o Brasil e para o total do varejo de cada estado, ou seja, não para o detalhamento por atividade (supermercados, móveis, vestuário etc.) dentro de cada unidade da federação. Para permitir a comparação mês a mês entre esses segmentos e entre estados, a SDEC-PE dessazonaliza essas séries por conta própria, com o método X13ARIMA-SEATS, desenvolvido pelo U.S. Census Bureau a partir do X-11 e incorporando o modelo TRAMO-SEATS do Banco da Espanha — hoje o padrão internacional de ajuste sazonal, adotado também pelo IBGE, pelo Banco Central do Brasil e pelo Eurostat. O procedimento modela cada série, identifica o padrão que se repete todos os anos (datas comemorativas, 13º salário, dias úteis) e o remove, deixando à mostra apenas a variação efetiva de um mês para o outro. Por resultar de estimação estatística, e não de um número oficialmente publicado pelo IBGE, esses valores podem sofrer pequenas revisões conforme novos dados são incorporados à série.",
          ],
        },
        {
          title: "Dados disponíveis",
          paragraphs: [
            "O painel traz como leituras: Índice (2022 = 100), o nível bruto da série; Índice com ajuste sazonal (2022 = 100), o mesmo nível, mas corrigido para remover efeitos que se repetem todo ano (como datas comemorativas e calendário de pagamentos); Crescimento acumulado no ano (%); Crescimento acumulado em 12 meses (%); Crescimento mensal com ajuste sazonal (%), que compara o mês com o imediatamente anterior já sem efeito de sazonalidade; e Crescimento em relação ao mesmo mês do ano anterior (%).",
          ],
        },
        {
          title: "Síntese da leitura mais recente",
          paragraphs: [
            "De acordo com o Boletim Econômico de PE (junho/2026), o volume de vendas do comércio varejista ampliado de Pernambuco cresceu 9,4% no acumulado de janeiro a abril de 2026 – o maior resultado entre todas as unidades da federação no período, mais de cinco vezes o resultado nacional (1,8%). Na comparação interanual (abril/2026 ante abril/2025), o avanço foi de 5,4%, o terceiro maior do país. Na margem, o estado ficou estável (+0,3%), enquanto o Brasil recuou 0,7% e 20 das 27 UFs apresentaram queda – o sexto melhor desempenho do país e o terceiro do Nordeste. O consumo das famílias puxou o resultado no ano, com destaque para hipermercados e supermercados (+26,8%) e equipamentos de informática e comunicação (+17,4%).",
          ],
        },
      ],
    },
  },
  {
    slug: "pix",
    legacyId: "bi-pix",
    title: "Movimentações financeiras via Pix",
    shortTitle: "Movimentações Financeiras",
    category: "Produção e Renda",
    eyebrow: "Pix · Banco Central",
    description:
      "Explore o valor movimentado e a quantidade de transações via Pix em Pernambuco, com recortes estaduais e municipais.",
    source: "Link a definir",
    info: {
      eyebrow: "Sobre o indicador · Pix",
      title: "Movimentações financeiras via Pix",
      cards: [
        {
          title: "O que é",
          paragraphs: [
            "Divulgadas mensalmente pelo Banco Central do Brasil (BCB), com um mês de defasagem, as movimentações financeiras via Pix são um registro administrativo: o Banco Central publica o valor total movimentado e o número de transações realizadas pelo sistema de pagamentos instantâneos em cada estado e município. Funcionam como um termômetro da atividade econômica digital e da circulação de renda no dia a dia da população e das empresas.",
          ],
        },
        {
          title: "Como é calculado",
          paragraphs: [
            "O BCB soma o valor (em reais) e a quantidade de todas as transações via Pix originadas no estado em um determinado período, tipicamente acumulado no ano ou nos últimos 12 meses.",
          ],
        },
        {
          title: "Dados disponíveis",
          paragraphs: [
            "Os principais resultados do painel são o valor acumulado movimentado e o número de transações no período, comparados entre estados e municípios.",
          ],
        },
        {
          title: "Síntese da leitura mais recente",
          paragraphs: [
            "Segundo o Boletim Econômico de PE (junho/2026), entre janeiro e maio de 2026 Pernambuco movimentou R$ 333,9 bilhões via Pix, com aproximadamente 1,38 bilhão de transações – o segundo maior volume do Nordeste, atrás apenas da Bahia (R$ 507,6 bilhões) e à frente do Ceará (R$ 317,8 bilhões). O volume equivale a cerca de 21% do valor movimentado pelos nove estados nordestinos, proporção coerente com a participação de Pernambuco no PIB regional (aproximadamente 18%). A intensidade do uso do Pix acompanha o desempenho do comércio varejista, a expansão do tecido empresarial e a recuperação da renda das famílias, funcionando como uma infraestrutura de suporte à atividade econômica captada pelas demais pesquisas conjunturais.",
          ],
        },
      ],
    },
  },
  {
    slug: "panorama-comercio",
    legacyId: "bi-PAC",
    title: "Panorama do comércio",
    shortTitle: "Comércio (PAC)",
    category: "Panoramas Setoriais",
    eyebrow: "PAC · IBGE",
    description:
      "Panorama estrutural do comércio pernambucano, com indicadores de empresas, pessoal ocupado, salários e receita.",
    source: "Link a definir",
  },
  {
    slug: "panorama-servicos",
    legacyId: "bi-PAS",
    title: "Panorama dos serviços",
    shortTitle: "Serviços (PAS)",
    category: "Panoramas Setoriais",
    eyebrow: "PAS · IBGE",
    description:
      "Panorama estrutural dos serviços em Pernambuco, com indicadores empresariais, ocupacionais e de receita.",
    source: "Link a definir",
  },
  {
    slug: "produto-interno-bruto",
    legacyId: "bi-PIB",
    title: "Produto Interno Bruto",
    shortTitle: "Produto Interno Bruto (PIB)",
    category: "Produção e Renda",
    eyebrow: "PIB · IBGE",
    description:
      "Acompanhe a dimensão e a evolução da economia pernambucana por meio do Produto Interno Bruto.",
    source: "Link a definir",
  },
  {
    slug: "valor-adicionado-bruto",
    legacyId: "bi-VAB",
    title: "Valor Adicionado Bruto",
    shortTitle: "Valor Adicionado Bruto (VAB)",
    category: "Produção e Renda",
    eyebrow: "VAB · IBGE",
    description:
      "Explore a contribuição dos setores econômicos para a geração de valor em Pernambuco.",
    source: "Link a definir",
  },
  {
    slug: "arrecadacao",
    legacyId: "bi-arrecadacao",
    title: "Arrecadação",
    shortTitle: "Arrecadação",
    category: "Produção e Renda",
    eyebrow: "Receitas públicas",
    description:
      "Consulte indicadores de arrecadação e acompanhe sua evolução no estado de Pernambuco.",
    source: "Link a definir",
  },
  {
    slug: "rendimentos",
    legacyId: "bi-rendimentos",
    title: "Rendimentos",
    shortTitle: "Rendimentos",
    category: "Produção e Renda",
    eyebrow: "Renda · Pernambuco",
    description:
      "Acompanhe os principais indicadores de rendimento da população pernambucana.",
    source: "Link a definir",
  },
  {
    slug: "estoque-de-emprego",
    legacyId: "bi-estoque-emprego",
    title: "Estoque de Emprego",
    shortTitle: "Estoque de Emprego",
    category: "Emprego",
    eyebrow: "Emprego formal",
    description:
      "Acompanhe o estoque de vínculos formais de trabalho em Pernambuco.",
    source: "Link a definir",
  },
  {
    slug: "fluxo-de-emprego",
    legacyId: "bi-fluxo-emprego",
    title: "Fluxo de Emprego",
    shortTitle: "Fluxo de Emprego",
    category: "Emprego",
    eyebrow: "Movimentação do emprego",
    description:
      "Consulte admissões, desligamentos e o saldo de empregos formais em Pernambuco.",
    source: "Link a definir",
  },
  {
    slug: "outros-indicadores-de-emprego",
    legacyId: "bi-outros-emprego",
    title: "Outros indicadores de emprego",
    shortTitle: "Outros indicadores",
    category: "Emprego",
    eyebrow: "Mercado de trabalho",
    description:
      "Espaço reservado para novos indicadores do mercado de trabalho pernambucano.",
    source: "Link a definir",
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
      title: "Produção Agrícola Municipal (PAM)",
      cards: [
        {
          title: "O que é",
          paragraphs: [
            "Divulgada anualmente pelo Instituto Brasileiro de Geografia e Estatística (IBGE), com um ano de defasagem, a PAM é o principal retrato da agricultura brasileira: investiga, para cada lavoura temporária (como milho e feijão) e permanente (como manga e uva), a área plantada, a área colhida, a quantidade produzida, o rendimento médio e o valor da produção, por município. É a base para entender a estrutura produtiva agrícola de Pernambuco, do Vale do São Francisco à Zona da Mata.",
          ],
        },
        {
          title: "Como é calculado",
          paragraphs: [
            "O levantamento é feito anualmente pelo IBGE junto a informantes qualificados em cada município (técnicos agrícolas, cooperativas, órgãos locais), e não por amostragem domiciliar. Uma cultura só é divulgada para um município quando ocupa a partir de um hectare de área e uma tonelada de produção. O valor da produção é calculado multiplicando a quantidade produzida pelo preço médio recebido pelo produtor. Como os preços agrícolas variam de um ano para outro também por efeito da inflação, e não só por mudanças na quantidade produzida ou na demanda, comparar diretamente valores em reais de anos diferentes pode levar a conclusões erradas: um valor maior pode refletir apenas preços mais altos, não necessariamente mais produção. Por isso, a SDEC-PE deflaciona (converte a preços constantes) os valores nominais divulgados pelo IBGE, trazendoos a preços de 2026. O deflator utilizado é o Índice Nacional de Preços ao Consumidor Amplo (IPCA), a referência oficial de inflação do Banco Central do Brasil, calculado e divulgado pelo IBGE; os dados de variação do IPCA são obtidos na série 'Preços - IPCA - variação (PRECOS_IPCAG)' do Ipeadata, banco de dados público mantido pelo Instituto de Pesquisa Econômica Aplicada (IPEA). O cálculo acumula a variação do IPCA entre o ano de referência de cada valor e 2026, obtendo um fator de correção que, multiplicado pelo valor nominal, resulta no valor a preços de 2026. Por se tratar de uma conversão feita pela própria SDEC-PE, os valores podem sofrer pequenos ajustes caso o IBGE revise algum mês do IPCA.",
          ],
        },
        {
          title: "Dados disponíveis",
          paragraphs: [
            "Os principais resultados do painel são níveis (área, quantidade, valor), com comparações entre municípios e regiões de desenvolvimento de Pernambuco.",
          ],
        },
        {
          title: "Síntese da leitura mais recente",
          paragraphs: [
            "A edição mais recente da PAM (referente a 2024), divulgada pelo IBGE, confirmou Pernambuco entre os maiores produtores nacionais de fruticultura, com destaque para a produção irrigada do Vale do São Francisco (uva e manga). Em nível nacional, o valor da produção agrícola brasileira recuou pelo segundo ano seguido, refletindo a queda de preços e da safra de grãos – um contexto que reforça a importância de acompanhar, no Observatório, o desempenho de cada cultura e região de desenvolvimento separadamente, já que a fruticultura irrigada pernambucana tende a seguir uma dinâmica distinta da dos grãos.",
          ],
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
    info: ppmInfo,
  },
  {
    slug: "origem-animal",
    legacyId: "bi-ppm-origem-animal",
    title: "Produção de origem animal",
    shortTitle: "Produção de origem animal",
    category: "Agropecuária · Pecuária",
    eyebrow: "PPM · IBGE",
    description:
      "Indicadores municipais de leite, ovos, mel e outros produtos de origem animal.",
    source: "Microsoft Fabric",
    embedUrl:
      "https://app.fabric.microsoft.com/view?r=eyJrIjoiYjI4ZTcxNjktNjIwMy00ZmNhLWE2OTAtODVmZDZkYTIwNzI0IiwidCI6ImEzMDA5OGM1LWQ1NDMtNDc2Zi04NTM4LTE3YjhlYmE0MzM4MSJ9",
    info: ppmInfo,
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
    source: "Microsoft Fabric",
    embedUrl:
      "https://app.fabric.microsoft.com/view?r=eyJrIjoiYzEwOTQxMTItODIxYy00NWNjLWExYzctMzA5MGEzODc1MDlhIiwidCI6ImEzMDA5OGM1LWQ1NDMtNDc2Zi04NTM4LTE3YjhlYmE0MzM4MSJ9",
    info: ppmInfo,
  },
];

export const mainLinks = [
  { href: "/", label: "Início" },
  { href: "/resumo", label: "Boletim Econômico" },
  { href: "/paineis/atividade-economica", label: "Painéis dos Dados" },
  { href: "/publicacoes", label: "Publicações" },
  { href: "/sobre", label: "Sobre" },
];

export const dataRequestUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSdaDaMbjhz70ubK79YQeoOjySp8668p5XoihS6gw_ElNBQV9g/viewform";

export const summaryKpis = [
  {
    label: "Atividade econômica",
    value: "+5,1%",
    note: "2º Brasil · 1º Nordeste",
    tone: "blue",
  },
  {
    label: "Produção industrial",
    value: "+14,9%",
    note: "Janeiro–maio · 2º Brasil",
    tone: "green",
  },
  {
    label: "Comércio varejista",
    value: "+11,0%",
    note: "Maior crescimento do país",
    tone: "gold",
  },
  {
    label: "Emprego formal",
    value: "5.894",
    note: "Pendente de atualização",
    tone: "red",
  },
];

export const summaryTable = [
  ["Atividade econômica", "+5,1%", "2º", "1º", "IBCR · BCB", "Atualizado"],
  ["Produção industrial", "+14,9%", "2º", "1º*", "PIM-PF · IBGE", "Atualizado"],
  ["Comércio varejista", "+11,0%", "1º", "1º", "PMC · IBGE", "Atualizado"],
  ["Serviços", "-0,3%", "—", "—", "PMS · IBGE", "Atualizado"],
  ["Aberturas de empresas", "73.461", "9º", "2º", "Mapa de Empresas", "Pendente"],
  ["Saldo de empregos", "5.894", "6º", "2º", "Novo Caged", "Pendente"],
  ["Balança comercial", "-US$ 533,3 mi", "24º", "9º", "SECEX", "Pendente"],
  ["Inadimplência", "50,36%", "8º", "3º", "Serasa", "Pendente"],
  ["Pix", "R$ 333,9 bi", "10º", "2º", "BCB", "Pendente"],
];

export const searchItems = [
  { href: "/", label: "Início" },
  { href: "/resumo", label: "Panorama" },
  { href: "/paineis/atividade-economica", label: "Painéis" },
  { href: "/dicionario-de-dados", label: "Download dos Dados" },
  { href: "/publicacoes", label: "Publicações" },
  { href: "/sobre", label: "Sobre" },
  ...panels.map((panel) => ({
    href: `/paineis/${panel.slug}`,
    label: panel.shortTitle,
  })),
];
