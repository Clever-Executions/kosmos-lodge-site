/**
 * Non-destructive: adds the guest-reviews fields to the existing `homePage`
 * singleton WITHOUT re-seeding or overwriting anything you've edited in Sanity.
 *
 * Unlike scripts/seed.mjs (which uses createOrReplace and would wipe your edits),
 * this uses a patch with `setIfMissing`, so it ONLY fills review fields that are
 * currently empty. Run it once if you'd rather store these values in Sanity than
 * rely on the site's built-in fallbacks. Re-running it is safe — it never clobbers
 * data you've since entered in the Studio.
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=xxx \
 *   PUBLIC_SANITY_PROJECT_ID=j7q2a1is PUBLIC_SANITY_DATASET=production \
 *   node scripts/add-reviews.mjs
 *
 * (The site renders these same defaults even if you never run this — the script
 *  is only for making the values editable in the Studio.)
 */
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET ?? 'production',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2026-06-03',
});

// Live Google Maps figures for Kosmos Lodge + real 5-star guest reviews.
const REVIEW_DATA = {
  reviewsLabel: 'Guest Reviews',
  reviewsHeading: 'Loved by Our Guests',
  reviewsIntro:
    'Real words from guests who have woken up to the Hartbeespoort Dam from their balcony.',
  googleRating: 4.5,
  googleReviewCount: 128,
  yearsOperating: 11,
  googleReviewsUrl: 'https://www.google.com/maps/search/?api=1&query=Kosmos+Lodge+Hartbeespoort',
  reviews: [
    { _type: 'object', _key: 'rev-zack',   quote: 'One of the best locations around the dam — luxurious rooms and friendly staff. Highly recommend!', author: 'Zack de Beer', context: 'Couple · Holiday', rating: 5 },
    { _type: 'object', _key: 'rev-matilda', quote: 'Amazing views, luxurious rooms and great hosts. The views of the dam from the balcony are amazing and the owner is very professional and helpful.', author: 'Matilda Twala', context: 'Google review', rating: 5 },
    { _type: 'object', _key: 'rev-esther',  quote: 'Beautiful place! Choose the upstairs balcony room for a view over the dam to die for.', author: 'Esther R', context: 'Google review', rating: 5 },
    { _type: 'object', _key: 'rev-kirstan', quote: 'The reservation process was extremely quick and easy, and the room and bathroom are modern and spotlessly clean.', author: 'Kirstan', context: 'Google review', rating: 5 },
    { _type: 'object', _key: 'rev-liesie',  quote: 'The rooms were beautiful, but the best of all was the location and the great views over the dam.', author: 'Liesie', context: 'Google review', rating: 5 },
    { _type: 'object', _key: 'rev-karin',   quote: 'A true 5-star experience — modern, clean and peaceful, with a wonderful atmosphere.', author: 'Karin W', context: 'Google review', rating: 5 },
    { _type: 'object', _key: 'rev-eemblond', quote: 'Beautiful and luxurious room with the most breathtaking views over the dam. The best views in town!', author: 'Eemblond Tours', context: 'Google review', rating: 5 },
  ],
};

async function run() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('✖ SANITY_API_WRITE_TOKEN is required (generate one at sanity.io/manage).');
    process.exit(1);
  }
  console.log('Patching homePage with review fields (setIfMissing — non-destructive)…');
  await client
    .patch('homePage')
    .setIfMissing(REVIEW_DATA)
    .commit();
  console.log('  ✓ Done. Existing homePage content was left untouched.');
  console.log('  Edit any of these later in Studio → Homepage → Reviews.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
