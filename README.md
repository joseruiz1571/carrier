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

Three labs, simplest to subtlest:

1. **Direct Override** — the bytes ride in the user turn.
2. **Indirect Injection** — they ride in retrieved content or a tool result.
3. **Encoded Smuggling** — they ride encoded (base64, unicode confusables) and only decode inside the model.

## How it works

- **Astro + Svelte islands.** Lab prose is static HTML (zero JS by default); only
  the attack picker and the data-flow view hydrate as interactive islands.
- **Deterministic.** All attacks, assembled prompts, and assistant responses live
  in versioned data files (`src/data/`). Same input, same lesson, every run.
- **Read the source.** The pedagogy includes reading the code. Start in
  `src/data/techniques.ts` (the attack library) and `src/lib/scenario.ts` (the engine).

## Attribution

Technique names and taxonomy draw on:

- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) — LLM01 Prompt Injection, LLM07 System Prompt Leakage.
- [Microsoft PyRIT](https://github.com/Azure/PyRIT) — converter/technique vocabulary (Base64, payload splitting, unicode confusables).

PyRIT is MIT-licensed; OWASP material is CC BY-SA. Only vocabulary and technique
descriptions are referenced here — no code or text is copied. Carrier itself is
released under the MIT License (see [LICENSE](./LICENSE)).
