import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({ slug: z.string().min(1) });

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.id ?? null;
}

export async function GET(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ favourite: false }, { status: 401 });
  }
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) {
    const favourites = await prisma.favourite.findMany({
      where: { userId },
      include: { species: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      species: favourites.map((item) => ({
        slug: item.species.slug,
        commonName: item.species.commonName,
      })),
    });
  }
  const species = await prisma.species.findUnique({ where: { slug } });
  if (!species) {
    return NextResponse.json({ favourite: false });
  }
  const favourite = await prisma.favourite.findUnique({
    where: { userId_speciesId: { userId, speciesId: species.id } },
  });
  return NextResponse.json({ favourite: Boolean(favourite) });
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const species = await prisma.species.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (!species) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.favourite.upsert({
    where: { userId_speciesId: { userId, speciesId: species.id } },
    update: {},
    create: { userId, speciesId: species.id },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const species = await prisma.species.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (!species) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await prisma.favourite.deleteMany({
    where: { userId, speciesId: species.id },
  });
  return NextResponse.json({ ok: true });
}
