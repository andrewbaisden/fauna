export type TaxonomicRank =
  | "KINGDOM"
  | "PHYLUM"
  | "CLASS"
  | "ORDER"
  | "FAMILY"
  | "GENUS"
  | "SPECIES"
  | "SUBSPECIES";

export interface TaxonNode {
  id: string;
  slug: string;
  rank: TaxonomicRank;
  scientificName: string;
  commonName?: string | null;
  parentId?: string | null;
}

export const RANK_ORDER: TaxonomicRank[] = [
  "KINGDOM",
  "PHYLUM",
  "CLASS",
  "ORDER",
  "FAMILY",
  "GENUS",
  "SPECIES",
  "SUBSPECIES",
];

export function lineageFrom(
  taxon: TaxonNode,
  byId: Map<string, TaxonNode>,
): TaxonNode[] {
  const lineage: TaxonNode[] = [];
  let current: TaxonNode | undefined = taxon;
  const seen = new Set<string>();

  while (current && !seen.has(current.id)) {
    lineage.push(current);
    seen.add(current.id);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }

  return lineage.reverse();
}

export function relatedThroughFamily(
  lineage: TaxonNode[],
): TaxonNode | undefined {
  return [...lineage]
    .reverse()
    .find((node) => node.rank === "FAMILY" || node.rank === "GENUS");
}
