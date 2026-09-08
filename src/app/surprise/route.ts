import { redirect } from "next/navigation";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { captureServerEvent } from "@/lib/server-capture";
import { getRandomSlug } from "@/server/species";

export const dynamic = "force-dynamic";

export async function GET() {
  const slug = await getRandomSlug();
  if (!slug) {
    redirect("/animals");
  }
  captureServerEvent(ANALYTICS_EVENTS.randomOpened, { slug });
  redirect(`/animals/${slug}`);
}
