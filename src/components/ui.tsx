"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { trapTab } from "./focus";

/* ===========================================================================
   Reveal: entrada ao scroll, uma vez, e desliga-se sozinho.
   Respeita prefers-reduced-motion através do CSS (.reveal fica sem transição).
   ========================================================================= */

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Sem ramo para prefers-reduced-motion: quem não quer movimento já recebe a
    // .reveal sem transição pelo CSS, e o conteúdo aparece na mesma ao entrar em
    // viewport. Um setShown() síncrono aqui só duplicava isso e forçava re-render.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      data-shown={shown}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ===========================================================================
   Botões
   ========================================================================= */

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "outline" | "outline-invert" | "on-paper" | "solid-on-paper" | "ghost";
  className?: string;
  external?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
};

const BASE =
  "group inline-flex items-center justify-center gap-2.5 t-data px-6 py-3.5 transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none";

const VARIANTS = {
  /* O texto do botão sólido é ESCURO, e não branco. A chapa é de latão: branco
     por cima dá 1.8:1 e é ilegível, texto carvão dá 8.4:1. O hover CLAREIA o
     latão, pela mesma razão: escurecê-lo aproximaria os dois tons. */
  solid: "bg-oxide-solid text-carbon hover:bg-oxide-dim",
  /* `hairline-strong` e não `hairline`: a borda de um BOTÃO é o limite de um
     controlo e a WCAG 1.4.11 pede-lhe 3:1. A linha decorativa que separa
     secções não tem esse dever, e por isso são dois tokens e não um. */
  outline:
    "border border-hairline-strong text-chalk hover:border-oxide hover:text-oxide bg-transparent",
  /* O mesmo botão, para viver por cima de fotografia ou de vídeo. Existe como
     variante e não como className à solta porque duas classes Tailwind com a
     mesma especificidade decidem-se pela ordem na folha de estilos, e não pela
     ordem em que as escrevemos. */
  "outline-invert":
    "border border-white/45 text-white hover:border-white hover:bg-white hover:text-carbon bg-transparent",
  /* Para viver sobre a banda de papel, que é clara. */
  "on-paper":
    "border border-paper-line-strong text-ink hover:border-oxide-deep hover:text-oxide-deep bg-transparent",
  /* O botão PRIMÁRIO da banda clara. Latão cheio sobre papel não serve: o texto
     por cima lê-se bem, mas o limite do próprio botão contra o papel fica em
     1,8:1 e a caixa dilui-se no fundo. Carvão cheio resolve as duas coisas. */
  "solid-on-paper": "bg-carbon text-chalk hover:bg-carbon-2",
  ghost: "text-steel hover:text-chalk px-0 py-1",
} as const;

