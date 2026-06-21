<script lang="ts">
  import type { Technique } from "../lib/types";
  import AttackPicker from "./AttackPicker.svelte";
  import DataFlowView from "./DataFlowView.svelte";
  import ExplainerTabs from "./ExplainerTabs.svelte";

  type Entry = { technique: Technique; decoded: string };

  // The interactive island. Holds the selected technique; everything else derives.
  // Data arrives as a prop from the Astro page (built from the engine), so there is
  // no runtime fetch (ISC-21) and the island server-renders for the no-JS path (ISC-35).
  let { labData }: { labData: Entry[] } = $props();

  // Initialise selection from the URL hash so a shared link reopens on the same
  // attack, and selection is recoverable from the URL, not memory only (ISC-28).
  // Guarded for SSR (the island server-renders with client:load).
  function initialId(): string {
    const fallback = labData[0]?.technique.id ?? "";
    if (typeof location === "undefined" || !location.hash) return fallback;
    const id = location.hash.slice(1);
    return labData.some((e) => e.technique.id === id) ? id : fallback;
  }

  let selectedId = $state(initialId());
  const techniques = $derived(labData.map((e) => e.technique));
  const entry = $derived(
    labData.find((e) => e.technique.id === selectedId) ?? labData[0]!,
  );

  // Mirror the selection into the URL hash (browser only) so it survives reload
  // and copy-paste of the address (ISC-28).
  $effect(() => {
    if (typeof history !== "undefined" && selectedId) {
      history.replaceState(null, "", `#${selectedId}`);
    }
  });
</script>

<AttackPicker {techniques} {selectedId} onSelect={(id) => (selectedId = id)} />

<ExplainerTabs {entry}>
  {#snippet lab()}
    <DataFlowView {entry} />
  {/snippet}
</ExplainerTabs>
