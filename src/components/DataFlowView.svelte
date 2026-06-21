<script lang="ts">
  import type { Technique } from "../lib/types";

  // The keystone view. Renders the assembled prompt as labeled blocks, highlights
  // the single carrier block (ISC-11, ISC-12), animates the highlight on change
  // (ISC-27), and reveals the decoded payload only on demand so the student sees
  // the encoded form first (ISC-14, ISC-26).
  let { entry }: { entry: { technique: Technique; decoded: string } } = $props();

  let revealed = $state(false);
  // Reset the reveal whenever the selected technique changes, so the
  // encoded-before-decoded beat replays for every attack.
  $effect(() => {
    entry.technique.id; // track
    revealed = false;
  });

  const hasEncoding = $derived(entry.technique.encoding !== "none");
</script>

<p class="hint">
  Watch which block carries the injected bytes. The highlighted block is the
  <strong>carrier</strong>.
</p>

{#key entry.technique.id}
  <div class="blocks">
    {#each entry.technique.blocks as b (b.id)}
      <section class="block" class:carrier={b.id === entry.technique.carrier}>
        <header>
          <span><strong>{b.label}</strong> <em>({b.trust})</em></span>
          {#if b.id === entry.technique.carrier}<span class="tag">CARRIER</span>{/if}
        </header>
        <pre>{b.content}</pre>
      </section>
    {/each}
  </div>
{/key}

{#if hasEncoding}
  <div class="decode">
    <button onclick={() => (revealed = !revealed)}>
      {revealed ? "Hide decoded payload" : "Reveal what the bytes decode to"}
    </button>
    {#if revealed}
      <p class="decoded"><strong>Decodes to:</strong> {entry.decoded}</p>
    {/if}
  </div>
{/if}

<h3>What the assistant did</h3>
<pre class="resp">{entry.technique.assistantResponse}</pre>

<h3>Why the model obeyed</h3>
<p>{entry.technique.whyObeyed}</p>

<p class="note">{entry.technique.sandboxNote}</p>

<style>
  .hint {
    color: var(--muted, #8b949e);
    margin: 0 0 0.75rem;
  }
  .blocks {
    display: grid;
    gap: 0.6rem;
  }
  .block {
    border: 1px solid var(--line, #30363d);
    border-radius: 6px;
    padding: 0.6rem 0.85rem;
  }
  .block header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--muted, #8b949e);
    font-size: 0.85rem;
  }
  .block pre {
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0.4rem 0 0;
    font-size: 0.9rem;
  }
  .carrier {
    border-color: var(--accent, #f0883e);
    box-shadow: 0 0 0 1px var(--accent, #f0883e);
    animation: pulse 900ms ease-out;
  }
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(240, 136, 62, 0.55); }
    100% { box-shadow: 0 0 0 1px var(--accent, #f0883e); }
  }
  .tag {
    color: var(--accent, #f0883e);
    font-weight: 700;
    letter-spacing: 0.05em;
  }
  .decode {
    margin: 1rem 0;
  }
  .decode button {
    background: transparent;
    color: var(--accent, #f0883e);
    border: 1px solid var(--accent, #f0883e);
    border-radius: 6px;
    padding: 0.4rem 0.75rem;
    cursor: pointer;
    font-size: 0.85rem;
  }
  .decoded {
    margin: 0.6rem 0 0;
    padding: 0.6rem 0.85rem;
    border: 1px dashed var(--accent, #f0883e);
    border-radius: 6px;
  }
  .resp {
    white-space: pre-wrap;
    background: var(--panel, #161b22);
    border: 1px solid var(--line, #30363d);
    border-radius: 6px;
    padding: 0.6rem 0.85rem;
  }
  .note {
    color: var(--muted, #8b949e);
    font-size: 0.85rem;
    border-left: 3px solid var(--accent, #f0883e);
    padding-left: 0.75rem;
  }
</style>
