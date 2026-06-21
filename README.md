# Carrier

A deterministic, static browser lab that teaches **where prompt injection rides**.

You pick a realistic attack from a menu, fire it at a simulated assistant, and the
assembled prompt lights up to show exactly which block carried the injected bytes
and why the model obeyed. No API keys. No live model calls. No backend.

> Every payload here is **illustrative and sandboxed**. Nothing in this lab is a
> working exploit against a real system. It is a teaching tool.

## Run it

**Hosted:** https://carrier-beta.vercel.app

**Locally** (needs [Bun](https://bun.sh)):

```bash
git clone <repo-url> carrier
cd carrier
bun install
bun run dev      # serves at the URL it prints; open it and start at Lab 01
```

Build the static site instead:

```bash
bun run build    # emits ./dist — any static host (or `bun run preview`) serves it
```

## The labs

Three labs, simplest to subtlest — **six techniques** across all four prompt blocks (system, user, retrieved, tool):

1. **Direct Override** (user block)
   - Direct Instruction Override — override the system instructions with a fresh command
   - System Prompt Leak — coax the model into echoing its hidden system instructions (note: named for its *objective*, not its block — the carrier is the same as Direct Override)

2. **Indirect Injection** (retrieved + tool blocks)
   - Indirect / Cross-Domain Injection — smuggle an instruction into retrieved context
   - Payload Splitting — fragment an override across fields so no filter catches a complete phrase

3. **Encoded Smuggling** (retrieved block, encoded)
   - Base64 Payload Smuggling — hide the instruction in base64 so filters wave it through
   - Unicode Confusable Smuggling — use Cyrillic homoglyphs to evade exact-string blocklists

**Important pedagogical note:** The lab is organized around "which block carries the injected bytes" — but not all attack names match that axis. *System-Prompt-Leak* and *Payload-Splitting* are instead named for their objective or evasion mechanism, respectively. The lab's explainers make this explicit so students learn: some attacks are categorized by where they ride, others by what they want or how they hide. This distinction is the real insight — there is no single "carrier axis" that explains all injection attacks.

## Status

**Complete and verified.** The lab has been red-teamed for technical accuracy and pedagogical soundness. Two techniques (System Prompt Leak, Payload Splitting) were reframed during review to clarify that not all injection attacks are categorized by their carrier block — some are named for their objective or evasion mechanism. The lab's explainer text now makes this distinction explicit.

- **6 techniques** across 3 difficulty-ramped labs
- **Deterministic** — all prompts, responses, and attacks are versioned data (same input, same lesson, every run)
- **Verified** — Astro static build, zero network calls, no API keys, fully offline, no-JS graceful degradation
- **Live on Vercel** — https://carrier-beta.vercel.app (or clone + `bun run dev` locally)

## How it works

- **Astro + Svelte islands.** Lab prose is static HTML (zero JS by default); only
  the attack picker and the data-flow view hydrate as interactive islands.
- **Deterministic.** All attacks, assembled prompts, and assistant responses live
  in versioned data files (`src/data/`). Same input, same lesson, every run.
- **Read the source.** The pedagogy includes reading the code. Start in
  `src/data/techniques.ts` (the attack library) and `src/lib/scenario.ts` (the engine).

## Design principles

1. **Deterministic over dynamic.** Every lab state is derivable from versioned data — no API calls, no inference, no randomness. A student can share a link with a specific attack selected (URL hash encodes the choice) and a classmate sees the exact same lesson.

2. **Trust boundaries are the curriculum.** The assembled prompt is rendered as labeled blocks with trust levels (trusted, semi-trusted, untrusted). The carrier block is visually highlighted. This forces the student to ask: "Why does the model treat an untrusted block as if it were instructions?" That's the insight.

3. **Read the source is the pedagogy.** The data file (`src/data/techniques.ts`) contains every technique, every prompt block, every assembled prompt, every assistant response. Students are encouraged to read and modify it. The engine (`src/lib/scenario.ts`) is a ~80-line pure function. No magic, no hidden state.

4. **Static, no backend.** Carrier runs entirely in the browser (Astro static + Svelte islands). Zero server runtime, zero database, zero API. It renders offline and ships as plain HTML/CSS/JS to any static host (Vercel, GitHub Pages, etc.).

## Extending Carrier

To add a 7th technique or a 4th lab:

1. Add the technique to `src/data/techniques.ts` — include all blocks (system, user, retrieved, tool as needed), the encoded payload, the decoded intent, and the "why the model obeyed" explanation.
2. Run `bun test` — the data-integrity guard will verify the carrier block contains the payload.
3. Update `src/data/labs.ts` to place the technique in a lab.
4. The dynamic `src/pages/labs/[lab].astro` and the Lab.svelte island will render it without code changes.

## Attribution

Technique names and taxonomy draw on:

- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) — LLM01 Prompt Injection, LLM07 System Prompt Leakage.
- [Microsoft PyRIT](https://github.com/Azure/PyRIT) — converter/technique vocabulary (Base64, payload splitting, unicode confusables).

PyRIT is MIT-licensed; OWASP material is CC BY-SA. Only vocabulary and technique
descriptions are referenced here — no code or text is copied. Carrier itself is
released under the MIT License (see [LICENSE](./LICENSE)).
