import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import {
  parseSpeciesContent,
  type SpeciesContent,
} from "@/domain/content-schema";
import { prisma } from "@/lib/prisma";

interface MediaMap {
  hosts: Record<string, string>;
}

async function loadMediaMap(): Promise<MediaMap> {
  const mapPath = path.join(process.cwd(), "content/assets/media-map.json");
  try {
    const raw = await readFile(mapPath, "utf8");
    return JSON.parse(raw) as MediaMap;
  } catch {
    return { hosts: {} };
  }
}

function resolveHostedUrl(
  url: string | undefined,
  map: MediaMap,
): string | undefined {
  if (!url) {
    return url;
  }
  if (map.hosts[url]) {
    return map.hosts[url];
  }
  // Production GLBs live on private Blob and are served via /api/media/models/…
  if (url.startsWith("/models/")) {
    return `/api/media${url}`;
  }
  return url;
}

async function loadSpeciesFiles(): Promise<SpeciesContent[]> {
  const dir = path.join(process.cwd(), "content/species");
  const files = (await readdir(dir))
    .filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"))
    .sort();

  if (files.length === 0) {
    throw new Error("No species YAML files found in content/species");
  }

  const records: SpeciesContent[] = [];

  for (const file of files) {
    const raw = await readFile(path.join(dir, file), "utf8");
    try {
      records.push(parseSpeciesContent(parse(raw)));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Invalid species file ${file}: ${message}`);
    }
  }

  return records;
}

async function upsertSpecies(
  record: SpeciesContent,
  mediaMap: MediaMap,
): Promise<void> {
  const sourceIds = new Map<string, string>();

  for (const source of record.sources) {
    const saved = await prisma.source.upsert({
      where: { key: source.key },
      update: {
        title: source.title,
        url: source.url,
        publisher: source.publisher,
        accessedAt: new Date(source.accessedAt),
        license: source.license,
      },
      create: {
        key: source.key,
        title: source.title,
        url: source.url,
        publisher: source.publisher,
        accessedAt: new Date(source.accessedAt),
        license: source.license,
      },
    });
    sourceIds.set(source.key, saved.id);
  }

  let parentId: string | undefined;
  let speciesTaxonId: string | undefined;

  for (const taxon of record.taxonomy) {
    const saved = await prisma.taxon.upsert({
      where: { slug: taxon.slug },
      update: {
        rank: taxon.rank,
        scientificName: taxon.scientificName,
        commonName: taxon.commonName,
        gbifKey: taxon.gbifKey,
        parentId: parentId ?? null,
      },
      create: {
        slug: taxon.slug,
        rank: taxon.rank,
        scientificName: taxon.scientificName,
        commonName: taxon.commonName,
        gbifKey: taxon.gbifKey,
        parentId: parentId ?? null,
      },
    });
    parentId = saved.id;
    if (taxon.rank === "SPECIES" || taxon.rank === "SUBSPECIES") {
      speciesTaxonId = saved.id;
    }
  }

  if (!speciesTaxonId) {
    throw new Error(`${record.slug} is missing a SPECIES taxon`);
  }

  const species = await prisma.species.upsert({
    where: { slug: record.slug },
    update: {
      commonName: record.commonName,
      scientificName: record.scientificName,
      animalGroup: record.animalGroup,
      diet: record.diet,
      activityPattern: record.activityPattern,
      sizeCategory: record.sizeCategory,
      summary: record.summary,
      featured: record.featured,
      taxonId: speciesTaxonId,
    },
    create: {
      slug: record.slug,
      commonName: record.commonName,
      scientificName: record.scientificName,
      animalGroup: record.animalGroup,
      diet: record.diet,
      activityPattern: record.activityPattern,
      sizeCategory: record.sizeCategory,
      summary: record.summary,
      featured: record.featured,
      taxonId: speciesTaxonId,
    },
  });

  await prisma.speciesAlias.deleteMany({ where: { speciesId: species.id } });
  if (record.aliases.length > 0) {
    await prisma.speciesAlias.createMany({
      data: record.aliases.map((name) => ({ speciesId: species.id, name })),
    });
  }

  await prisma.speciesHabitat.deleteMany({ where: { speciesId: species.id } });
  for (const habitat of record.habitats) {
    const saved = await prisma.habitat.upsert({
      where: { slug: habitat.slug },
      update: { name: habitat.name, description: habitat.description },
      create: {
        slug: habitat.slug,
        name: habitat.name,
        description: habitat.description,
      },
    });
    await prisma.speciesHabitat.create({
      data: {
        speciesId: species.id,
        habitatId: saved.id,
        notes: habitat.notes,
      },
    });
  }

  await prisma.speciesRegion.deleteMany({ where: { speciesId: species.id } });
  for (const region of record.regions) {
    const saved = await prisma.region.upsert({
      where: { slug: region.slug },
      update: { name: region.name, type: region.type },
      create: { slug: region.slug, name: region.name, type: region.type },
    });
    await prisma.speciesRegion.create({
      data: {
        speciesId: species.id,
        regionId: saved.id,
        rangeType: region.rangeType,
        notes: region.notes,
      },
    });
  }

  await prisma.lifeStage.deleteMany({ where: { speciesId: species.id } });
  await prisma.lifeStage.createMany({
    data: record.lifeStages.map((stage) => ({
      speciesId: species.id,
      slug: stage.slug,
      name: stage.name,
      sortOrder: stage.sortOrder,
      ageMin: stage.ageMin,
      ageMax: stage.ageMax,
      ageUnit: stage.ageUnit,
      description: stage.description,
      physicalTraits: stage.physicalTraits,
      behaviouralNotes: stage.behaviouralNotes,
      socialRole: stage.socialRole,
      dietNotes: stage.dietNotes,
    })),
  });

  await prisma.adaptation.deleteMany({ where: { speciesId: species.id } });
  await prisma.adaptation.createMany({
    data: record.adaptations.map((adaptation) => ({
      speciesId: species.id,
      title: adaptation.title,
      bodySystem: adaptation.bodySystem,
      explanation: adaptation.explanation,
      relatedMeasurementType: adaptation.relatedMeasurementType,
    })),
  });

  await prisma.behaviour.deleteMany({ where: { speciesId: species.id } });
  await prisma.behaviour.createMany({
    data: record.behaviours.map((behaviour) => ({
      speciesId: species.id,
      category: behaviour.category,
      summary: behaviour.summary,
    })),
  });

  const conservationSourceId = sourceIds.get(record.conservation.sourceKey);
  if (!conservationSourceId) {
    throw new Error(`Missing conservation source for ${record.slug}`);
  }

  await prisma.conservationRecord.deleteMany({
    where: { speciesId: species.id },
  });
  await prisma.conservationRecord.create({
    data: {
      speciesId: species.id,
      status: record.conservation.status,
      populationTrend: record.conservation.populationTrend,
      yearAssessed: record.conservation.yearAssessed,
      sourceId: conservationSourceId,
      efforts: record.conservation.efforts,
      threats: {
        create: record.conservation.threats.map((label) => ({ label })),
      },
    },
  });

  await prisma.measurement.deleteMany({ where: { speciesId: species.id } });
  await prisma.measurement.createMany({
    data: record.measurements.map((measurement) => ({
      speciesId: species.id,
      type: measurement.type,
      minValue: measurement.minValue,
      maxValue: measurement.maxValue,
      typicalValue: measurement.typicalValue,
      unit: measurement.unit,
      qualifier: measurement.qualifier,
      sex: measurement.sex,
      notes: measurement.notes,
      sourceId: sourceIds.get(measurement.sourceKey) as string,
    })),
  });

  await prisma.speciesSource.deleteMany({ where: { speciesId: species.id } });
  await prisma.speciesSource.createMany({
    data: record.sources.flatMap((source) => {
      const sourceId = sourceIds.get(source.key);
      if (!sourceId) {
        return [];
      }
      return source.roles.map((role) => ({
        speciesId: species.id,
        sourceId,
        role,
      }));
    }),
  });

  await prisma.mediaAsset.deleteMany({ where: { speciesId: species.id } });
  await prisma.mediaAsset.createMany({
    data: record.media.map((asset) => ({
      speciesId: species.id,
      kind: asset.kind,
      url: resolveHostedUrl(asset.url, mediaMap) ?? asset.url,
      alt: asset.alt,
      creator: asset.creator,
      license: asset.license,
      attribution: asset.attribution,
      sourceUrl: asset.sourceUrl,
      width: asset.width,
      height: asset.height,
    })),
  });

  await prisma.threeDAsset.deleteMany({ where: { speciesId: species.id } });
  if (record.threeD.length > 0) {
    await prisma.threeDAsset.createMany({
      data: record.threeD.map((asset) => ({
        speciesId: species.id,
        url: resolveHostedUrl(asset.url, mediaMap) ?? asset.url,
        format: asset.format,
        polyCount: asset.polyCount,
        fileSizeBytes: asset.fileSizeBytes,
        creator: asset.creator,
        source: asset.source,
        license: asset.license,
        attribution: asset.attribution,
        modified: asset.modified,
        version: asset.version,
        posterImageUrl: resolveHostedUrl(asset.posterImageUrl, mediaMap),
        fallbackImageUrl: resolveHostedUrl(asset.fallbackImageUrl, mediaMap),
        notes: asset.notes,
      })),
    });
  }

  await prisma.rangeGeometry.deleteMany({ where: { speciesId: species.id } });
  if (record.rangeGeometry) {
    const sourceId = sourceIds.get(record.rangeGeometry.sourceKey);
    if (!sourceId) {
      throw new Error(`Missing range source for ${record.slug}`);
    }
    await prisma.rangeGeometry.create({
      data: {
        speciesId: species.id,
        geojson: record.rangeGeometry.geojson as object,
        confidence: record.rangeGeometry.confidence,
        sourceId,
        notes: record.rangeGeometry.notes,
      },
    });
  }
}

async function main(): Promise<void> {
  const mediaMap = await loadMediaMap();
  const remapped = Object.keys(mediaMap.hosts).length;
  if (remapped > 0) {
    console.info(`Applying media-map.json (${remapped} hosted URLs)`);
  }
  const records = await loadSpeciesFiles();
  for (const record of records) {
    await upsertSpecies(record, mediaMap);
    console.info(`Seeded ${record.commonName} (${record.slug})`);
  }
  console.info(`Seeded ${records.length} species`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
