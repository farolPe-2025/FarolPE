import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const [inputArg, referenceArg, outputArg] = process.argv.slice(2);

if (!inputArg || !referenceArg || !outputArg) {
  throw new Error(
    "Uso: node scripts/adapt-panorama.mjs <exportacao> <versao-adaptada> <saida>",
  );
}

const inputPath = resolve(inputArg);
const referencePath = resolve(referenceArg);
const outputPath = resolve(outputArg);
const [exportedHtml, referenceHtml] = await Promise.all([
  readFile(inputPath, "utf8"),
  readFile(referencePath, "utf8"),
]);

function replaceOnce(source, search, replacement, label) {
  const first = source.indexOf(search);
  const last = source.lastIndexOf(search);

  if (first === -1 || first !== last) {
    throw new Error(`Marcador inválido ou duplicado: ${label}`);
  }

  return source.replace(search, replacement);
}

const customCssMarker = "html.is-embedded .sitenav{display:none;}";
const customCssStart = referenceHtml.indexOf(customCssMarker);
const customCssEnd = referenceHtml.indexOf("</style></head>", customCssStart);

if (customCssStart === -1 || customCssEnd === -1) {
  throw new Error("Não foi possível localizar os ajustes visuais do panorama atual.");
}

const customCss = referenceHtml.slice(customCssStart, customCssEnd).trimEnd();
let adaptedHtml = replaceOnce(
  exportedHtml,
  "</style></head>",
  `${customCss}\n</style></head>`,
  "fim dos estilos",
);

adaptedHtml = replaceOnce(
  adaptedHtml,
  "  --mono:'Inter','Segoe UI',system-ui,-apple-system,Arial,sans-serif;",
  "  --mono:var(--font);",
  "fonte monoespaçada",
);

adaptedHtml = replaceOnce(
  adaptedHtml,
  "<body>\n<header class=\"siteheader\">",
  `<body>\n<script>\nif(window.self !== window.top){\n  document.documentElement.classList.add('is-embedded');\n}\n</script>\n<header class=\"siteheader\">`,
  "início do corpo",
);

const workSectionStart = adaptedHtml.indexOf('<section data-sec="trab">');
const companySectionStart = adaptedHtml.indexOf(
  '<section data-sec="emp">',
  workSectionStart,
);

if (workSectionStart === -1 || companySectionStart === -1) {
  throw new Error("Não foi possível localizar a seção Mercado de Trabalho.");
}

const workSection = adaptedHtml.slice(workSectionStart, companySectionStart);
const workTableMarker =
  '<div class="tblscroll"><div class="tblbloco"><table class="mini">';
const workTableMatches = workSection.split(workTableMarker).length - 1;

if (workTableMatches !== 2) {
  throw new Error(`Esperadas 2 tabelas de emprego; encontradas ${workTableMatches}.`);
}

const adaptedWorkSection = workSection.replaceAll(
  workTableMarker,
  '<div class="tblscroll trab-table-scroll" aria-label="Tabela de empregos formais por setor; deslize horizontalmente para consultar todas as colunas"><div class="tblbloco"><table class="mini">',
);
adaptedHtml =
  adaptedHtml.slice(0, workSectionStart) +
  adaptedWorkSection +
  adaptedHtml.slice(companySectionStart);

const showButtonsMarker = `  var bs=document.querySelectorAll('.jan[data-g="'+g+'"]');
  for(var j=0;j<bs.length;j++){ bs[j].className = 'jan' + (bs[j].getAttribute('data-k')===k ? ' active' : ''); }
}`;
adaptedHtml = replaceOnce(
  adaptedHtml,
  showButtonsMarker,
  `  var bs=document.querySelectorAll('.jan[data-g="'+g+'"]');
  for(var j=0;j<bs.length;j++){ bs[j].className = 'jan' + (bs[j].getAttribute('data-k')===k ? ' active' : ''); }
  var scrollers=document.querySelectorAll('.pane[data-g="'+g+'"][data-k="'+k+'"] .colchart, .pane[data-g="'+g+'"][data-k="'+k+'"] .tblscroll');
  for(var n=0;n<scrollers.length;n++){ scrollers[n].scrollLeft=0; }
}`,
  "função mostrar",
);

adaptedHtml = replaceOnce(
  adaptedHtml,
  "  window.scrollTo({top:0,behavior:'smooth'});\n}",
  "  window.scrollTo({top:0,behavior:'smooth'});\n  notificarSecao(k);\n}",
  "função secao",
);

const navigationBridge = `
function notificarSecao(k){
  if(window.parent!==window){
    window.parent.postMessage({type:'farol-panorama-section',section:k},window.location.origin);
  }
}
window.addEventListener('message',function(event){
  if(event.source!==window.parent || event.origin!==window.location.origin){return;}
  var data=event.data || {};
  var secoes=['__all','dest','cmp','trab','emp','cext','sint','prox'];
  if(data.type==='farol-panorama-select' && secoes.indexOf(data.section)!==-1){
    secao(data.section);
  }
});
window.addEventListener('load',function(){notificarSecao('__all');});
var initialScrollers=document.querySelectorAll('.colchart,.tblwrap,.tblscroll');
for(var s=0;s<initialScrollers.length;s++){ initialScrollers[s].scrollLeft=0; }
`;
const finalScriptEnd = adaptedHtml.lastIndexOf("</script>");

if (finalScriptEnd === -1) {
  throw new Error("Não foi possível localizar o script final do panorama.");
}

adaptedHtml =
  adaptedHtml.slice(0, finalScriptEnd) +
  navigationBridge +
  adaptedHtml.slice(finalScriptEnd);

for (const requiredMarker of [
  "Atualizado em 11 de agosto de 2026",
  "farol-panorama-select",
  "farol-panorama-section",
  "trab-table-scroll",
  "html.is-embedded .sitenav{display:none;}",
  "--mono:var(--font);",
]) {
  if (!adaptedHtml.includes(requiredMarker)) {
    throw new Error(`A saída não contém o marcador obrigatório: ${requiredMarker}`);
  }
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, adaptedHtml, "utf8");
console.log(outputPath);
