"use client";

import { useEffect, useState } from "react";
import { Plate } from "../Wordmark";
import { PRELOADER_SESSION_KEY } from "./preloader-gate";

/**
 * O preloader do registo: uma vez por sessão, nunca mais.
 *
 * COMO NÃO REBENTA A HIDRATAÇÃO: o overlay renderiza SEMPRE no servidor
 * (HTML igual dos dois lados). Quem decide se aparece é o CSS, atrás do
 * `html[data-pre="1"]` que o script inline do <head> põe antes do primeiro
 * paint (ver preloader-gate.ts). Nada aqui lê sessionStorage durante o
 * render.
 *
 * O QUE ELE ESPERA: o mínimo entre as fontes prontas e um teto de 2,2s,
 * nunca menos do que um compasso de 1,25s. À primeira visita isto também
 * engole o swap da Fraunces no display do herói: quando a cortina sobe, a
 * serifa já lá está.
 */
export function Preloader({ line }: { line: string }) {
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Sem `data-pre`, o CSS já esconde o overlay (display: none). Não é
    // preciso estado nenhum: o nó fica inerte e invisível.
    if (document.documentElement.dataset.pre !== "1") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
    let exitTimer: number | undefined;
    let alive = true;

    const run = async () => {
      await Promise.race([
        Promise.all([document.fonts.ready, delay(reduced ? 100 : 1250)]),
        delay(2200),
      ]);
      if (!alive) return;
      try {
        sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
      } catch {}
      setDone(true);
      exitTimer = window.setTimeout(
        () => {
          delete document.documentElement.dataset.pre;
          setGone(true);
        },
        reduced ? 30 : 700,
      );
    };
    run();
    return () => {
      alive = false;
      if (exitTimer) clearTimeout(exitTimer);
    };
  }, []);

  if (gone) return null;

  return (
    <div className="preloader" data-done={done || undefined} aria-hidden="true">
      <div className="pre-mark flex flex-col items-center gap-6">
        <Plate size={44} />
        <p className="t-data text-mercury">{line}</p>
        <span className="wipe h-px w-44 bg-brass" style={{ animationDuration: "1.6s" }} />
      </div>
    </div>
  );
}
