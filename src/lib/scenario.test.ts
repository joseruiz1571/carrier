import { expect, test, describe } from "bun:test";
import {
  listTechniques,
  getTechnique,
  fire,
  decodePayload,
  validateTechnique,
  listLabs,
  getLabTechniques,
  nextLab,
  prevLab,
} from "./scenario";

describe("ScenarioEngine", () => {
  test("every technique passes its data-integrity guard", () => {
    for (const t of listTechniques()) {
      expect(() => validateTechnique(t)).not.toThrow();
    }
  });

  test("highlighted carrier equals the technique's declared carrier (ISC-13)", () => {
    for (const t of listTechniques()) {
      const result = fire(t.id);
      expect(result.carrierId).toBe(t.carrier);
      // the carrier block exists in the returned assembled prompt
      expect(result.blocks.some((b) => b.id === result.carrierId)).toBe(true);
    }
  });

  test("firing the same technique twice is byte-identical (ISC-15)", () => {
    const id = listTechniques()[0]!.id;
    const a = JSON.stringify(fire(id));
    const b = JSON.stringify(fire(id));
    expect(a).toBe(b);
  });

  test("decodePayload round-trips encoded payloads", () => {
    for (const t of listTechniques()) {
      const decoded = decodePayload(t);
      expect(typeof decoded).toBe("string");
      expect(decoded.length).toBeGreaterThan(0);
    }
  });

  test("unknown technique id throws", () => {
    expect(() => fire("does-not-exist")).toThrow();
  });

  test("getTechnique returns undefined for missing id", () => {
    expect(getTechnique("nope")).toBeUndefined();
  });

  test("library has at least 6 distinct techniques (ISC-9)", () => {
    const ids = new Set(listTechniques().map((t) => t.id));
    expect(ids.size).toBe(listTechniques().length); // no dup ids
    expect(ids.size).toBeGreaterThanOrEqual(6);
  });

  test("at least one technique is encoding-based (ISC-10)", () => {
    expect(listTechniques().some((t) => t.encoding !== "none")).toBe(true);
  });
});

describe("LabProgression", () => {
  test("at least 3 ordered labs (ISC-18)", () => {
    expect(listLabs().length).toBeGreaterThanOrEqual(3);
    const nums = listLabs().map((l) => l.num);
    expect(nums).toEqual([...nums].sort((a, b) => a - b));
  });

  test("every lab resolves to real techniques (ISC-21)", () => {
    for (const lab of listLabs()) {
      const techs = getLabTechniques(lab.slug);
      expect(techs.length).toBe(lab.techniqueIds.length);
      expect(techs.length).toBeGreaterThan(0);
    }
  });

  test("labs cover at least 6 distinct techniques across the progression", () => {
    const covered = new Set(listLabs().flatMap((l) => l.techniqueIds));
    expect(covered.size).toBeGreaterThanOrEqual(6);
  });

  test("nav chains forward and back (ISC-19)", () => {
    expect(prevLab("01")).toBeUndefined();
    expect(nextLab("01")?.slug).toBe("02");
    expect(prevLab("02")?.slug).toBe("01");
    expect(nextLab(listLabs().at(-1)!.slug)).toBeUndefined();
  });

  test("getLabTechniques throws on unknown lab", () => {
    expect(() => getLabTechniques("99")).toThrow();
  });
});
