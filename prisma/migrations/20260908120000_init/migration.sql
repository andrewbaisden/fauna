-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AnimalGroup" AS ENUM ('MAMMAL', 'BIRD', 'REPTILE', 'AMPHIBIAN', 'FISH', 'INVERTEBRATE');

-- CreateEnum
CREATE TYPE "DietType" AS ENUM ('HERBIVORE', 'CARNIVORE', 'OMNIVORE', 'INSECTIVORE', 'FILTER_FEEDER', 'DETRITIVORE', 'NECTARIVORE', 'PISCIVORE', 'FRUGIVORE', 'SCAVENGER');

-- CreateEnum
CREATE TYPE "ActivityPattern" AS ENUM ('DIURNAL', 'NOCTURNAL', 'CREPUSCULAR', 'CATHEMERAL');

-- CreateEnum
CREATE TYPE "SizeCategory" AS ENUM ('TINY', 'SMALL', 'MEDIUM', 'LARGE', 'VERY_LARGE');

-- CreateEnum
CREATE TYPE "ConservationStatus" AS ENUM ('EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE');

-- CreateEnum
CREATE TYPE "PopulationTrend" AS ENUM ('INCREASING', 'DECREASING', 'STABLE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "TaxonomicRank" AS ENUM ('KINGDOM', 'PHYLUM', 'CLASS', 'ORDER', 'FAMILY', 'GENUS', 'SPECIES', 'SUBSPECIES');

-- CreateEnum
CREATE TYPE "MeasurementType" AS ENUM ('BODY_MASS', 'HEIGHT', 'LENGTH', 'WINGSPAN', 'TOP_SPEED', 'LIFESPAN');

-- CreateEnum
CREATE TYPE "CanonicalUnit" AS ENUM ('KG', 'M', 'KM_H', 'YEAR');

-- CreateEnum
CREATE TYPE "MeasurementQualifier" AS ENUM ('ADULT', 'JUVENILE', 'NEONATE', 'TYPICAL', 'MAXIMUM_RECORDED', 'AVERAGE');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('ANY', 'FEMALE', 'MALE');

-- CreateEnum
CREATE TYPE "RangeType" AS ENUM ('NATIVE', 'INTRODUCED', 'VAGRANT', 'MIGRATORY');

-- CreateEnum
CREATE TYPE "BehaviourCategory" AS ENUM ('SOCIAL', 'FEEDING', 'COMMUNICATION', 'MIGRATION', 'TERRITORIAL', 'REPRODUCTIVE', 'PARENTAL');

-- CreateEnum
CREATE TYPE "MediaKind" AS ENUM ('PHOTO', 'ILLUSTRATION', 'MAP_OVERLAY', 'THUMBNAIL', 'POSTER');

-- CreateEnum
CREATE TYPE "AssetLicense" AS ENUM ('CC0', 'CC_BY', 'CC_BY_SA', 'SMITHSONIAN_OA', 'PUBLIC_DOMAIN');

-- CreateEnum
CREATE TYPE "RegionType" AS ENUM ('CONTINENT', 'OCEAN', 'COUNTRY', 'BIOGEOGRAPHIC');

-- CreateEnum
CREATE TYPE "UnitSystem" AS ENUM ('METRIC', 'IMPERIAL');

-- CreateTable
CREATE TABLE "Taxon" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "rank" "TaxonomicRank" NOT NULL,
    "scientificName" TEXT NOT NULL,
    "commonName" TEXT,
    "gbifKey" INTEGER,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Taxon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Species" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "commonName" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL,
    "animalGroup" "AnimalGroup" NOT NULL,
    "diet" "DietType" NOT NULL,
    "activityPattern" "ActivityPattern",
    "sizeCategory" "SizeCategory" NOT NULL,
    "summary" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "taxonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeciesAlias" (
    "id" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpeciesAlias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habitat" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Habitat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeciesHabitat" (
    "id" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "habitatId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpeciesHabitat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RegionType" NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeciesRegion" (
    "id" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "rangeType" "RangeType" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpeciesRegion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LifeStage" (
    "id" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "ageMin" DECIMAL(12,4),
    "ageMax" DECIMAL(12,4),
    "ageUnit" TEXT,
    "description" TEXT NOT NULL,
    "physicalTraits" TEXT,
    "behaviouralNotes" TEXT,
    "socialRole" TEXT,
    "dietNotes" TEXT,
    "extra" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LifeStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Adaptation" (
    "id" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bodySystem" TEXT,
    "explanation" TEXT NOT NULL,
    "relatedMeasurementType" "MeasurementType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Adaptation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Behaviour" (
    "id" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "category" "BehaviourCategory" NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Behaviour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConservationRecord" (
    "id" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "status" "ConservationStatus" NOT NULL,
    "populationTrend" "PopulationTrend" NOT NULL,
    "yearAssessed" INTEGER,
    "sourceId" TEXT NOT NULL,
    "efforts" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConservationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Threat" (
    "id" TEXT NOT NULL,
    "conservationRecordId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Threat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measurement" (
    "id" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "type" "MeasurementType" NOT NULL,
    "minValue" DECIMAL(16,6),
    "maxValue" DECIMAL(16,6),
    "typicalValue" DECIMAL(16,6),
    "unit" "CanonicalUnit" NOT NULL,
    "qualifier" "MeasurementQualifier" NOT NULL,
    "sex" "Sex" NOT NULL DEFAULT 'ANY',
    "notes" TEXT,
    "sourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "publisher" TEXT,
    "accessedAt" TIMESTAMP(3) NOT NULL,
    "license" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpeciesSource" (
    "id" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpeciesSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "speciesId" TEXT,
    "kind" "MediaKind" NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "license" "AssetLicense" NOT NULL,
    "attribution" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreeDAsset" (
    "id" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'GLB',
    "polyCount" INTEGER,
    "fileSizeBytes" INTEGER,
    "creator" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "license" "AssetLicense" NOT NULL,
    "attribution" TEXT NOT NULL,
    "modified" BOOLEAN NOT NULL DEFAULT false,
    "version" TEXT NOT NULL,
    "posterImageUrl" TEXT,
    "fallbackImageUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThreeDAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RangeGeometry" (
    "id" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "geojson" JSONB NOT NULL,
    "confidence" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RangeGeometry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favourite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Favourite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecentlyViewed" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "speciesId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecentlyViewed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "unitSystem" "UnitSystem" NOT NULL DEFAULT 'METRIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Taxon_slug_key" ON "Taxon"("slug");

-- CreateIndex
CREATE INDEX "Taxon_parentId_idx" ON "Taxon"("parentId");

-- CreateIndex
CREATE INDEX "Taxon_rank_idx" ON "Taxon"("rank");

-- CreateIndex
CREATE INDEX "Taxon_scientificName_idx" ON "Taxon"("scientificName");

-- CreateIndex
CREATE UNIQUE INDEX "Species_slug_key" ON "Species"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Species_scientificName_key" ON "Species"("scientificName");

-- CreateIndex
CREATE INDEX "Species_animalGroup_idx" ON "Species"("animalGroup");

-- CreateIndex
CREATE INDEX "Species_diet_idx" ON "Species"("diet");

-- CreateIndex
CREATE INDEX "Species_sizeCategory_idx" ON "Species"("sizeCategory");

-- CreateIndex
CREATE INDEX "Species_taxonId_idx" ON "Species"("taxonId");

-- CreateIndex
CREATE INDEX "Species_featured_idx" ON "Species"("featured");

-- CreateIndex
CREATE INDEX "Species_commonName_idx" ON "Species"("commonName");

-- CreateIndex
CREATE INDEX "SpeciesAlias_name_idx" ON "SpeciesAlias"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SpeciesAlias_speciesId_name_key" ON "SpeciesAlias"("speciesId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Habitat_slug_key" ON "Habitat"("slug");

-- CreateIndex
CREATE INDEX "SpeciesHabitat_habitatId_idx" ON "SpeciesHabitat"("habitatId");

-- CreateIndex
CREATE UNIQUE INDEX "SpeciesHabitat_speciesId_habitatId_key" ON "SpeciesHabitat"("speciesId", "habitatId");

-- CreateIndex
CREATE UNIQUE INDEX "Region_slug_key" ON "Region"("slug");

-- CreateIndex
CREATE INDEX "Region_parentId_idx" ON "Region"("parentId");

-- CreateIndex
CREATE INDEX "Region_type_idx" ON "Region"("type");

-- CreateIndex
CREATE INDEX "SpeciesRegion_regionId_idx" ON "SpeciesRegion"("regionId");

-- CreateIndex
CREATE UNIQUE INDEX "SpeciesRegion_speciesId_regionId_rangeType_key" ON "SpeciesRegion"("speciesId", "regionId", "rangeType");

-- CreateIndex
CREATE INDEX "LifeStage_speciesId_sortOrder_idx" ON "LifeStage"("speciesId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "LifeStage_speciesId_slug_key" ON "LifeStage"("speciesId", "slug");

-- CreateIndex
CREATE INDEX "Adaptation_speciesId_idx" ON "Adaptation"("speciesId");

-- CreateIndex
CREATE INDEX "Behaviour_speciesId_idx" ON "Behaviour"("speciesId");

-- CreateIndex
CREATE UNIQUE INDEX "ConservationRecord_speciesId_key" ON "ConservationRecord"("speciesId");

-- CreateIndex
CREATE INDEX "Threat_conservationRecordId_idx" ON "Threat"("conservationRecordId");

-- CreateIndex
CREATE INDEX "Measurement_speciesId_type_idx" ON "Measurement"("speciesId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Source_key_key" ON "Source"("key");

-- CreateIndex
CREATE INDEX "SpeciesSource_sourceId_idx" ON "SpeciesSource"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "SpeciesSource_speciesId_sourceId_role_key" ON "SpeciesSource"("speciesId", "sourceId", "role");

-- CreateIndex
CREATE INDEX "MediaAsset_speciesId_idx" ON "MediaAsset"("speciesId");

-- CreateIndex
CREATE INDEX "ThreeDAsset_speciesId_idx" ON "ThreeDAsset"("speciesId");

-- CreateIndex
CREATE INDEX "RangeGeometry_speciesId_idx" ON "RangeGeometry"("speciesId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE INDEX "Favourite_speciesId_idx" ON "Favourite"("speciesId");

-- CreateIndex
CREATE UNIQUE INDEX "Favourite_userId_speciesId_key" ON "Favourite"("userId", "speciesId");

-- CreateIndex
CREATE INDEX "RecentlyViewed_userId_viewedAt_idx" ON "RecentlyViewed"("userId", "viewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RecentlyViewed_userId_speciesId_key" ON "RecentlyViewed"("userId", "speciesId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- AddForeignKey
ALTER TABLE "Taxon" ADD CONSTRAINT "Taxon_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Taxon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Species" ADD CONSTRAINT "Species_taxonId_fkey" FOREIGN KEY ("taxonId") REFERENCES "Taxon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeciesAlias" ADD CONSTRAINT "SpeciesAlias_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeciesHabitat" ADD CONSTRAINT "SpeciesHabitat_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeciesHabitat" ADD CONSTRAINT "SpeciesHabitat_habitatId_fkey" FOREIGN KEY ("habitatId") REFERENCES "Habitat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeciesRegion" ADD CONSTRAINT "SpeciesRegion_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeciesRegion" ADD CONSTRAINT "SpeciesRegion_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LifeStage" ADD CONSTRAINT "LifeStage_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adaptation" ADD CONSTRAINT "Adaptation_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Behaviour" ADD CONSTRAINT "Behaviour_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConservationRecord" ADD CONSTRAINT "ConservationRecord_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConservationRecord" ADD CONSTRAINT "ConservationRecord_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Threat" ADD CONSTRAINT "Threat_conservationRecordId_fkey" FOREIGN KEY ("conservationRecordId") REFERENCES "ConservationRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeciesSource" ADD CONSTRAINT "SpeciesSource_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeciesSource" ADD CONSTRAINT "SpeciesSource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreeDAsset" ADD CONSTRAINT "ThreeDAsset_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RangeGeometry" ADD CONSTRAINT "RangeGeometry_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RangeGeometry" ADD CONSTRAINT "RangeGeometry_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentlyViewed" ADD CONSTRAINT "RecentlyViewed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentlyViewed" ADD CONSTRAINT "RecentlyViewed_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "Species_commonName_trgm" ON "Species" USING gin ("commonName" gin_trgm_ops);
CREATE INDEX "Species_scientificName_trgm" ON "Species" USING gin ("scientificName" gin_trgm_ops);


