import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConservationBadge } from "@/components/conservation-badge";
import { MeasurementGrid } from "@/features/species/ui/measurement-grid";
import { SpeciesCard } from "@/features/species/ui/species-card";

describe("SpeciesCard", () => {
  it("renders common name, scientific name and diet context", () => {
    render(
      <SpeciesCard
        species={{
          slug: "african-elephant",
          commonName: "African elephant",
          scientificName: "Loxodonta africana",
          animalGroup: "MAMMAL",
          diet: "HERBIVORE",
          sizeCategory: "VERY_LARGE",
          summary: "Largest living land mammal.",
          conservationStatus: "EN",
          habitats: ["Savanna"],
          image: null,
          measurements: [],
        }}
      />,
    );

    expect(screen.getByText("African elephant")).toBeInTheDocument();
    expect(screen.getByText("Loxodonta africana")).toBeInTheDocument();
    expect(screen.getByText(/Mammal/)).toBeInTheDocument();
    expect(screen.getByText(/Endangered/)).toBeInTheDocument();
  });
});

describe("ConservationBadge", () => {
  it("exposes the human-readable status", () => {
    render(<ConservationBadge status="EN" label="Endangered" />);
    expect(screen.getByText("Endangered")).toBeInTheDocument();
  });
});

describe("MeasurementGrid", () => {
  it("shows a structured mass range", () => {
    render(
      <MeasurementGrid
        measurements={[
          {
            type: "BODY_MASS",
            minValue: 4000,
            maxValue: 6000,
            typicalValue: null,
            unit: "KG",
            qualifier: "ADULT",
            sex: "ANY",
          },
        ]}
      />,
    );
    expect(screen.getByText("Mass")).toBeInTheDocument();
    expect(screen.getByText(/4,000/)).toBeInTheDocument();
  });
});
