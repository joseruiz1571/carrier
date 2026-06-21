<script lang="ts">
  import type { Technique } from "../lib/types";

  // Multiple-choice attack selector (ISC-7). No free-text input by design (ISC-34).
  let {
    techniques,
    selectedId,
    onSelect,
  }: {
    techniques: Technique[];
    selectedId: string;
    onSelect: (id: string) => void;
  } = $props();
</script>

<fieldset class="picker">
  <legend>Choose an attack</legend>
  {#each techniques as t (t.id)}
    <label class="opt" class:active={t.id === selectedId}>
      <input
        type="radio"
        name="attack"
        value={t.id}
        checked={t.id === selectedId}
        onchange={() => onSelect(t.id)}
      />
      <span class="label">{t.label}</span>
      <span class="meta">{t.taxonomy.source} · rides in the {t.carrier} block</span>
    </label>
  {/each}
</fieldset>

<style>
  .picker {
    border: 1px solid var(--line, #30363d);
    border-radius: 8px;
    padding: 0.75rem 1rem 1rem;
    margin: 0 0 1.25rem;
    display: grid;
    gap: 0.5rem;
  }
  legend {
    color: var(--muted, #8b949e);
    font-size: 0.85rem;
    padding: 0 0.4rem;
  }
  .opt {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas: "radio label" "radio meta";
    column-gap: 0.6rem;
    align-items: center;
    border: 1px solid var(--line, #30363d);
    border-radius: 6px;
    padding: 0.6rem 0.75rem;
    cursor: pointer;
  }
  .opt.active {
    border-color: var(--accent, #f0883e);
    box-shadow: 0 0 0 1px var(--accent, #f0883e);
  }
  .opt input {
    grid-area: radio;
    accent-color: var(--accent, #f0883e);
  }
  .label {
    grid-area: label;
    font-weight: 600;
  }
  .meta {
    grid-area: meta;
    color: var(--muted, #8b949e);
    font-size: 0.8rem;
  }
</style>
