import type { Technique, FireResult, BlockId } from "./types";
import { techniques } from "../data/techniques";
import { labs, type Lab } from "../data/labs";

// ScenarioEngine. Pure functions over the AttackLibrary data — no IO, no fetch,
// no env reads (ISC-3, ISC-4). Same input, same output, every run (ISC-15).

/** All techniques in the library, in authored order. */
export function listTechniques(): readonly Technique[] {
  return techniques;
}

/** Look up a technique by stable id. */
export function getTechnique(id: string): Technique | undefined {
  return techniques.find((t) => t.id === id);
}

/** All labs, in progression order (ISC-18). */
export function listLabs(): readonly Lab[] {
  return labs;
}

/** Look up a lab by slug ("01"). */
export function getLab(slug: string): Lab | undefined {
  return labs.find((l) => l.slug === slug);
}

/**
 * Resolve a lab's technique ids to full Technique records, in authored order.
 * Throws if a lab references an unknown technique so a bad data edit fails at
 * build/test time rather than rendering an empty picker.
 */
export function getLabTechniques(slug: string): Technique[] {
  const lab = getLab(slug);
  if (!lab) {
    throw new Error(`Unknown lab slug: "${slug}"`);
  }
  return lab.techniqueIds.map((id) => {
    const t = getTechnique(id);
    if (!t) {
      throw new Error(`Lab "${slug}" references unknown technique "${id}".`);
    }
    return t;
  });
}

/** The next lab in the progression, or undefined at the end (ISC-19). */
export function nextLab(slug: string): Lab | undefined {
  const i = labs.findIndex((l) => l.slug === slug);
  return i >= 0 ? labs[i + 1] : undefined;
}

/** The previous lab in the progression, or undefined at the start. */
export function prevLab(slug: string): Lab | undefined {
  const i = labs.findIndex((l) => l.slug === slug);
  return i > 0 ? labs[i - 1] : undefined;
}

/**
 * Data-integrity guard: the carrier block must exist in `blocks` and must
 * contain the encoded payload. This is what makes the highlight provably
 * correct (ISC-13) rather than a hand-set decoration.
 */
export function validateTechnique(t: Technique): void {
  const carrierBlock = t.blocks.find((b) => b.id === t.carrier);
  if (!carrierBlock) {
    throw new Error(
      `Technique "${t.id}": carrier "${t.carrier}" not present in blocks.`,
    );
  }
  if (!carrierBlock.content.includes(t.encodedPayload)) {
    throw new Error(
      `Technique "${t.id}": carrier block does not contain the encoded payload.`,
    );
  }
}

/** Decode a technique's payload to its plaintext, by encoding kind. */
export function decodePayload(t: Technique): string {
  switch (t.encoding) {
    case "none":
      return t.encodedPayload;
    case "base64": {
      // Browser-safe decode (no node Buffer), so islands can decode too.
      const bin = atob(t.encodedPayload);
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    }
    case "rot13":
      return t.encodedPayload.replace(/[a-z]/gi, (c) => {
        const base = c <= "Z" ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
      });
    case "unicode-confusable":
      // Confusables are revealed via the authored decodedIntent, not algorithmically.
      return t.decodedIntent;
  }
}

/**
 * Fire a technique. Deterministic: returns the assembled blocks, the carrier
 * id, and the pre-authored response. Throws on an inconsistent technique so a
 * bad data edit fails loudly at build/test time rather than silently in the UI.
 */
export function fire(id: string): FireResult {
  const technique = getTechnique(id);
  if (!technique) {
    throw new Error(`Unknown technique id: "${id}"`);
  }
  validateTechnique(technique);
  const carrierId: BlockId = technique.carrier;
  return {
    technique,
    blocks: technique.blocks,
    carrierId,
    assistantResponse: technique.assistantResponse,
  };
}
