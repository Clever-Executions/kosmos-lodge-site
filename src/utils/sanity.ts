import { sanityClient } from 'sanity:client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Local fallback images for activities that don't have a Sanity image yet.
// Keyed by activity slug. As soon as an image is uploaded for the activity in
// the Studio, that Sanity image takes precedence and the fallback is ignored.
const ACTIVITY_FALLBACK_IMG: Record<string, string> = {
  waterfront: '/assets/images/activities/waterfront.jpg',
  balloon: '/assets/images/activities/balloon.jpg',
  sanctuary: '/assets/images/activities/sanctuary.jpg',
  cableway: '/assets/images/activities/cableway.jpg',
  safari: '/assets/images/activities/safari.jpg',
  windmill: '/assets/images/activities/windmill.jpg',
};

/**
 * Resolve an image URL for an activity. Tries the given Sanity image fields in
 * order; if none is set, falls back to the bundled local image for the slug.
 * Returns null if neither a Sanity image nor a local fallback exists.
 */
export function activityImage(
  activity: any,
  fields: string[] = ['cardImage', 'mainImage', 'heroImage'],
  opts: { width?: number; height?: number } = {},
): string | null {
  for (const field of fields) {
    const src = activity?.[field];
    if (src?.asset) {
      let b = urlFor(src);
      if (opts.width) b = b.width(opts.width);
      if (opts.height) b = b.height(opts.height);
      return b.url();
    }
  }
  const slug = activity?.slug?.current;
  return (slug && ACTIVITY_FALLBACK_IMG[slug]) || null;
}
