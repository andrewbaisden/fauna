"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { authClient } from "@/lib/auth-client";
import { captureEvent } from "@/lib/capture-event";

export function FavouriteButton({ slug }: { slug: string }) {
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["favourite", slug],
    enabled: Boolean(session),
    queryFn: async () => {
      const response = await fetch(`/api/favourites?slug=${slug}`);
      if (!response.ok) {
        return { favourite: false };
      }
      return (await response.json()) as { favourite: boolean };
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/favourites", {
        method: query.data?.favourite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (!response.ok) {
        throw new Error("Could not update favourite");
      }
    },
    onSuccess: () => {
      captureEvent(
        query.data?.favourite
          ? ANALYTICS_EVENTS.favouriteRemoved
          : ANALYTICS_EVENTS.favouriteAdded,
        {
          slug,
        },
      );
      queryClient.invalidateQueries({ queryKey: ["favourite", slug] });
    },
  });

  if (!session) {
    return (
      <Button asChild variant="outline">
        <a href="/sign-in">Save to My Fauna</a>
      </Button>
    );
  }

  const saved = query.data?.favourite === true;

  return (
    <Button
      variant={saved ? "secondary" : "default"}
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
    >
      <Heart className={saved ? "fill-current" : ""} aria-hidden />
      {saved ? "Saved" : "Save species"}
    </Button>
  );
}
