import { chromium } from "playwright";

const results = [];
const fail = [];
const check = (name, ok, detail = "") => {
  results.push(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) fail.push(name);
};
const browser = await chromium.launch();

// WCAG relative luminance contrast
const lum = (r, g, b) => {
  const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const parse = (c) => c.match(/\d+(\.\d+)?/g).map(Number);
const ratio = (a, b) => {
  const [la, lb] = [lum(...parse(a).slice(0, 3)), lum(...parse(b).slice(0, 3))].sort((x, y) => y - x);
  return (la + 0.05) / (lb + 0.05);
};

// ---------- 1. All routes × locales: 200, no console errors, one h1
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  const routes = ["", "/ginasio", "/loja", "/loja/t-shirt-wordmark", "/loja/magnesio", "/contactos", "/pendentes"];
  for (const l of ["pt", "en"]) {
    for (const r of routes) {
      const resp = await page.goto(`http://localhost:3000/${l}${r}`, { waitUntil: "networkidle" });
      const h1 = await page.locator("h1").count();
      const lang = await page.getAttribute("html", "lang");
      check(`${l}${r || "/"}`, resp.status() === 200 && h1 === 1, `status ${resp.status()}, h1 ${h1}, lang ${lang}`);
    }
  }
  check("zero console errors across routes", errors.length === 0, errors.slice(0, 3).join(" | "));
  const en = await page.goto("http://localhost:3000/en", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const enLang = await page.evaluate(() => document.documentElement.lang);
  check("/en corrects html lang", en.status() === 200 && enLang === "en", `lang ${enLang}`);
  const ctx404 = await browser.newContext();
  const p404 = await ctx404.newPage();
  const r404 = await p404.goto("http://localhost:3000/pt/nada-disto-existe");
  check("404 page", r404.status() === 404);
  await ctx404.close();
  await ctx.close();
}

// ---------- 2. Preloader: session-once + no-JS safety
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/pt");
  const early = await page.evaluate(() => document.documentElement.dataset.pre === "1");
  await page.waitForTimeout(2600);
  const key = await page.evaluate(() => sessionStorage.getItem("registo.pre"));
  const attrGone = await page.evaluate(() => !document.documentElement.dataset.pre);
  check("preloader shows on first visit", early);
  check("preloader sets session key + clears attr", key === "1" && attrGone);
  await page.reload({ waitUntil: "networkidle" });
  const second = await page.evaluate(() => document.documentElement.dataset.pre === "1");
  check("preloader skipped on second visit", !second);
  await ctx.close();

  const noJs = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p2 = await noJs.newPage();
  await p2.goto("http://localhost:3000/pt");
  const overlayVisible = await p2.locator(".preloader").isVisible().catch(() => false);
  const h1Visible = await p2.locator("h1").isVisible();
  const h1Opacity = await p2.locator("h1").evaluate((el) => getComputedStyle(el).opacity);
  check("no-JS: preloader hidden, content visible", !overlayVisible && h1Visible && h1Opacity === "1");
  await noJs.close();
}

// ---------- 3. Reduced motion: poster not canvas, no hidden reveals
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/pt", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const canvases = await page.locator("canvas").count();
  const posters = await page.locator('img[src*="/media/sequences/"]').count();
  const hiddenReveals = await page.evaluate(() =>
    [...document.querySelectorAll("[data-reveal]")].filter((el) => getComputedStyle(el).opacity === "0").length,
  );
  check("reduced-motion: no canvas, posters present", canvases === 0 && posters === 3, `canvas ${canvases}, posters ${posters}`);
  check("reduced-motion: no invisible content", hiddenReveals === 0, `${hiddenReveals} hidden`);
  await ctx.close();
}

// ---------- 4. Mobile: overflow + NavOverlay dialog contract
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/pt", { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check("mobile: no horizontal overflow", overflow <= 0, `${overflow}px`);
  const canvases = await page.locator("canvas").count();
  check("mobile: no scrub canvas", canvases === 0);
  await page.locator('button[aria-controls="menu-movel"]').click();
  await page.waitForTimeout(400);
  const dialogOpen = await page.locator('#menu-movel[role="dialog"]').isVisible();
  const scrollLocked = await page.evaluate(() => document.body.style.overflow === "hidden");
  check("nav overlay opens as dialog + locks scroll", dialogOpen && scrollLocked);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const closed = (await page.locator("#menu-movel").count()) === 0;
  const unlocked = await page.evaluate(() => document.body.style.overflow === "");
  const focusBack = await page.evaluate(() => document.activeElement?.getAttribute("aria-controls") === "menu-movel");
  check("Escape closes overlay, unlocks scroll, returns focus", closed && unlocked && focusBack);
  await ctx.close();
}

