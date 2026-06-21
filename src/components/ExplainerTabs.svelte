<script lang="ts">
  import type { Technique } from "../lib/types";
  import type { Snippet } from "svelte";

  // Explainer tabs (ISC-17): the Lab view plus Code (the data that drives it)
  // and Author (taxonomy, carrier rationale, sandbox note — ISC-16, ISC-20, ISC-33).
  let {
    entry,
    lab,
  }: {
    entry: { technique: Technique; decoded: string };
    lab: Snippet;
  } = $props();

  let tab = $state<"lab" | "code" | "author">("lab");
</script>

<div class="tabbar" role="tablist">
  <button role="tab" class:active={tab === "lab"} onclick={() => (tab = "lab")}>Lab</button>
  <button role="tab" class:active={tab === "code"} onclick={() => (tab = "code")}>Code</button>
  <button role="tab" class:active={tab === "author"} onclick={() => (tab = "author")}>Author</button>
</div>

<div class="pane">
  {#if tab === "lab"}
    {@render lab()}
  {:else if tab === "code"}
    <p class="muted">
      This lab is data, not magic. Here is the exact record that drives what you
      just saw (from <code>src/data/techniques.ts</code>):
    </p>
    <pre class="code">{JSON.stringify(entry.technique, null, 2)}</pre>
  {:else}
    <h3>Targeting</h3>
    <ul>
      <li><strong>Technique:</strong> {entry.technique.label}</li>
      <li>
        <strong>Taxonomy:</strong>
        {entry.technique.taxonomy.source} — {entry.technique.taxonomy.ref}
      </li>
      <li>
        <strong>Carrier block:</strong>
        <code>{entry.technique.carrier}</code> — this is where the injected bytes ride.
      </li>
      <li><strong>Encoding:</strong> {entry.technique.encoding}</li>
    </ul>
    <p class="note">{entry.technique.sandboxNote}</p>
  {/if}
</div>

<style>
  .tabbar {
    display: flex;
    gap: 0.25rem;
    border-bottom: 1px solid var(--line, #30363d);
    margin-bottom: 1rem;
  }
  .tabbar button {
    background: transparent;
    color: var(--muted, #8b949e);
    border: none;
    border-bottom: 2px solid transparent;
    padding: 0.5rem 0.85rem;
    cursor: pointer;
    font-size: 0.9rem;
  }
  .tabbar button.active {
    color: var(--ink, #e6edf3);
    border-bottom-color: var(--accent, #f0883e);
  }
  .muted {
    color: var(--muted, #8b949e);
  }
  .code {
    white-space: pre-wrap;
    word-break: break-word;
    background: var(--panel, #161b22);
    border: 1px solid var(--line, #30363d);
    border-radius: 6px;
    padding: 0.75rem 0.85rem;
    font-size: 0.82rem;
  }
  .note {
    color: var(--muted, #8b949e);
    font-size: 0.85rem;
    border-left: 3px solid var(--accent, #f0883e);
    padding-left: 0.75rem;
  }
</style>
