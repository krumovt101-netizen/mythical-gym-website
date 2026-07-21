/**
 * Trancar o foco dentro de um diálogo.
 *
 * Os três diálogos do site (menu móvel, gaveta do carrinho, vídeo em ecrã
 * inteiro) declaram `aria-modal="true"`, levam o foco para dentro e devolvem-no
 * ao fechar. Faltava-lhes a parte que o ARIA promete e que ninguém vê: o Tab
 * saía do diálogo para a página por baixo. Como a página está tapada por um
 * overlay opaco, quem navega por teclado ou com leitor de ecrã ficava a carregar
 * em botões que não vê. Um modal que deixa o foco fugir não é um modal: é uma
 * caixa desenhada por cima.
 *
 * O ciclo é feito nas bordas: do último para o primeiro, e do primeiro para o
 * último com Shift. É o suficiente porque o diálogo é montado no fim do body, e
 * portanto o que vem "a seguir" a ele na ordem de tabulação é o início da página.
 */
const SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function focusables(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>(SELECTOR)).filter(
    (el) => el.offsetParent !== null || el.tagName === "IFRAME",
  );
}

/** Devolve true se tratou a tecla (e o chamador deve parar aqui). */
export function trapTab(e: KeyboardEvent, root: HTMLElement | null): boolean {
  if (e.key !== "Tab") return false;
  const list = focusables(root);
  if (list.length === 0) return false;

  const first = list[0];
  const last = list[list.length - 1];
  const active = document.activeElement;

  // O foco pode estar fora do diálogo (o browser devolveu-o à página). Nesse
  // caso, puxa-se para dentro em vez de o deixar continuar a passear.
  if (!root?.contains(active)) {
    e.preventDefault();
    first.focus();
    return true;
  }
  if (e.shiftKey && active === first) {
    e.preventDefault();
    last.focus();
    return true;
  }
  if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
    return true;
  }
  return false;
}
