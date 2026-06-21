// Lab progression. Versioned data (ISC-21). Three ordered labs from the
// simplest attack (a sentence in the user turn) to the subtlest (bytes that
// only decode inside the model), satisfying the difficulty ramp (ISC-18).
// Each lab references technique ids from the AttackLibrary; the engine resolves
// and validates them so a bad id fails loudly at build/test time.

export interface Lab {
  /** Ordinal position in the progression (1-based). */
  num: number;
  /** URL slug, zero-padded so routes read /labs/01. */
  slug: string;
  title: string;
  /** One-line framing shown at the top of the lab. */
  blurb: string;
  /** Technique ids presented in this lab's attack picker, in order. */
  techniqueIds: string[];
}

export const labs: Lab[] = [
  {
    num: 1,
    slug: "01",
    title: "Direct Override",
    blurb:
      "The bytes ride in the user turn. The attacker just types the instruction — " +
      "no hiding, no document — and the model follows it over the system block.",
    techniqueIds: ["direct-override", "system-prompt-leak"],
  },
  {
    num: 2,
    slug: "02",
    title: "Indirect Injection",
    blurb:
      "Now the attacker never types the payload. It rides in content the model " +
      "retrieves or a tool returns — data the model can't tell apart from instructions.",
    techniqueIds: ["indirect-injection", "payload-splitting"],
  },
  {
    num: 3,
    slug: "03",
    title: "Encoded Smuggling",
    blurb:
      "The payload is obfuscated so filters wave it through, then decodes inside the " +
      "model. The bytes are sitting in plain sight — you just can't read them yet.",
    techniqueIds: ["base64-smuggling", "unicode-confusable"],
  },
];
