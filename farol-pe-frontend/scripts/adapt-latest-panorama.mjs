import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const [inputArg, referenceArg, outputArg] = process.argv.slice(2);
if (!inputArg || !referenceArg || !outputArg) {
  throw new Error("Uso: node adapt-latest-panorama.mjs <novo> <referencia> <saida>");
}

const [exportedHtml, referenceHtml] = await Promise.all([
  readFile(resolve(inputArg), "utf8"),
  readFile(resolve(referenceArg), "utf8"),
]);

function replaceOnce(source, search, replacement, label) {
  const first = source.indexOf(search);
  if (first === -1 || first !== source.lastIndexOf(search)) {
    throw new Error(`Marcador ausente ou duplicado: ${label}`);
  }
  return source.replace(search, replacement);
}

const customCssMarker = "html.is-embedded .sitenav{display:none;}";
const cssStart = referenceHtml.indexOf(customCssMarker);
const cssEnd = referenceHtml.indexOf("</style></head>", cssStart);
if (cssStart === -1 || cssEnd === -1) throw new Error("Ajustes visuais não encontrados.");

const customCss = referenceHtml.slice(cssStart, cssEnd).trimEnd();
let html = replaceOnce(
  exportedHtml,
  "</style></head>",
  `${customCss}\n</style></head>`,
  "fim dos estilos",
);

html = replaceOnce(
  html,
  "  --mono:'Inter','Segoe UI',system-ui,-apple-system,Arial,sans-serif;",
  "  --mono:var(--font);",
  "fonte monoespaçada",
);

html = replaceOnce(
  html,
  '<body>\n<header class="siteheader">',
  `<body>\n<script>\nif(window.self !== window.top){\n  document.documentElement.classList.add('is-embedded');\n}\n</script>\n<header class="siteheader">`,
  "início do corpo",
);

const workStart = html.indexOf('<section data-sec="trab">');
const companyStart = html.indexOf('<section data-sec="emp">', workStart);
if (workStart === -1 || companyStart === -1) throw new Error("Mercado de Trabalho não encontrado.");
const workSection = html.slice(workStart, companyStart);
const tableMarker = '<div class="tblscroll"><div class="tblbloco"><table class="mini">';
if (workSection.split(tableMarker).length - 1 !== 2) throw new Error("Tabelas de emprego inesperadas.");
html = html.slice(0, workStart) + workSection.replaceAll(
  tableMarker,
  '<div class="tblscroll trab-table-scroll" aria-label="Tabela de empregos formais por setor; deslize horizontalmente para consultar todas as colunas"><div class="tblbloco"><table class="mini">',
) + html.slice(companyStart);

const buttonMarker = `  var bs=document.querySelectorAll('.jan[data-g="'+g+'"]');
  for(var j=0;j<bs.length;j++){ bs[j].className = 'jan' + (bs[j].getAttribute('data-k')===k ? ' active' : ''); }
}`;
html = replaceOnce(html, buttonMarker, `  var bs=document.querySelectorAll('.jan[data-g="'+g+'"]');
  for(var j=0;j<bs.length;j++){ bs[j].className = 'jan' + (bs[j].getAttribute('data-k')===k ? ' active' : ''); }
  var scrollers=document.querySelectorAll('.pane[data-g="'+g+'"][data-k="'+k+'"] .colchart, .pane[data-g="'+g+'"][data-k="'+k+'"] .tblscroll');
  for(var n=0;n<scrollers.length;n++){ scrollers[n].scrollLeft=0; }
}`, "função mostrar");

html = replaceOnce(
  html,
  "  window.scrollTo({top:0,behavior:'smooth'});\n}",
  "  window.scrollTo({top:0,behavior:'smooth'});\n  notificarSecao(k);\n  notificarPronto(k);\n}",
  "função secao",
);

const bridge = `
function notificarSecao(k){
  if(window.parent!==window){window.parent.postMessage({type:'farol-panorama-section',section:k},window.location.origin);}
}
var panoramaReadySequence=0;
function notificarPronto(k){
  if(window.parent===window){return;}
  var sequence=++panoramaReadySequence;
  var fontsReady=document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve();
  Promise.resolve(fontsReady).catch(function(){}).then(function(){
    window.requestAnimationFrame(function(){window.requestAnimationFrame(function(){
      if(sequence!==panoramaReadySequence){return;}
      window.parent.postMessage({type:'farol-panorama-ready',section:k},window.location.origin);
    });});
  });
}
window.addEventListener('message',function(event){
  if(event.source!==window.parent || event.origin!==window.location.origin){return;}
  var data=event.data || {};
  var secoes=['__all','dest','cmp','trab','emp','cext','sint','prox'];
  if(data.type==='farol-panorama-select' && secoes.indexOf(data.section)!==-1){secao(data.section);}
});
window.addEventListener('load',function(){notificarSecao('__all');});
var initialScrollers=document.querySelectorAll('.colchart,.tblwrap,.tblscroll');
for(var s=0;s<initialScrollers.length;s++){initialScrollers[s].scrollLeft=0;}
`;
const scriptEnd = html.lastIndexOf("</script>");
if (scriptEnd === -1) throw new Error("Script final não encontrado.");
html = html.slice(0, scriptEnd) + bridge + html.slice(scriptEnd);

for (const marker of [
  "Atualizado em 13 de agosto de 2026",
  "farol-panorama-select",
  "farol-panorama-section",
  "farol-panorama-ready",
  "trab-table-scroll",
  customCssMarker,
  "--mono:var(--font);",
  "<span>jun/2026 sobre mai/2026</span>",
  "<span>jul/25 a jun/26 sobre jul/24 a jun/25</span>",
]) {
  if (!html.includes(marker)) throw new Error(`Marcador obrigatório ausente: ${marker}`);
}

await mkdir(dirname(resolve(outputArg)), { recursive: true });
await writeFile(resolve(outputArg), html, "utf8");
console.log(resolve(outputArg));
