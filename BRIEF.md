# Carrier — Project Brief

## What is it?

A deterministic, offline, browser-based teaching lab for prompt injection. Students pick a realistic attack, fire it at a simulated assistant, and watch which block of the assembled prompt carried the injected bytes. No API keys, no live model calls, no backend.

**Status:** Complete, red-teamed, live on Vercel.

## The work

- **6 injection techniques** across 3 difficulty-ramped labs
- **4 prompt blocks** (system, user, retrieved, tool) showing trust boundaries
- **Deterministic engine** — every attack, prompt, and response is versioned data
- **Astro + Svelte** — static HTML prose, interactive island widgets, zero-JS graceful degradation
- **Verified** — tests 13/13, build clean, offline-capable, no network calls

## Key insight from red-team

Not all injection attacks are categorized by their carrier block. Some (System Prompt Leak, Payload Splitting) are named for their objective or evasion mechanism instead. The lab's explainers now make this distinction explicit — it's the pedagogical payoff. Students learn: "where it rides" ≠ "what it's called."

## How to use

**Live:** https://carrier-beta.vercel.app

**Locally:**
```bash
git clone https://github.com/joseruiz1571/carrier
cd carrier
bun install
bun run dev    # local dev server
bun run build  # static build to dist/
```

## Where things live

- **Techniques:** `src/data/techniques.ts` (the attack library — all blocks, payloads, explanations)
- **Labs:** `src/data/labs.ts` (3 labs, 2 techniques each)
- **Engine:** `src/lib/scenario.ts` (~80 lines, pure functions, zero IO)
- **UI:** `src/components/Lab.svelte`, `DataFlowView.svelte`, `AttackPicker.svelte`, `ExplainerTabs.svelte`
- **Routes:** `src/pages/index.astro` (landing), `src/pages/labs/[lab].astro` (dynamic)

## To extend

1. Add technique to `src/data/techniques.ts`
2. Run `bun test` (data-integrity guard validates it)
3. Add to a lab in `src/data/labs.ts`
4. Deploy: `bun run build` or push to GitHub → Vercel auto-redeploys (needs one-time dashboard OAuth)

## Notes

- **GitHub→Vercel auto-deploy** is wired (repo is public) but needs one-time dashboard OAuth to activate. Until then redeploy via `bunx vercel --prod --yes`.
- **URL state** is recovered from the hash — sharing a link with a specific attack selected lands the classmate on the same attack.
- **Red-team was author-conducted** (independent agents hit spend limit). Independent review welcome when funding allows.
