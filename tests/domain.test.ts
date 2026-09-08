import { describe, expect, it } from "vitest";
import { compareMeasurements, normalisedBarWidth } from "@/domain/comparison";
import { CONSERVATION_LABELS, isThreatened } from "@/domain/conservation";
import { parseSpeciesContent } from "@/domain/content-schema";
import {
  formatMeasurement,
  type MeasurementRecord,
  representativeValue,
} from "@/domain/measurements";
import { choosePrimaryLength, relativeScaleWidth } from "@/domain/scale";
import { parseExplorerSearchParams } from "@/domain/search";
import { canonicalCompareSlugs, slugify } from "@/domain/slugs";
import { lineageFrom, type TaxonNode } from "@/domain/taxonomy";
import { convertValue } from "@/domain/units";

const mass: MeasurementRecord = {
  type: "BODY_MASS",
  minValue: 4000,
  maxValue: 6000,
  typicalValue: null,
  unit: "KG",
  qualifier: "ADULT",
  sex: "ANY",
};

describe("units", () => {
  it("converts kilograms to pounds", () => {
    const result = convertValue(1000, "KG", "IMPERIAL");
    expect(result.unitLabel).toBe("lb");
    expect(result.value).toBeCloseTo(2204.62, 1);
  });

  it("keeps years unchanged across systems", () => {
    expect(convertValue(12, "YEAR", "IMPERIAL").value).toBe(12);
  });
});

describe("measurements", () => {
  it("uses the midpoint when only a range is present", () => {
    expect(representativeValue(mass)).toBe(5000);
  });

  it("formats adult mass ranges with a qualifier", () => {
    expect(formatMeasurement(mass, "METRIC")).toContain("4,000–6,000 kg");
    expect(formatMeasurement(mass, "METRIC")).toContain("adult");
  });
});

describe("comparison", () => {
  it("marks the larger mass as the left winner", () => {
    const rows = compareMeasurements(
      [mass],
      [{ ...mass, minValue: 200, maxValue: 300 }],
    );
    expect(rows[0]?.leftWins).toBe(true);
  });

  it("normalises bar widths against the catalogue maximum", () => {
    expect(normalisedBarWidth(50, 100)).toBe(50);
    expect(normalisedBarWidth(null, 100)).toBe(0);
  });
});

describe("slugs", () => {
  it("slugifies scientific and common names", () => {
    expect(slugify("Loxodonta africana")).toBe("loxodonta-africana");
    expect(slugify("Giant Pacific Octopus")).toBe("giant-pacific-octopus");
  });

  it("canonicalises comparison URLs alphabetically", () => {
    expect(canonicalCompareSlugs("lion", "african-elephant")).toEqual([
      "african-elephant",
      "lion",
    ]);
  });
});

describe("search filters", () => {
  it("parses comma-separated explorer query params", () => {
    const filters = parseExplorerSearchParams({
      q: "falcon",
      group: "BIRD,MAMMAL",
      status: "EN",
      page: "2",
    });
    expect(filters.q).toBe("falcon");
    expect(filters.group).toEqual(["BIRD", "MAMMAL"]);
    expect(filters.status).toEqual(["EN"]);
    expect(filters.page).toBe(2);
  });

  it("rejects invalid conservation statuses", () => {
    expect(() => parseExplorerSearchParams({ status: "HP" })).toThrow();
  });
});

describe("conservation", () => {
  it("maps IUCN codes to labels and threat groups", () => {
    expect(CONSERVATION_LABELS.EN).toBe("Endangered");
    expect(isThreatened("EN")).toBe(true);
    expect(isThreatened("LC")).toBe(false);
  });
});

describe("taxonomy", () => {
  it("walks parent links into a kingdom-to-species lineage", () => {
    const animalia: TaxonNode = {
      id: "1",
      slug: "animalia",
      rank: "KINGDOM",
      scientificName: "Animalia",
    };
    const chordata: TaxonNode = {
      id: "2",
      slug: "chordata",
      rank: "PHYLUM",
      scientificName: "Chordata",
      parentId: "1",
    };
    const byId = new Map([
      [animalia.id, animalia],
      [chordata.id, chordata],
    ]);
    expect(
      lineageFrom(chordata, byId).map((node) => node.scientificName),
    ).toEqual(["Animalia", "Chordata"]);
  });
});

describe("scale", () => {
  it("chooses the larger of height or length for visual scale", () => {
    expect(choosePrimaryLength(3.3, 7)).toBe(7);
    expect(relativeScaleWidth(1.7, 3.4)).toBe(50);
  });
});

describe("content schema", () => {
  it("fails loudly when a measurement source is missing", () => {
    expect(() =>
      parseSpeciesContent({
        slug: "test-animal",
        commonName: "Test",
        scientificName: "Testis animalis",
        animalGroup: "MAMMAL",
        diet: "HERBIVORE",
        sizeCategory: "MEDIUM",
        summary: "A".repeat(50),
        taxonomy: [
          { rank: "KINGDOM", scientificName: "Animalia", slug: "animalia" },
          { rank: "PHYLUM", scientificName: "Chordata", slug: "chordata" },
          { rank: "CLASS", scientificName: "Mammalia", slug: "mammalia" },
          { rank: "ORDER", scientificName: "Testida", slug: "testida" },
          { rank: "FAMILY", scientificName: "Testidae", slug: "testidae" },
          { rank: "GENUS", scientificName: "Testis", slug: "testis" },
          {
            rank: "SPECIES",
            scientificName: "Testis animalis",
            slug: "testis-animalis",
          },
        ],
        habitats: [
          { slug: "forest", name: "Forest", description: "A".repeat(20) },
        ],
        regions: [
          {
            slug: "africa",
            name: "Africa",
            type: "CONTINENT",
            rangeType: "NATIVE",
          },
        ],
        lifeStages: [
          {
            slug: "young",
            name: "Young",
            sortOrder: 0,
            description: "A".repeat(20),
          },
          {
            slug: "adult",
            name: "Adult",
            sortOrder: 1,
            description: "A".repeat(20),
          },
        ],
        adaptations: [{ title: "Camouflage", explanation: "A".repeat(40) }],
        behaviours: [{ category: "SOCIAL", summary: "A".repeat(20) }],
        conservation: {
          status: "LC",
          populationTrend: "STABLE",
          sourceKey: "missing",
        },
        measurements: [
          {
            type: "BODY_MASS",
            typicalValue: 10,
            unit: "KG",
            qualifier: "ADULT",
            sourceKey: "adw",
          },
          {
            type: "LIFESPAN",
            typicalValue: 10,
            unit: "YEAR",
            qualifier: "TYPICAL",
            sourceKey: "adw",
          },
        ],
        sources: [
          {
            key: "adw",
            title: "ADW",
            accessedAt: "2026-09-08",
            roles: ["MEASUREMENT"],
          },
        ],
        media: [
          {
            kind: "PHOTO",
            url: "https://example.com/photo.jpg",
            alt: "A test animal standing",
            creator: "Test",
            license: "CC0",
            attribution: "Test, CC0",
            sourceUrl: "https://example.com",
          },
        ],
      }),
    ).toThrow(/sourceKey/);
  });
});