// ---------- 5. Cart flow (checkout routes to Instagram while no WhatsApp)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  // Os cartões da grelha são só foto+nome+preço (decisão de design): a
  // seleção de tamanho vive na página de produto. O fluxo testa o real.
  await page.goto("http://localhost:3000/pt/loja/t-shirt-wordmark", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: "M", exact: true }).click();
  await page.getByRole("button", { name: /Adicionar/ }).click();
  await page.waitForTimeout(500);
  const drawer = page.locator('aside[role="dialog"]');
  check("cart drawer opens on add", await drawer.isVisible());
  const checkoutHref = await drawer.locator('a[target="_blank"]').last().getAttribute("href");
  check("checkout routes to Instagram (no WhatsApp yet)", checkoutHref?.includes("instagram.com/mythical.gym"), checkoutHref);
  await drawer.getByRole("button", { name: /Aumentar/ }).click();
  await page.waitForTimeout(200);
  const qty = await drawer.locator(".t-numeral.w-7").textContent();
  check("qty increment works", qty?.trim() === "2", `qty ${qty}`);
  await drawer.getByRole("button", { name: /^Remover/ }).click();
  await page.waitForTimeout(300);
  check("empty state after remove", await drawer.getByText("O carrinho está vazio.").isVisible());
  await ctx.close();
}

// ---------- 6. Brass rule: every brass-background element has dark text ≥4.5:1
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const pages = ["/pt", "/pt/loja", "/pt/contactos"];
  let worst = { r: 99, where: "" };
  for (const r of pages) {
    await page.goto(`http://localhost:3000${r}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2400);
    const brass = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll("*")) {
        const cs = getComputedStyle(el);
        const bg = cs.backgroundColor;
        if (!bg || bg === "rgba(0, 0, 0, 0)") continue;
        const [r, g, b] = bg.match(/\d+/g).map(Number);
        // brass family: warm golden (r>180, g 130-210, b<130)
        if (r > 180 && g > 130 && g < 215 && b < 130 && el.textContent.trim()) {
          out.push({ bg, color: cs.color, tag: el.tagName, text: el.textContent.trim().slice(0, 24) });
        }
      }
      return out;
    });
    for (const b of brass) {
      const rr = ratio(b.color, b.bg);
      if (rr < worst.r) worst = { r: rr, where: `${r} ${b.tag} "${b.text}"` };
    }
  }
  check("brass rule: dark text on every brass plate (≥4.5)", worst.r >= 4.5, `worst ${worst.r.toFixed(2)} at ${worst.where || "n/a"}`);
  await ctx.close();
}

// ---------- 7. Provisional stamps + honest alts on every stock image
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/pt", { waitUntil: "networkidle" });
  await page.waitForTimeout(2400);
  const stamps = await page.getByText(/imagem provis/i).count();
  const dishonest = await page.evaluate(() =>
    [...document.querySelectorAll('img[src*="/media/"]')]
      .filter((i) => !i.src.includes("marca") && !i.src.includes("badge") && !i.src.includes("logo"))
      .filter((i) => i.alt && !i.alt.includes("provisória") && !i.alt.includes("Placeholder")).length,
  );
  check("homepage: provisional stamps present", stamps >= 2, `${stamps} stamps`);
  check("every provisional image has honest alt", dishonest === 0, `${dishonest} without`);
  await ctx.close();
}

// ---------- 8. Anchors + lazy sequence budget
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const seqRequests = [];
  page.on("request", (req) => req.url().includes("/media/sequences/") && seqRequests.push(req.url()));
  await page.goto("http://localhost:3000/pt", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  // O herói É o filme: os fotogramas dele carregam já (priority). Os planos
  // abaixo da dobra (ferro, fecho) têm de ficar lazy até o scroll chegar lá.
  const heroFrames = seqRequests.filter((u) => u.includes("/abertura/") && u.includes("frame-")).length;
  const lazyFrames = seqRequests.filter((u) => (u.includes("/ferro/") || u.includes("/fecho-v3/")) && u.includes("frame-")).length;
  check("hero film frames load eagerly", heroFrames > 0, `${heroFrames} frames`);
  check("below-fold film beats stay lazy at top", lazyFrames === 0, `${lazyFrames} frames`);
  await page.goto("http://localhost:3000/pt/ginasio", { waitUntil: "networkidle" });
  for (const a of ["#ferro", "#chegar"]) {
    check(`anchor ${a} exists on /ginasio`, (await page.locator(a).count()) === 1);
  }
  await page.goto("http://localhost:3000/pt/contactos", { waitUntil: "networkidle" });
  check("anchor #aderir exists on /contactos", (await page.locator("#aderir").count()) === 1);
  check("skip-link target #main exists", (await page.locator("#main").count()) === 1);
  const equipLink = await page.locator('a[href$="#equipamento"]').count();
  check("footer hides #equipamento link while <2 makers", equipLink === 0, `${equipLink} links`);
  await ctx.close();
}

await browser.close();
console.log(results.join("\n"));
console.log(fail.length ? `\n${fail.length} FAILURES` : "\nALL PASS");
process.exit(fail.length ? 1 : 0);
