import { CMS_URL } from "@/lib/env";

interface MediaLike {
  url?: string;
  filename?: string;
  alt?: string;
}

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function joinUrl(base: string, path: string): string {
  const cleanBase = base.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

export function getMediaUrl(media: MediaLike | string | null | undefined): string {
  if (!media) return "/images/placeholder.jpg";

  if (typeof media === "string") {
    if (isAbsoluteUrl(media)) return media;

    if (media.startsWith("/images/")) {
      return media;
    }

    if (media.startsWith("/api/media/")) {
      return joinUrl(CMS_URL, media);
    }

    if (/^[a-f0-9]{24}$/i.test(media)) {
      return joinUrl(CMS_URL, `/api/media/${media}`);
    }

    return joinUrl(CMS_URL, `/api/media/file/${media}`);
  }

  if (media.url) {
    if (isAbsoluteUrl(media.url)) return media.url;

    return joinUrl(CMS_URL, media.url);
  }

  if (media.filename) {
    return joinUrl(CMS_URL, `/api/media/file/${media.filename}`);
  }

  return "/images/placeholder.jpg";
}