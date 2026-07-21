/**
 * Script inline que corre ANTES do primeiro paint (primeiro filho do <body>).
 * Dois atributos no <html>:
 * - `data-js`: existe JS. É atrás dele que vivem os estados iniciais
 *   escondidos do sistema de revelação (globals.css). Sem JS, tudo visível.
 * - `data-pre`: esta sessão ainda não viu o preloader. O overlay renderiza
 *   sempre no servidor; é o CSS que o mostra ou não — zero hydration mismatch.
 *
 * Partilhado num módulo SEM "use client" de propósito: o layout (servidor)
 * injeta a string, o Preloader (cliente) usa a mesma chave de sessão. Se os
 * dois divergirem, o preloader repete em cada página — não separar.
 */
export const PRELOADER_SESSION_KEY = "registo.pre";

export const PRELOADER_GATE_SCRIPT = `try{document.documentElement.dataset.js="1";if(!sessionStorage.getItem("${PRELOADER_SESSION_KEY}"))document.documentElement.dataset.pre="1"}catch(e){document.documentElement.dataset.js="1"}`;
