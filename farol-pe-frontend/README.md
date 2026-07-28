# FarolPE — Front-end

Nova versão do Observatório Socioeconômico de Pernambuco, reconstruída como
aplicação React/Vinext.

## Testar no Windows

1. Dê dois cliques em `iniciar.bat`.
2. Aguarde aparecer o endereço `http://localhost:3000`.
3. Abra esse endereço no navegador.
4. Para encerrar, volte à janela aberta pelo arquivo e pressione `Ctrl + C`.

O projeto inclui um runtime local dentro de `.tools`, portanto não é necessário
instalar Node.js nesta máquina.

## Rotas principais

- `/` — página inicial;
- `/resumo` — panorama econômico;
- `/sobre` — apresentação institucional;
- `/publicacoes` — página preparada para conteúdo futuro;
- `/dicionario-de-dados` — catálogo dos painéis e acesso à solicitação de dados;
- `/paineis/<nome>` — painéis de dados;
- `/indicadores/<nome>` — metodologia dos indicadores.

Somente o iframe da rota ativa é montado. A página inicial não carrega nenhum
Power BI.

## Painéis pendentes

Os painéis de Produção de origem animal e Rebanhos ainda não possuíam links no
HTML original. As páginas e metodologias estão prontas e mostram um estado de
preparação até que os endereços sejam adicionados em `app/portal-data.ts`.
