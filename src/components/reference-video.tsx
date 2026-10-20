import { ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { copy } from "@/copy";
import type { ReferenceVideo as Video } from "@/packages/library";

const PLATFORM_LABEL: Record<Video["platform"], string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  instagram: "Instagram",
  other: "situs aslinya",
};

/** YouTube id from watch, short and youtu.be urls. */
function youtubeId(url: string): string | null {
  const u = new URL(url);
  if (u.hostname.endsWith("youtu.be")) return u.pathname.slice(1) || null;
  if (u.pathname.startsWith("/shorts/") || u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] ?? null;
  return u.searchParams.get("v");
}

/** YouTube embeds (privacy-enhanced, at the start time); every other platform is an external link. */
export function ReferenceVideo({ video, title }: { video: Video; title: string }) {
  const id = video.platform === "youtube" ? youtubeId(video.url) : null;
  if (id) {
    const start = video.startSeconds ? `?start=${video.startSeconds}` : "";
    return (
      <div className="aspect-video overflow-hidden rounded-xl border">
        <iframe
          className="size-full"
          src={`https://www.youtube-nocookie.com/embed/${id}${start}`}
          title={title}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <a href={video.url} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline" })}>
      <ExternalLink /> {copy.exercise.openVideo(PLATFORM_LABEL[video.platform])}
    </a>
  );
}
