import Link from "next/link";
import { Plate } from "@/components/Wordmark";

export default function NotFound() {
  return (
    <main className="grain relative grid min-h-screen place-items-center bg-base px-6">
      <div className="relative z-10 text-center">
        <Plate className="mx-auto" size={40} />
        <p className="t-numeral mt-8 text-7xl text-cream sm:text-8xl">404</p>
        <h1 className="t-headline mt-4 text-2xl text-cream">
          Esta página não existe.
        </h1>
        <p className="t-body mx-auto mt-3 max-w-sm text-sm text-mercury">
          O ginásio existe, e fica na Zona Industrial da Formiga, em Pombal.
          Esta página é que não.
        </p>
        <Link
          href="/pt"
          className="t-data mt-8 inline-block bg-brass px-6 py-3.5 text-vault transition-colors hover:bg-brass-dim"
        >
          Voltar ao início →
        </Link>
      </div>
    </main>
  );
}
