// Carrier data model. This is the linchpin contract: every feature
// (ScenarioEngine, DataFlowViz, AttackPicker, ExplainerTabs) reads these shapes.
// Lock changes here deliberately — the whole UI keys off this.

/** The labeled segments of an assembled prompt. */
export type BlockId = "system" | "user" | "retrieved" | "tool";

/** How much the model should trust a block's contents. */
export type Trust = "trusted" | "semi-trusted" | "untrusted";

/** Where a technique's recognized taxonomy comes from. */
export type TaxonomySource = "PyRIT" | "OWASP-LLM" | "MITRE-ATLAS";

/** How the payload is obfuscated as it sits inside the carrier block. */
export type Encoding = "none" | "base64" | "rot13" | "unicode-confusable";

export interface PromptBlock {
  id: BlockId;
  /** Human label shown in the data-flow view, e.g. "Retrieved Context". */
  label: string;
  trust: Trust;
  /** The block's contents as the model receives them. The carrier block's
   *  contents include the (possibly encoded) payload. */
  content: string;
}

export interface Technique {
  /** Stable kebab id. Never renumber — UI state and ISA ISCs key on this. */
  id: string;
  /** Display name shown in the attack picker (ISC-8). */
  label: string;
  taxonomy: { source: TaxonomySource; ref: string };
  /** The single block the injected bytes ride in (ISC-12, ISC-13). */
  carrier: BlockId;
  encoding: Encoding;
  /** The payload exactly as it appears inside the carrier block, in its
   *  encoded/obfuscated form. Shown before the decoded intent (ISC-14, ISC-26). */
  encodedPayload: string;
  /** What the payload means once decoded — revealed on demand (ISC-14). */
  decodedIntent: string;
  /** Why the simulated model obeyed: the trust boundary that was crossed (ISC-16). */
  whyObeyed: string;
  /** The assembled prompt. Exactly one block's id equals `carrier`, and that
   *  block's content contains `encodedPayload`. Enforced by the engine. */
  blocks: PromptBlock[];
  /** Pre-authored, deterministic assistant response (ISC-15). */
  assistantResponse: string;
  /** Visible illustrative-and-sandboxed note (ISC-20). */
  sandboxNote: string;
}

/** The deterministic result of firing one technique. */
export interface FireResult {
  technique: Technique;
  blocks: PromptBlock[];
  carrierId: BlockId;
  assistantResponse: string;
}