export function Button({
  children,
  href,
  onClick,
  variant = "solid",
  className = "",
  external,
  type = "button",
  disabled,
  ...rest
}: ButtonProps) {
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {variant !== "ghost" && (
        <span
          aria-hidden
          className="inline-block transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled} {...rest}>
      {inner}
    </button>
  );
}

/* ===========================================================================
   Vídeo: fachada leve, e ecrã inteiro a sério.

   Duas decisões que não são óbvias:

   1. O overlay é montado em document.body, com um portal. Tinha `fixed
      inset-0` e mesmo assim abria a meio da página, encaixado dentro do herói.
      A razão: um elemento com animação de `transform` (as nossas .rise e
      .reveal) passa a ser o bloco de contenção dos descendentes `fixed`. O
      `fixed` deixa de olhar para o ecrã e passa a olhar para o pai. Nenhum
      z-index resolve isto. O portal, sim: tira o overlay de dentro da árvore
      animada e prega-o ao body, que é onde um diálogo pertence.

   2. Não carrega o iframe até haver clique. Um embed que arranca sozinho custa
      ~800 KB e três domínios de terceiros à primeira pintura. A exceção é o
      vídeo de fundo do herói, que é o próprio conteúdo e por isso paga-se.
   ========================================================================= */

export function VideoLightbox({
  platform,
  id,
  title,
  credit,
  label,
  closeLabel,
  className = "",
  /** A fotografia que fica POR BAIXO do player, dentro do diálogo. Ver em baixo. */
  poster,
  children,
}: {
  platform: "vimeo" | "youtube";
  id: string;
  title: string;
  credit?: string;
  label: string;
  closeLabel: string;
  className?: string;
  poster?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      trapTab(e, dialogRef.current);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    // Ecrã inteiro do browser, quando o browser deixa (o clique é o gesto que o
    // autoriza). Se recusar, o overlay já ocupa o viewport todo e ninguém dá
    // pela diferença: por isso o catch é vazio e não um erro.
    dialogRef.current?.requestFullscreen?.().catch(() => {});

    // Sair do fullscreen (o Esc do browser, o botão do sistema) tem de fechar o
    // overlay também. Caso contrário ficava um diálogo aberto sem ecrã inteiro.
    const onFsChange = () => {
      if (!document.fullscreenElement) setOpen(false);
    };
    document.addEventListener("fullscreenchange", onFsChange);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFsChange);
      document.body.style.overflow = "";
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      // Fechado o vídeo, o foco volta ao botão que o abriu e não ao topo da página.
      if (opener?.isConnected) opener.focus();
    };
  }, [open]);

  const src =
    platform === "vimeo"
      ? `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`
      : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;

  const dialog = (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      {/* Só o vídeo. Preenche o ecrã até onde o 16:9 deixa, sem cortar imagem.
          A fotografia fica por baixo do iframe, e não é decoração: se o embed for
          bloqueado (adblocker, rede do ginásio, terceiro em baixo), o iframe não
          pinta nada e, sem isto, quem carregou em "ver o vídeo" recebia um
          retângulo preto vazio. Assim recebe, no mínimo, a imagem. */}
      <div className="relative aspect-video max-h-full w-full max-w-[177.78vh]">
        {poster && <div className="absolute inset-0">{poster}</div>}
        <iframe
          src={src}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      </div>

      <button
        ref={closeRef}
        onClick={() => setOpen(false)}
        className="t-data absolute right-4 top-4 z-2 border border-white/30 bg-black/70 px-3 py-2 text-white transition-colors duration-300 hover:bg-white hover:text-black sm:right-6 sm:top-6"
      >
        {closeLabel} ✕
      </button>

      {credit && (
        <p className="t-data absolute bottom-4 left-4 text-white/70 sm:bottom-6 sm:left-6">
          © {credit}
        </p>
      )}
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`group/v block w-full text-left ${className}`}
        aria-label={`${label}: ${title}`}
      >
        {children ?? (
          <span className="inline-flex items-center gap-3 t-data text-chalk">
            <span className="grid size-11 place-items-center rounded-full border border-hairline transition-colors duration-300 group-hover/v:border-oxide group-hover/v:bg-oxide">
              <span aria-hidden className="ml-0.5 text-[0.7rem]">
                ▶
              </span>
            </span>
            {label}
          </span>
        )}
      </button>

      {/* Sem guarda de "mounted": o diálogo só existe depois de um clique, e um
          clique já é o browser. No servidor, `open` é sempre false. */}
      {open && createPortal(dialog, document.body)}
    </>
  );
}

/* ===========================================================================
   Vídeo de fundo: o herói.
   O player do Vimeo em modo `background`: sem controlos, sem som, em loop, e
   sem receber cliques. É decoração animada, portanto aria-hidden e fora da
   ordem de tabulação. Quem não quer movimento (prefers-reduced-motion) não o
   recebe: fica a fotografia que está por baixo.
   ========================================================================= */

export function BackgroundVideo({ id, className = "" }: { id: string; className?: string }) {
  return (
    <div aria-hidden className={`absolute inset-0 overflow-hidden motion-reduce:hidden ${className}`}>
      <iframe
        src={`https://player.vimeo.com/video/${id}?background=1&autoplay=1&loop=1&muted=1&dnt=1`}
        title=""
        tabIndex={-1}
        allow="autoplay; fullscreen"
        /* Cover para um iframe, que não tem object-fit. O par (100vw, 56.25vw) é
           16:9; quando o ecrã é alto de mais, os mínimos (100vh, 177.78vh) tomam
           conta e continuam a ser 16:9. O rácio nunca se perde, e a imagem nunca
           estica: sangra pelo lado que sobra. */
        className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] max-w-none min-h-screen w-screen min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2 border-0"
      />
    </div>
  );
}
