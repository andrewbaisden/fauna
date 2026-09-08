import type { ExplorerFilters } from "@/domain/search";
import { PAGE_SIZE } from "@/domain/search";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { reportError } from "@/lib/report-error";
import {
  primaryImage,
  type SpeciesCardRecord,
  speciesCardInclude,
  speciesProfileInclude,
  toMeasurementRecord,
} from "@/server/mappers";

function explorerWhere(filters: ExplorerFilters): Prisma.SpeciesWhereInput {
  const AND: Prisma.SpeciesWhereInput[] = [];

  if (filters.q) {
    AND.push({
      OR: [
        { commonName: { contains: filters.q, mode: "insensitive" } },
        { scientificName: { contains: filters.q, mode: "insensitive" } },
        {
          aliases: {
            some: { name: { contains: filters.q, mode: "insensitive" } },
          },
        },
      ],
    });
  }
  if (filters.group.length > 0) {
    AND.push({ animalGroup: { in: filters.group } });
  }
  if (filters.diet.length > 0) {
    AND.push({ diet: { in: filters.diet } });
  }
  if (filters.size.length > 0) {
    AND.push({ sizeCategory: { in: filters.size } });
  }
  if (filters.activity.length > 0) {
    AND.push({ activityPattern: { in: filters.activity } });
  }
  if (filters.status.length > 0) {
    AND.push({ conservation: { is: { status: { in: filters.status } } } });
  }
  if (filters.habitat.length > 0) {
    AND.push({
      habitats: { some: { habitat: { slug: { in: filters.habitat } } } },
    });
  }
  if (filters.region.length > 0) {
    AND.push({
      regions: { some: { region: { slug: { in: filters.region } } } },
    });
  }

  return AND.length > 0 ? { AND } : {};
}

export function serializeCard(species: SpeciesCardRecord) {
  const image = primaryImage(species.media);
  return {
    slug: species.slug,
    commonName: species.commonName,
    scientificName: species.scientificName,
    animalGroup: species.animalGroup,
    diet: species.diet,
    sizeCategory: species.sizeCategory,
    summary: species.summary,
    conservationStatus: species.conservation?.status ?? null,
    habitats: species.habitats.map((item) => item.habitat.name),
    image,
    measurements: species.measurements.map(toMeasurementRecord),
  };
}

export type SpeciesCardData = ReturnType<typeof serializeCard>;

async function listSpeciesUncached(filters: ExplorerFilters) {
  const where = explorerWhere(filters);
  const skip = (filters.page - 1) * PAGE_SIZE;
  const [total, records] = await prisma.$transaction([
    prisma.species.count({ where }),
    prisma.species.findMany({
      where,
      include: speciesCardInclude,
      orderBy: { commonName: "asc" },
      skip,
      take: PAGE_SIZE,
    }),
  ]);

  return {
    total,
    page: filters.page,
    pageSize: PAGE_SIZE,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    species: records.map(serializeCard),
  };
}

export async function listSpecies(filters: ExplorerFilters) {
  return listSpeciesUncached(filters);
}

export async function getSpeciesBySlug(slug: string) {
  try {
    return await prisma.species.findUnique({
      where: { slug },
      include: speciesProfileInclude,
    });
  } catch (error) {
    reportError("species_load_failed", error);
    throw error;
  }
}

export async function getFeaturedSpecies() {
  const records = await prisma.species.findMany({
    where: { featured: true },
    include: speciesCardInclude,
    orderBy: { commonName: "asc" },
    take: 8,
  });
  return records.map(serializeCard);
}

export async function getAllSlugs() {
  return prisma.species.findMany({
    select: { slug: true, updatedAt: true, commonName: true },
  });
}

export async function getRandomSlug(): Promise<string | null> {
  const count = await prisma.species.count();
  if (count === 0) {
    return null;
  }
  const skip = Math.floor(Math.random() * count);
  const record = await prisma.species.findFirst({
    skip,
    select: { slug: true },
  });
  return record?.slug ?? null;
}

export async function getFilterFacets() {
  const [habitats, regions] = await Promise.all([
    prisma.habitat.findMany({
      orderBy: { name: "asc" },
      select: { slug: true, name: true },
    }),
    prisma.region.findMany({
      orderBy: { name: "asc" },
      select: { slug: true, name: true, type: true },
    }),
  ]);
  return { habitats, regions };
}

export async function getHabitatBySlug(slug: string) {
  return prisma.habitat.findUnique({
    where: { slug },
    include: {
      species: {
        include: { species: { include: speciesCardInclude } },
      },
    },
  });
}

export async function getTaxonBySlug(slug: string) {
  return prisma.taxon.findUnique({
    where: { slug },
    include: {
      parent: true,
      children: { orderBy: { scientificName: "asc" } },
      species: { include: speciesCardInclude },
    },
  });
}

export async function getRelatedSpecies(
  taxonId: string,
  excludeSpeciesId: string,
) {
  const taxon = await prisma.taxon.findUnique({ where: { id: taxonId } });
  if (!taxon?.parentId) {
    return [];
  }

  const familyOrGenus = await prisma.taxon.findFirst({
    where: { id: taxon.parentId },
  });
  const ancestorId = familyOrGenus?.parentId ?? taxon.parentId;

  const relatives = await prisma.species.findMany({
    where: {
      id: { not: excludeSpeciesId },
      taxon: {
        OR: [
          { parentId: taxon.parentId },
          { parentId: ancestorId },
          { id: taxon.parentId },
        ],
      },
    },
    include: speciesCardInclude,
    take: 6,
  });

  return relatives.map(serializeCard);
}

export async function searchSpeciesOptions(query: string) {
  return prisma.species.findMany({
    where: query
      ? {
          OR: [
            { commonName: { contains: query, mode: "insensitive" } },
            { scientificName: { contains: query, mode: "insensitive" } },
          ],
        }
      : {},
    select: { slug: true, commonName: true, scientificName: true },
    orderBy: { commonName: "asc" },
    take: 20,
  });
}
